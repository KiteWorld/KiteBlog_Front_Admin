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
      //不等于 Main 表示,路径为"/"时 
      if (x.component !== "Main") {
        const router = {
          path: '/',
          component: Main,
          children: [x]
        }
        if (x.name == "Dashboard") router.redirect = '/dashboard'
        routerListResolve.push(router)
      } else {
        routerListResolve.push(x)
      }
    }
    if (x.meta.isAffix) store.dispatch("tagsView/addVisitedView", x);
    //直接写成 x.component = () => import(`@/views/${x.component}`) webpack 无法解析
    const component = x.component;
    x.component = () => import(`@/views/${component}`)
    if (x.children && x.children.length > 0) {
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
        let routerList
        routerList = (await queryRouter()).data.dataList
        // routerList.push({
        //   path: 'http://baidu.com/',
        //   component: Main,
        //   children: [],
        //   meta: {
        //     isExternal: true,
        //     level: 1,
        //     icon: "el-icon-edit",
        //     title: "外链",
        //     target: '_blank'
        //   }
        // })
        await store.dispatch('permission/addRouterList', routerList)
        getRoutes(JSON.parse(JSON.stringify(routerList)))
        console.log(routerListResolve)
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