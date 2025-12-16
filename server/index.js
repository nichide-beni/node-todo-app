/**
 * Express を使ったTODOリストのバックエンド
 * TODO: 例外処理などはかなり省略しているため、prodを想定する場合ははパラメーターのガード処理などを入れること
 */
import express from 'express';
import { open_db } from './database.js';

const app = express();
const port = 3000;

app.use(express.json());

let db;

/**
 * nodeサーバー起動時にデータベース接続を確立, 未作成の場合はdbファイルを作成
 */
open_db().then(database => {
  db = database;
  console.log('Database connected using node:sqlite.');

  app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
  });

}).catch(err => {
  console.error('Database connection failed:', err);
  process.exit(1);
});

/**
 * TODOリストを一覧で取得
 */
app.get('/todos', async (req, res) => {
  try {
    // .all() メソッド
    const todos = await db.all('SELECT * FROM todos ORDER BY id DESC');
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
});

/**
 * 新しいリストを作成
 */
app.post('/todos', async (req, res) => {
  const { title } = req.body;
  if (!title || title.trim() === '') {
    return res.status(400).json({ error: 'Title is required' });
  }

  try {
    // .run() メソッド
    const result = await db.run(
      'INSERT INTO todos (title, completed, created_at) VALUES (?, ?, ?)',
      [title.trim(), 0, new Date()]
    );

    // lastIDを使用して挿入されたアイテムを取得
    const newTodo = await db.get('SELECT * FROM todos WHERE id = ?', result.lastID);
    res.status(200).json(newTodo);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create todo' });
  }
});

/**
 * 選択されたTODOアイテムを削除 
 */
app.put('/todos/:id', async (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;

  if (typeof completed !== 'boolean') {
    return res.status(400).json({ error: 'Completed status must be a boolean' });
  }

  try {
    // .run() メソッド
    const result = await db.run(
      'UPDATE todos SET completed = ? WHERE id = ?',
      [completed ? 1 : 0, id]
    );

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    const updatedTodo = await db.get('SELECT * FROM todos WHERE id = ?', id);
    res.json(updatedTodo);

  } catch (err) {
    res.status(500).json({ error: 'Failed to update todo' });
  }
});

/**
 * 選択したアイテムを削除する
 */
app.delete('/todos/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // .run() メソッド
    const result = await db.run('DELETE FROM todos WHERE id = ?', id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.status(200).send();

  } catch (err) {
    res.status(500).json({ error: 'Failed to delete todo' });
  }
});
