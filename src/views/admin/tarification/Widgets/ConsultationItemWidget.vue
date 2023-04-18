<script setup>
const emit =defineEmits(['editConsultation','changeStatus','deleteConsultation'])

defineProps({
    consultation: {},
    index: Number,
});
const edit = (consultation) => {
  emit ('editConsultation',consultation)
}
const deleteDialog = (consultation) => {
  emit ('deleteConsultation',consultation)
}
const editStatus = async (consultation) => {
    emit ('changeStatus',consultation)
}
</script>
<template>
    <tr>
        <td class="text-center" v-text="index + 1" scope="row"></td>
        <td v-text="consultation.name"></td>
        <td v-text="consultation.price_private"></td>
        <td v-text="consultation.price_subscribe"></td>
        <td class="text-center" v-text="consultation.starus_name"></td>
        <td class="text-center">
            <button @click="edit(consultation)" class="btn btn-link btn-sm"><i class="fas fa-edit"></i></button>
            <button @click="deleteDialog(consultation)" class="btn btn-link btn-sm"><i class="fa fa-trash text-danger" aria-hidden="true"></i></button>
            <button @click="editStatus(consultation)" class="btn btn-link btn-sm">
                <i v-if="consultation.status==0" class="fa fa-check" aria-hidden="true"></i>
                <i v-else class="fa fa-times text-danger" aria-hidden="true"></i>
            </button>
        </td>
    </tr>
</template>