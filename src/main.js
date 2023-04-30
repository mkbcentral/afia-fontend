import { createApp } from 'vue'
import { createPinia } from 'pinia'
import jquery from 'jquery'
import 'admin-lte/plugins/jquery/jquery.min.js'
import 'admin-lte/plugins/bootstrap/js/bootstrap.bundle.min.js'
import  'admin-lte/dist/js/adminlte.min.js'
import App from './App.vue'
import router from './router'
import VueAwesomePaginate from "vue-awesome-paginate";
import "vue-awesome-paginate/dist/style.css";
import './assets/main.css'
window.$=window.jQuery=jquery;

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(VueAwesomePaginate)
app.mount('#app')
