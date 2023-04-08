<script setup>
import { ref } from 'vue';
import { useToastr } from '../../../../widgets/toastr.js'
const toastr = useToastr()
const emit =defineEmits(['editService','deleteService'])

defineProps({
    service: {},
    index: Number,
});


const edit = (service) => {
  emit ('editService',service)
}
const deleteDialog = (service) => {
  emit ('deleteService',service)
}
</script>
<template>
    <tr>
        <td class="text-center" v-text="index + 1" scope="row"></td>
        <td v-text="service.name"></td>
        <td class="text-center">
            <button @click="edit(service)" class="btn btn-link btn-sm"><i class="fas fa-edit"></i></button>
            <button @click="deleteDialog(service)" class="btn btn-link btn-sm"><i class="fa fa-trash text-danger" aria-hidden="true"></i></button>
        </td>
    </tr>
</template>