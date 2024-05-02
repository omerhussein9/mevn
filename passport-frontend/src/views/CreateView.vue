<script>
    import axios from 'axios'
    import { ref, onMounted } from 'vue'
    import AuthService from '@/services/AuthService'
    import router from '@/router'

    const API_URL = 'http://localhost:3000'
    // const API_URL = 'https://mevn-backend-5aq7.onrender.com'

    export default {
        setup() {
            const events = ref(null)

            const teams = ref(null)

            const leagues = ref(null)

            let token = localStorage.getItem('token') || null
            token = token === null ? null : AuthService.decodeToken(token)

            if(!token || token.role !== 'admin') {
                router.push({ name: 'home' });
            }

            onMounted(async () => {
                try {
                    const eventsResponse = await axios.get(`${API_URL}/api/events`)
                    events.value = eventsResponse.data

                    const teamsResponse = await axios.get(`${API_URL}/api/teams`)
                    teams.value = teamsResponse.data

                    const leaguesResponse = await axios.get(`${API_URL}/api/leagues`)
                    leagues.value = leaguesResponse.data
                } catch(e) {
                    console.error('error with fetching data:', e)
                }
            })

            const selectedTeam1 = ref(null)
            const selectedTeam2 = ref(null)

            const submitEvent = () => {
                let place = document.querySelector('#location').value
                let date = document.querySelector('#date').value
                let time = document.querySelector('#time').value
                let address = document.querySelector('#address').value
                let longitude = document.querySelector('#longitude').value
                let latitude = document.querySelector('#latitude').value

                console.log(selectedTeam1.value, selectedTeam2.value)

                let id = 0

                events.value.forEach(ev => { id++; console.log(ev.type) })

                createEvent(place, date, time, address, selectedTeam1.value.name, selectedTeam2.value.name, longitude, latitude, id)
            }

            async function createEvent(place, date, time, address, team1, team2, longitude, latitude, id) {
                try {
                    console.log('creating team')

                    await axios.post(`${API_URL}/api/events`, {
                        place: place,
                        date: date,
                        time: time,
                        type: id,
                        address: address,
                        team1: team1,
                        team2: team2,
                        longitude: longitude,
                        latitude: latitude,
                        emails: []
                    })


                    alert('Event successfully created.')
                    location.reload()
                } catch(e) {
                    console.error('error with creating event', e)
                }
            }

            const leagueName = ref(null)

            const submitTeam = async () => {
                let name = document.querySelector("#name").value

                try {
                    await axios.post(`${API_URL}/api/teams`, {
                        name: name,
                        league: leagueName.value
                    })

                    if(nw.value) {
                        await axios.post(`${API_URL}/api/leagues`, {
                            name: leagueName.value
                        })
                    }

                    alert('Team created successfully.')
                    location.reload()
                } catch (ex) {
                    console.error('error with creating team', ex)
                }
            }

            const nw = ref(null)

            const existingLeague = () => nw.value = false

            const newLeague = () => nw.value = true

            return {
                submitEvent,
                teams,
                leagues,
                selectedTeam1,
                selectedTeam2,
                submitTeam,
                existingLeague,
                newLeague,
                nw,
                leagueName
            }
        }
    }
</script>

<template>
    <body>
        <div class="section is-flex is-justify-content-left">
            <h1 class="title">Create</h1>
        </div>
        <Suspense>
            <section class="section" style="padding-top: 0px">
            <div class="columns is-centered">
                <div class="column is-half">
                    <form @submit.prevent="submitEvent" class="box">
                        <header class="card-header" style="background-color: skyblue;">
                            <p class="card-header-title">
                                Create Event
                            </p>
                        </header>
                        <div class="field" style="padding-top: 10px;">
                            <div class="text is-flex" style="padding:0px">
                                <strong>Location</strong>
                            </div>
                            <div class="control">
                                <input class="input" id="location" placeholder="" />
                            </div>
                        </div>

                        <div class="field">
                            <div class="text is-flex" style="padding:0px">
                                <strong>Date</strong>
                            </div>
                            <div class="control">
                                <input class="input" id="date" type="date" placeholder="Date" />
                            </div>
                        </div>

                        <div class="field">
                            <div class="text is-flex" style="padding:0px">
                                <strong>Time</strong>
                            </div>
                            <div class="control">
                                <input class="input" id="time" placeholder="" />
                            </div>
                        </div>

                        <div class="field">
                            <div class="text is-flex" style="padding:0px">
                                <strong>Address</strong>
                            </div>
                            <div class="control">
                                <input class="input" id="address" placeholder="" />
                            </div>
                        </div>

                        <div class="control">
                            <div class="text is-flex" style="padding:0px">
                                <strong>Home Team</strong>
                            </div>
                            <div class="select is-flex is-flex-direction-column">
                                <select id="team1" v-model="selectedTeam1">
                                    <option v-for="team in teams" :key="team.id" :value="team">{{ team.name }}</option>
                                </select>
                            </div>
                        </div>

                        <div class="control">
                            <div class="text is-flex" style="padding-top:10px">
                                <strong>Away Team</strong>
                            </div>
                            <div class="select is-flex is-flex-direction-column">
                                <select id="team1" v-model="selectedTeam2">
                                    <option v-for="team in teams" :key="team.id" :value="team">{{ team.name }}</option>
                                </select>
                            </div>
                        </div>

                        <div class="field" style="padding-top:10px">
                            <div class="text is-flex" style="padding:0px">
                                <strong>Longitude</strong>
                            </div>
                            <div class="control">
                                <input class="input" id="longitude" placeholder="" />
                            </div>
                        </div>

                        <div class="field">
                            <div class="text is-flex" style="padding:0px">
                                <strong>Latitude</strong>
                            </div>
                            <div class="control">
                                <input class="input" id="latitude" placeholder="" />
                            </div>
                        </div>

                        <button class="button is-primary">Submit</button>
                    </form>
                </div>
                <div class="column is-half">
                    <form @submit.prevent="submitTeam" class="box">
                        <header class="card-header" style="background-color: skyblue;">
                            <p class="card-header-title">
                                Create Team
                            </p>
                        </header>
                        <div class="field" style="padding-top: 10px">
                            <div class="control">
                                <div class="text is-flex" style="padding:0px">
                                    <strong>Name</strong>
                                </div>
                                <input class="input" id="name" placeholder="" />
                            </div>
                        </div>

                        <div class="control">
                            <label class="radio">
                                <input type="radio" name="answer" @click="existingLeague"/>
                                Use Existing League
                            </label>
                            <label class="radio">
                                <input type="radio" name="answer" @click="newLeague"/>
                                Create New League
                            </label>
                        </div>

                        <div class="content is-flex is-flex-direction-column"  v-show="nw">
                            <div class="text is-flex" style="padding:0px">
                                <strong v-show="nw">League</strong>
                            </div>
                            <input class="input" type="text" id="sorter" v-model="leagueName" v-show="nw">
                        </div>

                        <div class="control" v-show="nw === false" style="padding-bottom: 10px">
                            <div class="text is-flex" style="padding:0px">
                                <strong v-show="nw === false">League</strong>
                            </div>
                            <div class="select is-flex is-flex-direction-column" v-show="nw === false">
                                <select id="league" v-model="leagueName" v-show="nw === false">
                                    <option v-for="league in leagues" :key="league.id" :value="league.name" v-show="nw === false">{{ league.name }}</option>
                                </select>
                            </div>
                        </div>

                        <button class="button is-primary">Submit</button>
                    </form>
                </div>
            </div>
        </section>

        </Suspense>
    </body>
</template>