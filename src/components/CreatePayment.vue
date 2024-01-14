

<script setup>
import { ref, inject } from 'vue';
import { useMutation, useQuery } from '@vue/apollo-composable';
import gql from 'graphql-tag';
const bus = inject(['$bus'])

import { useRoute, useRouter } from 'vue-router';


const route = useRoute();
const router = useRouter()

const payment = ref({
    paymentMethod: '',
    enabled: false,
});





const CREATE_PAYMENT_MUTATION = gql`
  mutation createPayment($input: CreatePaymentInput!) {
    createPayment(input: $input) {
      errors
    }
  }
`;

const { mutate: createPayment } = useMutation(CREATE_PAYMENT_MUTATION);

const submitForm = async () => {
    try {

        // Define your GraphQL mutation


        // Execute the mutation

        const input = {
            paymentMethod: payment.value.paymentMethod,
            enabled: payment.value.enabled

        };

        const result = await createPayment({ input });

        if (result.data.createPayment.errors == 0) {
            bus.$emit('newPayment')
            alert(`Successfully created Payment`)
        }

        else {
            const errorString = result.data.createPayment.errors.join(', ')
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
            <input v-model="payment.enabled" type="checkbox" id="name" >
            
            <label for="location">Payment: </label>
            <input v-model="payment.paymentMethod" type="text" id="name" required>


            

            
            <button class="btn btn-secondary" type="submit">Create Payment</button>
        </form>

    </div>
</template>

<style>
/* Add your custom styles here */
</style>


