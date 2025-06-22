<template>
  <div class="app-container">
    <el-table v-loading="loading" :data="rateList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="技师抽成比例" align="center" prop="technicianRate" />
      <el-table-column label="代理抽成比例" align="center" prop="agentRate" />
      <el-table-column label="商家抽成比例" align="center" prop="merchantRate" />
      <el-table-column label="新增时间" align="center" prop="createdTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createdTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="修改时间" align="center" prop="modifiedTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.modifiedTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="新增人" align="center" prop="createdBy" />
      <el-table-column label="修改人" align="center" prop="modifiedBy" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['business:rate:edit']"
          >修改</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 修改全局佣金配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="技师抽成比例" prop="technicianRate">
          <el-input v-model="form.technicianRate" placeholder="请输入技师抽成比例" />
        </el-form-item>
        <el-form-item label="代理抽成比例" prop="agentRate">
          <el-input v-model="form.agentRate" placeholder="请输入代理抽成比例" />
        </el-form-item>
        <el-form-item label="商家抽成比例" prop="merchantRate">
          <el-input v-model="form.merchantRate" placeholder="请输入商家抽成比例" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listRate, getRate, delRate, addRate, updateRate, exportRate } from "@/api/business/rate";

export default {
  name: "Rate",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
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
      // 全局佣金配置表格数据
      rateList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        technicianRate: [
          { required: true, message: "技师抽成比例不能为空", trigger: "blur" }
        ],
        agentRate: [
          { required: true, message: "代理抽成比例不能为空", trigger: "blur" }
        ],
        merchantRate: [
          { required: true, message: "商家抽成比例不能为空", trigger: "blur" }
        ],
        createdTime: [
          { required: true, message: "新增时间不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询全局佣金配置列表 */
    getList() {
      this.loading = true;
      listRate(this.queryParams).then(response => {
        this.rateList = response.rows;
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
        technicianRate: null,
        agentRate: null,
        merchantRate: null,
        createdTime: null,
        modifiedTime: null,
        createdBy: null,
        modifiedBy: null
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
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加全局佣金配置";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getRate(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改全局佣金配置";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateRate(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    }
  }
};
</script>
