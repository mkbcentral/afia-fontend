<script setup>
import { ref } from 'vue';
import { useToastr } from '../../../../widgets/toastr.js'
const toastr = useToastr()
const emit = defineEmits(['editBranch', 'changeStatus', 'deleteBranch'])

defineProps({
  branch: {},
  index: Number,
});
const status = ref([
  {
    value: 1,
    name: 'ENABLE'
  },
  {
    value: 2,
    name: 'DISABLE'
  }
]);

const edit = (branch) => {
  emit('editBranch', branch)
}
const deleteDialog = (branch) => {
  emit('deleteBranch', branch)
}
const editStatus = async (branch, status) => {
  emit('changeStatus', branch, status)
}
</script>
<template>
  <tr>
    <td v-text="index + 1" scope="row"></td>
    <td v-text="branch.name"></td>
    <td>
      <select class="form-control" @change="editStatus(branch, $event.target.value)">
          <option v-for="item in status" :value="item.name" :selected="item.name == branch.status">{{ item.name }}
          </option>
        </select>
    </td>
    <td class="text-center">
      <button @click="edit(branch)" class="btn btn-link btn-sm"><i class="fas fa-edit"></i></button>
      <button @click="deleteDialog(branch)" class="btn btn-link btn-sm"><i class="fa fa-trash text-danger"
          aria-hidden="true"></i></button>
    </td>
  </tr>
</template>