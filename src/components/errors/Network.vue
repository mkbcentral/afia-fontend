<script setup>
defineProps({
    message: ''
})
const emit = defineEmits(['loadData'])
const load = () => {
    emit('loadData')
}
</script>
<template>
    <!-- Main content -->
    <div class="card">
        <div class="card-body">
            <section class="content">
                
                <div class="error-page">
                   
                    <div class="error-content">
                        <h3 class="text-danger">
                            <i class="fas fa-exclamation-triangle text-danger"></i>
                            Oops! {{message}}.
                        </h3>
                        <p>
                            We will work on fixing that right away.
                            Meanwhile, you may <a href="#" @click="load">return back</a> or try using refresh.
                        </p>
                        <div class="text-center">
                            <button @click="load" type="button" class="btn btn-link">
                                <i class="fas fa-sync-alt"></i> Refresh
                            </button>
                        </div>
                    </div>
                </div>
                <!-- /.error-page -->
            </section>
        </div>
    </div>
    <!-- /.content -->
</template>