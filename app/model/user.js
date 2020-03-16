/*
 * @Author: Wenzhe
 * @Date: 2020-03-16 16:54:00
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-03-16 18:51:15
 */
'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  });
  return mongoose.model('User', UserSchema);
};
