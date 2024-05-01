<template>
    <div class="section is-flex is-justify-content-left" style="padding-bottom: 0px">
        <h1 class="title">Details</h1>
    </div>
    <Suspense>
        <div class="section" v-for="event in events" :key="event" :value="event" style="padding-top: 0px">
            <div class="card" v-if="event.type === 0">
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

                    <button @click="editEvent" class="button is-primary" style="margin-bottom: 10px">Submit</button>
                </fieldset>
            </div>
        </div>
    </Suspense>
</template>

<script>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import AuthService from '@/services/AuthService'

const API_URL = 'http://localhost:3000'

export default {
    setup() {
        const events = ref(null)
        const ev = ref(null)
        let gotData = false

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

            let local = localStorage.getItem('event')

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
                    type: ev.value.type
                })

                alert('Successfully edited the event.')
                location.reload()
            } catch(ex) {
                console.error('error with patching event', ex)
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
            time
        }
    }
}
</script>