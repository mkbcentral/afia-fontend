<script setup>
import AdminLayout from '../../../layouts/AdminLayout.vue';
import { ref, onMounted } from 'vue'
import { Form, Field } from 'vee-validate'
import * as yup from 'yup'
import { useToastr } from '../../../../src/widgets/toastr.js'
import TypeApi from '../../../services/Admin/AdminApi.js';
import NetworkError from '../../../components/errors/Network.vue';
import ItemListTypePatientWidgetVue from './widgets/ItemListTypePatientWidget.vue';
import Swal from 'sweetalert2'

import FormModal from '../../../components/form/modals/FormModal.vue';
import FormGroup from '../../../components/form/FormGroup.vue';
import FormLabel from '../../../components/form/FormLabel.vue';
import ButtonLoanding from '../../../components/form/ButtonLoanding.vue';
import ButtonIcon from '../../../components/form/ButtonIcon.vue';
import InvalidFeedback from '../../../components/errors/InvalidFeedback.vue';


const listTypes = ref([])
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
    $('#addTypeModal').modal('show');
    form.value.resetForm()
}

const getData = async () => {
    isDataLoanding.value = true;
    isNetWorkError.value = false
    try {
        const response = await TypeApi.getData('patient-type');
        listTypes.value = response.data.data;
        isDataLoanding.value = false
    } catch (error) {
        if (error.code) {
            isNetWorkError.value = true
            errorResp.value = error.message
        }
        isDataLoanding.value = false
    }
}

const edit = (type) => {
    isEditing.value = true;
    $('#addTypeModal').modal('show');
    form.value.resetForm()
    formValues.value = {
        id: type.id,
        name: type.name,
    }
}

const create = async (values) => {
    isLoanding.value = true
    try {
        const response = await TypeApi.create('patient-type',values);
        if (response.data.success) {
            isLoanding.value = false
            listTypes.value.unshift(response.data.type)
            toastr.success(response.data.message, 'Validation')
            $('#addTypeModal').modal('hide');
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
        const response = await TypeApi.update('patient-type/',formValues.value.id, values)
        if (response.data.success) {
            isLoanding.value = false
            const index = listTypes.value.findIndex(type => type.id == response.data.type.id)
            listTypes.value[index] = response.data.type
            toastr.success(response.data.message, 'Validation')
            $('#addTypeModal').modal('hide');
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

const deleteType = async (id) => {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't delete this type patient!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes'
    }).then(async (result) => {
        try {
            if (result.isConfirmed) {
                const response = await TypeApi.delete('patient-type/',id)
                if (response.data.success) {
                    Swal.fire(
                        'Deleted!',
                        response.data.message,
                        'success'
                    )
                    listTypes.value = listTypes.value.filter(type => type.id != id);
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

const getTypes = async () => {
    isDataLoanding.value = true;
    isNetWorkError.value = false;
    try {
        const response = await TypeApi.getData('patient-type');
        listTypes.value = response.data.data;
        isDataLoanding.value = false
    } catch (error) {
        if (error.code) {
            isNetWorkError.value = true
            errorResp.value = error.message
        }
        isDataLoanding.value = false
    }
}

onMounted(async () => {
    getTypes()
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
                    <li class="breadcrumb-item active">Type patients</li>
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
                        <h5 class="m-0"><i class="fa fa-list" aria-hidden="true"></i> List of type patients</h5>
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
                    <tbody v-if="listTypes.length>0">
                        <ItemListTypePatientWidgetVue v-for="(type, index) in listTypes" :key="type.id" :type=type
                            :index=index @edit-type="edit" @delete-type="deleteType(type.id)" />
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
        <FormModal id="addTypeModal" aniamte="fade" size="" :is-editing="isEditing" modal-title="TYPE PATIENT">
            <Form ref="form" @submit="handlerSubmit" :validation-schema="schema" v-slot="{ errors }"
                :initial-values="formValues">
                <FormGroup>
                    <FormLabel id="name" for-value="name">Name of type patient</FormLabel>
                    <Field name="name" type="text" class="form-control" :class="{ 'is-invalid': errors.name }"
                        placeholder="Type patient" />
                        <InvalidFeedback>{{ errors.name }}</InvalidFeedback>
                </FormGroup>
                <div class="d-flex justify-content-end">
                    <ButtonLoanding type="submit" bg="primary" btn-size="btn-md" :is-loanding="isLoanding">Save changes</ButtonLoanding>
                </div>
            </Form>
        </FormModal>
    </AdminLayout>
</template>