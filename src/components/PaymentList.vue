

<script setup>
import { ref, inject } from 'vue';
import { useMutation, useQuery } from '@vue/apollo-composable';
import gql from 'graphql-tag';
const bus = inject(['$bus'])

import { useRoute, useRouter } from 'vue-router';


const route = useRoute();
const router = useRouter()


const queryOptions = ref({
    fetchPolicy: 'cache-and-network'
})

const { result: resultPaymentMethodsQuery } = useQuery(gql`
  query {
    paymentMethods {
      id
      paymentMethod
      enabled
    }
  }
`, null, queryOptions);


function edit(id) {
    router.push({ name: 'editpayment', params: { id: id } });
}




</script>

<template>
    <div v-if="resultPaymentMethodsQuery">
        <table class="table table-hover">
            <thead>
                <tr>
                    <th scope="col">Enabled</th>
                    <th scope="col">Payment</th>
                    <th scope="col">Edit</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="payment in resultPaymentMethodsQuery.paymentMethods">
                    <th scope="row"><input :disabled="true" type="checkbox" v-model="payment.enabled"></th>
                    <td>{{ payment.paymentMethod }}</td>
                    <td><button class="btn btn-secondary" @click="edit(payment.id)">Edit</button></td>
                </tr>

            </tbody>
        </table>

    </div>
</template>

<style>
/* Add your custom styles here */
</style>


