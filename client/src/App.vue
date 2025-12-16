<template>
  <header>
    <nav class="navbar">
      <RouterLink to="/list">TODOアプリ</RouterLink>
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
    background-color: #333;
    padding: 15px 20px;
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