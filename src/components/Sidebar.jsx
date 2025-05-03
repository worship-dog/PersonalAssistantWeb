import React from 'react';
import { PlusOutlined, MenuFoldOutlined, MenuUnfoldOutlined, MoonOutlined, SunOutlined, SettingOutlined } from '@ant-design/icons';
import {
  SidebarContainer,
  SidebarHeader,
  NewChatButton,
  ButtonText,
  ConversationList,
  ConversationItem,
  ConversationTitle,
  ToggleButton
} from '../styles/components';

const Sidebar = ({
  collapsed,
  isDarkMode,
  conversations,
  activeChat,
  onNewChat,
  onSelectConversation,
  onToggleCollapse,
  onToggleTheme
}) => {
  return (
    <SidebarContainer $collapsed={collapsed}>
      <SidebarHeader>
        <NewChatButton $collapsed={collapsed} onClick={onNewChat}>
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
            onClick={() => onSelectConversation(conv.id)}
          >
            <ConversationTitle $collapsed={collapsed}>{conv.title}</ConversationTitle>
          </ConversationItem>
        ))}
      </ConversationList>

      <ToggleButton $collapsed={collapsed} onClick={onToggleCollapse} style={{ bottom: '120px' }}>
        {collapsed ?
          <MenuUnfoldOutlined style={{ color: isDarkMode ? '' : '#000000' }} /> :
          <MenuFoldOutlined style={{ color: isDarkMode ? '' : '#000000' }} />
        }
      </ToggleButton>

      <ToggleButton
        $collapsed={collapsed}
        onClick={onToggleTheme}
        style={{ bottom: '70px' }}
      >
        {isDarkMode ?
          <SunOutlined /> :
          <MoonOutlined style={{ color: '#000000' }} />
        }
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