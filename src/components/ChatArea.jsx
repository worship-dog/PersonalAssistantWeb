import React from 'react';
import styled from 'styled-components';
import { SendOutlined, VerticalAlignTopOutlined } from '@ant-design/icons';

import * as commonmark from 'commonmark';

const ChatContainer = styled.div`
  height: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: ${props => props.theme.background};
`;

const ChatHeader = styled.div`
  padding: 16px;
  border-bottom: 1px solid ${props => props.theme.border};
  font-weight: bold;
  font-size: 16px;
`;

const MessagesContainer = styled.div`
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const EmptyState = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #888;
  padding: 20px;
  text-align: center;
`;

const EmptyStateTitle = styled.h2`
  margin-bottom: 16px;
  font-size: 24px;
  font-weight: normal;
`;

const EmptyStateDescription = styled.p`
  margin-bottom: 24px;
  max-width: 500px;
`;

const MessageItem = styled.div`
  margin-bottom: 16px;
  max-width: 80%;
  align-self: ${props => props.$isUser.toString() == "true" ? 'flex-end' : 'flex-start'};
`;

const ThoughtItem = styled.div`
  margin-bottom: 8px;
  border: 1px solid ${props => props.theme.border};
  border-radius: 6px;
  overflow: hidden;
`;

const ThoughtHeader = styled.div`
  padding: 8px 12px;
  background-color: ${props => props.theme.background};
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  &:hover {
    background-color: ${props => props.theme.background === '#ffffff' ? '#f5f5f5' : '#333'};
  }
`;

const ThoughtContent = styled.div`
  padding: 8px 12px;
  font-size: 12px;
  background-color: ${props => props.theme.background === '#ffffff' ? '#fafafa' : '#252525'};
  border-top: 1px solid ${props => props.theme.border};
`;

const TimeStamp = styled.span`
  font-size: 10px;
  color: #666;
`;

const MessageContent = styled.div`
  padding: 12px 16px;
  border-radius: 8px;
  // 消息气泡使用主题色
  background-color: ${props => props.$isUser.toString() == "true" ?
    props.theme.messageUserBg :
    props.theme.messageBotBg};
  color: ${props => props.theme.text};
  
  /* Markdown样式 */
  & a {
    color: #1677ff;
    text-decoration: none;
  }
  & a:hover {
    text-decoration: underline;
  }
  & code {
    background-color: ${props => props.theme.background === '#ffffff' ? '#f5f5f5' : '#333'};
    padding: 2px 4px;
    border-radius: 4px;
    font-family: monospace;
  }
  & pre {
    background-color: ${props => props.theme.background === '#ffffff' ? '#f5f5f5' : '#333'};
    padding: 12px;
    border-radius: 4px;
    overflow-x: auto;
  }
  & pre code {
    background-color: transparent;
    padding: 0;
  }
  & blockquote {
    border-left: 4px solid #ddd;
    padding-left: 16px;
    margin-left: 0;
    color: #666;
  }
  & img {
    max-width: 100%;
  }
  & table {
    border-collapse: collapse;
    width: 100%;
  }
  & th, & td {
    border: 1px solid ${props => props.theme.border};
    padding: 8px;
  }
  & th {
    background-color: ${props => props.theme.background === '#ffffff' ? '#f5f5f5' : '#333'};
  }
  
  /* 列表样式 */
  & ul, & ol {
    padding-left: 20px;
    margin: 8px 0;
    overflow-wrap: break-word;
  }
  
  & li {
    margin-bottom: 4px;
    word-break: break-word;
  }
`;

const InputContainer = styled.div`
  padding: 16px;
  border-top: 1px solid ${props => props.theme.border};
  display: flex;
  justify-content: center;
  align-items: center;
`;

const MessageInput = styled.input`
  flex: 1;
  width: 500px;
  max-width: 800px;
  height: 50px;
  max-height: 60px;
  padding: 12px 16px;
  border: 1px solid #e6e6e6;
  border-radius: 8px;
  outline: none;
  font-size: 14px;
  background-color: ${props => props.theme.background === '#ffffff' ? '#f5f5f5' : '#2d2d2d'};
  
  &:focus {
    border-color: #1677ff;
  }
`;

const SendButton = styled.button`
  margin-left: 8px;
  background-color: #1677ff;
  color: white;
  border: none;
  border-radius: 8px;
  width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  
  &:hover {
    background-color: #0958d9;
  }
`;

const ScrollToBottomButton = styled.button`
  position: fixed;
  bottom: 100px;
  right: 60px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #1677ff;
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  opacity: ${props => props.$visible ? 1 : 0};
  visibility: ${props => props.$visible ? 'visible' : 'hidden'};
  transition: opacity 0.3s, visibility 0.3s;
  z-index: 100;
  
  &:hover {
    background-color: #0958d9;
  }
`;


const ChatArea = ({ activeChat }) => {
  const [inputValue, setInputValue] = React.useState('');
  const [messages, setMessages] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [showScrollButton, setShowScrollButton] = React.useState(false);
  const messagesEndRef = React.useRef(null);
  const messagesContainerRef = React.useRef(null);
  const wsRef = React.useRef(null);

  const connectWebSocket = React.useCallback(() => {
    if (
      wsRef.current &&
      (wsRef.current.readyState === WebSocket.CONNECTING ||
        wsRef.current.readyState === WebSocket.OPEN)) {
      return;
    }
    // 关闭已存在的无效连接
    if (wsRef.current) {
      wsRef.current.close();
    }
    try {
      const ws = new WebSocket(`${import.meta.env.VITE_API_BASE_URL.replace('http', 'ws')}/chat/stream`);

      ws.onopen = () => {
        console.log('WebSocket连接已建立');
      };

      ws.onclose = () => {
        console.log('WebSocket连接已关闭');
      };

      ws.onerror = (error) => {
        console.error('WebSocket错误:', error);
      };

      wsRef.current = ws;
    } catch (error) {
      console.error('WebSocket连接失败:', error);
    }
  }, []);

  // 组件挂载时连接WebSocket
  React.useEffect(() => {
    connectWebSocket();
    return () => {
      // 组件卸载时关闭WebSocket连接
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.close();
      }
    };
  }, [connectWebSocket]);

  // 滚动到底部的函数
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // 当消息列表更新时，检查滚动状态
  React.useEffect(() => {
    // 检查是否需要显示滚动按钮
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      const isScrolledUp = scrollHeight - scrollTop - clientHeight > 10;
      setShowScrollButton(isScrolledUp);
    }
  }, [messages]);

  // 监听滚动事件，控制滚动按钮的显示和隐藏
  React.useEffect(() => {
    const handleScroll = () => {
      if (!messagesContainerRef.current) return;

      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      // 当滚动条距离底部超过10px时显示按钮
      const isScrolledUp = scrollHeight - scrollTop - clientHeight > 10;
      setShowScrollButton(isScrolledUp);
    };

    const container = messagesContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      // 组件挂载后立即检查一次滚动状态
      handleScroll();
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const handleSendMessage = async () => {
    if (inputValue.trim() === '' || isLoading) return;

    setIsLoading(true);
    const userMessage = { content: inputValue, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    // 发送用户消息后滚动到底部
    scrollToBottom();

    try {
      wsRef.current.send(JSON.stringify({
        conversation_id: activeChat.toString(),
        chat_id: Date.now().toString(),
        question: inputValue,
        llm_id: '2e8ac9ec-c66b-43d0-b6bd-fd685170a5ce',
        prompt_template_id: ''
      }));

      let botMessage = {
        content: '',
        isUser: false,
        thinks: [],
        answer: '',
        thinkVisibility: [],
        buffer: ''
      };
      setMessages(prev => [...prev, botMessage]);
      // 添加机器人消息后滚动到底部
      scrollToBottom();

      const websocket = wsRef.current;
      websocket.onmessage = (e) => {
        let newData = e.data;
        // 替换e.data中的双引号
        newData = newData.replace(/"/g, '');
        botMessage.buffer += newData;

        // 处理思考内容收集
        if (!botMessage.isCollectingThink) {
          const thinkStartIndex = botMessage.buffer.indexOf('<think>');
          if (thinkStartIndex > -1) {
            botMessage.isCollectingThink = true;
            botMessage.currentThink = {
              content: '',
              startTime: performance.now(),
              duration: 0
            };
            botMessage.buffer = botMessage.buffer.slice(thinkStartIndex + 7);
          }
        }

        // 当处于收集思考内容状态时
        if (botMessage.isCollectingThink) {
          const thinkEndIndex = botMessage.buffer.indexOf('</think>');
          if (thinkEndIndex > -1) {
            botMessage.currentThink.content += botMessage.buffer.slice(0, thinkEndIndex);
            botMessage.currentThink.duration = ((performance.now() - botMessage.currentThink.startTime) / 1000).toFixed(1) + '秒';
            botMessage.thinks.push({ ...botMessage.currentThink });
            botMessage.thinkVisibility.push(false);
            botMessage.isCollectingThink = false;
            botMessage.buffer = botMessage.buffer.slice(thinkEndIndex + 8);
          } else {
            botMessage.currentThink.content += botMessage.buffer;
            botMessage.buffer = '';
          }
        } else {
          // 确保保留原始格式，包括换行符
          botMessage.answer += botMessage.buffer;
          // 实时将Markdown转换为HTML
          try {
            var reader = new commonmark.Parser();
            const writer = new commonmark.HtmlRenderer();
            var parsed = reader.parse(botMessage.answer);
            var html = writer.render(parsed);
            botMessage.htmlAnswer = html;
          } catch (error) {
            console.error('Markdown解析失败:', error);
          }
          botMessage.buffer = '';
        }
        setMessages(prev => [...prev.slice(0, -1), { ...botMessage }]);
      };

      websocket.onclose = () => {
        if (botMessage.buffer.length > 0) {
          botMessage.answer += botMessage.buffer;
          botMessage.buffer = '';
          setMessages(prev => [...prev.slice(0, -1), { ...botMessage }]);
        }
        setIsLoading(false);
      };
    } catch (error) {
      console.error('发送消息失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  // 如果没有选中的对话，显示空状态
  if (!activeChat) {
    return (
      <ChatContainer>
        <EmptyState>
          <EmptyStateTitle>PersonalAssistant</EmptyStateTitle>
          <EmptyStateDescription>
            开始一个新的对话，或者从左侧选择一个已有的对话。
          </EmptyStateDescription>
          <MessageInput
            placeholder="有什么可以帮你的？"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </EmptyState>
      </ChatContainer>
    );
  }

  return (
    <ChatContainer>
      <ChatHeader>
        {activeChat === 1 ? '关于AI的对话' :
          activeChat === 2 ? '如何学习编程' :
            activeChat === 3 ? '旅行计划讨论' : '新对话'}
      </ChatHeader>

      <MessagesContainer ref={messagesContainerRef}>
        {messages.map((msg, index) => (
          <MessageItem key={index} $isUser={msg.isUser.toString()}>
            <MessageContent $isUser={msg.isUser.toString()}>
              {msg.isUser ? (
                msg.content
              ) : (
                <>
                  {msg.thinks.map((think, i) => (
                    <ThoughtItem key={i}>
                      <ThoughtHeader onClick={() => {
                        const newVisibility = [...msg.thinkVisibility];
                        newVisibility[i] = !newVisibility[i];
                        setMessages(prev => prev.map((m, idx) =>
                          idx === index ? { ...m, thinkVisibility: newVisibility } : m
                        ));
                      }}>
                        <span>思考过程</span>
                        <TimeStamp>{think.duration}</TimeStamp>
                      </ThoughtHeader>
                      {msg.thinkVisibility[i] && (
                        <ThoughtContent>
                          {think.content}
                        </ThoughtContent>
                      )}
                    </ThoughtItem>
                  ))}
                  {<div dangerouslySetInnerHTML={{ __html: msg.htmlAnswer }} />}
                </>
              )}
            </MessageContent>
          </MessageItem>
        ))}
        <div ref={messagesEndRef} />
        <ScrollToBottomButton
          $visible={showScrollButton}
          onClick={scrollToBottom}
          title="滚动到底部"
        >
          <VerticalAlignTopOutlined style={{ fontSize: '16px', transform: 'rotate(180deg)' }} />
        </ScrollToBottomButton>
      </MessagesContainer>

      <InputContainer>
        <MessageInput
          placeholder="输入消息..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <SendButton onClick={handleSendMessage}>
          <SendOutlined />
        </SendButton>
      </InputContainer>
    </ChatContainer>
  );
};

export default ChatArea;