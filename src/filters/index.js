let dateServer = (value) => {
  return value.replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3')
}
let noFristArr = (arr) => {
  arr.splice(0, 1)
  return arr
}
let adType = (value) => {
  let text = ''
  switch (value) {
    case 'main_page_top':
      text = '首页顶部轮播'
      break
    case 'person_center_bg':
      text = '个人中心背景'
      break
    case 'pay_page_ad':
      text = '支付成功页广告'
      break
    case 'main_page_fix':
      text = '首页顶部横条'
      break
  }
  return text
}
let sellType = (value) => {
  let text = ''
  switch (value) {
    case '0':
      text = '分销市场+店铺'
      break
    case '1':
      text = '仅分销市场'
      break
    case '2':
      text = '仅店铺'
      break
  }
  return text
}
let accountType = (value) => {
  let text = ''
  switch (value) {
    case '0':
      text = '管理员'
      break
    case '1':
      text = '供应商'
      break
    case '2':
      text = '代理商'
      break
    case '3':
      text = '分销商'
      break
  }
  return text
}
let accountfunType = (value) => {
  let text = ''
  switch (value) {
    case '-1':
      text = '系统管理员'
      break
    case '0':
      text = '平台管理员'
      break
    case '1':
      text = '供应商'
      break
      //   case '2':
      //     text = '代理商'
      //     break
    case '3':
      text = '分销商'
      break
    case '4':
      text = '店铺用户'
      break
  }
  return text
}
let accountHierarchy = (value) => {
  let text = ''
  switch (value) {
    case 0:
      text = '一级菜单'
      break
    case 1:
      text = '二级菜单'
      break
    case 2:
      text = '三级菜单'
      break
    case 3:
      text = '四级菜单'
      break
  }
  return text
}
let accountfunctionType = (value) => {
  let text = ''
  switch (value) {
    case 'menu':
      text = '菜单'
      break
    case 'column':
      text = '栏目'
      break
    case 'button':
      text = '按钮'
      break
  }
  return text
}

let accountState = (value) => {
  let text = ''
  switch (value) {
    case '0':
      text = '停用'
      break
    case '1':
      text = '启用'
      break
  }
  return text
}
let accountaccStatus = (value) => {
  let text = ''
  switch (value) {
    case 'T':
      text = '停用'
      break
    case 'F':
      text = '启用'
      break
  }
  return text
}
let accountauthType = (value) => {
  let text = ''
  switch (value) {
    case 'corp':
      text = '企业'
      break
    case 'person':
      text = '个人'
      break
  }
  return text
}
let accountauditStatus = (value) => {
  let text = ''
  switch (value) {
    case 'audit_success':
      text = '审核成功'
      break
    case 'wait':
      text = '待审核'
      break
    case 'audit_failure':
      text = '审核失败'
      break
  }
  return text
}
let opStatus = (value) => {
  let text = ''
  switch (value) {
    case '0':
      text = '待审核'
      break
    case '1':
      text = '退款成功'
      break
    case '2':
      text = '退款失败'
      break
  }
  return text
}
let pmsStatus = (value) => {
    let text = ''
    switch (value) {
      case 'success':
        text = '合作中'
        break
      case 'auth_wait':
        text = '待审核'
        break
      case 'overdate':
        text = '已过期'
        break
      case 'refuse':
        text = '已拒绝'
        break
        case 'stop':
        text = '已停止'
        break
      case 'update_wait':
        text = '合作中，修改待审核'
        break
      case 'update_failed':
        text = '合作中，修改已拒绝'
        break
      case 'stop_wait':
        text = '合作中，停止对接待审核'
        break
    }
    return text
  }
let marketState = (value) => {
  let text = ''
  switch (value) {
    case '1':
      text = '待付款'
      break
    case '2':
      text = '订单关闭'
      break
    case '3':
      text = '订购成功'
      break
    case '4':
      text = '已过期'
      break
    case '5':
      text = '永久'
      break
  }
  return text
}
let lptStatus = (value) => {
  let text = ''
  switch (value) {
    case 'not_start':
      text = '未开始'
      break
    case 'processing':
      text = '进行中'
      break
    case 'finished':
      text = '已结束'
      break
    case 'abandoned':
      text = '已废弃'
      break
    case 'start':
      text = '已开始'
      break
  }
  return text
}
let marketStatus = (value) => {
  let text = ''
  switch (value) {
    case '1':
      text = '未开始'
      break
    case '2':
      text = '进行中'
      break
    case '3':
      text = '已结束'
      break
    case '4':
      text = '已失效'
      break
  }
  return text
}
let opStatusAccount = (value) => {
  let text = ''
  switch (value) {
    case '0':
      text = '待处理'
      break
    case '1':
      text = '通过'
      break
    case '2':
      text = '驳回'
      break
    case '3':
      text = '完成'
      break
  }
  return text
}
let accountmsgType = (value) => {
  let text = ''
  switch (value) {
    case '0':
      text = '短信'
      break
    case '1':
      text = '邮件'
      break
  }
  return text
}
let accounttemplateType = (value) => {
  let text = ''
  switch (value) {
    case '0':
      text = '用户'
      break
    case '1':
      text = '订单'
      break
    case '2':
      text = '店铺'
      break
    case '3':
      text = '营销中心'
      break
  }
  return text
}
let accountChannel = (value) => {
  let text = ''
  switch (value) {
    case '0':
      text = '商城自建-线下系统'
      break
    case '1':
      text = '智游宝拉取'
      break
    case '2':
      text = '自有-智游宝'
      break
    case '-1':
      text = '商城自建-自核销'
      break
  }
  return text
}
let accountStatus = (value) => {
  let text = ''
  switch (value) {
    case '00':
      text = '注册'
      break
    case '01':
      text = '登录'
      break
    case '02':
      text = '忘记密码'
      break
    case '15ticket_sync':
      text = '同步门票下单成功'
      break
    case '03':
      text = '备用金支付密码'
      break
    case '04':
      text = '会员关怀'
      break
    case '15ticket_ordinary':
      text = '门票下单成功'
      break
    case '05':
      text = '信用支付密码'
      break
    case '06':
      text = '主题认证'
      break
    case '17':
      text = '退单成功'
      break
    case '30':
      text = '拼团成功通知'
      break
    case '20':
      text = '店铺认证短信验证'
      break
    case '31':
      text = '拼团失败通知'
      break
    case '15hotel':
      text = '酒店下单成功'
      break
    case '32':
      text = '团长开团通知'
      break
  }
  return text
}
let productType = (value) => {
  let text = ''
  switch (value) {
    case 'park':
      text = '景区'
      break
    case 'hotel':
      text = '酒店'
      break
    case 'mdse':
      text = '商品'
      break
    case 'route':
      text = '跟团游'
      break
    case 'eatery':
      text = '餐饮'
      break
    case 'theater':
      text = '剧院'
      break
  }
  return text
}
let orderType = (value) => {
  let text = ''
  switch (value) {
    case 'pms_hotel':
      text = '云PMS酒店'
      break
    case 'park':
      text = '景区'
      break
    case 'hotel':
      text = '酒店'
      break
    case 'mdse':
      text = '商品'
      break
    case 'route':
      text = '跟团游'
      break
    case 'eatery':
      text = '餐饮'
      break
    case 'theater_ticket':
      text = '剧院'
      break
    case 'yearcard':
      text = '年卡'
      break
    case 'family':
      text = '套票'
      break
    case 'ticket':
      text = '单票'
      break
    case 'traffic':
      text = '小交通'
      break
    case 'guide':
      text = '导游'
      break
    case 'show':
      text = '演出'
      break
  }
  return text
}
let pageType = (value) => {
  let text = ''
  switch (value) {
    case 'main_page':
      text = '首页'
      break
    case 'hotel':
      text = '酒店'
      break
    case 'product':
      text = '商品'
      break
    case 'scenic':
      text = '门票'
      break
    case 'personal':
      text = '个人中心'
      break
  }
  return text
}
let accountbusinessType = (value) => {
  let text = ''
  switch (value) {
    case 'room':
      text = '房型'
      break
    case 'mdse':
      text = '商品'
      break
    case 'ticket':
      text = '门票'
      break
    case 'route':
      text = '跟团游'
      break
    case 'repast':
      text = '餐券'
      break
  }
  return text
}
let accountpushType = (value) => {
  let text = ''
  switch (value) {
    case 'fine':
      text = '精品推荐'
      break
    case 'sell_well':
      text = '热销推荐'
      break
  }
  return text
}
let accountmodelprodFrom = (value) => {
  let text = ''
  switch (value) {
    case 'prod':
      text = '自营'
      break
    case 'dist_market':
      text = '分销'
      break
  }
  return text
}
let wayType = (value) => {
  let text = ''
  switch (value) {
    case '0':
      text = 'pc'
      break
    case '1':
      text = 'wap'
      break
    case '2':
      text = '微信'
      break
    case '3':
      text = '支付宝'
      break
    case '4':
      text = 'B2B'
      break
    case '5':
      text = 'OTA'
      break
    case '6':
      text = '小程序'
      break
    case '7':
      text = '窗口'
      break
    case '8':
      text = '自助机'
      break
    case '9':
      text = '云POS'
      break
    case '10':
      text = '微信小程序'
      break
    case '11':
      text = '支付宝小程序'
      break
    case '12':
      text = '浏览器'
      break
  }
  return text
}
let orderStatus = (value) => {
  let text = ''
  switch (value) {
    case '0':
      text = '待支付'
      break
    case '1':
      text = '代发货'
      break
    case '2':
      text = '待收货'
      break
    case '3':
      text = '待消费'
      break
    case '4':
      text = '已完成'
      break
    case '5':
      text = '已关闭'
      break
    case '6':
      text = '退款中'
      break
    case '8':
      text = '订单异常'
      break
    case '9':
      text = '订单待确认'
      break
    case '10':
      text = '部分入住'
      break
    case '11':
      text = '部分退房'
      break
    case '12':
      text = '取消-C端用户操作'
      break
    case '13':
      text = 'Noshow'
      break
    case '14':
      text = '预定成功'
      break
    case '15':
      text = '已拒绝'
      break
    case '16':
      text = '全部入住'
      break
    case '17':
      text = '待接单'
      break
    case '18':
      text = '已接单'
      break
    case '19':
      text = '已拒接'
      break
    case '20':
      text = '退款审核中'
      break
    case '21':
      text = '待退款'
      break
    case '22':
      text = '交易成功'
      break
    case '23':
      text = '交易失败'
      break
    case '24':
      text = '服务中'
      break
  }
  return text
}
let checkStatus = (value) => {
  let text = ''
  switch (value) {
    case '0':
      text = '未核销'
      break
    case '1':
      text = '核销中'
      break
    case '2':
      text = '已核销'
      break
    case '3':
      text = '已全退'
      break
    case '4':
      text = '部分核销'
      break
  }
  return text
}
let groupStatus = (value) => {
  let text = ''
  switch (value) {
    case '0':
      text = '等待拼团结果'
      break
    case '1':
      text = '拼团成功'
      break
    case '2':
      text = '拼团失败'
      break
  }
  return text
}
let plugCode = (value) => {
  let text = ''
  switch (value) {
    case 'coupon':
      text = '优惠券'
      break
    case 'wdf':
      text = '微多粉'
      break
    case 'lpt':
      text = '来拼团'
      break
    case 'mjs':
      text = '买即送'
      break
    case 'rlsb':
      text = '人脸识别'
      break
    case 'dzfp':
      text = '电子发票'
      break
    case 'jzyx':
      text = '精准营销'
      break
  }
  return text
}
let payType = (value) => {
  let text = ''
  switch (value) {
    case '0':
      text = '未指定'
      break
    case '1':
      text = '预付款'
      break
    case '2':
      text = '支付宝'
      break
    case '3':
      text = '微信'
      break
    case '4':
      text = '银联'
      break
    case '5':
      text = '手动'
      break
    case '6':
      text = '备用金'
      break
    case '7':
      text = '建行支付'
      break
    case '8':
      text = '中国银行支付'
      break
    case '9':
      text = '信用账户'
      break
    case '10':
      text = '徽商银行'
      break
    case '11':
      text = '中国工商银行支付'
      break
    case '12':
      text = 'WAP智游宝中国工商银行支付'
      break
    case '17':
      text = '微信建行支付'
      break
    case '18':
      text = '微信小程序建行支付'
      break
    case '21':
      text = '支付宝PC'
      break
    case '22':
      text = '支付宝Wap'
      break
    case '23':
      text = '支付宝扫码支付'
      break
    case '31':
      text = '微信WAP'
      break
    case '32':
      text = '微信PC'
      break
    case '33':
      text = '微信小程序支付'
      break
    case '34':
      text = 'WAP智游宝微信支付'
      break
    case '35':
      text = 'PC智游宝微信支付'
      break
    case '36':
      text = 'WAP智游宝支付宝支付'
      break
    case '37':
      text = 'PC智游宝支付宝扫码支付'
      break
    case '38':
      text = '智游宝微信刷卡支付'
      break
    case '39':
      text = '智游宝支付宝刷卡支付'
      break
    case '40':
      text = '智游宝银联扫码支付'
      break
    case '41':
      text = 'pc端支付宝扫码支付'
      break
    case '42':
      text = 'pc端微信扫码支付'
      break
    case '61':
      text = '分销商积分'
      break
    case '70':
      text = '智游宝悦单银联公众号支付'
      break
    case '71':
      text = '智游宝悦单银联二维码支付'
      break
    case '98':
      text = '挂账'
      break
    case '99':
      text = '现金支付'
      break
    case '100':
      text = '到付'
      break
    case '2004':
      text = '公众号支付'
      break
    case '2012':
      text = '支付宝H5支付'
      break
    case '2019':
      text = '支付宝服务窗口支付'
      break
    case '2020':
      text = '支付宝'
      break
  }
  return text
}
let parkLevel = (value) => { // 园区级别
  let text = ''
  switch (value) {
    case '0':
      text = '无等级'
      break
    case '1':
      text = '1A'
      break
    case '2':
      text = '2A'
      break
    case '3':
      text = '3A'
      break
    case '4':
      text = '4A'
      break
    case '5':
      text = '5A'
      break
  }
  return text || '无等级'
}
let opType = (value) => { // 交易方式
  let text = ''
  switch (value) {
    case '0':
      text = '充值'
      break
    case '1':
      text = '缴存'
      break
    case '2':
      text = '提现'
      break
    case '3':
      text = '代销'
      break
    case '4':
      text = '退款'
      break
  }
  return text || '无等级'
}
let productCategory = (value) => { // 类目
  let text = ''
  switch (value) {
    case '1':
      text = '食品'
      break
    case '2':
      text = '服饰'
      break
    case '3':
      text = '美妆'
      break
    case '4':
      text = '亲子'
      break
    case '5':
      text = '数码家电'
      break
    case '6':
      text = '居家生活'
      break
    case '7':
      text = '其他'
      break
  }
  return text
}
let postageType = (value) => { // 快递方式
  let text = ''
  switch (value) {
    case 'shunfeng':
      text = '顺丰'
      break
    case 'shentong':
      text = '申通'
      break
    case 'yuantong':
      text = '圆通速递'
      break
    case 'huitongkuaidi':
      text = '汇通快运'
      break
    case 'zhongtong':
      text = '中通速递'
      break
    case 'yunda':
      text = '韵达快运'
      break
    case 'tiantian':
      text = '天天快递'
      break
    case 'ems':
      text = 'ems快递'
      break
    case 'debangwuliu':
      text = '德邦物流'
      break
  }
  return text
}
let priceType = (value) => { // 自己过滤用 sku表格批量填充价格库存
  let text = ''
  switch (value) {
    case '.price':
      text = '成本价'
      break
    case '.priceShow':
      text = '门市价'
      break
    case '.priceSell':
      text = '零售价'
      break
    case '.priceSupply':
      text = '供货价'
      break
    case '.txt5':
      text = '建议零售价'
      break
    case '.stockNum':
      text = '库存'
      break
    case '.distStockNum':
      text = '分销库存'
      break
    case '.weight':
      text = '重量'
      break
  }
  return text
}
let priceType2 = (value) => { // 自己过滤用 sku表格编辑批量填充价格库存
  let text = ''
  switch (value) {
    case 'price':
      text = '成本价'
      break
    case 'priceShow':
      text = '门市价'
      break
    case 'priceSell':
      text = '零售价'
      break
    case 'priceSupply':
      text = '供货价'
      break
    case '.txt5':
      text = '建议零售价'
      break
    case 'stockNum':
      text = '库存'
      break
    case 'distStockNum':
      text = '分销库存'
      break
    case 'weight':
      text = '重量'
      break
  }
  return text
}

let formatDate = (d, fmt) => {
  let newd = !d || d.replace(/-/g, '/')
  let date = new Date(newd)
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + ''
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str))
    }
  }
  return fmt
}
let cutstr = (str, len) => { // 字符串截取
  let str_length = 0
  let str_len = 0
  let str_cut = new String()
  str_len = str.length
  for (let i = 0; i < str_len; i++) {
    let a = str.charAt(i)
    str_length++
    if (escape(a).length > 4) {
      // 中文字符的长度经编码之后大于4
      str_length++
    }
    str_cut = str_cut.concat(a)
    if (str_length >= len) {
      str_cut = str_cut.concat('...')
      return str_cut
    }
  }
  // 如果给定字符串小于指定长度，则返回源字符串；
  if (str_length < len) {
    return str
  }
}
let removeHtmlTag = (htmlStr, length = 9999999999) => { // 去除htmltag，并且截取
  let msg = htmlStr.replace(/<[^>]+>/g, '') // 去除HTML Tag
  msg = msg.replace(/[|]*\n/, '') // 去除行尾空格
  msg = msg.replace(/&nbsp;/ig, '') // 去掉npsp
  return cutstr(msg, length)
}
let padLeftZero = (str) => {
  return ('00' + str).substr(str.length)
}

let getOderType = (index) => {
  const list = ['开通', '挂失', '解挂', '补卡', '退卡', '修改', '充值', '换卡', '公园卡转市民卡', '市民卡转公园卡', '注销']
  return list[index]
}

let getOderStaus = (key) => {
  const list = {
    order_init: '订单初始化',
    order_rechargeing: '充值中',
    recharge_success: '充值成功',
    recharge_failure: '充值失败',
    order_close: '订单关闭'
  }
  return list[key]
}

let getPayStaus = (key) => {
  const list = {
    wait_pay: '待支付',
    pay_success: '支付成功',
    pay_overdue: '支付过期',
    pay_failure: '支付失败'
  }
  return list[key]
}

let getRefundStaus = (key) => {
  const list = {
    wait_approval: '待审核',
    approvaling: '审核中',
    success_approval: '审核成功',
    failure_approval: '审核失败'
  }
  return list[key]
}

let payWay = (key) => {
  const list = {
    '2': '支付宝',
    '22': '支付宝wap',
    '3': '微信',
    '32': '微信支付wap',
    '33': '微信小程序支付',
    '4': '银联'
  }
  return list[key]
}
let signStatus = (value) => {
  let text = ''
  switch (value) {
    case 'sign_success':
      text = '签约成功'
      break
    case 'sign_fail':
      text = '签约失败'
      break
    case 'sign_wait':
      text = '签约中'
      break
  }
  return text
}
let review = (value) => {
  let text = ''
  switch (value) {
    case 'T':
      text = '审核成功'
      break
    case 'F':
      text = '审核失败'
      break
    case 'P':
      text = '审核中'
      break
    case 'N':
      text = '未开启审核'
      break
  }
  return text
}
let couponType = (value) => {
  let text = ''
  switch (value) {
    case '0':
      text = '抵扣券'
      break
    case '1':
      text = '兑换券'
      break    
  }
  return text
}
let productTypes = (value) => {
  let text = ''
  switch (value) {
    case 'ticket':
      text = '门票'
      break
    case 'room':
      text = '酒店'
      break    
  }
  return text
}
opStatus
export {
  pmsStatus,
  sellType,
  adType,
  dateServer,
  accountType,
  accountState,
  accountmsgType,
  accounttemplateType,
  accountStatus,
  accountaccStatus,
  accountauthType,
  accountauditStatus,
  accountfunctionType,
  accountHierarchy,
  accountfunType,
  productType,
  orderType,
  pageType,
  accountbusinessType,
  accountpushType,
  accountmodelprodFrom,
  wayType,
  orderStatus,
  checkStatus,
  payType,
  parkLevel,
  productCategory,
  postageType,
  priceType,
  priceType2,
  noFristArr,
  formatDate,
  accountChannel,
  cutstr,
  removeHtmlTag,
  opStatus,
  opType,
  opStatusAccount,
  marketState,
  plugCode,
  marketStatus,
  lptStatus,
  groupStatus,
  getOderType,
  getOderStaus,
  getPayStaus,
  getRefundStaus,
  payWay,
  signStatus,
  review,
  couponType,
  productTypes
}
