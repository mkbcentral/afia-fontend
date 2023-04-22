<template>
    <input :id="props.id" :value="props.modelValue" v-on:input="$event => emit('update:modelValue', $event.target.value)"
        class="form-control" />
</template>
<script setup lang="ts">
const props = defineProps({
    id: String,
    modelValue: String,
})
const emit = defineEmits(['update:modelValue'])
</script>