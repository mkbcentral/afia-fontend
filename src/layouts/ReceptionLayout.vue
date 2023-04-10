<script setup>
import Navbar from '../layouts/partials/Navabar.vue'
import Footer from './partials/Footer.vue';
</script>
<template>
  <div class="wrapper">
    <Navbar />
    <aside class="main-sidebar sidebar-dark-primary elevation-4" style="background-color:#032880;">
      <a href="index3.html" class="brand-link">
        <img src="@/assets/logo.jpg" alt="Logo" class="brand-image img-circle elevation-3" style="opacity: 0.8" />
        <span class="brand-text font-weight-light">AFIA</span>
      </a>

      <div class="sidebar">
        <nav class="mt-2">
          <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
            <li class="nav-item">
              <RouterLink to="/reception/dashboard" class="nav-link" active-class="active">
                <i class="fas fa-chart-line fa-2x"></i>
                <p> Dashboard</p>
              </RouterLink>
            </li>
            <li class="nav-item">
                <RouterLink to="/reception/patient-private" class="nav-link" active-class="active">
                    <i class="fas fa-user-shield fa-2x"></i> 
                    <p> Patients privates</p>
                </RouterLink>
            </li>
            <li class="nav-item">
                <RouterLink to="patient-subscribed" class="nav-link" active-class="active">
                    <i class="fas fa-user-check fa-2x"></i>
                    <p> Patients suscribed</p>
                </RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink to="/reception/agent-patient" class="nav-link" active-class="active">
                <i class="fas fa-user-tag fa-2x"></i>
                <p> Agents patients</p>
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
