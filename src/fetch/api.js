import axios from 'axios';

import qs from 'qs';
import {
  Message
} from 'iview';
import router from '../router';
// axios.defaults.baseURL = 'http://xxsc.sendinfo.com.cn'
// axios.defaults.baseURL = '/webapi'
axios.defaults.timeout = 20000;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
// axios.defaults.headers.common['access-token'] = window.localStorage.getItem('xjsc_2018_token');

// request 拦截器
axios.interceptors.request.use(
  config => {
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// response拦截
axios.interceptors.response.use(
  response => {
    console.log(response)
    return response;
  },
  error => {
    if (error && error.response) {
      switch (error.response.status) {
        case 400:
          error.message = '请求错误';
          if(/SuperLogin$/i.test(window.location.hash)){
            router.push('/SuperLogin');
          }else{
            router.push('/login');
          };
          // window.location.href = 'https://www.lotsmall.cn/admin/storeMerchant/login#'
          break;
        case 403:
          error.message = '拒绝访问';
          break;
        case 404:
          Message.error('请求地址出错:' + error.response.config.url);
          // error.message = `请求地址出错: ${error.response.config.url}`
          break;
        case 408:
          error.message = '请求超时';
          break;
        case 500:
          Message.error('服务器内部错误');
          // error.message = '服务器内部错误'
          break;
        case 501:
          error.message = '服务未实现';
          break;
        case 502:
          error.message = '网关错误';
          break;
        case 503:
          error.message = '服务不可用';
          break;
        case 504:
          error.message = '网关超时';
          break;
        case 505:
          error.message = 'HTTP版本不受支持';
          break;
        default:
      }
    }
    return Promise.reject(error);
  }
);

/**
 * 封装get方法
 * @param url
 * @param data
 * @returns {Promise}
 */

export function apiGet(url, params = {}) {
  axios.defaults.headers.post['Content-Type'] =
    'application/x-www-form-urlencoded;charset=UTF-8';
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        params: params,
      })
      .then(response => {
        resolve(response.data);
      })
      .catch(err => {
        console.log(err);
      });
  });
}

/**
 * 封装post方法
 * @param url
 * @param data
 * @returns {Promise}
 */
export function apiPost(url, params = {}) {
  axios.defaults.headers.post['Content-Type'] =
    'application/x-www-form-urlencoded;charset=UTF-8';
  return new Promise((resolve, reject) => {
    params = qs.stringify(params);
    axios
      .post(url, params)
      .then(response => {
        resolve(response.data);
      })
      .catch(err => {
        console.log(err);
      });
  });
}

/**
 * 封装post方法
 * @param url
 * @param data
 * @returns {Promise}
 */
export function apiPostJson(url, params = {}) {
  axios.defaults.headers.post['Content-Type'] =
    'application/json;charset=UTF-8';
  return new Promise((resolve, reject) => {
    axios
      .post(url, params)
      .then(response => {
        resolve(response.data);
      })
      .catch(err => {
        reject(err);
      });
  });
}
/**
 * 封装DELETE方法
 * @param url
 * @param data
 * @returns {Promise}
 */
export function apiDelete(url, params = {}) {
  axios.defaults.headers.post['Content-Type'] =
    'application/x-www-form-urlencoded;charset=UTF-8';
  return new Promise((resolve, reject) => {
    axios
      .delete(url, params)
      .then(response => {
        resolve(response.data);
      })
      .catch(err => {
        reject(err);
      });
  });
}

/**
 * 封装UPDATE方法
 * @param url
 * @param data
 * @returns {Promise}
 */
export function apiPut(url, params = {}) {
  axios.defaults.headers.post['Content-Type'] =
    'application/x-www-form-urlencoded;charset=UTF-8';
  return new Promise((resolve, reject) => {
    axios
      .put(url, params)
      .then(response => {
        resolve(response.data);
      })
      .catch(err => {
        reject(err);
      });
  });
}
