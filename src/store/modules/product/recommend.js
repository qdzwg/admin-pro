/**景区差异化文件
 * 
 */
import {
  apiGet
} from '@/fetch/api';
import CloneDeep from 'lodash.clonedeep';
const Recommend = {
  namespaced: true,
  state: {
    cityList: [], //获取城市列表数据
    scenicList: [], //获取景区列表数据
    productList: [],
  },
  getters: {},
  mutations: {
    setCityList(state, payload) {
      state.cityList = payload
    },
    setScenicList(state, payload) {
      state.scenicList = payload
    },
    setProductList(state, payload) {
      state.productList = payload
    }
  },
  actions: {
    getProductAxios({
      state,
      commit
    }) {
      apiGet('/admin/api/sys/role/selectProduct').then(res => {
        if (res.status == 200) {
          let list = res.prodTypeList.map(item => {
            let {
              key: value,
              value: label
            } = item
            return {
              value,
              label
            }
          })
          commit('setProductList', list)
        }
      })
    },
    getScenicAndCity({
      state,
      commit,
      dispatch
    }) {
      let city = apiGet('product/api/recommend/city');
      let scenic = apiGet('product/api/recommend/park');
      Promise.all([city, scenic]).then(res => {
        let cityInfo = res[0]
        let cityList = []
        let scenicInfo = res[1]
        let scenicList = []
        if (cityInfo && cityInfo.status == 200) {
          cityList = cityInfo.data.map(item => {
            let {
              cityName: label,
              id: value
            } = item
            return {
              value,
              label
            }
          })
        }
        if (scenicInfo && scenicInfo.status == 200) {
          scenicList = scenicInfo.data.map(item => {
            let {
              parkId: value,
              parkName: label
            } = item
            return {
              value,
              label
            }
          })
        }
        commit('setCityList', cityList)
        commit('setScenicList', scenicList)
        dispatch('getProductAxios')
      })
    },
  }
}

export default Recommend
