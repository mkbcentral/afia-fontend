<script setup >
import ReceptionLayout from '../../../layouts/ReceptionLayout.vue';
import { ref } from "vue";
const form = ref({
    name: ''
})

const save=()=>{
    console.log(form.value);
}
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
                            <li class="breadcrumb-item active">Dashboard</li>
                        </ol>
                    </div><!-- /.col -->
                </div><!-- /.row -->
            </div><!-- /.container-fluid -->
        </div>
        <div class="card">
            <div class="card-header">
                Dashboard
            </div>
            <div class="card-body">
                <p class="card-text">Content</p>
               
            </div>
        </div>
    </ReceptionLayout>
</template>