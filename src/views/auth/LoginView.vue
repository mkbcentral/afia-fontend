<script setup>
import GuestLayout from '../../layouts/GuestLayout.vue'
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useToastr } from '../../widgets/toastr.js'
import AuthApi from '../../services/Auth/AuthApi.js'

const router = useRouter()

let form = reactive({
  email: '',
  password: ''
})
let errors = ref({})
let errorResp = ref('')
const isLoanding = ref(false)
const toastr = useToastr()

const login = async () => {
  isLoanding.value = true
  form.value = ''
  try {
    const response = await AuthApi.login(form)
    if (response.data.success) {
      localStorage.setItem('token', response.data.data.token)
      localStorage.setItem('role', JSON.stringify(response.data.data.role))
      localStorage.setItem('hospital', JSON.stringify(response.data.data.hospital))
      localStorage.setItem('branch', JSON.stringify(response.data.data.branch))
      router.push('/')
      isLoanding.value = false
    } else {
      errorResp.value = response.data.message
      isLoanding.value = false
      console.log(response)
    }
  } catch (error) {
    if (error.code == "ERR_NETWORK") {
      toastr.error(error.message, 'ERROR');
      isLoanding.value = false
    }else if(error.response.status == 422) {
      errors.value = error.response.data.errors
      isLoanding.value = false
    }
  }
}
</script>
<template>
  <GuestLayout class="hold-transition login-page">
    <div class="login-box">
      <div class="card">
        <div class="card-body login-card-body">
          <div class="text-center"><i class="fa fa-lock text-primary fa-2x" aria-hidden="true"></i></div>
          <p class="login-box-msg text-bold text-primary">
          <h4>Login</h4>
          </p>
          <form @submit.prevent="login">
            <div class="input-group">
              <input v-model="form.email" type="email" class="form-control" placeholder="Email" />
              <div class="input-group-append">
                <div class="input-group-text">
                  <span class="fas fa-envelope"></span>
                </div>
              </div>
            </div>
            <span v-if="errors.email" v-text="errors.email[0]" class="text-danger"></span>
            <div class="input-group mt-3">
              <input v-model="form.password" type="password" class="form-control" placeholder="Password" />
              <div class="input-group-append">
                <div class="input-group-text">
                  <span class="fas fa-lock"></span>
                </div>
              </div>
            </div>
            <span v-if="errors.password" v-text="errors.password[0]" class="text-danger"></span>
            <span v-if="errorResp" v-text="errorResp" class="text-danger"></span>
            <div class="row mt-3">
              <div class="col-12">
                <button type="submit" class="btn btn-primary btn-block">
                  <div class="d-flex justify-content-center">
                    <div v-if="isLoanding" class="spinner-border text-light" role="status"></div>
                    <div class="pl-2">Sign In</div>
                  </div>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </GuestLayout>
</template>
