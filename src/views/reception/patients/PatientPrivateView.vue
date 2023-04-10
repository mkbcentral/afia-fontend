<script setup>
import ReceptionLayout from '../../../layouts/ReceptionLayout.vue';
import { ref, reactive, onMounted, watch } from 'vue'
import { Form, Field } from 'vee-validate'
import { vMaska } from "maska"
import * as yup from 'yup'
import { useToastr } from '../../../../src/widgets/toastr.js'
import Swal from 'sweetalert2'
import { debounce } from 'lodash'
import CommuneApi from '../../../services/Admin/CommuneApi';
import ApiPatient from '../../../services/Patients/PaptientApi.js'
const listPatients = ref([])
const listCommunes = ref([])

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
const searchQuary = ref(null)

const schema = yup.object({
    name: yup.string().required(),
    gender: yup.string().required(),
    data_of_birth: yup.string().required(),
    phone: yup.string().required(),
    other_phone: yup.string().required(),
    commune_id: yup.string().required(),
    quartier: yup.string().required(),
    street: yup.string().required(),
    parcel_number: yup.number().required(),
})

const add = async () => {
    isEditing.value = false;
    $('#addPatientPrivateModal').modal('show');
    form.value.resetForm()
}

const getCommunes = async () => {
    try {
        const response = await CommuneApi.getCommunes();
        listCommunes.value = response.data.data
        console.log(response.data.data)
    } catch (error) {
        if (error.code) {
            isNetWorkError.value = true
            errorResp.value = error.message
            console.log(error)
        }
        isDataLoanding.value = false
    }
}

const create = async (values) => {
    isLoanding.value = true;
    try {
        const response = await ApiPatient.createPatient(values, '/patient-private')
        if (response.data.success) {
            isLoanding.value = false;
            console.log(response.data.patient)
            //listUsers.value.unshift(response.data.user)
            toastr.success(response.data.message, 'Validation');
            $('#addPatientPrivateModal').modal('hide');
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
        if (error.code) {
            isNetWorkError.value = true
            errorResp.value = error.message
            toastr.error(errorResp.value, 'Errors')
        }
        isLoanding.value = false;
    }
}

const update = async(values)=>{
    console.log(values)
}

const handlerSubmit = (values) => {
    if (isEditing.value) {
        update(values)
    } else {
        create(values)
    }

}
onMounted(async () => {
    await getCommunes()
})
</script>
<template>
    <ReceptionLayout>
        <div class="card">
            <div class="card-header">
                <p><i class="fas fa-user-shield text-secondary fa-2x"></i> PATIENTS PRIVATES</p>
            </div>
            <div class="card-body">
                <div class="d-flex justify-content-between">
                    <div>
                        <h5 class="m-0"><i class="fa fa-list" aria-hidden="true"></i> List of patients</h5>
                    </div>
                    <div>
                        <button @click="add" type="button" class="btn btn-primary btn-sm"><i class="fa fa-plus-circle"
                                aria-hidden="true"></i> New</button>
                    </div>
                </div>
            </div>
        </div>
        <!-- Modal patient -->
        <div class="modal fade" id="addPatientPrivateModal" tabindex="-1" aria-labelledby="addPatientPrivateModalLabel"
            aria-hidden="true">
            <div class="modal-dialog modal-xl">
                <Form ref="form" @submit="handlerSubmit" :validation-schema="schema" v-slot="{ errors }" :initial-values="formValues">
                    <div class="modal-content ">
                        <div class="modal-header " style="background-color: #032880;color: white;">
                            <h5 v-if="isEditing" class="modal-title text-uppercase  text-bold "
                                id="addPatientPrivateModalLabel">
                                <i class="fa fa-plus-circle" aria-hidden="true"></i> EDIT PATIENT
                            </h5>
                            <h5 v-else class="modal-title" id="addPatientPrivateModalLabel">
                                <i class="fas fa-user-plus"></i>
                                CREATE NEW PATIENT
                            </h5>
                        </div>
                        <div class="modal-body">
                            <div class="row">
                                <div class="col-md-3">
                                    <div class="form-group">
                                        <label>User Name</label>
                                        <Field name="name" type="text" class="form-control"
                                            :class="{ 'is-invalid': errors.name }" placeholder="Name of User" />
                                        <span class="invalid-feedback">{{ errors.name }}</span>
                                    </div>
                                </div>
                                <div class="col-md-3">
                                    <div class="form-group">
                                        <label for="">Gender</label>
                                        <Field class="form-control" name="gender" as="select"
                                            :class="{ 'is-invalid': errors.gender }">
                                            <option :value="null">Choose here</option>
                                            <option value="M">Female</option>
                                            <option value="F">Male</option>
                                        </Field>
                                        <span class="invalid-feedback">{{ errors.gender }}</span>
                                    </div>
                                </div>
                                <div class="col-md-3">
                                    <div class="form-group">
                                        <label>Date of birth</label>
                                        <Field name="data_of_birth" type="date" class="form-control"
                                            :class="{ 'is-invalid': errors.data_of_birth }"
                                            placeholder="Date of birth of User" />
                                        <span class="invalid-feedback">{{ errors.data_of_birth }}</span>
                                    </div>
                                </div>
                                <div class="col-md-3">
                                    <div class="form-group">
                                        <label>Phone</label>
                                        <Field v-maska data-maska="+243 ### ### ###" name="phone" type="text"
                                            class="form-control" :class="{ 'is-invalid': errors.phone }"
                                            placeholder="Phone" />
                                        <span class="invalid-feedback">{{ errors.phone }}</span>
                                    </div>
                                </div>

                            </div>
                            <div class="row">
                                <div class="col-md-3">
                                    <div class="form-group">
                                        <label>Other phone</label>
                                        <Field v-maska data-maska="+243 ### ### ###" name="other_phone" type="text"
                                            class="form-control" :class="{ 'is-invalid': errors.other_phone }"
                                            placeholder="other_phone" />
                                        <span class="invalid-feedback">{{ errors.other_phone }}</span>
                                    </div>
                                </div>
                                <div class="col-md-3">
                                    <div class="form-group">
                                        <label>Commune</label>
                                        <Field class="form-control" name="commune_id" as="select" id=""
                                            :class="{ 'is-invalid': errors.commune_id }">
                                            <option :value="null">Choose here</option>
                                            <option v-for="commune in listCommunes" :value="commune.id">{{ commune.name }}
                                            </option>
                                        </Field>
                                        <span class="invalid-feedback">{{ errors.commune_id }}</span>
                                    </div>
                                </div>
                                <div class="col-md-3">
                                    <div class="form-group">
                                        <label>¨Parcel Number</label>
                                        <Field name="parcel_number" type="text" class="form-control"
                                            :class="{ 'is-invalid': errors.parcel_number }" placeholder="parcel_number" />
                                        <span class="invalid-feedback">{{ errors.parcel_number }}</span>
                                    </div>
                                </div>
                                <div class="col-md-3">
                                    <div class="form-group">
                                        <label>Quartier</label>
                                        <Field name="quartier" type="text" class="form-control"
                                            :class="{ 'is-invalid': errors.quartier }" placeholder="Quartier" />
                                        <span class="invalid-feedback">{{ errors.quartier }}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-3">
                                    <div class="form-group">
                                        <label>Street</label>
                                        <Field name="street" type="text" class="form-control"
                                            :class="{ 'is-invalid': errors.street }" placeholder="Street" />
                                        <span class="invalid-feedback">{{ errors.street }}</span>
                                    </div>
                                </div>
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
    </ReceptionLayout></template>