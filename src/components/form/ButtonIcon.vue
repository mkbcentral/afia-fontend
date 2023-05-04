<template>
    <button :class="'btn btn-'+bg"><i :class="props.icon" aria-hidden="true"></i> <slot/></button>
</template>
<script setup lang="ts">
const props=defineProps({
    bg:String,
    icon:String
})
</script>