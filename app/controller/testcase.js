/*
 * @Author: Wenzhe
 * @Date: 2020-04-04 17:31:33
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-04-07 11:55:37
 */
'use strict';

const fs = require('fs');
const path = require('path');
const awaitWriteStream = require('await-stream-ready').write;
const sendToWormhole = require('stream-wormhole');
const moment = require('moment');


const Controller = require('egg').Controller;

class TestcaseController extends Controller {
  async uploadTestcase() {
    const { ctx, service } = this;
    // 获取文件流
    const stream = await ctx.getFileStream();
    // 基础的目录
    const uplaodBasePath = 'app/public/uploads/testcase';
    // 生成文件名
    const filename = `${Date.now()}${Number.parseInt(
      Math.random() * 1000
    )}${path.extname(stream.filename).toLocaleLowerCase()}`;
    // 生成文件夹
    const dirname = moment().format('YYYY/MM/DD');
    function mkdirsSync(dirname) {
      if (fs.existsSync(dirname)) {
        return true;
      }
      if (mkdirsSync(path.dirname(dirname))) {
        fs.mkdirSync(dirname);
        return true;
      }

    }
    mkdirsSync(path.join(uplaodBasePath, dirname));
    // 生成写入路径
    const target = path.join(uplaodBasePath, dirname, filename);
    // 写入流
    const writeStream = fs.createWriteStream(target);
    try {
      // 异步把文件流 写入
      await awaitWriteStream(stream.pipe(writeStream));
    } catch (e) {
      await sendToWormhole(stream);
      throw new Error(500, e);
    }
    // console.log('------------', {
    //   url: path.join('/public/uploads/testcase', dirname, filename),
    //   path: target,
    //   resolve: path.resolve('./'),
    // });
    const res = await service.testcase.upload({
      path: path.join(path.resolve('./'), target),
    });
    ctx.helper.success({ ctx, res });
  }
}

module.exports = TestcaseController;
