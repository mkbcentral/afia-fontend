<template>
    <div class="row">
        <!-- accepted payments column -->
        <div class="col-6">
            <p class="lead">Payment Methods:</p>
            <P>--- Cash ---</P>
        </div>
        <!-- /.col -->
        <div class="col-6">
            <p class="lead">For pay</p>

            <div class="table-responsive">
                <table class="table">
                    <tr>
                        <th style="width:50%">Amount:</th>
                        <td>${{ amount }}</td>
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
    </div>
  <!-- /.row -->
</template>

<script setup>
  defineProps({
      amount:Number
  })
</script>