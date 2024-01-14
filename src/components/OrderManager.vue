

<script setup>
import { ref, inject, onMounted } from 'vue';
import { useMutation, useQuery } from '@vue/apollo-composable';
import gql from 'graphql-tag';

const statuses = ref(["Pending", "Confirmed", "Completed"])


import { useRouter } from 'vue-router';

const bus = inject(['$bus'])

const router = useRouter();
const variables = ref({
    status: ''
})

const selectedIndex = ref(null)

const queryOptions = ref({
    fetchPolicy: 'cache-and-network'
})

onMounted(() => {
    bus.$on('changeOrderStatus', (value) => {
        refetch()
    })


})





function selectStatus(status) {
    variables.value.status = status
    console.log(variables.value.status)
}

const { result: resultAllOrdersQuery, loading: loadingAllOrdersQuery, onResult, refetch } = useQuery(gql`
  query($status: String!) {
    allOrders(status: $status) {
      id
      totalPrice
      quantity
      products {
        price
        name
        image
        productType
      }

    }
  }
`,
    variables, queryOptions);

onResult(result => {
    if (!result.loading)
        console.log(result)
})






function createOrderPage() {
    router.push({ path: '/createorder' });

}


const CHANGE_ORDER_STATUS_MUTATION = gql`
  mutation changeOrderStatus($input: ChangeOrderStatusInput!) {
    changeOrderStatus(input: $input) {
      errors
    }
  }
`;

const { mutate: changeOrderStatus } = useMutation(CHANGE_ORDER_STATUS_MUTATION);

const changeStatus = async (status, orderId) => {
    try {

        // Define your GraphQL mutation 


        // Execute the mutation

        const input = {
            status: status,
            orderId: orderId

        };

        const result = await changeOrderStatus({ input });

        if (result.data.changeOrderStatus.errors == 0) {
            bus.$emit('changeOrderStatus')
            alert('Successfully Changed Status')
        }

        else {
            const errorString = result.data.changeOrderStatus.errors.join(', ')
            console.log(errorString)
        }
    } catch (error) {
        console.error(error);
    }
};


</script>

<template>
    <div class="row justify-content-end">
        <div class="col-md-10">
            <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
                <li v-for="(status, index) in statuses" :key="index" class="nav-item" role="presentation">
                    <button :class="{ 'nav-link': true, 'active': index === selectedIndex }" :id="`pills-${index}-tab`"
                        data-bs-toggle="pill" :data-bs-target="`#pills-${index}`" type="button" role="tab"
                        :aria-controls="`pills-${index}`" :aria-selected="index === selectedIndex"
                        @click="selectStatus(status)">
                        {{ status }}
                    </button>
                </li>

            </ul>
        </div>
        <div  class="col">
            <p class="continue text-end" @click="createOrderPage">Create Order <i class="bi bi-arrow-right"></i> </p>

        </div>




    </div>










    <div v-if="resultAllOrdersQuery">
        <div v-for="order in resultAllOrdersQuery.allOrders" :key="order.id">

            <div class="card rounded-3 mb-4">
                <div v-for="product in order.products" class="card-body p-4" :key="product.id">
                    <div class="row d-flex justify-content-between align-items-center">

                        <div class="col-md-2 col-lg-2 col-xl-2">
                            <img :src="product.image" class="img-fluid rounded-3" alt="Cotton T-shirt">
                        </div>

                        <div class="col-md-2 col-lg-2 col-xl-2">
                            <button class="btn btn-outline-primary" v-if="variables.status == 'Pending'"
                                @click="changeStatus('Confirmed', Number(order.id))">Confirm Order</button>
                            <button class="btn btn-outline-success" v-else-if="variables.status == 'Confirmed'"
                                @click="changeStatus('Completed', Number(order.id))">Complete Order</button>
                        </div>

                        <div class="col-md-2 col-lg-2 col-xl-2">
                            <p class="lead fw-normal mb-2">{{ product.name }}</p>
                            <p><span class="text-muted">Product Type: </span>{{ product.productType }}</p>
                        </div>


                        <div class="col-md-1 col-lg-1 col-xl-1">


                            <p class="fw-normal mb-2">Quantity: </p>
                            <p class="fw-normal mb-2">{{ order.quantity }}</p>


                        </div>

                        <div class="col-md-2 col-lg-2 col-xl-2">


                            <p class="fw-normal mb-2">Product Price: </p>
                            <p class="fw-normal mb-2">₱{{ product.price }}</p>


                        </div>




                        <div class="col-md-1 col-lg-1 col-xl-1 offset-lg-1">
                            <p class="fw-normal mb-2">Total Price:</p>
                            <p class="lead fw-normal mb-2">₱{{ order.totalPrice }}</p>
                        </div>
                        <div class="col-md-1 col-lg-1 col-xl-1 text-end">
                            <button type="button" class="btn-close" aria-label="Close"
                                @click.stop="submitForm(order.id)"></button>

                        </div>
                    </div>
                </div>
            </div>


        </div>



    </div>
</template>

<style scoped>
.continue:hover {
    text-decoration: underline;
    cursor: pointer;
    -webkit-transform: scale(1.01);
    -moz-transform: scale(1.01);
    transform: scale(1.01);
    margin-bottom: 0;
}


</style>


