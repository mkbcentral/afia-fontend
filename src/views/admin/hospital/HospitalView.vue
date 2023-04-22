<script setup>
import AdminLayout from '../../../layouts/AdminLayout.vue';
import { ref, onMounted } from 'vue'
import { Form, Field } from 'vee-validate'
import { vMaska } from "maska"
import * as yup from 'yup'
import { useToastr } from '../../../../src/widgets/toastr.js'
import HospitalItemList from './widgets/HospitalItemList.vue';
import HospitalApi from '../../../services/Admin/AdminApi.js';
import NetworkError from '../../../components/errors/Network.vue'
import Swal from 'sweetalert2';
import FormModal from '../../../components/from/modals/FormModal.vue';
import FormGroup from '../../../components/from/FormGroup.vue';
import FormLabel from '../../../components/from/FormLabel.vue';
import ButtonLoanding from '../../../components/from/ButtonLoanding.vue';
import ButtonIcon from '../../../components/from/ButtonIcon.vue';
import InvalidFeedback from '../../../components/errors/InvalidFeedback.vue';

const listHospitals = ref([])
const hospitalToEdit = ref({})
const token = ref('')
let errors = ref({})
let errorResp = ref('')

const isLoanding = ref(false)
const isDataLoanding = ref(false)
const isEditing = ref(true)
const isNetWorkError = ref(false)

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

const getData = async () => {
  isDataLoanding.value = true
  isNetWorkError.value = false
  try {
    const response = await HospitalApi.getData('/hospital')
    listHospitals.value = response.data.data
    isDataLoanding.value = false
  } catch (error) {
    console.log(error);
    if (error.code) {
      isNetWorkError.value = true
    }
    isDataLoanding.value = false
  }
}

const create = async (values) => {
  isLoanding.value = true
  try {
    const response = await HospitalApi.create('hospital', values);
    console.log(response);
    if (response.data.success) {
      console.log(response.data)
      isLoanding.value = false
      listHospitals.value.unshift(response.data.hospital)
      toastr.success(response.data.message, 'Validation')
      $('#addHospitalModal').modal('hide');
      form.value.resetForm()
    } else {
      if (response.data.errors) {
        errorResp.value = response.data.errors
      } else {
        errorResp.value = response.data.message
      }
      isLoanding.value = false
      toastr.error(errorResp.value, 'Validation')
    }
  } catch (error) {
    console.log(error)
  } finally {
    form.value.resetForm()
  }
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
const update = async (values) => {
  isLoanding.value = true
  try {
    const response = await HospitalApi.update('hospital/', formValues.value.id, values);
    if (response.data.success) {
      isLoanding.value = false
      const index = listHospitals.value.findIndex(hospital => hospital.id == response.data.hospital.id)
      listHospitals.value[index] = response.data.hospital
      toastr.success(response.data.message, 'Validation')
      $('#addHospitalModal').modal('hide');
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

const deleteHospital = async (id) => {
  Swal.fire({
    title: 'Are you sure?',
    text: "You won't delete this role!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes'
  }).then(async (result) => {
    if (result.isConfirmed) {
      const response = await HospitalApi.delete('hospital/', id);
      if (response.data.success) {
        Swal.fire(
          'Deleted!',
          response.data.message,
          'success'
        )
        listHospitals.value = listHospitals.value.filter(hospital => hospital.id != id);
      } else {
        Swal.fire(
          'Warning',
          response.data.message,
          'error'
        )
      }
    }
  });
}

const changeStatus = async (hospital, status) => {
  console.log({ status: status });
  try {
    const response = await HospitalApi.changeStatusString('/hospital/status/', hospital.id, { status: status });
    toastr.success(response.data.message, 'Validation')
  } catch (error) {
    console.log(error)
  }
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
    , data, {
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

const getHospitals = async () => {
  isDataLoanding.value = true
  isNetWorkError.value = false
  try {
    const response = await HospitalApi.getData('/hospital')
    listHospitals.value = response.data.data
    isDataLoanding.value = false
  } catch (error) {
    console.log(error);
    if (error.code) {
      isNetWorkError.value = true
      errorResp.value = error.message
    }
    isDataLoanding.value = false
  }
}
onMounted(async () => {
  token.value = localStorage.getItem('token')
  await getHospitals()
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
              <li class="breadcrumb-item active">Hopsital</li>
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
            <h5 class="m-0"><i class="fa fa-list" aria-hidden="true"></i> List of clinics</h5>
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
        <table v-else class="table table-bordered table-sm">
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
              :index=index @edit-hospital="edit" @change-status="changeStatus"
              @delete-hospital="deleteHospital(hospital.id)" @change-logo="changeLogo" />
          </tbody>
        </table>
      </div>
    </div>
    <FormModal id="addHospitalModal" aniamte="fade" size="" :is-editing="isEditing" modal-title="HOSPITAL">
      <Form ref="form" @submit="handlerSubmit" :validation-schema="schema" v-slot="{ errors }"
        :initial-values="formValues">
        <FormGroup>
          <FormLabel id="name" for-value="name">Name of hospital</FormLabel>
          <Field name="name" type="text" class="form-control" :class="{ 'is-invalid': errors.name }"
            placeholder="Name of clinic" />
            <InvalidFeedback>{{ errors.name }}</InvalidFeedback>
        </FormGroup>
        <FormGroup>
          <FormLabel id="name" for-value="name">Email of hospital</FormLabel>
          <Field name="email" type="text" class="form-control" :class="{ 'is-invalid': errors.email }"
            placeholder="Email of clinic" />
            <InvalidFeedback>{{ errors.email }}</InvalidFeedback>
        </FormGroup>
        <FormGroup>
          <FormLabel id="name" for-value="name">Email of hospital</FormLabel>
          <Field v-maska data-maska="+243 ### ### ###" name="phone" type="text" class="form-control"
            :class="{ 'is-invalid': errors.phone }" placeholder="Phone of clinic" />
            <InvalidFeedback>{{ errors.phone }}</InvalidFeedback>
        </FormGroup>
        <div class="d-flex justify-content-end">
          <ButtonLoanding type="submit" bg="primary" btn-size="btn-md" :is-loanding="isLoanding">Save changes
          </ButtonLoanding>
        </div>
      </Form>
    </FormModal>
  </AdminLayout>
</template>