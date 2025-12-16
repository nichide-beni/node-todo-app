// /**
//  * SQLiteを使うための擬似データベース機能との接続設定
//  */
import * as sqlite from 'sqlite';
import sqlite3 from 'sqlite3';

/**
 * データベース接続を開き、todosテーブルを初期化する
 * @returns {Promise<sqlite.Database>} データベース接続オブジェクト
 */
async function open_db() {
  const db = await sqlite.open({
    filename: './local_data/todo.db', // ファイル保存を維持
    driver: sqlite3.Database
  });

  // TODOテーブルが存在しない場合は作成
  await db.exec(`
    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      completed BOOLEAN NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      deleted_at TEXT
    );
  `);
  
  return db;
}

export { open_db };