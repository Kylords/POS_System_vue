

<script setup>
import { ref, watch, inject, onMounted } from 'vue';
import { useMutation, useQuery } from '@vue/apollo-composable';
import gql from 'graphql-tag';
import ProductView from './ProductView.vue';
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js';

const bus = inject(['$bus'])

onMounted(() => {
  bus.$on('newProduct', (value) => {
    refetch()
  })

  
})

import { useRouter } from 'vue-router';

const router = useRouter();

const vari = ref({
    productId: null
})

const details = ref({
    productId: 1,
    quantity: 1
})


const variables = ref({
    categoryId: 0,
    search: ''
})

const queryOptions = ref({
    fetchPolicy: 'cache-and-network'
})

const productSuggestions = ref([])

function selectedSuggestedProduct(productName) {
    variables.value.search = productName
}




const { result: resultCategoryQuery, loading: loadingCategoryQuery } = useQuery(gql`
  query {
    categories {
      id
      name
    }
  }
`);



function selectCategory(id) {
    variables.value.categoryId = Number(id)
}

const { result: resultProductsQuery, loading: loadingProductsQuery, onResult, refetch } = useQuery(gql`
  query($categoryId: Int!, $search: String!) {
    products(categoryId: $categoryId, search: $search) {
      id
      name
      price
      image
      description
    }
  }
`,
    variables, queryOptions);

onResult(result => {
    if (!result.loading && result.data)
        productSuggestions.value = result.data.products
})


const selectedProduct = ref(false)




function viewProduct(productId, product) {
    // router.push({ name: 'productview', params: { id: productId } });
    vari.value.productId = Number(productId)
    refetchProduct({ productId: Number(productId) })
    details.value.productId = productId
    selectedProduct.value = true

}


const { result: resultProductQuery, loading: loadingProductQuery, refetch: refetchProduct, onResult: onProductResult } = useQuery(gql`
  query($productId: Int) {
    product(productId: $productId) {
      id
      name
      price
      image
      description
    }
  }
`, vari, queryOptions);

onProductResult(result => {
    if (!result.loading && resultProductQuery) {
        if (selectedProduct.value && router.currentRoute.value.path == '/createorder') {
            var myModal = new bootstrap.Modal(document.getElementById('exampleModal'));
            myModal.show();
            myModal._element.addEventListener('hidden.bs.modal', function () {
                details.value.quantity = 1
                myModal.hide();
            });
        }

    }
})

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
function edit(id) {
    router.push({ name: 'editproduct', params: { id: id } });
}
</script>

<template>
    <div class="row" style="margin: auto;">
        <div>
            <div class="row input-group rounded">
                <input type="search" class="form-control rounded" placeholder="Search" aria-label="Search"
                    aria-describedby="search-addon" v-model="variables.search" />
                <ul v-if="productSuggestions.length > 0 && variables.search !== ''" class="suggestions-list">
                    <li class="suggestion-product" v-for="product in productSuggestions" :key="product.id"
                        @click="selectedSuggestedProduct(product.name)">
                        {{ product.name }}
                    </li>
                </ul>

            </div>
            <div v-if="resultCategoryQuery">

                <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
                    <li class="nav-item" role="presentation">
                        <button :class="{ 'nav-link': true, 'active': variables.categoryId === 0 }" :id="`pills-0-tab`"
                            data-bs-toggle="pill" :data-bs-target="`#pills-0`" type="button" role="tab"
                            :aria-controls="`pills-0`" :aria-selected="variables.categoryId === 0"
                            @click="selectCategory(0)">
                            All
                        </button>
                    </li>
                    <li v-for="category in resultCategoryQuery.categories" :key="category.id" class="nav-item"
                        role="presentation">
                        <button :class="{ 'nav-link': true, 'active': variables.categoryId === category.id }"
                            :id="`pills-${category.id}-tab`" data-bs-toggle="pill" :data-bs-target="`#pills-${category.id}`"
                            type="button" role="tab" :aria-controls="`pills-${category.id}`"
                            :aria-selected="variables.categoryId === category.id" @click="selectCategory(category.id)">
                            {{ category.name }}
                        </button>
                    </li>
                    
                </ul>


            </div>


            <div v-if="resultProductsQuery">
                <div class="row justify-content-start" style=" margin: 0 auto; flex-wrap: wrap;">
                    <div v-for="product in resultProductsQuery.products" :key="product.id" class="d-flex justify-content-center col-md-4 my-2"
                        >
                        <div class="product-con card p-0 mx-0" style=" margin: auto;"
                            @click="viewProduct(product.id, product)">
                            <img :src="product.image" class="card-img-top product-img" alt="...">
                            <div class="card-body">
                                <h5 class="card-title">{{ product.name }}</h5>
                                <p class="card-text">{{ product.description }}</p>
                                <h5>₱{{ product.price }}</h5>
                                <p class="edit" @click.stop="edit(product.id)">Edit</p>

                            </div>
                        </div>


                    </div>
                </div>
            </div>
        </div>


    </div>
    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true"
        v-if="resultProductQuery && resultProductQuery.product">


        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="exampleModalLabel">{{ resultProductQuery.product.name }}</h1>
                </div>
                <div class="modal-body">
                    <div class="detail-con">


                        <img :src="resultProductQuery.product.image" class="d-block product-img" alt="room image">


                        <input type="number" v-model="details.quantity">


                        <button class="btn btn-secondary" @click.native="addCart">Add to Cart</button>

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

.search-container {
    position: relative;
    width: 300px;
    /* Adjust as needed */
}

.suggestions-list {
    list-style-type: none;
    padding: 0;
    margin: 0;
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 1;
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    max-height: 200px;
    /* Adjust as needed */
    overflow-y: auto;
}

.suggestion-product:hover {
    background-color: rgb(208, 233, 255);
    cursor: pointer;
}

.edit:hover {
    text-decoration: underline;
}
</style>


