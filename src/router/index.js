import Vue from 'vue'
import Router from 'vue-router'
import iView from 'iview'
import store from '../store/index'
import VueCookies from 'vue-cookies'

import {
  routers
} from './router'

Vue.use(Router)
const createRouter = () => new Router({
  // mode: 'history',
  mode: process.env.NODE_ENV === 'production' ? 'history' : 'hash',
  routes: routers
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher
}
export default router
