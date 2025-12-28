import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';

// Import Toast notifications
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';

// Import Vuelidate
import { createVuelidate } from '@vuelidate/core';

// Create Vue app
const app = createApp(App);

// Create Pinia store
const pinia = createPinia();

// Toast configuration
const toastOptions = {
  position: 'top-right',
  timeout: 5000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: 'button',
  icon: true,
  rtl: false,
  transition: 'Vue-Toastification__bounce',
  maxToasts: 5,
  newestOnTop: true,
  filterBeforeCreate: (toast, toasts) => {
    // Prevent duplicate toasts
    if (toasts.filter(t => t.type === toast.type && t.content === toast.content).length >= 1) {
      return false;
    }
    return toast;
  }
};

// Use plugins
app.use(pinia);
app.use(router);
app.use(Toast, toastOptions);
app.use(createVuelidate());

// Mount the app
app.mount('#app');

// Initialize auth store after app is mounted
import { useAuthStore } from '@/stores/auth';

// Small delay to ensure DOM is ready
setTimeout(() => {
  const authStore = useAuthStore();
  authStore.initialize().catch(error => {
    console.error('Failed to initialize auth:', error);
  });
}, 100);

// Export for potential testing
export { app };
