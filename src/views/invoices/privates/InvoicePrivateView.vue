<template>
    <InvoiceLayout>
        <div class="content-header">
            <div class="container-fluid">
                <div class="d-flex justify-content-end">
                    <div class="">
                        <ol class="breadcrumb float-sm-right">
                            <li class="breadcrumb-item">
                                <RouterLink to="/">Menu</RouterLink>
                            </li>
                            <li class="breadcrumb-item">
                                <RouterLink to="/finance/invoice/private/dashboard">Dashboard</RouterLink>
                            </li>
                            <li class="breadcrumb-item active">Invoice private</li>
                        </ol>
                    </div><!-- /.col -->
                </div><!-- /.row -->
            </div><!-- /.container-fluid -->
        </div>
        <div v-if="isNetWorkError">
            <NetworkError :message=errorResp @load-data="getData" />
        </div>
        <div v-else>
            <div v-if="isDataLoanding" class="d-flex justify-content-center">
                <div class="spinner-border " role="status">
                    <span hidden class="visually-hidden">Loading...</span>
                </div>
            </div>
            <div v-else class="card">
                <div class="card-header">
                    <h4><i class="fa fa-list" aria-hidden="true"></i> List of invoices</h4>
                </div>
                <div class="card-body">
                    <table class="table table-bordered">
                        <thead class="thead-dark">
                            <tr>
                                <th>#</th>
                                <th>NUMERO</th>
                                <th>NAME</th>
                                <th class="text-right">AMOUNT</th>
                                <th class="text-right">DATE</th>
                                <th class="text-center">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(invoice, index) in listInvoices" :key="invoice.id">
                                <td v-text="index + 1"></td>
                                <td v-text="invoice.invoice_number"></td>
                                <td v-text="invoice.patient_name"></td>
                                <td class="text-right" v-text="invoice.amount"></td>
                                <td class="text-info text-right" v-text="invoice.created_at"></td>
                                <td class="text-center">
                                    <RouterLink :to="`/finance/invoice/private/${invoice.id}/create`"><i
                                            class="fab fa-telegram-plane"></i></RouterLink>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </InvoiceLayout>
</template>
<script setup>
import InvoiceLayout from '../../../layouts/InvoiceLayout.vue';
import ApiInvoice from '../../../services/Admin/AdminApi.js'
import NetworkError from '../../../components/errors/Network.vue';
import { ref, onMounted, watch } from 'vue'
let errorResp = ref('')
const isLoanding = ref(false)
const isDataLoanding = ref(false)
const isNetWorkError = ref(false)
const listInvoices = ref([])


const getData = async () => {
    isDataLoanding.value = true
    isNetWorkError.value = false
    try {
        const response = await ApiInvoice.getData(`invoices-private?currency=CDF`)
        listInvoices.value = response.data.data
        isDataLoanding.value = false
    } catch (error) {
        if (error.code) {
            isNetWorkError.value = true
            errorResp.value = error.message
        }
        isDataLoanding.value = false
    }
}
const getInvoices = async () => {
    isDataLoanding.value = true
    try {
        const response = await ApiInvoice.getData('invoices-private?currency=CDF')
        listInvoices.value = response.data.data
        isDataLoanding.value = false
    } catch (error) {
        console.log(error)
        if (error.code) {
            errorResp.value = error.message
        }
        isDataLoanding.value = false
    }
}

onMounted(async () => {
    getInvoices()
})
</script>