<script setup>
import { ref } from 'vue';
import { useToastr } from '../../../../widgets/toastr?js'
const toastr = useToastr()
const emit = defineEmits(['editPatient', 'makeConsultation'])

defineProps({
    patient: {},
    index: Number,
});

const makeConsultation = (user) => {
    emit('makeConsultation', user)
}

const deleteDialog = (patient) => {
    emit('deletePatient', patient)
}
</script>
<template>
    <tr>
        <td class="text-center" v-text="index + 1" scope="row"></td>
        <td class="text-bold text-center" v-text="patient.number"></td>
        <td v-text="patient.name"></td>
        <td class="text-center" v-text="patient.gender"></td>
        <td class="text-center" v-text="patient.age"></td>
        <td v-text="patient.phone"></td>
        <td v-text="patient.other_phone"></td>
        <td class="text-center">
            <RouterLink :to="`/reception/edit/patient/${patient.id}/private`"><i class="fas fa-edit"></i></RouterLink>
            <button @click="makeConsultation(patient)" class="btn btn-link btn-sm"><i class="fa fa-user-plus"
                    aria-hidden="true"></i></button>
            <button @click="deleteDialog(patient)" class="btn btn-link btn-sm"><i class="fa fa-trash text-danger"
                    aria-hidden="true"></i></button>
        </td>
    </tr>
</template>tp