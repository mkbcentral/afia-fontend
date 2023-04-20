<script setup lang="ts">
import { ref, onMounted } from 'vue';
import TarificationLayout from '../../../layouts/TarificationLayout.vue';
import TarificationApi from '../../../services/Admin/AdminApi.js';
import ConsultationApi from '../../../services/Admin/AdminApi.js';


const listTarif = ref({})
const listConsultation = ref({})

const isLoanding = ref(false)
const isDataLoanding = ref(false)
const isEditing = ref(false)
const isNetWorkError = ref(false)

const getConsultations = async () => {
    isDataLoanding.value = true;
    isNetWorkError.value = false
    try {
        const response = await ConsultationApi.getData('consultation');
        listConsultation.value = response.data.data;
        isDataLoanding.value = false
        
    } catch (error) {
        isDataLoanding.value = false
        console.log(error.response.data)
    }
}
const getTarifs = async () => {
    isDataLoanding.value = true;
    isNetWorkError.value = false;
    try {
        const response = await TarificationApi.getData('category-tarification');
        listTarif.value = response.data.data;
        console.log(response.data.data)
        isDataLoanding.value = false;
    } catch (error) {
        isDataLoanding.value = false;
        console.log(error.response.data);
    }
}
onMounted(async () => {
    getConsultations();
    getTarifs();
})
</script>
<template>
    <TarificationLayout>
        <div>
            <div class="content-header">
                <div class="container-fluid">
                    <div class="d-flex justify-content-end">
                        <div class="">
                            <ol class="breadcrumb float-sm-right">
                                <li class="breadcrumb-item">
                                    <RouterLink to="/">Menu</RouterLink>
                                </li>
                               
                                <li class="breadcrumb-item active">Price list</li>
                            </ol>
                        </div><!-- /.col -->
                    </div><!-- /.row -->
                </div><!-- /.container-fluid -->
            </div>

            <div v-if="isDataLoanding" class="d-flex justify-content-center">
                <div class="spinner-border" role="status">
                    <span hidden class="visually-hidden">Loading...</span>
                </div>
            </div>
            <div v-else>
                <div class="row">
                    <div class="col-md-9">
                        <div class="card">
                            <div class="card-body">
                                <h3 class="card-title text-bold">LIST OF PRICE <span class="text-primary">(USD)</span></h3>
                            </div>
                        </div>
                        <div class="card">
                            <div class="card-header bg-info">
                               CONSULTATION
                            </div>
                            <div class="card-body">
                                <table class="table table-bordered table-sm">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>NAME</th>
                                            <th class="text-center">PRICE PRIVATE</th>
                                            <th class="text-center">PRICE SUBSCRIBE</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(consultation, idx) in listConsultation" :key="idx" v-show="consultation.status">
                                            <td v-text="idx+1"></td>
                                            <td v-text="consultation.name"></td>
                                            <td class="text-center" v-text="consultation.price_private"></td>
                                            <td class="text-center" v-text="consultation.price_subscribe"></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    
                    <div class="col-md-9">
                        <div class="card" v-for="(category, index) in listTarif" :key="index">
                            <div class="card-header bg-secondary" v-text="category.name">
                               
                            </div>
                            <div class="card-body">
                                <table class="table table-bordered table-sm">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>NAME</th>
                                            <th class="text-center">PRICE PRIVATE</th>
                                            <th class="text-center">PRICE SUBSCRIBE</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(tarif, idx) in category.tarifs" :key="idx" 
                                                v-show="tarif.status">
                                            <td v-text="idx+1"></td>
                                            <td v-text="tarif.name"></td>
                                            <td class="text-center" v-text="tarif.price_private"></td>
                                            <td class="text-center" v-text="tarif.price_subscribe"></td>
                                        </tr>
                                    </tbody>
                                   
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </TarificationLayout>
</template>