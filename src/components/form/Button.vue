<template>
    <button :class="'btn btn-'+bg"><slot/></button>
</template>
<script setup lang="ts">
const props=defineProps({
    bg:String
})
</script>