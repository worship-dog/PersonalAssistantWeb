import request from './request';

/**
 * 获取知识库列表
 * @returns {Promise<Object>} 返回知识库列表数据
 */
export function getCollectionList() {
  return request({
    url: '/collection/list',
    method: 'get'
  });
}

/**
 * 创建知识库
 * @param {Object} data - 知识库数据
 * @param {string} data.name - 知识库名称
 * @param {string} data.display - 知识库显示名称
 * @returns {Promise<Object>} 返回创建结果
 */
export function createCollection(data) {
  return request({
    url: '/collection',
    method: 'post',
    data
  });
}

/**
 * 更新知识库
 * @param {Object} data - 知识库数据
 * @param {string} data.collection_id - 知识库ID
 * @param {string} data.name - 知识库名称
 * @param {string} data.display - 知识库显示名称
 * @returns {Promise<Object>} 返回更新结果
 */
export function updateCollection(data) {
  return request({
    url: '/collection',
    method: 'put',
    data
  });
}

/**
 * 删除知识库
 * @param {string} collection_id - 知识库ID
 * @returns {Promise<Object>} 返回删除结果
 */
export function deleteCollection(collection_id) {
  return request({
    url: '/collection',
    method: 'delete',
    data: { collection_id }
  });
}