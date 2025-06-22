<template>
  <div class="app-container">
    <el-form :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="68px">
      <el-form-item label="卡类型编码"
        prop="code">
        <el-input v-model="queryParams.code"
          placeholder="请输入卡类型编码"
          clearable
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="卡类型名称"
        prop="name">
        <el-input v-model="queryParams.name"
          placeholder="请输入卡类型名称"
          clearable
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh"
          size="mini"
          @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10"
      class="mb8">
      <el-col :span="1.5">
        <el-button type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['business:vipCardType:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['business:vipCardType:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['business:vipCardType:remove']">删除</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch"
        @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading"
      :data="vipCardTypeList"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection"
        width="55"
        align="center" />
      <el-table-column label="ID"
        align="center"
        prop="id" />
      <el-table-column label="卡类型编码"
        align="center"
        prop="code" />
      <el-table-column label="卡类型名称"
        align="center"
        prop="name" />
      <el-table-column label="价格"
        align="center"
        prop="price">
        <template slot-scope="scope">
          <span>¥{{ scope.row.price }}</span>
        </template>
      </el-table-column>
      <el-table-column label="时长(月)"
        align="center"
        prop="months" />
      <el-table-column label="折扣"
        align="center"
        prop="discount">
        <template slot-scope="scope">
          <span>{{ (scope.row.discount * 10).toFixed(1) }}折</span>
        </template>
      </el-table-column>
      <el-table-column label="备注"
        align="center"
        prop="remark"
        :show-overflow-tooltip="true" />
      <el-table-column label="创建时间"
        align="center"
        prop="createTime"
        width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作"
        align="center"
        class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['business:vipCardType:edit']">修改</el-button>
          <el-button size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['business:vipCardType:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改VIP卡类型对话框 -->
    <el-dialog :title="title"
      :visible.sync="open"
      width="500px"
      append-to-body>
      <el-form ref="form"
        :model="form"
        :rules="rules"
        label-width="100px">
        <el-form-item label="卡类型编码"
          prop="code">
          <el-input v-model="form.code"
            placeholder="请输入卡类型编码" />
        </el-form-item>
        <el-form-item label="卡类型名称"
          prop="name">
          <el-input v-model="form.name"
            placeholder="请输入卡类型名称" />
        </el-form-item>
        <el-form-item label="价格"
          prop="price">
          <el-input-number v-model="form.price"
            :precision="2"
            :step="0.01"
            :min="0"
            placeholder="请输入价格" />
        </el-form-item>
        <el-form-item label="时长(月)"
          prop="months">
          <el-input-number v-model="form.months"
            :min="1"
            placeholder="请输入时长(月)" />
        </el-form-item>
        <el-form-item label="折扣"
          prop="discount">
          <el-input-number v-model="form.discount"
            :precision="2"
            :step="0.01"
            :min="0"
            :max="1"
            placeholder="请输入折扣(0-1之间)" />
        </el-form-item>
        <el-form-item label="备注"
          prop="remark">
          <el-input v-model="form.remark"
            type="textarea"
            placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <div slot="footer"
        class="dialog-footer">
        <el-button type="primary"
          @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listVipCardType, getVipCardType, delVipCardType, addVipCardType, updateVipCardType } from "@/api/business/vipCardType";

export default {
  name: "VipCardType",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // VIP卡类型表格数据
      vipCardTypeList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        code: '',
        name: ''
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        code: [
          { required: true, message: "卡类型编码不能为空", trigger: "blur" }
        ],
        name: [
          { required: true, message: "卡类型名称不能为空", trigger: "blur" }
        ],
        price: [
          { required: true, message: "价格不能为空", trigger: "blur" }
        ],
        months: [
          { required: true, message: "时长不能为空", trigger: "blur" }
        ],
        discount: [
          { required: true, message: "折扣不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询VIP卡类型列表 */
    getList() {
      this.loading = true;
      listVipCardType(this.queryParams).then(response => {
        this.vipCardTypeList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        code: null,
        name: null,
        price: null,
        months: null,
        discount: null,
        remark: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
        code: '',
        name: ''
      };
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加VIP卡类型";
    },
    /** 修改按钮操作 */
    async handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      try {
        const res = await getVipCardType(id)
        this.form = res.data
        this.open = true;
        this.title = "修改VIP卡类型";
      } catch (error) {
        this.form = error.data
        this.open = true;
        this.title = "修改VIP卡类型";
      }
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateVipCardType(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addVipCardType(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除VIP卡类型编号为"' + ids + '"的数据项？').then(function () {
        return delVipCardType(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    }
  }
};
</script>