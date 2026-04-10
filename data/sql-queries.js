// data/sql-queries.js

const sqlQueries = [
    {
        id: 1,
        description: "Select all employees from the 'employees' table",
        query: "SELECT ___ FROM employees",
        blanks: ["*"],
        solutions: ["*", "ALL", "employees.*"],
        explanation: "SELECT * FROM table_name selects all columns from the specified table."
    },
    {
        id: 2,
        description: "Select employees with salary greater than 50000",
        query: "SELECT * FROM employees WHERE salary ___ 50000",
        blanks: [">"],
        solutions: [">", ">=", "> 50000"],
        explanation: "WHERE clause with > operator filters records where salary is greater than 50000."
    },
    {
        id: 3,
        description: "Select employees sorted by last name in ascending order",
        query: "SELECT * FROM employees ORDER BY last_name ___",
        blanks: ["ASC"],
        solutions: ["ASC", "ASCENDING", "ASC NULLS LAST"],
        explanation: "ORDER BY ASC sorts results in ascending order (A to Z, smallest to largest)."
    },
    {
        id: 4,
        description: "Count the number of employees in each department",
        query: "SELECT department, COUNT(*) FROM employees GROUP BY ___",
        blanks: ["department"],
        solutions: ["department", "dept", "dept_id"],
        explanation: "GROUP BY groups rows that have the same values in specified columns."
    },
    {
        id: 5,
        description: "Join employees and departments tables",
        query: "SELECT * FROM employees INNER JOIN departments ON employees.dept_id = departments.___",
        blanks: ["id"],
        solutions: ["id", "dept_id", "department_id"],
        explanation: "INNER JOIN combines rows from two tables based on a related column."
    },
    {
        id: 6,
        description: "Insert a new employee record",
        query: "INSERT INTO employees (name, age) ___ ('John Doe', 30)",
        blanks: ["VALUES"],
        solutions: ["VALUES", "VALUE"],
        explanation: "INSERT INTO table (columns) VALUES (values) adds new records to a table."
    },
    {
        id: 7,
        description: "Update employee's salary",
        query: "UPDATE employees SET salary = 60000 ___ name = 'John Doe'",
        blanks: ["WHERE"],
        solutions: ["WHERE"],
        explanation: "UPDATE with WHERE clause specifies which records to update."
    },
    {
        id: 8,
        description: "Delete employees older than 65",
        query: "DELETE FROM employees ___ age > 65",
        blanks: ["WHERE"],
        solutions: ["WHERE"],
        explanation: "DELETE with WHERE clause removes specific records; without WHERE, all records are deleted!"
    },
    {
        id: 9,
        description: "Find employees with names starting with 'A'",
        query: "SELECT * FROM employees WHERE name LIKE '___%'",
        blanks: ["A"],
        solutions: ["A", "a"],
        explanation: "LIKE with pattern matching: '%' matches any sequence of characters."
    },
    {
        id: 10,
        description: "Select distinct department names",
        query: "SELECT ___ department FROM employees",
        blanks: ["DISTINCT"],
        solutions: ["DISTINCT"],
        explanation: "DISTINCT eliminates duplicate values from the result set."
    },
    {
        id: 11,
        description: "Find average salary of employees",
        query: "SELECT ___ (salary) FROM employees",
        blanks: ["AVG"],
        solutions: ["AVG", "AVERAGE"],
        explanation: "AVG() aggregate function returns the average of a numeric column."
    },
    {
        id: 12,
        description: "Get total number of employees",
        query: "SELECT ___ (*) FROM employees",
        blanks: ["COUNT"],
        solutions: ["COUNT"],
        explanation: "COUNT() returns the number of rows that match the specified criteria."
    },
    {
        id: 13,
        description: "Find maximum salary",
        query: "SELECT ___ (salary) FROM employees",
        blanks: ["MAX"],
        solutions: ["MAX", "MAXIMUM"],
        explanation: "MAX() returns the largest value in a column."
    },
    {
        id: 14,
        description: "Find minimum salary",
        query: "SELECT ___ (salary) FROM employees",
        blanks: ["MIN"],
        solutions: ["MIN", "MINIMUM"],
        explanation: "MIN() returns the smallest value in a column."
    },
    {
        id: 15,
        description: "Get employees with salary between 40000 and 60000",
        query: "SELECT * FROM employees WHERE salary ___ 40000 AND 60000",
        blanks: ["BETWEEN"],
        solutions: ["BETWEEN"],
        explanation: "BETWEEN operator selects values within a given range."
    },
    {
        id: 16,
        description: "Find employees in specific departments",
        query: "SELECT * FROM employees WHERE dept_id IN (1, 2, ___)",
        blanks: ["3"],
        solutions: ["3", "4", "5"],
        explanation: "IN operator allows you to specify multiple values in a WHERE clause."
    },
    {
        id: 17,
        description: "Left join to include all employees even without departments",
        query: "SELECT * FROM employees ___ JOIN departments ON employees.dept_id = departments.id",
        blanks: ["LEFT"],
        solutions: ["LEFT", "LEFT OUTER"],
        explanation: "LEFT JOIN returns all records from the left table, even if no matches in right table."
    },
    {
        id: 18,
        description: "Alias the employees table as 'e'",
        query: "SELECT * FROM employees ___ e",
        blanks: ["AS"],
        solutions: ["AS"],
        explanation: "AS keyword is used to give a table or column a temporary name (alias)."
    },
    {
        id: 19,
        description: "Find employees hired in 2023",
        query: "SELECT * FROM employees WHERE YEAR(hire_date) = ___",
        blanks: ["2023"],
        solutions: ["2023"],
        explanation: "YEAR() function extracts the year from a date column."
    },
    {
        id: 20,
        description: "Combine results from two queries",
        query: "SELECT name FROM employees ___ SELECT name FROM managers",
        blanks: ["UNION"],
        solutions: ["UNION", "UNION ALL"],
        explanation: "UNION combines result sets of two or more SELECT statements."
    }
];

// Function to get random SQL questions
function getSQLQuestions(count = 10) {
    const shuffled = [...sqlQueries];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, count);
}