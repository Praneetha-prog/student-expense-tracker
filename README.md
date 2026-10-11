# Student Expense Tracker (Java REST + JDBC)

A beginner-friendly full-stack mini project based on the supplied project guide. It uses HTML, CSS, JavaScript `fetch()`, Java 17, Spring Boot, JDBC, SQL, and a file-backed H2 database.

## Requirements
- Windows 10/11
- JDK 17 (verify with `java -version` and `javac -version`)
- VS Code with Extension Pack for Java and Spring Boot Extension Pack
- Internet for the first Maven dependency download

## Run in VS Code
1. Extract the project folder.
2. Open the `expense-tracker` folder in VS Code (the folder containing `pom.xml`).
3. Open **Terminal → New Terminal**.
4. Build the project:
   ```powershell
   .\mvnw.cmd clean package
   ```
5. Start the app:
   ```powershell
   .\mvnw.cmd spring-boot:run
   ```
6. Open <http://localhost:8080> in your browser. Keep the terminal running while using the app.

The Maven wrapper (`mvnw.cmd`) is not included in this source bundle. If you generated the project through Spring Initializr, copy its `mvnw.cmd`, `.mvn/wrapper/`, and `mvnw` files into this folder. Alternatively, install Maven and run `mvn clean package` then `mvn spring-boot:run`.

## Features
- Add an expense with description, positive amount, category, and date
- View saved expenses, newest date first
- Calculate the total in the browser
- Delete an expense
- Keep records in a local H2 database file after restarting the app

## API
- `GET /api/expenses` — list expenses as JSON
- `POST /api/expenses` — create an expense using JSON
- `DELETE /api/expenses/{id}` — delete one expense

Example POST JSON:
```json
{
  "description": "Bus fare",
  "amount": 40.00,
  "category": "Travel",
  "date": "2026-10-11"
}
```

## H2 console
While the app is running, open <http://localhost:8080/h2-console>.
- JDBC URL: `jdbc:h2:file:./data/expenses`
- User Name: `sa`
- Password: leave blank

Example SQL:
```sql
SELECT * FROM expense ORDER BY expense_date DESC;
```

## Folder structure
```text
src/main/java/com/example/expensetracker/
  ExpenseTrackerApplication.java
  Expense.java
  ExpenseInput.java
  ExpenseDao.java
  ExpenseController.java
src/main/resources/
  application.properties
  schema.sql
  static/index.html
  static/style.css
  static/app.js
```

## Notes
- `DECIMAL(12,2)` and Java `BigDecimal` are used for money.
- SQL values are passed through prepared statements.
- This is a local learning project, not a production finance application.
