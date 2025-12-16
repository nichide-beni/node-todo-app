<template>
  <div class="container">
    <h1>TODO 作成</h1>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="title">TODO タイトル:</label>
        <input type="text" id="title" v-model="title" required :disabled="isLoading">
      </div>
      
      <div class="actions">
        <button type="submit" :disabled="!title.trim() || isLoading" class="btn btn-submit">
          {{ isLoading ? '作成中...' : '作成' }}
        </button>
        <RouterLink :to="{ name: 'TodoList' }" class="btn btn-cancel">キャンセル</RouterLink>
      </div>

      <p v-if="error" class="error-message">{{ error }}</p>
    </form>
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { createTodo } from '@/controller/todoApi';

  const router = useRouter();
  const title = ref('');
  const isLoading = ref(false);
  const error = ref(null);

  async function handleSubmit() {
    if (!title.value.trim()) return;

    isLoading.value = true;
    error.value = null;

    try {
      await createTodo(title.value.trim());
      
      // 成功したら一覧ページに戻る
      router.push({ name: 'TodoList' });

    } catch (e) {
      error.value = 'TODOの作成に失敗しました: ' + e.message;
    } finally {
      isLoading.value = false;
    }
  }
</script>

<style scoped>
  .container {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
  }
  .form-group {
    margin-bottom: 15px;
  }
  label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
  }
  input[type="text"] {
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
    background-color: #28a745;
    color: white;
  }
  .btn-cancel {
    background-color: #6c757d;
    color: white;
  }
  .error-message {
    color: red;
    margin-top: 10px; 
  }
</style>