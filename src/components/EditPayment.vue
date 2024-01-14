<script setup>
import { ref, watch, inject, onMounted } from 'vue';
import { useMutation, useQuery } from '@vue/apollo-composable';
import gql from 'graphql-tag';
import { useRoute, useRouter } from 'vue-router';

const bus = inject(['$bus'])


const route = useRoute();
const router = useRouter()

const queryOptions = ref({
    fetchPolicy: 'cache-and-network'
})

const vari = ref({
    paymentId: Number(route.params.id)
})

const payment = ref({
    paymentMethod: '',
    enabled: false,
    paymentId: Number(route.params.id)
});





const { result: resultPaymentQuery, onResult: onResultPaymentQuery } = useQuery(gql`
  query($paymentId: Int!) {
    payment(paymentId: $paymentId) {
      paymentMethod
      enabled
    }
  }
`, vari);



onResultPaymentQuery(result => {
    if (!result.loading) {
        payment.value.paymentMethod = result.data.payment.paymentMethod
        payment.value.enabled = result.data.payment.enabled
    }
})




const EDIT_PAYMENT_MUTATION = gql`
  mutation editPayment($input: EditPaymentInput!) {
    editPayment(input: $input) {
      errors
    }
  }
`;

const { mutate: editPayment } = useMutation(EDIT_PAYMENT_MUTATION);

const submitForm = async () => {
    try {

        // Define your GraphQL mutation 


        // Execute the mutation

        const input = {
            paymentMethod: payment.value.paymentMethod,
            price: payment.value.price,
            enabled: payment.value.enabled,
            paymentId: payment.value.paymentId

        };

        const result = await editPayment({ input });

        if (result.data.editPayment.errors == 0) {
            alert('Successfully Editted Payment')

        }

        else {
            const errorString = result.data.editPayment.errors.join(', ')
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

            <label for="pricing">Enabled:</label>
            <input type="checkbox" v-model="payment.enabled">


            <label for="name">Payment Method:</label>
            <input v-model="payment.paymentMethod" type="text" id="name" required>





            <button type="submit">Finish Editing</button>
        </form>

    </div>
</template>

<style scoped></style>

