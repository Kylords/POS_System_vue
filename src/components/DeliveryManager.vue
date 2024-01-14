

<script setup>
import { ref } from 'vue';
import { useMutation, useQuery } from '@vue/apollo-composable';
import gql from 'graphql-tag';
import DeliveryList from './DeliveryList.vue';
import CreateDelivery from './CreateDelivery.vue';

const tabs = ref(["Delivery List", "New Delivery"])

const selectedTab = ref('Delivery List')

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
        <DeliveryList v-if="selectedTab == 'Delivery List'"></DeliveryList>
        <CreateDelivery v-else-if="selectedTab == 'New Delivery'"></CreateDelivery>
    </div>
</template>

<style></style>


