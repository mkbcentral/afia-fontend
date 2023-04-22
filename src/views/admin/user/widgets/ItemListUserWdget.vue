<script setup>
import { ref } from 'vue';
const emit = defineEmits(['editUser', 'changeStatus', 'deleteUser'])

defineProps({
    user: {},
    index: Number,
    bg:''

});
const status = ref([
    {
        value: 1,
        name: 'ENABLE',
    },
    {
        value: 2,
        name: 'DISABLE',
    }
])



const edit = (user) => {
    emit('editUser', user)
}

const deleteUser = (user) => {
    emit('deleteUser', user)
}

const editStatus = async (user, status) => {
    emit('changeStatus', user, status)
}
</script>
<template>
    <tr>
        <td v-text="index + 1" scope="row"></td>
        <td v-text="user.name"></td>
        <td v-text="user.email"></td>
        <td v-text="user.phone"></td>
        <td class="text-center" v-text="user.role_name"></td>
        <td v-text="user.hospital_name"></td>
        <td>
            <select class="form-control "  :class="bg=='ENABLE'?'bg-primary':'bg-danger'" @change="editStatus(user, $event.target.value)">
                <option v-for="item in status" :value="item.name" :selected="item.name == user.status" cl >
                    <p class="text-danger">{{ item.name}}</p>
                </option>
            </select>
        </td>
        <td class="text-center">
            <button @click="edit(user)" class="btn btn-link btn-sm"><i class="fas fa-edit    "></i></button>
            <button @click="deleteUser(user)" class="btn btn-link btn-sm"><i class="fa fa-trash text-danger"></i></button>
        </td>
    </tr>
</template>