<script setup>
import GuestLayout from '../../layouts/GuestLayout.vue'
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
const router = useRouter()

let form = reactive({
  email: '',
  password: ''
})
let errors = ref({})
let errorResp = ref('')
const isLoanding = ref(false)

const login = async () => {
  isLoanding.value = true
  form.value = ''
  await axios
    .post('http://127.0.0.1:8000/api/v1/login', form)
    .then((response) => {
      
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
      }
    })
    .catch((error) => {
      if (error.response.status == 422) {
        errors.value = error.response.data.errors
        isLoanding.value = false
      }
      
    })
}
</script>
<template>
  <GuestLayout class="hold-transition login-page">
    <div class="login-box">
      <div class="card">
        <div class="card-body login-card-body">
          <div class="text-center"><i class="fa fa-lock" aria-hidden="true"></i></div>
          <p class="login-box-msg text-bold">Login</p>
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
              <input
                v-model="form.password"
                type="password"
                class="form-control"
                placeholder="Password"
              />
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
