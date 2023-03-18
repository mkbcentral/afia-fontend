<script setup>
import Navbar from '../layouts/partials/Navabar.vue'
</script>
<template>
  <div class="wrapper">
    <Navbar/>
    <aside class="main-sidebar sidebar-dark-primary elevation-4">
      <a href="index3.html" class="brand-link">
        <img
          src="@/assets/logo.jpg"
          alt="Logo"
          class="brand-image img-circle elevation-3"
          style="opacity: 0.8"
        />
        <span class="brand-text font-weight-light">AFIA</span>
      </a>

      <div class="sidebar">
        <nav class="mt-2">
          <ul
            class="nav nav-pills nav-sidebar flex-column"
            data-widget="treeview"
            role="menu"
            data-accordion="false"
          >
            <li class="nav-item">
              <RouterLink to="/" class="nav-link" active-class="active">
                <i class="nav-icon fas fa-th"></i>
                <p>Dashboard</p>
              </RouterLink>
              <RouterLink to="/admin/hospital" class="nav-link" active-class="active">
               <i class="fas fa-hospital"></i>
                <p> Gestion hopital</p>
              </RouterLink>
              <RouterLink to="/admin/role" class="nav-link" active-class="active">
               <i class="fa fa-list" aria-hidden="true"></i>
                <p> Role</p>
              </RouterLink>
              <RouterLink to="/admin/user" class="nav-link" active-class="active">
               <i class="fas fa-users-cog"></i>
                <p> Users</p>
              </RouterLink>
            </li>
          </ul>
        </nav>
      </div>
    </aside>

    <div class="content-wrapper">
      <div class="content-header">
        <div class="container-fluid">
          <div class="row mb-2">
            <div class="col-sm-6">
              <h1 class="m-0">Clinic management</h1>
            </div>
            <div class="col-sm-6">
              <ol class="breadcrumb float-sm-right">
                <li class="breadcrumb-item"><a href="#">Home</a></li>
                <li class="breadcrumb-item active">Starter Page</li>
              </ol>
            </div>
          </div>
        </div>
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

    <footer class="main-footer">
      <div class="float-right d-none d-sm-inline">Anything you want</div>

      <strong>Copyright &copy; 2014-2021 <a href="https://adminlte.io">AdminLTE.io</a>.</strong> All
      rights reserved.
    </footer>
  </div>
</template>
