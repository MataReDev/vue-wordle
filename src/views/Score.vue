<template>
    <div class="root">
        <h1 style="color:gold">Mon score</h1>
        <div style="color: white">
            <p v-for="result in localResult">
                {{result.label}} : {{result.value}}
            </p>
            <p>
                Nombre de partie : {{localTotal}}
            </p>
        </div>

        <h1 style="color:gold">Leaderboard</h1>
        <div>
            <form id="search" style="color: white;">
                Search <input name="query" v-model="searchQuery" style="color:black">
            </form>
            <br>
            <DemoGrid
                :data="gridData"
                :columns="gridColumns"
                :filter-key="searchQuery">
            </DemoGrid>
        </div>
    </div>
    
</template>

<script setup>
    import ScoreManipulation from "../models/scoreManipulation";

    const scoreManipulation = new ScoreManipulation()

    const localResult = scoreManipulation.get();
    const localTotal = $computed(() => scoreManipulation.total);
</script>

<script>
    import DemoGrid from "../components/Grid.vue"
    import axios from 'axios';


    export default {
    components: {
        DemoGrid
    },
    data: () => ({
        //Appel d'api pour récuperér le classement
        searchQuery: '',
        gridColumns: ['rank','name', 'total'],
        gridData: []
    }),
    mounted () {
        axios.get('https://192.168.42.12/api/playerGetAll.php').then(
            (response)=>{
                this.gridData = response.data
            }
        )
    }
    }
</script>


<style scoped>
    .root{
        padding: 0 20px;
    }

    p {
        font-size: 1.4em;
        margin: 10px 0px;
    }
</style>
