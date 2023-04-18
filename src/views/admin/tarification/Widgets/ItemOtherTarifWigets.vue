<script setup>
const emit =defineEmits(['editTarif','changeStatus','deleteTarif'])

defineProps({
    tarif: {},
    index: Number,
});
const edit = (tarif) => {
  emit ('editTarif',tarif)
}
const deleteDialog = (tarif) => {
  emit ('deleteTarif',tarif)
}
const editStatus = async (tarif) => {
    emit ('changeStatus',tarif)
}
</script>
<template>
    <tr>
        <td class="text-center" v-text="index + 1" scope="row"></td>
        <td v-text="tarif.name"></td>
        <td v-text="tarif.abreviation"></td>
        <td v-text="tarif.price_private"></td>
        <td v-text="tarif.price_subscribe"></td>
        <td class="text-center" v-text="tarif.starus_name"></td>
        <td class="text-center">
            <button @click="edit(tarif)" class="btn btn-link btn-sm"><i class="fas fa-edit"></i></button>
            <button @click="deleteDialog(tarif)" class="btn btn-link btn-sm"><i class="fa fa-trash text-danger" aria-hidden="true"></i></button>
            <button @click="editStatus(tarif)" class="btn btn-link btn-sm">
                <i v-if="tarif.status==0" class="fa fa-check" aria-hidden="true"></i>
                <i v-else class="fa fa-times text-danger" aria-hidden="true"></i>
            </button>
        </td>
    </tr>
</template>