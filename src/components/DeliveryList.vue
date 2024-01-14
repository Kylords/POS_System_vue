

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

const { result: resultDeliveryMethodsQuery, onResult } = useQuery(gql`
  query {
    deliveryMethods {
      id
      deliveryMethod
      price
      enabled
    }
  }
`, null, queryOptions);

onResult(result => {
    if (!result.loading) {
        result.data.deliveryMethods.forEach((delivery) => {
            localEnabled.value[delivery.id] = delivery.enabled;
        });
    }
})


function edit(id) {
    router.push({ name: 'editdelivery', params: { id: id } });
}


const EDIT_DELIVERY_MUTATION = gql`
  mutation editEnableDelivery($input: EditEnableDeliveryInput!) {
    editEnableDelivery(input: $input) {
      errors
     
    }
  }
`;

const { mutate: editEnableDelivery } = useMutation(EDIT_DELIVERY_MUTATION)

async function checkbox(deliveryId, event) {

    try {
        const result = await editEnableDelivery({ input: { deliveryId: Number(deliveryId), enabled: event.target.checked } })

        if (result.data.editEnableDelivery.errors == 0) {
            alert("Successfully editted Delivery Availability")
        }

        else {
            const errorString = result.data.editEnableDelivery.errors.join(', ');

            console.log(errorString)
        }

    }

    catch (error) {
        console.error('Edit error:', error);
    }


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
                    <td scope="row"><input type="checkbox" v-model="localEnabled[delivery.id]"
                            @click="checkbox(delivery.id, $event)"></td>
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


