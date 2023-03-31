<script setup>
import AdminLayout from '../../../layouts/AdminLayout.vue';
import { ref, reactive, onMounted } from 'vue'
import { Form, Field } from 'vee-validate'
import * as yup from 'yup'
import { useToastr } from '../../../../src/widgets/toastr.js'
import NetworkError from '../../../components/errors/Network.vue'
import Swal from 'sweetalert2'
import SubscrptionApi from '../../../services/Admin/SubscriptionApi'
import SubscriptionItemWidget from '../others/widgets/SubscriptionItemWidget.vue'

const listSubscriptions = ref([])
const defaulthHospital = ref()
const hospitalId = reactive({
    branch_id: 0
})
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
const schema = yup.object({
    name: yup.string().required(),
    amount: yup.number().required(),
    familly_quota: yup.number().required(),
})
const add = async () => {
    isEditing.value = false;
    $('#addSubscriptionhModal').modal('show');
    form.value.resetForm()
}
const getData = async () => {
    isDataLoanding.value = true
    isNetWorkError.value = false
    try {
        const response = await SubscrptionApi.getSubscriptions();
        listSubscriptions.value = response.data.data
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
const edit = (subscription) => {
    isEditing.value = true;
    $('#addSubscriptionhModal').modal('show');
    form.value.resetForm()
    formValues.value = {
        id: subscription.id,
        name: subscription.name,
        amount: subscription.amount,
        familly_quota: subscription.familly_quota,
    }
}
const create = async (values) => {
    isLoanding.value = true
    values.hospital_id = hospitalId.id
    try {
        const response = await SubscrptionApi.createSubscription(values);
        if (response.data.success) {
            console.log(response.data)
            isLoanding.value = false
            getSubscriptions()
            toastr.success(response.data.message, 'Validation')
            $('#addSubscriptionhModal').modal('hide');
            form.value.resetForm()
        } else {
            errorResp.value = response.data.message
            isLoanding.value = false
        }
    } catch (error) {
        console.log(error)
        isLoanding.value = false
        toastr.success(error.message, 'Validation')
    } finally {
        form.value.resetForm()
        isLoanding.value = false
    }
}
const update = async (values) => {
    isLoanding.value = true
    try {
        const response = await SubscrptionApi.updateSubscription(formValues.value.id, values)
        if (response.data.success) {
            isLoanding.value = false
            getSubscriptions()
            toastr.success(response.data.message, 'Validation')
            $('#addSubscriptionhModal').modal('hide');
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
const changeStatus = async (subscription, status) => {
    try {
        const response = await SubscrptionApi.changeStatus(subscription.id, { status: status })
        toastr.success(response.data.message, 'Validation')
    } catch (error) {
        console.log(error)
    }
}
const deleteSubscription = async (id) => {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't delete this role!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes'
    }).then(async (result) => {
        if (result.isConfirmed) {
            const response = await SubscrptionApi.deleteSubscription(id)
            if (response.data.success) {
                Swal.fire(
                    'Deleted!',
                    response.data.message,
                    'success'
                )
                getSubscriptions()
            } else {
                Swal.fire(
                    'Warning',
                    response.data.message,
                    'error'
                )
            }
        }
    });
}
const getSubscriptions = async () => {
    isDataLoanding.value = true
    isNetWorkError.value = false
    try {
        const response = await SubscrptionApi.getSubscriptions();
        listSubscriptions.value = response.data.data
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
    getSubscriptions()
})
</script>

<template>
    <AdminLayout>
        <div>
            <div v-if="isNetWorkError">
                <NetworkError :message=errorResp @load-data="getData" />
            </div>
            <div v-else class="card card-primary card-outline">
                <div class="card-header">
                    <div class="d-flex justify-content-between">
                        <div>
                            <h5 class="m-0"><i class="fa fa-list" aria-hidden="true"></i> List of branches</h5>
                        </div>
                        <div>
                            <button @click="add" type="button" class="btn btn-primary btn-sm">
                                <i class="fa fa-plus-circle" aria-hidden="true"></i>
                                New
                            </button>
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
                                <th class="text-center">AMOUNT</th>
                                <th class="text-center">QUOTA FAMILLY</th>
                                <th>STATUS</th>
                                <th class="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <SubscriptionItemWidget v-for="(subscription, index) in listSubscriptions" :key="subscription.id" :subscription=subscription
                                :index=index @edit-subscription="edit" @change-status="changeStatus"
                                @delete-subscription="deleteSubscription(subscription.id)" />
                        </tbody>
                    </table>
                </div>
            </div>

            <!--Add Modal -->
            <div class="modal fade" id="addSubscriptionhModal" tabindex="-1" aria-labelledby="addSubscriptionhModalLabel"
                aria-hidden="true">
                <div class="modal-dialog">
                    <Form ref="form" @submit="handlerSubmit" :validation-schema="schema" v-slot="{ errors }"
                        :initial-values="formValues">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 v-if="isEditing" class="modal-title" id="addSubscriptionhModalLabel">
                                    <i class="fa fa-plus-circle" aria-hidden="true"></i> EDIT SUBSCRIPTION
                                </h5>
                                <h5 v-else class="modal-title" id="addSubscriptionhModalLabel">
                                    <i class="fas fa-edit    "></i>
                                    CREATE SUBSCRIPTION
                                </h5>
                            </div>
                            <div class="modal-body">
                                <div class="form-group">
                                    <label>Name</label>
                                    <Field name="name" type="text" class="form-control"
                                        :class="{ 'is-invalid': errors.name }" placeholder="subscription name" />
                                    <span class="invalid-feedback">{{ errors.name }}</span>
                                </div>
                                <div class="form-group">
                                    <label>Amount</label>
                                    <Field name="amount" type="number" class="form-control"
                                        :class="{ 'is-invalid': errors.amount }" placeholder="Amount" />
                                    <span class="invalid-feedback">{{ errors.amount }}</span>
                                </div>
                                <div class="form-group">
                                    <label>Fammily quota</label>
                                    <Field name="familly_quota" type="number" class="form-control"
                                        :class="{ 'is-invalid': errors.familly_quota }"
                                        placeholder="Familly quota" />
                                    <span class="invalid-feedback">{{ errors.familly_quota }}</span>
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
        </div>
    </AdminLayout></template>