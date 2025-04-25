<template>
    <div v-if="totalPages > 1" class="flex flex-wrap justify-center items-center gap-2 mt-6">
      <!-- Prev Button -->
      <button
        @click="changePage(currentPage - 1)"
        :disabled="currentPage === 1"
        class="px-4 py-2 rounded-md border transition bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        ‹ Prev
      </button>
  
      <!-- Page Buttons -->
      <div class="flex flex-wrap gap-2">
        <button
          v-for="page in visiblePages"
          :key="page"
          @click="changePage(page)"
          :class="[
            'px-4 py-2 rounded-md border transition',
            currentPage === page
              ? 'bg-blue-500 text-white border-blue-400'
              : 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600'
          ]"
        >
          {{ page }}
        </button>
      </div>
  
      <!-- Next Button -->
      <button
        @click="changePage(currentPage + 1)"
        :disabled="currentPage === totalPages"
        class="px-4 py-2 rounded-md border transition bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next ›
      </button>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue';
  
  const props = defineProps<{
    currentPage: number;
    totalPages: number;
  }>();
  
  const emit = defineEmits<{
    (e: 'page-change', page: number): void;
  }>();
  
  const visiblePages = computed<number[]>(() => {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, props.currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(props.totalPages, start + maxVisible - 1);
  
    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }
  
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
  
    return pages;
  });
  
  const changePage = (page: number) => {
    if (page >= 1 && page <= props.totalPages) {
      emit('page-change', page);
    }
  };
  </script>
  