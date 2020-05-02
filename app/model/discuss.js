/*
 * @Author: Wenzhe
 * @Date: 2020-04-02 10:09:50
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-05-02 15:06:12
 */

'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const replys = new mongoose.Schema({
    reply_user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    comment_user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    content: {
      type: String,
      default: '',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });
  const comment = new mongoose.Schema({
    comment_user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    content: {
      type: String,
      default: '',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    replys: {
      type: [ replys ],
      default: [],
    },
  });
  const newDiscuss = new mongoose.Schema({
    discuss_user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    content: {
      type: String,
      default: '',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    comments: {
      type: [ comment ],
      default: [],
    },
    like: {
      type: Number,
      default: 0,
    },
  });
  const DiscussSchema = new mongoose.Schema({
    // ['', 'interview/面试', 'algorithm/数据结构与算法', 'question/题目讨论'， 'work/工作', 'news/新闻', 'feedback/反馈']
    category: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'discuss',
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
    like: {
      type: Number,
      default: 0,
    },
    dislike: {
      type: Number,
      default: 0,
    },
    author_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    access_number: {
      type: Number,
      default: 0,
    },
    update_time: {
      type: Date,
    },
    discussList: {
      type: [ newDiscuss ],
      default: [],
    },
  });
  return mongoose.model('Discuss', DiscussSchema);
};
