// API接口统一导出文件

// 导入所有API模块
import * as auth from './auth';
import * as chat from './chat';
import * as collection from './collection';
import * as embeddings from './embeddings';
import * as llm from './llm';

// 导出所有API模块
export {
  auth,
  chat,
  collection,
  embeddings,
  llm
};

// 默认导出所有API
export default {
  auth,
  chat,
  collection,
  embeddings,
  llm
};