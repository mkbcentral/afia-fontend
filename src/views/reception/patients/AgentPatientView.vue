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
import ApiAgentService from '../../../services/Admin/AgentServiceApi'
import ApiTypePatient from '../../../services/Admin/TypeApi.js'
import FormPatient from './Froms/FormPatient.vue';

const listPatients = ref([])
let errorResp = ref('')
const isLoanding = ref(false)
const isDataLoanding = ref(false)
const isEditing = ref(false)
const isNetWorkError = ref(false)
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
    agent_service_id: yup.number().required(),
    patient_type_id: yup.number().required(),
})

const add = async () => {
    isEditing.value = false;
    $('#addPatientPrivateModal').modal('show');
    //form.value.resetForm()
}

const getCommunes = async () => {
    try {
        const response = await CommuneApi.getCommunes();
        listCommunes.value = response.data.data
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
            isNetWorkError.value = true
            errorResp.value = error.message
        }
        isDataLoanding.value = false
    }
}

const create = async (values) => {
    isLoanding.value = true;
    try {
        const response = await ApiPatient.createPatient(values, '/agent-patient')
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

const update = async (values) => {
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
    await getAgentServices()
    await getTypePatients()
})
</script>
<template>
    <ReceptionLayout>
        <div class="card">
            <div class="card-header">
                <p><i class="fas fa-user-tag fa-2x text-secondary"></i> AGENT PATIENTS</p>
            </div>
            <div class="card-body">
                <div class="d-flex justify-content-between">
                    <div>
                        <h5 class="m-0"><i class="fa fa-list" aria-hidden="true"></i> List of agent patients</h5>
                    </div>
                    <div>
                        <button @click="add" type="button" class="btn btn-primary btn-sm"><i class="fa fa-plus-circle"
                                aria-hidden="true"></i> New</button>
                    </div>
                </div>
            </div>
        </div>

        <div>
            <FormPatient :isEditing=isEditing :isLoanding=isLoanding 
            :isAgent="true" :isCompany="false"
             :schema=schema  @submit-data="handlerSubmit" />
        </div>
    </ReceptionLayout>
</template>