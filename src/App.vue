<template>
    <header>
      <router-link to="/" class="flex-center title">
        <img v-if="!isRoot" src="/back.svg" alt="Go Back" class="back">
        <div v-else class="noAction"></div>
        <h1>Vue-Sutom</h1>
      </router-link>
      <div class="flex-center" id="headerContent"></div>
      <script type="module">
        // Import the functions you need from the SDKs you need
        import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.11/firebase-app.js";
        import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.11/firebase-analytics.js";
        // TODO: Add SDKs for Firebase products that you want to use
        // https://firebase.google.com/docs/web/setup#available-libraries

        // Your web app's Firebase configuration
        // For Firebase JS SDK v7.20.0 and later, measurementId is optional
        const firebaseConfig = {
          apiKey: "AIzaSyCtGAruqLN6mTgtQPhOXOf2ew8ZRunIHRo",
          authDomain: "sutom-d5beb.firebaseapp.com",
          databaseURL: "https://sutom-d5beb-default-rtdb.europe-west1.firebasedatabase.app",
          projectId: "sutom-d5beb",
          storageBucket: "sutom-d5beb.appspot.com",
          messagingSenderId: "379194380441",
          appId: "1:379194380441:web:9b0a35b8ff68e98f19e808",
          measurementId: "G-9S4YDBCW80"
        };

        // Initialize Firebase
        const app = initializeApp(firebaseConfig);
        const analytics = getAnalytics(app);
      </script>
    </header>
    <router-view />
</template>

<script lang="ts" setup>
  import { useRoute } from 'vue-router';
  import './css/game.css'

  // Returns the current route location. Equivalent to using $route inside templates.
  const route = useRoute()

  // Is currentRoot the / ?
  const isRoot = $computed(() => route.path == '/')
</script>

<style scoped>
  .title{
    color: black;
    text-decoration: none;
    -webkit-tap-highlight-color: transparent;
  }
</style>
