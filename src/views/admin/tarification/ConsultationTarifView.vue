<script setup>
import TarificationLayout from '../../../layouts/TarificationLayout.vue';
import { ref, onMounted } from 'vue'
import { Form, Field } from 'vee-validate'
import * as yup from 'yup'
import { useToastr } from '../../../../src/widgets/toastr.js'
import ConsultationApi from '../../../services/Admin/AdminApi.js'
import Swal from 'sweetalert2'
import NetworkError from '../../../components/errors/Network.vue';
import ConsultationItemList from '../../admin/tarification/Widgets/ConsultationItemWidget.vue'

import FormModal from '../../../components/form/modals/FormModal.vue';
import FormGroup from '../../../components/form/FormGroup.vue';
import FormLabel from '../../../components/form/FormLabel.vue';
import ButtonLoanding from '../../../components/form/ButtonLoanding.vue';
import ButtonIcon from '../../../components/form/ButtonIcon.vue';
import InvalidFeedback from '../../../components/errors/InvalidFeedback.vue';
const lisConsultation = ref([])
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
    price_private: yup.number().required(),
    price_subscribe: yup.number().required(),
})

const add = async () => {
    isEditing.value = false;
    $('#addConsultationModal').modal('show');
    form.value.resetForm()
}

const edit = (consultation) => {
    isEditing.value = true;
    $('#addConsultationModal').modal('show');
    form.value.resetForm()
    formValues.value = {
        id: consultation.id,
        name: consultation.name,
        price_private: consultation.price_private,
        price_subscribe: consultation.price_subscribe,
    }
}

const create = async (values) => {
    isLoanding.value = true
    try {
        const response = await ConsultationApi.create('consultation',values);
        if (response.data.success) {
            isLoanding.value = false
            lisConsultation.value.unshift(response.data.consultation)
            toastr.success(response.data.message, 'Validation')
            $('#addConsultationModal').modal('hide');
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
        const response = await ConsultationApi.update('consultation/',formValues.value.id, values)
        if (response.data.success) {
            isLoanding.value = false
            const index = lisConsultation.value.findIndex(consultation => consultation.id == response.data.consultation.id)
            lisConsultation.value[index] = response.data.consultation
            toastr.info(response.data.message, 'Validation')
            $('#addConsultationModal').modal('hide');
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

const changeStatus = async (id) => {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't change status for this Consultation!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes'
    }).then(async (result) => {
        if (result.isConfirmed) {
            const response = await ConsultationApi.changeStatusBoolean('/consultation/status/',id);
            if (response.data.success) {
                Swal.fire(
                    'Deleted!',
                    response.data.message,
                    'success'
                )
                lisConsultation.value = lisConsultation.value.filter(cons => cons.id != id);
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

const deleteConsultation = async (id) => {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't delete this Consulation!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes'
    }).then(async (result) => {
        if (result.isConfirmed) {
            const response = await ConsultationApi.delete('consultation/',id)
            if (response.data.success) {
                Swal.fire(
                    'Deleted!',
                    response.data.message,
                    'success'
                )
                lisConsultation.value = lisConsultation.value.filter(console => console.id != id);
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

const getData = async () => {
    isDataLoanding.value = true;
    isNetWorkError.value = false
    try {
        const response = await ConsultationApi.getData('consultation');
        lisConsultation.value = response.data.data;
        isDataLoanding.value = false
    } catch (error) {
        
        if (error.code) {
            isNetWorkError.value = true
            errorResp.value = error.message
        }

        isDataLoanding.value = false
    }
}

const getConsultations = async () => {
    isDataLoanding.value = true;
    isNetWorkError.value = false;
    try {
        const response = await ConsultationApi.getData('consultation');
        lisConsultation.value = response.data.data;
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
   getConsultations();
})
</script>
<template>
    <TarificationLayout>
        <div>
            <div class="content-header">
                <div class="container-fluid">
                    <div class="d-flex justify-content-end">
                        <div class="">
                            <ol class="breadcrumb float-sm-right">
                                <li class="breadcrumb-item">
                                    <RouterLink to="/">Menu</RouterLink>
                                </li>
                                <li class="breadcrumb-item">
                                    <RouterLink to="/finance/tarification/list">Price list</RouterLink>
                                </li>
                                <li class="breadcrumb-item active">Consultation tarif</li>
                            </ol>
                        </div><!-- /.col -->
                    </div><!-- /.row -->
                </div><!-- /.container-fluid -->
            </div>
        </div>
        <div v-if="isNetWorkError">
            <NetworkError :message=errorResp @load-data="getData" />
        </div>
        <div v-else class="card card-primary card-outline">
            <div class="card-header">
                <div class="d-flex justify-content-between">
                    <div>
                        <h5 class="m-0"><i class="fa fa-list" aria-hidden="true"></i> List of consultations</h5>
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
                            <th>PRICE PRIVATE</th>
                            <th>PRICE SUBSCRIBE</th>
                            <th class="text-center">STATUS</th>
                            <th class="text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody v-if="lisConsultation.length > 0">
                        <ConsultationItemList v-for="(consultation, index) in lisConsultation" :key="consultation.id" :consultation=consultation :index=index
                            @edit-consultation="edit" @change-status="changeStatus(consultation.id)" @delete-consultation="deleteConsultation(consultation.id)" />
                    </tbody>
                    <tbody v-else>
                        <tr>
                            <td colspan="5" class="text-center p-4 text-secondary"> <i class="fas fa-database"></i> Not
                                result
                                found...</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!--Add Modal -->
        <FormModal id="addConsultationModal" aniamte="fade" size="" :is-editing="isEditing" modal-title="CONSULTATION">
            <Form ref="form" @submit="handlerSubmit" :validation-schema="schema" v-slot="{ errors }"
                :initial-values="formValues">
                <FormGroup>
                    <FormLabel id="name" for-value="name">Name role</FormLabel>
                    <Field name="name" type="text" class="form-control" :class="{ 'is-invalid': errors.name }"
                        placeholder="Name of role" />
                        <InvalidFeedback>{{ errors.name }}</InvalidFeedback>
                </FormGroup>
                <FormGroup>
                    <FormLabel id="name" for-value="name">Price private</FormLabel>
                    <Field name="price_private" type="text" class="form-control"
                    :class="{ 'is-invalid': errors.price_private }" placeholder="0" />
                        <InvalidFeedback>{{ errors.price_private }}</InvalidFeedback>
                </FormGroup>
                <FormGroup>
                    <FormLabel id="name" for-value="name">Price subscribe</FormLabel>
                    <Field name="price_subscribe" type="text" class="form-control"
                    :class="{ 'is-invalid': errors.price_subscribe }" placeholder="0" />
                        <InvalidFeedback>{{ errors.price_subscribe }}</InvalidFeedback>
                </FormGroup>
                <div class="d-flex justify-content-end">
                    <ButtonLoanding type="submit" bg="primary" btn-size="btn-md" :is-loanding="isLoanding">Save changes</ButtonLoanding>
                </div>
            </Form>
        </FormModal>
    </TarificationLayout>
</template>