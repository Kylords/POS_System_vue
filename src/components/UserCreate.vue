

<script setup>
import { ref, inject } from 'vue';
import { useMutation, useQuery } from '@vue/apollo-composable';
import gql from 'graphql-tag';

const emit = defineEmits(['changeLogged', 'refetch']);

import { useRouter } from 'vue-router';

const router = useRouter();

const user = ref({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    admin: false
});

function changeLoggedValue() {
  emit('changeLogged', true)
}

const bus = inject(['$bus'])



const CREATE_USER_MUTATION = gql`
  mutation createUser($input: CreateUserInput!) {
    createUser(input: $input) {
    token
      errors
    }
  }
`;

const { mutate: createUser } = useMutation(CREATE_USER_MUTATION);

const submitForm = async () => {
    try {

        // Define your GraphQL mutation


        // Execute the mutation

        const input = {
            firstName: user.value.firstName,
            lastName: user.value.lastName,
            email: user.value.email,
            password: user.value.password,
            passwordConfirmation: user.value.passwordConfirmation,
            admin: user.value.admin
        };

        const result = await createUser({ input });

        if (result.data.createUser.errors == 0) {
            console.log(`Successfully created User`)
            user.value.firstName = ''
            user.value.lastName = ''
            user.value.email = ''
            user.value.password = ''
            user.value.passwordConfirmation = ''
            router.push({ path: '/ordermanager' })
            const token = result.data.createUser.token;
            localStorage.setItem('token', token);
            bus.$emit('changeLoggedStatus', true)
        }

        else {
            const errorString = result.data.createUser.errors.join(', ')
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
            <label for="firstName">First Name: </label>
            <input v-model="user.firstName" type="text" id="fname" required>

            <label for="lastName">Last Name: </label>
            <input v-model="user.lastName" type="text" id="lname" required>

            <label for="email">Email: </label>
            <input v-model="user.email" type="email" id="email" required>

            <label for="password">Password: </label>
            <input v-model="user.password" type="password" id="password" required>

            <label for="passwordConfirmation">Password Confirmation: </label>
            <input v-model="user.passwordConfirmation" type="password" id="passwordConfirmation" required>

            



            <button class="btn btn-secondary" type="submit">Create User</button>
        </form>

    </div>
</template>

<style>
/* Add your custom styles here */
</style>


