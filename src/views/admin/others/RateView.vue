<script setup>
import AdminLayout from '../../../layouts/AdminLayout.vue';
import { ref, reactive, onMounted } from 'vue'
import { Form, Field } from 'vee-validate'
import * as yup from 'yup'
import { useToastr } from '../../../../src/widgets/toastr.js'
import RateApi from '../../../services/Admin/AdminApi.js'
import NetworkError from '../../../components/errors/Network.vue';
import Swal from 'sweetalert2'
import ItemListRateWidget from './widgets/ItemListRateWidget.vue';
import FormModal from '../../../components/from/modals/FormModal.vue';
import FormGroup from '../../../components/from/FormGroup.vue';
import FormLabel from '../../../components/from/FormLabel.vue';
import ButtonLoanding from '../../../components/from/ButtonLoanding.vue';
import ButtonIcon from '../../../components/from/ButtonIcon.vue';
import InvalidFeedback from '../../../components/errors/InvalidFeedback.vue';

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
        const response = await RateApi.getData('rate');
        listRates.value = response.data.data;
        isDataLoanding.value = false
    } catch (error) {
        
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
    try {
        const response = await RateApi.create('rate',values);
        if (response.data.success) {
            isLoanding.value = false
            listRates.value.unshift(response.data.rate)
            toastr.success(response.data.message, 'Validation')
            $('#addRateModal').modal('hide');
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
        const response = await RateApi.update('rate/',formValues.value.id, values)
        if (response.data.success) {
            isLoanding.value = false
            const index = listRates.value.findIndex(rate => rate.id == response.data.rate.id)
            listRates.value[index] = response.data.rate
            toastr.info(response.data.message, 'Validation')
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
            const response = await RateApi.changeStatusBoolean('/rate/status/',id);
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
            const response = await RateApi.delete('rate/',id)
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
        const response = await RateApi.getData('rate');
        listRates.value = response.data.data;
        isDataLoanding.value = false
    } catch (error) {
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
                    <li class="breadcrumb-item active">Rates</li>
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
                        <h5 class="m-0"><i class="fa fa-list" aria-hidden="true"></i> List of rates</h5>
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
                            <th class="text-center">STATUS</th>
                            <th class="text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody v-if="listRates.length > 0">
                        <ItemListRateWidget v-for="(rate, index) in listRates" :key="rate.id" :rate=rate :index=index
                            @edit-rate="edit" @change-status="changeStatus(rate.id)" @delete-rate="deleteRate(rate.id)" />
                    </tbody>
                    <tbody v-else>
                        <tr>
                            <td colspan="4" class="text-center p-4 text-secondary"> <i class="fas fa-database"></i> Not
                                result
                                found...</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <!--Add Modal -->
        <FormModal id="addRateModal" aniamte="fade" size="" :is-editing="isEditing" modal-title="RATE">
            <Form ref="form" @submit="handlerSubmit" :validation-schema="schema" v-slot="{ errors }"
                :initial-values="formValues">
                <FormGroup>
                    <FormLabel id="name" for-value="name">Amount</FormLabel>
                    <Field name="amount" type="text" class="form-control" :class="{ 'is-invalid': errors.amount }"
                        placeholder="Amount" />
                        <InvalidFeedback>{{ errors.amount }}</InvalidFeedback>
                </FormGroup>
                <div class="d-flex justify-content-end">
                    <ButtonLoanding type="submit" bg="primary" btn-size="btn-md" :is-loanding="isLoanding">Save changes</ButtonLoanding>
                </div>
            </Form>
        </FormModal>
    </AdminLayout>
</template>