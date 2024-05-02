<template>
    <div class="login-container card" style="margin-top: 10%">
      <header class="card-header" style="background-color: skyblue;">
        <strong style="padding: 10px">Login</strong>
      </header>
      <form @submit.prevent="login" class="is-flex is-flex-direction-column">
        <div class="form-group" style="padding-top: 10px">
          <strong for="email">Email</strong>
          <input type="email" id="email" v-model="email" required>
        </div>
        <div class="form-group">
          <strong for="password">Password</strong>
          <input type="password" id="password" v-model="password" required>
        </div>
        <button type="submit" class="button is-primary">Login</button>
      </form>
      <p v-if="loginError" class="error-message">{{ loginError }}</p>
    </div>
  </template>
  
  <script>
  import { mapActions } from 'vuex';

  export default {
    data() {
      return {
        email: '',
        password: '',
        loginError: null
      };
    },
    methods: {
      ...mapActions(['loginUser']),
      async login() {
        try {
          
          // await this.loginUser({ email: this.email, password: this.password });
          await this.$store.dispatch('loginUser', { email: this.email, password: this.password });

          // If login successful, redirect to dashboard or desired page
          this.$router.push({ name: 'home' });
        } catch (error) {
          this.loginError = 'Failed to login. Please check your credentials and try again.';
        }
      }
    },
    computed: {
      isLoggedIn() {
        
        // Access the isLoggedIn state from Vuex store or local component state
        return this.$store.state.user.isLoggedIn; // Example for Vuex
      }
    }
  };
  </script>
  
  <style scoped>
  .login-container {
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  
  input[type="email"],
  input[type="password"] {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  
  .error-message {
    color: red;
  }
  </style>
  