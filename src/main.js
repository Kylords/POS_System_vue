import { createApp, provide, h } from 'vue'
import App from './App.vue'
import router from './routes'
import $bus from './utils/Events'
import '../node_modules/bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';

import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client/core'


import { DefaultApolloClient } from '@vue/apollo-composable'
import { setContext } from 'apollo-link-context';

const httpLink = createHttpLink({
    uri: 'http://localhost:3000/graphql',
    headers: {
        'X-CSRF-Token': "qU5zYiFrOrMTb3oaJ8IQaJL4Ui5YlDeMcG1mylHgOVwhEavkIcXwIyOMDFKxewJActZMrUSGCxKJT09buwRWVg",
    },
})



const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            ...headers,
            Authorization: token ? `Bearer ${token}` : '',
        },
    };
});


const cache = new InMemoryCache()



// Create the apollo client
const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache,
})

const app = createApp({
    setup () {
      provide(DefaultApolloClient, apolloClient)
    },
  
    render: () => h(App),
})

app.provide('$bus', $bus)

app.use(router);
  

app.mount('#app')