<script setup>
import { ref, onMounted, inject, computed, watch } from 'vue';
import { useMutation, useQuery } from '@vue/apollo-composable';
import gql from 'graphql-tag';
import { useRoute, useRouter } from 'vue-router';
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js';

const bus = inject(['$bus'])

const showSuggestedEmails = ref(false)

const showSuggestedMobiles = ref(false)

const queryOptions = ref({
    fetchPolicy: 'cache-and-network'
})

onMounted(() => {
    bus.$on('checkout', (value) => {
        refetch()
        refetchInfo()
        refetchMobileInfo()
        showSuggestedEmails.value = false
        showSuggestedMobiles.value = false
    })


})

const order = ref(null)

const orderId = ref(0)

const orderSuccess = ref(false)




const mySelectDelivery = ref(null)

const mySelectedPayment = ref(null)


const { result: resultDeliveryQuery, loading: loadingDeliveryQuery } = useQuery(gql`
  query {
    deliveryMethods {
      id
      deliveryMethod
      price
      enabled 

    }
  }
`, null, queryOptions);

const { result: resultPaymentQuery, refetch: onPaymentRefetch } = useQuery(gql`
  query {
    paymentMethods {
      id
      paymentMethod
      enabled 

    }
  }
`, null, queryOptions);


const placeOrder = ref({
    orderType: 'Online',

    province: '',
    city: '',
    baranggay: '',
    street: '',

    roomUnit: '',
    floor: '',
    building: '',
    nearestLandmark: '',
    remarks: '',

    deliveryId: '',

    paymentId: '',

    firstName: '',
    lastName: '',
    email: '',
    mobile: ''
})


const orderOptions = ref(["Online", "In-Store"])

function selectOrderOption(option) {
    placeOrder.value.orderType = option
    if (option = "In-Store") {

        placeOrder.value.deliveryId = 1

        deliveryFee.value = 0
        shippingButtonValue.value = false
        mySelectDelivery.value = {deliveryMethod: 'In-store', price: '0'}
    } else {
        placeOrder.value.deliveryId = ''
    }
}

const shippingButtonValue = ref(false)

function toggleShippingMethod() {
    shippingButtonValue.value = !shippingButtonValue.value
}

const deliveryFee = ref(0)

function selectDelivery(deliveryId, deliveryPrice, method) {
    placeOrder.value.deliveryId = Number(deliveryId)
    deliveryFee.value = deliveryPrice
    mySelectDelivery.value = method
}

function selectPayment(paymentId, method) {
    placeOrder.value.paymentId = Number(paymentId)
    mySelectedPayment.value = method
}


const { result: resultCartQuery, loading: loadingCartQuery, refetch } = useQuery(gql`
  query {
    cart {
      id
      totalPrice
      cartItems {
      id
      }
      
    }
  }
`, null, queryOptions);




const CREATE_ORDER_MUTATION = gql`
  mutation createOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      order{
        id
        province
        city
        baranggay
        street
        roomUnit
        floor
        building
        nearestLandmark
        remarks
        totalPrice
        payment {
            paymentMethod
        }
        delivery {
            deliveryMethod
            price
        }


      }
      errors
      
    }
  }
`;

const { mutate: createOrder } = useMutation(CREATE_ORDER_MUTATION)

async function orderClick() {

    try {
        const result = await createOrder({ input: placeOrder.value })

        if (result.data.createOrder.errors == 0) {
            orderSuccess.value = true
            order.value = result.data.createOrder.order
            orderId.value = result.data.createOrder.order.id
            placeOrder.value.deliveryId = ''
            placeOrder.value.paymentId = ''

            console.log(orderSuccess)
            const myModal = new bootstrap.Modal(document.getElementById('OrderModal'));
            myModal.show();
            myModal._element.addEventListener('hidden.bs.modal', function () {
                myModal.hide();
                bus.$emit('checkout')
                order.value = null
                mySelectDelivery.value = null
                mySelectedPayment.value = null
                orderId.value = 0
            });

        }

        else {
            const errorString = result.data.createOrder.errors.join(', ');

            console.log(errorString)
        }

    }

    catch (error) {
        console.error('Order Error:', error);
    }


}



const formattedAddress = computed(() => {
    if (placeOrder.orderType == 'Online') {
        const addressComponents = [
        placeOrder.value.roomUnit,
        placeOrder.value.floor,
        placeOrder.value.building,
        placeOrder.value.street,
        placeOrder.value.baranggay,
        placeOrder.value.city,
        placeOrder.value.province,
    ];

    // Filter out empty strings and join with a comma and space
    return addressComponents.filter(Boolean).join(', ');
    } else {
        return 'In-store'
    }
    
});



const { result: infoResult, onResult: onInfoResult, refetch: refetchInfo } = useQuery(
    gql`
    query {
  findLatestOrderEmails{
    email
    firstName
    lastName
    mobile
    
    province
    city
    baranggay
    street
    
    roomUnit
    floor
    building
    nearestLandmark
    remarks
    
  }
}
  `, null, queryOptions
);



const { result: infoMobileResult, onResult: onInfoMobileResult, refetch: refetchMobileInfo } = useQuery(
    gql`
    query {
  findLatestOrderMobiles{
    email
    firstName
    lastName
    mobile
    
    province
    city
    baranggay
    street
    
    roomUnit
    floor
    building
    nearestLandmark
    remarks
    
  }
}
  `, null, queryOptions
);


const emailSuggestions = ref([])
const mobileSuggestions = ref([])
onInfoResult(result => {
    if (!result.loading && infoResult) {
        emailSuggestions.value = result.data.findLatestOrderEmails

    }

})

onInfoMobileResult(result => {
    if (!result.loading && infoResult) {
        mobileSuggestions.value = result.data.findLatestOrderMobiles

    }

})



function clickEmail(order) {
    placeOrder.value.email = order.email
    placeOrder.value.firstName = order.firstName
    placeOrder.value.lastName = order.lastName
    placeOrder.value.mobile = order.mobile
    placeOrder.value.province = order.province
    placeOrder.value.city = order.city
    placeOrder.value.baranggay = order.baranggay
    placeOrder.value.street = order.street
    placeOrder.value.roomUnit = order.roomUnit
    placeOrder.value.floor = order.floor
    placeOrder.value.building = order.building
    placeOrder.value.nearestLandmark = order.nearestLandmark
    placeOrder.value.remarks = order.remarks

    showSuggestedEmails.value = false
    showSuggestedMobiles.value = false
}


function clickMobile(order) {
    placeOrder.value.email = order.email
    placeOrder.value.firstName = order.firstName
    placeOrder.value.lastName = order.lastName
    placeOrder.value.mobile = order.mobile
    placeOrder.value.province = order.province
    placeOrder.value.city = order.city
    placeOrder.value.baranggay = order.baranggay
    placeOrder.value.street = order.street
    placeOrder.value.roomUnit = order.roomUnit
    placeOrder.value.floor = order.floor
    placeOrder.value.building = order.building
    placeOrder.value.nearestLandmark = order.nearestLandmark
    placeOrder.value.remarks = order.remarks

    showSuggestedMobiles.value = false
    showSuggestedEmails.value = false

}


function showEmailTrue() {
    showSuggestedEmails.value = true
}

function showMobileTrue() {
    showSuggestedMobiles.value = true
}

</script>

<template>
    <div>
        <div>
            <div class="col-md-3">
                <div class="input-div row">
                    <label for="province">First Name: *</label>
                    <input type="text" v-model="placeOrder.firstName" placeholder="First Name" class="form-control">

                </div>

                <div class="input-div row">
                    <label for="province">Last Name: *</label>
                    <input type="text" v-model="placeOrder.lastName" placeholder="Last Name" class="form-control">
                </div>

                <div class="input-div row">
                    <label for="province">Email: *</label>
                    <input type="text" v-model="placeOrder.email" placeholder="Email" class="form-control"
                        @input="showEmailTrue" @change="showEmailTrue">
                    <ul v-if="emailSuggestions.length > 0 && placeOrder.email !== '' && infoResult && showSuggestedEmails"
                        class="suggestions-list">
                        <li class="suggestion-product"
                            v-for="email in emailSuggestions.filter(item => item.email.toLowerCase().includes(placeOrder.email))"
                            :key="email.id" @click="clickEmail(email)">
                            {{ email.email }}

                        </li>

                    </ul>
                </div>

                <div class="input-div row">
                    <label for="province">Mobile: *</label>
                    <input type="text" v-model="placeOrder.mobile" placeholder="Mobile" class="form-control"
                        @input="showMobileTrue" @change="showMobileTrue">
                    <ul v-if="mobileSuggestions.length > 0 && placeOrder.mobile !== '' && infoMobileResult && showSuggestedMobiles"
                        class="suggestions-list">
                        <li class="suggestion-product"
                            v-for="mobile in mobileSuggestions.filter(item => item.mobile.toLowerCase().includes(placeOrder.mobile))"
                            :key="mobile.id" @click="clickMobile(mobile)">
                            {{ mobile.mobile }}

                        </li>

                    </ul>
                </div>
            </div>
        </div>


        <div>
            <h3>Select Order Option</h3>
            <div>

                <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
                    <li v-for="(option, index) in orderOptions" :key="index" class="nav-item" role="presentation">
                        <button :class="{ 'nav-link': true, 'active': option === placeOrder.orderType }"
                            :id="`pills-${index}-tab`" data-bs-toggle="pill" :data-bs-target="`#pills-${index}`"
                            type="button" role="tab" :aria-controls="`pills-${index}`" @click="selectOrderOption(option)">
                            {{ option }}
                        </button>
                    </li>
                </ul>


            </div>
        </div>

        <div v-if="placeOrder.orderType == 'Online'">
            <hr>
            <h3>Delivery Information</h3>
            <div class="row" style="margin: auto;">
                <div class="col-md-3">
                    <div class="input-div row">
                        <label for="province">Province: *</label>
                        <input type="text" v-model="placeOrder.province" placeholder="Province" class="form-control">
                    </div>

                    <div class="input-div row">
                        <label for="province">City: *</label>
                        <input type="text" v-model="placeOrder.city" placeholder="City" class="form-control">
                    </div>

                    <div class="input-div row">
                        <label for="province">Baranggay: *</label>
                        <input type="text" v-model="placeOrder.baranggay" placeholder="Baranggay" class="form-control">
                    </div>

                    <div class="input-div row">
                        <label for="province">Street: *</label>
                        <input type="text" v-model="placeOrder.street" placeholder="Street" class="form-control">
                    </div>
                </div>
                <div class="col-md-3">


                    <div class="input-div row">
                        <label for="province">Room/Unit: </label>
                        <input type="text" v-model="placeOrder.roomUnit" placeholder="Room/Unit" class="form-control">
                    </div>

                    <div class="input-div row">
                        <label for="province">Floor: </label>
                        <input type="text" v-model="placeOrder.floor" placeholder="Floor" class="form-control">
                    </div>

                    <div class="input-div row">
                        <label for="province">Building: </label>
                        <input type="text" v-model="placeOrder.building" placeholder="Building" class="form-control">
                    </div>

                    <div class="input-div row">
                        <label for="province">Nearest Landmark: </label>
                        <input type="text" v-model="placeOrder.nearestLandmark" placeholder="Nearest Landmark"
                            class="form-control">
                    </div>

                    <div class="input-div row">
                        <label for="province">Remarks: </label>
                        <input type="text" v-model="placeOrder.remarks" placeholder="Remarks" class="form-control">
                    </div>
                </div>
            </div>
        </div>

        <div v-if="placeOrder.orderType == 'Online'">
            <hr>
            <h3>Delivery Method</h3>
            <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
                <li class="nav-item" role="presentation">
                    <button class="nav-link" :class="{ 'active': shippingButtonValue }" @click="toggleShippingMethod">
                        Show Available Shipping Options
                    </button>
                </li>
            </ul>




        </div>

        <div v-if="shippingButtonValue && resultDeliveryQuery" class="row" style="margin: auto;">
            <div v-for="delivery in resultDeliveryQuery.deliveryMethods" class="col">
                    <button v-if="delivery.enabled" class="btn btn-outline-success btn-sm"
                        :class="{ 'selectedDelivery': placeOrder.deliveryId == delivery.id }"
                        @click="selectDelivery(delivery.id, delivery.price, delivery)">
                        <h6>{{ delivery.deliveryMethod }}</h6>
                        ₱{{ delivery.price }}
                    </button>
                



            </div>

        </div>

        <div v-if="resultPaymentQuery" class="row" style="margin: auto;">
            <hr>
            <h3>Payment Method</h3>
            <div v-for="payment in resultPaymentQuery.paymentMethods" class="col-md-3 ">
                <button v-if="payment.enabled" class="btn btn-outline-success btn-sm"
                    :class="{ 'selectedPayment': placeOrder.paymentId == payment.id }"
                    @click="selectPayment(payment.id, payment)">
                    <h6>{{ payment.paymentMethod }}</h6>
                </button>

            </div>


        </div>
    </div>
    <div v-if="resultCartQuery && resultCartQuery.cart.totalPrice != 0">


        <div>
            <h6 class="d-flex justify-content-end">Delivery Fee: ₱{{ deliveryFee }}</h6>
        </div>

        <div>
            <h6 class="d-flex justify-content-end">Convenience Fee: ₱50</h6>
        </div>

        <div>
            <h6 class="d-flex justify-content-end">Cart Total: ₱{{ resultCartQuery.cart.totalPrice }}</h6>
        </div>

        <div v-if="resultCartQuery">
            <h4 class="d-flex justify-content-end"><span>Grand Total: </span><span>₱{{ resultCartQuery.cart.totalPrice +
                Number(deliveryFee) + 50 }}</span></h4>
        </div>
    </div>
    <button v-if="resultCartQuery" class="btn btn-secondary" @click="orderClick"
        :disabled="(placeOrder.orderType != 'Online' || placeOrder.deliveryId == '' || placeOrder.paymentId == '' || placeOrder.deliveryId == 1) && (placeOrder.orderType != 'In-Store' || placeOrder.paymentId == '') || placeOrder.province == '' || placeOrder.city == '' || placeOrder.baranggay == '' || placeOrder.street == ''">Place
        Order</button>



    <div class="modal fade" id="OrderModal" tabindex="-1" aria-labelledby="OrderModalLabel" aria-hidden="true"
        v-if="(mySelectedPayment && placeOrder.orderType == 'In-Store') || (mySelectedPayment && mySelectDelivery)">


        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="OrderModalLabel">Order Placed Successfully!!</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="detail-con">
                        <p>Order Reference Number: {{ orderId }}</p>
                        <p>Name: {{ placeOrder.firstName }} {{ placeOrder.lastName }}</p>
                        <p>Email: {{ placeOrder.email }}</p>
                        <p>Mobile Number: {{ placeOrder.mobile }}</p>
                        <p>Delivery Address: {{ formattedAddress }} </p>
                        <p>Shipping Method: {{ mySelectDelivery.deliveryMethod }}</p>
                        <p>Payment Method: {{ mySelectedPayment.paymentMethod }}</p>
                        <br>
                        <p>Summary: </p>
                        <hr>
                        <p>Subtotal: {{ resultCartQuery.cart.totalPrice }}</p>
                        <p>Shipping Fee: {{ mySelectDelivery.price }}</p>
                        <p>Convenience Fee: ₱50</p>
                        <hr>
                        <h5>Grand Total: {{ Number(resultCartQuery.cart.totalPrice) + Number(mySelectDelivery.price) + 50 }}
                        </h5>





                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.input-div {
    margin-bottom: 10px;
}

label {
    display: inline-block;
    width: 150px;
}

input {
    width: 200px !important;

}

.selectedDelivery {
    background-color: rgb(99, 146, 99);
    color: rgb(255, 255, 255);
}

.selectedPayment {
    background-color: rgb(99, 146, 99);
    color: rgb(255, 255, 255);
}


.btn-outline-success:hover {
    background-color: rgb(99, 146, 99);
    color: rgb(255, 255, 255);
}

.btn-outline-success {
    width: 120px;
    height: 60px;
    margin-bottom: 20px;

}



.product-img {
    max-height: 120px;
    object-fit: fill;
    margin: auto;
}

.card {
    max-height: 285px;
    max-width: 200px;

}

.card {

    background-color: aliceblue !important;
    max-width: 200px;
}

.product-con:hover {
    -webkit-transform: scale(1.05);
    -moz-transform: scale(1.05);
    transform: scale(1.05);
    cursor: pointer;
}

.cart {
    background-color: rgb(227, 227, 227);
    border-bottom-left-radius: 2%;
    border-top-left-radius: 2%;
    box-shadow: -3px 3px 2px 1px #aaaaaa;

    min-height: 92vh;
    max-height: 100vh;
    overflow-y: scroll;
    position: -webkit-sticky;
    position: sticky;
    top: 8vh;

}

.flex {
    display: flex;
}
</style>

