<script setup>
import Navabar from './partials/Navabar.vue';
import Footer from './partials/Footer.vue';
</script>
<template>
    <div class="wrapper">
        <Navabar />
        <aside class="main-sidebar sidebar-dark-primary elevation-4" style="background-color:#740653;">
          <RouterLink to="/"  class="brand-link">
            <img src="@/assets/logo.jpg" alt="Logo" class="brand-image img-circle elevation-3" style="opacity: 0.8" />
            <span class="brand-text font-weight-light">AFIA</span>
          </RouterLink>
    
          <div class="sidebar">
            <nav class="mt-2">
              <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                <li class="nav-item">
                  <RouterLink to="/finance/tarification/list" class="nav-link" active-class="active">
                    <i class="fas fa-money-check fa-1x"></i>
                    <p> Price list</p>
                  </RouterLink>
                </li>
                <li class="nav-item">
                    <RouterLink to="/finance/tarification/consultation" class="nav-link" active-class="active">
                        <i class="fas fa-laptop-medical fa-1x"></i>
                        <p> Tarif consultation</p>
                    </RouterLink>
                </li>
                <li class="nav-item">
                    <RouterLink to="/finance/tarification/other" class="nav-link" active-class="active">
                        <i class="fas fa-list"></i>
                        <p> Other tarif</p>
                    </RouterLink>
                </li>
                <li class="nav-item">
                    <RouterLink to="/finance/tarification/category" class="nav-link" active-class="active">
                        <i class="fa fa-funnel-dollar"></i>
                        <p> Category tarif</p>
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