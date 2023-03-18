<script setup>
import { ref } from 'vue';
import { useToastr } from '../../../../widgets/toastr.js'

const toastr = useToastr()

const emit = defineEmits(['editUser', 'changeStatus'])

defineProps({
    user: {},
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
])



const edit = (user) => {
    emit('edituser', user)
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
        <td>
            <div class="form-group">
                <select class="form-control" @change="editStatus(user, $event.target.value)">
                    <option v-for="item in status" :value="item.name" :selected="item.name == user.status">{{ item.name
                    }}
                    </option>
                </select>
            </div>
        </td>
        <td>
            <img width="40" height="40" src="@/assets/logo.jpg" class="img-circle elevation-2" alt="User Image" />
        </td>
        <td class="text-center">
            <button @click="edit(user)" class="btn btn-link"><i class="fas fa-edit    "></i></button>
        </td>
    </tr>
</template>