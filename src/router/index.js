import { createRouter, createWebHistory } from 'vue-router'
import MainMenuView from '../views/MainMenuView.vue';
import SettingView from '../views/admin/SettingsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    //MENU
    {
      path: '/',
      name: 'menu',
      component: MainMenuView,
      meta: {
        requireAuth: true
      }
    },
    //SETTINGS
    {
      path: '/admin/settings',
      name: 'home',
      component: SettingView,
      meta: {
        requireAuth: true
      }
    },
    //HOSPITAL
    {
      path: '/admin/hospital',
      name: 'hospial',
      component: () => import('../views/admin/hospital/HospitalView.vue'),
      meta: {
        requireAuth: true
      }
    },
    //ROLE
    {
      path: '/admin/role',
      name: 'role',
      component: () => import('../views/admin/user/RoleView.vue'),
      meta: {
        requireAuth: true
      }
    },
    //USER
    {
      path: '/admin/user',
      name: 'user',
      component: () => import('../views/admin/user/UserView.vue'),
      meta: {
        requireAuth: true
      }
    },
    //BRACNH
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
    //COMPANY ROUTE
    {
      path: '/admin/company',
      name: 'company',
      component: () => import('../views/admin/others/CompanyView.vue'),
      meta: {
        requireAuth: true
      }
    },
    //RATE ROUTE
    {
      path: '/admin/rate',
      name: 'rate',
      component: () => import('../views/admin/others/RateView.vue'),
      meta: {
        requireAuth: true
      }
    },
    //CURRENCY ROUTE
    {
      path: '/admin/currency',
      name: 'currency',
      component: () => import('../views/admin/others/CurrencyView.vue'),
      meta: {
        requireAuth: true
      }
    },
    //SERVICE ROUTE
    {
      path: '/admin/service',
      name: 'service',
      component: () => import('../views/admin/others/AgentServiceView.vue'),
      meta: {
        requireAuth: true
      }
    },
    //DASHBOARD RECEPTION
    {
      path: '/reception/dashboard',
      name: 'dashboard-reception',
      component: () => import('../views/reception/dashboard/DashboardReceptionView.vue'),
      meta: {
        requireAuth: true
      }
    },
    //PATIENT PRIVATE
    {
      path: '/reception/patient-private',
      name: 'patient-private',
      component: () => import('../views/reception/patients/PatientPrivateView.vue'),
      meta: {
        requireAuth: true
      }
    },
    //PATIENT SUBSCRIBED
    {
      path: '/reception/patient-subscribed',
      name: 'patient-subscribed',
      component: () => import('../views/reception/patients/PatientSubscribedView.vue'),
      meta: {
        requireAuth: true
      }
    },
    //PATIENT AGENT
    {
      path: '/reception/agent-patient',
      name: 'agent-patient',
      component: () => import('../views/reception/patients/AgentPatientView.vue'),
      meta: {
        requireAuth: true
      }
    },
    //CREATE PATIENT PRIVATE
    {
      path: '/reception/create/patient/private',
      name: 'create.patient.private',
      component: () => import('../views/reception/patients/Forms/FormPatientPrivate.vue'),
      meta: {
        requireAuth: true
      }
    },
    //EDIT PATIENT PRIVATE
    {
      path: '/reception/edit/patient/:id/private',
      name: 'edit.patient.private',
      component: () => import('../views/reception/patients/Forms/FormPatientPrivate.vue'),
      meta: {
        requireAuth: true
      }
    },
    //CREATE PATIENT SUBSCRIBE
    {
      path: '/reception/create/patient/subscribe',
      name: 'create.patient.subscribe',
      component: () => import('../views/reception/patients/Forms/FormPatientSubscribe.vue'),
      meta: {
        requireAuth: true
      }
    },
    //EDIT PATIENT SUBSCRIBE
    {
      path: '/reception/create/patient/:id/subscribe',
      name: 'edit.patient.subscribe',
      component: () => import('../views/reception/patients/Forms/FormPatientSubscribe.vue'),
      meta: {
        requireAuth: true
      }
    },
    //CREATE AGENT PATIENT
    {
      path: '/reception/create/patient/agent',
      name: 'create.patient.agent',
      component: () => import('../views/reception/patients/Forms/AgenFormPatient.vue'),
      meta: {
        requireAuth: true
      }
    },
    //EDIT AGENT PATIENT
    {
      path: '/reception/edit/patient/:id/agent',
      name: 'edit.patient.agent',
      component: () => import('../views/reception/patients/Forms/AgenFormPatient.vue'),
      meta: {
        requireAuth: true
      }
    },
    //LIST TARIFICATION 
    {
      path: '/finance/tarification/list',
      name: 'finance.tarification.list',
      component: () => import('../views/admin/tarification/PriceListView.vue'),
      meta: {
        requireAuth: true
      }
    },
    //CONSULTATION TARIFICATION 
    {
      path: '/finance/tarification/consultation',
      name: 'finance.tarification.consultation',
      component: () => import('../views/admin/tarification/ConsultationTarifView.vue'),
      meta: {
        requireAuth: true
      }
    },
    //OTHER TARIFICATION 
    {
      path: '/finance/tarification/other',
      name: 'finance.tarification.other',
      component: () => import('../views/admin/tarification/OtherTarifView.vue'),
      meta: {
        requireAuth: true
      }
    },
    //OTHER TARIFICATION 
    {
      path: '/finance/tarification/category',
      name: 'finance.tarification.category',
      component: () => import('../views/admin/tarification/CategoryTarifView.vue'),
      meta: {
        requireAuth: true
      }
    },
    //DASHBOARD INVOICE PRIVATE 
    {
      path: '/finance/invoice/private/dashboard',
      name: 'finance.invoice.dashboard.private',
      component: () => import('../views/invoices/dashboard/DashboardInvoicePrivate.vue'),
      meta: {
        requireAuth: true
      }
    },
    //INVOICE PRIVATE 
    {
      path: '/finance/invoice/private',
      name: 'finance.invoice.private',
      component: () => import('../views/invoices/privates/InvoicePruvateView.vue'),
      meta: {
        requireAuth: true
      }
    },
     //INVOICE PRIVATE 
     {
      path: '/finance/invoice/private/:id/create',
      name: 'finance.invoice.private.create',
      component: () => import('../views/invoices/privates/CreateInvoicePrivate.vue'),
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
