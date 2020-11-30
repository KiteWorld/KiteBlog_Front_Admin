import Vue from 'vue'
import VueRouter from 'vue-router'
import Main from '../views/Main.vue'
import Cookies from 'js-cookie'

Vue.use(VueRouter)

const routes = [{
    path: '/',
    name: 'Main',
    component: Main,
    children: [{
      path: '/dashboard',
      name: 'Dashboard',
      component: () => import('../views/Dashboard')
    }, {
      path: '/user',
      name: 'User',
      component: () => import('../views/User')
    }]
  },
  {
    path: '/adminLogin',
    name: 'Login',
    component: () => import('../views/Login')
  }
]


const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.name == "Login" && Cookies.get('token')) {
    next({
      name: 'Main'
    })
  } else if (to.name != "Login" && !Cookies.get('token')) {
    next({
      name: "Login"
    })
  }
  next()
})

export default router