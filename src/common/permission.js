import router from '@/router'
import iView from 'iview'
import store from '@/store/index'
import VueCookies from 'vue-cookies'
import Main from '@/components/main'

// //防止页面刷新路由失效
router.beforeEach(async (to, from, next) => {
  iView.LoadingBar.start()
  VueCookies.set('activeName', to.meta.belongTab)
  store.dispatch('setActiveNameAction', to.meta.belongTab)
  store.dispatch('setOpenNameAction', to.meta.openName)
  let userToken = VueCookies.get('xiaojingToken')
  let userId = VueCookies.get('userId')
  console.log(VueCookies)
  if (userToken) { // 本地获取了token说明用户登录过了
    if (!store.state.userId) { // vuex中没有获取userId,说明是刷新,就需要去动态加载路由
      store.dispatch('setUserIdAction', userId)
      await store.dispatch('getApi') // 获取权限
      store.dispatch('formaterRouterHandle') // 根据权限获取路由
      router.addRoutes([{
        path: '/main',
        name: 'main',
        component: Main,
        children: [...store.state.menu.asyncRouter]
      }])
      next({
        ...to,
        replace: true
      }) // hack写法，保证路由已经添加成功
    } else { // 页面不是刷新，只是路由变化
      if (to.matched.length) { // 有匹配到路由
        next()
      } else {
        next('/404')
      }
    }
  } else { // 没登录过
    if (to.name === 'login' || to.name === 'SuperLogin') {
      next()
    } else {     
      if(to.name === 'SuperLogin'){       
        next({name: 'SuperLogin'})
      }else{
        next({name: 'login'})
      }      
    }    
  }
})

router.afterEach((to) => {
  iView.LoadingBar.finish()
  window.scrollTo(0, 0)
})
