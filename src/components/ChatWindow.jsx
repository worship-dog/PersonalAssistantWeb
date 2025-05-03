import React from 'react';
import { SendOutlined, VerticalAlignTopOutlined } from '@ant-design/icons';
import {
  ChatContainer,
  MessagesContainer,
  MessageItem,
  MessageContent,
  ThoughtItem,
  ThoughtHeader,
  ThoughtContent,
  TimeStamp,
  InputContainer,
  MessageInput,
  SendButton,
  ScrollToBottomButton,
  EmptyState,
  EmptyStateTitle,
  EmptyStateDescription
} from '../styles/components';

const ChatWindow = ({
  activeChat,
  localMessages,
  inputValue,
  showScrollButton,
  messagesContainerRef,
  messagesEndRef,
  onMessageVisibilityChange,
  onInputChange,
  onKeyPress,
  onSendMessage,
  onScrollToBottom
}) => {
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
            onChange={onInputChange}
            onKeyPress={onKeyPress}
          />
        </EmptyState>
      </ChatContainer>
    );
  }

  return (
    <ChatContainer>
      <MessagesContainer ref={messagesContainerRef}>
        {localMessages.map((msg, index) => (
          <MessageItem key={index} $isUser={msg.isUser.toString()}>
            <MessageContent $isUser={msg.isUser.toString()}>
              {msg.isUser ? (
                msg.content
              ) : (
                <>
                  {msg.thinks.map((think, i) => (
                    <ThoughtItem key={i}>
                      <ThoughtHeader onClick={() => onMessageVisibilityChange(index, i)}>
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
          onClick={onScrollToBottom}
          title="滚动到底部"
        >
          <VerticalAlignTopOutlined style={{ fontSize: '16px', transform: 'rotate(180deg)' }} />
        </ScrollToBottomButton>
      </MessagesContainer>

      <InputContainer>
        <MessageInput
          placeholder="输入消息..."
          value={inputValue}
          onChange={onInputChange}
          onKeyPress={onKeyPress}
        />
        <SendButton onClick={onSendMessage}>
          <SendOutlined />
        </SendButton>
      </InputContainer>
    </ChatContainer>
  );
};

export default ChatWindow;