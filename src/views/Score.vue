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
    //gridData: [{"rank":1,"0":1,"name":"MataRed","1":"MataRed","total":132,"2":132},{"rank":2,"0":2,"name":"Frost12","1":"Frost12","total":113,"2":113},{"rank":3,"0":3,"name":"Rouquetteteam","1":"Rouquetteteam","total":89,"2":89},{"rank":4,"0":4,"name":"KxKashi","1":"KxKashi","total":37,"2":37},{"rank":5,"0":5,"name":"Faouzi x Whintali","1":"Faouzi x Whintali","total":25,"2":25},{"rank":6,"0":6,"name":"CubbStar","1":"CubbStar","total":20,"2":20},{"rank":7,"0":7,"name":"dydybaba7","1":"dydybaba7","total":19,"2":19},{"rank":8,"0":8,"name":"p'tit xenon","1":"p'tit xenon","total":19,"2":19},{"rank":9,"0":9,"name":"Erpriex","1":"Erpriex","total":15,"2":15},{"rank":10,"0":10,"name":"HugoBretzel","1":"HugoBretzel","total":13,"2":13}],
    gridData: []
  }),
  mounted () {
       axios.get('https://192.168.42.12/api/playerGetAll.php').then((response)=>{
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
