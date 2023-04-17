<script setup>
import ReceptionLayout from '../../../../layouts/ReceptionLayout.vue';
import { ref, onMounted } from 'vue';
import * as yup from 'yup'
import { Form, Field } from 'vee-validate'
import { vMaska } from "maska"
import CommuneApi from '../../../../services/Admin/CommuneApi.js'
import ApiPatient from '../../../../services/Patients/PatientApi.js'
import ApiTypePatient from '../../../../services/Admin/TypeApi.js'
import ApiCompany from '../../../../services/Admin/CompanyApi.js'
import { useToastr } from '../../../../widgets/toastr.js'
import { useRouter, useRoute } from 'vue-router'
import flatpickr from "flatpickr";
import 'flatpickr/dist/themes/dark.css'

const router = useRouter()
const route = useRoute()
const toastr = useToastr()

const isLoanding = ref(false)
const isEditing = ref(false)

const form = ref(null)
const listCommunes = ref([])
const formValues = ref({})
const isNetWorkError = ref(false)
let errorResp = ref('')
const isDataLoanding = ref(false)

const listTypes = ref([])
const listCompanies = ref([])

const schema = yup.object({
    name: yup.string().required(),
    gender: yup.string().required(),
    date_of_birth: yup.string().required(),
    phone: yup.string().required(),
    other_phone: yup.string().required(),
    commune_id: yup.string().required(),
    quartier: yup.string().required(),
    street: yup.string().required(),
    parcel_number: yup.number().required(),
    company_id: yup.number().required(),
    patient_type_id: yup.number().required(),
    registration_number: yup.number().required(),
})
const create = async (values) => {
    isLoanding.value = true;
    try {
        const response = await ApiPatient.createPatient(values, '/patient-subscribe')
        if (response.data.success) {
            isLoanding.value = false;
            toastr.success(response.data.message, 'Validation');
            router.push('/reception/patient-subscribed')
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

const update = async (values) => {
    isLoanding.value = true;
    console.log(values)
    try {
        const response = await ApiPatient.updatePatient(route.params.id, values, '/patient-subscribe/')
        if (response.data.success) {
            isLoanding.value = false;
            toastr.info(response.data.message, 'Validation');
            router.push('/reception/patient-subscribed')
        } else {
            if (response.data.errors) {
                errorResp.value = response.data.errors
            } else {
                errorResp.value = response.data.message
            }
            isLoanding.value = false
            toastr.error(errorResp.value, 'Error')
        }
    } catch (error) {
        if (error.code) {
            isNetWorkError.value = true
            errorResp.value = error.message
            toastr.error(errorResp.value, 'Errors')
        } else if (error.response.status == 422) {
            errors.value = error.response.data.errors
            isLoanding.value = false
            toastr.error(error.response.data.errors, 'Error')
        }
        isLoanding.value = false;
    }
}

const handlerSubmit = (values) => {
    if (isEditing.value) {
        update(values)
    } else {
        create(values)
    }
}

const getCommunes = async () => {
    try {
        const response = await CommuneApi.getCommunes();
        listCommunes.value = response.data.data
    } catch (error) {
        if (error.code) {
            console.log(error.message)
        }
    }
}

const getCompanies = async () => {
    try {
        const response = await ApiCompany.getCompanies();
        listCompanies.value = response.data.data
    } catch (error) {
        if (error.code) {
            isNetWorkError.value = true
            errorResp.value = error.message
        }
        isDataLoanding.value = false
    }
}

const getTypePatients = async () => {
    try {
        const response = await ApiTypePatient.getTypes();
        listTypes.value = response.data.data
    } catch (error) {
        if (error.code) {
            console.log(error.message)
        }
    }
}

const getPaptient = async () => {
    isDataLoanding.value = true
    try {
        const response = await ApiPatient.getPatient('/patient-subscribe/', route.params.id);
        console.log(response.data.data)
        formValues.value = {
            name: response.data.data.name,
            gender: response.data.data.gender,
            date_of_birth: response.data.data.date_of_birth,
            phone: response.data.data.phone,
            commune_id: response.data.data.commune.id,
            other_phone: response.data.data.other_phone,
            quartier: response.data.data.quartier,
            street: response.data.data.street,
            registration_number: response.data.data.registration_number,
            parcel_number: response.data.data.parcel_number,
            company_id: response.data.data.company.id,
            patient_type_id: response.data.data.type.id,
            
        }
        isDataLoanding.value = false
    } catch (error) {
        if (error.code) {
            console.log(error.message)
        }
        isDataLoanding.value = false
    }
}

onMounted(async () => {
    if (route.name === 'edit.patient.subscribe') {
        isEditing.value = true
        getPaptient()
    }
    flatpickr(".flatpickr", {
        enableTime: false,
        dateFormat: "d/m/Y"
    })
    await getCommunes()
    await getTypePatients()
    await getCompanies()
})

</script>
<template>
    <ReceptionLayout>
        <div class="content-header">
            <div class="container-fluid">
                <div class="d-flex justify-content-end">
                    <div class="">
                        <ol class="breadcrumb float-sm-right">
                            <li class="breadcrumb-item">
                                <RouterLink to="/reception/patient-subscribed">List patients</RouterLink>
                            </li>
                            <li class="breadcrumb-item active">
                                <span v-if="isEditing">Edit patient</span>
                                <span v-else >Create patient</span>
                            </li>
                        </ol>
                    </div><!-- /.col -->
                </div><!-- /.row -->
            </div><!-- /.container-fluid -->
        </div>
        <div v-if="isDataLoanding" class="d-flex justify-content-center">
            <div class="spinner-border" role="status">
                <span hidden class="visually-hidden">Loading...</span>
            </div>
        </div>
        <Form v-else ref="form" @submit="handlerSubmit" :validation-schema="schema" v-slot="{ errors }" :initial-values="formValues">
            <div class="modal-content ">
                <div class="modal-header " style="background-color: #94106C;color: white;">
                    <h5 v-if="isEditing" class="modal-title text-uppercase  text-bold " id="addPatientPrivateModalLabel">
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
                                <Field name="name" type="text" class="form-control" :class="{ 'is-invalid': errors.name }"
                                    placeholder="Name of User" />
                                <span class="invalid-feedback">{{ errors.name }}</span>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="form-group">
                                <label for="">Gender</label>
                                <Field class="form-control" name="gender" as="select"
                                    :class="{ 'is-invalid': errors.gender }">
                                    <option :value="null">Choose here</option>
                                    <option value="M">Male</option>
                                    <option value="F">Female</option>
                                </Field>
                                <span class="invalid-feedback">{{ errors.gender }}</span>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="form-group">
                                <label>Date of birth</label>
                                <Field name="date_of_birth" type="date" class="form-control "
                                    :class="{ 'is-invalid': errors.date_of_birth }" placeholder="Date of birth of User" />
                                <span class="invalid-feedback">{{ errors.date_of_birth }}</span>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="form-group">
                                <label>Phone</label>
                                <Field v-maska data-maska="+243 ### ### ###" name="phone" type="text" class="form-control"
                                    :class="{ 'is-invalid': errors.phone }" placeholder="Phone" />
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
                                <label>Parcel Number</label>
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
                        <div class="col-md-3">
                            <div class="form-group">
                                <label>Type patient</label>
                                <Field class="form-control" name="patient_type_id" as="select" id=""
                                    :class="{ 'is-invalid': errors.patient_type_id }">
                                    <option :value="null">Choose here</option>
                                    <option v-for="type in listTypes" :value="type.id">{{ type.name }}</option>
                                </Field>
                                <span class="invalid-feedback">{{ errors.patient_type_id }}</span>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="form-group">
                                <label>Companies</label>
                                <Field class="form-control" name="company_id" as="select" id=""
                                    :class="{ 'is-invalid': errors.company_id }">
                                    <option :value="null">Choose here</option>
                                    <option v-for="company in listCompanies" :value="company.id">{{ company.name }}
                                    </option>
                                </Field>
                                <span class="invalid-feedback">{{ errors.company_id }}</span>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="form-group">
                                <label>Matricule</label>
                                <Field name="registration_number" type="number" class="form-control" 
                                    :class="{ 'is-invalid': errors.registration_number }" placeholder="Matricule" />
                                <span class="invalid-feedback">{{ errors.registration_number }}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="submit" class="btn" style="background-color: #94106C;color: white;">
                        <div class="d-flex justify-content-center">
                            <div v-if="isLoanding" class="spinner-border text-light" role="status"></div>
                            <div class="pl-2"> Save changes</div>
                        </div>

                    </button>
                </div>
            </div>
        </Form>
    </ReceptionLayout>
</template>