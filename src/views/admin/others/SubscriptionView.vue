<script setup>
import AdminLayout from '../../../layouts/AdminLayout.vue';
import { ref, reactive, onMounted } from 'vue'
import { Form, Field } from 'vee-validate'
import * as yup from 'yup'
import { useToastr } from '../../../../src/widgets/toastr.js'
import NetworkError from '../../../components/errors/Network.vue'
import Swal from 'sweetalert2'
import SubscrptionApi from '../../../services/Admin/AdminApi.js'
import SubscriptionItemWidget from '../others/widgets/SubscriptionItemWidget.vue'
import FormModal from '../../../components/form/modals/FormModal.vue';
import FormGroup from '../../../components/form/FormGroup.vue';
import FormLabel from '../../../components/form/FormLabel.vue';
import ButtonLoanding from '../../../components/form/ButtonLoanding.vue';
import ButtonIcon from '../../../components/form/ButtonIcon.vue';
import InvalidFeedback from '../../../components/errors/InvalidFeedback.vue';

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
    familly_quota: yup.string().required(),
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
        const response = await SubscrptionApi.getData('subscription');
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
    try {
        const response = await SubscrptionApi.create('subscription',values);
        if (response.data.success) {
            isLoanding.value = false
            listSubscriptions.value.unshift(response.data.subscription)
            toastr.success(response.data.message, 'Validation')
            $('#addSubscriptionhModal').modal('hide');
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
        const response = await SubscrptionApi.update('subscription/',formValues.value.id, values)
        if (response.data.success) {
            isLoanding.value = false
            const index = listSubscriptions.value.findIndex(subscription => subscription.id == response.data.subscription.id)
            listSubscriptions.value[index] = response.data.subscription
            toastr.info(response.data.message, 'Validation')
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
        const response = await SubscrptionApi.changeStatusString('/subscription/status/',subscription.id, { status: status })
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
            const response = await SubscrptionApi.delete('subscription/',id)
            if (response.data.success) {
                Swal.fire(
                    'Deleted!',
                    response.data.message,
                    'success'
                )
                listSubscriptions.value = listSubscriptions.value.filter(subscription => subscription.id != id);
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
        const response = await SubscrptionApi.getData('subscription');
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
                            <li class="breadcrumb-item active">Subscriptions</li>
                        </ol>
                    </div><!-- /.col -->
                </div><!-- /.row -->
            </div><!-- /.container-fluid -->
        </div>
        <div>
            <div v-if="isNetWorkError">
                <NetworkError :message=errorResp @load-data="getData" />
            </div>
            <div v-else class="card card-primary card-outline">
                <div class="card-header">
                    <div class="d-flex justify-content-between">
                        <div>
                            <h5 class="m-0"><i class="fa fa-list" aria-hidden="true"></i> List of subcriptions</h5>
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
                                <th class="text-center">AMOUNT</th>
                                <th class="text-center">QUOTA FAMILLY</th>
                                <th>STATUS</th>
                                <th class="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody v-if="listSubscriptions.length>0">
                            <SubscriptionItemWidget v-for="(subscription, index) in listSubscriptions"
                                :key="subscription.id" :subscription=subscription :index=index @edit-subscription="edit"
                                @change-status="changeStatus" @delete-subscription="deleteSubscription(subscription.id)" />
                        </tbody>
                        <tbody v-else>
                        <tr>
                            <td colspan="6" class="text-center p-4 text-secondary"> <i class="fas fa-database"></i> Not
                                result
                                found...</td>
                        </tr>
                    </tbody>
                    </table>
                </div>
            </div>

            <!--Add Modal -->
            <FormModal id="addSubscriptionhModal" aniamte="fade" size="" :is-editing="isEditing" modal-title="SUBSCRIPTION">
                <Form ref="form" @submit="handlerSubmit" :validation-schema="schema" v-slot="{ errors }"
                    :initial-values="formValues">
                    <FormGroup>
                        <FormLabel id="name" for-value="name">Name </FormLabel>
                        <Field name="name" type="text" class="form-control" :class="{ 'is-invalid': errors.name }"
                            placeholder="Name of subscription" />
                            <InvalidFeedback>{{ errors.name }}</InvalidFeedback>
                    </FormGroup>
                    <FormGroup>
                        <FormLabel id="name" for-value="name">Amount</FormLabel>
                        <Field name="amount" type="number" class="form-control"
                        :class="{ 'is-invalid': errors.amount }" placeholder="Amount" />
                            <InvalidFeedback>{{ errors.amount }}</InvalidFeedback>
                    </FormGroup>
                    <FormGroup>
                        <FormLabel id="name" for-value="name">Name role</FormLabel>
                        <Field name="familly_quota" type="number" class="form-control"
                        :class="{ 'is-invalid': errors.familly_quota }" placeholder="Familly quota" />
                            <InvalidFeedback>{{ errors.familly_quota }}</InvalidFeedback>
                    </FormGroup>
                    <div class="d-flex justify-content-end">
                        <ButtonLoanding type="submit" bg="primary" btn-size="btn-md" :is-loanding="isLoanding">Save changes</ButtonLoanding>
                    </div>
                </Form>
            </FormModal>
        </div>
    </AdminLayout>
</template>