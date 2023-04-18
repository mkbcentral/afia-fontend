<script setup>
import ReceptionLayout from '../../../layouts/ReceptionLayout.vue';
import { ref, onMounted, watch } from 'vue'
import Swal from 'sweetalert2/dist/sweetalert2.all.min.js'
import ApiPatient from '../../../services/Patients/PatientApi.js'
import ItemListPatientSubscribe from './Widgets/ItemListPatientSubscribe.vue';
import NetworkError from '../../../components/errors/Network.vue';
import { debounce } from 'lodash';

const listPatients = ref([])
let errorResp = ref('')
const isDataLoanding = ref(false)
const isNetWorkError = ref(false)
const searchQuary = ref(null)
const page = ref(3)
const pageCount = ref(null)
const currentPage = ref(1);


const getData = async () => {
    isDataLoanding.value = true;
    isNetWorkError.value = false;
    try {
        const response = await ApiPatient.getPatients('/patient-subscribe?page_page=' + page.value);
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

const getDataPagination = async (p) => {
    try {
        const response = await ApiPatient.getPatients('/patient-subscribe?page_page=' + page.value + '&page=' + p);
        listPatients.value = response.data.data;
    } catch (error) {
        if (error.code) {
            isNetWorkError.value = true
            errorResp.value = error.message
        }
    }
}

const getPatients = async () => {
    isDataLoanding.value = true;
    isNetWorkError.value = false;
    try {
        const response = await ApiPatient.getPatients('/patient-subscribe?page_page=' + page.value);
        listPatients.value = response.data.data;
        pageCount.value = response.data.meta.total
        isDataLoanding.value = false
    } catch (error) {
        if (error.code) {
            isNetWorkError.value = true
            errorResp.value = error.message
        }
        isDataLoanding.value = false
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
            const response = await ApiPatient.deletePatient(patient.id, '/patient-subscribe/')
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

const searchData = async () => {
    try {
        const response = await ApiPatient.searcchPatient(searchQuary.value, '/patient/subscribe/search/');
        listPatients.value = response.data.data;
    } catch (error) {
        console.log(error)
    }
}

watch(searchQuary, debounce(() => {
    searchData()
}, 300))

onMounted(async () => {
    await getPatients()
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
                            <li class="breadcrumb-item active">Patients subscribed</li>
                        </ol>
                    </div><!-- /.col -->
                </div><!-- /.row -->
            </div><!-- /.container-fluid -->
        </div>
        <div v-if="isNetWorkError">
            <NetworkError :message=errorResp @load-data="getData" />
        </div>
        <div v-else class="card">
            <div class="card-header">
                <p style="color: #94106C;font-weight: bold;"><i class="fas fa-user-check fa-2x"></i> PATIENTS SUBSCRIBED</p>
            </div>
            <div class="card-body">
                <div class="d-flex justify-content-between">
                    <div>
                        <h5 class="m-0"><i class="fa fa-list" aria-hidden="true"></i> List of patients subscribed</h5>
                    </div>
                    <div>
                        <RouterLink to="/reception/create/patient/subscribe" class="btn"
                            style="background-color:#94106C; color:white"><i class="fa fa-plus-circle"
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
                                <th class="text-center">COMPANY</th>
                                <th class="text-center">TYPE</th>
                                <th class="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody v-if="listPatients.length > 0">
                            <ItemListPatientSubscribe v-for="(patient, index) in listPatients" :key="patient.id"
                                :patient=patient :index=index @change-status="changeStatus(patient.id)"
                                @delete-patient="deletePatient(patient)" />
                        </tbody>
                        <tbody v-else>
                            <tr>
                                <td colspan="10" class="text-center p-4 text-secondary"> <i class="fas fa-database"></i> Not
                                    result
                                    found...</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="d-flex justify-content-end">
                    <VueAwesomePaginate :total-items="pageCount" :items-per-page="page" :max-pages-shown="5"
                        v-model="currentPage" :on-click="getDataPagination" />
                </div>
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