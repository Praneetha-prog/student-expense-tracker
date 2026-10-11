# Student Expense Tracker

A beginner-friendly full-stack web application built using Java, Spring Boot, JDBC, SQL, H2 Database, HTML, CSS, and JavaScript. It helps users record and manage daily expenses.

## Features

- Add expenses with description, amount, category, and date
- View saved expenses in a table, with the newest dates first
- Calculate and display the total amount spent in Indian Rupees (₹)
- Delete individual expenses
- Store expenses in a file-backed H2 database
- Preserve expense records after restarting the application
- Filter expenses by a selected date
- View all expenses using the **Show all dates** option
- Calculate the total for the currently displayed expenses

## Technologies Used

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Java, Spring Boot
- **Database connectivity:** JDBC
- **Database:** H2 Database
- **Build tool:** Apache Maven
- **Development environment:** Visual Studio Code

## Requirements

- Windows 10 or Windows 11
- Java Development Kit (JDK)
- Apache Maven
- Visual Studio Code (recommended)
- Internet connection for downloading dependencies when needed

## Project Structure

```text
expense-tracker/
├── src/
│   └── main/
│       ├── java/
│       │   └── com/example/expensetracker/
│       │       ├── ExpenseTrackerApplication.java
│       │       ├── Expense.java
│       │       ├── ExpenseInput.java
│       │       ├── ExpenseDao.java
│       │       └── ExpenseController.java
│       └── resources/
│           ├── application.properties
│           ├── schema.sql
│           └── static/
│               ├── index.html
│               ├── style.css
│               └── app.js
├── pom.xml
├── README.md
└── .gitignore
```

## How to Run the Project

### 1. Verify Java

Open a terminal and run:

```powershell
java -version
javac -version
```

### 2. Open the project

Open the `expense-tracker` folder in Visual Studio Code. Make sure the folder contains `pom.xml`.

### 3. Build the project

Run the following command in the terminal:

```powershell
C:\Tools\apache-maven-3.10.0\bin\mvn.cmd clean package
```

### 4. Start the application

```powershell
C:\Tools\apache-maven-3.10.0\bin\mvn.cmd spring-boot:run
```

Keep the terminal open while using the application.

### 5. Open the application

Visit:

http://localhost:8080

## REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/expenses` | Retrieve all expenses |
| POST | `/api/expenses` | Add a new expense |
| DELETE | `/api/expenses/{id}` | Delete an expense by ID |

### Example POST Request

```json
{
  "description": "Bus fare",
  "amount": 40.00,
  "category": "Travel",
  "date": "2026-10-11"
}
```

## Database Configuration

The application uses a file-backed H2 database to store expense records.

- **JDBC URL:** `jdbc:h2:file:./data/expenses`
- **Username:** `sa`
- **Password:** Leave blank, unless configured otherwise

### H2 Console

With the application running, open:

http://localhost:8080/h2-console

Example SQL query:

```sql
SELECT * FROM expense
ORDER BY expense_date DESC;
```

## Testing

The following checks can be performed:

1. Add an expense and verify that it appears in the table.
2. Add expenses with different dates and verify the total.
3. Filter expenses by a selected date.
4. Use **Show all dates** to display all saved expenses.
5. Delete an expense and verify that the total updates.
6. Refresh the browser and check that records remain.
7. Stop and restart the application and verify database persistence.

## Learning Objectives

This project demonstrates:

- Building REST APIs using Spring Boot
- Connecting Java applications to a database using JDBC
- Writing SQL queries and using prepared statements
- Handling form input and API requests with JavaScript `fetch()`
- Performing basic data validation
- Managing records with create, read, and delete operations
- Persisting data using an H2 database

## Scope

This is a local learning project designed to demonstrate full-stack development with Java and JDBC. It is intended for a single local user and does not include authentication or cloud deployment.