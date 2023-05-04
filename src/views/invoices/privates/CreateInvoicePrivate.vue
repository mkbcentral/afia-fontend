<template>
    <InvoiceLayout>
        <div class="content-header" >
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
                        <span v-if="isLoadInvoice">Loading...</span>
                        <ButtonIcon v-else @click="show" type="button" bg="primary" icon="fa fa-eye"> Veiw</ButtonIcon>
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
                                <div v-if="isLoadTarif" class="text-center"><span>Loading...</span></div>
                                <div v-else class="row">
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
    <InvoiceModal id="showInvoiceModal" aniamte='fade' size='xl' modal-title="VIEW INVOICE DETAIL"
        :lis-invoice="invoiceItems" :amount="amount" :amount_cons="consultation.amount" :cons_name="consultation.name" @refresh-data="getItemInvoice" :invoice="invoice"/>
</template>
<script setup>
import InvoiceLayout from '../../../layouts/InvoiceLayout.vue';
import { useRoute } from 'vue-router'
import { ref, onMounted } from 'vue';
import { useToastr } from '../../../widgets/toastr.js'
import ButtonLoanding from '../../../components/form/ButtonLoanding.vue';
import ButtonIcon from '../../../components/form/ButtonIcon.vue'
import InvoiceModal from '../../../components/modals/invoice/InvoiceModal.vue';
import {postDataParams,getData} from '../../../stores/data/apiRequest'
const route = useRoute()
const idInvoice = ref(0)
const consultation=ref(
    {name:null,amount:null}
)

const selectedIndex = ref(2)
const listTarifs = ref([])
const listCategories = ref([])
const itemsTarif = ref([])

const dataToSend = ref([])
const invoice = ref({})
const invoiceItems = ref([])
const selectedValue = ref(0)
const tableName = ref('invoice_private_tarification')
const toastr = useToastr()

const isLoanding = ref(false)
const isDataLoanding = ref(false)
const isNetWorkError = ref(false)
const isLoadInvoice=ref(false)
const isLoadTarif=ref(false)

const amount = ref(0)
const show = async () => {
    isLoadInvoice.value=true
    await getItemInvoice()
    $('#showInvoiceModal').modal('show');
}
//Get list of categories
const getCategories = async () => {
    isNetWorkError.value = false
    const response= await getData('category-tarification')
    if (response.error){
        isNetWorkError.value=false;
        toastr.error(response.error,'ERROR')
    }else{
        listCategories.value = response.data.data;
        isNetWorkError.value=false;
    }
}
//Save items invoice
const addItemsToInvoice = async () => {
    isLoanding.value = true
    console.log(itemsTarif.value);
    for (let index = 0; index < itemsTarif.value.length; index++) {
        const element = itemsTarif.value[index];
        dataToSend.value.push({
            invoice_private_id: Number(route.params.id),
            tarification_id: element
        })
    }
    const response= await postDataParams(`create-items-invoice-private/${route.params.id}?table=${tableName.value}`, dataToSend.value)
    if (response.error){
        isLoanding.value=false;
        toastr.error(response.error,'ERROR')
    }else {
        isLoanding.value=false;
        toastr.success(response.data.message)
    }
}
//Current categories
const getCurrentCategory = async () => {
    isNetWorkError.value = false
    const response= await getData('first-category-tarif')
    if (response.error){
        isNetWorkError.value=false;
        toastr.error(response.error,'ERROR')
    }else{
        selectedValue.value = response.data.category.id;
        isNetWorkError.value=false;
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
    isNetWorkError.value = false
    isLoadTarif.value=true
    const response= await getData(`/tarification?category_id=${selectedIndex.value}`)
    if (response.error){
        isNetWorkError.value=false;
        toastr.error(response.error,'ERROR')
        isLoadTarif.value=false
    }else{
        listTarifs.value = response.data.data;
        isNetWorkError.value=false;
        isLoadTarif.value=false
    }
}
//get Invoice par id route params 
const getInvoice = async (id) => {
    isNetWorkError.value = false
    isDataLoanding.value = true;
    const response= await getData(`/invoice-private/${id}`)
    if (response.error){
        isNetWorkError.value=false;
        isDataLoanding.value = false
        toastr.error(response.error,'ERROR')
    }else{
        invoice.value = response.data.data;
        isNetWorkError.value=false;
        isDataLoanding.value = false
    }
}
//Get item invoice
const getItemInvoice = async () => {
    const response= await getData(`/items-invoices-private/${route.params.id}?currency=CDF`)
    if (response.error){
        toastr.error(response.error,'ERROR')
        isLoadInvoice.value = false
    }else{
        invoiceItems.value = response.data.items_invoice.data;
        amount.value = response.data.items_invoice.total_invoice
        consultation.value.amount=response.data.items_invoice.consultation.amount
        consultation.value.name=response.data.items_invoice.consultation.name
        isLoadInvoice.value = false
    }
}
onMounted(async () => {
    getCurrentCategory()
    getCategories();
    getTarifs()
    getInvoice(route.params.id)
})
</script>