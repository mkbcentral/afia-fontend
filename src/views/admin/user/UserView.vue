<script setup>

import AdminLayout from '../../../layouts/AdminLayout.vue';

import axios from 'axios';
import { ref, reactive, onMounted } from 'vue'
import { Form, Field } from 'vee-validate'
import * as yup from 'yup'
import { useToastr } from '../../../../src/widgets/toastr.js'
import UserApi from '../../../services/Admin/UserApi';
import ItemListUserWdgetVue from './widgets/ItemListUserWdget.vue';
import NetworkError from '../../../components/errors/Network.vue';
import RoleApi from '../../../services/Admin/RoleApi.js'
import Swal from 'sweetalert2'


const listUsers = ref([])
const listRoles = ref([])

const token = ref('')
const defaultHospital = ref()
const defaultBranch = ref()
const hospitalId = reactive({
  hospital_id: 0
})
const branchId = reactive({
  branch_id: 0
})
let errors = ref({})
let errorResp = ref('')

const isLoanding = ref(false)
const isDataLoanding = ref(false)
const isEditing = ref(true)
const isNetWorkError = ref(false)

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

const getData = async () => {
  isDataLoanding.value = true
  isNetWorkError.value = false
  try {
    const response = await UserApi.getUsers()
    listUsers.value = response.data.data
    isDataLoanding.value = false
  } catch (error) {
    if (error.code) {
      isNetWorkError.value = true
      errorResp.value = error.message
    }
    isDataLoanding.value = false
  }
}

const getRoles = async () => {
  try {
    const response = await RoleApi.getRoles();
    listRoles.value = response.data.data
  } catch (error) {
    if (error.code) {
      isNetWorkError.value = true
      errorResp.value = error.message
    }
  }
}

const create = async (values) => {
  isLoanding.value = true;
  values.hospital_id = hospitalId.id;
  values.branch_id = branchId.id
  try {
    const response = await UserApi.createUser(values)
    if (response.data.success) {
      isLoanding.value = false;
      console.log(response.data.user)
      listUsers.value.unshift(response.data.user)
      toastr.success(response.data.message, 'Validation');
      $('#adduserModal').modal('hide');
      form.value.resetForm()
    } else {
      errorResp.value = response.data.message
      isLoanding.value = false
    }
  } catch (error) {
    console.log(error)
  } finally {
    form.resetForm()
  }
}
const update = async (values) => {
  isLoanding.value = true
  try {
    const response = await UserApi.updateUser(formValues.value.id, values)
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
  } catch (error) {
    console.log(error)
  } finally {
    form.value.resetForm()
  }
}

const edit = (user) => {
  isEditing.value = true;
  $('#adduserModal').modal('show');
  form.value.resetForm()
  formValues.value = {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role_id: user.role.id
  }
}

const handlerSubmit = (values) => {
  if (isEditing.value) {
    update(values)
  } else {
    create(values)
  }
}

const deleteUser = async (id) => {
  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes'
  }).then(async (result) => {
    if (result.isConfirmed) {
      const response = await UserApi.deleteUser(id)
      if (response.data.success) {
        Swal.fire(
          'Deleted!',
          response.data.message,
          'success'
        )
        getUsers()
      } else {
        Swal.fire(
          'Warning',
          response.data.message,
          'error'
        )
      }

    }
  })
}
const changeStatus = async (user, status) => {
  try {
    const response = await UserApi.changeStatus(user.id, { status: status })
    toastr.success(response.data.message, 'Validation')
  } catch (error) {
    console.log(error)
  }
}

const getUsers = async () => {
  isDataLoanding.value = true
  isNetWorkError.value = false
  try {
    const response = await UserApi.getUsers()
    listUsers.value = response.data.data
    isDataLoanding.value = false
  } catch (error) {
    console.log(error)
    if (error.code) {
      isNetWorkError.value = true
      errorResp.value = error.message
    }
    isDataLoanding.value = false
  }
}
onMounted(async () => {
  token.value = localStorage.getItem('token')
  defaultHospital.value = JSON.parse(localStorage.getItem('hospital'))
  defaultBranch.value = JSON.parse(localStorage.getItem('branch'))
  hospitalId.id = defaultHospital.value.id
  branchId.id = defaultBranch.value.id
  await getUsers()
  await getRoles()
})

</script>
<template>
  <AdminLayout>
    <div v-if="isNetWorkError">
      <NetworkError :message=errorResp @load-data="getData" />
    </div>
    <div v-else class="card card-primary card-outline">
      <div class="card-header">
        <div class="d-flex justify-content-between">
          <div>
            <h5 class="m-0"><i class="fa fa-list" aria-hidden="true"></i> List of users</h5>
          </div>
          <div>
            <button @click="add" type="button" class="btn btn-primary btn-sm"><i class="fa fa-plus-circle"
                aria-hidden="true"></i> New</button>
          </div>
        </div>
      </div>
      <div class="card-body">
        <div v-if="isDataLoanding" class="d-flex justify-content-center">
          <div class="spinner-border" role="status">
            <span hidden class="visually-hidden">Loading...</span>
          </div>
        </div>
        <table v-else class="table table-bordered table-sm">
          <thead>
            <tr>
              <th>#</th>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>PHONE</th>
              <th class="text-cnter">ROLE</th>
              <th>CLINIC</th>
              <th>STATUS</th>
              <th class="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            <ItemListUserWdgetVue v-for="(user, index) in listUsers" :key="user.id" :user=user :index=index
              @edit-user="edit" @change-status="changeStatus" @delete-user="deleteUser(user.id)" />
          </tbody>
        </table>
      </div>
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
                <label>User Name</label>
                <Field name="name" type="text" class="form-control" :class="{ 'is-invalid': errors.name }"
                  placeholder="Name of User" />
                <span class="invalid-feedback">{{ errors.name }}</span>
              </div>
              <div class="form-group">
                <label>User Email</label>
                <Field name="email" type="text" class="form-control" :class="{ 'is-invalid': errors.email }"
                  placeholder="Email of user" />
                <span class="invalid-feedback">{{ errors.email }}</span>
              </div>
              <div class="form-group">
                <label>User Phone</label>
                <Field name="phone" type="text" class="form-control" :class="{ 'is-invalid': errors.phone }"
                  placeholder="Phone of user" />
                <span class="invalid-feedback">{{ errors.phone }}</span>
              </div>
              <div class="form-group">
                <label for="">Role</label>
                <Field class="form-control" name="role_id" as="select" :class="{ 'is-invalid': errors.role_id }">
                  <option :value="null">Choose here</option>
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
  </AdminLayout>
</template>