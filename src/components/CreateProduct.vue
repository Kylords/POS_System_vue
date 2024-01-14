

<script setup>
import { ref } from 'vue';
import { useMutation, useQuery } from '@vue/apollo-composable';
import gql from 'graphql-tag';

const product = ref({
    name: '',
    productType: 'Physical',
    image: '',
    price: '',
    categoryId: 0,
    description: ''
});


const queryOptions = ref({
    fetchPolicy: 'cache-and-network'
})

const loading = ref(false);



const openCloudinaryWidget = () => {
    // Open the Cloudinary upload widget
    const uploadWidget = window.cloudinary.createUploadWidget({
        cloudName: 'dl1gxb6oo',
        apiKey: '913752823898985',
        uploadPreset: 'm0trj8ac',
        multiple: false,
        cropping: false, // Adjust options as needed
        // Add more options based on your requirements
    }, (error, result) => {
        if (!error && result && result.event === 'success') {
            // Handle the success event and update your component state
            product.value.image = result.info.secure_url;
        }
    });

    uploadWidget.open();
};
const CREATE_PRODUCT_MUTATION = gql`
  mutation createProduct($input: CreateProductInput!) {
    createProduct(input: $input) {
      errors
    }
  }
`;

const { mutate: createProduct } = useMutation(CREATE_PRODUCT_MUTATION);

const submitForm = async () => {
    try {
        loading.value = true;

        // Define your GraphQL mutation


        // Execute the mutation

        const input = {
            name: product.value.name,
            price: product.value.price,
            image: product.value.image,
            productType: product.value.productType,
            categoryId: Number(product.value.categoryId),
            description: product.value.description

        };

        const result = await createProduct({ input });

        if (result.data.createProduct.errors == 0) {
            product.value.name = ''
            product.value.price = ''
            product.value.image = ''
            product.value.productType = ''
            product.value.categoryId = 0
            product.value.description = ''
            alert('Successfully Created Product')
        }

        else {
            const errorString = result.data.createProduct.errors.join(', ')
            console.log(errorString)
        }
    } catch (error) {
        console.error(error);
    } 
};




const { result: resultCategoryQuery, loading: loadingCategoryQuery } = useQuery(gql`
  query {
    categories {
      id
      name
    }
  }
`,null, queryOptions);

</script>

<template>
    <div>
        <form @submit.prevent="submitForm">

            <select class="col-md-2 mt-2 p-0 align-items-center text-center" id="hotelSelect" v-if="resultCategoryQuery"
                v-model="product.categoryId" :disabled="loadingCategoryQuery">
                <option value="0" disabled>Select a category</option>
                <option v-for="category in resultCategoryQuery.categories" :key="category.id" :value="category.id">
                    {{ category.name }}
                </option>
            </select>
            <label for="name">Name:</label>
            <input v-model="product.name" type="text" id="name" required>

            <label for="pricing">Description:</label>
            <input v-model="product.description" type="text" id="pricing" required>

            <label for="pricing">Pricing:</label>
            <input v-model="product.price" type="text" id="pricing" required>

            <label for="pricing">Product Type:</label>
            <input readonly :value="product.productType" type="text" id="pricing" required>

            <label for="image">Image:</label>
            <button type="button" @click="openCloudinaryWidget">Upload Images</button>

            <button class="btn btn-secondary" type="submit" >Create Product</button>
        </form>

    </div>
</template>

<style>
/* Add your custom styles here */
</style>


