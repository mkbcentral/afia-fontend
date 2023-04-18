<script setup>
const emit =defineEmits(['editCategory','deleteCategory'])

defineProps({
    category: {},
    index: Number,
});
const edit = (category) => {
  emit ('editCategory',category)
}
const deleteDialog = (category) => {
  emit ('deleteCategory',category)
}

</script>
<template>
    <tr>
        <td class="text-center" v-text="index + 1" scope="row"></td>
        <td v-text="category.name"></td>
        <td class="text-center">
            <button @click="edit(category)" class="btn btn-link btn-sm"><i class="fas fa-edit"></i></button>
            <button @click="deleteDialog(category)" class="btn btn-link btn-sm"><i class="fa fa-trash text-danger" aria-hidden="true"></i></button>
        </td>
    </tr>
</template>