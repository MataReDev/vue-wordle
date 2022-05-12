import { createRouter, createWebHashHistory } from "vue-router";


const routes = [
    { path: '/game', component: () => import('../views/Main.vue') },
    { path: '/score', component: () => import('../views/Score.vue') },
    { path: '/', component: () => import('../views/Home.vue') },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

export default router;