<template>
    <button :class="'btn btn-'+props.bg+' '+props.btnSize">
        <div class="d-flex justify-content-center">
            <div v-if="props.isLoanding==true" class="spinner-border text-light" role="status"></div>
            <div class="pl-2"> <slot/></div>
        </div>
    </button>
</template>
<script setup lang="ts">
const props=defineProps({
    bg:String,
    isLoanding:Boolean,
    btnSize:String
})
</script>