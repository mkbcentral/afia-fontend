<script setup>
import { ref } from 'vue';
import { useToastr } from '../../../../widgets/toastr.js'

const toastr = useToastr()

const emit =defineEmits(['editHospital','changeStatus','deleteHospital'])

defineProps({
    hospital: {},
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



const edit = (hospital) => {
  emit ('editHospital',hospital)
}

const deleteHospital = (hospital) => {
  emit ('deleteHospital',hospital)
}

const editStatus = async (hospital, status) => {
    emit ('changeStatus',hospital,status)
}
</script>
<template>
    <tr>
        <td v-text="index + 1" scope="row"></td>
        <td v-text="hospital.name"></td>
        <td v-text="hospital.email"></td>
        <td v-text="hospital.phone"></td>
        <td class="text-center">
            <div class="form-group">
                <select class="form-control" @change="editStatus(hospital, $event.target.value)">
                    <option v-for="item in status" :value="item.name" :selected="item.name == hospital.status">{{ item.name }}
                    </option>
                </select>
            </div>
        </td>
        <td>
            <img width="40" height="40" src="@/assets/logo.jpg" class="img-circle elevation-2" alt="User Image" />
        </td>
        <td class="text-center">
            <button @click="edit(hospital)" class="btn btn-link"><i class="fas fa-edit    "></i></button>
            <button @click="deleteHospital(hospital)" class="btn btn-link"><i class="fa fa-trash text-danger"></i></button>
        </td>
    </tr>
</template>