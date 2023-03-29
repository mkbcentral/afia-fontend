<script setup>
import AdminLayout from '../../../layouts/AdminLayout.vue';
import { ref, reactive, onMounted } from 'vue'
import { Form, Field } from 'vee-validate'
import * as yup from 'yup'
import { useToastr } from '../../../../src/widgets/toastr.js'
import BranchItemWidget from './widgets/BranchItemWidget.vue';
import BranchApi from '../../../services/Admin/BranchApi';
import NetworkError from '../../../components/errors/Network.vue'
import Swal from 'sweetalert2'

const listSubscriptions = ref([])

const defaulthHospital = ref()
const hospitalId = reactive({
    branch_id: 0
})

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

const schema = yup.object({
    name: yup.string().required(),
})

const add = async () => {
    isEditing.value = false;
    $('#addBranchModal').modal('show');
    form.value.resetForm()
}

const getData = async () => {
    isDataLoanding.value = true
    isNetWorkError.value = false
    try {
        const response = await BranchApi.getBranches();
        listSubscriptions.value = response.data.data
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

const edit = (branch) => {
    isEditing.value = true;
    $('#addBranchModal').modal('show');
    form.value.resetForm()
    formValues.value = {
        id: branch.id,
        name: branch.name,
    }
}

const create = async (values) => {
    isLoanding.value = true
    values.hospital_id = hospitalId.id
    try {
        const response = await BranchApi.createBranch(values);
        if (response.data.success) {
            console.log(response.data)
            isLoanding.value = false
            getBranches()
            toastr.success(response.data.message, 'Validation')
            $('#addBranchModal').modal('hide');
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
const update = async (values) => {
    isLoanding.value = true
    try {
        const response = await BranchApi.updateBranch(formValues.value.id, values)
        if (response.data.success) {
            isLoanding.value = false
            getBranches()
            toastr.success(response.data.message, 'Validation')
            $('#addBranchModal').modal('hide');
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

const changeStatus = async (branch, status) => {
    console.log(status)
    try {
        const response = await BranchApi.changeStatus(branch.id, { status: status })
        toastr.success(response.data.message, 'Validation')
    } catch (error) {
        console.log(error)
    }
}

const deleteBranch = async (id) => {
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
        const response = await BranchApi.deleteBranch(id)
      if (response.data.success) {
        Swal.fire(
          'Deleted!',
          response.data.message,
          'success'
        )
        getBranches()
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

const getBranches = async () => {
    isDataLoanding.value = true
    isNetWorkError.value = false
    try {
        const response = await BranchApi.getBranches();
        listSubscriptions.value = response.data.data
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
    defaulthHospital.value = JSON.parse(localStorage.getItem('hospital'))
    hospitalId.id = defaulthHospital.value.id
    getBranches()
})
</script>
<template>
    <AdminLayout>

    </AdminLayout>
</template>