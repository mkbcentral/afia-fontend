<script setup>
import 'admin-lte/plugins/inputmask/jquery.inputmask.min.js'
import AdminLayoutVue from '../layouts/AdminLayout.vue';
import UserView from './admin/user/UserView.vue';

import { onMounted } from "vue";
//   
onMounted(async () => {
  $('[data-mask]').inputmask()
})
</script>
<template>
  <AdminLayoutVue>
    <div class="card">
      <div class="card-header p-2">
        <ul class="nav nav-pills">
          <li class="nav-item">
            <a class="nav-link active" href="#mouth" data-toggle="tab">
              &#x1F4B8; Sous listing
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link  " href="#bus" data-toggle="tab">
              &#x1F4B0; Par option
            </a>
          </li>
        </ul>
      </div><!-- /.card-header -->
      <div class="card-body">
        <div class="tab-content">
          <div class="active tab-pane" id="mouth">
            <div>
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
            </div>
          </div>
          <div class=" tab-pane" id="bus">
            <div>
              
            </div>
          </div>

        </div>
        <!-- /.tab-content -->
      </div><!-- /.card-body -->
    </div>
    <!-- /.card -->

  </AdminLayoutVue>
</template>
