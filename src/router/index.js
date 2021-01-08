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
      },
      {
        path: '/user',
        name: 'User',
        component: () => import('../views/User')
      },
      {
        path: '/articleCategory',
        name: 'ArticleCategory',
        component: () => import('../views/ArticleCategory')
      },
      {
        path: '/hotPointCategory',
        name: 'HotPointCategory',
        component: () => import('../views/HotPointCategory')
      },
      {
        path: '/templateCategory',
        name: 'TemplateCategory',
        component: () => import('../views/TemplateCategory')
      },
      {
        path: '/article',
        name: 'Article',
        component: () => import('../views/Article')
      },
      {
        path: '/articleconfig',
        name: 'ArticleConfig',
        component: () => import('../views/ArticleConfig')
      },
      {
        path: '/hotPoint',
        name: 'HotPoint',
        component: () => import('../views/HotPoint')
      },
      {
        path: '/editor',
        name: 'Editor',
        component: () => import('../views/Editor')
      }
    ]
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