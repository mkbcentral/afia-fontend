<script setup>
import AdminLayout from '../../layouts/AdminLayout.vue';
</script>
<template>
    <AdminLayout>
      <div class="content-header">
        <div class="container-fluid">
          <div class="d-flex justify-content-end">
            <div class="">
              <ol class="breadcrumb float-sm-right">
                <li class="breadcrumb-item">
                  <RouterLink to="/">Menu</RouterLink>
                </li>
                <li class="breadcrumb-item active">Settings</li>
              </ol>
            </div><!-- /.col -->
          </div><!-- /.row -->
        </div><!-- /.container-fluid -->
      </div>
      <div class="row">
        <div class="col-lg-3">
  
          <div class="card card-primary card-outline">
            <div class="card-body box-profile">
              <div class="text-center">
                <img class="profile-user-img img-fluid img-circle" src="@/assets/logo.jpg" alt="User profile picture">
              </div>
  
              <h3 class="profile-username text-center">Nina Mcintire</h3>
  
              <p class="text-muted text-center">Software Engineer</p>
  
              <ul class="list-group list-group-unbordered mb-3">
                <li class="list-group-item">
                  <i class="fa fa-users" aria-hidden="true"></i> <b>Patients</b> <a class="float-right">1,322</a>
                </li>
                <li class="list-group-item">
                  <i class="fas fa-hospital    "></i><b> Centers</b> <a class="float-right">2</a>
                </li>
              </ul>
            </div>
            <!-- /.card-body -->
          </div>
          <div class="card card-primary">
            <div class="card-header">
              <h3 class="card-title">About Me</h3>
            </div>
            <!-- /.card-header -->
            <div class="card-body">
              <strong><i class="fas fa-map-marker-alt mr-1"></i> Location</strong>
  
              <p class="text-muted">Malibu, California</p>
  
              <hr>
  
              <strong><i class="fas fa-pencil-alt mr-1"></i> Skills</strong>
  
              <p class="text-muted">
                <span class="tag tag-danger">UI Design</span>
                <span class="tag tag-success">Coding</span>
                <span class="tag tag-info">Javascript</span>
                <span class="tag tag-warning">PHP</span>
                <span class="tag tag-primary">Node.js</span>
              </p>
  
              <hr>
  
            </div>
            <!-- /.card-body -->
          </div>
        </div>
  
        <div class="col-lg-6">
          <div class="card card-primary card-outline">
            <div class="card-header">
              <h5 class="m-0">Featured</h5>
            </div>
            <div class="card-body">
  
            </div>
          </div>
        </div>
        <div class="col-lg-3">
          <div class="card card-primary card-success">
            <div class="card-header">
              <h5 class="m-0">Medicals persons</h5>
            </div>
            <div class="card-body">
              <ul class="list-group list-group-unbordered mb-3">
                <li class="list-group-item">
                  <i class="fa fa-users" aria-hidden="true"></i> <b>Doctors</b> <a class="float-right">1,322</a>
                </li>
                <li class="list-group-item">
                  <i class="fas fa-hospital    "></i><b> Nurses</b> <a class="float-right">2</a>
                </li>
              </ul>
            </div>
          </div>
          <div class="card card-primary card-primary">
            <div class="card-header">
              <h5 class="m-0">Services</h5>
            </div>
            <div class="card-body">
              <ul class="list-group list-group-unbordered mb-2">
                <li class="list-group-item">
                   <b>Medeine interne</b> 
                </li>
                <li class="list-group-item">
                  <b>Chirurgie </b>
                </li>
                <li class="list-group-item">
                  <b>Echographie </b>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  </template>