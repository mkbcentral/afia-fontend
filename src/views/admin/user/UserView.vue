<script setup>

import AdminLayout from '../../../layouts/AdminLayout.vue';

import axios from 'axios';
import { ref, reactive, onMounted } from 'vue'
import { Form, Field } from 'vee-validate'
import * as yup from 'yup'
import { useToastr } from '../../../../src/widgets/toastr.js'

import ItemListUserWdgetVue from './widgets/ItemListUserWdget.vue';

const listUsers = ref([])
const listRoles = ref([])
const listHospitals = ref([])

const token = ref('')
const defaulHospital = ref()
const hospitalId = reactive({
  hosîtal_id: 0
})
const userToEdit = ref({})
let errors = ref({})
let errorResp = ref('')
const isLoanding = ref(false)
const isEditing = ref(true)
const formValues = ref()
const form = ref(null)
const toastr = useToastr()


const schema = yup.object({
  name: yup.string().required(),
  email: yup.string().required().email(),
  phone: yup.string().required(),
  role_id: yup.number().required(),
})

const add = async () => {
  isEditing.value = false;
  $('#adduserModal').modal('show');
  form.value.resetForm()
}

const getUsers = async () => {
  await axios.get('http://127.0.0.1:8000/api/v1/user', {
    headers: {
      'Authorization': `Bearer ${token.value}`
    }
  }).then((response) => {
    listUsers.value = response.data.data
  });
}

const getRoles = async () => {
  await axios.get('http://127.0.0.1:8000/api/v1/role', {
    headers: {
      'Authorization': `Bearer ${token.value}`
    }
  }).then((response) => {
    listRoles.value = response.data.data
  });
}

const create = async (values) => {
  isLoanding.value = true;
  values.hospital_id = hospitalId.id;
  await axios
    .post('http://127.0.0.1:8000/api/v1/user', values, {
      headers: {
        'Authorization': `Bearer ${token.value}`
      }
    })
    .then((response) => {
      if (response.data.success) {
        console.log(response.data);
        isLoanding.value = false;
        getUsers();
        toastr.success(response.data.message, 'Validation');
        $('#adduserModal').modal('hide');
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
    .put('http://127.0.0.1:8000/api/v1/user/' + formValues.value.id, values, {
      headers: {
        'Authorization': `Bearer ${token.value}`
      }
    })
    .then((response) => {
      if (response.data.success) {
        isLoanding.value = false
        getUsers()
        toastr.success(response.data.message, 'Validation')
        $('#adduserModal').modal('hide');
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

const edit = (user) => {
  isEditing.value = true;
  $('#adduserModal').modal('show');
  form.value.resetForm()
  formValues.value = {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone
  }
}

const handlerSubmit = (values) => {
  if (isEditing.value) {
    update(values)
  } else {
    create(values)
  }
}

const showDeleteDialogue = async (user) => {
  $('#deleteUserModal').modal('show');
  userToEdit.value = user;
}

const deleteRole = async () => {
  isLoanding.value = true
  await axios.delete('http://127.0.0.1:8000/api/v1/user/' + userToEdit.value.id, {
    headers: {
      'Authorization': `Bearer ${token.value}`
    }
  }).then((response) => {
    if (response.data.success) {
      isLoanding.value = false
      toastr.success(response.data.message, 'Validation')
      $('#deleteUserModal').modal('hide');
      getUsers()
    } else {
      errorResp.value = response.data.message
      toastr.error(response.data.message, 'Validation')
      isLoanding.value = false
      $('#deleteUserModal').modal('hide');
    }
  });
}


const changeStatus = async (user, status) => {
  console.log(user)
  console.log(status)
  await axios.put('http://127.0.0.1:8000/api/v1/user/status/' + user.id, { status: status }, {
    headers: {
      'Authorization': `Bearer ${token.value}`
    }
  }).then((response) => {
    toastr.success(response.data.message, 'Validation')
  });
}

onMounted(async () => {
  token.value = localStorage.getItem('token')
  defaulHospital.value = JSON.parse(localStorage.getItem('hospital'))
  hospitalId.id = defaulHospital.value.id
  await getUsers()
  await getRoles()
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
            <table class="table table-sm table-borded">
              <thead>
                <tr>
                  <th>#</th>
                  <th>NAME</th>
                  <th>EMAIL</th>
                  <th>PHONE</th>
                  <th>PHONE</th>
                  <th>STATUS</th>
                  <th class="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                <ItemListUserWdgetVue v-for="(user, index) in listUsers" :key="user.id" :user=user :index=index
                  @edit-user="edit" @change-status="changeStatus" 
                  @delete-user="showDeleteDialogue" />
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
    <div class="modal fade" id="adduserModal" tabindex="-1" aria-labelledby="adduserModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <Form ref="form" @submit="handlerSubmit" :validation-schema="schema" v-slot="{ errors }"
          :initial-values="formValues">
          <div class="modal-content">
            <div class="modal-header">
              <h5 v-if="isEditing" class="modal text-uppercase" id="adduserModalLabel"><i class="fa fa-plus-circle"
                  aria-hidden="true"></i> EDIT user</h5>
              <h5 v-else class="modal-title" id="adduserModalLabel"><i class="fas fa-edit    "></i> CREATE USER
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
              <div class="form-group">
                <label for="">Roles</label>
                <Field class="form-control" name="role_id" as="select">
                  <option selected value="">Choose her...</option>
                  <option v-for="role in listRoles" :value="role.id">{{ role.name }}</option>
                </Field>
                <span class="invalid-feedback">{{ errors.role_id }}</span>
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
    <div class="modal fade" id="deleteUserModal" tabindex="-1" aria-labelledby="addRoleModalLabel" aria-hidden="true">
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
            <button type="button" @click="deleteRole" class="btn btn-danger btn-sm">
              <div class="d-flex justify-content-center">
                <div v-if="isLoanding" class="spinner-border text-light spinner-sm" role="status"></div>
                <div class="pl-2">Oui</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>