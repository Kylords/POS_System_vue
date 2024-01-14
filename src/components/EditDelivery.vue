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
    deliveryId: Number(route.params.id)
})

const delivery = ref({
    deliveryMethod: '',
    enabled: false,
    price: '',
    deliveryId: Number(route.params.id)
});





const { result: resultDeliveryQuery, onResult: onResultDeliveryQuery } = useQuery(gql`
  query($deliveryId: Int!) {
    delivery(deliveryId: $deliveryId) {
      deliveryMethod
      price
      enabled
    }
  }
`, vari);



onResultDeliveryQuery(result => {
    if (!result.loading) {
        delivery.value.deliveryMethod = result.data.delivery.deliveryMethod
        delivery.value.price = result.data.delivery.price
        delivery.value.enabled = result.data.delivery.enabled
    }
})




const EDIT_DELIVERY_MUTATION = gql`
  mutation editDelivery($input: EditDeliveryInput!) {
    editDelivery(input: $input) {
      errors
    }
  }
`;

const { mutate: editDelivery } = useMutation(EDIT_DELIVERY_MUTATION);

const submitForm = async () => {
    try {

        // Define your GraphQL mutation 


        // Execute the mutation

        const input = {
            deliveryMethod: delivery.value.deliveryMethod,
            price: delivery.value.price,
            enabled: delivery.value.enabled,
            deliveryId: delivery.value.deliveryId

        };

        const result = await editDelivery({ input });

        if (result.data.editDelivery.errors == 0) {
            alert('Successfully Editted Delivery')
            
        }

        else {
            const errorString = result.data.editDelivery.errors.join(', ')
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
            <input type="checkbox" v-model="delivery.enabled">

            
            <label for="name">Delivery Method:</label>
            <input v-model="delivery.deliveryMethod" type="text" id="name" required>


            <label for="pricing">Pricing:</label>
            <input v-model="delivery.price" type="text" id="pricing" required>

            

            <button class="btn btn-secondary" type="submit">Finish Editing</button>
        </form>

    </div>
</template>

<style scoped>

</style>

