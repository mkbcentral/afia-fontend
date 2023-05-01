<script setup>
import { useRouter } from 'vue-router';
import CurrentRateView from '../../views/admin/others/CurrentRateView.vue';
import 'admin-lte/plugins/bootstrap-switch/js/bootstrap-switch.min.js'
const router = useRouter()
const logout = async () => {
  localStorage.removeItem('token');
  router.push('/login');
}
</script>
<template>
  <nav class="main-header navbar navbar-expand navbar-white navbar-light">
    <ul class="navbar-nav">
      <li class="nav-item">
        <a class="nav-link" data-widget="pushmenu" href="#" role="button"><i class="fas fa-bars"></i></a>
      </li>
    </ul>
    <li class="nav-item pl-4 d-none d-sm-inline-block">
      <CurrentRateView />
    </li>
    <ul class="navbar-nav ml-auto">
      <div class="bootstrap-switch-container" style="width: 132px; margin-left: -44px;"><span
          class="bootstrap-switch-handle-on bootstrap-switch-success" style="width: 44px;">ON</span><span
          class="bootstrap-switch-label" style="width: 44px;">&nbsp;</span><span
          class="bootstrap-switch-handle-off bootstrap-switch-danger" style="width: 44px;">OFF</span><input
          type="checkbox" name="my-checkbox" checked="" data-bootstrap-switch="" data-off-color="danger"
          data-on-color="success">
        </div>
      <li class="nav-item dropdown user-menu">
        <a href="#" class="nav-link dropdown-toggle" data-toggle="dropdown">
          <img src="@/assets/logo.jpg" class="user-image img-circle elevation-2" alt="User Image" />
        </a>
        <ul class="dropdown-menu dropdown-menu-lg dropdown-menu-right">
          <!-- User image -->
          <li class="user-header bg-primary">
            <img src="@/assets/logo.jpg" class="img-circle elevation-2" alt="User Image" />
            <p>
              <small></small>
            </p>
          </li>

          <!-- Menu Footer-->
          <li class="user-footer">
            <a @click="logout" href="#" class="btn btn-default btn-flat float-right">Déconnexion</a>
          </li>
        </ul>
      </li>
    </ul>
  </nav>
</template>