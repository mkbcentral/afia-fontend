<script setup>
import { ref } from 'vue';
import { useToastr } from '../../../../widgets/toastr.js'
const toastr = useToastr()
const emit = defineEmits(['editSubscription', 'changeStatus', 'deleteSubscription'])

defineProps({
  subscription: {},
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

const edit = (subscription) => {
  emit('editSubscription', subscription)
}
const deleteDialog = (subscription) => {
  emit('deleteSubscription', subscription)
}
const editStatus = async (subscription, status) => {
  emit('changeStatus', subscription, status)
}
</script>
<template>
  <tr>
<<<<<<< HEAD
    <td v-text="index + 1" scope="row"></td>
=======
    <td class="text-center" v-text="index + 1" scope="row"></td>
>>>>>>> 4915c3729554ed577ff2658c8fef2c5f1af8f01e
    <td v-text="subscription.name"></td>
    <td class="text-center" v-text="subscription.amount"></td>
    <td class="text-center" v-text="subscription.familly_quota"></td>
    <td>
      <select class="form-control" @change="editStatus(subscription, $event.target.value)">
          <option v-for="item in status" :value="item.name" :selected="item.name == subscription.status">{{ item.name }}
          </option>
        </select>
    </td>
    <td class="text-center">
      <button @click="edit(subscription)" class="btn btn-link btn-sm"><i class="fas fa-edit"></i></button>
      <button @click="deleteDialog(subscription)" class="btn btn-link btn-sm"><i class="fa fa-trash text-danger"
          aria-hidden="true"></i></button>
    </td>
  </tr>
</template>