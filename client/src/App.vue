<!-- 共通ヘッダー -->
<template>
  <header>
    <nav class="navbar">
      <RouterLink :to="{ name: 'TodoList' }">TODO一覧へ</RouterLink>
      <RouterLink :to="{ name: 'TodoCreate' }">新しいTODOを作成</RouterLink>
    </nav>
  </header>
  
  <main>
    <RouterView />
  </main>
</template>

<style>
  /* 簡易的なグローバルスタイル */
  body {
    font-family: sans-serif;
    margin: 0;
    background-color: #f4f4f4;
  }
  .navbar {
    display: flex;
    justify-content: center;
    column-gap: 20px;
    padding: 15px 20px;

    a {
      display: inline-block;
      padding: 15px;
      background-color: #333;

      &:nth-of-type(2) {
        background-color: #007bff;
      }
    }
  }
  .navbar a {
    color: white;
    text-decoration: none;
    font-size: 1.2em;
    font-weight: bold;
  }
  main {
    padding: 20px;
  }
</style>