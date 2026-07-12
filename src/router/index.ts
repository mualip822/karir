import { createRouter, createWebHistory } from 'vue-router'


import LandingPage from '../website/views/LandingPage.vue'


import authRoutes from '../auth/routes'

import rekrutmenRoutes from '../rekrutmen/routes'



const routes = [

  // WEBSITE
  {
    path: '/',
    name: 'landing',
    component: LandingPage,
  },


  // AUTH
  ...authRoutes,


  // REKRUTMEN
  ...rekrutmenRoutes,

]



const router = createRouter({

  history: createWebHistory(),

  routes,

})


// cek route masuk
console.log(
  router.getRoutes()
    .map(r => r.name)
)



export default router