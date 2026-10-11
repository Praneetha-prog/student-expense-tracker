package com.example.expensetracker;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {
    private final ExpenseDao dao;
    public ExpenseController(ExpenseDao dao) { this.dao = dao; }

    @GetMapping
    public List<Expense> getExpenses() { return dao.findAll(); }

    @PostMapping
    public ResponseEntity<?> addExpense(@RequestBody ExpenseInput input) {
        if (input.getDescription() == null || input.getDescription().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Description is required."));
        }
        if (input.getDescription().trim().length() > 100) {
            return ResponseEntity.badRequest().body(Map.of("error", "Description must be 100 characters or fewer."));
        }
        if (input.getAmount() == null || input.getAmount().signum() <= 0 || input.getAmount().scale() > 2) {
            return ResponseEntity.badRequest().body(Map.of("error", "Amount must be positive and have at most 2 decimal places."));
        }
        if (input.getCategory() == null || input.getCategory().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Choose a category."));
        }
        if (input.getDate() == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Date is required."));
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(dao.insert(input));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteExpense(@PathVariable long id) {
        if (id <= 0) return ResponseEntity.badRequest().body(Map.of("error", "Invalid expense ID."));
        if (!dao.delete(id)) return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Expense not found."));
        return ResponseEntity.noContent().build();
    }
}
