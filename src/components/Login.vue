<template>
    <div class="login-container">
        <h2>Login</h2>
        <form @submit.prevent="login">
            <div class="form-group">
                <label for="email">E-mail:</label>
                <input type="email" id="email" v-model="email" required />
            </div>

            <div class="form-group">
                <label for="password">Password:</label>
                <input type="password" id="password" v-model="password" required />
            </div>

            <button type="submit">Login</button>
        </form>

        <div class="actions">
            <button @click="recoverPassword">Recover Password</button>
            <button @click="showCreateAccountForm">Create an Account</button>
        </div>

        <div v-if="showCreateAccount">
            <h3>Create Account</h3>
            <form @submit.prevent="createAccount">
                <div class="form-group">
                    <label for="name">Name:</label>
                    <input type="text" id="name" v-model="newUser.name" required />
                </div>

                <div class="form-group">
                    <label for="email">E-mail:</label>
                    <input type="email" id="newEmail" v-model="newUser.email" required />
                </div>

                <div class="form-group">
                    <label for="phone">Phone:</label>
                    <input type="tel" id="phone" v-model="newUser.phone" required />
                </div>

                <div class="form-group">
                    <label for="birthdate">Birthdate:</label>
                    <input type="date" id="birthdate" v-model="newUser.birthdate" required />
                </div>

                <div class="form-group">
                    <label for="picture">Profile Picture URL:</label>
                    <input type="url" id="picture" v-model="newUser.picture" required />
                </div>

                <div class="form-group">
                    <label for="newPassword">Password:</label>
                    <input type="password" id="newPassword" v-model="newUser.password" required />
                </div>

                <button type="submit">Create Account</button>
            </form>
        </div>
    </div>
</template>

<script setup>
    import { inject } from 'vue';
    import axios from 'axios';
    import { useRouter } from 'vue-router';
    import { jwtDecode } from 'jwt-decode';

    const router = useRouter();
    const username = inject('username');

    const login = async () => {
        try {
            const response = await axios.post('http://localhost:8080/api/digital-pec/authenticate', {
                username: email.value,
                password: password.value,
            });

            const token = response.headers['authorization'];
            if (token) {
                localStorage.setItem('authToken', token);

                const decoded = jwtDecode(token);
                localStorage.setItem('name', decoded.name);

                // Update the username reactive variable
                username.value = decoded.name;

                router.push({ name: 'Home' });
            } else {
                console.error('Authorization token not found in headers');
            }
        } catch (error) {
            console.error('Login failed:', error);
        }
    };
</script>

<style scoped>
    .login-container {
        width: 300px;
        margin: 0 auto;
        padding: 20px;
        border: 1px solid #ccc;
        border-radius: 8px;
    }

    .form-group {
        margin-bottom: 15px;
    }

    .actions {
        margin-top: 15px;
        display: flex;
        justify-content: space-between;
    }

    button {
        padding: 8px 12px;
        border: none;
        background-color: #007bff;
        color: white;
        cursor: pointer;
        border-radius: 4px;
    }

    button:hover {
        background-color: #0056b3;
    }
</style>