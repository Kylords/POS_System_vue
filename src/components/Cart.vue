<script setup>
import { ref, onMounted, inject } from 'vue';
import { useMutation, useQuery } from '@vue/apollo-composable';
import gql from 'graphql-tag';

import { useRouter } from 'vue-router';

const router = useRouter();

const bus = inject(['$bus'])

import ActionCable from 'actioncable';


const cable = ActionCable.createConsumer('ws://localhost:3000/cable');

const queryOptions = ref({
    fetchPolicy: 'cache-and-network'
})
const { result: resultCartQuery, loading: loadingCartQuery, refetch, onResult } = useQuery(gql`
  query {
    cart {
      id
      totalPrice
      cartItems {
        id
        quantity
        totalPrice
        product {
          name
          image
          price
          description
        }
      }
    }
  }
`, null, queryOptions);

onMounted(() => {
    bus.$on('checkout', (value) => {
        refetch()
    })

    cable.subscriptions.create('NotificationChannel', {
        received(data) {
            refetch()
        }
    });
})









const EDIT_CART_ITEM_QUANTITY_MUTATION = gql`
  mutation editCartItemQuantity($input: EditCartItemQuantityInput!) {
    editCartItemQuantity(input: $input) {
      errors
      
    }
  }
`;

const { mutate: editCartItemQuantity } = useMutation(EDIT_CART_ITEM_QUANTITY_MUTATION)

async function editQuantity(cartItemId, quantity) {

    try {
        const result = await editCartItemQuantity({ input: { cartItemId: cartItemId, quantity: quantity } })

        if (result.data.editCartItemQuantity.errors == 0) {
            console.log("success")
            refetch()
        }

        else {
            const errorString = result.data.editCartItemQuantity.errors.join(', ');

            console.log(errorString)
        }

    }

    catch (error) {
        console.error('Login error:', error);
    }


}



const DELETE_CART_ITEM_MUTATION = gql`
  mutation deleteCartItem($input: DeleteCartItemInput!) {
    deleteCartItem(input: $input) {
      errors
      
    }
  }
`;

const { mutate: deleteCartItem } = useMutation(DELETE_CART_ITEM_MUTATION)

async function deleteItem(cartItemId) {

    try {
        const result = await deleteCartItem({ input: { cartItemId: Number(cartItemId) } })

        if (result.data.deleteCartItem.errors == 0) {
            console.log("success")
            refetch()
        }

        else {
            const errorString = result.data.deleteCartItem.errors.join(', ');

            console.log(errorString)
        }

    }

    catch (error) {
        console.error('Login error:', error);
    }


}

function changeQuantity(cartItemId, event) {
    console.log(cartItemId)
    console.log(event.target.value)
    editQuantity(Number(cartItemId), event.target.value)
}

function add(cartItemId) {
    const elementId = "quantity" + cartItemId
    const inputElement = document.getElementById(elementId);
    inputElement.value = parseInt(inputElement.value) + 1;
    console.log(inputElement.value)
    editQuantity(Number(cartItemId), inputElement.value)

}

function sub(cartItemId) {
    const elementId = "quantity" + cartItemId
    const inputElement = document.getElementById(elementId);
    inputElement.value = parseInt(inputElement.value) - 1;
    if (inputElement.value != 0) {
        editQuantity(Number(cartItemId), inputElement.value)
        console.log()
    } else {
        deleteItem(cartItemId)
    }

}

const order = ref({
    productIds: [],
})

function checkbox(cartItemId, event, price) {
    // if (event.target.checked && !order.value.productIds.includes(cartItemId)) {
    //     order.value.productIds = [...order.value.productIds, cartItemId]
    // } else if (!event.target.checked && order.value.productIds.includes(cartItemId)) {
    //     order.value.productIds = order.value.productIds.filter(i => i != cartItemId)
    // }

    bus.$emit('checkbox', [cartItemId, event.target.checked])
    if (event.target.checked) {
        cartPrice.value = cartPrice.value + price
    } else if (!event.target.checked && order.value.productIds.includes(cartItemId)) {
        cartPrice.value = cartPrice.value - price
    }
}



function checkout() {
    router.push({ path: '/checkout' });

}

const cartPrice = ref(0)
</script>

<template>
    <div v-if="resultCartQuery" class="row justify-content-center" style=" margin: auto;">
        <div v-for="cartItem in resultCartQuery.cart.cartItems" :key="cartItem.id"
            class="col-md-10 my-2 mx-3 row justify-content-center">
            <!-- <div class="card rounded-3 mb-4">
                <div class="card-body p-4">
                    <div class="row d-flex justify-content-between align-items-center">
                        <div class="col-md-1">
                            <input type="checkbox" @change="checkbox(cartItem.id, $event)">
                        </div>
                        <div class="col-md-2 col-lg-2 col-xl-2">
                            <img :src="cartItem.product.image" class="img-fluid rounded-3" alt="Cotton T-shirt">
                        </div>
                        <div class="col-md-3 col-lg-3 col-xl-3">
                            <p class="lead fw-normal mb-2">{{ cartItem.product.name }}</p>
                            <p><span class="text-muted">Price: </span>{{ cartItem.product.price }}</p>
                        </div>


                        <div class="col-md-3 col-lg-3 col-xl-2 d-flex">
                            <button class="btn btn-link px-2" @click="sub(cartItem.id)">
                                <i class="bi bi-dash-lg"></i>
                            </button>

                            <input :id="'quantity' + cartItem.id" min="0" name="quantity" type="number"
                                class="form-control form-control-sm" :value="cartItem.quantity"
                                @change="changeQuantity(cartItem.id, $event)" />

                            <button class="btn btn-link px-2" @click="add(cartItem.id)">
                                <i class="bi bi-plus-lg"></i>
                            </button>
                        </div>


                        <div class="col-md-1 col-lg-1 col-xl-1 offset-lg-1">
                            <p class="fw-normal mb-2">Total Price:</p>
                            <p class="lead fw-normal mb-2">₱{{ cartItem.totalPrice }}</p>
                        </div>
                        <div class="col-md-1 col-lg-1 col-xl-1 text-end">
                            <button type="button" class="btn-close" aria-label="Close"
                                @click.stop="deleteItem(cartItem.id)"></button>

                        </div>
                    </div>

                </div>

            </div> -->

            <div class="card p-0 mx-0" style=" margin: auto;">
                <button @click.stop="deleteItem(cartItem.id)" class="close-btn btn px-4"><i
                        class="bi bi-x-circle-fill"></i></button>
                <img :src="cartItem.product.image" class="card-img-top product-img" alt="...">
                <div class="card-body">
                    <h5 class="card-title">{{ cartItem.product.name }}</h5>
                    <p class="card-text">{{ cartItem.product.description }}</p>
                    <div class="col-md-10 col-lg-10 col-xl-10 d-flex text-center">
                        <button class="btn btn-link px-2" @click="sub(cartItem.id)">
                            <i class="bi bi-dash-lg"></i>
                        </button>

                        <input :id="'quantity' + cartItem.id" min="0" name="quantity" type="number"
                            class="form-control form-control" :value="cartItem.quantity"
                            @change="changeQuantity(cartItem.id, $event)" />

                        <button class="btn btn-link px-2" @click="add(cartItem.id)">
                            <i class="bi bi-plus-lg"></i>
                        </button>
                    </div>
                    <p>₱{{ cartItem.product.price }}</p>
                    <hr>
                    <h5 class="d-flex justify-content-end">₱{{ cartItem.totalPrice }}</h5>

                </div>
            </div>
        </div>
        <div>
            <hr>
            <div v-for="(cartItem, index) in resultCartQuery.cart.cartItems">

                <h5
                    :class="{ 'd-flex': true, 'justify-content-between': index > 0, 'justify-content-end': index === 0, 'text-muted': true }">
                    <span v-if="index > 0">+</span><span>{{ cartItem.totalPrice }}</span>
                </h5>


            </div>
            <hr>
        </div>

        <div class="my-2">
            <h4 class="d-flex justify-content-between"><span class="text-muted">Cart Price:</span> <span>₱{{
                resultCartQuery.cart.totalPrice }}</span></h4>

        </div>

        <div>
            <p class="continue" @click="checkout">Continue <i class="bi bi-arrow-right"></i> </p>
        </div>

    </div>
</template>

<style scoped>
.close-btn {
    position: absolute;
    right: -20px;

}

.close-btn:hover {

    color: red;
}

.card {
    max-width: 200px;
}

.continue:hover {
    text-decoration: underline;
    cursor: pointer;
    -webkit-transform: scale(1.01);
    -moz-transform: scale(1.01);
    transform: scale(1.01);
}

.continue {
    position: relative;
    bottom: 0;
}
</style>



