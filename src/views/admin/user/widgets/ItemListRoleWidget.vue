<script setup>
import { ref } from 'vue';
import { useToastr } from '../../../../widgets/toastr.js'
const toastr = useToastr()
const emit =defineEmits(['editRole','changeStatus'])

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
            <button @click="edit(role)" class="btn btn-link"><i class="fas fa-edit    "></i></button>
        </td>
    </tr>
</template>