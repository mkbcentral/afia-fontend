<script setup>
import ReceptionLayout from '../../../layouts/ReceptionLayout.vue';
import { ref, reactive, onMounted, watch } from 'vue'
import { useToastr } from '../../../../src/widgets/toastr.js'
import Swal from 'sweetalert2'
import * as yup from 'yup'
import { debounce } from 'lodash'
import CommuneApi from '../../../services/Admin/CommuneApi';
import ApiPatient from '../../../services/Patients/PaptientApi.js'
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
})

const add = async () => {
    isEditing.value = false;
    $('#addPatientPrivateModal').modal('show');
    //form.value.resetForm()
}


const create = async (values) => {
    console.log(values)
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
    //await getCommunes()
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
                        <h5 class="m-0"><i class="fa fa-list" aria-hidden="true"></i> List of patients private</h5>
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
            :isAgent="false" :isCompany="false"
             :schema=schema  @submit-data="handlerSubmit" />
        </div>
    </ReceptionLayout>
</template>