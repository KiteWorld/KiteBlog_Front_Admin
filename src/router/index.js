import Vue from 'vue'
import VueRouter from 'vue-router'
import Cookies from 'js-cookie'
import store from '@/store'
import {
  queryRouter
} from "@/api/api";
import Main from '@/views/Main'

Vue.use(VueRouter)

const routes = [{
  path: '/adminLogin',
  name: 'Login',
  component: () => import('../views/Login')
}]

const router = new VueRouter({
  routes
})

//存放处理后的路由
const routerListResolve = []

//整理路由数据
const getRoutes = (routerList) => {
  routerList.forEach(x => {
    if (x.meta.level == 1) {
      x.path = "/" + x.path
      if (x.component !== "Main") {
        const router = {
          path: '/',
          name: 'Main_' + x.name,
          component: Main,
          children: [x]
        }
        if (x.name == "Dashboard") router.redirect = '/dashboard'
        if (x.meta.isAffix) store.dispatch("tagsView/addVisitedView", x);
        routerListResolve.push(router)
      } else {
        routerListResolve.push(x)
      }
    }
    //直接写成 x.component = () => import(`@/views/${x.component}`) webpack 无法解析
    const component = x.component;
    x.component = () => import(`@/views/${component}`)
    if (x.children.length > 0) {
      getRoutes(x.children)
    }
  })
}

router.beforeEach(async (to, from, next) => {
  if (Cookies.get('token')) {
    if (to.path === '/adminLogin') {
      next({
        path: '/'
      })
    } else {
      if (store.state.permission.routerList.length !== 0) {
        next()
      } else {
        let routerList = (await queryRouter()).data.dataList
        store.dispatch('permission/addRouterList', routerList)
        getRoutes(routerList)
        router.addRoutes(routerListResolve)
        next({
          ...to,
          replace: true
        })

      }
    }
  } else {
    //避免死循环
    if (to.path === '/adminLogin') {
      next()
    } else {
      next({
        name: "Login"
      })
    }
  }
})

export default router