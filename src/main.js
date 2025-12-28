// src/main.js - COMBINED (Best of both)
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import 'animate.css'
import './styles/main.css'

// Import Lucide icons
import { 
  Briefcase, Home, User, Settings, Bell, Wallet, 
  Calendar, MapPin, Filter, Search, Star, ChevronRight, 
  CheckCircle, ChevronDown, Menu, X, LogOut, Plus,
  Sun, Moon, Globe, Shield, AlertCircle, Info, ChevronLeft,
  XCircle
} from 'lucide-vue-next'

const app = createApp(App)

// Register Lucide icons globally
const icons = { 
  Briefcase, Home, User, Settings, Bell, Wallet, 
  Calendar, MapPin, Filter, Search, Star, ChevronRight, 
  CheckCircle, ChevronDown, Menu, X, LogOut, Plus,
  Sun, Moon, Globe, Shield, AlertCircle, Info, ChevronLeft,
  XCircle
}
for (const [key, component] of Object.entries(icons)) {
  app.component(key, component)
}

app.use(createPinia())
app.use(router)

// Add page transition animations (from your old code)
router.beforeEach((to, from, next) => {
  document.body.classList.add('page-transition')
  setTimeout(() => {
    document.body.classList.remove('page-transition')
    next()
  }, 300)
})

app.mount('#app')