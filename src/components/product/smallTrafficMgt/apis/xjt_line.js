import axios from 'axios'
export const lineSiteAxios = (data) => {
  return axios({
    // url: '/product/manager/api/product/sitePrice/getSitePrices',
    url: '/product/api/trafficPrice/getRoutePrices',
    method: 'get',
    params: data
  })
}
export const selectTraffic = (data) => {
  return axios({
    // url: '/product/manager/api/product/sitePrice/getSitePrices',
    url: '/api/webApi/distMarketTraffic/selectTraffic',
    method: 'get',
    params: data
  })
}
export const addPriceAxios = (data) => {
  return axios({
    // url: '/product/manager/api/product/sitePrice/addSitePrice ',
    url: '/product/api/trafficPrice/updateTrafficPrice',
    method: 'get',
    params: data
  })
}
export const editPriceAxios = (data) => {
  return axios({
    url: '/product/manager/api/product/sitePrice/updateSitePrice',
    method: 'post',
    data: data
  })
}
// 一键登录
export const onKeyLogin = (data) => {
  return axios({
    url: '/product/api/trafficLogin/oneKeyLogin',
    method: 'post',
    data: data
  })
}
// 线路列表查询
export const lineListAxios = (data) => {
  return axios({
    url: '/product/api/trafficProduct/pageRouteInfo',
    method: 'get',
    params: data
  })
}
// 小交通路线批量上下架
export const batchEnabledAxios = (data) => {
  return axios({
    url: '/product/api/trafficProduct/batchIsPlaceEnabledDisable',
    method: 'get',
    params: data
  })
}
// 拉取小交通路线信息接口
export const pullRouteInfoAxios = (data) => {
  return axios({
    url: '/product/api/trafficProduct/pullRouteInfo',
    method: 'get',
    params: data
  })
}
// 获取小交通路线价格信息接口
export const getRoutePricesAxios = (data) => {
  return axios({
    url: '/product/api/trafficPrice/getRoutePrices',
    method: 'get',
    params: data
  })
}
// 获取产品规则接口
export const getRuleProductAxios = (data) => {
  return axios({
    url: '/product/api/trafficProduct/getRuleProduct',
    method: 'post',
    data: data
  })
}
// 获取车辆库存接口
export const getStocksAxios = (data) => {
  return axios({
    url: '/product/api/trafficStock/getStocks',
    method: 'get',
    params: data
  })
}
// 获取线路信息
export const getLineListAxios = (data) => {
  return axios({
    url: '/product/api/trafficProduct/listRouteInfo',
    method: 'post',
    data: data
  })
}
// 获取线路下所有班次信息
export const getBusInfoListAxios = (data) => {
  return axios({
    // url: '/product/manager/api/product/trainNumber/getTrainNumbersByRouteId',
    // method: 'post',
    // data: data
    url: '/product/api/trafficProduct/edit',
    method: 'get',
    params: data
  })
}
// ---------线路库存-------------
export const getStockAxios = (data) => {
  return axios({
    // url: '/product/manager/api/product/busStock/getBusDailyStockVo',
    url: '/product/api/trafficStock/getStocks',
    method: 'get',
    params: data
  })
}
export const importStockOut = (data) => {
  return axios({
    url: '/product/manager/api/product/busStock/addBathBusDailyStock',
    method: 'post',
    data: data
  })
}

// 库存列表页列表查询
export const insertStockList = (data) => {
  return axios({
    url: '/product/api/trafficProduct/pageSiteStock',
    method: 'get',
    params: data
  })
}
// 库存列表页批量库存添加
export const importStockInsert = (data) => {
  return axios({
    url: '/product/manager/api/product/busStock/addBathSiteDailyStock',
    method: 'post',
    data: data
  })
}
// 库存列表页修改
export const editStock = (data) => {
  return axios({
    url: '/product/manager/api/product/busStock/updateSiteDailyStock',
    method: 'post',
    data: data
  })
}
// -------线路管理接口--------
// 线路新增
export const addLineAxios = (data) => {
  return axios({
    url: '/product/manager/api/product/routeInfo/routeInfoSave',
    method: 'post',
    data: data
  })
}
// // 线路列表查询
export const deletLineAxios = (data) => {
  return axios({
    url: '/product/manager/api/product/routeInfo/routeInfoDelete',
    method: 'post',
    data: data
  })
}
// 线路详情
export const lineDetailAxios = (data) => {
  return axios({
    url: '/product/api/trafficProduct/edit',
    method: 'get',
    params: data
  })
}
// 获取某个班次下的车辆信息
export const timeCarListAxios = (data) => {
  return axios({
    url: '/product/manager/api/product/trainNumber/getbusInfosBytrainNumberId',
    method: 'post',
    data: data
  })
}
// 获取某个班次下所有时刻
export const timeStationListAxios = (data) => {
  return axios({
    url: '/product/manager/api/product/trainNumber/getBusSchedulesByTrainNumTime',
    method: 'post',
    data: data
  })
}
// 线路修改
export const editLineAxios = (data) => {
  return axios({
    url: '/product/api/trafficProduct/trafficUpdate',
    method: 'post',
    data: data
  })
}
// 分销渠道常量
export const distTypeListAxios = (data) => {
  return axios({
    url: '/product/api/trafficProduct/getConstant',
    method: 'get',
    params: data
  })
}
// 保存班次
export const saveCarManAxios = (data) => {
  return axios({
    url: '/product/manager/api/product/busInfo/updateBusInfos',
    method: 'post',
    data: data
  })
}
// 获取用户下所有的成型及车牌
export const styleAndNumberAxios = (data) => {
  return axios({
    url: '/product/manager/api/product/carType/carTypeAll',
    method: 'post',
    data: data
  })
}
// 当前用户下所有司机
export const allCarManAxios = (data) => {
  return axios({
    url: '/product/manager/api/product/driver/driverAll',
    method: 'post',
    data: data
  })
}
// -----车辆信息接口--------
export const carInfoListAxios = (data) => {
  return axios({
    // url: '/product/manager/api/product/busInfo/gridBusInfoVo',
    // method: 'post',
    // data: data
    url: '/product/api/trafficProduct/pageBusInfo',
    method: 'get',
    params: data
  })
}
