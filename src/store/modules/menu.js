import {
  apiGet
} from '../../fetch/api'

const state = {
  userDefine: false,
  menuList: '',
  activeName: '',
  openName: '',
  asyncRouter: ''
}
const getters = {

}

const mutations = {
  updateMenulist(state) {},
  setActiveName(state, name) {
    state.activeName = name
    // console.log(state.activeName)
  },
  setOpenName(state, name) {
    state.openName = name
  },
  formaterRouter(state) { // 根据权限生成路由
    let roleRouter = []
    // if (!state.menuList.data) {
    //   window.location.href = window.location.href.split('/manage')[0] + '/admin/login'
    //   return
    // }
    state.menuList.data.forEach(item => {
      // 根据用户权限生成路由
      let firstRouter = item.funCode
      item.list.forEach(it => {
        let secontName = it.funName
        let secondRouter = it.funCode
        it.list.forEach(el => {
          let thirdName = el.funName
          let thirdRouter = el.funCode
          let meta = {
            breadcrumbList: [secontName, thirdName],
            belongTab: firstRouter,
            openName: secondRouter
          }
          roleRouter.push({
            path: '/' + thirdRouter,
            name: thirdRouter,
            component: resolve => {
              require([`@/components/${firstRouter}/${secondRouter}/${thirdRouter}`], resolve)
            },
            meta: meta
          })
        })
      })
    })
    // console.log(roleRouter)
    state.asyncRouter = roleRouter
    // if (!state.menuList.data) {
    //   window.location.href = window.location.href.split('/manage')[0] + '/login'
    //   return
    // }
    // state.menuList.data.forEach(item => {
    //   // 根据用户权限生成路由
    //   let firstRouter = item.funCode
    //   item.list.forEach(it => {
    //     let secontName = it.funName
    //     let secondRouter = it.funCode
    //     it.list.forEach(el => {
    //       let thirdName = el.funName
    //       let thirdRouter = el.funCode
    //       let meta = {
    //         breadcrumbList: [secontName, thirdName],
    //         belongTab: firstRouter,
    //         openName: secondRouter
    //       }
    //       var arrUrl = el.funUrl.split('?')
    //       roleRouter.push({
    //         path: arrUrl[1] ? '/' + arrUrl[1].split('=')[1] : arrUrl[0],
    //         name: thirdRouter,
    //         component: resolve => {
    //           require([`@/components/${firstRouter}/${secondRouter}/${thirdRouter}`], resolve)
    //         },
    //         meta: meta
    //       })
    //     })
    //   })
    // })
    // state.asyncRouter = roleRouter
  }
}
const actions = {
  async getApi(context) {
    let menuList = await apiGet('/admin/getMenu')
    // context.state.activeName = menuList.data[0].funCode
    context.state.menuList = menuList
  },
  setActiveNameAction({
    commit
  }, name) {
    commit('setActiveName', name)
  },
  setOpenNameAction({
    commit
  }, name) {
    commit('setOpenName', name)
  },
  formaterRouterHandle({
    commit
  }) {
    commit('formaterRouter')
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
