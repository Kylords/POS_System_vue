

<script setup>
import { ref } from 'vue';
import { useMutation, useQuery } from '@vue/apollo-composable';
import gql from 'graphql-tag';

const statuses = ref(["Pending", "Confirmed", "Completed"])


const variables = ref({
    status: ''
})

const selectedIndex = ref(null)

const queryOptions = ref({
    fetchPolicy: 'cache-and-network'
})







function selectStatus(status) {
    variables.value.status = status
    console.log(variables.value.status)
}

const { result: resultMyOrdersQuery, loading: loadingMyOrdersQuery, onResult, refetch } = useQuery(gql`
  query($status: String!) {
    myOrders(status: $status) {
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









</script>

<template>
    <div>

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


    <div v-if="resultMyOrdersQuery">
        <div v-for="order in resultMyOrdersQuery.myOrders" :key="order.id">

                <div class="card rounded-3 mb-4">
                    <div v-for="product in order.products" class="card-body p-4" :key="product.id">
                        <div class="row d-flex justify-content-between align-items-center">
                            
                            <div class="col-md-2 col-lg-2 col-xl-2">
                                <img :src="product.image" class="img-fluid rounded-3" alt="Cotton T-shirt">
                            </div>
                            <div class="col-md-3 col-lg-3 col-xl-3">
                                <p class="lead fw-normal mb-2">{{ product.name }}</p>
                                <p><span class="text-muted">Product Type: </span>{{ product.productType }}</p>
                            </div>


                            <div class="col-md-2 col-lg-2 col-xl-2">


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

<style></style>


