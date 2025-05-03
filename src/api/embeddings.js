import request from './request';

/**
 * 获取嵌入模型列表
 * @returns {Promise<Object>} 返回嵌入模型列表数据
 */
export function getEmbeddingList() {
  return request({
    url: '/embeddings/list',
    method: 'get'
  });
}

/**
 * 创建嵌入模型
 * @param {Object} data - 嵌入模型数据
 * @param {string} data.source - 模型来源
 * @param {string} data.name - 模型名称
 * @param {string} data.base_url - 服务地址
 * @returns {Promise<Object>} 返回创建结果
 */
export function createEmbedding(data) {
  return request({
    url: '/embeddings',
    method: 'post',
    data
  });
}

/**
 * 更新嵌入模型
 * @param {Object} data - 嵌入模型数据
 * @param {string} data.embeddings_id - 嵌入模型ID
 * @param {string} data.source - 模型来源
 * @param {string} data.name - 模型名称
 * @param {string} data.base_url - 服务地址
 * @returns {Promise<Object>} 返回更新结果
 */
export function updateEmbedding(data) {
  return request({
    url: '/embeddings',
    method: 'put',
    data
  });
}

/**
 * 删除嵌入模型
 * @param {string} embeddings_id - 嵌入模型ID
 * @returns {Promise<Object>} 返回删除结果
 */
export function deleteEmbedding(embeddings_id) {
  return request({
    url: '/embeddings',
    method: 'delete',
    data: { embeddings_id }
  });
}