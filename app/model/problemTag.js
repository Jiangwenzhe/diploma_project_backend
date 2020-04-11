/*
 * @Author: Wenzhe
 * @Date: 2020-04-11 10:09:58
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-04-11 12:34:24
 */
'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const ProblemTagsSchema = new mongoose.Schema({
    // 这里的 tid 可以自增
    tid: {
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
  return mongoose.model('ProblemTag', ProblemTagsSchema);
};
