<script setup>
import { ref } from 'vue';
import { useToastr } from '../../../../widgets/toastr.js'
const toastr = useToastr()
const emit = defineEmits(['editCompany', 'deleteCompany'])

defineProps({
  company: {},
  index: Number,
});

const edit = (company) => {
  emit('editCompany', company)
}
const deleteDialog = (company) => {
  emit('deleteCompany', company)
}
</script>
<template>
  <tr>
    <td class="text-center" v-text="index + 1" scope="row"></td>
    <td v-text="company.name"></td>
    <td v-text="company.subscription.name"></td>
    <td class="text-center">
      <button @click="edit(company)" class="btn btn-link btn-sm"><i class="fas fa-edit"></i></button>
      <button @click="deleteDialog(company)" class="btn btn-link btn-sm"><i class="fa fa-trash text-danger"
          aria-hidden="true"></i></button>
    </td>
  </tr>
</template>