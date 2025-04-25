<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useTodoStore } from '../stores/todoStore';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
  datetime?: string; // optional because older todos may not have this
}


interface TodoStore {
  todos: Todo[];
  updateTodo: (todo: Todo) => void;
}

const route = useRoute();
const todoStore = useTodoStore();
const todoId = computed(() => Number(route.params.id));
const todo = computed(() =>
  todoStore.todos.find((t) => t.id === todoId.value)
);

// Modal state
const isEditing = ref(false);
const editTitle = ref('');
const editDatetime = ref('');

// Toggle completed state
const toggleCompleted = () => {
  if (!todo.value) return;
  const updatedTodo = { ...todo.value, completed: !todo.value.completed };
  todoStore.updateTodo(updatedTodo);
};

// Open modal and prefill values
const openEditModal = () => {
  if (!todo.value) return;

  isEditing.value = true;
  editTitle.value = todo.value.title;

  // Ensure datetime-local format: "YYYY-MM-DDTHH:MM"
  const rawDatetime = todo.value.datetime;
  if (rawDatetime) {
    const dateObj = new Date(rawDatetime);
    const pad = (n: number) => n.toString().padStart(2, '0');
const localFormatted = `${dateObj.getFullYear()}-${pad(dateObj.getMonth() + 1)}-${pad(dateObj.getDate())}T${pad(dateObj.getHours())}:${pad(dateObj.getMinutes())}`;
editDatetime.value = localFormatted;
 // Ensures correct format
    editDatetime.value = localFormatted;
  } else {
    editDatetime.value = new Date().toISOString().slice(0, 16);
  }
};


// Save changes
const saveChanges = () => {
  if (!todo.value) return;
  const updatedTodo = {
    ...todo.value,
    title: editTitle.value,
    datetime: editDatetime.value || new Date().toISOString(),
  };
  todoStore.updateTodo(updatedTodo);
  isEditing.value = false;
};
</script>

<template>
  <div v-if="todo" class="max-w-2xl mx-auto mt-4 p-6 bg-gray-800 text-gray-300 rounded-lg shadow-md">
    <h1 class="text-3xl font-bold text-white">{{ todo.title }}</h1>
    <p class="mt-2 text-lg">
      Status:
      <span 
        :class="todo.completed ? 'text-green-400' : 'text-yellow-400'"
        class="font-semibold"
      >
        {{ todo.completed ? 'Completed' : 'Pending' }}
      </span>
    </p>
    <p v-if="todo.datetime" class="mt-2 text-sm text-gray-400">Due: {{ new Date(todo.datetime).toLocaleString() }}</p>

    <div class="mt-4 space-x-3">
      <button
        @click="toggleCompleted"
        class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition duration-200"
      >
        Mark as {{ todo.completed ? 'Pending' : 'Completed' }}
      </button>

      <button
        @click="openEditModal"
        class="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded transition duration-200"
      >
        Edit Todo
      </button>
    </div>
  </div>

  <div v-else class="text-center mt-10 text-gray-400">
    <p class="text-lg">Todo not found.</p>
  </div>

  <!-- Modal -->
  <!-- Edit Modal -->
<div v-if="isEditing" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="isEditing = false">
  <div class="bg-gray-900 rounded-lg p-6 w-full max-w-md shadow-xl">
    <h2 class="text-xl font-semibold text-white mb-4">Edit Todo</h2>
    
    <label class="block text-gray-300 mb-1">Title</label>
    <input
      v-model="editTitle"
      class="w-full px-4 py-2 mb-4 bg-gray-800 text-gray-200 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
      type="text"
    />

    <label class="block text-gray-300 mb-1">Date & Time</label>
    <input
      v-model="editDatetime"
      class="w-full px-4 py-2 mb-6 bg-gray-800 text-gray-200 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
      type="datetime-local"
    />

    <div class="flex justify-end gap-3">
      <button
        @click="isEditing = false"
        class="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 text-gray-300"
      >
        Cancel
      </button>
      <button
        @click="saveChanges"
        class="px-4 py-2 rounded bg-green-600 hover:bg-green-500 text-white"
      >
        Save
      </button>
    </div>
  </div>
</div>

</template>
