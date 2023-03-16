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
      path: '/login',
      name: 'login',
      component: () => import('../views/auth/LoginView.vue'),

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
