<template>
    <!-- /.col -->
    <div class="col-6">
        <p class="lead">For pay</p>
        <div class="table-responsive">
            <table class="table">
                <tr>
                    <th style="width:50%">Amount:</th>
                    <td>{{ props.amount }}</td>
                </tr>
                <tr>
                    <th>Reduction (0%)</th>
                    <td>$0</td>
                </tr>
                <tr>
                    <th>Deposit:</th>
                    <td>$5.80</td>
                </tr>
                <tr>
                    <th>Total:</th>
                    <td>$265.24</td>
                </tr>
            </table>
        </div>
    </div>
    <!-- /.col -->
</template>
<script setup>
const props=defineProps({
    amount:Number
})
</script>