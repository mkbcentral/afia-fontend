<script setup>
import AdminLayoutVue from '../../../layouts/AdminLayout.vue';
import { ref, reactive, onMounted } from 'vue'
import { Form, Field } from 'vee-validate'
import * as yup from 'yup'
import { useToastr } from '../../../../src/widgets/toastr.js'
import NetworkError from '../../../components/errors/Network.vue'
import Swal from 'sweetalert2'
import CompanyApi from '../../../services/Admin/AdminApi.js'
import SubscriptionApi from '../../../services/Admin/AdminApi.js';
import CompanyItemListViewVue from './widgets/CompanyItemListView.vue';

import FormModal from '../../../components/form/modals/FormModal.vue';
import FormGroup from '../../../components/form/FormGroup.vue';
import FormLabel from '../../../components/form/FormLabel.vue';
import ButtonLoanding from '../../../components/form/ButtonLoanding.vue';
import ButtonIcon from '../../../components/form/ButtonIcon.vue';
import InvalidFeedback from '../../../components/errors/InvalidFeedback.vue';

const listCompanies = ref([])
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
    subscription_id: yup.number().required(),
})

const add = async () => {
    isEditing.value = false;
    $('#addCompanyModal').modal('show');
    form.value.resetForm()
}
const getData = async () => {
    isDataLoanding.value = true
    isNetWorkError.value = false
    try {
        const response = await CompanyApi.getData('company');
        listCompanies.value = response.data.data
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
const getSubscriptions = async () => {
    try {
        const response = await SubscriptionApi.getData('subscription');
        listSubscriptions.value = response.data.data
    } catch (error) {
        console.log(error)
        if (error.code) {
            isNetWorkError.value = true
            errorResp.value = error.message
        }
    }
}
const edit = (company) => {
    isEditing.value = true;
    $('#addCompanyModal').modal('show');
    form.value.resetForm()
    formValues.value = {
        id: company.id,
        name: company.name,
        subscription_id: company.subscription.id,
    }
}
const create = async (values,actions) => {
    isLoanding.value = true
    try {
        const response = await CompanyApi.create('company', values);
        if (response.data.success) {
            isLoanding.value = false
            listCompanies.value.unshift(response.data.company)
            toastr.success(response.data.message, 'Validation')
            $('#addCompanyModal').modal('hide');
            actions.resetForm
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
        isLoanding.value = false
        toastr.success(error.message, 'Validation')
    } finally {
        form.value.resetForm()
        isLoanding.value = false
    }
}
const update = async (values, actions) => {
    isLoanding.value = true
    try {
        const response = await CompanyApi.update('company/', formValues.value.id, values)
        if (response.data.success) {
            isLoanding.value = false
            const index = listCompanies.value.findIndex(company => company.id == response.data.company.id)
            listCompanies.value[index] = response.data.company
            toastr.info(response.data.message, 'Validation')
            $('#addCompanyModal').modal('hide');
            actions.resetForm
        } else {
            errorResp.value = response.data.message
            isLoanding.value = false
        }
    } catch (error) {
        isLoanding.value = false
        toastr.error(error.message, 'Validation')
    }
}
const handlerSubmit = (values,actions) => {
    if (isEditing.value) {
        update(values,actions)
    } else {
        create(values,actions)
    }
}
const deleteCompany = async (id) => {
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
            const response = await CompanyApi.delete('company/', id)
            if (response.data.success) {
                Swal.fire(
                    'Deleted!',
                    response.data.message,
                    'success'
                )
                listCompanies.value = listCompanies.value.filter(company => company.id != id);
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
const getCompanies = async () => {
    isDataLoanding.value = true
    isNetWorkError.value = false
    try {
        const response = await CompanyApi.getData('company');
        listCompanies.value = response.data.data
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
    getCompanies()
    getSubscriptions()
})
</script>

<template>
    <AdminLayoutVue>
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
                            <li class="breadcrumb-item active">Companies</li>
                        </ol>
                    </div><!-- /.col -->
                </div><!-- /.row -->
            </div><!-- /.container-fluid -->
        </div>
        <div v-if="isNetWorkError">
            <NetworkError :message=errorResp @load-data="getData" />
        </div>
        <div v-else class="card card-primary card-outline">
            <div class="card-header">
                <div class="d-flex justify-content-between">
                    <div>
                        <h5 class="m-0"><i class="fa fa-list" aria-hidden="true"></i> List of companies</h5>
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
                            <th>SUBSCRIPTION</th>
                            <th class="text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody v-if="listCompanies.length > 0">
                        <CompanyItemListViewVue v-for="(company, index) in listCompanies" :key="company.id" :company=company
                            :index=index @edit-company="edit" @delete-company="deleteCompany(company.id)" />
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
        <FormModal id="addCompanyModal" aniamte="fade" size="" :is-editing="isEditing" modal-title="COMPANY">
            <Form ref="form" @submit="handlerSubmit" :validation-schema="schema" v-slot="{ errors }"
                :initial-values="formValues">
                <FormGroup>
                    <FormLabel id="name" for-value="name">Name </FormLabel>
                    <Field name="name" type="text" class="form-control" :class="{ 'is-invalid': errors.name }"
                        placeholder="Name of company" />
                    <InvalidFeedback>{{ errors.name }}</InvalidFeedback>
                </FormGroup>
                <FormGroup>
                    <FormLabel id="name" for-value="name">Name role</FormLabel>
                    <Field class="form-control" name="subscription_id" as="select"
                        :class="{ 'is-invalid': errors.subscription_id }">
                        <option :value="null">Choose here</option>
                        <option v-for="subscription in listSubscriptions" :value="subscription.id">{{
                            subscription.name }}
                        </option>
                    </Field>
                    <InvalidFeedback>{{ errors.subscription_id }}</InvalidFeedback>
                </FormGroup>
                <div class="d-flex justify-content-end">
                    <ButtonLoanding type="submit" bg="primary" btn-size="btn-md" :is-loanding="isLoanding">Save changes
                    </ButtonLoanding>
                </div>
            </Form>
        </FormModal>
    </AdminLayoutVue>
</template>
