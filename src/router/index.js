import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import MainMenuView from '../views/MainMenuView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    //MENU
    {
      path: '/menu',
      name: 'menu',
      component: MainMenuView,
      meta: {
        requireAuth: true
      }
    },
    //SETTINGS
    {
      path: '/admin/settings',
<<<<<<< HEAD
      name: 'home',
=======
      name: 'settings',
>>>>>>> 4915c3729554ed577ff2658c8fef2c5f1af8f01e
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
      path: '/admin/branch',
      name: 'branch',
      component: () => import('../views/admin/hospital/BranchView.vue'),
      meta: {
        requireAuth: true
      }
    },
    //COMMUNE ROUTE
    {
      path: '/admin/commune',
      name: 'commune',
      component: () => import('../views/admin/others/CommuneView.vue'),
      meta: {
        requireAuth: true
      }
    },
    //TYPE PATIENT ROUTE
    {
      path: '/admin/type',
      name: 'type',
      component: () => import('../views/admin/others/TypePatientView.vue'),
      meta: {
        requireAuth: true
      }
    },
    //SUBSCRIPTION ROUTE
    {
      path: '/admin/subscription',
      name: 'subscription',
      component: () => import('../views/admin/others/SubscriptionView.vue'),
      meta: {
        requireAuth: true
      }
    },
<<<<<<< HEAD
    //AGENT SERVICE ROUTE
    {
      path: '/admin/service',
      name: 'service',
      component: () => import('../views/admin/others/AgentServiceView.vue'),
=======
    //COMPANY ROUTE
    {
      path: '/admin/company',
      name: 'company',
      component: () => import('../views/admin/others/CompanyView.vue'),
>>>>>>> 4915c3729554ed577ff2658c8fef2c5f1af8f01e
      meta: {
        requireAuth: true
      }
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
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
    }

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
