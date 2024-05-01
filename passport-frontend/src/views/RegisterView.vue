<template>
    <div class="login-container card" style="margin-top: 10%">
      <header class="card-header" style="background-color: skyblue;">
        <strong style="padding: 10px">Register</strong>
      </header>
      <form @submit.prevent="register" class="is-flex is-flex-direction-column">
        <div class="form-group" style="padding-top: 10px">
          <strong for="email">Email</strong>
          <input type="email" id="email" v-model="email" required>
        </div>
        <div class="form-group">
          <strong for="password">Password</strong>
          <input type="password" id="password" v-model="password" required>
        </div>
        <button type="submit" class="button is-primary">Create Account</button>
      </form>
      <p v-if="loginError" class="error-message">{{ loginError }}</p>
      <p v-if="loginSuccessful">{{ loginSuccessful }}</p>
    </div>
  </template>
  
  <script>
  import { mapActions } from 'vuex';

  export default {
    data() {
      return {
        email: '',
        password: '',
        loginError: null,
        loginSuccessful: null
      };
    },
    methods: {
      ...mapActions(['registerUser']),
      ...mapActions(['loginUser']),
      async register() {
        try {         
          // await this.loginUser({ email: this.email, password: this.password });
          await this.$store.dispatch('registerUser', { email: this.email, password: this.password, role: 'user' });

          await this.$store.dispatch('loginUser', { email: this.email, password: this.password });

          this.loginSuccessful = 'Registered account successfully and logged in as ' + this.email + '.'
        } catch (error) {
          this.loginError = 'Failed to register, user already exists.';
        }
      },
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
  