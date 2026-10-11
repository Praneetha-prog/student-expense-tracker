package com.example.expensetracker;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;

@Repository
public class ExpenseDao {
    private final JdbcTemplate jdbc;
    public ExpenseDao(JdbcTemplate jdbc) { this.jdbc = jdbc; }

    private final RowMapper<Expense> rowMapper = (rs, rowNum) -> new Expense(
        rs.getLong("id"), rs.getString("description"), rs.getBigDecimal("amount"),
        rs.getString("category"), rs.getDate("expense_date").toLocalDate()
    );

    public List<Expense> findAll() {
        return jdbc.query("SELECT id, description, amount, category, expense_date FROM expense ORDER BY expense_date DESC, id DESC", rowMapper);
    }

    public Expense insert(ExpenseInput input) {
        String sql = "INSERT INTO expense (description, amount, category, expense_date) VALUES (?, ?, ?, ?)";
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbc.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, input.getDescription().trim());
            ps.setBigDecimal(2, input.getAmount());
            ps.setString(3, input.getCategory());
            ps.setDate(4, Date.valueOf(input.getDate()));
            return ps;
        }, keyHolder);
        Number key = keyHolder.getKey();
        return new Expense(key == null ? 0 : key.longValue(), input.getDescription().trim(), input.getAmount(), input.getCategory(), input.getDate());
    }

    public boolean delete(long id) {
        return jdbc.update("DELETE FROM expense WHERE id = ?", id) > 0;
    }
}
