import {apiPost,apiGet} from '../../fetch/api'

const state = {
  url: '',
  params: '',
  res: '',
  actionsParams: ''
}

const mutations = {
  setUrl (state, url) {
    state.url = url
  },
  setParams (state, params) {
    state.params = params
  },
  columnsHandle (state, params) {
    // console.log(state.actionsParams.title)
    state.actionsParams = params.actions
    // return [
    //   params('Button', {}, '编辑')
    // ]
    // return [
    //   params('Button', {}, '编辑'),
    //   params('Button', {}, '删除')
    // ]
  }
}

const actions = {
//     async getApi (context, params) {
//     return await apiGet(params.url, params.params)
//   },
  async postApi (context) {
    // return apiPost(params.url, params.params)
    context.state.res = await apiPost(context.state.url, context.state.params)
  },
  async getApiSc(context) {
    context.state.res = await apiGet(context.state.url, context.state.params)
  }
}

export default {
  state,
  mutations,
  actions
}
