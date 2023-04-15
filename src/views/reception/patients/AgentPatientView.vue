<script setup>
import ReceptionLayout from '../../../layouts/ReceptionLayout.vue';
import { ref, reactive, onMounted, watch } from 'vue'
import { useToastr } from '../../../../src/widgets/toastr.js'
import ApiPatient from '../../../services/Patients/PatientApi.js'
import AgentItemListPatient from './Widgets/AgentItemListPatient.vue';

let errorResp = ref('')
const listPatients = ref([])
const isLoanding = ref(false)
const isDataLoanding = ref(false)
const isNetWorkError = ref(false)
const toastr = useToastr()

const getPatients = async () => {
    isDataLoanding.value = true;
    isNetWorkError.value = false;
    try {
        const response = await ApiPatient.getPatients('/agent-patient');
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
onMounted(async () => {
    await getPatients()
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
                        <RouterLink to="/reception/create/patient/agent" class="btn btn-primary "><i
                                class="fa fa-plus-circle" aria-hidden="true"></i>New</RouterLink>
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
                            <th class="">TYPE</th>
                            <th class="">SERVICE</th>
                            <th class="text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody v-if="listPatients.length > 0">
                        <AgentItemListPatient v-for="(patient, index) in listPatients" :key="patient.id" :patient=patient
                            :index=index  @change-status="changeStatus(patient.id)"
                            @delete-patient="deletePatient(patient)" />
                    </tbody>
                    <tbody v-else>
                        <tr>
                            <td colspan="8" class="text-center p-4 text-secondary"> <i class="fas fa-database"></i> Not
                                result
                                found...</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </ReceptionLayout>
</template>