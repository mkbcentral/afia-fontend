<script setup>
import { ref } from 'vue';
import { useToastr } from '../../../../widgets/toastr.js'
const toastr = useToastr()
const emit =defineEmits(['editCommune','deleteCommune'])

defineProps({
    commune: {},
    index: Number,
});


const edit = (commune) => {
  emit ('editCommune',commune)
}
const deleteDialog = (commune) => {
  emit ('deleteCommune',commune)
}
</script>
<template>
    <tr>
        <td class="text-center" v-text="index + 1" scope="row"></td>
        <td v-text="commune.name"></td>
        <td class="text-center">
            <button @click="edit(commune)" class="btn btn-link btn-sm"><i class="fas fa-edit"></i></button>
            <button @click="deleteDialog(commune)" class="btn btn-link btn-sm"><i class="fa fa-trash text-danger" aria-hidden="true"></i></button>
        </td>
    </tr>
</template>