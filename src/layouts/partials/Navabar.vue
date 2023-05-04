<script setup>
    import { useRouter } from 'vue-router';
    import CurrentRateView from '../../views/admin/others/CurrentRateView.vue';
    const router=useRouter()
    const logout =async()=>{
        localStorage.removeItem('token');
        router.push('/login');
    }
</script>
<template>
    <nav class="main-header navbar navbar-expand navbar-white navbar-light">
      <ul class="navbar-nav">
        <li class="nav-item">
          <a class="nav-link" data-widget="pushmenu" href="#" role="button"
            ><i class="fas fa-bars"></i
          ></a>
        </li>
      </ul>
      <li class="nav-item pl-4 d-none d-sm-inline-block">
      
      </li>
      <ul class="navbar-nav ml-auto">
       
        <li class="nav-item dropdown user-menu">
          <a href="#" class="nav-link dropdown-toggle" data-toggle="dropdown">
            <img
              src="@/assets/logo.jpg"
              class="user-image img-circle elevation-2"
              alt="User Image"
            />
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
              <a @click="logout"
                href="#"
                class="btn btn-default btn-flat float-right"
                >Déconnexion</a
              >
            </li>
          </ul>
        </li>
      </ul>
    </nav>

</template>