<script setup>
import { ref } from 'vue';
import { useToastr } from '../../../../widgets/toastr.js'
const toastr = useToastr()
const emit =defineEmits(['editRole','changeStatus','deleteRole'])

defineProps({
    role: {},
    index: Number,
});
const status = ref([
  {
    value: 1,
    name: 'ACTIVE'
  },
  {
    value: 2,
    name: 'DISABLE'
  }
]);

const edit = (role) => {
  emit ('editRole',role)
}
const deleteDialog = (role) => {
  emit ('deleteRole',role)
}
const editStatus = async (role, status) => {
    emit ('changeStatus',role,status)
}
</script>
<template>
    <tr>
        <td v-text="index + 1" scope="row"></td>
        <td v-text="role.name"></td>
        <td>
            <div class="form-group">
                <select class="form-control" @change="editStatus(role, $event.target.value)">
                    <option v-for="item in status" :value="item.name" :selected="item.name == role.status">{{ item.name }}
                    </option>
                </select>
            </div>
        </td>
        <td class="text-center">
            <button @click="edit(role)" class="btn btn-link"><i class="fas fa-edit"></i></button>
            <button @click="deleteDialog(role)" class="btn btn-link"><i class="fa fa-trash text-danger" aria-hidden="true"></i></button>
        </td>
    </tr>
</template>