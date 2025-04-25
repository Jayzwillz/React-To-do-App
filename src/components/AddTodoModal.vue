<template>
    <div
      class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center"
      @click.self="close"
    >
      <div class="bg-gray-900 rounded-lg p-6 w-full max-w-md shadow-xl">
        <h2 class="text-xl font-semibold text-white mb-4">Add Todo Details</h2>
        
        <p class="text-gray-300 mb-2">Title:</p>
        <p class="text-blue-400 bg-gray-800 px-4 py-2 rounded mb-4">{{ title }}</p>
  
        <label class="block text-gray-300 mb-1">Select Date:</label>
        <input
          v-model="date"
          type="date"
          class="w-full px-4 py-2 bg-gray-800 text-gray-200 rounded border border-gray-600 mb-4"
        />
  
        <label class="block text-gray-300 mb-1">Select Time:</label>
        <input
          v-model="time"
          type="time"
          class="w-full px-4 py-2 bg-gray-800 text-gray-200 rounded border border-gray-600 mb-6"
        />

        <p v-if="error" class="text-red-400 text-sm mb-4">{{ error }}</p>
  
        <div class="flex justify-end gap-2">
          <button
            @click="close"
            class="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 text-gray-300"
          >
            Cancel
          </button>
          <button
            @click="confirm"
            class="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  
  const props = defineProps<{
    title: string;
  }>();
  
  const emit = defineEmits<{
    (e: 'close'): void;
    (e: 'confirm', data: { title: string; date: string; time: string }): void;
  }>();
  
  const date = ref('');
const time = ref('');
const error = ref('');

const close = () => emit('close');

const confirm = () => {
  if (!date.value || !time.value) {
    error.value = 'Please select both a date and time.';
    return;
  }

  error.value = ''; // Clear any previous error
  emit('confirm', {
    title: props.title,
    date: date.value,
    time: time.value,
  });
};

  </script>
  