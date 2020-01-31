/**线路差异化文件
 * 
 */
import { apiGet } from '@/fetch/api';
  const Line = {
    namespaced: true,
    state: {
      diffInfo: {},
      diffValue: {}
    },
    getters: {},
    mutations: {
      setDiffInfo(state, payLoad) {
        state.diffInfo = payLoad
        let diffValue = state.diffValue
        Object.keys(payLoad).forEach(key => {
          diffValue[key] = payLoad[key].defaultValue
        })
      },
    },
    actions: {
      getDiffInfo({
        state,
        commit
      }) {
        return new Promise(async (resolve) => {
          let info = await apiGet('/admin/api/sysParam/getSysParamJsonByKey', {
            key: 'routeLinePageId'
          })
          if (info.status == '200') {
            commit('setDiffInfo', info.data)
          }
          resolve()
        })  
      }
    }
  }
  
  export default Line
  