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
            <div class="table w-full p-2" style="color: white">
                <table class="w-full border">
                    <thead>
                    <tr class="bg-gray-50 border-b">
                        <th class="p-2 border-r cursor-pointer text-sm font-thin text-gray-500">
                            <div class="flex items-center justify-center">
                                ID
                            </div>
                        </th>
                        <th class="p-2 border-r cursor-pointer text-sm font-thin text-gray-500">
                            <div class="flex items-center justify-center">
                                Nom
                            </div>
                        </th>
                        <th class="p-2 border-r cursor-pointer text-sm font-thin text-gray-500">
                            <div class="flex items-center justify-center">
                                Mot d'affilé
                            </div>
                        </th>
                    </tr>
                    </thead>
                    <tbody>

                        <tr class="bg-gray-100 text-center border-b text-sm text-gray-600">
                            <td class="p-2 border-r">1</td>
                            <td class="p-2 border-r">MataRed</td>
                            <td class="p-2 border">132</td>
                        </tr>
                        <tr class="bg-gray-100 text-center border-b text-sm text-gray-600">
                            <td class="p-2 border-r">2</td>
                            <td class="p-2 border-r">Frost12</td>
                            <td class="p-2 border-">113</td>
                        </tr>
                        <tr class="bg-gray-100 text-center border-b text-sm text-gray-600">
                            <td class="p-2 border-r">3</td>
                            <td class="p-2 border-r">Rouquetteteam</td>
                            <td class="p-2 border-r">95</td>
                        </tr>

                    </tbody>
                </table>
            </div>
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

<template>
  <form id="search">
    Search <input name="query" v-model="searchQuery">
  </form>
  <DemoGrid
    :data="gridData"
    :columns="gridColumns"
    :filter-key="searchQuery">
  </DemoGrid>
</template>

<style scoped>
.root{
    padding: 0 20px;
}

p {
    font-size: 1.4em;
    margin: 10px 0px;
}
</style>
