<template>
    <div class="root">
        <h1>Mon score</h1>
        <div>
            <p v-for="result in localResult">
                {{result.label}} : {{result.value}}
            </p>
            <p>
                Nombre de partie : {{localTotal}}
            </p>
        </div>

        <h1>Leaderboard</h1>
        <div>
            <p>Prochainement</p>
        </div>
    </div>
</template>

<script lang="ts" setup>
import ScoreManipulation from "../models/scoreManipulation";

const scoreManipulation = new ScoreManipulation()

const localResult = scoreManipulation.get();
const localTotal = $computed(() => scoreManipulation.total);
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
