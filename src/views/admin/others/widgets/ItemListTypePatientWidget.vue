<script setup>
import { useToastr } from '../../../../widgets/toastr.js'
const toastr = useToastr()
const emit = defineEmits(['editType', 'deleteType'])

defineProps({
  type: {},
  index: Number,
});


const edit = (type) => {
  emit('editType', type)
}
const deleteDialog = (type) => {
  emit('deleteType', type)
}
</script>
<template>
  <tr>
    <td  class="text-center" v-text="index + 1" scope="row"></td>
    <td v-text="type.name"></td>
    <td class="text-center">
      <button @click="edit(type)" class="btn btn-link btn-sm"><i class="fas fa-edit"></i></button>
      <button @click="deleteDialog(type)" class="btn btn-link btn-sm"><i class="fa fa-trash text-danger"
          aria-hidden="true"></i></button>
    </td>
  </tr>
</template>