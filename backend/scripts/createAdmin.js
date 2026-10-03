require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('../database');

const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;

if (!email || !password) {
  console.error('Не заданы ADMIN_EMAIL и/или ADMIN_PASSWORD в .env');
  process.exit(1);
}

if (password.length < 12) {
  console.error('Пароль должен быть минимум 12 символов');
  process.exit(1);
}

bcrypt.hash(password, 12, (err, hash) => {
  if (err) {
    console.error('Ошибка хеширования:', err);
    process.exit(1);
  }

  db.run(
    'INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)',
    [email, hash, 'admin'],
    function (err) {
      if (err) {
        if (err.message.includes('UNIQUE')) {
          console.error('Пользователь с таким email уже существует');
          process.exit(1);
        }
        console.error('Ошибка вставки:', err.message);
        process.exit(1);
      }
      console.log(`Админ создан: ${email} (id=${this.lastID})`);
      process.exit(0);
    }
  );
});