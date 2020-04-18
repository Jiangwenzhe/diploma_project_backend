/*
 * @Author: Wenzhe
 * @Date: 2020-04-18 13:08:05
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-04-18 13:13:59
 */

'use strict';

// 模拟差集运算
const difference_set = (setA, setB) => {
  const differentSet = new Set();
  setA.forEach(value => {
    if (!setB.has(value)) {
      differentSet.add(value);
    }
  });
  return differentSet;
};

module.exports = { difference_set };
