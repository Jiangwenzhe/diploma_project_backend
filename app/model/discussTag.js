/*
 * @Author: Wenzhe
 * @Date: 2020-04-30 09:34:30
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-04-30 09:49:09
 */
'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const DiscussTagsSchema = new mongoose.Schema({
    // 这里的 tid 可以自增
    tid_discuss: {
      required: true,
      type: Number,
      index: {
        unique: true,
      },
    },
    name: {
      type: String,
      index: {
        unique: true,
      },
    },
  });
  return mongoose.model('DiscussTag', DiscussTagsSchema);
};
