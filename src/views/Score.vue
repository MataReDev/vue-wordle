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
    <div id="app">
        <h1>Bitcoin Price Index</h1>
        <div
            v-for="currency in info"
            class="currency"
        >
            {{ currency.description }}:
            <span class="lighten">
            <span v-html="currency.symbol"></span>{{ currency.rate_float | currencydecimal }}
            </span>
        </div>
    </div>
    
    <div id="app2" style="color:white">
    {{ info }}
    </div>
</template>

<script setup>
import ScoreManipulation from "../models/scoreManipulation";

const scoreManipulation = new ScoreManipulation()

const localResult = scoreManipulation.get();
const localTotal = $computed(() => scoreManipulation.total);

new Vue({
  el: '#app2',
  data () {
    return {
      info: null
    }
  },
  mounted () {
    axios
      .get('https://api.coindesk.com/v1/bpi/currentprice.json')
      .then(response => (this.info = response))
  }
})
</script>

<script>
import DemoGrid from "../components/Grid.vue"

export default {
  components: {
    DemoGrid
  },
  data: () => ({
      //Appel d'api pour récuperér le classement
    searchQuery: '',
    gridColumns: ['Rank','name', 'total'],
    gridData: [
      { Rank: '1', name: 'MataRed', total: 132},
      { Rank: '2', name: 'Frost12', total: 113 },
      { Rank: '3', name: 'Rouquetteteam', total: 93 },
    ]
  })
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
