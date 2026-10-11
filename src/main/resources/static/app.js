
const API_URL = "/api/expenses";

const form = document.getElementById("expense-form");
const list = document.getElementById("expense-list");
const totalElement = document.getElementById("total");
const message = document.getElementById("message");
const countElement = document.getElementById("expense-count");
const dateInput = document.getElementById("date");

const filterDateInput = document.getElementById("filter-date");
const filterButton = document.getElementById("filter-button");
const showAllButton = document.getElementById("show-all-button");

let allExpenses = [];
let selectedFilterDate = "";

// Get today's local date in YYYY-MM-DD format.
function getLocalDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

dateInput.value = getLocalDate();

function formatRupees(amount) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
}

function showMessage(text, success = false) {
    message.textContent = text;
    message.classList.toggle("success", success);
}

async function getErrorMessage(response) {
    try {
        const body = await response.json();
        return body.error || body.message ||
            `Request failed (${response.status}).`;
    } catch {
        return `Request failed (${response.status}).`;
    }
}

// Normalize date values for consistent filtering.
function getDateKey(value) {
    if (!value) return "";

    const text = String(value).trim();

    // Handles YYYY-MM-DD and YYYY-MM-DDTHH:mm:ss.
    const isoMatch = text.match(/^(\d{4})-(\d{2})-(\d{2})/);

    if (isoMatch) {
        return `${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}`;
    }

    // Also handles DD-MM-YYYY.
    const dmyMatch = text.match(/^(\d{2})-(\d{2})-(\d{4})$/);

    if (dmyMatch) {
        return `${dmyMatch[3]}-${dmyMatch[2]}-${dmyMatch[1]}`;
    }

    return "";
}

// Display dates as DD-MM-YYYY.
function formatDate(value) {
    const dateKey = getDateKey(value);

    if (!dateKey) return value ? String(value) : "";

    const [year, month, day] = dateKey.split("-");
    return `${day}-${month}-${year}`;
}

function addCell(row, value) {
    const cell = document.createElement("td");
    cell.textContent = value ?? "";
    row.appendChild(cell);
    return cell;
}

// Load all expenses from the Java backend.
async function loadExpenses() {
    list.innerHTML =
        '<tr><td colspan="5" class="empty-state">Loading expenses...</td></tr>';

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(await getErrorMessage(response));
        }

        const expenses = await response.json();

        if (!Array.isArray(expenses)) {
            throw new Error("The expenses API did not return a list.");
        }

        allExpenses = expenses;

        renderFilteredExpenses();
        showMessage("");
    } catch (error) {
        list.innerHTML =
            '<tr><td colspan="5" class="empty-state">Could not load expenses. Check that the Java server is running and the API is available.</td></tr>';

        totalElement.textContent = "Total spent ₹0.00";

        showMessage(
            error.message || "Could not connect to the server."
        );
    }
}

// Show only expenses matching the selected date.
function renderFilteredExpenses() {
    const filteredExpenses = selectedFilterDate
        ? allExpenses.filter(expense =>
            getDateKey(expense.date) === selectedFilterDate
        )
        : allExpenses;

    renderExpenses(filteredExpenses);
}

// Display expenses and calculate the total of visible rows.
function renderExpenses(expenses) {
    list.replaceChildren();

    let total = 0;

    countElement.textContent =
        `${expenses.length} ${expenses.length === 1 ? "record" : "records"}`;

    if (expenses.length === 0) {
        const row = document.createElement("tr");
        const cell = document.createElement("td");

        cell.colSpan = 5;
        cell.className = "empty-state";
        cell.textContent = selectedFilterDate
            ? "No expenses found for this date."
            : "No expenses yet. Add your first expense above.";

        row.appendChild(cell);
        list.appendChild(row);
    }

    // Sort by newest date first.
    const sortedExpenses = [...expenses].sort((a, b) => {
        const dateComparison = getDateKey(b.date)
            .localeCompare(getDateKey(a.date));

        if (dateComparison !== 0) {
            return dateComparison;
        }

        return Number(b.id || 0) - Number(a.id || 0);
    });

    for (const expense of sortedExpenses) {
        const amount = Number(expense.amount) || 0;
        total += amount;

        const row = document.createElement("tr");

        addCell(row, expense.description);
        addCell(row, expense.category);
        addCell(row, formatDate(expense.date));

        const amountCell = addCell(row, formatRupees(amount));
        amountCell.className = "amount-cell";

        const actionCell = document.createElement("td");
        const deleteButton = document.createElement("button");

        deleteButton.type = "button";
        deleteButton.className = "delete-button";
        deleteButton.textContent = "Delete";
        deleteButton.setAttribute(
            "aria-label",
            `Delete ${expense.description}`
        );

        deleteButton.addEventListener("click", () => {
            deleteExpense(expense.id);
        });

        actionCell.appendChild(deleteButton);
        row.appendChild(actionCell);
        list.appendChild(row);
    }

    totalElement.textContent = `Total spent ${formatRupees(total)}`;
}

// Filter button.
filterButton.addEventListener("click", () => {
    const chosenDate = filterDateInput.value;

    if (!chosenDate) {
        showMessage("Please select a date to filter.");
        return;
    }

    selectedFilterDate = chosenDate;
    renderFilteredExpenses();

    showMessage(
        `Showing expenses for ${formatDate(chosenDate)}.`,
        true
    );
});

// Restore all expenses.
showAllButton.addEventListener("click", () => {
    selectedFilterDate = "";
    filterDateInput.value = "";

    renderFilteredExpenses();
    showMessage("Showing all expenses.", true);
});

// Add a new expense.
form.addEventListener("submit", async (event) => {
    event.preventDefault();
    showMessage("");

    const expense = {
        description: document.getElementById("description").value.trim(),
        amount: Number(document.getElementById("amount").value),
        category: document.getElementById("category").value,
        date: dateInput.value
    };

    if (
        !expense.description ||
        !expense.category ||
        !expense.date ||
        !Number.isFinite(expense.amount) ||
        expense.amount <= 0
    ) {
        showMessage(
            "Please enter a description, positive amount, category and date."
        );
        return;
    }

    const submitButton = form.querySelector(
        "button[type='submit']"
    );

    submitButton.disabled = true;
    submitButton.textContent = "Saving...";

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(expense)
        });

        if (!response.ok) {
            throw new Error(await getErrorMessage(response));
        }

        form.reset();
        dateInput.value = getLocalDate();

        await loadExpenses();
        showMessage("Expense saved successfully.", true);
    } catch (error) {
        showMessage(
            error.message || "Could not save the expense."
        );
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = "Add expense";
    }
});

// Delete an expense.
async function deleteExpense(id) {
    if (id == null) {
        showMessage("This expense has no ID and cannot be deleted.");
        return;
    }

    if (!confirm("Delete this expense?")) return;

    showMessage("");

    try {
        const response = await fetch(
            `${API_URL}/${encodeURIComponent(id)}`,
            { method: "DELETE" }
        );

        if (!response.ok) {
            throw new Error(await getErrorMessage(response));
        }

        await loadExpenses();
        showMessage("Expense deleted.", true);
    } catch (error) {
        showMessage(
            error.message || "Could not delete the expense."
        );
    }
}

// Initial load.
loadExpenses();
