<script setup>
import ReceptionLayout from '../../../layouts/ReceptionLayout.vue';
import { ref, onMounted } from 'vue'
import * as yup from 'yup'
import { useToastr } from '../../../../src/widgets/toastr.js'
import Swal from 'sweetalert2/dist/sweetalert2.all.min.js'
import ApiPatient from '../../../services/Patients/PatientApi.js'
import FormPatient from './Forms/FormPatientPrivate.vue';
import ItemListPatientSubscribe from './Widgets/ItemListPatientSubscribe.vue';
import NetworkError from '../../../components/errors/Network.vue';
const listPatients = ref([])
let errorResp = ref('')
const isDataLoanding = ref(false)
const isNetWorkError = ref(false)


const getData = async () => {
    isDataLoanding.value = true;
    isNetWorkError.value = false;
    try {
        const response = await ApiPatient.getPatients('/patient-subscribe');
        listPatients.value = response.data.data;
        isDataLoanding.value = false
    } catch (error) {
        if (error.code) {
            isNetWorkError.value = true
            errorResp.value = error.message
        }
        isDataLoanding.value = false
    }
}

const getPatients = async () => {
    isDataLoanding.value = true;
    isNetWorkError.value = false;
    try {
        const response = await ApiPatient.getPatients('/patient-subscribe');
        listPatients.value = response.data.data;
        isDataLoanding.value = false
    } catch (error) {
        if (error.code) {
            isNetWorkError.value = true
            errorResp.value = error.message
        }
        isDataLoanding.value = false
    }
}

const deletePatient = async (patient) => {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't delete patient : "+patient.name+' ?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes'
    }).then(async (result) => {
        if (result.isConfirmed) {
            const response = await ApiPatient.deletePatient(patient.id,'/patient-subscribe/')
            if (response.data.success) {
                Swal.fire(
                    'Deleted!',
                    response.data.message,
                    'success'
                )
                listPatients.value = listPatients.value.filter(p => p.id != patient.id);
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
onMounted(async () => {
   await getPatients()
})
</script>
<template>
    <ReceptionLayout>
        <div v-if="isNetWorkError">
            <NetworkError :message=errorResp @load-data="getData" />
        </div>
        <div v-else class="card">
            <div class="card-header">
                <p><i class="fas fa-user-check fa-2x text-secondary"></i> PATIENTS SUBSCRIBED</p>
            </div>
            <div class="card-body">
                <div class="d-flex justify-content-between">
                    <div>
                        <h5 class="m-0"><i class="fa fa-list" aria-hidden="true"></i> List of patients subscribed</h5>
                    </div>
                    <div>
                        <RouterLink to="/reception/create/patient/subscribe" class="btn btn-primary "><i class="fa fa-plus-circle"
                                aria-hidden="true"></i>New</RouterLink>
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
                            <th class="text-center">FORM NUMBER</th>
                            <th>NAME</th>
                            <th class="text-center">GENDER</th>
                            <th class="">DATE OF BIRTH</th>
                            <th class="">PHONE</th>
                            <th class="">OTHER PHONE</th>
                            <th class="text-center">COMPANY</th>
                            <th class="text-center">TYPE</th>
                            <th class="text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody v-if="listPatients.length > 0">
                        <ItemListPatientSubscribe v-for="(patient, index) in listPatients" :key="patient.id" :patient=patient
                            :index=index @change-status="changeStatus(patient.id)"
                            @delete-patient="deletePatient(patient)" />
                    </tbody>
                    <tbody v-else>
                        <tr>
                            <td colspan="10" class="text-center p-4 text-secondary"> <i class="fas fa-database"></i> Not
                                result
                                found...</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
       
    </ReceptionLayout>
</template>