import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';

// Define a Todo type
export interface Todo {
  userId?: number;
  id: number;
  title: string;
  completed: boolean;
  datetime?: string
}

export const useTodoStore = defineStore('todoStore', () => {
  const todos = ref<Todo[]>([]);
  const currentPage = ref<number>(1);
  const todosPerPage = 10;

  // Fetch todos (Load from localStorage or API)
  const fetchTodos = async (): Promise<void> => {
    const saved = localStorage.getItem('todos');
    const savedTodos: Todo[] | null = saved ? JSON.parse(saved) : null;

    if (savedTodos && savedTodos.length > 0) {
      todos.value = savedTodos;
    } else {
      const response = await fetch('https://jsonplaceholder.typicode.com/todos');
      const data: Todo[] = await response.json();
      todos.value = data.slice(0, 200);
      saveTodos();
    }
  };

  // Save todos to localStorage
  const saveTodos = (): void => {
    localStorage.setItem('todos', JSON.stringify(todos.value));
  };

  // Add Todo
  const addTodo = (newTodo: Todo): void => {
    todos.value.unshift(newTodo);
    saveTodos();
  };

  // Delete Todo
  const deleteTodo = (id: number): void => {
    todos.value = todos.value.filter(todo => todo.id !== id);
    saveTodos();
  };

  // Update Todo Completion
  const updateTodo = (updatedTodo: Todo): void => {
    const index = todos.value.findIndex(todo => todo.id === updatedTodo.id);
    if (index !== -1) {
      todos.value[index] = updatedTodo;
      saveTodos();
    }
  };

  // Pagination Computations
  const totalPages = computed(() => Math.ceil(todos.value.length / todosPerPage));

  const setPage = (page: number): void => {
    currentPage.value = page;
  };

  // Watch for changes and save automatically
  watch(todos, saveTodos, { deep: true });

  return {
    todos, fetchTodos, addTodo, deleteTodo, updateTodo,
    currentPage, todosPerPage, totalPages, setPage
  };
});
