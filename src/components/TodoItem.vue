<template>
    <li 
      class="bg-gray-800 p-4 rounded-md shadow-md hover:bg-gray-700 transition flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2"
    >
      <div class="flex items-center gap-2">
        <input
          type="checkbox"
          :checked="todo.completed"
          @change="$emit('toggle-completion', todo)"
          class="cursor-pointer"
        />
        <div class="flex flex-col">
  <button 
    @click="$emit('view-details', todo.id)" 
    class="text-blue-400 hover:text-blue-300 font-medium break-words max-w-[200px] sm:max-w-none text-left"
  >
    {{ todo.title }}
  </button>
  <span v-if="todo.datetime" class="text-sm text-gray-400">
    Due on {{ new Date(todo.datetime).toLocaleString() }}
  </span>
</div>

        
      </div>
      <div class="flex flex-wrap gap-2">
        <button 
          @click="$emit('toggle-completion', todo)"
          class="px-3 py-1 text-sm rounded-md text-white"
          :class="todo.completed ? 'bg-green-500' : 'bg-yellow-500'"
        >
          {{ todo.completed ? 'Completed' : 'Pending' }}
        </button>
        <button
          @click="$emit('delete-todo', todo.id)"
          class="bg-red-500 px-3 py-1 text-sm rounded-md hover:bg-red-400 transition"
        >
          Delete
        </button>
      </div>
    </li>
  </template>
  
  <script setup lang="ts">
  defineProps<{
    todo: {
      id: number;
      title: string;
      completed: boolean;
      datetime?: string;
    }
  }>();
  
  defineEmits(['toggle-completion', 'delete-todo', 'view-details']);
  </script>
  