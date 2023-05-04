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

import FormModal from '../../../components/form/modals/FormModal.vue';
import FormGroup from '../../../components/form/FormGroup.vue';
import FormLabel from '../../../components/form/FormLabel.vue';
import ButtonLoanding from '../../../components/form/ButtonLoanding.vue';
import ButtonIcon from '../../../components/form/ButtonIcon.vue';
import InvalidFeedback from '../../../components/errors/InvalidFeedback.vue';

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
            const response = await TarifApi.changeStatusBoolean('/tarification/status/', id);
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
            const response = await TarifApi.delete('tarification/', id)
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
                            <ButtonIcon @click="add" type="button" bg="primary" icon="fa fa-plus">New</ButtonIcon>
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
                                    <th class="text-center">PRICE PRIVATE USD</th>
                                    <th class="text-center">PRICE SUBSCRIBE USD</th>
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
        <FormModal id="addTarifModal" aniamte="fade" size="" :is-editing="isEditing" modal-title="CONSULTATION">
            <Form ref="form" @submit="handlerSubmit" :validation-schema="schema" v-slot="{ errors }"
                :initial-values="formValues">
                <FormGroup>
                    <FormLabel id="name" for-value="name">Name role</FormLabel>
                    <Field name="name" type="text" class="form-control" :class="{ 'is-invalid': errors.name }"
                        placeholder="Name of role" />
                    <InvalidFeedback>{{ errors.name }}</InvalidFeedback>
                </FormGroup>
                <FormGroup>
                    <FormLabel id="name" for-value="name">Price private</FormLabel>
                    <Field name="price_private" type="text" class="form-control"
                        :class="{ 'is-invalid': errors.price_private }" placeholder="0" />
                    <InvalidFeedback>{{ errors.price_private }}</InvalidFeedback>
                </FormGroup>
                <FormGroup>
                    <FormLabel id="name" for-value="name">Price subscribe</FormLabel>
                    <Field name="price_subscribe" type="text" class="form-control"
                        :class="{ 'is-invalid': errors.price_subscribe }" placeholder="0" />
                    <InvalidFeedback>{{ errors.price_subscribe }}</InvalidFeedback>
                </FormGroup>
                <div class="d-flex justify-content-end">
                    <ButtonLoanding type="submit" bg="primary" btn-size="btn-md" :is-loanding="isLoanding">Save changes
                    </ButtonLoanding>
                </div>
            </Form>
        </FormModal>
    </TarificationLayout>
</template>