import {
  apiPostJson
} from '../../fetch/api'
import {
  Message
} from 'iview'
const state = {
  res: ''
}

const actions = {
  async getInfo (context, array) {
    let res = await apiPostJson('/admin/sysparam/findSysParamList', {
      types: array
    })
    if (res.success) {
      context.state.res = res.data
    } else {
      Message.warning(res.message)
    }
  }
}

export default {
  state,
  actions
}
