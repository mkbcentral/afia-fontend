<script setup>
import AdminLayout from '../../../layouts/AdminLayout.vue';
import { ref, reactive, onMounted } from 'vue'
import { Form, Field } from 'vee-validate'
import * as yup from 'yup'
import { useToastr } from '../../../../src/widgets/toastr.js'
import RateApi from '../../../services/Admin/RateApi'
import NetworkError from '../../../components/errors/Network.vue';
import Swal from 'sweetalert2'
import ItemListRateWidget from './widgets/ItemListRateWidget.vue';

const listRates = ref([])

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
    amount: yup.number().required(),
})

const add = async () => {
    isEditing.value = false;
    $('#addRateModal').modal('show');
    form.value.resetForm()
}

const getData = async () => {
    isDataLoanding.value = true;
    isNetWorkError.value = false
    try {
        const response = await RateApi.getRates();
        listRates.value = response.data.data;
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

const edit = (rate) => {
    isEditing.value = true;
    $('#addRateModal').modal('show');
    form.value.resetForm()
    formValues.value = {
        id: rate.id,
        amount: rate.amount,
    }
}


const create = async (values) => {
    isLoanding.value = true
    values.hospital_id = hospitalId.id
    try {
        const response = await RateApi.createRate(values);
        if (response.data.success) {
            isLoanding.value = false
            listRates.value.unshift(response.data.rate)
            toastr.success(response.data.message, 'Validation')
            $('#addRateModal').modal('hide');
            form.value.resetForm()
        } else {
            errorResp.value = response.data.message
            isLoanding.value = false
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
        const response = await RateApi.updateRate(formValues.value.id, values)
        if (response.data.success) {
            isLoanding.value = false
            const index = listRates.value.findIndex(rate => rate.id == response.data.rate.id)
            listRates.value[index] = response.data.rate
            toastr.success(response.data.message, 'Validation')
            $('#addRateModal').modal('hide');
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

const changeStatus = async (id) => {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't change status for this rate!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes'
    }).then(async (result) => {
        if (result.isConfirmed) {
            const response = await RateApi.changeStatus(id);
            if (response.data.success) {
                Swal.fire(
                    'Deleted!',
                    response.data.message,
                    'success'
                )
                const index = listRates.value.findIndex(rate => rate.id == response.data.rate.id)
                listRates.value[index] = response.data.rate
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

const deleteRate = async (id) => {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't delete this rate!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes'
    }).then(async (result) => {
        if (result.isConfirmed) {
            const response = await RateApi.deletetRate(id)
            if (response.data.success) {
                Swal.fire(
                    'Deleted!',
                    response.data.message,
                    'success'
                )
                listRates.value = listRates.value.filter(rate => rate.id != id);
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

const getRates = async () => {
    isDataLoanding.value = true;
    isNetWorkError.value = false;
    try {
        const response = await RateApi.getRates();
        listRates.value = response.data.data;
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
    getRates()
})

</script>
<template>
    <AdminLayout>
        <div v-if="isNetWorkError">
            <NetworkError :message=errorResp @load-data="getData" />
        </div>
        <div v-else class="card card-primary card-outline">
            <div class="card-header">
                <div class="d-flex justify-content-between">
                    <div>
                        <h5 class="m-0"><i class="fa fa-list" aria-hidden="true"></i> List of rates</h5>
                    </div>
                    <div>
                        <button @click="add" type="button" class="btn btn-primary btn-sm"><i class="fa fa-plus-circle"
                                aria-hidden="true"></i>New</button>
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
                            <th>#</th>
                            <th>NAME</th>
                            <th class="text-center">STATUS</th>
                            <th class="text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <ItemListRateWidget v-for="(rate, index) in listRates" :key="rate.id" :rate=rate :index=index
                            @edit-rate="edit" @change-status="changeStatus(rate.id)" @delete-rate="deleteRate(rate.id)" />
                    </tbody>
                </table>
            </div>
        </div>
        <!--Add Modal -->
        <div class="modal fade" id="addRateModal" tabindex="-1" aria-labelledby="addRateModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <Form ref="form" @submit="handlerSubmit" :validation-schema="schema" v-slot="{ errors }"
                    :initial-values="formValues">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 v-if="isEditing" class="modal-title" id="addRateModalLabel">
                                <i class="fa fa-plus-circle" aria-hidden="true"></i> EDIT RATE
                            </h5>
                            <h5 v-else class="modal-title" id="addRateModalLabel">
                                <i class="fas fa-edit    "></i>
                                CREATE RATE
                            </h5>
                        </div>
                        <div class="modal-body">
                            <div class="form-group">
                                <label>Amount</label>
                                <Field name="amount" type="text" class="form-control"
                                    :class="{ 'is-invalid': errors.amount }" placeholder="0" />
                                <span class="invalid-feedback">{{ errors.amount }}</span>
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
    </AdminLayout>
</template>