import * as commonmark from 'commonmark';

export const handleMessageProcessing = (data, message) => {
  let newData = data;
  newData = newData.replace(/"/g, '');
  message.buffer += newData;

  if (!message.isCollectingThink) {
    const thinkStartIndex = message.buffer.indexOf('<think>');
    if (thinkStartIndex > -1) {
      message.isCollectingThink = true;
      message.currentThink = {
        content: '',
        startTime: performance.now(),
        duration: 0
      };
      message.buffer = message.buffer.slice(thinkStartIndex + 7);
    }
  }

  if (message.isCollectingThink) {
    const thinkEndIndex = message.buffer.indexOf('</think>');
    if (thinkEndIndex > -1) {
      message.currentThink.content += message.buffer.slice(0, thinkEndIndex);
      message.currentThink.duration = ((performance.now() - message.currentThink.startTime) / 1000).toFixed(1) + '秒';
      message.thinks.push({ ...message.currentThink });
      message.thinkVisibility.push(false);
      message.isCollectingThink = false;
      message.buffer = message.buffer.slice(thinkEndIndex + 8);
    } else {
      message.currentThink.content += message.buffer;
      message.buffer = '';
    }
  } else {
    message.answer += message.buffer;
    try {
      var reader = new commonmark.Parser();
      const writer = new commonmark.HtmlRenderer();
      var parsed = reader.parse(message.answer);
      var html = writer.render(parsed);
      message.htmlAnswer = html;
    } catch (error) {
      console.error('Markdown解析失败:', error);
    }
    message.buffer = '';
  }
  return { ...message };
};

export const createBotMessage = () => ({
  content: '',
  isUser: false,
  thinks: [],
  answer: '',
  thinkVisibility: [],
  buffer: '',
  htmlAnswer: '',
  isCollectingThink: false,
  currentThink: null
});

export const formatMessages = (data) => {
  return data.map(item => item.ai.length === 0 ? [{ content: item.human, isUser: true }] : [
    { content: item.human, isUser: true },
    {
      thinkContent: '<think>' + item.ai[0].answer.match(/<think>([\s\S]*?)<\/think>/g)?.map(t => t.replace(/<think>([\s\S]*?)<\/think>/, '$1')).join('\n') + '</think>' || '',
      answerContent: item.ai[0].answer.replace(/<think>[\s\S]*?<\/think>/g, ''),
      isUser: false,
      thinkTime: item.ai[0].think_time,
    }
  ]).flat();
};