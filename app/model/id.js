/*
 * @Author: Wenzhe
 * @Date: 2020-03-26 14:51:03
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-03-26 18:03:56
 */

'use strict';


module.exports = app => {
  const mongoose = app.mongoose;
  const IdSchema = new mongoose.Schema({
    id: Number, // 这里的 id 只对应集合中最大的 id 值
    name: {
      type: String,
      index: {
        unique: true,
      },
    },
  });
  return mongoose.model('Ids', IdSchema);
};
