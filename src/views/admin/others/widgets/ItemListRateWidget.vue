<script setup>
import { ref } from 'vue';
import { useToastr } from '../../../../widgets/toastr.js'
const toastr = useToastr()
const emit =defineEmits(['editRate','changeStatus','deleteRate'])

defineProps({
    rate: {},
    index: Number,
});

const edit = (rate) => {
  emit ('editRate',rate)
}
const deleteDialog = (rate) => {
  emit ('deleteRate',rate)
}
const editStatus = async (rate) => {
    emit ('changeStatus',rate)
}
</script>
<template>
    <tr>
        <td class="text-center" v-text="index + 1" scope="row"></td>
        <td v-text="rate.amount"></td>
        <td class="text-center"><span  :class="rate.status==true?'badge badge-success':'badge badge-danger'">{{ rate.status_name }}</span></td>
        <td class="text-center">
            <button @click="edit(rate)" class="btn btn-link btn-sm"><i class="fas fa-edit"></i></button>
            <button @click="deleteDialog(rate)" class="btn btn-link btn-sm"><i class="fa fa-trash text-danger" aria-hidden="true"></i></button>
            <button @click="editStatus(rate)" class="btn btn-link btn-sm">
                <i v-if="rate.status==0" class="fa fa-check" aria-hidden="true"></i>
                <i v-else class="fa fa-times text-danger" aria-hidden="true"></i>
            </button>
        </td>
    </tr>
</template>