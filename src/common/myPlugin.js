import common from './index';
import * as filter from '@/filters';
import CloneDeep from 'lodash.clonedeep';
import globalComponent from '@/components/global'
import {
  apiGet,
  apiPost,
  apiPut,
  apiDelete,
  apiPostJson
} from '@/fetch/api';
const MyPlugin = {}
MyPlugin.install = function (Vue, options) {
  Vue.prototype.filter = filter;
  Vue.prototype.common = common;
  Vue.prototype.apiGet = apiGet;
  Vue.prototype.apiPost = apiPost;
  Vue.prototype.apiPut = apiPut;
  Vue.prototype.apiDelete = apiDelete;
  Vue.prototype.apiPostJson = apiPostJson;
  Vue.prototype.cloneDeep = CloneDeep;
  Object.keys(filter).forEach(key => {
    Vue.filter(key, filter[key]);
  });
  Object.keys(globalComponent).forEach(key => {
    Vue.component(key, globalComponent[key])
  })
  /**过滤状态的全局方法
   * @param {string} key
   * @param {
   *  [{value:'关键值',label:'文字秒速'}]
   * } list  
   */
  Vue.prototype.$flType = function (value = '', list) {
    if (!Array.isArray(list)) {
      console.error(`第二个参数期望值是数组`)
      return ''
    }
    let key = value.toString().trim()
    let text = list.filter(item => {
      return item.value == key
    })
    return text.length ? text[0].label : ''
  }
}
export default MyPlugin
