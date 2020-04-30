/*
 * @Author: Wenzhe
 * @Date: 2020-04-02 10:09:50
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-04-29 09:33:36
 */

'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const comment = new mongoose.Schema({
    comment_user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    reply_user_id: {
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
  });
  return mongoose.model('Discuss', DiscussSchema);
};
