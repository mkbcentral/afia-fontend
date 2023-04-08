<script setup>
import AdminLayout from '../../../layouts/AdminLayout.vue';
import { ref, onMounted } from 'vue'
import { Form, Field } from 'vee-validate'
import * as yup from 'yup'
import { useToastr } from '../../../../src/widgets/toastr.js'
import ItemListRoleWidget from './widgets/ItemListRoleWidget.vue';
import RoleApi from '../../../services/Admin/RoleApi';
import NetworkError from '../../../components/errors/Network.vue';
import Swal from 'sweetalert2'


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
        const response = await RoleApi.getRoles();
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
        const response = await RoleApi.createRole(values);
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
        const response = await RoleApi.updateRole(formValues.value.id, values)
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
        const response = await RoleApi.changeStatus(role.id, { status: status });
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
            const response = await RoleApi.deleteRole(id)
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
        const response = await RoleApi.getRoles();
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
                        <button @click="add" type="button" class="btn btn-primary btn-sm"><i class="fa fa-plus-circle"
                                aria-hidden="true"></i>New</button>
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
                    <tbody v-if="listRoles.length>0">
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
        <!--Add Modal -->
        <div class="modal fade" id="addRoleModal" tabindex="-1" aria-labelledby="addRoleModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <Form ref="form" @submit="handlerSubmit" :validation-schema="schema" v-slot="{ errors }"
                    :initial-values="formValues">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 v-if="isEditing" class="modal-title" id="addRoleModalLabel">
                                <i class="fa fa-plus-circle" aria-hidden="true"></i> EDIT ROLE
                            </h5>
                            <h5 v-else class="modal-title" id="addRoleModalLabel">
                                <i class="fas fa-edit    "></i>
                                CREATE ROLE
                            </h5>
                        </div>
                        <div class="modal-body">
                            <div class="form-group">
                                <label>Clinic Name</label>
                                <Field name="name" type="text" class="form-control" :class="{ 'is-invalid': errors.name }"
                                    placeholder="Name of clinic" />
                                <span class="invalid-feedback">{{ errors.name }}</span>
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