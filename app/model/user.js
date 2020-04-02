/*
 * @Author: Wenzhe
 * @Date: 2020-03-16 16:54:00
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-04-02 15:19:27
 */
'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const UserSchema = new mongoose.Schema({
    // uid
    // 自增加
    uid: {
      required: true,
      type: Number,
      index: {
        unique: true,
      },
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: 'https://tva1.sinaimg.cn/large/00831rSTly1gdff24d3cyj305k05kaa5.jpg',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    solve: {
      type: Number,
      default: 0,
    },
    submit: {
      type: Number,
      default: 0,
    },
    // 权限 1 - 普通用户, 3 - 系统管理员
    privilege: {
      type: Number,
      default: 1,
    },
    motto: {
      type: String,
      default: '这个人很懒，他/她什么都没有写',
    },
    mail: {
      type: String,
      default: '',
    },
    school: {
      type: String,
      default: '',
    },
    company: {
      type: String,
      default: '',
    },
  });
  return mongoose.model('User', UserSchema);
};
