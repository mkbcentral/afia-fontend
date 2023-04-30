<template>
    <div class="modal-header">
        <h5  class="modal-title" id="addBranchModalLabel">
            <i :class=props.modalIcon aria-hidden="true"></i>
            {{props.title}}
        </h5>
        <button type="button" class="close text-danger" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
    </div>
</template>
<script setup lang="ts">
const props=defineProps({
    modalIcon:String,
    title:String,
    id:String,
})

</script>