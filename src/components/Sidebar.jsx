import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import { MenuFoldOutlined, MenuUnfoldOutlined, PlusOutlined, MoonOutlined, SunOutlined, SettingOutlined } from '@ant-design/icons';
import { ThemeContext } from '../App';

const SidebarContainer = styled.div`
  height: 100%;
  background-color: ${props => props.theme.sidebarBg};
  transition: width 0.3s;
  width: ${props => props.$collapsed ? '60px' : '260px'};
  display: flex;
  flex-direction: column;
  border-right: 1px solid ${props => props.theme.border};
`;

const SidebarHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid ${props => props.theme.border};
`;

const NewChatButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: ${props => props.$collapsed ? 'center' : 'flex-start'};
  background-color: ${props => props.theme.background};
  border: none;
  border-radius: 6px;
  padding: 8px 12px;
  cursor: pointer;
  width: ${props => props.$collapsed ? '40px' : '100%'};
  transition: all 0.3s;
  color: ${props => props.theme.text};
  
  &:hover {
    background-color: ${props => props.theme.background === '#ffffff' ? '#f0f0f0' : '#404040'};
  }
`;

const ButtonText = styled.span`
  margin-left: 8px;
  white-space: nowrap;
  overflow: hidden;
  display: ${props => props.$collapsed ? 'none' : 'inline'};
`;

const ToggleButton = styled.button`
  position: absolute;
  bottom: 20px;
  left: ${props => props.$collapsed ? '20px' : '220px'};
  background-color: ${props => props.theme.background === '#ffffff' ? '#f5f5f5' : props.theme.background};
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: left 0.3s;
  z-index: 10;
  
  &:hover {
    background-color: ${props => props.theme.background === '#ffffff' ? '#e6e6e6' : '#404040'};
  }
`;

const ConversationList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${props => props.$collapsed ? '8px 0' : '8px'};
`;

const ConversationItem = styled.div`
  padding: ${props => props.$collapsed ? '8px 0' : '8px 12px'};
  margin-bottom: 4px;
  border-radius: 6px;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
  align-items: center;
  justify-content: ${props => props.$collapsed ? 'center' : 'flex-start'};
  
  &:hover {
    background-color: ${props => props.theme.background === '#ffffff' ? '#e6e6e6' : '#404040'};
  }
  
  &.active {
    background-color: ${props => props.theme.background === '#ffffff' ? '#e6e6e6' : '#404040'};
  }
`;

const ConversationTitle = styled.span`
  display: ${props => props.$collapsed ? 'none' : 'inline'};
`;

const Sidebar = ({ onNewChat, onSelectChat, activeChat }) => {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const [collapsed, setCollapsed] = useState(false);
  const [conversations, setConversations] = useState([
    { id: 1, title: '关于AI的对话' },
    { id: 2, title: '如何学习编程' },
    { id: 3, title: '旅行计划讨论' },
  ]);

  const toggleCollapse = () => {
    setCollapsed(prev => {
      return !prev;
    });
  };

  const handleNewChat = () => {
    if (onNewChat) onNewChat();
  };

  return (
    <SidebarContainer $collapsed={collapsed}>
      <SidebarHeader>
        <NewChatButton $collapsed={collapsed} onClick={handleNewChat}>
          <PlusOutlined />
          <ButtonText $collapsed={collapsed}>新建对话</ButtonText>
        </NewChatButton>
      </SidebarHeader>

      <ConversationList $collapsed={collapsed}>
        {conversations.map(conv => (
          <ConversationItem
            key={conv.id}
            className={activeChat === conv.id ? 'active' : ''}
            $collapsed={collapsed}
            onClick={() => onSelectChat(conv.id)}
          >
            <ConversationTitle $collapsed={collapsed}>{conv.title}</ConversationTitle>
          </ConversationItem>
        ))}
      </ConversationList>

      <ToggleButton $collapsed={collapsed} onClick={toggleCollapse} style={{ bottom: '120px' }}>
        {collapsed ? <MenuUnfoldOutlined style={{ color: isDarkMode ? '' : '#000000' }} /> : <MenuFoldOutlined style={{ color: isDarkMode ? '' : '#000000' }} />}
      </ToggleButton>

      <ToggleButton
        $collapsed={collapsed}
        onClick={toggleTheme}
        style={{ bottom: '70px' }}
      >
        {isDarkMode ? <SunOutlined /> : <MoonOutlined style={{ color: '#000000' }} />}
      </ToggleButton>

      <ToggleButton
        $collapsed={collapsed}
        onClick={() => { }}
      >
        <SettingOutlined style={{ color: isDarkMode ? '' : '#000000' }} />
      </ToggleButton>

    </SidebarContainer>
  );
};

export default Sidebar;