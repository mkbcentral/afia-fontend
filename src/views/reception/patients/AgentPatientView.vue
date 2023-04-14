<script setup>
import ReceptionLayout from '../../../layouts/ReceptionLayout.vue';
import { ref, reactive, onMounted, watch } from 'vue'
import { useToastr } from '../../../../src/widgets/toastr.js'
import ApiTypePatient from '../../../services/Admin/TypeApi.js'

let errorResp = ref('')
const isLoanding = ref(false)
const isDataLoanding = ref(false)
const isNetWorkError = ref(false)
const toastr = useToastr()

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
                        <RouterLink to="/reception/create/patient/agent" class="btn btn-primary "><i class="fa fa-plus-circle"
                                aria-hidden="true"></i>New</RouterLink>
                    </div>
                </div>
            </div>
        </div>
    </ReceptionLayout>
</template>