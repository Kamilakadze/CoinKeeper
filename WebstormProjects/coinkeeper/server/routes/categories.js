const express = require('express');
const { db } = require('../database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Protect all routes
router.use(authMiddleware);

// Get all categories for user
router.get('/', (req, res) => {
  const userId = req.user.userId;

  db.all(
    'SELECT * FROM categories WHERE user_id = ? ORDER BY created_at DESC',
    [userId],
    (err, categories) => {
      if (err) {
        return res.status(500).json({ message: 'Error fetching categories' });
      }
      res.json(categories);
    }
  );
});

// Create new category
router.post('/', (req, res) => {
  const { name } = req.body;
  const userId = req.user.userId;

  if (!name) {
    return res.status(400).json({ message: 'Category name is required' });
  }

  db.run(
    'INSERT INTO categories (user_id, name) VALUES (?, ?)',
    [userId, name],
    function (err) {
      if (err) {
        return res.status(500).json({ message: 'Error creating category' });
      }

      res.status(201).json({
        id: this.lastID,
        user_id: userId,
        name,
      });
    }
  );
});

// Update category
router.put('/:id', (req, res) => {
  const { name } = req.body;
  const { id } = req.params;
  const userId = req.user.userId;

  if (!name) {
    return res.status(400).json({ message: 'Category name is required' });
  }

  db.run(
    'UPDATE categories SET name = ? WHERE id = ? AND user_id = ?',
    [name, id, userId],
    function (err) {
      if (err) {
        return res.status(500).json({ message: 'Error updating category' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ message: 'Category not found' });
      }

      res.json({
        id: parseInt(id),
        user_id: userId,
        name,
      });
    }
  );
});

// Delete category
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  db.run(
    'DELETE FROM categories WHERE id = ? AND user_id = ?',
    [id, userId],
    function (err) {
      if (err) {
        return res.status(500).json({ message: 'Error deleting category' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ message: 'Category not found' });
      }

      res.json({ message: 'Category deleted successfully' });
    }
  );
});

module.exports = router; 