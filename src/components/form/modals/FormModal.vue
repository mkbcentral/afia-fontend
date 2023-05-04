<template>
     <!--Add Modal -->
     <div :class="'modal '+props.aniamte" :id="props.id" tabindex="-1"
         :aria-labelledby="props.id+'Label'" aria-hidden="true">
        <div :class="'modal-dialog modal-'+props.size">
            <div class="modal-content">
                <ModalHeader :is-editing="props.isEditing" add-icon="fa fa-plus-circle"
                     edit-icon="fas fa-edit" :title="props.modalTitle"/>
                <div class="modal-body">
                    <slot/>
                </div>
               <ModalFooter></ModalFooter>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import ModalHeader from './ModalHeader.vue';
import ModalFooter from './ModalFooter.vue';
const props=defineProps({
    id:String,
    size:String,
    isEditing:Boolean,
    aniamte:String,
    modalTitle:String
})

</script>