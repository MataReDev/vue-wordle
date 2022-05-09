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
            <form id="search">
                Search <input name="query" v-model="searchQuery">
            </form>
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

import DemoGrid from "../components/Grid.vue"

export default {
  components: {
    DemoGrid
  },
  data: () => ({
    searchQuery: '',
    gridColumns: ['Rank','name', 'maximum'],
    gridData: [
      { Rank: '1', name: 'MataRed', maximum: 132},
      { Rank: '2', name: 'Frost12', maximum: 113 },
      { Rank: '3', name: 'Rouquetteteam', maximum: 93 },
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
