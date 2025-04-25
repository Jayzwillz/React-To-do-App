import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import TodoList from '../views/TodoList.vue';
import TodoDetail from '../views/TodoDetail.vue';
import NotFound from '../views/NotFound.vue';

// Define route records with types
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: TodoList
  },
  {
    path: '/todo/:id',
    name: 'TodoDetail', // This enables router.push({ name: 'TodoDetail', params: { id } })
    component: TodoDetail,
    props: true
  },
  {
    path: '/:pathMatch(.*)*',
    component: NotFound
  }
];


// Create and export the router
const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
