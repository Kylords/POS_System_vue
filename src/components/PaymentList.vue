

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

const localEnabled = ref({});

const { result: resultPaymentMethodsQuery, onResult } = useQuery(gql`
  query {
    paymentMethods {
      id
      paymentMethod
      enabled
    }
  }
`, null, queryOptions);


onResult(result => {
    if (!result.loading) {
        result.data.paymentMethods.forEach((payment) => {
            localEnabled.value[payment.id] = payment.enabled;
        });
    }
})

function edit(id) {
    router.push({ name: 'editpayment', params: { id: id } });
}


const EDIT_PAYMENT_MUTATION = gql`
  mutation editEnablePayment($input: EditEnablePaymentInput!) {
    editEnablePayment(input: $input) {
      errors
     
    }
  }
`;

const { mutate: editEnablePayment } = useMutation(EDIT_PAYMENT_MUTATION)

async function checkbox(paymentId, event) {

    try {
        const result = await editEnablePayment({ input: { paymentId: Number(paymentId), enabled: event.target.checked } })

        if (result.data.editEnablePayment.errors == 0) {
            alert("Successfully editted Payment Availability")
        }

        else {
            const errorString = result.data.editEnablePayment.errors.join(', ');

            console.log(errorString)
        }

    }

    catch (error) {
        console.error('Edit error:', error);
    }


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
                    <th scope="row"><input type="checkbox" v-model="localEnabled[payment.id]" @click="checkbox(payment.id, $event)"></th>
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


