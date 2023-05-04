<template>
    <tbody v-for="(item, index) in listData" :key="index">
    <tr class="bg-secondary">
        <td v-text="index"></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
    </tr>
    <tr v-for="(tarif, i) in item.data" :key="i">
        <td></td>
        <td v-text="tarif.name"></td>
        <td class="text-center">
            <span v-if="isEditable == true && idSelected == tarif.id">
                <input v-model="quantity" @keyup.enter="updateQtyItem(tarif.id)" type="number" class="form-control"></span>
            <span v-else>{{ tarif.qty }}</span>
        </td>
        <td class="text-right" v-text="tarif.price"></td>
        <td class="text-right" v-text="tarif.total"></td>
        <td class="text-center">
            <button @click="deleteItem(tarif.id)" class="btn btn btn-link btn-sm ">
                <i class="fa fa-trash text-danger" aria-hidden="true"></i>
            </button>
            <button @click="editItem(tarif.id,tarif.qty)" class="btn btn btn-link btn-sm ">
                <i class="fas fa-edit" aria-hidden="true"></i>
            </button>
        </td>
    </tr>
    </tbody>
</template>

<script setup>
import {ref} from  'vue'
import ApiInvoice from '../../../services/Admin/AdminApi';
import { useToastr } from '../../../widgets/toastr'
const toastr = useToastr();
const isEditable = ref(false)
const idSelected = ref(0)
const quantity = ref(1)
const data = ref({ qty: 1, table: 'invoice_private_tarification' })
const emit = defineEmits(['refresh'])
  defineProps({
     listData:[]
  })

const refreshData=()=>{
    emit('refresh')
}
const deleteItem = async (id) => {
    try {
        const resposnse = await ApiInvoice.delete(`delete-item-invoice-private/`, id+`?table=${data.value.table}`);
        refreshData()
        toastr.error(resposnse.data.message, 'Delete')
    } catch (error) {
        console.log(error)
    }
}

const editItem = async (id,qty) => {
    isEditable.value = true
    idSelected.value = id
    quantity.value=qty
}
const updateQtyItem = async (id) => {
    try {
        data.value.qty = quantity.value
        console.log(data.value)
        const resposnse = await ApiInvoice.update('update-qty-items-invoice/', id, data.value);
        refreshData()
        isEditable.value=false
        idSelected.value=0;
        toastr.info(resposnse.data.message, 'Delete')
    } catch (error) {
        console.log(error)
    }

}

</script>