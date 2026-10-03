const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = process.env.DB_PATH || path.resolve(__dirname, 'lore.db');

const fs = require('fs');
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Ошибка подключения к БД:', err.message);
  } else {
    console.log('Подключено к SQLite базе:', dbPath);
    db.run('PRAGMA foreign_keys = ON');
    db.serialize(() => {
      // Таблица рас
      db.run(`
        CREATE TABLE IF NOT EXISTS races (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          description TEXT,
          features TEXT
        )
      `);

      // Таблица персонажей
      db.run(`
        CREATE TABLE IF NOT EXISTS characters (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          description TEXT,
          image_url TEXT,
          race_id INTEGER,
          FOREIGN KEY (race_id) REFERENCES races(id) ON DELETE SET NULL
        )
      `);

      // Таблица историй
      db.run(`
        CREATE TABLE IF NOT EXISTS stories (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          content TEXT,
          event_date TEXT
        )
      `);

      // Таблица статей
      db.run(`
        CREATE TABLE IF NOT EXISTS articles (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          content TEXT
        )
      `);

      // Таблицы связей многие-ко-многим
      db.run(`
        CREATE TABLE IF NOT EXISTS character_stories (
          character_id INTEGER,
          story_id INTEGER,
          PRIMARY KEY (character_id, story_id),
          FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE,
          FOREIGN KEY (story_id) REFERENCES stories(id) ON DELETE CASCADE
        )
      `);

      db.run(`
        CREATE TABLE IF NOT EXISTS character_articles (
          character_id INTEGER,
          article_id INTEGER,
          PRIMARY KEY (character_id, article_id),
          FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE,
          FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE
        )
      `);

      db.run(`
        CREATE TABLE IF NOT EXISTS race_stories (
          race_id INTEGER,
          story_id INTEGER,
          PRIMARY KEY (race_id, story_id),
          FOREIGN KEY (race_id) REFERENCES races(id) ON DELETE CASCADE,
          FOREIGN KEY (story_id) REFERENCES stories(id) ON DELETE CASCADE
        )
      `);

      db.run(`
        CREATE TABLE IF NOT EXISTS race_articles (
          race_id INTEGER,
          article_id INTEGER,
          PRIMARY KEY (race_id, article_id),
          FOREIGN KEY (race_id) REFERENCES races(id) ON DELETE CASCADE,
          FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE
        )
      `);

      // Таблица связей историй со статьями
      db.run(`
        CREATE TABLE IF NOT EXISTS story_articles (
          story_id INTEGER,
          article_id INTEGER,
          PRIMARY KEY (story_id, article_id),
          FOREIGN KEY (story_id) REFERENCES stories(id) ON DELETE CASCADE,
          FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE
        )
      `);

      // Таблица пользователей
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          role TEXT NOT NULL DEFAULT 'reader',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);
      
      console.log('Таблицы созданы или уже существуют.');
    });
  }
});

module.exports = db;