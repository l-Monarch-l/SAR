const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Путь к файлу базы данных (он создастся автоматически)
const dbPath = path.resolve(__dirname, 'lore.db');

// Открываем соединение с базой
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Ошибка подключения к БД:', err.message);
  } else {
    console.log('Подключено к SQLite базе.');
    // Создаём таблицы, если их нет
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

      console.log('Таблицы созданы или уже существуют.');
    });
  }
});

module.exports = db;