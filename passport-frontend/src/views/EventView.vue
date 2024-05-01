<script>
import axios from 'axios';
import { ref, onMounted, computed } from 'vue';
import AuthService from '@/services/AuthService'
import router from '@/router'

const API_URL = 'http://localhost:3000'

export default {
  setup() {
    const events = ref(null)
    let hasEvents = ref(false)

    const leagues = ref(null)

    const teams = ref(null)

    let token = localStorage.getItem('token') || null
    token = token === null ? null : AuthService.decodeToken(token)
    
    onMounted(async () => {
      try {
        const eventResp = await axios.get(`${API_URL}/api/events`)
        events.value = eventResp.data

        if(eventResp.data.length === 0)
          hasEvents.value = true

        const leagueResp = await axios.get(`${API_URL}/api/leagues`)
        leagues.value = leagueResp.data

        const teamResp = await axios.get(`${API_URL}/api/teams`)
        teams.value = teamResp.data
      } catch (e) {
        console.error('error with getting the data, this is the error: ', e)
      }
    })

    const selectedLeague = ref(null)
    selectedLeague.value = "---------"

    const selectedTeam = ref(null)
    selectedTeam.value = "---------"

    const searchPlace = ref(null)

    const filteredEvents = computed(() => {
      let filtered = ref(null), p = false
      if (selectedLeague.value && selectedLeague.value !== "---------") {
        filtered.value = filterByLeague(events)
        p = true
      }
      if(selectedTeam.value && selectedTeam.value !== "---------") {
        filtered.value = filterByTeam(p ? filtered : events)
        p = true
      }
      if(searchPlace.value) {
        filtered.value = filterByPlace(p ? filtered : events)
        p = true
      }

      return p ? filtered.value : events.value
    });

    const filterByLeague = (ev) => {
      return ev.value.filter(event => {
          return teams.value.some(team => {
            return team.league === selectedLeague.value.name && (team.name === event.team1 || team.name === event.team2);
          });
      });
    }

    const filterByTeam = (ev) => {
      return ev.value.filter(event => {
        return teams.value.some(team => {
          return team.name === selectedTeam.value.name && (team.name === event.team1 || team.name === event.team2)
        })
      })
    }

    const filterByPlace = (ev) => {
      return ev.value.filter(event => {
        return event.place.toLowerCase().indexOf(searchPlace.value.toLowerCase()) > -1
      })
    }

    let deleting = ref(false)

    const deleteEvents = () => {
      deleting.value = !deleting.value
    }

    const del = async (ev) => {
      console.log('we are deleting the event that has teams', ev.team1, ev.team2)
      try {
        await axios.delete(`${API_URL}/api/events`, {
          data: {
            place: ev.place,
            date: ev.date,
            time: ev.time,
            address: ev.address,
            team1: ev.team1,
            team2: ev.team2,
            role: token.role
          }
        })

        alert('Successfully deleted event.')
        location.reload()
      } catch(ex) {
        console.error('error deleting events,', ex)
      }
    }

    const sendToDetails = (ev) => {
      localStorage.setItem('event', ev.type)
      router.push({ name: 'details' })
    }

    return {
      events,
      hasEvents,
      leagues,
      teams,
      selectedLeague,
      selectedTeam,
      searchPlace,
      filteredEvents,
      filterByLeague,
      filterByTeam,
      filterByPlace,
      token,
      deleteEvents,
      deleting,
      del,
      sendToDetails
    }
  }
}
</script>

<template>
  <body>
    <div class="section is-flex is-justify-content-left">
      <h1 class="title">Events</h1>
    </div>

    <Suspense>
      <section style="padding-left: 25px; padding-right: 25px">
        <div class="card">
          <header class="card-header" style="background-color: skyblue;">
            <p class="card-header-title">
              Filter by
            </p>
          </header>
          <div class="card-content is-flex is-justify-content-left">

            <div class="content is-flex is-flex-direction-column" style="padding: 5px">
              <div class="text is-flex" style="padding:0px">
                <strong>League</strong>
              </div>
              <div class="select" style="padding: 0px">
                <select v-model="selectedLeague" id="sorter">
                  <option value="---------">---------</option>
                  <option v-for="league in leagues" :key="league.id" :value="league">{{ league.name }}</option>
                </select>
              </div>
            </div>

            <div class="content is-flex is-flex-direction-column" style="padding: 5px">
              <div class="text is-flex" style="padding:0px">
                <strong>Team</strong>
              </div>
              <div class="select" style="padding: 0px">
                <select v-model="selectedTeam" id="sorter">
                  <option value="---------">---------</option>
                  <option v-for="team in teams" :key="team.id" :value="team">{{ team.name }}</option>
                </select>
              </div>
            </div>

            <div class="content is-flex is-flex-direction-column" style="padding: 5px">
              <div class="text is-flex" style="padding:0px">
                <strong>Location</strong>
              </div>
                <input class="input" type="text" v-model="searchPlace" id="sorter">
            </div>

          </div>
        </div>
      </section>
    </Suspense>

    <Suspense>  
      <section style="padding-left: 20px; padding-right: 20px">
        <div class="columns is-multiline" style="padding: 5px; padding-top: 10px">
          <div class="column is-half" v-for="event in filteredEvents" :key="event">
            <div class="card" style="padding: 5px">
              <a @click="sendToDetails(event)" style="color: black">
                <div class="card-content">
                  <header class="card-header custom-header is-flex is-align-items-center">
                    <p class="card-header-title" style="color: black; padding-top: 5px">
                      {{ event.team1 }} and {{ event.team2 }}
                    </p>
                    <div class="delete" v-show="deleting" @click="del(event)"></div>
                  </header>
                  
                  <div class="content">
                    {{ event.place }}, {{ event.address }}
                  </div>
                  <div class="content">
                    {{ event.date }} at {{ event.time }}
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>

        <div class="button is-danger" v-if="token !== null && token.role === 'admin'" style="padding-bottom: 10px;" @click="deleteEvents">
          Delete Events (Admin Only)
        </div>
      </section>
    </Suspense>
  </body>
</template>

<style>
.custom-header {
  background-color: skyblue;
  border-radius: 6px 6px 0 0; /* Rounded corners only at the top */
}
</style>
