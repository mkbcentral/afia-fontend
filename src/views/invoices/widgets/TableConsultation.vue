<template>
    <tbody>
    <tr class="">
        <td ></td>
        <td>{{ name }}</td>
        <td class="text-center">1</td>
        <td class="text-right">{{ amount }}</td>
        <td class="text-right">{{ amount }}</td>
        <td class="text-center"></td>
    </tr>
    </tbody>
</template>

<script setup>
  defineProps({
      amount:Number,
      name:String
  })
</script>