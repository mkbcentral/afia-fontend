<script setup>
import TarificationLayout from '../../../layouts/TarificationLayout.vue';
import { ref, onMounted } from 'vue'
import { Form, Field } from 'vee-validate'
import * as yup from 'yup'
import { useToastr } from '../../../../src/widgets/toastr.js'
import CategoryApi from '../../../services/Admin/AdminApi.js'
import Swal from 'sweetalert2'
import NetworkError from '../../../components/errors/Network.vue';
import CategoryItemWiget from '../../admin/tarification/Widgets/CategoryItemWiget.vue'
import FormModal from '../../../components/from/modals/FormModal.vue';
import FormGroup from '../../../components/from/FormGroup.vue';
import FormLabel from '../../../components/from/FormLabel.vue';
import ButtonLoanding from '../../../components/from/ButtonLoanding.vue';
import ButtonIcon from '../../../components/from/ButtonIcon.vue';
import InvalidFeedback from '../../../components/errors/InvalidFeedback.vue';

const lisCategories = ref([])
let errors = ref({})
let errorResp = ref('')

const isLoanding = ref(false)
const isDataLoanding = ref(false)
const isEditing = ref(false)
const isNetWorkError = ref(false)

const formValues = ref()
const form = ref(null)
const toastr = useToastr()

const schema = yup.object({
    name: yup.string().required(),
})

const add = async () => {
    isEditing.value = false;
    $('#addCategoryModal').modal('show');
    form.value.resetForm()
}

const edit = (category) => {
    isEditing.value = true;
    $('#addCategoryModal').modal('show');
    form.value.resetForm()
    formValues.value = {
        id: category.id,
        name: category.name,
    }
}

const create = async (values) => {
    isLoanding.value = true
    try {
        const response = await CategoryApi.create('category-tarification',values);
        if (response.data.success) {
            isLoanding.value = false
            lisCategories.value.unshift(response.data.category)
            toastr.success(response.data.message, 'Validation')
            $('#addCategoryModal').modal('hide');
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
        const response = await CategoryApi.update('category-tarification/',formValues.value.id, values)
        if (response.data.success) {
            isLoanding.value = false
            const index = lisCategories.value.findIndex(category => category.id == response.data.category.id)
            lisCategories.value[index] = response.data.category
            toastr.info(response.data.message, 'Validation')
            $('#addCategoryModal').modal('hide');
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


const deleteCategory = async (id) => {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't delete this Consulation!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes'
    }).then(async (result) => {
        if (result.isConfirmed) {
            const response = await CategoryApi.delete('category-tarification/',id)
            if (response.data.success) {
                Swal.fire(
                    'Deleted!',
                    response.data.message,
                    'success'
                )
                lisCategories.value = lisCategories.value.filter(console => console.id != id);
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

const getData = async () => {
    isDataLoanding.value = true;
    isNetWorkError.value = false
    try {
        const response = await CategoryApi.getData('category-tarification');
        lisCategories.value = response.data.data;
        isDataLoanding.value = false
    } catch (error) {
        
        if (error.code) {
            isNetWorkError.value = true
            errorResp.value = error.message
        }

        isDataLoanding.value = false
    }
}

const getCategories = async () => {
    isDataLoanding.value = true;
    isNetWorkError.value = false;
    try {
        const response = await CategoryApi.getData('category-tarification');
        lisCategories.value = response.data.data;
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
   getCategories();
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
                                <li class="breadcrumb-item active">Category tarif</li>
                            </ol>
                        </div><!-- /.col -->
                    </div><!-- /.row -->
                </div><!-- /.container-fluid -->
            </div>
        </div>
        <div v-if="isNetWorkError">
            <NetworkError :message=errorResp @load-data="getData" />
        </div>
        <div v-else class="card card-primary card-outline">
            <div class="card-header">
                <div class="d-flex justify-content-between">
                    <div>
                        <h5 class="m-0"><i class="fa fa-list" aria-hidden="true"></i> List of categories</h5>
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
                            <th class="text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody v-if="lisCategories.length > 0">
                        <CategoryItemWiget v-for="(category, index) in lisCategories" :key="category.id" :category=category :index=index
                            @edit-category="edit"  @delete-category="deleteCategory(category.id)" />
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
        <FormModal id="addCategoryModal" aniamte="fade" size="" :is-editing="isEditing" modal-title="CATEGORY">
            <Form ref="form" @submit="handlerSubmit" :validation-schema="schema" v-slot="{ errors }"
                :initial-values="formValues">
                <FormGroup>
                    <FormLabel id="name" for-value="name">Category name</FormLabel>
                    <Field name="name" type="text" class="form-control" :class="{ 'is-invalid': errors.name }"
                        placeholder="Name of role" />
                        <InvalidFeedback>{{ errors.name }}</InvalidFeedback>
                </FormGroup>
                <div class="d-flex justify-content-end">
                    <ButtonLoanding type="submit" bg="primary" btn-size="btn-md" :is-loanding="isLoanding">Save changes</ButtonLoanding>
                </div>
            </Form>
        </FormModal>
    </TarificationLayout>
</template>