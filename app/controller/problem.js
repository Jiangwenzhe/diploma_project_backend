/*
 * @Author: Wenzhe
 * @Date: 2020-03-26 15:02:40
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-04-16 16:31:09
 */
'use strict';

const Controller = require('egg').Controller;
const fs = require('fs');
const path = require('path');
const compressing = require('compressing');

class ProblemsController extends Controller {
  // 创建题目
  async createProblem() {
    const { ctx, service } = this;
    // TODO: 校验传入参数
    // ctx.validate(UserRule, ctx.request.body);
    // 组装参数
    const payload = ctx.request.body || {};
    const res = await service.problem.create(payload);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, res });
  }

  async deleteProblem() {
    const { ctx, service } = this;
    const { id } = ctx.params;
    // TODO: 加入权限管理
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      ctx.throw(400, 'id参数错误');
    }
    const res = await service.problem.delete(id);
    ctx.helper.success({ ctx, res });
  }

  // 修改单篇文章
  async updateProblem() {
    const { ctx, service } = this;
    const { id } = ctx.params;
    // TODO: 加入权限管理
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      ctx.throw(400, 'id参数错误');
    }
    const payload = ctx.request.body || {};
    const res = await service.problem.update(id, payload);
    ctx.helper.success({ ctx, res });
  }

  // 获取单个题目
  async findSingleProblemById() {
    const { ctx, service } = this;
    const { id } = ctx.params;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      ctx.throw(400, 'id参数错误');
    }
    const res = await service.problem.findById(id);
    ctx.helper.success({ ctx, res });
  }

  // 获取单个题目 pid
  async findSinglePeoblemByPid() {
    const { ctx, service } = this;
    const { pid } = ctx.params;
    if (isNaN(pid)) {
      ctx.throw(400, 'pid 必须是数字');
    }
    const res = await service.problem.findByProblemId(pid);
    ctx.helper.success({ ctx, res });
  }

  async getTestCaseOfAProblemById() {
    const { ctx, service } = this;
    const { id } = ctx.params;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      ctx.throw(400, 'id参数错误');
    }
    const { test_case_id, pid } = await service.problem.findById(id);
    if (!test_case_id) ctx.throw(400, '当前问题没有上传 TestCase');
    // 压缩文件
    const zip_path = `/Users/erzhuyijian/Desktop/毕业设计/代码/JudgeServer/data/backend/test_case/${test_case_id}/`;
    const tmp_file_path = path.join(path.resolve('./'), 'app/public/download/tmp/');
    const tmp_zip_file_name = `problem-${pid}-${Date.now()}.zip`;
    const down_zip_file_path = `${tmp_file_path}${tmp_zip_file_name}`;
    const zip_status = await compressing.zip.compressDir(zip_path, down_zip_file_path)
      .then(() => {
        return 'success';
      })
      .catch(err => {
        console.error(err);
      });
    // 如果压缩文件成功,就下载
    if (zip_status === 'success') {
      // const fileSize = (await promisify(stat)(path)).size.toString();
      ctx.attachment(down_zip_file_path);
      ctx.set('Content-Type', 'application/octet-stream');
      ctx.body = fs.createReadStream(down_zip_file_path);
    }
  }

  // 获取所有题目(分页/模糊)
  async index() {
    const { ctx, service } = this;
    // 组装参数
    const payload = ctx.query;
    // 调用 Service 进行业务处理
    const res = await service.problem.index(payload);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, res });
  }
}

module.exports = ProblemsController;
