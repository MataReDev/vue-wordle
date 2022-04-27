// @ts-ignore

import { createApp } from 'vue'
import router from './router'
import App from './App.vue'

// resize for scaling the board size
window.addEventListener('resize', onResize)
// set size on startup
onResize()

function onResize() {
  // get actual vh on mobile
  document.body.style.setProperty('--vh', window.innerHeight + 'px')

createApp(App)
  .use(router)
  .mount('#app')
