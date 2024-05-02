<template>
    <body>
        <div class="section is-flex is-justify-content-left">
            <h1 class="title">Delete</h1>
        </div>
        <Suspense>
            <div class="section">
                <div class="columns">
                    <div class="column">
                        <form class="box" @submit.prevent="deleteTeam">
                            <header class="card-header" style="background-color: skyblue;">
                                <p class="card-header-title">
                                    Delete Team
                                </p>
                            </header>

                            <div class="control">
                                <div class="text is-flex" style="padding-top:10px">
                                    <strong>Team</strong>
                                </div>
                                <div class="select is-flex is-flex-direction-column">
                                    <select id="team" v-model="selectedTeam">
                                        <option v-for="team in teams" :key="team.id" :value="team">{{ team.name }}</option>
                                    </select>
                                </div>
                            </div>

                            <div style="padding-top: 10px"></div>
                            <button class="button is-danger">Delete</button>
                        </form>
                    </div>

                    <div class="column">
                        <form class="box" @submit.prevent="deleteLeague">
                            <header class="card-header" style="background-color: skyblue;">
                                <p class="card-header-title">
                                    Delete League
                                </p>
                            </header>

                            <div class="control">
                                <div class="text is-flex" style="padding-top:10px">
                                    <strong>League</strong>
                                </div>
                                <div class="select is-flex is-flex-direction-column">
                                    <select id="league" v-model="selectedLeague">
                                        <option v-for="league in leagues" :key="league.id" :value="league">{{ league.name }}</option>
                                    </select>
                                </div>
                            </div>

                            <div style="padding-top: 10px"></div>
                            <button class="button is-danger">Delete</button>
                        </form>
                    </div>
                </div>
            </div>
        </Suspense>
    </body>
</template>


<script>
    import axios from 'axios'
    import { ref, onMounted } from 'vue'
    import AuthService from '@/services/AuthService'
    import router from '@/router'

    const API_URL = 'http://localhost:3000'

    export default {
        setup() {
            const teams = ref(null)
            const leagues = ref(null)

            let token = localStorage.getItem('token') || null
            token = token === null ? null : AuthService.decodeToken(token)

            if(!token || token.role !== 'admin') {
                router.push({ name: 'home' });
            }

            onMounted(async () => {
                try {
                    const teamsResponse = await axios.get(`${API_URL}/api/teams`)
                    teams.value = teamsResponse.data

                    const leaguesResponse = await axios.get(`${API_URL}/api/leagues`)
                    leagues.value = leaguesResponse.data
                } catch(ex) {
                    console.error('error with fetching data: ' + ex)
                }
            })

            const selectedTeam = ref(null)

            // const teamWarning = ref(null)
            // teamWarning.value = false

            const deleteTeam = async ({ team }) => {
                // if(!teamWarning.value) {
                //     teamWarning.value = true
                //     return
                // }

                const t = ref(null)
                t.value = team ? team : selectedTeam.value

                console.log('deleting team with name and league:', t.value.name, t.value.league)

                try {
                    await axios.delete(`${API_URL}/api/teams`, {
                        data: {
                            name: t.value.name,
                            league: t.value.league ? t.value.league : "NO LEAGUES HERE SORRY GUYS GGS MAN THIS PROJECT IS SO GOOD HOPEFULLY NO ONE CALLS THEIR LEAGUE THIS"
                        }
                    })

                    await axios.delete(`${API_URL}/api/events`, {
                        data: {
                            team1: t.value.name
                        }
                    })

                    await axios.delete(`${API_URL}/api/events`, {
                        data: {
                            team2: t.value.name
                        }
                    })

                    alert(`Successfully deleted team ${t.value.name}.`)
                } catch(ex) {
                    console.error('error deleting team', ex)
                }
            }

            const selectedLeague = ref(null)

            const deleteLeague = async () => {
                const arr = []

                console.log('deleting league with name:', selectedLeague.value.name)

                try {
                    teams.value.forEach(team => {
                        if(team.league === selectedLeague.value.name) {
                            arr.push(team)
                            console.log('added to array')
                        }
                    })

                    while(arr.length > 0) {
                        deleteTeam({ team: arr[arr.length - 1] })

                        arr.pop()

                        console.log('deleted from array')
                    }

                    await axios.delete(`${API_URL}/api/leagues`, {
                        data: {
                            name: selectedLeague.value.name
                        }
                    })

                    alert(`Successfully deleted league ${selectedLeague.value.name}.`)
                } catch(ex) {
                    console.error('error deleting league', ex)
                }
            }

            return {
                teams,
                leagues,
                selectedTeam,
                // teamWarning,
                deleteTeam,
                selectedLeague,
                deleteLeague,
            }
        }
    }
</script>