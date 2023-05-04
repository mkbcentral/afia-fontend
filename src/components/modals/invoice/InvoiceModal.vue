<template>
    <!--Add Modal -->
    <div :class="'modal ' + props.aniamte" :id="props.id" tabindex="-1" :aria-labelledby="props.id + 'Label'"
        aria-hidden="true" data-keyboard="false" data-backdrop="static">
        <div :class="'modal-dialog modal-' + props.size">
            <div class="modal-content">
                <InvoiceModalHeaderVue modal-icon="fas fa-eye" :title="props.modalTitle" />
                <div class="modal-body">
                    <!-- Main content -->
                    <div class="invoice p-3 mb-3">
                        <HeaderInvoice
                             :name="invoice.patient_name" :gender="invoice.patient_gender"
                             :age="invoice.patient_age" :phone="invoice.patient_phone" :email="invoice.patient_email"
                             :invoice_number="invoice.invoice_number"
                             :adminted_at="invoice.created_at"
                             :form_number="invoice.form_number"/>
                        <!-- Table row -->
                        <div class="row">
                            <div class="col-12 table-responsive">

                                <table class="table table-sm" >
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th>DESIGNATION</th>
                                            <th class="text-center" >QTY</th>
                                            <th class="text-right">U.P </th>
                                            <th class="text-right">TOTAL </th>
                                            <th class="text-center">Actions</th>
                                        </tr>
                                    </thead>
                                    <TableConsultation :amount="props.amount_cons" :name="props.cons_name"/>
                                    <div class=" p-3" v-if="lisInvoice.length <= 0">
                                        <p class="text-bold text-secondary"> Not item data</p>
                                    </div>
                                    <TableItemInvoice v-else :list-data="lisInvoice" @refresh="refreshData"/>
                                </table>
                                <hr>
                            </div>
                            <!-- /.col -->
                        </div>
                        <!-- /.row -->
<<<<<<< HEAD
                        <InvoiceInfo :amount="amount"/>
=======
                        
                        <div class="row">
                            <!-- accepted payments column -->
                            <div class="col-6">
                                <p class="lead">Payment Methods:</p>
                                <P>--- Cash ---</P>
                            </div>
                            <AmountInfos :amount="amount"/>
                        </div>
                        <!-- /.row -->

>>>>>>> 893ba1a606cf591249531ae185c6d69fb875d750
                        <!-- this row will not appear when printing -->
                        <div class="row no-print">
                            <div class="col-12">
                                <a href="invoice-print.html" rel="noopener" target="_blank" class="btn btn-default"><i
                                        class="fas fa-print"></i> Print</a>
                                <button @click="editItem" type="button" class="btn btn-success float-right"><i
                                        class="far fa-credit-card"></i>
                                    Submit
                                    Payment
                                </button>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<<<<<<< HEAD
<script setup lang="ts">
=======
<script setup>
import { ref } from 'vue'
>>>>>>> 893ba1a606cf591249531ae185c6d69fb875d750
import InvoiceModalHeaderVue from './InvoiceModalHeader.vue';
import HeaderInvoice from '../../invoice/HeaderInvoice.vue';
<<<<<<< HEAD
import TableConsultation from "../../../views/invoices/widgets/TableConsultation.vue";
import TableItemInvoice from "../../../views/invoices/widgets/TableItemInvoice.vue";
import InvoiceInfo from "../../../views/invoices/widgets/InvoiceInfo.vue";

const props = defineProps({
    id: String,
    size: String,
    aniamte: String,
    modalTitle: String,
    lisInvoice: Array,
    amount: Number,
    invoice:Object,
    amount_cons:Number,
    cons_name:String
=======
import AmountInfos from '../../invoice/AmountInfos.vue';
const toastr = useToastr();
const isEditable = ref(false)
const idSelected = ref(0)
const quantity = ref(1)
const data = ref({ qty: 1, table: 'invoice_private_tarification' })
const props = defineProps({
    id: null,
    size: null,
    aniamte: null,
    modalTitle: null,
    lisInvoice: null,
    amount: null,
    invoice:null
>>>>>>> 893ba1a606cf591249531ae185c6d69fb875d750
})
const emit = defineEmits(['refreshData'])
const refreshData=()=>{
    emit('refreshData')
}
</script>