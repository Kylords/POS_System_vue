<script setup>
import { defineEmits, ref, watch, onMounted, inject } from 'vue';
const change = defineEmits(['changeLogged']);

import LogoutUser from './LogoutUser.vue';
const props = defineProps(['userInfo', 'logged'])



function logOut() {
    change('changeLogged', false)
}

const token = localStorage.getItem('token');

const checkLogged = ref(token !== '' && token !== null);

watch(checkLogged, (newValue) => {
    console.log(newValue)
})

const bus = inject(['$bus'])


onMounted(() => {
    bus.$on('changeLoggedStatus', (value) => {
        checkLogged.value = value
    })


})


</script>

<template>
    <nav :class="[`navbar-dark`, `bg-dark`, 'navbar', 'navbar-expand-lg']">
        <div class="container-fluid">
            <a class="navbar-brand" href="">My Vue</a>
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">

               


                






            </ul>

            
            <ul  v-if="checkLogged" class="navbar-nav mb-2 mb-lg-0">
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"
                        aria-expanded="false">
                        Admin Menu
                    </a>
                    <ul class="dropdown-menu">
                        <li>
                            <router-link to="/ordermanager" class="drop-link nav-link" active-class="emphasize"
                                >Order Manager</router-link>
                        </li>
                        <li>
                            <router-link to="/productmanager" class="drop-link nav-link" active-class="emphasize"
                                >Product Manager</router-link>
                        </li>
                        <li>
                            <router-link to="/deliverymanager" class="drop-link nav-link" active-class="emphasize"
                                >Delivery Manager</router-link>
                        </li>
                        <li>
                            <router-link to="/paymentmanager" class="drop-link nav-link" active-class="emphasize"
                                >Payment Manager</router-link>
                        </li>
                       
                    </ul>
                </li>
            </ul>
            
            
            <ul v-if="checkLogged" class="navbar-nav">
                <li>
                    <LogoutUser :logOut="logOut" />
                </li>
            </ul>

            <ul v-else class="navbar-nav">
                <li>
                    <router-link to="/register" class="nav-link" active-class="active emphasize"
                        aria-current="page">Register</router-link>
                </li>
                <li>
                    <router-link to="/login" class="nav-link" active-class="active emphasize"
                        aria-current="page">Login</router-link>
                </li>
                
            </ul>

        </div>

    </nav>
</template>

<style scoped>
.emphasize {
    text-decoration: underline;
}

.drop-link {
    text-decoration: none;
    color: gray;
}

.drop-link:hover {
    text-decoration: underline;
    color: black;
    background-color: aliceblue;
    border-radius: 5%;
}
</style>
