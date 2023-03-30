<script setup>
</script>
<template>
    <li class="nav-item" >
        <a class="nav-link" >
            <i class="fa fa-users" aria-hidden="true"></i>
            <p>
                Hospital
                <i class="right fas fa-angle-left"></i>
            </p>
        </a>
        <ul class="nav nav-treeview">
            <li class="nav-item">
                <RouterLink to="/admin/hospital" class="nav-link" active-class="active">
                    <i class="fas fa-hospital"></i>
                    <p> Gestion hopital</p>
                </RouterLink>
            </li>
            <li class="nav-item">
                <RouterLink to="/admin/branch" class="nav-link" active-class="active">
                    <i class="fas fa-hospital"></i>
                    <p> Surcussales</p>
                </RouterLink>
            </li>
            
            <li class="nav-item">
                <RouterLink to="/admin/branch" class="nav-link" active-class="active">
                    <i class="fas fa-hospital"></i>
                    <p> Type patient</p>
                </RouterLink>
            </li>
            <li class="nav-item">
                <RouterLink to="/admin/role" class="nav-link" active-class="active">
                    <i class="fa fa-list" aria-hidden="true"></i>
                    <p> Subscription</p>
                </RouterLink>
            </li>
            <li class="nav-item">
                <RouterLink to="/admin/user" class="nav-link" active-class="active">
                    <i class="fas fa-users-cog"></i>
                    <p> Companies</p>
                </RouterLink>
            </li>
        </ul>
    </li>
</template>