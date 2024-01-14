

<script setup>
import { ref, inject } from 'vue';
import { useMutation, useQuery } from '@vue/apollo-composable';
import gql from 'graphql-tag';
import { useRoute } from 'vue-router';
const route = useRoute();
const bus = inject(['$bus'])
const variables = ref({
    productId: Number(route.params.id)
})

const queryOptions = ref({
    enabled: false,
})

const details = ref({
    productId: Number(route.params.id),
    quantity: 1
})



const { result: resultProductQuery, loading: loadingProductQuery, onResult, refetch } = useQuery(gql`
  query($productId: Int!) {
    product(productId: $productId) {
      id
      name
      price
      image
      description
    }
  }
`,
    variables);



const ADD_TO_CART_MUTATION = gql`
  mutation addToCart($input: AddToCartInput!) {
    addToCart(input: $input) {
      errors
      
    }
  }
`;

const { mutate: addToCart } = useMutation(ADD_TO_CART_MUTATION)

async function addCart() {

    try {
        const result = await addToCart({ input: { productId: Number(details.value.productId), quantity: (details.value.quantity).toString() } })

        if (result.data.addToCart.errors == 0) {
            alert("Successfully added to cart")
            // bus.$emit('updateCart')
        }

        else {
            const errorString = result.data.addToCart.errors.join(', ');

            console.log(errorString)
        }

    }

    catch (error) {
        console.error('Add to cart error:', error);
    }


}




function add() {
    details.value.quantity++
}

function sub() {
    details.value.quantity--
}


</script>

<template>
    
        <div class="modal-dialog" v-if="resultProductQuery">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="exampleModalLabel">{{resultProductQuery.product.name}}</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="detail-con">


                        <img :src="resultProductQuery.product.image" class="d-block product-img" alt="room image">

                        <button class="btn btn-link px-2" @click="sub">
                            <i class="bi bi-dash-lg"></i>
                        </button>
                        <input type="number" v-model="details.quantity">
                        <button class="btn btn-link px-2" @click="add">
                            <i class="bi bi-plus-lg"></i>
                        </button>

                        <button class="btn btn-secondary" @click="addCart">Add to Cart</button>

                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    
</template>

<style>
.product-img {
    max-width: 200px;
}
</style>


