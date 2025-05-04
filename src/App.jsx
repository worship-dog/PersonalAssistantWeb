import React, { useState, createContext, useEffect } from 'react';
import { ThemeProvider } from 'styled-components';
import { AppContainer } from './styles/components';
import { lightTheme, darkTheme } from './styles/theme';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import { createConversation, getConversationList } from './api/conversation';
import { getChatList } from './api/chat';
import { handleMessageProcessing, createBotMessage, formatMessages } from './utils/messageProcessor';
import './App.css';

export const ThemeContext = createContext();
let newUserMessage;

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeChat, setActiveChat] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState({});
  const [inputValue, setInputValue] = useState('');
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [localMessages, setLocalMessages] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const messagesEndRef = React.useRef(null);
  const messagesContainerRef = React.useRef(null);
  const wsRef = React.useRef(null);

  const theme = isDarkMode ? darkTheme : lightTheme;
  let botMessage = createBotMessage();

  const connectWebSocket = React.useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.CONNECTING || wsRef.current?.readyState === WebSocket.OPEN) return;
    if (wsRef.current) wsRef.current.close();

    try {
      const ws = new WebSocket(`${import.meta.env.VITE_API_BASE_URL.replace('http', 'ws')}/chat/stream`);
      ws.onopen = () => console.log('WebSocket连接已建立');
      ws.onmessage = (e) => {
        if (e.data === '@@@end@@@') {
          botMessage = createBotMessage();
          return;
        }
        const processedMessage = handleMessageProcessing(e.data, botMessage);
        if (newUserMessage && newUserMessage.content) {
          setLocalMessages(prev => [...prev, newUserMessage, createBotMessage()]);
          newUserMessage = {};
        }
        setLocalMessages(prev => [...prev.slice(0, -1), processedMessage]);
      };
      ws.onclose = () => console.log('WebSocket连接已关闭');
      ws.onerror = (error) => console.error('WebSocket错误:', error);
      wsRef.current = ws;
    } catch (error) {
      console.error('WebSocket连接失败:', error);
    }
  }, []);

  useEffect(() => {
    connectWebSocket();
    return () => wsRef.current?.readyState === WebSocket.OPEN && wsRef.current.close();
  }, [connectWebSocket]);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await getConversationList();
        if (response.code === 200) {
          setConversations(response.data.map(item => ({ id: item.id, title: item.name })));
        }
      } catch (error) {
        console.error('获取对话列表失败:', error);
      }
    };
    fetchConversations();

    // 添加全局函数用于更新对话列表
    window.updateConversationList = (newConversations) => {
      setConversations(newConversations);
    };

    return () => {
      // 组件卸载时清除全局函数
      window.updateConversationList = undefined;
    };
  }, []);

  useEffect(() => {
    const processedMessages = messages[activeChat]?.map(msg => {
      if (!msg.isUser) {
        const historyBotMessage = createBotMessage();
        handleMessageProcessing(msg.thinkContent, historyBotMessage);
        handleMessageProcessing(msg.answerContent, historyBotMessage);
        return historyBotMessage;
      }
      return msg;
    }) || [];
    setLocalMessages(processedMessages);

    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      setShowScrollButton(scrollHeight - scrollTop - clientHeight > 10);
    }
  }, [messages, activeChat]);

  useEffect(() => {
    const checkScroll = () => {
      setTimeout(() => {
        if (messagesContainerRef.current) {
          const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
          setShowScrollButton(scrollHeight - scrollTop - clientHeight > 10);
        }
      }, 0);
    };
    checkScroll();
  }, [localMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleNewConversation = () => setActiveChat(null);

  const handleSelectConversation = async (conversation_id) => {
    try {
      const response = await getChatList(conversation_id);
      if (response.code === 200) {
        setMessages({ [conversation_id]: formatMessages(response.data) });
      }
      setActiveChat(conversation_id);
    } catch (error) {
      console.error('加载对话失败:', error);
    }
  };

  const handleCreateNewChat = async () => {
    try {
      const response = await createConversation({ name: '新对话' });
      if (response.code === 200) {
        const newConversationId = response.data.conversation_id;
        const conversationListResponse = await getConversationList();
        if (conversationListResponse.code === 200) {
          const currentInput = inputValue;
          setInputValue('');
          setConversations(conversationListResponse.data.map(item => ({ id: item.id, title: item.name })));
          setActiveChat(newConversationId);
          newUserMessage = { content: currentInput, isUser: true };
          handleSendMessage(newConversationId);
        }
      }
    } catch (err) {
      console.error('创建对话失败:', err);
    }
  };

  const handleGenerateMessage = () => {
    if (inputValue.trim() === '') return;
    const userMessage = { content: inputValue, isUser: true };
    setInputValue('');
    botMessage = createBotMessage();
    setLocalMessages(prev => [...prev, userMessage, botMessage]);
  }

  const handleSendMessage = (conversationId) => {
    try {
      wsRef.current.send(JSON.stringify({
        conversation_id: conversationId || activeChat.toString(),
        chat_id: "",
        question: inputValue,
        llm_id: '2e8ac9ec-c66b-43d0-b6bd-fd685170a5ce',
        prompt_template_id: ''
      }));
    } catch (error) {
      console.error('发送消息失败:', error);
      return;
    }
  };

  const handleKeyPress = async (e) => {
    if (e.key === 'Enter' && inputValue.trim() !== '') {
      if (!activeChat) {
        await handleCreateNewChat();
      } else {
        handleGenerateMessage();
        handleSendMessage();
      }
    }
  };

  const handleMessageVisibilityChange = (messageIndex, thinkIndex) => {
    setLocalMessages(prev => prev.map((msg, idx) =>
      idx === messageIndex
        ? {
          ...msg,
          thinkVisibility: msg.thinkVisibility.map((v, i) => i === thinkIndex ? !v : v)
        }
        : msg
    ));
  };

  return (
    <ThemeProvider theme={theme}>
      <ThemeContext.Provider value={{ toggleTheme: () => setIsDarkMode(!isDarkMode), isDarkMode }}>
        <AppContainer>
          <Sidebar
            collapsed={collapsed}
            isDarkMode={isDarkMode}
            conversations={conversations}
            activeChat={activeChat}
            onNewChat={handleNewConversation}
            onSelectConversation={handleSelectConversation}
            onToggleCollapse={() => setCollapsed(prev => !prev)}
            onToggleTheme={() => setIsDarkMode(!isDarkMode)}
          />
          <ChatWindow
            activeChat={activeChat}
            localMessages={localMessages}
            inputValue={inputValue}
            showScrollButton={showScrollButton}
            messagesContainerRef={messagesContainerRef}
            messagesEndRef={messagesEndRef}
            onMessageVisibilityChange={handleMessageVisibilityChange}
            onInputChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            onSendMessage={async () => {
              if (inputValue.trim() === '') return;
              if (!activeChat) {
                await handleCreateNewChat();
              } else {
                handleGenerateMessage();
                handleSendMessage();
              }
            }}
            onScrollToBottom={scrollToBottom}
          />
        </AppContainer>
      </ThemeContext.Provider>
    </ThemeProvider>
  );
}

export default App;
