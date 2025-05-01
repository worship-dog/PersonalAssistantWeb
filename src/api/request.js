import axios from 'axios';

// 创建axios实例
const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  timeout: 30000, // 请求超时时间
});

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 可以在这里添加token等认证信息
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    console.error('请求错误:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data;
    // 可以根据后端返回的状态码进行统一处理
    if (res.code !== 200) {
      console.error('接口返回错误:', res.msg || '未知错误');
      return Promise.reject(new Error(res.msg || '未知错误'));
    }
    return res;
  },
  error => {
    console.error('响应错误:', error);
    return Promise.reject(error);
  }
);

export default service;