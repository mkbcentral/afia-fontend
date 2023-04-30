<script setup>
import ApiRate from '../../../services/Admin/AdminApi';
import {ref,onMounted} from 'vue'
const rate=ref(null)
const getRate =async ()=>{
    try {
        const response = await ApiRate.getCurrentData('current-rate');
        rate.value = response.data.rate.amount;
    } catch (error) {
        console.log(error)
    }
}

onMounted(async () => {
    getRate()
})
</script>
<template>
    <h4 class="text-danger text-bold">Rate: 1USD={{rate}} CDF</h4>
</template>