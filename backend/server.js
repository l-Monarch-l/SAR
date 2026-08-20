const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// ==================== ПЕРСОНАЖИ ====================

// GET /api/characters - список всех персонажей (кратко)
app.get('/api/characters', (req, res) => {
  db.all('SELECT id, name, description, image_url, race_id FROM characters', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// GET /api/characters/:id - полная информация о персонаже (с расой, историями, статьями)
app.get('/api/characters/:id', (req, res) => {
  const id = req.params.id;
  db.get('SELECT * FROM characters WHERE id = ?', [id], (err, character) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!character) {
      return res.status(404).json({ error: 'Персонаж не найден' });
    }

    // Получаем расу
    db.get('SELECT * FROM races WHERE id = ?', [character.race_id], (err, race) => {
      character.race = race || null;

      // Получаем связанные истории
      db.all(`
        SELECT s.* FROM stories s
        JOIN character_stories cs ON s.id = cs.story_id
        WHERE cs.character_id = ?
      `, [id], (err, stories) => {
        character.stories = stories || [];

        // Получаем связанные статьи
        db.all(`
          SELECT a.* FROM articles a
          JOIN character_articles ca ON a.id = ca.article_id
          WHERE ca.character_id = ?
        `, [id], (err, articles) => {
          character.articles = articles || [];
          res.json(character);
        });
      });
    });
  });
});

// POST /api/characters - создать персонажа (принимает также массивы story_ids, article_ids)
app.post('/api/characters', (req, res) => {
  const { name, description, image_url, race_id, story_ids, article_ids } = req.body;

  db.run(
    'INSERT INTO characters (name, description, image_url, race_id) VALUES (?, ?, ?, ?)',
    [name, description, image_url, race_id || null],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      const characterId = this.lastID;

      // Добавляем связи с историями
      if (story_ids && story_ids.length) {
        const stmt = db.prepare('INSERT INTO character_stories (character_id, story_id) VALUES (?, ?)');
        story_ids.forEach(sid => stmt.run(characterId, sid));
        stmt.finalize();
      }

      // Добавляем связи со статьями
      if (article_ids && article_ids.length) {
        const stmt = db.prepare('INSERT INTO character_articles (character_id, article_id) VALUES (?, ?)');
        article_ids.forEach(aid => stmt.run(characterId, aid));
        stmt.finalize();
      }

      res.status(201).json({ id: characterId });
    }
  );
});

// PUT /api/characters/:id - обновить персонажа
app.put('/api/characters/:id', (req, res) => {
  const id = req.params.id;
  const { name, description, image_url, race_id, story_ids, article_ids } = req.body;

  db.run(
    'UPDATE characters SET name = ?, description = ?, image_url = ?, race_id = ? WHERE id = ?',
    [name, description, image_url, race_id || null, id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      // Обновляем связи с историями: удалить старые, добавить новые
      db.run('DELETE FROM character_stories WHERE character_id = ?', [id], () => {
        if (story_ids && story_ids.length) {
          const stmt = db.prepare('INSERT INTO character_stories (character_id, story_id) VALUES (?, ?)');
          story_ids.forEach(sid => stmt.run(id, sid));
          stmt.finalize();
        }
      });

      // Обновляем связи со статьями
      db.run('DELETE FROM character_articles WHERE character_id = ?', [id], () => {
        if (article_ids && article_ids.length) {
          const stmt = db.prepare('INSERT INTO character_articles (character_id, article_id) VALUES (?, ?)');
          article_ids.forEach(aid => stmt.run(id, aid));
          stmt.finalize();
        }
      });

      res.json({ updated: true });
    }
  );
});

// DELETE /api/characters/:id
app.delete('/api/characters/:id', (req, res) => {
  const id = req.params.id;
  db.run('DELETE FROM characters WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ deleted: true });
  });
});

// ==================== РАСЫ ====================

// GET /api/races - список всех рас
app.get('/api/races', (req, res) => {
  db.all('SELECT id, name, description, features FROM races', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// GET /api/races/:id - полная информация о расе (с историями, статьями, персонажами)
app.get('/api/races/:id', (req, res) => {
  const id = req.params.id;
  db.get('SELECT * FROM races WHERE id = ?', [id], (err, race) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!race) {
      return res.status(404).json({ error: 'Раса не найдена' });
    }

    // Получаем связанные истории
    db.all(`
      SELECT s.* FROM stories s
      JOIN race_stories rs ON s.id = rs.story_id
      WHERE rs.race_id = ?
    `, [id], (err, stories) => {
      race.stories = stories || [];

      // Получаем связанные статьи
      db.all(`
        SELECT a.* FROM articles a
        JOIN race_articles ra ON a.id = ra.article_id
        WHERE ra.race_id = ?
      `, [id], (err, articles) => {
        race.articles = articles || [];

        // Получаем связанных персонажей (опционально)
        db.all('SELECT id, name FROM characters WHERE race_id = ?', [id], (err, characters) => {
          race.characters = characters || [];
          res.json(race);
        });
      });
    });
  });
});

// POST /api/races - создать расу
app.post('/api/races', (req, res) => {
  const { name, description, features, story_ids, article_ids } = req.body;

  db.run(
    'INSERT INTO races (name, description, features) VALUES (?, ?, ?)',
    [name, description, features],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      const raceId = this.lastID;

      if (story_ids && story_ids.length) {
        const stmt = db.prepare('INSERT INTO race_stories (race_id, story_id) VALUES (?, ?)');
        story_ids.forEach(sid => stmt.run(raceId, sid));
        stmt.finalize();
      }

      if (article_ids && article_ids.length) {
        const stmt = db.prepare('INSERT INTO race_articles (race_id, article_id) VALUES (?, ?)');
        article_ids.forEach(aid => stmt.run(raceId, aid));
        stmt.finalize();
      }

      res.status(201).json({ id: raceId });
    }
  );
});

// PUT /api/races/:id - обновить расу
app.put('/api/races/:id', (req, res) => {
  const id = req.params.id;
  const { name, description, features, story_ids, article_ids } = req.body;

  db.run(
    'UPDATE races SET name = ?, description = ?, features = ? WHERE id = ?',
    [name, description, features, id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      db.run('DELETE FROM race_stories WHERE race_id = ?', [id], () => {
        if (story_ids && story_ids.length) {
          const stmt = db.prepare('INSERT INTO race_stories (race_id, story_id) VALUES (?, ?)');
          story_ids.forEach(sid => stmt.run(id, sid));
          stmt.finalize();
        }
      });

      db.run('DELETE FROM race_articles WHERE race_id = ?', [id], () => {
        if (article_ids && article_ids.length) {
          const stmt = db.prepare('INSERT INTO race_articles (race_id, article_id) VALUES (?, ?)');
          article_ids.forEach(aid => stmt.run(id, aid));
          stmt.finalize();
        }
      });

      res.json({ updated: true });
    }
  );
});

// DELETE /api/races/:id
app.delete('/api/races/:id', (req, res) => {
  const id = req.params.id;
  db.run('DELETE FROM races WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ deleted: true });
  });
});

// ==================== ИСТОРИИ ====================

// GET /api/stories - список всех историй
app.get('/api/stories', (req, res) => {
  db.all('SELECT id, title, event_date FROM stories', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// GET /api/stories/:id - полная информация об истории (с персонажами, расами, статьями)
app.get('/api/stories/:id', (req, res) => {
  const id = req.params.id;
  db.get('SELECT * FROM stories WHERE id = ?', [id], (err, story) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!story) {
      return res.status(404).json({ error: 'История не найдена' });
    }

    // Персонажи, участвующие в истории
    db.all(`
      SELECT c.id, c.name FROM characters c
      JOIN character_stories cs ON c.id = cs.character_id
      WHERE cs.story_id = ?
    `, [id], (err, characters) => {
      story.characters = characters || [];

      // Расы, участвующие в истории
      db.all(`
        SELECT r.id, r.name FROM races r
        JOIN race_stories rs ON r.id = rs.race_id
        WHERE rs.story_id = ?
      `, [id], (err, races) => {
        story.races = races || [];

        // Статьи, связанные с историей
        db.all(`
          SELECT a.id, a.title FROM articles a
          JOIN story_articles sa ON a.id = sa.article_id
          WHERE sa.story_id = ?
        `, [id], (err, articles) => {
          story.articles = articles || [];
          res.json(story);
        });
      });
    });
  });
});

// POST /api/stories - создать историю (принимает массивы character_ids, race_ids, article_ids)
app.post('/api/stories', (req, res) => {
  const { title, content, event_date, character_ids, race_ids, article_ids } = req.body;

  db.run(
    'INSERT INTO stories (title, content, event_date) VALUES (?, ?, ?)',
    [title, content, event_date],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      const storyId = this.lastID;

      if (character_ids && character_ids.length) {
        const stmt = db.prepare('INSERT INTO character_stories (character_id, story_id) VALUES (?, ?)');
        character_ids.forEach(cid => stmt.run(cid, storyId));
        stmt.finalize();
      }

      if (race_ids && race_ids.length) {
        const stmt = db.prepare('INSERT INTO race_stories (race_id, story_id) VALUES (?, ?)');
        race_ids.forEach(rid => stmt.run(rid, storyId));
        stmt.finalize();
      }

      if (article_ids && article_ids.length) {
        const stmt = db.prepare('INSERT INTO story_articles (story_id, article_id) VALUES (?, ?)');
        article_ids.forEach(aid => stmt.run(storyId, aid));
        stmt.finalize();
      }

      res.status(201).json({ id: storyId });
    }
  );
});

// PUT /api/stories/:id - обновить историю
app.put('/api/stories/:id', (req, res) => {
  const id = req.params.id;
  const { title, content, event_date, character_ids, race_ids, article_ids } = req.body;

  db.run(
    'UPDATE stories SET title = ?, content = ?, event_date = ? WHERE id = ?',
    [title, content, event_date, id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      // Обновляем связи с персонажами
      db.run('DELETE FROM character_stories WHERE story_id = ?', [id], () => {
        if (character_ids && character_ids.length) {
          const stmt = db.prepare('INSERT INTO character_stories (character_id, story_id) VALUES (?, ?)');
          character_ids.forEach(cid => stmt.run(cid, id));
          stmt.finalize();
        }
      });

      // Обновляем связи с расами
      db.run('DELETE FROM race_stories WHERE story_id = ?', [id], () => {
        if (race_ids && race_ids.length) {
          const stmt = db.prepare('INSERT INTO race_stories (race_id, story_id) VALUES (?, ?)');
          race_ids.forEach(rid => stmt.run(rid, id));
          stmt.finalize();
        }
      });

      // Обновляем связи со статьями
      db.run('DELETE FROM story_articles WHERE story_id = ?', [id], () => {
        if (article_ids && article_ids.length) {
          const stmt = db.prepare('INSERT INTO story_articles (story_id, article_id) VALUES (?, ?)');
          article_ids.forEach(aid => stmt.run(id, aid));
          stmt.finalize();
        }
      });

      res.json({ updated: true });
    }
  );
});

// DELETE /api/stories/:id
app.delete('/api/stories/:id', (req, res) => {
  const id = req.params.id;
  db.run('DELETE FROM stories WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ deleted: true });
  });
});

// ==================== СТАТЬИ ====================

// GET /api/articles - список всех статей
app.get('/api/articles', (req, res) => {
  db.all('SELECT id, title FROM articles', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// GET /api/articles/:id - полная информация о статье (связанные персонажи, расы, истории)
app.get('/api/articles/:id', (req, res) => {
  const id = req.params.id;
  db.get('SELECT * FROM articles WHERE id = ?', [id], (err, article) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!article) {
      return res.status(404).json({ error: 'Статья не найдена' });
    }

    // Персонажи, связанные со статьёй
    db.all(`
      SELECT c.id, c.name FROM characters c
      JOIN character_articles ca ON c.id = ca.character_id
      WHERE ca.article_id = ?
    `, [id], (err, characters) => {
      article.characters = characters || [];

      // Расы, связанные со статьёй
      db.all(`
        SELECT r.id, r.name FROM races r
        JOIN race_articles ra ON r.id = ra.race_id
        WHERE ra.article_id = ?
      `, [id], (err, races) => {
        article.races = races || [];

        // Истории, связанные со статьёй
        db.all(`
          SELECT s.id, s.title FROM stories s
          JOIN story_articles sa ON s.id = sa.story_id
          WHERE sa.article_id = ?
        `, [id], (err, stories) => {
          article.stories = stories || [];
          res.json(article);
        });
      });
    });
  });
});

// POST /api/articles - создать статью (принимает массивы character_ids, race_ids, story_ids)
app.post('/api/articles', (req, res) => {
  const { title, content, character_ids, race_ids, story_ids } = req.body;

  db.run(
    'INSERT INTO articles (title, content) VALUES (?, ?)',
    [title, content],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      const articleId = this.lastID;

      if (character_ids && character_ids.length) {
        const stmt = db.prepare('INSERT INTO character_articles (character_id, article_id) VALUES (?, ?)');
        character_ids.forEach(cid => stmt.run(cid, articleId));
        stmt.finalize();
      }

      if (race_ids && race_ids.length) {
        const stmt = db.prepare('INSERT INTO race_articles (race_id, article_id) VALUES (?, ?)');
        race_ids.forEach(rid => stmt.run(rid, articleId));
        stmt.finalize();
      }

      if (story_ids && story_ids.length) {
        const stmt = db.prepare('INSERT INTO story_articles (story_id, article_id) VALUES (?, ?)');
        story_ids.forEach(sid => stmt.run(sid, articleId));
        stmt.finalize();
      }

      res.status(201).json({ id: articleId });
    }
  );
});

// PUT /api/articles/:id - обновить статью
app.put('/api/articles/:id', (req, res) => {
  const id = req.params.id;
  const { title, content, character_ids, race_ids, story_ids } = req.body;

  db.run(
    'UPDATE articles SET title = ?, content = ? WHERE id = ?',
    [title, content, id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      db.run('DELETE FROM character_articles WHERE article_id = ?', [id], () => {
        if (character_ids && character_ids.length) {
          const stmt = db.prepare('INSERT INTO character_articles (character_id, article_id) VALUES (?, ?)');
          character_ids.forEach(cid => stmt.run(cid, id));
          stmt.finalize();
        }
      });

      db.run('DELETE FROM race_articles WHERE article_id = ?', [id], () => {
        if (race_ids && race_ids.length) {
          const stmt = db.prepare('INSERT INTO race_articles (race_id, article_id) VALUES (?, ?)');
          race_ids.forEach(rid => stmt.run(rid, id));
          stmt.finalize();
        }
      });

      db.run('DELETE FROM story_articles WHERE article_id = ?', [id], () => {
        if (story_ids && story_ids.length) {
          const stmt = db.prepare('INSERT INTO story_articles (story_id, article_id) VALUES (?, ?)');
          story_ids.forEach(sid => stmt.run(sid, id));
          stmt.finalize();
        }
      });

      res.json({ updated: true });
    }
  );
});

// DELETE /api/articles/:id
app.delete('/api/articles/:id', (req, res) => {
  const id = req.params.id;
  db.run('DELETE FROM articles WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ deleted: true });
  });
});

// ==================== ДОПОЛНИТЕЛЬНЫЕ ЭНДПОИНТЫ ДЛЯ ФОРМ ====================

// GET /api/lists/characters - простой список персонажей (id, name) для выпадающих списков
app.get('/api/lists/characters', (req, res) => {
  db.all('SELECT id, name FROM characters ORDER BY name', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// GET /api/lists/races - простой список рас
app.get('/api/lists/races', (req, res) => {
  db.all('SELECT id, name FROM races ORDER BY name', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// GET /api/lists/stories - простой список историй
app.get('/api/lists/stories', (req, res) => {
  db.all('SELECT id, title FROM stories ORDER BY title', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// GET /api/lists/articles - простой список статей
app.get('/api/lists/articles', (req, res) => {
  db.all('SELECT id, title FROM articles ORDER BY title', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// ==================== ЗАПУСК СЕРВЕРА ====================
app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});