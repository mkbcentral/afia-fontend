<script setup>
import AdminLayoutVue from '../../../layouts/AdminLayout.vue';
import { ref, reactive, onMounted } from 'vue'
import { Form, Field } from 'vee-validate'
import * as yup from 'yup'
import { useToastr } from '../../../../src/widgets/toastr.js'
import NetworkError from '../../../components/errors/Network.vue'
import Swal from 'sweetalert2'
import CompanyApi from '../../../services/Admin/CompanyApi'
import SubscriptionApi from '../../../services/Admin/SubscriptionApi';
import CompanyItemListViewVue from './widgets/CompanyItemListView.vue';

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
        const response = await CompanyApi.getCompanies();
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
        const response = await SubscriptionApi.getSubscriptions();
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
const create = async (values) => {
    isLoanding.value = true
    values.hospital_id = hospitalId.id
    try {
        const response = await CompanyApi.createCompany(values);
        if (response.data.success) {
            isLoanding.value = false
            listCompanies.value.unshift(response.data.company)
            toastr.success(response.data.message, 'Validation')
            $('#addCompanyModal').modal('hide');
            form.value.resetForm()//Ben MWILA
        } else {
            errorResp.value = response.data.message
            isLoanding.value = false
        }
    } catch (error) {
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
        const response = await CompanyApi.updateCompany(formValues.value.id, values)
        if (response.data.success) {
            isLoanding.value = false
            //const index=listCompanies.value.findIndex(company=>company.id==response.data.company.id)
            //listCompanies.value[index].id = response.data.company.id
            getCompanies()
            toastr.info(response.data.message, 'Validation')
            $('#addCompanyModal').modal('hide');
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
            const response = await CompanyApi.deleteCompany(id)
            if (response.data.success) {
                Swal.fire(
                    'Deleted!',
                    response.data.message,
                    'success'
                )
                listCompanies.value=listCompanies.value.filter(company=>company.id !=id);
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
        const response = await CompanyApi.getCompanies();
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
                            <th>SUBSCRIPTION</th>
                            <th class="text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <CompanyItemListViewVue v-for="(company, index) in listCompanies" :key="company.id" :company=company
                            :index=index @edit-company="edit" @delete-company="deleteCompany(company.id)" />
                    </tbody>
                </table>
            </div>
        </div>
        <!--Add Modal -->
        <div class="modal fade" id="addCompanyModal" tabindex="-1" aria-labelledby="addCompanyModalLabel"
            aria-hidden="true">
            <div class="modal-dialog">
                <Form ref="form" @submit="handlerSubmit" :validation-schema="schema" v-slot="{ errors }"
                    :initial-values="formValues">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 v-if="isEditing" class="modal-title" id="addCompanyModalLabel">
                                <i class="fa fa-plus-circle" aria-hidden="true"></i> EDIT COMPANY
                            </h5>
                            <h5 v-else class="modal-title" id="addCompanyModalLabel">
                                <i class="fas fa-edit    "></i>
                                CREATE COMPANY
                            </h5>
                        </div>
                        <div class="modal-body">
                            <div class="form-group">
                                <label>Name</label>
                                <Field name="name" type="text" class="form-control" :class="{ 'is-invalid': errors.name }"
                                    placeholder="subscription name" />
                                <span class="invalid-feedback">{{ errors.name }}</span>
                            </div>
                            <div class="form-group">
                                <label for="">Subscription</label>
                                <Field class="form-control" name="subscription_id" as="select"
                                    :class="{ 'is-invalid': errors.subscription_id }">
                                    <option :value="null">Choose here</option>
                                    <option v-for="subscription in listSubscriptions" 
                                        :value="subscription.id">{{ subscription.name }}
                                    </option>
                                </Field>
                                <span class="invalid-feedback">{{ errors.subscription_id }}</span>
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
    </AdminLayoutVue>
</template>
