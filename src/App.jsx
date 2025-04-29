import { useState, createContext } from 'react'
import styled, { ThemeProvider } from 'styled-components'
import Sidebar from './components/Sidebar'
import ChatArea from './components/ChatArea'
import './App.css'

// 新增主题上下文和主题配置
export const ThemeContext = createContext();
const lightTheme = {
  background: '#ffffff',
  sidebarBg: '#f7f7f8',
  text: '#000000',
  border: '#e6e6e6',
  buttonBg: '#1677ff',
  messageUserBg: '#1677ff',
  messageBotBg: '#f7f7f8'
};

const darkTheme = {
  background: '#1a1a1a',
  sidebarBg: '#2d2d2d',
  text: '#ffffff',
  border: '#404040',
  buttonBg: '#0958d9',
  messageUserBg: '#0958d9',
  messageBotBg: '#404040'
};

const AppContainer = styled.div`
  display: flex;
  height: 100vh;
  width: 100%;
  overflow: hidden;
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.text};
`;

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const theme = isDarkMode ? darkTheme : lightTheme;
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState({
    1: [
      { content: '你好，我想了解更多关于AI的信息', isUser: true },
      { content: '当然可以！人工智能(AI)是计算机科学的一个分支，致力于创建能够模拟人类智能的系统。有什么具体方面你想了解的吗？', isUser: false }
    ],
    2: [
      { content: '我想学习编程，从哪里开始比较好？', isUser: true },
      { content: '学习编程的好方法是先选择一门入门语言，如Python或JavaScript，然后通过在线课程、教程和实践项目来提升技能。你有特定的兴趣领域吗？', isUser: false }
    ],
    3: [
      { content: '我计划去日本旅行，有什么建议吗？', isUser: true },
      { content: '日本是个很棒的旅行目的地！建议你考虑季节因素，春季赏樱花，秋季看红叶都很美。东京、京都和大阪是热门城市，可以购买JR Pass节省交通费用。', isUser: false }
    ]
  });

  const handleNewChat = () => {
    setActiveChat(null);
  };

  const handleSelectChat = (chatId) => {
    setActiveChat(chatId);
  };

  return (
    <ThemeProvider theme={theme}>
      <ThemeContext.Provider value={{ toggleTheme, isDarkMode }}>
        <AppContainer>
          <Sidebar
            onNewChat={handleNewChat}
            onSelectChat={handleSelectChat}
            activeChat={activeChat}
          />
          <ChatArea
            activeChat={activeChat}
            messages={activeChat ? messages[activeChat] : []}
          />
        </AppContainer>
      </ThemeContext.Provider>
    </ThemeProvider>
  )
}

export default App
