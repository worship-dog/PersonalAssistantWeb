import React, { useState } from 'react';
import styled from 'styled-components';
import { MenuFoldOutlined, MenuUnfoldOutlined, PlusOutlined } from '@ant-design/icons';

const SidebarContainer = styled.div`
  height: 100%;
  background-color: #f7f7f8;
  transition: width 0.3s;
  width: ${props => props.collapsed ? '60px' : '260px'};
  display: flex;
  flex-direction: column;
  border-right: 1px solid #e6e6e6;
`;

const SidebarHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #e6e6e6;
`;

const NewChatButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: ${props => props.collapsed ? 'center' : 'flex-start'};
  background-color: #fff;
  border: 1px solid #e6e6e6;
  border-radius: 6px;
  padding: 8px 12px;
  cursor: pointer;
  width: ${props => props.collapsed ? '40px' : '100%'};
  transition: all 0.3s;
  
  &:hover {
    background-color: #f0f0f0;
  }
`;

const ButtonText = styled.span`
  margin-left: 8px;
  white-space: nowrap;
  overflow: hidden;
  display: ${props => props.collapsed ? 'none' : 'inline'};
`;

const ToggleButton = styled.button`
  position: absolute;
  bottom: 20px;
  left: ${props => props.collapsed ? '20px' : '220px'};
  background-color: #fff;
  border: 1px solid #e6e6e6;
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
    background-color: #f0f0f0;
  }
`;

const ConversationList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${props => props.collapsed ? '8px 0' : '8px'};
`;

const ConversationItem = styled.div`
  padding: ${props => props.collapsed ? '8px 0' : '8px 12px'};
  margin-bottom: 4px;
  border-radius: 6px;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
  align-items: center;
  justify-content: ${props => props.collapsed ? 'center' : 'flex-start'};
  
  &:hover {
    background-color: #e6e6e6;
  }
  
  &.active {
    background-color: #e6e6e6;
  }
`;

const ConversationTitle = styled.span`
  display: ${props => props.collapsed ? 'none' : 'inline'};
`;

const Sidebar = ({ onNewChat, onSelectChat, activeChat }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [conversations, setConversations] = useState([
    { id: 1, title: '关于AI的对话' },
    { id: 2, title: '如何学习编程' },
    { id: 3, title: '旅行计划讨论' },
  ]);

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const handleNewChat = () => {
    if (onNewChat) onNewChat();
  };

  return (
    <SidebarContainer collapsed={collapsed}>
      <SidebarHeader>
        <NewChatButton collapsed={collapsed} onClick={handleNewChat}>
          <PlusOutlined />
          <ButtonText collapsed={collapsed}>新建对话</ButtonText>
        </NewChatButton>
      </SidebarHeader>

      <ConversationList collapsed={collapsed}>
        {conversations.map(conv => (
          <ConversationItem
            key={conv.id}
            className={activeChat === conv.id ? 'active' : ''}
            collapsed={collapsed}
            onClick={() => onSelectChat(conv.id)}
          >
            <ConversationTitle collapsed={collapsed}>{conv.title}</ConversationTitle>
          </ConversationItem>
        ))}
      </ConversationList>

      <ToggleButton collapsed={collapsed} onClick={toggleCollapse}>
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </ToggleButton>
    </SidebarContainer>
  );
};

export default Sidebar;