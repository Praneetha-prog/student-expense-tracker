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

## Architecture and Design

The Student Expense Tracker follows a simple **three-layer architecture** with a browser-based frontend, a Spring Boot backend, and a database layer.

### Architecture Overview

```text
+------------------------------------------------------+
|                    USER / BROWSER                    |
|                                                      |
|              HTML + CSS + JavaScript                 |
|  - Expense form                                      |
|  - Expense table                                     |
|  - Date filtering                                    |
|  - Total calculation                                 |
+--------------------------+---------------------------+
                           |
                           | HTTP / JSON
                           | REST API
                           v
+------------------------------------------------------+
|                 SPRING BOOT BACKEND                  |
|                                                      |
|  ExpenseController                                   |
|  - Handles REST API requests                         |
|  - Validates input                                   |
|  - Sends responses to the frontend                  |
|                                                      |
|  Expense / ExpenseInput                              |
|  - Represents expense data                           |
|                                                      |
|  ExpenseDao                                          |
|  - Database access                                   |
|  - Executes SQL using JDBC                           |
+--------------------------+---------------------------+
                           |
                           | JDBC
                           | SQL
                           v
+------------------------------------------------------+
|                    H2 DATABASE                       |
|                                                      |
|  expense table                                       |
|  - Stores expense records                            |
|  - File-backed persistence                            |
+------------------------------------------------------+
```

### Components and Responsibilities

| Component | Responsibility |
|---|---|
| **HTML (`index.html`)** | Provides the expense form, table, buttons, and page structure |
| **CSS (`style.css`)** | Controls the layout, spacing, colors, tables, buttons, and overall appearance |
| **JavaScript (`app.js`)** | Collects form data, sends REST API requests using `fetch()`, displays expenses, applies date filtering, and calculates the displayed total |
| **ExpenseController** | Exposes REST endpoints, receives requests from JavaScript, validates input, and coordinates application operations |
| **Expense** | Represents an expense record used by the backend |
| **ExpenseInput** | Represents and transfers expense input received from the frontend |
| **ExpenseDao** | Handles database operations using JDBC and SQL |
| **`schema.sql`** | Defines the H2 database table structure |
| **`application.properties`** | Contains application and database configuration |
| **H2 Database** | Stores expense records persistently in a local file |
| **Maven / `pom.xml`** | Manages project dependencies and builds the application |

### Request and Data Flow

The application follows this flow when an expense is added:

```text
User enters expense
        |
        v
HTML form
        |
        v
JavaScript collects input
        |
        v
POST /api/expenses
        |
        v
ExpenseController
        |
        | Validate input
        v
ExpenseDao
        |
        | JDBC + PreparedStatement
        v
H2 Database
        |
        | Saved expense
        v
JavaScript receives response
        |
        v
Expense table and total are updated
```

For viewing expenses, JavaScript sends a `GET` request to `/api/expenses`. The controller calls the DAO, the DAO retrieves records from H2 using SQL, and the returned JSON is displayed in the browser.

For deletion, JavaScript sends a `DELETE` request containing the expense ID. The controller passes the operation to the DAO, which executes the corresponding SQL `DELETE` statement. The frontend then refreshes the displayed records and total.

### Design Approach

The project uses a **separation of concerns** approach:

- The **frontend** is responsible for presentation and user interaction.
- The **controller** is responsible for handling HTTP requests and validation.
- The **DAO** is responsible for database communication.
- The **database** is responsible for persistent storage.

This keeps the code organized and makes individual parts easier to understand, test, and modify.

### Database Design

The application uses a file-backed H2 database with an `expense` table. Expense amounts are stored as decimal values, while Java uses `BigDecimal` for monetary values.

The main expense data includes:

- Expense ID
- Description
- Amount
- Category
- Expense date

The database is file-backed, so records remain available after the Spring Boot application is stopped and started again.

### API Design

The backend provides REST endpoints for the main CRUD-related operations implemented by the project:

```text
GET     /api/expenses
POST    /api/expenses
DELETE  /api/expenses/{id}
```

The API uses JSON for communication between the JavaScript frontend and Spring Boot backend.

### Security and Data Handling

The application uses `PreparedStatement` placeholders for user-provided values when executing SQL. This helps separate SQL commands from input data. JDBC resources are managed using try-with-resources so that database connections and statements are properly closed.

The project is intended for local learning use and does not currently implement authentication, authorization, or cloud deployment.

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

```bash
java -version
javac -version
```

### 2. Open the project

Open the `expense-tracker` folder in Visual Studio Code. Make sure the folder contains `pom.xml`.

### 3. Build the project

Run the following command in the terminal:

```bash
C:\Tools\apache-maven-3.10.0\bin\mvn.cmd clean package
```

### 4. Start the application

```bash
C:\Tools\apache-maven-3.10.0\bin\mvn.cmd spring-boot:run
```

Keep the terminal open while using the application.

### 5. Open the application

Visit:

[http://localhost:8080](http://localhost:8080)

## REST API Endpoints

| **Method** | **Endpoint**         | **Description**         |
| ---------- | -------------------- | ----------------------- |
| GET        | `/api/expenses`      | Retrieve all expenses   |
| POST       | `/api/expenses`      | Add a new expense       |
| DELETE     | `/api/expenses/{id}` | Delete an expense by ID |

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

[http://localhost:8080/h2-console](http://localhost:8080/h2-console)

Example SQL query:

```sql
SELECT * FROM expense ORDER BY expense_date DESC;
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
- Applying separation of concerns through frontend, controller, and DAO layers
- Designing a simple REST-based full-stack application

## Scope

This is a local learning project designed to demonstrate full-stack development with Java and JDBC. It is intended for a single local user and does not include authentication or cloud deployment.
