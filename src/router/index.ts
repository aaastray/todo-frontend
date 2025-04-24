import { createRouter, createWebHistory } from 'vue-router'
import AllToDos from "@/components/Lists/AllToDos.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: AllToDos,
    },
  ],
})

export default router
