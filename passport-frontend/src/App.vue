<template>
  <nav class="navbar" role="navigation" aria-label="main navigation" style="padding: 5px; background-color: #defbfc;">
    <div class="navbar-brand">
      <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false" data-target="sportnav">
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>
    <div class="navbar-menu" id="sportnav"> 
      <div class="navbar-start">
        <router-link class="navbar-item" to="/">Home</router-link>
        <router-link class="navbar-item" to="/events">Events</router-link>
        <router-link class="navbar-item" to="/create" v-show="token && token.role === 'admin'">Create</router-link>
        <router-link class="navbar-item" to="/delete" v-show="token && token.role === 'admin'">Delete</router-link>
      </div>

      <div class="navbar-end">
        <div class="navbar-item">
          <div class="buttons is-flex is-justify-content-center">
            <div class="button is-info" to="/login">
              <router-link v-if="!isLoggedIn" to="/login">
                <strong style="color: navy">Login</strong>
              </router-link>
              <strong v-else @click="logout" style="color: navy">Logout</strong>
            </div>
            <div class="button is-link is-dark">
              <router-link to="/register"><strong style="color: navy">Register</strong></router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>

  <div class="line" style="height: 3px; background-color: #eee;"></div>
  <router-view/>
</template>
<script>
  import { mapActions } from 'vuex';
  import AuthService from '@/services/AuthService'

  export default {
    setup() {
      let token = localStorage.getItem('token') || null
      token = token === null ? null : AuthService.decodeToken(token)

      return {
        token
      }
    },
    computed: {
      isLoggedIn() {
        
        // Access the isLoggedIn state from Vuex store or local component state
        return this.$store.state.user.isLoggedIn; // Example for Vuex
      },
      username() {
        // Optionally, you can display the username if available
        return this.$store.state.user.username; // Example for Vuex
      }
    },
    methods: {
      ...mapActions(['logoutUser']),
      async logout() {
        try {
          await this.$store.dispatch('logoutUser')

          this.$router.push({ name: 'home' })
          location.reload()
        } catch(ex) {
          console.error('error with logging out: ' + ex)
        }
      }
    }
  };

  document.addEventListener('DOMContentLoaded', () => {

  // Get all "navbar-burger" elements
  const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);

  // Add a click event on each of them
  $navbarBurgers.forEach( el => {
    el.addEventListener('click', () => {

      // Get the target from the "data-target" attribute
      const target = el.dataset.target;
      const $target = document.getElementById(target);

      // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
      el.classList.toggle('is-active');
      $target.classList.toggle('is-active');

    });
  });

  });
</script>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}
</style>
