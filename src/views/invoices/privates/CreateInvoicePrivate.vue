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
                            <li class="breadcrumb-item">
                                <RouterLink to="/finance/invoice/private">List invoices</RouterLink>
                            </li>
                            <li class="breadcrumb-item active">Create invoice</li>
                        </ol>
                    </div><!-- /.col -->
                </div><!-- /.row -->
            </div><!-- /.container-fluid -->
        </div>
        <div class="card">
            <div class="card-header ">
                <div class="d-flex justify-content-between">
                    <div>
                        <h4 class="text-secondary text-uppercase"><i class="fas fa-folder-plus"></i> Create Invoice</h4>
                    </div>
                    <div>
                        <ButtonIcon @click="show" type="button" bg="primary" icon="fa fa-eye"> Veiw</ButtonIcon>
                    </div>
                </div>
            </div>
            <div v-if="isDataLoanding" class="d-flex justify-content-center p-4">
                <div class="spinner-border" role="status">
                    <span hidden class="visually-hidden">Loading...</span>
                </div>
            </div>
            <div v-else class="row">
                <div class="col-md-12">
                    <div class="card-body">
                        <div class="card">
                            <div class="card-body">
                                <div class="btn-group">
                                    <button v-for="category in listCategories" @click="getSelectedIndex(category.id)"
                                        type="button" class="btn "
                                        :class="[selectedIndex == category.id ? 'btn-secondary' : 'btn-link']"><i
                                            class="fas fa-folder"></i> <span v-text="category.name"></span></button>
                                </div>
                            </div>
                        </div>
                        <div class="card">
                            <div class="card-body">
                                <div class="row">
                                    <div class="col-md-4" v-for="tarif in listTarifs" :key="tarif.id">
                                        <div class="form-group clearfix">
                                            <div class="icheck-primary d-inline">
                                                <input class="form-check-input" v-model="itemsTarif" :value="tarif.id"
                                                    type="checkbox" :id="tarif.id">
                                                <label :for="tarif.id" v-text="tarif.name" class="form-check-label">
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                                <ButtonLoanding type="button" @click="addItemsToInvoice" bg="primary" btn-size="btn-md"
                                    :is-loanding="isLoanding">To invoice</ButtonLoanding>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </InvoiceLayout>
    <InvoiceModal id="showInvoiceModal" aniamte="fade" size="xl" modal-title="VIEW INVOICE DETAIL"
        :lis-invoice="invoiceItems" :amount="amount" @refresh-data="getItemInvoice" :invoice="invoice"/>
</template>
<script setup>
import InvoiceLayout from '../../../layouts/InvoiceLayout.vue';
import { useRouter, useRoute } from 'vue-router'
import { ref, onMounted } from 'vue';
import CategoryApi from '../../../services/Admin/AdminApi.js';
import TarifApi from '../../../services/Admin/AdminApi.js'
import InvoiceApi from '../../../services/Admin/AdminApi.js'
import { useToastr } from '../../../widgets/toastr.js'
import ButtonLoanding from '../../../components/from/ButtonLoanding.vue';
import ButtonIcon from '../../../components/from/ButtonIcon.vue'
import InvoiceModal from '../../../components/modals/invoice/InvoiceModal.vue';
const route = useRoute()
const idInvoice = ref(0)

const selectedIndex = ref(2)
const listTarifs = ref([])
const listCategories = ref([])
const itemsTarif = ref([])
const dataToSend = ref([])
const invoice = ref({})
const invoiceItems = ref([])
const tableName = ref('invoice_private_tarification')

const toastr = useToastr()
const isLoanding = ref(false)
const isDataLoanding = ref(false)
const isNetWorkError = ref(false)

const amount = ref(0)
const show = async () => {
    await getItemInvoice()
    $('#showInvoiceModal').modal('show');
}

//Get list of categories
const getCategories = async () => {

    isNetWorkError.value = false
    try {
        const response = await CategoryApi.getData('category-tarification');
        listCategories.value = response.data.data;
        isDataLoanding.value = false
    } catch (error) {

        if (error.code) {
            isNetWorkError.value = true
            errorResp.value = error.message
        }
        isDataLoanding.value = false
    }
}
//Save items invoice
const addItemsToInvoice = async () => {
    isLoanding.value = true
    try {
        for (let index = 0; index < itemsTarif.value.length; index++) {
            const element = itemsTarif.value[index];
            dataToSend.value.push({
                invoice_private_id: Number(idInvoice.value),
                tarification_id: element
            })
        }
        console.log(dataToSend.value)
        const response = await InvoiceApi.sendByParams(`create-items-invoice-private/${route.params.id}?table=${tableName.value}`, dataToSend.value);
        toastr.success(response.data.message, 'Validation');
        isLoanding.value = false
        dataToSend.value = []
    } catch (error) {
        //toastr.error(response.data.message, 'Error');
        console.log(error)
        isLoanding.value = false
    }

}
//Current categories
const getCurrentCategory = async () => {
    try {
        const response = await CategoryApi.getFirstData('first-category-rarif');
        selectedValue.value = response.data.category.id;
    } catch (error) {

        if (error.code) {
            isNetWorkError.value = true
            errorResp.value = error.message
        }

    }
}
//Select categori en change tab index 
const getSelectedIndex = async (index) => {
    selectedIndex.value = index;
    dataToSend.value = []
    itemsTarif.value = []
    await getTarifs()
}
//Get tarifs by category index
const getTarifs = async () => {
    isNetWorkError.value = false;
    try {
        const response = await TarifApi.getData('/tarification?category_id=' + selectedIndex.value);
        listTarifs.value = response.data.data;
        
    } catch (error) {
        if (error.code) {
            isNetWorkError.value = true
            errorResp.value = error.message
        }
    }
}
//get Invoice par id route params 
const getInvoice = async () => {
    isDataLoanding.value = true;
    isNetWorkError.value = false;
    try {
        const response = await TarifApi.getData(`/invoice-private/${idInvoice.value}`);
        invoice.value = response.data.data;
        isDataLoanding.value = false
    } catch (error) {
        isDataLoanding.value = false
    }
}
//Get item invoice
const getItemInvoice = async () => {
    try {
        const response = await TarifApi.getData(`/items-invoices-private/${idInvoice.value}?currency=CDF`);
        invoiceItems.value = response.data.items_invoice.data;
        amount.value = response.data.items_invoice.total_invoice
        console.log(response.data)
    } catch (error) {

    }
}
onMounted(async () => {
    getCurrentCategory()
    getCategories();
    getTarifs()
    idInvoice.value = route.params.id;
    getInvoice()
    getItemInvoice();
})
</script>