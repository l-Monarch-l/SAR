const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database');

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';
const JWT_EXPIRES_IN = '24h';

// ==================== РЕГИСТРАЦИЯ ====================
// POST /api/auth/register
// Body: { email, password }
router.post('/register', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Нужны email и password' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Пароль должен быть минимум 6 символов' });
  }

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      return res.status(500).json({ error: 'Ошибка хеширования пароля' });
    }

    db.run(
      'INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)',
      [email, hash, 'reader'],
      function (err) {
        if (err) {
          if (err.message.includes('UNIQUE')) {
            return res.status(409).json({ error: 'Email уже занят' });
          }
          return res.status(500).json({ error: err.message });
        }

        res.status(201).json({
          id: this.lastID,
          email,
          role: 'reader'
        });
      }
    );
  });
});

// ==================== ЛОГИН ====================
// POST /api/auth/login
// Body: { email, password }
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Нужны email и password' });
  }

  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!user) {
      return res.status(401).json({ error: 'Неверный email или пароль' });
    }

    bcrypt.compare(password, user.password_hash, (err, isMatch) => {
      if (err) {
        return res.status(500).json({ error: 'Ошибка проверки пароля' });
      }
      if (!isMatch) {
        return res.status(401).json({ error: 'Неверный email или пароль' });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      res.json({
        token,
        user: { id: user.id, email: user.email, role: user.role }
      });
    });
  });
});

// ==================== ТЕКУЩИЙ ПОЛЬЗОВАТЕЛЬ ====================
// GET /api/auth/me — возвращает данные пользователя по токену
const { authMiddleware } = require('../middleware/auth');
router.get('/me', authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;