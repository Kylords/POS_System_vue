<script setup>
import { ref, inject } from 'vue';
import { useMutation } from '@vue/apollo-composable';
import gql from 'graphql-tag'

const email = ref('')
const password = ref('')

import { useRouter } from 'vue-router';

const router = useRouter();


const bus = inject(['$bus'])



const LOGIN_MUTATION = gql`
  mutation loginUser($input: LoginUserInput!) {
    loginUser(input: $input) {
      token
      errors
      user {
        id
        firstName
        lastName
        email
      }
    }
  }
`;

const { mutate: loginUser } = useMutation(LOGIN_MUTATION)

async function login() {

    try {
        const result = await loginUser({ input: { email: email.value, password: password.value } })

        if (result.data.loginUser.errors == 0) {
            console.log(`Successfully logged in as ${result.data.loginUser.user.firstName} ${result.data.loginUser.user.lastName}`)
            const token = result.data.loginUser.token;
            localStorage.setItem('token', token);
            router.push({ path: '/ordermanager' })
            bus.$emit('changeLoggedStatus', true)
        }

        else {
            const errorString = result.data.loginUser.errors.join(', ');

            console.log(errorString)
        }

    }

    catch (error) {
        console.error('Login error:', error);
    }


}

</script>

<template>
    <form @submit.prevent="login">
        <label for="email">Email:</label>
        <input v-model="email" type="email" id="email" required>

        <label for="password">Password:</label>
        <input v-model="password" type="password" id="password" required>

        <button class="btn btn-secondary" type="submit">Login</button>
    </form>
</template>