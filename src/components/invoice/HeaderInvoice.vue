<template>
    <!-- title row -->
    <div class="row">
        <div class="col-12">
            <h4>
                <i class="fas fa-globe"></i> {{ hospital.name }}
                <small class="float-right">Date: 2/10/2014</small>
            </h4>
        </div>
        <!-- /.col -->
    </div>
    <!-- info row -->
    <div class="row invoice-info">
        <div class="col-sm-4 invoice-col">
            From
            <address>
                <strong>CENTRE- {{branch.name}}</strong><br>
                L'SHI,GOLF TSHMALALE<br>
                N°12/AV. CHRISTIAN KUNDA<br>
                <span class="text-bold">Phone</span>: {{hospital.phone}}|{{branch.phone}}<br>
                <span class="text-bold">Email</span>: {{ hospital.email }}
            </address>
        </div>
        <!-- /.col -->
        <div class="col-sm-4 invoice-col">
            To
            <address>
                <strong>{{ props.name }}</strong><br>
                <span class="text-bold">Gender:</span> {{props.gender}}<br>
                <span class="text-bold">Age:</span> {{props.age}}<br>
                <span class="text-bold">Phone:</span> {{props.phone}}<br>
                <span class="text-bold">Email:</span> {{props.email}}
            </address>
        </div>
        <!-- /.col -->
        <div class="col-sm-4 invoice-col">
            <b>Invoice #{{ invoice_number }}</b><br>
            <b>Admitted:</b> {{adminted_at}}<br>
            <b>S-N:</b> {{ form_number }}
        </div>
        <!-- /.col -->
    </div>
    <!-- /.row -->
</template>
<script setup lang="ts">
import {ref,onMounted} from 'vue'
const hospital=ref({})
const branch=ref({})
const props=defineProps({
    name:String,
    gender:String,
    age:String,
    phone:String,
    email:String,
    invoice_number:String,
    adminted_at:String,
    form_number:String
})
onMounted(async () => {
  hospital.value=JSON.parse(localStorage.getItem('hospital'))
  branch.value=JSON.parse(localStorage.getItem('branch'))
 
})

</script>