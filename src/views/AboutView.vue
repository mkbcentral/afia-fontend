<script setup>
import 'admin-lte/plugins/inputmask/jquery.inputmask.min.js'
import AdminLayoutVue from '../layouts/AdminLayout.vue';

import { onMounted } from "vue";
//   
onMounted(async () => {
  $('[data-mask]').inputmask()
})
</script>
<template>
  <AdminLayoutVue>
    <div class="about">
      <h1>This is an about page</h1>

      <div class="card card-danger">
        <div class="card-header">
          <h3 class="card-title">Input masks</h3>
        </div>
        <div class="card-body">
          <!-- Date dd/mm/yyyy -->
          <div class="form-group">
            <label>Date masks:</label>

            <div class="input-group">
              <div class="input-group-prepend">
                <span class="input-group-text"><i class="far fa-calendar-alt"></i></span>
              </div>
              <input type="text" class="form-control" data-inputmask-alias="datetime"
                data-inputmask-inputformat="dd/mm/yyyy" data-mask>
            </div>
            <!-- /.input group -->
          </div>
          <!-- /.form group -->

          <!-- Date mm/dd/yyyy -->
          <div class="form-group">
            <div class="input-group">
              <div class="input-group-prepend">
                <span class="input-group-text"><i class="far fa-calendar-alt"></i></span>
              </div>
              <input type="text" class="form-control" data-inputmask-alias="datetime"
                data-inputmask-inputformat="mm/dd/yyyy" data-mask>
            </div>
            <!-- /.input group -->
          </div>
          <!-- /.form group -->

          <!-- phone mask -->
          <div class="form-group">
            <label>US phone mask:</label>

            <div class="input-group">
              <div class="input-group-prepend">
                <span class="input-group-text"><i class="fas fa-phone"></i></span>
              </div>
              <input type="text" class="form-control" data-inputmask='"mask": "(999) 999-9999"' data-mask>
            </div>
            <!-- /.input group -->
          </div>
          <!-- /.form group -->

          <!-- phone mask -->
          <div class="form-group">
            <label>Intl US phone mask:</label>

            <div class="input-group">
              <div class="input-group-prepend">
                <span class="input-group-text"><i class="fas fa-phone"></i></span>
              </div>
              <input type="text" class="form-control"
                data-inputmask="'mask': ['999-999-9999 [x99999]', '+099 99 99 9999[9]-9999']" data-mask>
            </div>
            <!-- /.input group -->
          </div>
          <!-- /.form group -->

          <!-- IP mask -->
          <div class="form-group">
            <label>IP mask:</label>

            <div class="input-group">
              <div class="input-group-prepend">
                <span class="input-group-text"><i class="fas fa-laptop"></i></span>
              </div>
              <input type="text" class="form-control" data-inputmask="'alias': 'ip'" data-mask>
            </div>
            <!-- /.input group -->
          </div>
          <!-- /.form group -->

        </div>
        <!-- /.card-body -->
      </div>
      <!-- /.card -->
    </div>
  </AdminLayoutVue>
</template>
