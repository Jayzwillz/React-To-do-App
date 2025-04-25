<template>
  <div class="min-h-screen bg-gray-900 text-gray-200 p-4">
    <header class="bg-gray-800 text-white p-4 rounded-md shadow-md">
      <h1 class="text-2xl font-bold text-center">Vue ToDo App</h1>
    </header>

    <main class="mt-4">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
/* Dark mode styles with high contrast */
body {
  background-color: #111; /* Deep black background */
  color: #e0e0e0; /* Light gray text */
}
</style>
