<script setup>
import AdminLayout from '../../../layouts/AdminLayout.vue';
import axios from 'axios';
import { ref, reactive, onMounted } from 'vue'

const listHospitals = ref([])

const token = ref('')
let errors = ref({})
let errorResp = ref('')
const isLoanding = ref(false)
const isEditing = ref(false)

let form = reactive({
  name: '',
  email: '',
  phone: ''
})

const add=async()=>{
  isEditing.value=false;
}

const getHospitals = async () => {
  await axios.get('http://127.0.0.1:8000/api/v1/hospital', {
    headers: {
      'Authorization': `Bearer ${token.value}`
    }
  }).then((response) => {
    listHospitals.value = response.data.data
  });
}

const create = async () => {
  console.log(form)
  isLoanding.value = true
  await axios
      .post('http://127.0.0.1:8000/api/v1/hospital',form, {
        headers: {
          'Authorization': `Bearer ${token.value}`
        }
      })
      .then((response) => {
        if (response.data.success) {
          console.log(response.data)
          isLoanding.value = false
          getHospitals()
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

const edit=(hospital)=>{
  console.log(hospital)
  form=hospital
  isEditing.value=true;
}

onMounted(() => {
  token.value = localStorage.getItem('token')
  getHospitals()
})

</script>

<template>
  <AdminLayout>
    <div class="card card-primary card-outline">
      <div class="card-header">
        <div class="d-flex justify-content-between">
          <div>
            <h5 class="m-0">Liste des hopitaux</h5>
          </div>
          <div>
            <button @click="add" data-toggle="modal" data-target="#addHospitalModal" type="button"
              class="btn btn-primary btn-sm">Nouveau</button>
          </div>
        </div>
      </div>
      <div class="card-body">
        <table class="table">
          <thead>
            <tr>
              <th>#</th>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>PHONE</th>
              <th>LOGO</th>
              <th class="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(hospital, index) in listHospitals">
              <td v-text="index + 1" scope="row"></td>
              <td v-text="hospital.name"></td>
              <td v-text="hospital.email"></td>
              <td v-text="hospital.phone"></td>
              <td>
                <img width="40" height="40" src="@/assets/logo.jpg" class="img-circle elevation-2" alt="User Image" />
              </td>
              <td class="text-center">
                <button @click="edit(hospital)" data-toggle="modal" data-target="#addHospitalModal" class="btn btn-link"><i class="fas fa-edit    "></i></button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!-- Modal -->
    <div class="modal fade" id="addHospitalModal" tabindex="-1" aria-labelledby="addHospitalModalLabel"
      aria-hidden="true">
      <div class="modal-dialog">
        <form @submit.prevent="create">
          <div class="modal-content">
            <div class="modal-header">
              <h5 v-if="isEditing==false" class="modal-title" id="addHospitalModalLabel"><i class="fa fa-plus-circle" aria-hidden="true"></i> CREATION HOPITAL</h5>
              <h5 v-else class="modal-title" id="addHospitalModalLabel"><i class="fas fa-edit    "></i> EDIT HOPITAL</h5>
            </div>
            <div class="modal-body">
              <div class="form-group">
                <label>Name</label>
                <input v-model="form.name" type="text" class="form-control">
                <span v-if="errors.name" v-text="errors.name[0]" class="text-danger"></span>
              </div>
              <div class="form-group">
                <label>Email</label>
                <input v-model="form.email" type="text" class="form-control" >
                <span v-if="errors.email" v-text="errors.email[0]" class="text-danger"></span>
              </div>
              <div class="form-group">
                <label>Phone</label>
                <input v-model="form.phone" type="text" class="form-control" >
                <span v-if="errors.phone" v-text="errors.phone[0]" class="text-danger"></span>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
              <button type="submit" class="btn btn-primary">
                <div class="d-flex justify-content-center">
                  <div v-if="isLoanding" class="spinner-border text-light" role="status"></div>
                  <div class="pl-2"> Save changes</div>
                </div>

              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </AdminLayout>
</template>