<template>
  <div class="max-w-3xl mx-auto mt-4 p-6 bg-gray-900 text-gray-300 rounded-lg shadow-md todo-container">
    <h1 class="text-2xl font-bold text-center text-white mb-6">Todo List</h1>

    <!-- Add Todo Section -->
<div class="flex flex-col sm:flex-row gap-2 mb-6">
  <input
    v-model="newTodo"
    type="text"
    placeholder="Add new todo..."
    class="w-full sm:flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
  />
  <button
    @click="openModal"
    class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-400 transition w-full sm:w-auto"
  >
    Add
  </button>
</div>

<AddTodoModal
  v-if="showModal"
  :title="newTodo"
  @close="showModal = false"
  @confirm="finalizeTodo"
/>


    <!-- Search and Filter Section -->
    <SearchFilter
      :searchQuery="searchQuery"
      :filterStatus="filterStatus"
      @update:searchQuery="searchQuery = $event"
      @update:filterStatus="filterStatus = $event"
    />

    <!-- Todos List -->
    <ul v-if="paginatedTodos.length" class="space-y-4">
      <TodoItem
        v-for="todo in paginatedTodos"
        :key="todo.id"
        :todo="todo"
        @toggle-completion="toggleCompletion"
        @delete-todo="deleteTodo"
        @view-details="goToDetail"
      />
    </ul>
    <p v-else class="text-center text-red-400">No todos found.</p>

    <!-- Pagination -->
    <Pagination
  v-if="todoStore.totalPages > 1"
  :current-page="todoStore.currentPage"
  :total-pages="todoStore.totalPages"
  @page-change="changePage"
/>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useTodoStore } from '../stores/todoStore';
import { useRouter } from 'vue-router';

import TodoItem from '../components/TodoItem.vue';
import Pagination from '../components/Pagination.vue';
import SearchFilter from '../components/SearchFilter.vue';

import AddTodoModal from '../components/AddTodoModal.vue'; // adjust path if needed

const showModal = ref(false);

const openModal = () => {
  if (!newTodo.value.trim()) return;
  showModal.value = true;
};

const finalizeTodo = (data: { title: string; date: string; time: string }) => {
  const dueDateTime = new Date(`${data.date}T${data.time}`).toISOString();

  const newTask: Todo = {
    id: Date.now(),
    title: data.title.trim(),
    completed: false,
    datetime: dueDateTime,
  };

  todoStore.addTodo(newTask);
  newTodo.value = '';
  showModal.value = false;
};



interface Todo {
  id: number;
  title: string;
  completed: boolean;
  datetime?: string; // optional because older todos may not have this
}


const todoStore = useTodoStore();
const router = useRouter();

const searchQuery = ref<string>('');
const filterStatus = ref<'all' | 'completed' | 'pending'>('all');
const newTodo = ref<string>('');

// Fetch todos on mount
onMounted(() => {
  todoStore.fetchTodos();
});

// Computed: Filtered Todos
const filteredTodos = computed<Todo[]>(() => {
  return todoStore.todos
    .filter((todo: Todo) => {
      if (filterStatus.value === 'completed') return todo.completed;
      if (filterStatus.value === 'pending') return !todo.completed;
      return true;
    })
    .filter((todo: Todo) => todo.title.toLowerCase().includes(searchQuery.value.toLowerCase()));
});

// Computed: Paginated Todos
const paginatedTodos = computed<Todo[]>(() => {
  const start = (todoStore.currentPage - 1) * todoStore.todosPerPage;
  return filteredTodos.value.slice(start, start + todoStore.todosPerPage);
});

// Watch for Filter/Search Changes & Reset Pagination
watch([searchQuery, filterStatus], () => {
  todoStore.setPage(1);
});

// Add New Todo
const addTodo = (): void => {
  if (!newTodo.value.trim()) return;
  const newTask: Todo = {
    id: Date.now(),
    title: newTodo.value.trim(),
    completed: false,
  };
  todoStore.addTodo(newTask);
  newTodo.value = '';
};

// Toggle Completion
const toggleCompletion = (todo: Todo): void => {
  todoStore.updateTodo({ ...todo, completed: !todo.completed });
};

// Delete Todo
const deleteTodo = (todoId: number): void => {
  todoStore.deleteTodo(todoId);
};

// Navigate to Todo Detail
const goToDetail = (todoId: number): void => {
  router.push({ name: 'TodoDetail', params: { id: todoId } });
};

// Change Page
const changePage = (page: number): void => {
  if (page >= 1 && page <= todoStore.totalPages) {
    todoStore.setPage(page);
  }
};

// Pagination
const visiblePages = computed<number[]>(() => {
  const total = todoStore.totalPages;
  const current = todoStore.currentPage;
  const maxVisible = 5;
  const pages: number[] = [];

  let start = Math.max(1, current - Math.floor(maxVisible / 2));
  let end = Math.min(total, start + maxVisible - 1);

  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return pages;
});
</script>
