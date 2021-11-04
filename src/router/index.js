import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [{
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/schedule-appointment',
    name: 'ScheduleAppointment',
    component: () => import('../views/ScheduleAppointment.vue'),
    props: {
      month: "October",
      year: 2021,
    }
  },
  {
    path: '/influencers',
    name: 'Influencers',
    component: () => import('../views/Influencers.vue'),
  },
  {
    path: '/schedule/:id',
    name: 'Schedule',
    component: () => import('../views/Schedule.vue'),
    props: {
      month: "October",
      year: 2021,
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router