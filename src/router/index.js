import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const routes = [
  {
    path: '/',
    name: 'Landing',
    component: () => import('@/views/Landing.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/Register.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: () => import('@/views/ForgotPassword.vue'),
    meta: { requiresGuest: true }
  },
  // Worker routes
  {
    path: '/worker',
    name: 'WorkerDashboard',
    component: () => import('@/views/WorkerDashboard.vue'),
    meta: { requiresAuth: true, role: 'worker' }
  },
  {
    path: '/worker/jobs',
    name: 'WorkerJobs',
    component: () => import('@/views/WorkerJobs.vue'),
    meta: { requiresAuth: true, role: 'worker' }
  },
  {
    path: '/worker/jobs/:id',
    name: 'JobDetails',
    component: () => import('@/views/JobDetails.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/worker/wallet',
    name: 'Wallet',
    component: () => import('@/views/Wallet.vue'),
    meta: { requiresAuth: true, role: 'worker' }
  },
  {
    path: '/worker/profile',
    name: 'Profile',
    component: () => import('@/views/Profile.vue'),
    meta: { requiresAuth: true }
  },
  // Employer routes
  {
    path: '/employer',
    name: 'EmployerDashboard',
    component: () => import('@/views/EmployerDashboard.vue'),
    meta: { requiresAuth: true, role: 'employer' }
  },
  {
    path: '/employer/jobs/create',
    name: 'CreateJob',
    component: () => import('@/views/CreateJob.vue'),
    meta: { requiresAuth: true, role: 'employer' }
  },
  {
    path: '/employer/jobs',
    name: 'EmployerJobs',
    component: () => import('@/views/EmployerJobs.vue'),
    meta: { requiresAuth: true, role: 'employer' }
  },
  // Admin routes
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: () => import('@/views/AdminDashboard.vue'),
    meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/admin/users',
    name: 'UserManagement',
    component: () => import('@/views/UserManagement.vue'),
    meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/admin/reports',
    name: 'Reports',
    component: () => import('@/views/Reports.vue'),
    meta: { requiresAuth: true, role: 'admin' }
  },
  // Common routes
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('@/views/Settings.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/notifications',
    name: 'Notifications',
    component: () => import('@/views/Notifications.vue'),
    meta: { requiresAuth: true }
  },
  // 404 route
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue')
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  }
});

// Navigation guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const isAuthenticated = authStore.isAuthenticated;
  const userRole = authStore.user?.role;

  // Check if route requires authentication
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login');
    return;
  }

  // Check if route requires guest (not authenticated)
  if (to.meta.requiresGuest && isAuthenticated) {
    // Redirect based on role
    switch (userRole) {
      case 'worker':
        next('/worker');
        break;
      case 'employer':
        next('/employer');
        break;
      case 'admin':
        next('/admin');
        break;
      default:
        next('/');
    }
    return;
  }

  // Check role-based access
  if (to.meta.role && userRole !== to.meta.role) {
    // Redirect unauthorized users to their dashboard
    switch (userRole) {
      case 'worker':
        next('/worker');
        break;
      case 'employer':
        next('/employer');
        break;
      case 'admin':
        next('/admin');
        break;
      default:
        next('/');
    }
    return;
  }

  next();
});

export default router;