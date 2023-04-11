<script setup>
import ReceptionLayout from '../../../layouts/ReceptionLayout.vue';
import { ref, reactive, onMounted, watch } from 'vue'
import { useToastr } from '../../../../src/widgets/toastr.js'
import Swal from 'sweetalert2'
import { debounce } from 'lodash'
import CommuneApi from '../../../services/Admin/CommuneApi';
import ApiPatient from '../../../services/Patients/PaptientApi.js'
import FormPatient from './Froms/FormPatient.vue';
const listPatients = ref([])
const listCommunes = ref([])

const token = ref('')
let errorResp = ref('')

const isLoanding = ref(false)
const isDataLoanding = ref(false)
const isEditing = ref(false)
const isNetWorkError = ref(false)
const toastr = useToastr()
const searchQuary = ref(null)

const add = async () => {
    isEditing.value = false;
    $('#addPatientPrivateModal').modal('show');
    //form.value.resetForm()
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

const update = async (values) => {
    console.log(values)
}

const handlerSubmit = (values) => {
   alert("Test");

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
            <FormPatient :isEditing=isEditing :isLoanding=isLoanding :listCommunes=listCommunes @submit-data="handlerSubmit" />
        </div>
    </ReceptionLayout>
</template>