<script setup>
import TarificationLayout from '../../../layouts/TarificationLayout.vue';
import { ref, onMounted } from 'vue'
import { Form, Field } from 'vee-validate'
import * as yup from 'yup'
import { useToastr } from '../../../../src/widgets/toastr.js'
import CategoryApi from '../../../services/Admin/AdminApi.js';
import TarifApi from '../../../services/Admin/AdminApi.js'
import Swal from 'sweetalert2'
import NetworkError from '../../../components/errors/Network.vue';
import ItemOtherTarifWigets from '../../admin/tarification/Widgets/ItemOtherTarifWigets.vue'

const listTarifs = ref([])
const listCategories = ref([])
const token = ref('')
let errors = ref({})
let errorResp = ref('')

const isLoanding = ref(false)
const isDataLoanding = ref(false)
const isEditing = ref(false)
const isNetWorkError = ref(false)

const formValues = ref()
const form = ref(null)
const toastr = useToastr()
const selectedIndex = ref(2)


const schema = yup.object({
    name: yup.string().required(),
    abreviation: yup.string().nullable(),
    price_private: yup.number().required(),
    price_subscribe: yup.number().required(),

})

const add = async () => {
    isEditing.value = false;
    $('#addTarifModal').modal('show');
    console.log(form.value)
}

const edit = (tarifiaction) => {
    isEditing.value = true;
    $('#addTarifModal').modal('show');
    formValues.value = {
        id: tarifiaction.id,
        name: tarifiaction.name,
        abreviation: tarifiaction.abreviation,
        price_private: tarifiaction.price_private,
        price_subscribe: tarifiaction.price_subscribe,
    }
}

const create = async (values) => {
    isLoanding.value = true
    values.category_tarification_id = selectedIndex.value
    console.log(values)
    try {
        const response = await TarifApi.create('tarification', values);
        if (response.data.success) {
            isLoanding.value = false
            listTarifs.value.unshift(response.data.tarification)
            toastr.success(response.data.message, 'Validation')
            $('#addTarifModal').modal('hide');
            form.value.resetForm()
        } else {
            form.value.setFeildE
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
        const response = await TarifApi.update('tarification/', formValues.value.id, values)
        if (response.data.success) {
            isLoanding.value = false
            const index = listTarifs.value.findIndex(tarification => tarification.id == response.data.tarification.id)
            listTarifs.value[index] = response.data.tarification.id
            toastr.info(response.data.message, 'Validation')
            $('#addTarifModal').modal('hide');
            form.value.resetForm()
        } else {
            if (response.data.errors) {
                errorResp.value = response.data.errors
                isLoanding.value = false
            }
            else if (error.response.status == 422) {
                errors.value = error.response.data.errors
                isLoanding.value = false
            }
            else {
                errorResp.value = response.data.message
                isLoanding.value = false
            }

            toastr.error(errorResp.value, 'Validation')
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
        text: "You won't change status for this Tarif!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes'
    }).then(async (result) => {
        if (result.isConfirmed) {
            const response = await TarifApi.changeStatusBoolean('/tarification/status/',id);
            if (response.data.success) {
                Swal.fire(
                    'Deleted!',
                    response.data.message,
                    'success'
                )
                listCategories.value = lisConsultation.value.filter(tarif => tarif.id != id);
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

const deleteConsultation = async (id) => {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't delete this Tarif!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes'
    }).then(async (result) => {
        if (result.isConfirmed) {
            const response = await TarifApi.delete('tarification/',id)
            if (response.data.success) {
                Swal.fire(
                    'Deleted!',
                    response.data.message,
                    'success'
                )
                listTarifs.value = listTarifs.value.filter(tarif => tarif.id != id);
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


const getCategories = async () => {
    isDataLoanding.value = true;
    isNetWorkError.value = false
    try {
        const response = await CategoryApi.getData('category-tarification');
        listCategories.value = response.data.data;
        isDataLoanding.value = false
    } catch (error) {

        if (error.code) {
            isNetWorkError.value = true
            errorResp.value = error.message
        }

        isDataLoanding.value = false
    }
}

const getCurrentCategory = async () => {
    try {
        const response = await CategoryApi.getFirstData('first-category-rarif');
        selectedValue.value = response.data.category.id;
    } catch (error) {

        if (error.code) {
            isNetWorkError.value = true
            errorResp.value = error.message
        }

    }
}

const getSelectedIndex = async (index) => {
    selectedIndex.value = index;
    await getTarifs()
}

const getData = async () => {
    isDataLoanding.value = true;
    isNetWorkError.value = false;
    try {
        const response = await TarifApi.getData('/tarifiaction?category_id=' + selectedIndex.value);
        listTarifs.value = response.data.data;
        isDataLoanding.value = false
    } catch (error) {
        if (error.code) {
            isNetWorkError.value = true
            errorResp.value = error.message
            toastr.error(errorResp.value, 'Errors')
        } else if (error.response.status == 422) {
            errors.value = error.response.data.errors
            isLoanding.value = false
        }
        isLoanding.value = false;
    }
}

const getTarifs = async () => {
    isDataLoanding.value = true;
    isNetWorkError.value = false;
    try {
        const response = await TarifApi.getData('/tarification?category_id=' + selectedIndex.value);
        listTarifs.value = response.data.data;
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
    getCurrentCategory()
    getCategories();
    getTarifs()

})
</script>
<template>
    <TarificationLayout>
        <div>
            <div class="content-header">
                <div class="container-fluid">
                    <div class="d-flex justify-content-end">
                        <div class="">
                            <ol class="breadcrumb float-sm-right">
                                <li class="breadcrumb-item">
                                    <RouterLink to="/">Menu</RouterLink>
                                </li>
                                <li class="breadcrumb-item">
                                    <RouterLink to="/finance/tarification/list">Price list</RouterLink>
                                </li>
                                <li class="breadcrumb-item active">Other tarif</li>
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
                            <h5 class="m-0"><i class="fa fa-list" aria-hidden="true"></i> List of tarifs</h5>
                        </div>
                        <div>
                            <button @click="add" type="button" class="btn btn-primary btn-sm"><i class="fa fa-plus-circle"
                                    aria-hidden="true"></i>New</button>
                        </div>

                    </div>
                </div>
                <div class="card-body">
                    <div class="card">
                        <div class="card-body">
                            <div class="btn-group">
                                <button v-for="category in listCategories" @click="getSelectedIndex(category.id)"
                                    type="button" class="btn "
                                    :class="[selectedIndex == category.id ? 'btn-secondary' : 'btn-link']"><i
                                        class="fas fa-folder"></i> <span v-text="category.name"></span></button>
                            </div>
                        </div>
                    </div>
                    <div v-if="isDataLoanding" class="d-flex justify-content-center">
                        <div class="spinner-border" role="status">
                            <span hidden class="visually-hidden">Loading...</span>
                        </div>
                    </div>
                    <div v-else>

                        <table class="table table-bordered table-sm">
                            <thead>
                                <tr>
                                    <th class="text-center">#</th>
                                    <th>NAME</th>
                                    <th>ABREVIATION</th>
                                    <th>PRICE PRIVATE</th>
                                    <th>PRICE SUBSCRIBE</th>
                                    <th class="text-center">STATUS</th>
                                    <th class="text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody v-if="listTarifs.length > 0">
                                <ItemOtherTarifWigets v-for="(tarif, index) in listTarifs" :key="tarif.id" :tarif=tarif
                                    :index=index @edit-tarif="edit(tarif)" @change-status="changeStatus(tarif.id)"
                                    @delete-tarif="deleteConsultation(tarif.id)" />
                            </tbody>
                            <tbody v-else>
                                <tr>
                                    <td colspan="7" class="text-center p-4 text-secondary"> <i class="fas fa-database"></i>
                                        Not
                                        result
                                        found...</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        <!--Add Modal -->
        <div class="modal fade" id="addTarifModal" tabindex="-1" aria-labelledby="addTarifModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <Form ref="form" @submit="handlerSubmit" :validation-schema="schema" v-slot="{ errors }"
                    :initial-values="formValues">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 v-if="isEditing" class="modal-title" id="addTarifModalLabel">
                                <i class="fas fa-edit    "></i> EDIT CONSULTATION
                            </h5>
                            <h5 v-else class="modal-title" id="addTarifModalLabel">

                                <i class="fa fa-plus-circle" aria-hidden="true"></i>
                                CREATE CONSULTATION
                            </h5>
                        </div>
                        <div class="modal-body">
                            <div class="form-group">
                                <label>Name</label>
                                <Field name="name" type="text" class="form-control" :class="{ 'is-invalid': errors.name }"
                                    placeholder="Name" />
                                <span class="invalid-feedback">{{ errors.name }}</span>
                            </div>
                            <div class="form-group">
                                <label>Abreviation <span class="text-success"> (* Non obligatoire) </span></label>
                                <Field name="abreviation" type="text" class="form-control"
                                    :class="{ 'is-invalid': errors.abreviation }" />
                                <span class="invalid-feedback">{{ errors.abreviation }}</span>
                            </div>
                            <div class="form-group">
                                <label>Price private</label>
                                <Field name="price_private" type="text" class="form-control"
                                    :class="{ 'is-invalid': errors.price_private }" placeholder="0" />
                                <span class="invalid-feedback">{{ errors.price_private }}</span>
                            </div>
                            <div class="form-group">
                                <label>Price subscribe</label>
                                <Field name="price_subscribe" type="text" class="form-control"
                                    :class="{ 'is-invalid': errors.price_subscribe }" placeholder="0" />
                                <span class="invalid-feedback">{{ errors.price_subscribe }}</span>
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
    </TarificationLayout>
</template>