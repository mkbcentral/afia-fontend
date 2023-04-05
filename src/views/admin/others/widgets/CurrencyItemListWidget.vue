<script setup>
import { ref } from 'vue';
import { useToastr } from '../../../../widgets/toastr.js'
const toastr = useToastr()
const emit =defineEmits(['editCurrency','deleteCurrency'])

defineProps({
    currency: {},
    index: Number,
});

const edit = (currency) => {
  emit ('editCurrency',currency)
}
const deleteDialog = (currency) => {
  emit ('deleteCurrency',currency)
}
</script>
<template>
    <tr>
        <td v-text="index + 1" scope="row"></td>
        <td v-text="currency.name"></td>
        <td class="text-center">
            <button @click="edit(currency)" class="btn btn-link btn-sm"><i class="fas fa-edit"></i></button>
            <button @click="deleteDialog(currency)" class="btn btn-link btn-sm"><i class="fa fa-trash text-danger" aria-hidden="true"></i></button>
        </td>
    </tr>
</template>