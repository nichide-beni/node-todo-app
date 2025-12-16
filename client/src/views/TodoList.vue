<template>
  <div class="container">
    <h1>TODO リスト</h1>
    <RouterLink :to="{ name: 'TodoCreate' }" class="btn btn-primary">新しいTODOを作成</RouterLink>

    <div v-if="loading" class="loading">読み込み中...</div>
    <div v-else-if="error" class="error">エラー: {{ error.message }}</div>

    <ul v-else class="todo-list">
      <li v-for="todo in todos" :key="todo.id" :class="{ completed: todo.completed }">
        <span class="title">{{ todo.title }}</span>
        <span class="actions">
          <button @click="toggleCompletedStatus(todo)" :disabled="isDeleting" class="btn-action status-btn">
            {{ todo.completed ? '未完了にする' : '完了にする' }}
          </button>
          <RouterLink :to="{ name: 'TodoEdit', params: { id: todo.id } }" class="btn-action edit-btn">
            編集
          </RouterLink>
          <button @click="removeTodo(todo.id)" :disabled="isDeleting" class="btn-action delete-btn">
            削除 (ID: {{ todo.id }})
          </button>
        </span>
      </li>
    </ul>
    
    <p v-if="!loading && todos.length === 0">TODOは登録されていません。</p>
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue';
  import { fetchTodos, updateTodo, deleteTodo } from '@/controller/todoApi';

  // ステートの定義
  const todos = ref([]);
  const loading = ref(true);
  const error = ref(null);
  const isDeleting = ref(false);

  /**
   * TODO一覧をサーバーから取得する
   */
  async function loadTodos() {
    loading.value = true;
    error.value = null;
    try {
      todos.value = await fetchTodos();
    } catch (e) {
      error.value = e;
    } finally {
      loading.value = false;
    }
  }

  /**
   * TODOの完了状態を切り替える
   * @param {Object} todo - 対象のTODOオブジェクト
   */
  async function toggleCompletedStatus(todo) {
    try {
      const newStatus = !todo.completed;
      await updateTodo(todo.id, todo.title, newStatus);
      
      // 成功したらローカルの状態を更新
      todo.completed = newStatus;

    } catch (e) {
      alert('状態の更新に失敗しました: ' + e.message);
    }
  }

  /**
   * TODOを削除する (論理削除)
   * @param {number} id - 削除対象のTODO ID
   */
  async function removeTodo(id) {
    if (!confirm(`ID: ${id} のTODOを削除してもよろしいですか？`)) {
      return;
    }

    isDeleting.value = true;
    try {
      await deleteTodo(id);
      
      // 成功したらリストから削除
      todos.value = todos.value.filter(t => t.id !== id);

    } catch (e) {
      alert('TODOの削除に失敗しました: ' + e.message);
    } finally {
      isDeleting.value = false;
    }
  }

  // コンポーネントがマウントされたらデータをロード
  onMounted(loadTodos);
</script>

<style scoped>
  .container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }
  .btn-primary {
    display: inline-block;
    padding: 8px 15px;
    margin-bottom: 20px;
    background-color: #007bff;
    color: white;
    text-decoration: none;
    border-radius: 4px;
  }
  .todo-list {
    list-style: none;
    padding: 0;
  }
  .todo-list li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid #eee;
  }
  .todo-list li.completed .title {
    text-decoration: line-through;
    color: #888;
  }
  .title {
    flex-grow: 1;
    margin-right: 20px;
  }
  .actions {
    display: flex;
    gap: 10px;
  }
  .btn-action {
    padding: 5px 10px;
    border: none;
    cursor: pointer;
    border-radius: 3px;
    text-decoration: none;
    color: white;
    font-size: 14px;
  }
  .status-btn {
    background-color: #28a745;
  }
  .edit-btn {
    background-color: #ffc107; color: #333;
  }
  .delete-btn {
    background-color: #dc3545;
  }
</style>