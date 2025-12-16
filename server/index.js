/**
 * Express を使ったTODOリストのバックエンド
 * TODO: 例外処理などはかなり省略しているため、prodを想定する場合ははパラメーターのガード処理などを入れること
 */
import express from 'express';
import cors from 'cors';
import { open_db } from './database.js';

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

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
 * DBから全てのTODO情報を取得する
 */
app.get('/todos', async (req, res) => {
  try {
    const todos = await db.all('SELECT * FROM todos ORDER BY id DESC');
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
});

/**
 * 新しいTODOを作成
 */
app.post('/todos', async (req, res) => {
  const { title } = req.body;
  if (!title || title.trim() === '') {
    return res.status(400).json({ error: 'Title is required' });
  }

  try {
    // DBの追加処理
    const result = await db.run(
      'INSERT INTO todos (title, completed, created_at) VALUES (?, ?, ?)',
      [title.trim(), 0, get_datetime()]
    );

    // 追加したDBを取得し、成功レスポンスとしてクライアントに送信
    const newTodo = await db.get('SELECT * FROM todos WHERE id = ?', result.lastID);
    res.status(200).json(newTodo);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create todo' });
  }
});

/**
 * 選択されたTODOアイテムを編集する
 */
app.get('/todos/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // IDの一致したデータを編集する
    const result = await db.run(
      'SELECT * FROM todos WHERE id = ?',
      [id]
    );

    const updatedTodo = await db.get('SELECT * FROM todos WHERE id = ?', id);
    res.json(updatedTodo);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update todo' });
  }
});

/**
 * 選択されたTODOアイテムを編集する
 */
app.put('/todos/:id', async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const { completed } = req.body;

  console.log(req.body);

  if (typeof completed !== 'boolean' && completed !== '0' && completed !== '1' && completed !== 0 && completed !== 1) {
    return res.status(400).json({ error: 'Completed status must be a boolean' });
  }

  try {
    // IDの一致したデータを編集する
    const result = await db.run(
      'UPDATE todos SET title = ?, completed = ? WHERE id = ?',
      [title, completed ? 1 : 0, id]
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
    const result = await db.run(
      'UPDATE todos SET deleted_at = ? WHERE id = ?',
      [get_datetime() ,id]
    );

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.status(200).send();

  } catch (err) {
    res.status(500).json({ error: 'Failed to delete todo' });
  }
});

const zero_pad = (num, length = 2) => {
  return String(num).padStart(length, '0');
}

const get_datetime = () => {
  const now = new Date();

  const y = now.getFullYear();
  // 月は 0 から始まるため +1 する
  const m = zero_pad(now.getMonth() + 1); 
  const d = zero_pad(now.getDate());
  
  const h = zero_pad(now.getHours());
  const i = zero_pad(now.getMinutes());
  const s = zero_pad(now.getSeconds());

  // 'yyyy-mm-dd hh:ii:ss' の形式で結合
  return `${y}-${m}-${d} ${h}:${i}:${s}`;
}
