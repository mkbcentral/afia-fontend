import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        requireAuth: true
      }
    },
    {
      path: '/admin/hospital',
      name: 'hospial',
      component: () => import('../views/admin/hospital/HospitalView.vue'),
      meta: {
        requireAuth: true
      }
    },
    {
      path: '/admin/role',
      name: 'role',
      component: () => import('../views/admin/user/RoleView.vue'),
      meta: {
        requireAuth: true
      }
    },
    {
      path: '/admin/user',
      name: 'user',
      component: () => import('../views/admin/user/UserView.vue'),
      meta: {
        requireAuth: true
      }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/auth/LoginView.vue'),
      meta: {
        requireAuth: false
      }
    },
    
  ]
})

router.beforeEach((to, from) => {
  if (to.meta.requireAuth && !localStorage.getItem('token')) {
    return { name: 'login' }
  }

  if (to.meta.requireAuth == false && localStorage.getItem('token')) {
    return { name: 'login' }
  }
})
export default router