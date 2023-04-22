<template>
    <div class="modal-header">
        <h5 v-if="props.isEditing==true" class="modal-title" id="addBranchModalLabel">
            <i :class=props.editIcon aria-hidden="true"></i> EDIT {{props.title}}
        </h5>
        <h5 v-else class="modal-title" :id=id>
            <i :class=props.addIcon></i>
            CREATE NEW {{ props.title }}
        </h5>
        <button type="button" class="close text-danger" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
    </div>
</template>
<script setup lang="ts">
import {onMounted} from 'vue'
const props=defineProps({
    editIcon:String,
    addIcon:String,
    title:String,
    id:String,
    isEditing:Boolean,
})
onMounted(async () => {
   
})

</script>