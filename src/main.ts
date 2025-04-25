import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import './assets/main.css'; // Tailwind styles

const app = createApp(App);
const pinia = createPinia();

app.use(pinia); // ✅ Register Pinia before using it
app.use(router);
app.mount('#app');
