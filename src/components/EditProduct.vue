<script setup>
import { ref, watch, inject, onMounted } from 'vue';
import { useMutation, useQuery } from '@vue/apollo-composable';
import gql from 'graphql-tag';
import { useRoute, useRouter } from 'vue-router';

const bus = inject(['$bus'])


const route = useRoute();
const router = useRouter()

const queryOptions = ref({
    fetchPolicy: 'cache-and-network'
})

const vari = ref({
    productId: Number(route.params.id)
})

const product = ref({
    name: '',
    productType: 'Physical',
    image: '',
    price: '',
    categoryId: 0,
    description: '',
    productId: Number(route.params.id)
});


const { result: resultCategoryQuery, loading: loadingCategoryQuery, refetch } = useQuery(gql`
  query {
    categories {
      id
      name
    }
  }
`,null, queryOptions);


const { result: resultProductQuery, loading: loadingProductQuery, refetch: refetchProduct, onResult: onProductResult } = useQuery(gql`
  query($productId: Int!) {
    product(productId: $productId) {
      id
      name
      price
      image
      description
      productType
      categoryId
    }
  }
`, vari);



onProductResult(result => {
    if (!result.loading) {
        product.value.name = result.data.product.name
        product.value.image = result.data.product.image
        product.value.productType = result.data.product.productType
        product.value.price = result.data.product.price
        product.value.description = result.data.product.description
        product.value.categoryId = result.data.product.categoryId
    }
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
            console.log(result.info.secure_url)
        }
    });

    uploadWidget.open();
};
const EDIT_PRODUCT_MUTATION = gql`
  mutation editProduct($input: EditProductInput!) {
    editProduct(input: $input) {
      errors
    }
  }
`;

const { mutate: editProduct } = useMutation(EDIT_PRODUCT_MUTATION);

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
            description: product.value.description,
            productId: product.value.productId

        };

        const result = await editProduct({ input });

        if (result.data.editProduct.errors == 0) {
            product.value.name = ''
            product.value.price = ''
            product.value.image = ''
            product.value.productType = ''
            product.value.categoryId = 0
            product.value.description = ''
            bus.$emit('newProduct')
            alert('Successfully Created Product')
            
            router.push({ path: '/productmanager' });
        }

        else {
            const errorString = result.data.editProduct.errors.join(', ')
            console.log(errorString)
        }
    } catch (error) {
        console.error(error);
    }
};
</script>

<template>
    <div>
        <div class="d-flex justify-content-center">
            <img :src="product.image" alt="" v-if="product.image != ''">
        </div>
        
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

            <button type="submit">Create Room Type</button>
        </form>

    </div>
</template>

<style scoped>
img {
    width: 400px;
    height: 200px;
}
</style>

