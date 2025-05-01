import request from './request';

/**
 * 发送聊天消息（流式响应）
 * @param {Object} data - 聊天数据
 * @param {string} data.conversation_id - 会话ID
 * @param {string} data.chat_id - 聊天ID
 * @param {string} data.question - 问题内容
 * @param {string} data.llm_id - 大语言模型ID
 * @param {string} data.prompt_template_id - 提示词模板ID
 * @returns {Promise<Object>} 返回流式响应
 */
export function streamChat(data) {
  const params = new URLSearchParams({
    conversation_id: data.conversation_id,
    chat_id: data.chat_id,
    question: data.question,
    llm_id: data.llm_id,
    prompt_template_id: data.prompt_template_id
  });

  return new EventSource(`${import.meta.env.VITE_API_BASE_URL}/chat/stream?${params}`);
}
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
