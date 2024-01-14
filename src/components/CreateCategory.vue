

<script setup>
import { ref, inject } from 'vue';
import { useMutation, useQuery } from '@vue/apollo-composable';
import gql from 'graphql-tag';
const bus = inject(['$bus'])

import { useRoute, useRouter } from 'vue-router';


const route = useRoute();
const router = useRouter()

const category = ref({
    name: ''
});





const CREATE_CATEGORY_MUTATION = gql`
  mutation createCategory($input: CreateCategoryInput!) {
    createCategory(input: $input) {
      errors
    }
  }
`;

const { mutate: createCategory } = useMutation(CREATE_CATEGORY_MUTATION);

const submitForm = async () => {
    try {

        // Define your GraphQL mutation


        // Execute the mutation

        const input = {
            name: category.value.name,
        };

        const result = await createCategory({ input });

        if (result.data.createCategory.errors == 0) {
            router.push({ path: '/productmanager' });
            bus.$emit('newCategory')
            alert(`Successfully created Category`)
            category.value.name = ''
        }

        else {
            const errorString = result.data.createCategory.errors.join(', ')
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
            <label for="location">Name: </label>
            <input v-model="category.name" type="text" id="name" required>

            
            <button class="btn btn-secondary" type="submit">Create Category</button>
        </form>

    </div>
</template>

<style>
/* Add your custom styles here */
</style>


