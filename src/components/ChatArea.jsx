import React from 'react';
import styled from 'styled-components';
import { SendOutlined } from '@ant-design/icons';
import { streamChat } from '../api/chat';

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

const MessageContent = styled.div`
  padding: 12px 16px;
  border-radius: 8px;
  // 消息气泡使用主题色
  background-color: ${props => props.$isUser.toString() == "true" ?
    props.theme.messageUserBg :
    props.theme.messageBotBg};
  color: ${props => props.theme.text};
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

const ChatArea = ({ activeChat }) => {
  const [inputValue, setInputValue] = React.useState('');
  const [messages, setMessages] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const eventSourceRef = React.useRef(null);

  React.useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  const handleSendMessage = async () => {
    if (inputValue.trim() === '' || isLoading) return;

    setIsLoading(true);
    const userMessage = { content: inputValue, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    try {
      const response = await streamChat({
        conversation_id: activeChat.toString(),
        chat_id: Date.now().toString(),
        question: inputValue,
        llm_id: '2e8ac9ec-c66b-43d0-b6bd-fd685170a5ce',
        prompt_template_id: ''
      });

      let botMessage = { content: '', isUser: false };
      setMessages(prev => [...prev, botMessage]);

      eventSourceRef.current = response;
      const eventSource = eventSourceRef.current;

      eventSource.addEventListener('message', (e) => {
        botMessage.content += e.data;
        setMessages(prev => [...prev.slice(0, -1), { ...botMessage }]);
      });

      eventSource.addEventListener('done', () => {
        eventSource.close();
        setIsLoading(false);
      });
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

      <MessagesContainer>
        {messages.map((msg, index) => (
          <MessageItem key={index} $isUser={msg.isUser.toString()}>
            <MessageContent $isUser={msg.isUser.toString()}>
              {msg.content}
            </MessageContent>
          </MessageItem>
        ))}
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