<template>
    <label :for="props.forValue">
        <slot/>
    </label>
</template>

<script setup lang="ts">
const props=defineProps({
    forValue:String
})
</script>