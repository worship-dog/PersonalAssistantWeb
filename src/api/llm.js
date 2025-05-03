import request from './request';

/**
 * 获取大语言模型列表
 * @returns {Promise<Object>} 返回大语言模型列表数据
 */
export function getLLMList() {
  return request({
    url: '/llm/list',
    method: 'get'
  });
}

/**
 * 创建大语言模型
 * @param {Object} data - 大语言模型数据
 * @param {string} data.source - 模型来源
 * @param {string} data.name - 模型名称
 * @param {string} data.base_url - 服务地址
 * @param {string} [data.api_key] - API密钥（可选）
 * @returns {Promise<Object>} 返回创建结果
 */
export function createLLM(data) {
  return request({
    url: '/llm',
    method: 'post',
    data
  });
}

/**
 * 更新大语言模型
 * @param {Object} data - 大语言模型数据
 * @param {string} data.llm_id - 模型ID
 * @param {string} data.source - 模型来源
 * @param {string} data.name - 模型名称
 * @param {string} data.base_url - 服务地址
 * @param {string} [data.api_key] - API密钥（可选）
 * @returns {Promise<Object>} 返回更新结果
 */
export function updateLLM(data) {
  return request({
    url: '/llm',
    method: 'put',
    data
  });
}

/**
 * 删除大语言模型
 * @param {string} llm_id - 模型ID
 * @returns {Promise<Object>} 返回删除结果
 */
export function deleteLLM(llm_id) {
  return request({
    url: '/llm',
    method: 'delete',
    data: { llm_id }
  });
}