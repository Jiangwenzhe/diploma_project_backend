/*
 * @Author: Wenzhe
 * @Date: 2020-04-02 10:09:50
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-04-03 10:44:30
 */

'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const authorInfo = new mongoose.Schema({
    name: String,
    avatar_url: String,
  });
  const comment = new mongoose.Schema({
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    avatar_utl: String,
    content: {
      type: String,
      default: '',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });
  const DiscussSchema = new mongoose.Schema({
    // discuss id
    // did: {
    //   type: Number,
    //   index: {
    //     unique: true,
    //   },
    // },
    // 讨论的类型：
    // ['', 'interview/面试', 'algorithm/数据结构与算法', 'question/题目讨论'， 'work/工作', 'news/新闻', 'feedback/反馈']
    category: {
      type: String,
      default: '',
    },
    // tag
    tags: {
      type: [ String ],
      default: [],
    },
    // 标题
    title: {
      type: String,
      required: true,
    },
    // markdown 格式
    detail: {
      type: String,
    },
    comments: {
      type: [ comment ],
      default: [],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    subscribe: {
      type: [ Number ],
      default: [],
    },
    like: {
      type: Number,
      default: 0,
    },
    // likeList: {
    //   type: [ String ],
    //   default: [],
    //   unique: true,
    // },
    dislike: {
      type: Number,
      default: 0,
    },
    author_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    author: authorInfo,
  });
  return mongoose.model('Discuss', DiscussSchema);
};
