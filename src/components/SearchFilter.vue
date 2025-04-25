<template>
    <div class="flex flex-col sm:flex-row sm:justify-between gap-4 mb-6">
      <!-- Search Input -->
      <input 
        v-model="search"
        type="text" 
        placeholder="Search todos..." 
        class="w-full sm:w-2/3 px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
  
      <!-- Status Filter -->
      <select 
        v-model="filter"
        class="w-full sm:w-1/3 px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        <option value="all">All</option>
        <option value="completed">Completed</option>
        <option value="pending">Pending</option>
      </select>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue';
  
  const props = defineProps<{
    searchQuery: string;
    filterStatus: 'all' | 'completed' | 'pending';
  }>();
  
  const emit = defineEmits<{
    (e: 'update:searchQuery', value: string): void;
    (e: 'update:filterStatus', value: 'all' | 'completed' | 'pending'): void;
  }>();
  
  const search = computed({
    get: () => props.searchQuery,
    set: (value) => emit('update:searchQuery', value),
  });
  
  const filter = computed({
    get: () => props.filterStatus,
    set: (value) => emit('update:filterStatus', value),
  });
  </script>
  