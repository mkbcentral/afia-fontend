<script setup>
import AdminLayout from '../../../layouts/AdminLayout.vue';
import { ref, onMounted } from 'vue'
import { Form, Field } from 'vee-validate'
import * as yup from 'yup'
import { useToastr } from '../../../../src/widgets/toastr.js'
import CommuneApi from '../../../services/Admin/AdminApi.js';
import NetworkError from '../../../components/errors/Network.vue';
import ItemListCommuneWidget from './widgets/ItemListCommuneWidget.vue';
import Swal from 'sweetalert2'

import FormModal from '../../../components/form/modals/FormModal.vue';
import FormGroup from '../../../components/form/FormGroup.vue';
import FormLabel from '../../../components/form/FormLabel.vue';
import ButtonLoanding from '../../../components/form/ButtonLoanding.vue';
import ButtonIcon from '../../../components/form/ButtonIcon.vue';
import InvalidFeedback from '../../../components/errors/InvalidFeedback.vue';

const listCommunes = ref([])
const communeToEdit = ref({})

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
    $('#addCommuneModal').modal('show');
    
}

const getData = async () => {
    isDataLoanding.value = true;
    isNetWorkError.value = false
    try {
        const response = await CommuneApi.getData('commune');
        listCommunes.value = response.data.data;
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

const edit = (commune) => {
    isEditing.value = true;
    $('#addCommuneModal').modal('show');
    form.value.resetForm()
    formValues.value = {
        id: commune.id,
        name: commune.name,
    }
}
const create = async (values) => {
    isLoanding.value = true
    try {
        const response = await CommuneApi.create('commune',values);

        if (response.data.success) {
            isLoanding.value = false
            listCommunes.value.unshift(response.data.commune)
            toastr.success(response.data.message, 'Validation')
            $('#addCommuneModal').modal('hide');
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
        const response = await CommuneApi.update('commune/',formValues.value.id, values)
        if (response.data.success) {
            isLoanding.value = false
            const index = listCommunes.value.findIndex(commune => commune.id == response.data.commune.id)
            listCommunes.value[index] = response.data.commune
            toastr.success(response.data.message, 'Validation')
            $('#addCommuneModal').modal('hide');
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

const deleteCommune = async (id) => {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't delete this commune!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes'
    }).then(async (result) => {
        try {
            if (result.isConfirmed) {
                const response = await CommuneApi.delete('commune/',id)
                if (response.data.success) {
                    Swal.fire(
                        'Deleted!',
                        response.data.message,
                        'success'
                    )
                    listCommunes.value = listCommunes.value.filter(commune => commune.id != id);
                } else {
                    Swal.fire(
                        'Warning',
                        response.data.message,
                        'error'
                    )
                }

            }
        } catch (error) {
            Swal.fire(
                'Warning',
                error.message,
                'error'
            )
        }
    })
}

const getCommunes = async () => {
    isDataLoanding.value = true;
    isNetWorkError.value = false;
    try {
        const response = await CommuneApi.getData('commune');
        listCommunes.value = response.data.data;
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
    getCommunes()
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
                            <li class="breadcrumb-item active">Communes</li>
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
                        <h5 class="m-0"><i class="fa fa-list" aria-hidden="true"></i> List of communes</h5>
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
                            <th class="text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody v-if="listCommunes.length > 0">
                        <ItemListCommuneWidget v-for="(commune, index) in listCommunes" :key="commune.id" :commune=commune
                            :index=index @edit-commune="edit" @delete-commune="deleteCommune(commune.id)" />
                    </tbody>
                    <tbody v-else>
                        <tr>
                            <td colspan="3" class="text-center p-4 text-secondary"> <i class="fas fa-database"></i> Not
                                result
                                found...</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <!--Add Modal -->
        <FormModal id="addCommuneModal" aniamte="fade" size="" :is-editing="isEditing" modal-title="COMMUNE">
            <Form ref="form" @submit="handlerSubmit" :validation-schema="schema" v-slot="{ errors }"
                :initial-values="formValues">
                <FormGroup>
                    <FormLabel id="name" for-value="name">Name of commune</FormLabel>
                    <Field name="name" type="text" class="form-control" :class="{ 'is-invalid': errors.name }"
                        placeholder="Name of commune" />
                        <InvalidFeedback>{{ errors.name }}</InvalidFeedback>
                </FormGroup>
                <div class="d-flex justify-content-end">
                    <ButtonLoanding type="submit" bg="primary" btn-size="btn-md" :is-loanding="isLoanding">Save changes</ButtonLoanding>
                </div>
            </Form>
        </FormModal>
    </AdminLayout>
</template>