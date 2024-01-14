

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

const { result: resultDeliveryMethodsQuery } = useQuery(gql`
  query {
    deliveryMethods {
      id
      deliveryMethod
      price
      enabled
    }
  }
`, null, queryOptions);


function edit(id) {
    router.push({ name: 'editdelivery', params: { id: id } });
}




</script>

<template>
    <div v-if="resultDeliveryMethodsQuery">
        <table class="table table-hover">
            <thead>
                <tr>
                    <th scope="col">Enabled</th>
                    <th scope="col">Delivery</th>
                    <th scope="col">Price</th>
                    <th scope="col">Edit</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="delivery in resultDeliveryMethodsQuery.deliveryMethods">
                    <th scope="row"><input :disabled="true" type="checkbox" v-model="delivery.enabled"></th>
                    <td>{{ delivery.deliveryMethod }}</td>
                    <td>{{ delivery.price }}</td>
                    <td><button class="btn btn-secondary" @click="edit(delivery.id)">Edit</button></td>
                </tr>

            </tbody>
        </table>

    </div>
</template>

<style>
/* Add your custom styles here */
</style>


