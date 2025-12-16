<template>
  <div class="container">
    <h1>TODO 編集 (ID: {{ todo.id }})</h1>
    <div v-if="loading" class="loading">TODOを読み込み中...</div>
    <div v-else-if="error" class="error">エラー: {{ error.message }}</div>
    
    <div v-else class="edit-form">
      <div class="form-group">
        <label for="title">タイトル:</label>
        <input type="text" id="title" v-model="title" required :disabled="isLoading">
      </div>

      <div class="form-group">
        <label for="completed">完了状態:</label>
        <select id="completed" v-model="completedStatus" :disabled="isLoading">
          <option :value="0">未完了</option>
          <option :value="1">完了</option>
        </select>
      </div>

      <div class="actions">
        <button @click="handleUpdate" :disabled="isLoading" class="btn btn-submit">
          {{ isLoading ? '更新中...' : '更新する' }}
        </button>
        <RouterLink :to="{ name: 'TodoList' }" class="btn btn-cancel">一覧に戻る</RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { getTodoById, updateTodo } from '@/controller/todoApi';

  const route = useRoute();
  const router = useRouter();
  const todo = ref({});
  const title = ref('');
  const completedStatus = ref(0);
  const loading = ref(true);
  const isLoading = ref(false);
  const error = ref(null);

  const todoId = parseInt(route.params.id);

  /**
   * 編集対象のTODOをロード
   */
  async function loadTodo() {
    loading.value = true;
    error.value = null;
    try {
      const data = await getTodoById(todoId);
      todo.value = data;
      completedStatus.value = data.completed;
      title.value = data.title;
    } catch (e) {
      error.value = e;
    } finally {
      loading.value = false;
    }
  }

  /**
   * 完了状態をサーバーに送信して更新する
   */
  async function handleUpdate() {
    isLoading.value = true;
    try {
      await updateTodo(todoId, title.value, completedStatus.value);
      alert('TODOを更新しました。');
      
      // 更新後、一覧に戻る
      router.push({ name: 'TodoList' }); 

    } catch (e) {
      alert('更新に失敗しました: ' + e.message);
    } finally {
      isLoading.value = false;
    }
  }

  onMounted(loadTodo);
</script>

<style scoped>
  .container {
    max-width: 600px; margin: 0 auto; padding: 20px;
  }
  .form-group {
    margin-bottom: 15px;
  }
  label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
  }
  input[type="text"],
  select {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
  }
  .actions {
    display: flex;
    gap: 10px;
    margin-top: 20px;
  }
  .btn {
    padding: 10px 15px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    text-decoration: none;
    text-align: center;
  }
  .btn-submit {
    background-color: #007bff;
    color: white;
  }
  .btn-cancel {
    background-color: #6c757d;
    color: white;
  }
  .error {
    color: red;
  }
</style>