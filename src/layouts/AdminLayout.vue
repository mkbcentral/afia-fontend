<script setup>
import Navbar from '../layouts/partials/Navabar.vue'
import Footer from './partials/Footer.vue';
</script>
<template>
  <div class="wrapper">
    <Navbar />
    <aside class="main-sidebar sidebar-dark-primary elevation-4" style="background-color:#02511d;">
      <a href="index3.html" class="brand-link">
        <img src="@/assets/logo.jpg" alt="Logo" class="brand-image img-circle elevation-3" style="opacity: 0.8" />
        <span class="brand-text font-weight-light">AFIA</span>
      </a>

      <div class="sidebar">
        <nav class="mt-2">
          <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
            <li class="nav-item">
              <RouterLink to="/admin/settings" class="nav-link" active-class="active">
                <i class="nav-icon fas fa-th"></i>
                <p>Settings</p>
              </RouterLink>
            </li>
            <li class="nav-item">
                <RouterLink to="/admin/hospital" class="nav-link" active-class="active">
                    <i class="fas fa-hospital"></i>
                    <p> Hospital</p>
                </RouterLink>
            </li>
            <li class="nav-item">
                <RouterLink to="/admin/branch" class="nav-link" active-class="active">
                    <i class="fas fa-hospital"></i>
                    <p> Centres</p>
                </RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink to="/admin/user" class="nav-link" active-class="active">
                <i class="fas fa-users-cog"></i>
                <p> Users</p>
              </RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink to="/admin/role" class="nav-link" active-class="active">
                <i class="fa fa-list" aria-hidden="true"></i>
                <p> Role</p>
              </RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink to="/admin/commune" class="nav-link" active-class="active">
                <i class="fas fa-hospital"></i>
                <p> Communes</p>
              </RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink to="/admin/type" class="nav-link" active-class="active">
                <i class="fa fa-user" aria-hidden="true"></i>
                <p> Type patients</p>
              </RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink to="/admin/service" class="nav-link" active-class="active">
                <i class="fa fa-user" aria-hidden="true"></i>
                <p> Services agent</p>
              </RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink to="/admin/subscription" class="nav-link" active-class="active">
                <i class="fa fa-user" aria-hidden="true"></i>
                <p> Subscriptions</p>
              </RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink to="/admin/company" class="nav-link" active-class="active">
                <i class="fas fa-house-damage"></i>
                <p> Companies</p>
              </RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink to="/admin/rate" class="nav-link" active-class="active">
                <i class="fas fa-percent"></i>
                <p> Rates</p>
              </RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink to="/admin/currency" class="nav-link" active-class="active">
                <i class="fas fa-wallet"></i>
                <p> Currencies</p>
              </RouterLink>
            </li>
          </ul>
        </nav>
      </div>
    </aside>

    <div class="content-wrapper">
      <div class="content-header">
        <!---Headers-->
      </div>
      <div class="content">
        <div class="container-fluid">
          <slot />
        </div>
      </div>
    </div>

    <aside class="control-sidebar control-sidebar-dark">
      <div class="p-3">
        <h5>Title</h5>
        <p>Sidebar content</p>
      </div>
    </aside>
    <Footer/>
  </div>
</template>
