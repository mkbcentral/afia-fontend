<script setup>
import { ref, onMounted } from 'vue';
import * as yup from 'yup'
import { Form, Field } from 'vee-validate'
import { vMaska } from "maska"
import CommuneApi from '../../../../services/Admin/CommuneApi.js'
import ApiAgentService from '../../../../services/Admin/AgentServiceApi.js'
import ApiTypePatient from '../../../../services/Admin/TypeApi.js'
import ApiCompany from '../../../../services/Admin/CompanyApi.js'
const emit = defineEmits(['submitData'])
let errors = ref({})
const form = ref(null)
const formValues = ref()
const listCommunes = ref([])
const listServices = ref([])
const listTypes = ref([])
const listCompanies = ref([])
defineProps({
    isEditing: false,
    isLoanding: false,
    isAgent: false,
    isCompany: false,
    schema: {}
});

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

const getAgentServices = async () => {
    try {
        const response = await ApiAgentService.getServices();
        listServices.value = response.data.data

    } catch (error) {
        if (error.code) {
            console.log(error.message)
        }
    }
}

const getTypePatients = async () => {
    try {
        const response = await ApiTypePatient.getTypes();
        listTypes.value = response.data.data
        console.log(response.data.data)
    } catch (error) {
        if (error.code) {
            console.log(error.message)
        }
    }
}

const handlerSubmit = (values) => {
    emit('submitData', values)
}



onMounted(async () => {
    await getCommunes()
    await getAgentServices()
    await getTypePatients()
    await getCompanies()
})
</script>
<template>
    <!-- Modal patient -->
    <div class="modal fade" id="addPatientPrivateModal" tabindex="-1" aria-labelledby="addPatientPrivateModalLabel"
        aria-hidden="true">
        <div class="modal-dialog modal-xl">
            <Form ref="form" @submit="handlerSubmit" :validation-schema="schema" v-slot="{ errors }"
                :initial-values="formValues">
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
                                        class="form-control" :class="{ 'is-invalid': errors.phone }" placeholder="Phone" />
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
                            <div class="col-md-3" v-show="isAgent == true || isCompany == true">
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
                            <div class="col-md-3" v-show="isAgent == true ">
                                <div class="form-group">
                                    <label>Services</label>
                                    <Field class="form-control" name="agent_service_id" as="select" id=""
                                        :class="{ 'is-invalid': errors.agent_service_id }">
                                        <option :value="null">Choose here</option>
                                        <option v-for="service in listServices" :value="service.id">{{ service.name }}
                                        </option>
                                    </Field>
                                    <span class="invalid-feedback">{{ errors.agent_service_id }}</span>
                                </div>
                            </div>
                            <div class="col-md-3" v-show="isCompany == true">
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
</template>