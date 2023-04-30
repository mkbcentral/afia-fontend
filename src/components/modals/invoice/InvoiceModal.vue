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
                             :age="invoice.patient_age" :phone="invoice.phone" :email="invoice.email"
                             :invoice_number="invoice.invoice_number"
                             :adminted_at="invoice.created_at"
                             :form_number="invoice.form_number"/>
                        <!-- Table row -->
                        <div class="row">
                            <div class="col-12 table-responsive">
                                <div v-if="lisInvoice.length <= 0">
                                    <p>Loading</p>
                                </div>
                                <table class="table table-sm" v-else>
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th>DESIGNATION</th>
                                            <th class="text-center" width>QTY</th>
                                            <th class="text-right">U.P $</th>
                                            <th class="text-right">TOTAL $</th>
                                            <th class="text-center">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody v-for="(item, index) in lisInvoice" :key="index">
                                        <tr class="bg-secondary">
                                            <td v-text="index"></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                        </tr>
                                        <tr v-for="(tarif, i) in item.data" :key="i">
                                            <td></td>
                                            <td v-text="tarif.name"></td>
                                            <td class="text-center">
                                                <span v-if="isEditable == true && idSelected == tarif.id">
                                                    <input v-model="quantity" @keyup.enter="updateQtyItem(tarif.id)"
                                                        type="number" class="form-control">
                                                </span>
                                                <span v-else>{{ tarif.qty }}</span>
                                            </td>
                                            <td class="text-right" v-text="tarif.price"></td>
                                            <td class="text-right" v-text="tarif.total"></td>
                                            <td class="text-center">
                                                <button @click="deleteItem(tarif.id)" class="btn btn btn-link btn-sm ">
                                                    <i class="fa fa-trash text-danger" aria-hidden="true"></i>
                                                </button>
                                                <button @click="editItem(tarif.id,tarif.qty)" class="btn btn btn-link btn-sm ">
                                                    <i class="fas fa-edit" aria-hidden="true"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <hr>
                            </div>
                            <!-- /.col -->
                        </div>
                        <!-- /.row -->

                        <div class="row">
                            <!-- accepted payments column -->
                            <div class="col-6">
                                <p class="lead">Payment Methods:</p>
                                <P>--- Cash ---</P>
                            </div>
                            <!-- /.col -->
                            <div class="col-6">
                                <p class="lead">For pay</p>

                                <div class="table-responsive">
                                    <table class="table">
                                        <tr>
                                            <th style="width:50%">Amount:</th>
                                            <td>${{ amount }}</td>
                                        </tr>
                                        <tr>
                                            <th>Reduction (0%)</th>
                                            <td>$0</td>
                                        </tr>
                                        <tr>
                                            <th>Deposit:</th>
                                            <td>$5.80</td>
                                        </tr>
                                        <tr>
                                            <th>Total:</th>
                                            <td>$265.24</td>
                                        </tr>
                                    </table>
                                </div>
                            </div>
                            <!-- /.col -->
                        </div>
                        <!-- /.row -->

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

<script setup lang="ts">
import { ref } from 'vue'
import InvoiceModalHeaderVue from './InvoiceModalHeader.vue';
import ApiInvoice from '../../../services/Admin/AdminApi';
import { useToastr } from '../../../widgets/toastr.js'
import HeaderInvoice from '../../invoice/HeaderInvoice.vue';
const toastr = useToastr();
const isEditable = ref(false)
const idSelected = ref(0)
const quantity = ref(1)
const data = ref({ qty: 1, table: 'invoice_private_tarification' })
const props = defineProps({
    id: String,
    size: String,
    aniamte: String,
    modalTitle: String,
    lisInvoice: Array,
    amount: Number,
    invoice:Object
})

const emit = defineEmits(['refreshData'])


const deleteItem = async (id) => {
    try {
        const resposnse = await ApiInvoice.delete(`delete-item-invoice-private/`, id+`?table=${data.value.table}`);
        emit('refreshData')
        toastr.error(resposnse.data.message, 'Delete')
        console.log(resposnse.data)
    } catch (error) {
        console.log(error)
    }
}

const editItem = async (id,qty) => {
    isEditable.value = true
    idSelected.value = id
    quantity.value=qty
}

const updateQtyItem = async (id) => {

    try {
        data.value.qty = quantity.value
        console.log(data.value)
        const resposnse = await ApiInvoice.update('update-qty-items-invoice/', id, data.value);
        emit('refreshData')
        isEditable.value=false
        idSelected.value=0;
        toastr.error(resposnse.data.message, 'Delete')
    } catch (error) {
        console.log(error)
    }

}


</script>