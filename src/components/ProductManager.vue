

<script setup>
import { ref } from 'vue';
import { useMutation, useQuery } from '@vue/apollo-composable';
import gql from 'graphql-tag';
import CreateProduct from './CreateProduct.vue';
import CreateCategory from './CreateCategory.vue';
import Products from './Products.vue';

const tabs = ref(["Show Products", "Create Product", "Create Category"])

const selectedTab = ref('Show Products')

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
        <CreateProduct v-if="selectedTab == 'Create Product'"></CreateProduct>
        <CreateCategory v-if="selectedTab == 'Create Category'"></CreateCategory>
        <Products v-if="selectedTab == 'Show Products'"></Products>
    </div>
</template>

<style></style>


