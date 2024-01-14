

<script setup>
import { ref, inject } from 'vue';
import { useMutation, useQuery } from '@vue/apollo-composable';
import gql from 'graphql-tag';
const bus = inject(['$bus'])

import { useRoute, useRouter } from 'vue-router';


const route = useRoute();
const router = useRouter()

const delivery = ref({
    deliveryMethod: '',
    enabled: false,
    price: ''
});





const CREATE_DELIVERY_MUTATION = gql`
  mutation createDelivery($input: CreateDeliveryInput!) {
    createDelivery(input: $input) {
      errors
    }
  }
`;

const { mutate: createDelivery } = useMutation(CREATE_DELIVERY_MUTATION);

const submitForm = async () => {
    try {

        // Define your GraphQL mutation


        // Execute the mutation

        const input = {
            deliveryMethod: delivery.value.deliveryMethod,
            price: delivery.value.price,
            enabled: delivery.value.enabled

        };

        const result = await createDelivery({ input });

        if (result.data.createDelivery.errors == 0) {
            bus.$emit('newDelivery')
            alert(`Successfully created Delivery`)
        }

        else {
            const errorString = result.data.createDelivery.errors.join(', ')
            console.log(errorString)
        }
    } catch (error) {
        console.error(error);
    }
};





</script>

<template>
    <div>
        <form @submit.prevent="submitForm">

            <label for="location">Enabled: </label>
            <input v-model="delivery.enabled" type="checkbox" id="name" >
            
            <label for="location">Delivery: </label>
            <input v-model="delivery.deliveryMethod" type="text" id="name" required>

            <label for="location">Price: </label>
            <input v-model="delivery.price" type="text" id="name" required>

            

            
            <button  class="btn btn-secondary" type="submit">Create Delivery</button>
        </form>

    </div>
</template>

<style>
/* Add your custom styles here */
</style>


