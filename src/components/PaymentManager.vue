

<script setup>
import { ref } from 'vue';
import { useMutation, useQuery } from '@vue/apollo-composable';
import gql from 'graphql-tag';
import PaymentList from './PaymentList.vue';
import CreatePayment from './CreatePayment.vue';

const tabs = ref(["Payment List", "New Payment"])

const selectedTab = ref('Payment List')

function clickTab(tab) {
    selectedTab.value = tab
}

</script>

<template>
    <ul class="nav nav-tabs" id="myTab" role="tablist">
        <li v-for="(tab, index) in tabs" :key="index" class="nav-item" role="presentation">
            <button :class="{ 'nav-link': true, 'active': tab === selectedTab }" :id="`pills-${index}-tab`"
                data-bs-toggle="pill" :data-bs-target="`#pills-${index}`" type="button" role="tab"
                :aria-controls="`pills-${index}`" :aria-selected="tab === selectedTab" @click="clickTab(tab)">
                {{ tab }}
            </button>
        </li>

    </ul>
    <div>
        <PaymentList v-if="selectedTab == 'Payment List'"></PaymentList>
        <CreatePayment v-if="selectedTab == 'New Payment'"></CreatePayment>
    </div>
</template>

<style></style>


