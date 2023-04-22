<script setup>
import AdminLayout from '../../../layouts/AdminLayout.vue';
import { ref, onMounted } from 'vue'
import { Form, Field } from 'vee-validate'
import * as yup from 'yup'
import { useToastr } from '../../../../src/widgets/toastr.js'
import ItemListRoleWidget from './widgets/ItemListRoleWidget.vue';
import RoleApi from '../../../services/Admin/AdminApi';
import NetworkError from '../../../components/errors/Network.vue';
import Swal from 'sweetalert2'
import FormModal from '../../../components/from/modals/FormModal.vue';
import FormGroup from '../../../components/from/FormGroup.vue';
import FormLabel from '../../../components/from/FormLabel.vue';
import ButtonLoanding from '../../../components/from/ButtonLoanding.vue';
import ButtonIcon from '../../../components/from/ButtonIcon.vue';
import InvalidFeedback from '../../../components/errors/InvalidFeedback.vue';


const listRoles = ref([])
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
    $('#addRoleModal').modal('show');
    form.value.resetForm()
}

const getData = async () => {
    isDataLoanding.value = true;
    isNetWorkError.value = false
    try {
        const response = await RoleApi.getData('role');
        listRoles.value = response.data.data;
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

const edit = (role) => {
    isEditing.value = true;
    $('#addRoleModal').modal('show');
    form.value.resetForm()
    formValues.value = {
        id: role.id,
        name: role.name,
    }
}

const create = async (values) => {
    isLoanding.value = true
    try {
        const response = await RoleApi.create('role',values);
        if (response.data.success) {
            isLoanding.value = false
            listRoles.value.unshift(response.data.role)
            toastr.success(response.data.message, 'Validation')
            $('#addRoleModal').modal('hide');
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
        console.log(error);
    } finally {
        form.value.resetForm()
    }
}
const update = async (values) => {
    isLoanding.value = true
    try {
        const response = await RoleApi.update('role/',formValues.value.id, values)
        if (response.data.success) {
            isLoanding.value = false
            const index = listRoles.value.findIndex(role => role.id == response.data.role.id)
            listRoles.value[index] = response.data.role
            toastr.success(response.data.message, 'Validation')
            $('#addRoleModal').modal('hide');
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

const handlerSubmit = (values) => {
    if (isEditing.value) {
        update(values)
    } else {
        create(values)
    }
}

const changeStatus = async (role, status) => {
    try {
        const response = await RoleApi.changeStatusString('/role/status/',role.id, { status: status });
        toastr.success(response.data.message, 'Validation')
    } catch (error) {
        console / log(error)
    }
}

const deleteRole = async (id) => {
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
            const response = await RoleApi.delete('role',id)
            if (response.data.success) {
                Swal.fire(
                    'Deleted!',
                    response.data.message,
                    'success'
                )
                listRoles.value = listRoles.value.filter(role => role.id != id);
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

const getRoles = async () => {
    isDataLoanding.value = true;
    isNetWorkError.value = false;
    try {
        const response = await RoleApi.getData('role');
        listRoles.value = response.data.data;
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
    getRoles()
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
                            <li class="breadcrumb-item active">Roles</li>
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
                        <h5 class="m-0"><i class="fa fa-list" aria-hidden="true"></i> List of roles</h5>
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
                    <tbody v-if="listRoles.length > 0">
                        <ItemListRoleWidget v-for="(role, index) in listRoles" :key="role.id" :role=role :index=index
                            @edit-role="edit" @change-status="changeStatus" @delete-role="deleteRole(role.id)" />
                    </tbody>
                    <tbody v-else>
                        <tr>
                            <td colspan="4" class="text-center p-4 text-secondary"> <i class="fas fa-database"></i> Not
                                result
                                found...</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <FormModal id="addRoleModal" aniamte="fade" size="" :is-editing="isEditing" modal-title="ROLE">
            <Form ref="form" @submit="handlerSubmit" :validation-schema="schema" v-slot="{ errors }"
                :initial-values="formValues">
                <FormGroup>
                    <FormLabel id="name" for-value="name">Name role</FormLabel>
                    <Field name="name" type="text" class="form-control" :class="{ 'is-invalid': errors.name }"
                        placeholder="Name of role" />
                        <InvalidFeedback>{{ errors.name }}</InvalidFeedback>
                </FormGroup>
                <div class="d-flex justify-content-end">
                    <ButtonLoanding type="submit" bg="primary" btn-size="btn-md" :is-loanding="isLoanding">Save changes</ButtonLoanding>
                </div>
            </Form>
        </FormModal>
    </AdminLayout>
</template>