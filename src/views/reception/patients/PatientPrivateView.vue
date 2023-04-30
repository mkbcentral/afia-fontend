<script setup>
import ReceptionLayout from '../../../layouts/ReceptionLayout.vue';
import { ref, onMounted, watch } from 'vue'
import { Form, Field } from 'vee-validate'
import * as yup from 'yup'
import Swal from 'sweetalert2/dist/sweetalert2.all.min.js'
import ApiPatient from '../../../services/Patients/PatientApi.js'
import ConsultationApi from '../../../services/Admin/AdminApi.js'
import ItemListPatientPrivate from './Widgets/ItemListPatientPrivate.vue';
import NetworkError from '../../../components/errors/Network.vue';
import { debounce } from 'lodash';
import { useToastr } from '../../../widgets/toastr.js'

const listPatients = ref([])
const lisConsultation = ref([])
let errorResp = ref('')
const toastr = useToastr()

const formValues = ref({})
const isLoanding = ref(false)
const form = ref(null)

const isDataLoanding = ref(false)
const isNetWorkError = ref(false)
const searchQuary = ref(null)


const page = ref(10)
const pageCount = ref(null)
const currentPage = ref(1);
const patientData = ref({})
let errors = ref({})

const schema = yup.object({
    consultation_id: yup.string().required(),
})

const getData = async () => {
    isDataLoanding.value = true;
    isNetWorkError.value = false;
    try {
        const response = await ApiPatient.getPatients('/patient-private?page_page=' + page.value);
        listPatients.value = response.data.data;
        isDataLoanding.value = false
    } catch (error) {
        if (error.code) {
            isNetWorkError.value = true
            errorResp.value = error.message
        }
        isDataLoanding.value = false
    }
}

const getDataPagiantion = async (p) => {
    console.log(p)
    try {
        const response = await ApiPatient.getPatients('/patient-private?page_page=' + page.value + '&page=' + p);
        listPatients.value = response.data.data;
    } catch (error) {
        if (error.code) {
            isNetWorkError.value = true
            errorResp.value = error.message
        }
    }
}

const deletePatient = async (patient) => {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't delete patient : " + patient.name + ' ?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes'
    }).then(async (result) => {
        if (result.isConfirmed) {
            const response = await ApiPatient.deletePatient(patient.id, '/patient-private/')
            if (response.data.success) {
                Swal.fire(
                    'Deleted!',
                    response.data.message,
                    'success'
                )
                listPatients.value = listPatients.value.filter(p => p.id != patient.id);
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

const getPatients = async () => {
    isDataLoanding.value = true;
    isNetWorkError.value = false;
    try {
        const response = await ApiPatient.getPatients('/patient-private?page_page=' + page.value);
        listPatients.value = response.data.data;
        isDataLoanding.value = false
        pageCount.value = response.data.meta.total
    } catch (error) {
        if (error.code) {
            isNetWorkError.value = true
            errorResp.value = error.message
        }
        isDataLoanding.value = false
    }
}

const searchData = async () => {
    try {
        const response = await ApiPatient.searcchPatient(searchQuary.value, '/patient/private/search/');
        listPatients.value = response.data.data;
    } catch (error) {
        console.log(error)
    }
}

const showFormconsultation = (patient) => {
    $('#addConsultationModal').modal('show');
    patientData.value=patient;
   
    console.log(patient.form.id)
}

const makeNewConsulation = async (values,actions) => {
    values.form_id=patientData.value.form.id;
    isLoanding.value = true;
    try {
        const response = await ApiPatient.createConsultation(values, '/private-make-consultation')
        console.log(response.data)
        if (response.data.success) {
            isLoanding.value = false;
            toastr.success(response.data.message, 'Validation');
            $('#addConsultationModal').modal('hide');
        } else {
            isLoanding.value = false
            toastr.error(response.data.message, 'Validation')
            $('#addConsultationModal').modal('hide');
        }
    } catch (error) {
        isLoanding.value = false
        toastr.error(error.message, 'Validation')
    }
}

watch(searchQuary, debounce(() => {
    searchData()
}, 300))

const getConsultations = async () => {
    try {
        const response = await ConsultationApi.getData('consultation');
        lisConsultation.value = response.data.data;
    } catch (error) {
        if (error.code) {
            isNetWorkError.value = true
            errorResp.value = error.message
        }
    }
}


onMounted(async () => {
    await getPatients()
    await getConsultations()
})
</script>
<template>
    <ReceptionLayout>
        <div class="content-header">
            <div class="container-fluid">
                <div class="d-flex justify-content-end">
                    <div class="">
                        <ol class="breadcrumb float-sm-right">
                            <li class="breadcrumb-item">
                                <RouterLink to="/">Menu</RouterLink>
                            </li>
                            <li class="breadcrumb-item">
                                <RouterLink to="/reception/dashboard">Dashbord</RouterLink>
                            </li>
                            <li class="breadcrumb-item active">Patients privates</li>
                        </ol>
                    </div><!-- /.col -->
                </div><!-- /.row -->
            </div><!-- /.container-fluid -->
        </div>
        <!-- /.content-header -->
        <div v-if="isNetWorkError">
            <NetworkError :message=errorResp @load-data="getData" />
        </div>
        <div v-else class="card">
            <div class="card-header">
                <p style="color:  #032880; font-weight: bold;"><i class="fas fa-user-shield  fa-2x"></i> PATIENTS PRIVATES
                </p>
            </div>
            <div class="card-body">
                <div class="d-flex justify-content-between">
                    <div>
                        <h5 class="m-0"><i class="fa fa-list" aria-hidden="true"></i> List of patients private</h5>
                    </div>
                    <div>
                        <RouterLink to="/reception/create/patient/private" class="btn"
                            style="background-color: #032880;color: white;"><i class="fa fa-plus-circle"
                                aria-hidden="true"></i> New</RouterLink>
                    </div>

                </div>
            </div>
            <div class="card-body">
                <div v-if="isDataLoanding" class="d-flex justify-content-center">
                    <div class="spinner-border" role="status">
                        <span hidden class="visually-hidden">Loading...</span>
                    </div>
                </div>
                <div v-else>
                    <div class="d-flex">
                        <div class="form-group">
                            <input v-model="searchQuary" id="my-input" placeholder="Search here..." class="form-control"
                                type="text">
                        </div>
                    </div>
                    <table class="table table-bordered table-sm">
                        <thead>
                            <tr>
                                <th class="text-center">#</th>
                                <th class="text-center">FORM NUMBER</th>
                                <th>NAME</th>
                                <th class="text-center">GENDER</th>
                                <th class="text-center">AGE</th>
                                <th class="">PHONE</th>
                                <th class="">OTHER PHONE</th>
                                <th class="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody v-if="listPatients.length > 0">
                            <ItemListPatientPrivate v-for="(patient, index) in listPatients" :key="patient.id"
                                :patient=patient :index=index @change-status="changeStatus(patient.id)"
                                @delete-patient="deletePatient(patient)" @make-consultation="showFormconsultation" />
                        </tbody>
                        <tbody v-else>
                            <tr>
                                <td colspan="8" class="text-center p-4 text-secondary"> <i class="fas fa-database"></i> Not
                                    result
                                    found...</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="d-flex justify-content-end">
                    <VueAwesomePaginate :total-items="pageCount" :items-per-page="page" :max-pages-shown="5"
                        v-model="currentPage" :on-click="getDataPagiantion" />
                </div>
            </div>
        </div>
        <!-- Modal -->
        <div class="modal fade" id="addConsultationModal" tabindex="-1" aria-labelledby="addConsultationModalLabel"
            aria-hidden="true">
            <div class="modal-dialog">
                <Form ref="form" @submit="makeNewConsulation" :validation-schema="schema" v-slot="{ errors }"
                    :initial-values="formValues">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="addConsultationModalLabel">
                                <i class="fa fa-user-plus" aria-hidden="true"></i> NEW CONSULTATION
                            </h5>
                        </div>
                        <div class="modal-body" v-show="patientData">
                            <div class="card">
                                <div class="card-body">
                                    <h5 class=""><span class="text-bold">Patient: </span>{{patientData.name}}</h5>
                                    <h5 class=""><span class="text-bold">Gender: </span>{{patientData.gender}}</h5>
                                    <h5 class=""><span class="text-bold">Age: </span>{{patientData.age}}</h5>
                                </div>
                            </div>
                            <div class="form-group">
                                <label>Type conusltation</label>
                                <Field class="form-control" name="consultation_id" as="select" id=""
                                    :class="{ 'is-invalid': errors.consultation_id }">
                                    <option :value="null">Choose here</option>
                                    <option v-for="consultation in lisConsultation" :value="consultation.id">{{
                                        consultation.name }}
                                    </option>
                                </Field>
                                <span class="invalid-feedback">{{ errors.consultation_id }}</span>
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
    </ReceptionLayout>
</template>
<style>
.pagination-container {
    display: flex;
    column-gap: 10px;
}

.paginate-buttons {
    height: 30px;
    width: 30px;
    border-radius: 20px;
    cursor: pointer;
    background-color: rgb(242, 242, 242);
    border: 1px solid rgb(217, 217, 217);
    color: black;
}

.paginate-buttons:hover {
    background-color: #d8d8d8;
}

.active-page {
    background-color: #3498db;
    border: 1px solid #3498db;
    color: white;
}

.active-page:hover {
    background-color: #2988c8;
}</style>