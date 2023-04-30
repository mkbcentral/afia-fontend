<script setup>
import AdminLayout from '../../../layouts/AdminLayout.vue';
import { ref, onMounted, watch } from 'vue'
import { Form, Field } from 'vee-validate'
import { vMaska } from "maska"
import * as yup from 'yup'
import { useToastr } from '../../../../src/widgets/toastr.js'
import UserApi from '../../../services/Admin/AdminApi.js';
import RoleApi from '../../../services/Admin/AdminApi.js';
import ItemListUserWdgetVue from './widgets/ItemListUserWdget.vue';
import NetworkError from '../../../components/errors/Network.vue';
import Swal from 'sweetalert2/dist/sweetalert2.all.min.js'
import { debounce } from 'lodash'
import FormModal from '../../../components/from/modals/FormModal.vue';
import FormGroup from '../../../components/from/FormGroup.vue';
import FormLabel from '../../../components/from/FormLabel.vue';
import ButtonLoanding from '../../../components/from/ButtonLoanding.vue';
import ButtonIcon from '../../../components/from/ButtonIcon.vue';
import InvalidFeedback from '../../../components/errors/InvalidFeedback.vue';


const listUsers = ref([])
const listRoles = ref([])

let errorResp = ref('')

const isLoanding = ref(false)
const isDataLoanding = ref(false)
const isEditing = ref(false)
const isNetWorkError = ref(false)

const formValues = ref()
const form = ref(null)
const toastr = useToastr()
const searchQuary = ref(null)
const page = ref(5)
const pageCount = ref(null)
const currentPage = ref(1);

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
    const response = await UserApi.getData('user?page_page=' + page.value)
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

const getDataPagination = async (p) => {
  try {
    const response = await UserApi.getData('user?page_page=' + page.value + '&page=' + p)
    listUsers.value = response.data.data
  } catch (error) {
    if (error.code) {
      isNetWorkError.value = true
      errorResp.value = error.message
    }
  }
}

const getRoles = async () => {
  try {
    const response = await RoleApi.getData('role');
    listRoles.value = response.data.data
  } catch (error) {
    if (error.code) {
      isNetWorkError.value = true
      errorResp.value = error.message
    }
  }
}

const create = async (values, actions) => {
  isLoanding.value = true;
  try {
    const response = await UserApi.create('user', values)
    if (response.data.success) {
      isLoanding.value = false;
      console.log(response.data.user)
      listUsers.value.unshift(response.data.user)
      toastr.success(response.data.message, 'Validation');
      $('#adduserModal').modal('hide');
      actions.resetForm();
    }
  } catch (error) {
    if (error.response.status == 422) {
      isLoanding.value = false;
      actions.setErrors(error.response.data.errors)
    } else {
      isLoanding.value = false
      toastr.error(error.message, 'Validation')
    }
  }
}
const update = async (values,actions) => {
  isLoanding.value = true
  try {
    const response = await UserApi.update('user/', formValues.value.id, values)
    if (response.data.success) {
      isLoanding.value = false
      const index = listUsers.value.findIndex(user => user.id == response.data.user.id)
      listUsers.value[index] = response.data.user
      toastr.success(response.data.message, 'Validation')
      $('#adduserModal').modal('hide');
      actions.resetForm()
    } else {
      errorResp.value = response.data.message
      isLoanding.value = false
    }
  } catch (error) {
    if (error.response.status == 422) {
      isLoanding.value = false;
      actions.setErrors(error.response.data.errors)
    } else {
      isLoanding.value = false
      toastr.error(error.message, 'Validation')
    }
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

const handlerSubmit = (values, actions) => {
  if (isEditing.value) {
    update(values, actions)
  } else {
    create(values, actions)
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
      const response = await UserApi.delete('user/', id)
      if (response.data.success) {
        Swal.fire(
          'Deleted!',
          response.data.message,
          'success'
        )
        const index = listUsers.value.findIndex(user => user.id == response.data.user.id)
        listUsers.value[index] = response.data.user
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
    const response = await UserApi.changeStatusString('/user/status/', user.id, { status: status })
    toastr.success(response.data.message, 'Validation')
    const index = listUsers.value.findIndex(user => user.id == response.data.user.id)
    listUsers.value[index] = response.data.user
  } catch (error) {
    console.log(error)
  }
}

const getUsers = async () => {
  isDataLoanding.value = true
  try {
    const response = await UserApi.getData('/user?page_page=' + page.value)
    listUsers.value = response.data.data
    isDataLoanding.value = false
    pageCount.value = response.data.meta.total
  } catch (error) {
    console.log(error)
    if (error.code) {
      errorResp.value = error.message
    }
    isDataLoanding.value = false
  }
}

const searchData = async () => {
  try {
    const response = await UserApi.searchData('users/search/', searchQuary.value);
    listUsers.value = response.data.data;
  } catch (error) {
    console.log(error)
  }
}

watch(searchQuary, debounce(() => {
  searchData()
}, 300))

onMounted(async () => {
  await getUsers()
  await getRoles()
})






</script>
<template>
  <AdminLayout>
    <div class="content-header">
      <div class="container-fluid">
        <div class="d-flex justify-content-end">
          <div class="">
            <ol class="breadcrumb float-sm-right">
              <li class="breadcrumb-item">
                <RouterLink to="/">Menu</RouterLink>
              </li>
              <li class="breadcrumb-item">
                <RouterLink to="/admin/settings">Settings</RouterLink>
              </li>
              <li class="breadcrumb-item active">Users</li>
            </ol>
          </div><!-- /.col -->
        </div><!-- /.row -->
      </div><!-- /.container-fluid -->
    </div>
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
            <ButtonIcon @click="add" type="button" bg="primary" icon="fa fa-plus">New</ButtonIcon>
          </div>
        </div>
      </div>
      <div class="card-body">
        <div v-if="isDataLoanding" class="d-flex justify-content-center">
          <div class="spinner-border" role="status">
            <span hidden class="visually-hidden">Loading...</span>
          </div>
        </div>
        <div v-else>
          <div class="d-flex">
            <div class="form-group">
              <input v-model="searchQuary" id="my-input" placeholder="Search here..." class="form-control" type="text">
            </div>
          </div>
          <table class="table table-bordered table-sm">
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
            <tbody v-if="listUsers.length > 0">
              <ItemListUserWdgetVue v-for="(user, index) in listUsers" :key="user.id" :user=user :index=index
                @edit-user="edit" @change-status="changeStatus" @delete-user="deleteUser(user.id)" :bg=user.status />
            </tbody>
            <tbody v-else>
              <tr>
                <td colspan="8" class="text-center p-4 text-secondary"> <i class="fas fa-database"></i> Not result
                  found...</td>
              </tr>
            </tbody>
          </table>

        </div>
        <div class="d-flex justify-content-end">
          <VueAwesomePaginate :total-items="pageCount" :items-per-page="page" :max-pages-shown="5" v-model="currentPage"
            :on-click="getDataPagination" />
        </div>
      </div>
    </div>
    <!-- Modal -->
    <FormModal id="adduserModal" aniamte="fade" size="" :is-editing="isEditing" modal-title="USER">
      <Form ref="form" @submit="handlerSubmit" :validation-schema="schema" v-slot="{ errors }"
        :initial-values="formValues">
        <FormGroup>
          <FormLabel id="name" for-value="name">User name</FormLabel>
          <Field name="name" type="text" class="form-control" :class="{ 'is-invalid': errors.name }"
            placeholder="Name of user" />
          <InvalidFeedback>{{ errors.name }}</InvalidFeedback>
        </FormGroup>
        <FormGroup>
          <FormLabel id="name" for-value="name">Email adress</FormLabel>
          <Field name="email" type="text" class="form-control" :class="{ 'is-invalid': errors.email }"
          placeholder="Email of user" />
          <InvalidFeedback>{{ errors.email }}</InvalidFeedback>
        </FormGroup>
        <FormGroup>
          <FormLabel id="name" for-value="name">Phone number</FormLabel>
          <Field v-maska data-maska="+243 ### ### ###" name="phone" type="text" class="form-control"
                  :class="{ 'is-invalid': errors.phone }" placeholder="Phone of user" />
          <InvalidFeedback>{{ errors.phone }}</InvalidFeedback>
        </FormGroup>
        <FormGroup>
          <FormLabel id="name" for-value="name">Role for user</FormLabel>
          <Field class="form-control" name="role_id" as="select" :class="{ 'is-invalid': errors.role_id }">
            <option :value="null">Choose here</option>
            <option v-for="role in listRoles" :value="role.id">{{ role.name }}</option>
          </Field>
          <InvalidFeedback>{{ errors.role_id }}</InvalidFeedback>
        </FormGroup>
        <div class="d-flex justify-content-end">
          <ButtonLoanding type="submit" bg="primary" btn-size="btn-md" :is-loanding="isLoanding">Save changes
          </ButtonLoanding>
        </div>
      </Form>
    </FormModal>
  </AdminLayout>
</template>