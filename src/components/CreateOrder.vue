

<script setup>
import { ref, inject } from 'vue';
import { useMutation, useQuery } from '@vue/apollo-composable';
import gql from 'graphql-tag';

import Cart from './Cart.vue';
import Products from './Products.vue';
import Checkout from './Checkout.vue';

const tabs = ref(['Products', 'Checkout'])
const bus = inject(['$bus'])
const selectedTab = ref('Products')

function clickTab(tab) {
    selectedTab.value = tab
}


onMounted(() => {
    bus.$on('gotoCheckout', (value) => {
        selectedTab.value = 'Checkout'
    })

    
})
</script>

<template>
    <div class="row" style="margin: auto;">
        <div class="col-md-9">
            
            <ul class="nav nav-tabs" id="myTab" role="tablist">
                <li v-for="(tab, index) in tabs" :key="index" class="nav-item" role="presentation">
                    <button :class="{ 'nav-link': true, 'active': tab === selectedTab }" :id="`pills-${index}-tab`"
                        data-bs-toggle="pill" :data-bs-target="`#pills-${index}`" type="button" role="tab"
                        :aria-controls="`pills-${index}`" :aria-selected="tab === selectedTab" @click="clickTab(tab)">
                        {{ tab }}
                    </button>
                </li>
                
            </ul>
            <hr>
            <div v-if="selectedTab == 'Products'">
                <Products></Products>
            </div>
            <div v-else-if="selectedTab == 'Checkout'">
                <Checkout></Checkout>
            </div>
        </div>

        <div class="col-md-3 m-0 p-0">
            <Cart class="cart h-100"></Cart>
        </div>
    </div>
</template>

<style scoped>
.cart {
    background-color: rgb(227, 227, 227);
    border-bottom-left-radius: 2%;
    border-top-left-radius: 2%;
    box-shadow: -3px 3px 2px 1px #aaaaaa;

    min-height: 92vh;
    max-height: 92vh;
    overflow-y: scroll;
    position: -webkit-sticky;
    position: sticky;
    top: 8vh;
    margin: 0;

}

</style>


