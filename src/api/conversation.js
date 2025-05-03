import request from './request';

/**
 * 获取对话列表
 * @returns {Promise<Object>} 返回对话列表数据
 */
export function getConversationList() {
  return request({
    url: '/conversation/list',
    method: 'get'
  });
}

/**
 * 创建对话
 * @param {Object} data - 对话数据
 * @param {string} data.name - 对话名称
 * @returns {Promise<Object>} 返回创建结果
 */
export function createConversation(data) {
  return request({
    url: '/conversation',
    method: 'post',
    data
  });
}

/**
 * 更新对话
 * @param {Object} data - 对话数据
 * @param {string} data.conversation_id - 对话ID
 * @param {string} data.name - 对话名称
 * @returns {Promise<Object>} 返回更新结果
 */
export function updateConversation(data) {
  return request({
    url: '/conversation',
    method: 'put',
    data
  });
}

/**
 * 删除对话
 * @param {string} conversation_id - 对话ID
 * @returns {Promise<Object>} 返回删除结果
 */
export function deleteConversation(conversation_id) {
  return request({
    url: '/conversation',
    method: 'delete',
    data: { conversation_id }
  });
}