<script setup>
import AdminLayout from '../../../layouts/AdminLayout.vue';
import axios from 'axios';
import { ref, reactive, onMounted } from 'vue'
import { Form, Field } from 'vee-validate'
import * as yup from 'yup'
import { useToastr } from '../../../../src/widgets/toastr.js'
import ItemListRoleWidget from './widgets/ItemListRoleWidget.vue';


const listRoles = ref([])
const token = ref('')
let errors = ref({})
let errorResp = ref('')
const isLoanding = ref(false)
const isEditing = ref(true)
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

const getRoles = async () => {
    await axios.get('http://127.0.0.1:8000/api/v1/role', {
        headers: {
            'Authorization': `Bearer ${token.value}`
        }
    }).then((response) => {
        listRoles.value = response.data.data
    });
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
    await axios
        .post('http://127.0.0.1:8000/api/v1/role', values, {
            headers: {
                'Authorization': `Bearer ${token.value}`
            }
        })
        .then((response) => {
            if (response.data.success) {
                console.log(response.data)
                isLoanding.value = false
                getRoles()
                toastr.success(response.data.message, 'Validation')
                $('#addRoleModal').modal('hide');
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
        .put('http://127.0.0.1:8000/api/v1/role/' + formValues.value.id, values, {
            headers: {
                'Authorization': `Bearer ${token.value}`
            }
        })
        .then((response) => {
            if (response.data.success) {
                isLoanding.value = false
                getRoles()
                toastr.success(response.data.message, 'Validation')
                $('#addRoleModal').modal('hide');
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

const handlerSubmit = (values) => {
    if (isEditing.value) {
        update(values)
    } else {
        create(values)
    }
}

const changeStatus = async (role, status) => {
  console.log(status)
  await axios.put('http://127.0.0.1:8000/api/v1/role/status/' + role.id, { status: status }, {
    headers: {
      'Authorization': `Bearer ${token.value}`
    }
  }).then((response) => {
    toastr.success(response.data.message, 'Validation')
  });
}

onMounted(async () => {
    token.value = localStorage.getItem('token')
    getRoles()
})
</script>
<template>
    <AdminLayout>
        <div class="card card-primary card-outline">
            <div class="card-header">
                <div class="d-flex justify-content-between">
                    <div>
                        <h5 class="m-0">List of roles</h5>
                    </div>
                    <div>
                        <button @click="add" type="button" class="btn btn-primary btn-sm">New</button>
                    </div>

                </div>
            </div>
            <Suspense>
                <template #default>
                    <div class="card-body">
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>NAME</th>
                                    <th>STATUS</th>
                                    <th class="text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <ItemListRoleWidget v-for="(role, index) in listRoles" :key="role.id" :role=role
                                    :index=index @edit-role="edit" @change-status="changeStatus" />
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