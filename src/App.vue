<script setup>
import Navbar from './components/Navbar.vue';
import { useMutation, useQuery } from '@vue/apollo-composable';
import { onMounted, ref, watch, inject } from 'vue'
import gql from 'graphql-tag';
import ActionCable from 'actioncable';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter()

const userId = ref(null)

const userInfo = ref(null)

const cable = ActionCable.createConsumer('ws://localhost:3000/cable');

const bus = inject(['$bus'])

onMounted(() => {
  bus.$on('changeLoggedStatus', (value) => {
    refetch()
  })

  
})


const { result: resultCurrentUserQuery, loading: loadingCurrentUserQuery, onResult, refetch } = useQuery(gql`
  query {
  currentUser {
    email
    firstName
    lastName
    id
    admin
    cart {
      id
    }
    
  }
}
`
);


onResult(result => {
  if (!result.loading) {
    if (result.data.currentUser) {
      userId.value = result.data.currentUser.id
      userInfo.value = result.data.currentUser

    }
  }
})
</script>

<template>
  <Navbar class="naav" :userInfo="userInfo"></Navbar>
  
  <router-view></router-view>
</template>

<style scoped>
.naav {
  height: 8vh;
  position: -webkit-sticky;
  position: sticky;
  top: 0;
  z-index: 100;
}




</style>
