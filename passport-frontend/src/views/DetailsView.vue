<template>
    <div class="section is-flex is-justify-content-left" style="padding-bottom: 0px">
        <h1 class="title">Details</h1>
    </div>
    <Suspense>
        <div v-for="event in events" :key="event" :value="event" style="padding-top: 0px">
            <div class="section" v-if="event.type === 0">
                <div class="card">
                    <header class="card-header" style="background-color: skyblue;">
                        <p class="card-header-title">
                            {{ ev.team1 }} and {{ ev.team2 }}
                        </p>
                    </header>

                    <fieldset :disabled="!token || token.role !== 'admin'">
                        <div class="field section" style="padding-bottom: 0px">
                            <div class="text is-flex" style="padding:0px">
                                <strong>Location</strong>
                            </div>
                            <div class="control">
                                <input class="input" id="location" v-model="place"/>
                            </div>
                        </div>

                        <div class="field section" style="padding-bottom: 0px">
                            <div class="text is-flex" style="padding:0px">
                                <strong>Date</strong>
                            </div>
                            <div class="control">
                                <input class="input" id="date" type="date" v-model="date"/>
                            </div>
                        </div>

                        <div class="field section" style="padding-bottom: 0px">
                            <div class="text is-flex" style="padding:0px">
                                <strong>Time</strong>
                            </div>
                            <div class="control">
                                <input class="input" id="time" v-model="time"/>
                            </div>
                        </div>

                        <div class="field section" style="padding-bottom: 0px">
                            <div class="text is-flex" style="padding:0px">
                                <strong>Address</strong>
                            </div>
                            <div class="control">
                                <input class="input" id="address" v-model="address"/>
                            </div>
                        </div>

                        <iframe
                            width="100%"
                            height="400"
                            style="border:0"
                            referrerpolicy="no-referrer-when-downgrade"
                            :src="`https://www.google.com/maps/embed/v1/place?key=AIzaSyC1J8rbjY3B-Y-dzoWU7jl6hAW4jAh-yRk&q=${encodeURIComponent(ev.longitude + ' ' + ev.latitude)}`"
                            allowfullscreen>
                        </iframe>


                        <div class="field section" style="padding-bottom: 0px">
                            <div class="text is-flex" style="padding:0px">
                                <strong>Home Team</strong>
                            </div>
                            <div class="select is-flex is-flex-direction-column">
                                <select id="team1" v-model="selectedTeam1">
                                    <option v-for="team in teams" :key="team.id" :value="team">{{ team.name }}</option>
                                </select>
                            </div>
                        </div>

                        <div class="field section" style="padding-bottom: 0px">
                            <div class="text is-flex" style="padding:0px">
                                <strong>Away Team</strong>
                            </div>
                            <div class="select is-flex is-flex-direction-column">
                                <select id="team1" v-model="selectedTeam2">
                                    <option v-for="team in teams" :key="team.id" :value="team">{{ team.name }}</option>
                                </select>
                            </div>
                        </div>

                        <div class="field section" style="padding-bottom: 0px">
                            <div class="text is-flex" style="padding:0px">
                                <strong>Longitude</strong>
                            </div>
                            <div class="control">
                                <input class="input" id="address" v-model="longitude"/>
                            </div>
                        </div>

                        <div class="field section" style="padding-bottom: 0px">
                            <div class="text is-flex" style="padding:0px">
                                <strong>Latitude</strong>
                            </div>
                            <div class="control">
                                <input class="input" id="address" v-model="latitude"/>
                            </div>
                        </div>
                        <button @click="editEvent" class="button is-primary">Submit</button>
                    </fieldset>

                    <fieldset class="field section" :disabled="!token" style="padding-bottom: 0px; margin-bottom: 10px">
                        <div class="text is-flex" style="padding:0px">
                            <strong>Notify Me</strong>
                        </div>
                        <div class="control" @click="changePreference">
                            <label class="radio">
                                <input type="radio" name="yesno"/>
                                Yes
                            </label>
                            <label class="radio">
                                <input type="radio" name="yesno"/>
                                No
                            </label>
                        </div>
                    </fieldset>
                </div>
            </div>
        </div>
    </Suspense>
</template>

<script>
import axios from 'axios';
import { ref, onMounted, computed } from 'vue';
import { useStore } from 'vuex'
import AuthService from '@/services/AuthService'

const API_URL = 'http://localhost:3000'
// const API_URL = 'https://mevn-backend-5aq7.onrender.com'

export default {
    props: ['eventType'],
    setup(props) {
        const events = ref(null)
        const ev = ref(null)
        let gotData = false
        const looped = ref(false)

        const teams = ref(null)
        const selectedTeam1 = ref(null)
        const selectedTeam2 = ref(null)

        const place = ref(null)
        const time = ref(null)
        const date = ref(null)
        const address = ref(null)
        const longitude = ref(null)
        const latitude = ref(null)

        let token = localStorage.getItem('token') || null
        token = token === null ? null : AuthService.decodeToken(token)

        onMounted(async () => {
            const eventsResponse = await axios.get(`${API_URL}/api/events`)
            events.value = eventsResponse.data

            let local = props.eventType

            events.value.forEach(event => {
                if(event.type + '' === local) {
                    ev.value = event
                    place.value = ev.value.place
                    date.value = ev.value.date
                    address.value = ev.value.address
                    longitude.value = ev.value.longitude
                    latitude.value = ev.value.latitude
                    time.value = ev.value.time
                }
            })

            const teamsResponse = await axios.get(`${API_URL}/api/teams`)
            teams.value = teamsResponse.data

            selectedTeam1.value = teams.value.find(team => team.name === ev.value.team1)
            selectedTeam2.value = teams.value.find(team => team.name === ev.value.team2)

            gotData = true
        })

        const editEvent = async () => {
            try {
                await axios.delete(`${API_URL}/api/events`, {
                    data: {
                        id: ev.value.type
                    }
                })

                await axios.post(`${API_URL}/api/events`, {
                    place: place.value,
                    date: date.value,
                    time: time.value,
                    address: address.value,
                    team1: selectedTeam1.value.name,
                    team2: selectedTeam2.value.name,
                    longitude: longitude.value,
                    latitude: latitude.value,
                    type: ev.value.type,
                    emails: ev.value.emails
                })

                alert('Successfully edited the event.')
                location.reload()
            } catch(ex) {
                console.error('error with patching event', ex)
            }
        }

        const store = useStore()
        const loggedIn = computed(() => store.getters.currentUser)

        const changePreference = async () => {
            try {
                await axios.delete(`${API_URL}/api/events`, {
                    data: {
                        id: ev.value.type
                    }
                })

                let users = ev.value.emails
                users.push(loggedIn.value.email)
                console.log(users)

                await axios.post(`${API_URL}/api/events`, {
                    place: ev.value.place,
                    date: ev.value.date,
                    time: ev.value.time,
                    address: ev.value.address,
                    team1: ev.value.team1,
                    team2: ev.value.team2,
                    longitude: ev.value.longitude,
                    latitude: ev.value.latitude,
                    type: ev.value.type,
                    emails: users
                })
            } catch(ex) {
                console.error(ex)
            }
        }

        return {
            events,
            ev,
            gotData,
            teams,
            selectedTeam1,
            selectedTeam2,
            token,
            editEvent,
            place,
            date,
            address,
            longitude,
            latitude,
            time,
            changePreference,
            looped
        }
    }
}
</script>