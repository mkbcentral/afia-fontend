<script setup>
import AdminLayout from '../../../layouts/AdminLayout.vue';
import { ref, reactive, onMounted } from 'vue'
import { Form, Field } from 'vee-validate'
import * as yup from 'yup'
import { useToastr } from '../../../../src/widgets/toastr.js'
import BranchItemWidget from './widgets/BranchItemWidget.vue';
import BranchApi from '../../../services/Admin/AdminApi.js';
import NetworkError from '../../../components/errors/Network.vue'
import Swal from 'sweetalert2'
import FormModal from '../../../components/form/modals/FormModal.vue';
import FormGroup from '../../../components/form/FormGroup.vue';
import FormLabel from '../../../components/form/FormLabel.vue';
import ButtonLoanding from '../../../components/form/ButtonLoanding.vue';
import ButtonIcon from '../../../components/form/ButtonIcon.vue';
import InvalidFeedback from '../../../components/errors/InvalidFeedback.vue';

const listBranches = ref([])

const defaulthHospital = ref()
const hospitalId = reactive({
    branch_id: 0
})

const token = ref('')
let errors = ref({})
let errorResp = ref('')

const isLoanding = ref(false)
const isDataLoanding = ref(false)
const isEditing = ref(false)
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
        const response = await BranchApi.getData('branch');
        listBranches.value = response.data.data
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

const create = async (values) => {
    isLoanding.value = true
    try {
        const response = await BranchApi.create('branch', values);
        if (response.data.success) {
            console.log(response.data)
            isLoanding.value = false
            listBranches.value.push(response.data.branch)
            toastr.success(response.data.message, 'Validation')
            $('#addBranchModal').modal('hide');
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
const edit = (branch) => {
    isEditing.value = true;
    $('#addBranchModal').modal('show');
    form.value.resetForm()
    formValues.value = {
        id: branch.id,
        name: branch.name,
    }
}
const update = async (values) => {
    isLoanding.value = true
    try {
        const response = await BranchApi.update('branch/', formValues.value.id, values)
        if (response.data.success) {
            isLoanding.value = false
            const index = listBranches.value.findIndex(branch => branch.id == response.data.branch.id)
            listBranches.value[index] = response.data.branch
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
        const response = await BranchApi.changeStatusString('/branch/status/', branch.id, { status: status })
        toastr.success(response.data.message, 'Validation')
    } catch (error) {
        console.log(error)
    }
}

const deleteBranch = async (id) => {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't delete this center!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes'
    }).then(async (result) => {
        if (result.isConfirmed) {
            const response = await BranchApi.delete('branch/', id)
            if (response.data.success) {
                Swal.fire(
                    'Deleted!',
                    response.data.message,
                    'success'
                )
                listBranches.value = listBranches.value.filter(branch => branch.id != id);
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
        const response = await BranchApi.getData('branch');
        listBranches.value = response.data.data
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
                            <li class="breadcrumb-item active">Centers</li>
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
                        <h5 class="m-0"><i class="fa fa-list" aria-hidden="true"></i> List of centers</h5>
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
                            <th class="text-center">#</th>
                            <th>NAME</th>
                            <th>STATUS</th>
                            <th class="text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <BranchItemWidget v-for="(branch, index) in listBranches" :key="branch.id" :branch=branch
                            :index=index @edit-branch="edit" @change-status="changeStatus"
                            @delete-branch="deleteBranch(branch.id)" />
                    </tbody>
                </table>
            </div>
        </div>
        <FormModal id="addBranchModal" aniamte="fade" size="" :is-editing="isEditing" modal-title="CENTER">
            <Form ref="form" @submit="handlerSubmit" :validation-schema="schema" v-slot="{ errors }"
                :initial-values="formValues">
                <FormGroup>
                    <FormLabel id="name" for-value="name">Name of clinic</FormLabel>
                    <Field name="name" type="text" class="form-control" :class="{ 'is-invalid': errors.name }"
                        placeholder="Name of center" />
                        <InvalidFeedback>{{ errors.name }}</InvalidFeedback>
                </FormGroup>
                <div class="d-flex justify-content-end">
                    <ButtonLoanding type="submit" bg="primary" btn-size="btn-md" :is-loanding="isLoanding">Save changes</ButtonLoanding>
                </div>
            </Form>
        </FormModal>
    </AdminLayout>
</template> 