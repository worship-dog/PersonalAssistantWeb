import styled from 'styled-components';

export const SidebarContainer = styled.div`
  height: 100%;
  background-color: ${props => props.theme.sidebarBg};
  transition: width 0.3s;
  width: ${props => props.$collapsed ? '60px' : '260px'};
  display: flex;
  flex-direction: column;
  border-right: 1px solid ${props => props.theme.border};
`;

export const SidebarHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid ${props => props.theme.border};
`;

export const NewChatButton = styled.button`
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

export const ButtonText = styled.span`
  margin-left: 8px;
  white-space: nowrap;
  overflow: hidden;
  display: ${props => props.$collapsed ? 'none' : 'inline'};
`;

export const ToggleButton = styled.button`
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

export const ConversationList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${props => props.$collapsed ? '8px 0' : '8px'};
`;

export const ConversationItem = styled.div`
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

export const ConversationTitle = styled.span`
  display: ${props => props.$collapsed ? 'none' : 'inline'};
`;

export const AppContainer = styled.div`
  display: flex;
  height: 100vh;
  width: 100%;
  overflow: hidden;
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.text};
`;

export const ChatContainer = styled.div`
  height: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: ${props => props.theme.background};
`;

export const MessagesContainer = styled.div`
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  position: relative;
`;

export const EmptyState = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #888;
  padding: 20px;
  text-align: center;
`;

export const EmptyStateTitle = styled.h2`
  margin-bottom: 16px;
  font-size: 24px;
  font-weight: normal;
`;

export const EmptyStateDescription = styled.p`
  margin-bottom: 24px;
  max-width: 500px;
`;

export const MessageItem = styled.div`
  margin-bottom: 16px;
  max-width: 80%;
  align-self: ${props => props.$isUser.toString() === "true" ? 'flex-end' : 'flex-start'};
`;

export const ThoughtItem = styled.div`
  margin-bottom: 8px;
  border: 1px solid ${props => props.theme.border};
  border-radius: 6px;
  overflow: hidden;
`;

export const ThoughtHeader = styled.div`
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

export const ThoughtContent = styled.div`
  padding: 8px 12px;
  font-size: 12px;
  background-color: ${props => props.theme.background === '#ffffff' ? '#fafafa' : '#252525'};
  border-top: 1px solid ${props => props.theme.border};
`;

export const TimeStamp = styled.span`
  font-size: 10px;
  color: #666;
`;

export const MessageContent = styled.div`
  padding: 12px 16px;
  border-radius: 8px;
  background-color: ${props => props.$isUser.toString() === "true" ?
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

export const InputContainer = styled.div`
  padding: 16px;
  border-top: 1px solid ${props => props.theme.border};
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const MessageInput = styled.input`
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

export const SendButton = styled.button`
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

export const ScrollToBottomButton = styled.button`
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