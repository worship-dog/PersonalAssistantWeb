import request from './request';


/**
 * 获取聊天记录列表
 * @param {string} conversation_id - 会话ID
 * @returns {Promise<Object>} 返回聊天记录列表
 */
export function getChatList(conversation_id) {
  return request({
    url: '/chat/stream',
    method: 'get',
    params: { conversation_id }
  });
}
