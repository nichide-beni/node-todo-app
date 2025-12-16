const HOST = 'http://localhost';
const PORT = 3000;

const API_BASE_URL = `${HOST}:${PORT}/todos`;

/**
 * 全てのTODOを取得する
 * @returns {Promise<Array>} TODOアイテムの配列
 */
export async function fetchTodos() {
  const response = await fetch(API_BASE_URL);
  if (!response.ok) {
    throw new Error('Failed to fetch todos');
  }
  return response.json();
}

/**
 * 新しいTODOを作成する
 * @param {string} title - 新しいTODOのタイトル
 * @returns {Promise<Object>} 作成されたTODOアイテム
 */
export async function createTodo(title) {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ title })
  });
  if (!response.ok) {
    throw new Error('Failed to create todo');
  }
  return response.json();
}

/**
 * TODOの完了状態を更新する
 * @param {number} id - TODOのID
 * @param {boolean} completed - 新しい完了状態
 * @returns {Promise<Object>} 更新されたTODOアイテム
 */
export async function updateTodoStatus(id, completed) {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ completed })
  });
  if (!response.ok) {
    throw new Error('Failed to update status');
  }
  return response.json();
}

/**
 * TODOを論理削除する (サーバーがDELETEをUPDATEとして実装していると仮定)
 * @param {number} id - TODOのID
 * @returns {Promise<void>} 
 */
export async function deleteTodo(id) {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'DELETE'
  });
  // サーバーが 204 No Content を返すと想定
  if (!response.ok && response.status !== 204) {
    throw new Error('Failed to delete todo');
  }
}

/**
 * 特定のTODOを取得 (編集用)
 * サーバーにこのエンドポイントがない場合、一覧から見つけ出す必要がありますが、
 * ここではシンプルにGET /todos/:id が存在すると仮定します。
 */
export async function getTodoById(id) {
  const response = await fetch(`${API_BASE_URL}/${id}`);
  if (!response.ok) {
    throw new Error('Todo not found');
  }
  return response.json();
}