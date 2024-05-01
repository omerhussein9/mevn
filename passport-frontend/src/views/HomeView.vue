<template>
    <div class="section is-flex is-justify-content-left">
      <h1 class="title">Home</h1>
    </div>

  <div class="columns is-centered" style="padding-left: 25px; padding-right: 25px;">
    <div class="column is-one-quarter" v-if="token !== null && token.role === 'user'"></div>
    <div class="column is-one-half">
      <div class="card" style="background-color: skyblue;">
        <router-link to="/events">
          <div class="card-image">
            <figure class="image is-4by3">
              <img src="../assets/soccer-field.jpg" alt="Placeholder image">
            </figure>
          </div>
          <div class="card-content">
            <div class="media">
              <div class="media-content">
                <p class="title is-4">Events</p>
              </div>
            </div>
            <div class="content">
              See all of the upcoming sport events in your area.
            </div>
          </div>
        </router-link>
      </div>
    </div>
    <div class="column is-one-quarter" v-if="token !== null && token.role === 'user'"></div>

    <div class="column is-one-half" v-show="!token">
      <div class="card" style="background-color: skyblue;">
        <router-link to="/login">
          <div class="card-image">
            <figure class="image is-4by3">
              <img src="https://www.investopedia.com/thmb/ECsOoFZRndwomnBqK-rkNZHAPHw=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-1489016138-b69c82ea8e044ad78514797af9882740.jpg" alt="Placeholder image">
            </figure>
          </div>
          <div class="card-content">
            <div class="media">
              <div class="media-content">
                <p class="title is-4">Login</p>
              </div>
            </div>
            <div class="content">
              Login to access more features.
            </div>
          </div>
        </router-link>
      </div>
    </div>

    <div class="column is-one-half" v-show="token !== null && token.role === 'admin'">
      <div class="card" style="background-color: skyblue;">
        <router-link to="/create">
          <div class="card-image">
            <figure class="image is-4by3">
              <img src="https://www.investopedia.com/thmb/ECsOoFZRndwomnBqK-rkNZHAPHw=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-1489016138-b69c82ea8e044ad78514797af9882740.jpg" alt="Placeholder image">
            </figure>
          </div>
          <div class="card-content">
            <div class="media">
              <div class="media-content">
                <p class="title is-4">Admin</p>
              </div>
            </div>
            <div class="content">
              Create and manage local sporting events, teams and leagues.
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
  import AuthService from '@/services/AuthService'
  
  export default {
    setup() {
      let token = localStorage.getItem('token') || null
      token = token === null ? null : AuthService.decodeToken(token)

      return {
        token
      }
    }
  }
</script>