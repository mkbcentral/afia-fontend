<script setup>
import AdminLayout from '../layouts/AdminLayout.vue'
import { onMounted } from 'vue'

onMounted(() => {
  console.log(localStorage.getItem('token'))
})
</script>
<template>
  <AdminLayout>
    <div class="row">
      <div class="col-lg-6">
       
        <div class="card card-primary card-outline">
          <div class="card-body">
            
          </div>
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
    </div>
  </AdminLayout>
</template>
