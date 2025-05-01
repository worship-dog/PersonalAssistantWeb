import request from './request';

/**
 * 用户登录
 * @returns {Promise<Object>} 返回登录结果，包含token
 */
export function login() {
  return request({
    url: '/auth/login',
    method: 'post'
  });
}

/**
 * 获取用户信息
 * @returns {Promise<Object>} 返回用户信息
 */
export function getUserInfo() {
  return request({
    url: '/auth/user/info',
    method: 'get'
  });
}