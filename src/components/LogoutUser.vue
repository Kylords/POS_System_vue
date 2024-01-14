<script setup>
import { onMounted, ref, inject } from 'vue';
import { useMutation } from '@vue/apollo-composable';
import gql from 'graphql-tag'
import { useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps(['logOut'])

const bus = inject(['$bus'])





const LOGOUT_MUTATION = gql`
  mutation logoutUser($input: LogoutUserInput!) {
    logoutUser(input: $input) {
      success
      errors
      
    }
  }
`;

const { mutate: logoutUser } = useMutation(LOGOUT_MUTATION)

async function logout() {

    try {
        const result = await logoutUser({ input: {  } })

        if (result.data.logoutUser.errors == 0) {
            router.push({ path: '/login' })
            localStorage.setItem('token', '');
            props.logOut()
            bus.$emit('changeLoggedStatus', false)
        }

        else {
            const errorString = result.data.logoutUser.errors.join(', ');

            console.log(errorString)
        }

    }

    catch (error) {
        console.error('Logout error:', error);
    }


}

</script>

<template>
    <form @submit.prevent="logout">

        <button type="submit" class="btn btn-danger btn-sm">Logout</button>
    </form>
</template>