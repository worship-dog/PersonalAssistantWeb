import React, { useState, useRef, useEffect } from 'react';
import { PlusOutlined, MenuFoldOutlined, MenuUnfoldOutlined, MoonOutlined, SunOutlined, SettingOutlined, MoreOutlined, EditOutlined, DeleteOutlined, CloseOutlined, CheckOutlined } from '@ant-design/icons';
import { updateConversation, deleteConversation, getConversationList } from '../api/conversation';
import {
  SidebarContainer,
  SidebarHeader,
  NewChatButton,
  ButtonText,
  ConversationList,
  ConversationItem,
  ConversationTitle,
  ToggleButton,
  MoreButton,
  DropdownMenu,
  DropdownItem
} from '../styles/components';
import styled from 'styled-components';

// 自定义Modal组件
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background-color: ${props => props.theme.background};
  border-radius: 8px;
  padding: 20px;
  width: 300px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  color: ${props => props.theme.text};
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;

const ModalTitle = styled.h3`
  margin: 0;
  font-size: 18px;
`;

const ModalContent = styled.div`
  margin-bottom: 20px;
`;

const ModalInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid ${props => props.theme.border};
  border-radius: 4px;
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.text};
  font-size: 14px;
  box-sizing: border-box;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

const ModalButton = styled.button`
  padding: 6px 12px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 5px;
  background-color: ${props => props.$primary ? '#1677ff' : props.theme.background === '#ffffff' ? '#f0f0f0' : '#333'};
  color: ${props => props.$primary ? '#fff' : props.theme.text};
  
  &:hover {
    background-color: ${props => props.$primary ? '#4096ff' : props.theme.background === '#ffffff' ? '#e6e6e6' : '#444'};
  }
`;

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
  const [hoveredItem, setHoveredItem] = useState(null);
  const [menuVisible, setMenuVisible] = useState(null);
  const [renameModalVisible, setRenameModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [newName, setNewName] = useState('');
  const dropdownRef = useRef(null);

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMenuVisible(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleMoreClick = (e, convId) => {
    e.stopPropagation();
    setMenuVisible(menuVisible === convId ? null : convId);
  };

  const handleRename = (e, convId) => {
    e.stopPropagation();
    setMenuVisible(null);
    const conversation = conversations.find(conv => conv.id === convId);
    if (conversation) {
      setCurrentConversation(conversation);
      setNewName(conversation.title);
      setRenameModalVisible(true);
    }
  };

  const handleRenameSubmit = async () => {
    if (currentConversation && newName.trim()) {
      try {
        await updateConversation({
          conversation_id: currentConversation.id,
          name: newName.trim()
        });

        // 重新加载对话列表
        const response = await getConversationList();
        if (response.code === 200) {
          // 更新App组件中的conversations状态
          const updatedConversations = response.data.map(item => ({ id: item.id, title: item.name }));
          // 这里需要将更新后的对话列表传递给父组件
          if (window.updateConversationList) {
            window.updateConversationList(updatedConversations);
          }
        }

        setRenameModalVisible(false);
      } catch (error) {
        console.error('重命名对话失败:', error);
      }
    }
  };

  const handleDelete = (e, convId) => {
    e.stopPropagation();
    setMenuVisible(null);
    const conversation = conversations.find(conv => conv.id === convId);
    if (conversation) {
      setCurrentConversation(conversation);
      setDeleteModalVisible(true);
    }
  };

  const handleDeleteSubmit = async () => {
    if (currentConversation) {
      try {
        await deleteConversation(currentConversation.id);

        // 重新加载对话列表
        const response = await getConversationList();
        if (response.code === 200) {
          // 更新App组件中的conversations状态
          const updatedConversations = response.data.map(item => ({ id: item.id, title: item.name }));
          // 这里需要将更新后的对话列表传递给父组件
          if (window.updateConversationList) {
            window.updateConversationList(updatedConversations);
          }

          // 如果删除的是当前选中的对话，则清除activeChat
          if (activeChat === currentConversation.id && onNewChat) {
            onNewChat();
          }
        }

        setDeleteModalVisible(false);
      } catch (error) {
        console.error('删除对话失败:', error);
      }
    }
  };
  return (
    <SidebarContainer $collapsed={collapsed}>
      {/* 重命名对话弹窗 */}
      {renameModalVisible && (
        <ModalOverlay onClick={() => setRenameModalVisible(false)}>
          <ModalContainer onClick={e => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>重命名对话</ModalTitle>
            </ModalHeader>
            <ModalContent>
              <ModalInput
                type="text"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                autoFocus
                onKeyPress={e => e.key === 'Enter' && handleRenameSubmit()}
              />
            </ModalContent>
            <ModalFooter>
              <ModalButton onClick={() => setRenameModalVisible(false)}>
                <CloseOutlined />
                取消
              </ModalButton>
              <ModalButton $primary onClick={handleRenameSubmit}>
                <CheckOutlined />
                确定
              </ModalButton>
            </ModalFooter>
          </ModalContainer>
        </ModalOverlay>
      )}

      {/* 删除对话弹窗 */}
      {deleteModalVisible && (
        <ModalOverlay onClick={() => setDeleteModalVisible(false)}>
          <ModalContainer onClick={e => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>删除对话</ModalTitle>
            </ModalHeader>
            <ModalContent>
              确定要删除对话 "{currentConversation?.title}" 吗？此操作不可撤销。
            </ModalContent>
            <ModalFooter>
              <ModalButton onClick={() => setDeleteModalVisible(false)}>
                <CloseOutlined />
                取消
              </ModalButton>
              <ModalButton $primary onClick={handleDeleteSubmit}>
                <CheckOutlined />
                确定
              </ModalButton>
            </ModalFooter>
          </ModalContainer>
        </ModalOverlay>
      )}

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
            onMouseEnter={() => setHoveredItem(conv.id)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <ConversationTitle $collapsed={collapsed}>{conv.title}</ConversationTitle>
            {!collapsed && (hoveredItem === conv.id || activeChat === conv.id || menuVisible === conv.id) && (
              <div ref={menuVisible === conv.id ? dropdownRef : null} style={{ position: 'relative' }}>
                <MoreButton
                  $visible={true}
                  onClick={(e) => handleMoreClick(e, conv.id)}
                >
                  <MoreOutlined />
                </MoreButton>
                <DropdownMenu $visible={menuVisible === conv.id}>
                  <DropdownItem onClick={(e) => handleRename(e, conv.id)}>
                    <EditOutlined />
                    <span style={{ marginLeft: '8px' }}>重命名</span>
                  </DropdownItem>
                  <DropdownItem onClick={(e) => handleDelete(e, conv.id)}>
                    <DeleteOutlined />
                    <span style={{ marginLeft: '8px' }}>删除</span>
                  </DropdownItem>
                </DropdownMenu>
              </div>
            )}
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