<script setup>
import AdminLayout from '../../../layouts/AdminLayout.vue';
import { ref, reactive, onMounted } from 'vue'
import { Form, Field } from 'vee-validate'
import * as yup from 'yup'
import { useToastr } from '../../../../src/widgets/toastr.js'
import CurrencyApi from '../../../services/Admin/AdminApi.js'
import NetworkError from '../../../components/errors/Network.vue';
import Swal from 'sweetalert2'
import CurrencyItemListWidget from './widgets/CurrencyItemListWidget.vue'

import FormModal from '../../../components/form/modals/FormModal.vue';
import FormGroup from '../../../components/form/FormGroup.vue';
import FormLabel from '../../../components/form/FormLabel.vue';
import ButtonLoanding from '../../../components/form/ButtonLoanding.vue';
import ButtonIcon from '../../../components/form/ButtonIcon.vue';
import InvalidFeedback from '../../../components/errors/InvalidFeedback.vue';

const listCurrencies = ref([])

const defaulthHospital = ref()

const token = ref('')
let errors = ref({})
let errorResp = ref('')

const isLoanding = ref(false)
const isDataLoanding = ref(false)
const isEditing = ref(true)
const isNetWorkError = ref(false)

const formValues = ref()
const form = ref(null)
const toastr = useToastr()
const hospitalId = reactive({
    branch_id: 0
})

const schema = yup.object({
    name: yup.string().required(),
})

const add = async () => {
    isEditing.value = false;
    $('#addCurrencyModal').modal('show');
    form.value.resetForm()
}

const getData = async () => {
    isDataLoanding.value = true;
    isNetWorkError.value = false
    try {
        const response = await CurrencyApi.getData('currency');
        listCurrencies.value = response.data.data;
        isDataLoanding.value = false
    } catch (error) {
        console.log(error)
        if (error.code) {
            isNetWorkError.value = true
            errorResp.value = error.message
        }
        isDataLoanding.value = false
    }
}

const edit = (currency) => {
    isEditing.value = true;
    $('#addCurrencyModal').modal('show');
    form.value.resetForm()
    formValues.value = {
        id: currency.id,
        name: currency.name,
    }
}

const create = async (values) => {
    isLoanding.value = true
    try {
        const response = await CurrencyApi.create('currency',values);
        if (response.data.success) {
            isLoanding.value = false
            listCurrencies.value.unshift(response.data.currency)
            toastr.success(response.data.message, 'Validation')
            $('#addCurrencyModal').modal('hide');
            form.value.resetForm()
        } else {
            if (response.data.errors) {
                errorResp.value = response.data.errors
            } else {
                errorResp.value = response.data.message
            }
            isLoanding.value = false
            toastr.error(errorResp.value, 'Validation')
        }
    } catch (error) {
        console.log(error);
    } finally {
        form.value.resetForm()
    }
}

const update = async (values) => {
    isLoanding.value = true
    try {
        const response = await CurrencyApi.update('currency/',formValues.value.id, values)
        if (response.data.success) {
            isLoanding.value = false
            const index = listCurrencies.value.findIndex(currency => currency.id == response.data.currency.id)
            listCurrencies.value[index] = response.data.currency
            toastr.success(response.data.message, 'Validation')
            $('#addCurrencyModal').modal('hide');
            form.value.resetForm()
        } else {
            errorResp.value = response.data.message
            isLoanding.value = false
        }
    } catch (error) {
        console.log(error)
    } finally {
        form.value.resetForm()
    }

}

const handlerSubmit = (values) => {
    if (isEditing.value) {
        update(values)
    } else {
        create(values)
    }
}

const deleteCurrency = async (id) => {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't delete this currency!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes'
    }).then(async (result) => {
        if (result.isConfirmed) {
            const response = await CurrencyApi.delete('currency/',id)
            if (response.data.success) {
                Swal.fire(
                    'Deleted!',
                    response.data.message,
                    'success'
                )
                listCurrencies.value = listCurrencies.value.filter(currency => currency.id != id);
            } else {
                Swal.fire(
                    'Warning',
                    response.data.message,
                    'error'
                )
            }

        }
    })
}

const getCurrencies = async () => {
    isDataLoanding.value = true;
    isNetWorkError.value = false;
    try {
        const response = await CurrencyApi.getData('currency');
        listCurrencies.value = response.data.data;
        isDataLoanding.value = false
    } catch (error) {
        console.log(error)
        if (error.code) {
            isNetWorkError.value = true
            errorResp.value = error.message
        }
        isDataLoanding.value = false
    }
}

onMounted(async () => {
    token.value = localStorage.getItem('token')
    defaulthHospital.value = JSON.parse(localStorage.getItem('hospital'))
    hospitalId.id = defaulthHospital.value.id
    getCurrencies()
})

</script>
<template>
    <AdminLayout>
        <div class="content-header">
            <div class="container-fluid">
                <div class="d-flex justify-content-end">
                    <div class="">
                        <ol class="breadcrumb float-sm-right">
                            <li class="breadcrumb-item">
                                <RouterLink to="/">Menu</RouterLink>
                            </li>
                            <li class="breadcrumb-item">
                                <RouterLink to="/admin/settings">Settings</RouterLink>
                            </li>
                            <li class="breadcrumb-item active">Currencies</li>
                        </ol>
                    </div><!-- /.col -->
                </div><!-- /.row -->
            </div><!-- /.container-fluid -->
        </div>
        <div v-if="isNetWorkError">
            <NetworkError :message=errorResp @load-data="getData" />
        </div>
        <!--List rates -->
        <div v-else class="card card-primary card-outline">
            <div class="card-header">
                <div class="d-flex justify-content-between">
                    <div>
                        <h5 class="m-0"><i class="fa fa-list" aria-hidden="true"></i> List of currencies</h5>
                    </div>
                    <div>
                        <ButtonIcon @click="add" type="button" bg="primary" icon="fa fa-plus">New</ButtonIcon>
                    </div>

                </div>
            </div>
            <div class="card-body">
                <div v-if="isDataLoanding" class="d-flex justify-content-center">
                    <div class="spinner-border" role="status">
                        <span hidden class="visually-hidden">Loading...</span>
                    </div>
                </div>
                <table v-else class="table table-bordered table-sm">
                    <thead>
                        <tr>
                            <th class="text-center">#</th>
                            <th>NAME</th>
                            <th class="text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody v-if="listCurrencies.length > 0">
                        <CurrencyItemListWidget v-for="(currency, index) in listCurrencies" :key="currency.id"
                            :currency=currency :index=index @edit-currency="edit"
                            @delete-currency="deleteCurrency(currency.id)" />
                    </tbody>
                    <tbody v-else>
                        <tr>
                            <td colspan="3" class="text-center p-4 text-secondary"> <i class="fas fa-database"></i> Not
                                result
                                found...</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <!--Add Modal -->
        <div class="modal fade" id="addCurrencyModal" tabindex="-1" aria-labelledby="addCurrencyModalLabel"
            aria-hidden="true">
            <div class="modal-dialog">
                <Form ref="form" @submit="handlerSubmit" :validation-schema="schema" v-slot="{ errors }"
                    :initial-values="formValues">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 v-if="isEditing" class="modal-title" id="addCurrencyModalLabel">
                                <i class="fa fa-plus-circle" aria-hidden="true"></i> EDIT CURRENCY
                            </h5>
                            <h5 v-else class="modal-title" id="addCurrencyModalLabel">
                                <i class="fas fa-edit    "></i>
                                CREATE CURRENCY
                            </h5>
                        </div>
                        <div class="modal-body">
                            <div class="form-group">
                                <label>Amount</label>
                                <Field name="name" type="text" class="form-control" :class="{ 'is-invalid': errors.name }"
                                    placeholder="Name of currency" />
                                <span class="invalid-feedback">{{ errors.name }}</span>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button type="submit" class="btn btn-primary">
                                <div class="d-flex justify-content-center">
                                    <div v-if="isLoanding" class="spinner-border text-light" role="status"></div>
                                    <div class="pl-2"> Save changes</div>
                                </div>
                            </button>
                        </div>
                    </div>
                </Form>
            </div>
        </div>
        <FormModal id="addCurrencyModal" aniamte="fade" size="" :is-editing="isEditing" modal-title="RATE">
            <Form ref="form" @submit="handlerSubmit" :validation-schema="schema" v-slot="{ errors }"
                :initial-values="formValues">
                <FormGroup>
                    <FormLabel id="name" for-value="name">Name of currency</FormLabel>
                    <Field name="name" type="text" class="form-control" :class="{ 'is-invalid': errors.name }"
                        placeholder="Curreny" />
                        <InvalidFeedback>{{ errors.name }}</InvalidFeedback>
                </FormGroup>
                <div class="d-flex justify-content-end">
                    <ButtonLoanding type="submit" bg="primary" btn-size="btn-md" :is-loanding="isLoanding">Save changes</ButtonLoanding>
                </div>
            </Form>
        </FormModal>
    </AdminLayout>
</template>