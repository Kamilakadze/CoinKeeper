const express = require('express');
const { db } = require('../database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Protect all routes
router.use(authMiddleware);

// Get all transactions for user
router.get('/', (req, res) => {
  const userId = req.user.userId;
  const { startDate, endDate, type, categoryId } = req.query;

  let query = `
    SELECT t.*, c.name as category_name 
    FROM transactions t
    LEFT JOIN categories c ON t.category_id = c.id
    WHERE t.user_id = ?
  `;
  const params = [userId];

  if (startDate) {
    query += ' AND t.date >= ?';
    params.push(startDate);
  }
  if (endDate) {
    query += ' AND t.date <= ?';
    params.push(endDate);
  }
  if (type) {
    query += ' AND t.type = ?';
    params.push(type);
  }
  if (categoryId) {
    query += ' AND t.category_id = ?';
    params.push(categoryId);
  }

  query += ' ORDER BY t.date DESC';

  db.all(query, params, (err, transactions) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching transactions' });
    }
    res.json(transactions);
  });
});

// Create new transaction
router.post('/', (req, res) => {
  const { type, amount, categoryId, date, comment } = req.body;
  const userId = req.user.userId;

  console.log('Received transaction request:', {
    type,
    amount,
    categoryId,
    date,
    comment,
    userId
  });

  // Базовая валидация
  if (!type || !amount || !date) {
    return res.status(400).json({ 
      message: 'Type, amount, and date are required' 
    });
  }

  if (type !== 'income' && type !== 'expense') {
    return res.status(400).json({ 
      message: 'Type must be either "income" or "expense"' 
    });
  }

  // Проверяем categoryId только для расходов
  if (type === 'expense' && !categoryId) {
    return res.status(400).json({ 
      message: 'Category is required for expenses' 
    });
  }

  // Для доходов categoryId всегда null
  const finalCategoryId = type === 'income' ? null : categoryId;

  const query = `
    INSERT INTO transactions 
    (user_id, category_id, type, amount, date, comment) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const params = [userId, finalCategoryId, type, amount, date, comment || ''];

  console.log('Executing query:', { query, params });

  db.run(query, params, function (err) {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ 
        message: 'Error creating transaction',
        error: err.message 
      });
    }

    // Получаем созданную транзакцию для ответа
    db.get(
      `SELECT t.*, c.name as category_name 
       FROM transactions t
       LEFT JOIN categories c ON t.category_id = c.id
       WHERE t.id = ?`,
      [this.lastID],
      (err, transaction) => {
        if (err) {
          console.error('Error fetching created transaction:', err);
          return res.status(500).json({ 
            message: 'Transaction created but failed to fetch details' 
          });
        }

        console.log('Created transaction:', transaction);
        res.status(201).json(transaction);
      }
    );
  });
});

// Update transaction
router.put('/:id', (req, res) => {
  const { type, amount, categoryId, date, comment } = req.body;
  const { id } = req.params;
  const userId = req.user.userId;

  if (!type || !amount || !categoryId || !date) {
    return res.status(400).json({ 
      message: 'Type, amount, category, and date are required' 
    });
  }

  if (type !== 'income' && type !== 'expense') {
    return res.status(400).json({ 
      message: 'Type must be either "income" or "expense"' 
    });
  }

  db.run(
    `UPDATE transactions 
     SET type = ?, amount = ?, category_id = ?, date = ?, comment = ?
     WHERE id = ? AND user_id = ?`,
    [type, amount, categoryId, date, comment || '', id, userId],
    function (err) {
      if (err) {
        return res.status(500).json({ message: 'Error updating transaction' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ message: 'Transaction not found' });
      }

      res.json({
        id: parseInt(id),
        user_id: userId,
        category_id: categoryId,
        type,
        amount,
        date,
        comment: comment || '',
      });
    }
  );
});

// Delete transaction
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  db.run(
    'DELETE FROM transactions WHERE id = ? AND user_id = ?',
    [id, userId],
    function (err) {
      if (err) {
        return res.status(500).json({ message: 'Error deleting transaction' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ message: 'Transaction not found' });
      }

      res.json({ message: 'Transaction deleted successfully' });
    }
  );
});

// Get statistics
router.get('/statistics', (req, res) => {
  const userId = req.user.userId;
  const { startDate, endDate } = req.query;

  let dateCondition = '';
  const params = [userId];

  if (startDate && endDate) {
    dateCondition = 'AND date BETWEEN ? AND ?';
    params.push(startDate, endDate);
  }

  const query = `
    SELECT 
      type,
      SUM(amount) as total,
      category_id,
      c.name as category_name
    FROM transactions t
    LEFT JOIN categories c ON t.category_id = c.id
    WHERE t.user_id = ? ${dateCondition}
    GROUP BY type, category_id
    ORDER BY type, total DESC
  `;

  db.all(query, params, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching statistics' });
    }

    // Organize results by type
    const statistics = {
      income: {
        total: 0,
        byCategory: []
      },
      expense: {
        total: 0,
        byCategory: []
      }
    };

    results.forEach(row => {
      if (row.type === 'income') {
        statistics.income.total += row.total;
        statistics.income.byCategory.push({
          categoryId: row.category_id,
          categoryName: row.category_name,
          amount: row.total
        });
      } else {
        statistics.expense.total += row.total;
        statistics.expense.byCategory.push({
          categoryId: row.category_id,
          categoryName: row.category_name,
          amount: row.total
        });
      }
    });

    res.json(statistics);
  });
});

module.exports = router; 