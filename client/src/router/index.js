import { createRouter, createWebHistory } from 'vue-router';
import TodoList from '@/views/TodoList.vue';
import TodoCreate from '@/views/TodoCreate.vue';
import TodoEdit from '@/views/TodoEdit.vue';

const routes = [
  {
    path: '/list',
    name: 'TodoList',
    component: TodoList
  },
  {
    path: '/create',
    name: 'TodoCreate',
    component: TodoCreate
  },
  {
    path: '/edit/:id', // IDをパラメータとして受け取る
    name: 'TodoEdit',
    component: TodoEdit
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;