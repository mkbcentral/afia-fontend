<script setup>
import AdminLayout from '../../../layouts/AdminLayout.vue';
import axios from 'axios';
import { ref, reactive, onMounted } from 'vue'
import { Form, Field } from 'vee-validate'
import * as yup from 'yup'
import { useToastr } from '../../../../src/widgets/toastr.js'
import HospitalItemList from './widgets/HospitalItemList.vue';

const listHospitals = ref([])
const hospitalToEdit = ref({})
const token = ref('')
let errors = ref({})
let errorResp = ref('')
const isLoanding = ref(false)
const isEditing = ref(true)
const formValues = ref()
const form = ref(null)
const toastr = useToastr()
const logo = ref(null)



const schema = yup.object({
  name: yup.string().required(),
  email: yup.string().required().email(),
  phone: yup.string().required()
})

const add = async () => {
  isEditing.value = false;
  $('#addHospitalModal').modal('show');
  form.value.resetForm()
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


const create = async (values) => {
  isLoanding.value = true
  await axios
    .post('http://127.0.0.1:8000/api/v1/hospital', values, {
      headers: {
        'Authorization': `Bearer ${token.value}`
      }
    })
    .then((response) => {
      if (response.data.success) {
        console.log(response.data)
        isLoanding.value = false
        getHospitals()
        toastr.success(response.data.message, 'Validation')
        $('#addHospitalModal').modal('hide');
        form.value.resetForm()
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

    }).finally(() => {
      form.value.resetForm()
    })
}
const update = async (values) => {
  isLoanding.value = true
  await axios
    .put('http://127.0.0.1:8000/api/v1/hospital/' + formValues.value.id, values, {
      headers: {
        'Authorization': `Bearer ${token.value}`
      }
    })
    .then((response) => {
      if (response.data.success) {
        isLoanding.value = false
        getHospitals()
        toastr.success(response.data.message, 'Validation')
        $('#addHospitalModal').modal('hide');
        form.value.resetForm()
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
    }).finally(() => {
      form.value.resetForm()
    })
}


const edit = (hospital) => {
  isEditing.value = true;
  $('#addHospitalModal').modal('show');
  form.value.resetForm()
  formValues.value = {
    id: hospital.id,
    name: hospital.name,
    email: hospital.email,
    phone: hospital.phone
  }
}

const handlerSubmit = (values) => {
  if (isEditing.value) {
    update(values)
  } else {
    create(values)
  }
}

const showDeleteDialogue = async (hospital) => {
  hospitalToEdit.value = hospital
  $('#deleteHospitalModal').modal('show');
}

const deleteHospital = async () => {
  isLoanding.value = true
  await axios.delete('http://127.0.0.1:8000/api/v1/hospital/' + hospitalToEdit.value.id, {
    headers: {
      'Authorization': `Bearer ${token.value}`
    }
  }).then((response) => {
    if (response.data.success) {
      isLoanding.value = false
      toastr.success(response.data.message, 'Validation')
      $('#deleteHospitalModal').modal('hide');
      getHospitals()
    } else {
      errorResp.value = response.data.message
      toastr.error(response.data.message, 'Validation')
      isLoanding.value = false
      $('#deleteHospitalModal').modal('hide');
    }
  });
}

const changeStatus = async (hospital, status) => {
  console.log(status)
  await axios.put('http://127.0.0.1:8000/api/v1/hospital/status/' + hospital.id, { status: status }, {
    headers: {
      'Authorization': `Bearer ${token.value}`
    }
  }).then((response) => {
    toastr.success(response.data.message, 'Validation')
  });
}

const changeLogo = async (hospital) => {
  hospitalToEdit.value = hospital
  $('#changeHospitalModal').modal('show');
}
const onchange = async (e) => {
  logo.value = e.target.files[0];
}

const updateLogo = async (e) => {
  console.log(logo.value)
  const data = new FormData();
  data.append('logo', logo.value);
  
  isLoanding.value = true
  await axios.put('http://127.0.0.1:8000/api/v1/hospital/logo/' + hospitalToEdit.value.id
    ,data, {
    headers: {
      'Authorization': `Bearer ${token.value}`,
    }
  }).then((response) => {
    console.log(response.data)
    if (response.data.success) {
      isLoanding.value = false
      toastr.success(response.data.message, 'Validation')
      $('#deleteHospitalModal').modal('hide');
      getHospitals()
    } else {
      errorResp.value = response.data.message
      toastr.error(response.data.message, 'Validation')
      isLoanding.value = false
      $('#deleteHospitalModal').modal('hide');
    }
  });
}
onMounted(async () => {
  token.value = localStorage.getItem('token')
  await getHospitals()
})

</script>
<template>
  <AdminLayout>
    <div class="card card-primary card-outline">
      <div class="card-header">
        <div class="d-flex justify-content-between">
          <div>
            <h5 class="m-0">List of clinics</h5>
          </div>
          <div>
            <button @click="add" type="button" class="btn btn-primary btn-sm">New</button>
          </div>
        </div>
      </div>
      <Suspense>
        <template #default>
          <div class="card-body">
            <table class="table table-bordered table-sm">
              <thead>
                <tr>
                  <th>#</th>
                  <th>NAME</th>
                  <th>EMAIL</th>
                  <th>PHONE</th>
                  <th>STATUS</th>
                  <th>LOGO</th>
                  <th class="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                <HospitalItemList v-for="(hospital, index) in listHospitals" :key="hospital.id" :hospital=hospital
                  :index=index @edit-hospital="edit" @change-status="changeStatus" @delete-hospital="showDeleteDialogue"
                  @change-logo="changeLogo" />
              </tbody>
            </table>
          </div>
        </template>
        <template #fellback>
          <h1 class="text-center">Loadin...</h1>
        </template>
      </Suspense>
    </div>
    <!-- Modal -->
    <div class="modal fade" id="addHospitalModal" tabindex="-1" aria-labelledby="addHospitalModalLabel"
      aria-hidden="true">
      <div class="modal-dialog">
        <Form ref="form" @submit="handlerSubmit" :validation-schema="schema" v-slot="{ errors }"
          :initial-values="formValues">
          <div class="modal-content">
            <div class="modal-header">
              <h5 v-if="isEditing" class="modal-title" id="addHospitalModalLabel"><i class="fa fa-plus-circle"
                  aria-hidden="true"></i> EDIT HOSPITAL</h5>
              <h5 v-else class="modal-title" id="addHospitalModalLabel"><i class="fas fa-edit    "></i> CREATE HOPITAL
              </h5>
            </div>
            <div class="modal-body">
              <div class="form-group">
                <label>Clinic Name</label>
                <Field name="name" type="text" class="form-control" :class="{ 'is-invalid': errors.name }"
                  placeholder="Name of clinic" />
                <span class="invalid-feedback">{{ errors.name }}</span>
              </div>
              <div class="form-group">
                <label>Clinic Email</label>
                <Field name="email" type="text" class="form-control" :class="{ 'is-invalid': errors.email }"
                  placeholder="Email of clinic" />
                <span class="invalid-feedback">{{ errors.email }}</span>
              </div>
              <div class="form-group">
                <label>Clinic Phone</label>
                <Field name="phone" type="text" class="form-control" :class="{ 'is-invalid': errors.phone }"
                  placeholder="Phone of clinic" />
                <span class="invalid-feedback">{{ errors.phone }}</span>
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
        </Form>
      </div>
    </div>
    <!--Delete Modal -->
    <div class="modal fade" id="deleteHospitalModal" tabindex="-1" aria-labelledby="addRoleModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 v-if="isEditing" class="modal-title text-info" id="addRoleModalLabel">
              Voulez-vous vraiment supprimer ?
            </h5>
          </div>
          <div class="modal-body">
            <h1 class="text-center text-danger">
              <i class="fa fa-exclamation-triangle" aria-hidden="true"></i>
            </h1>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal">Non</button>
            <button type="button" @click="deleteHospital" class="btn btn-danger btn-sm">
              <div class="d-flex justify-content-center">
                <div v-if="isLoanding" class="spinner-border text-light spinner-sm" role="status"></div>
                <div class="pl-2">Oui</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
    <!--Delete Modal -->
    <div class="modal fade" id="changeHospitalModal" tabindex="-1" aria-labelledby="addRoleModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title text-info" id="addRoleModalLabel">
              CHANGE LOGO
            </h5>
          </div>
          <form @submit.prevent="updateLogo" enctype="multipart/form-data">
            <div class="modal-body">
              <div class="mb-3">
                <label for="formFile" class="form-label">Choisir le logo</label>
                <input ref="logo" @change="onchange" class="form-control" type="file">
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal">Non</button>
              <button type="submit" class="btn btn-danger btn-sm">
                <div class="d-flex justify-content-center">
                  <div v-if="isLoanding" class="spinner-border text-light spinner-sm" role="status"></div>
                  <div class="pl-2">Oui</div>
                </div>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

  </AdminLayout>
</template>