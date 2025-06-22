<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="用户姓名" prop="userName">
        <el-input
          v-model="queryParams.userName"
          placeholder="请输入用户姓名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="提现账号" prop="accountNo">
        <el-input
          v-model="queryParams.accountNo"
          placeholder="请输入提现账号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable size="small">
          <el-option
            v-for="dict in dict.type.withdraw_record_status"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="申请时间" prop="applyTime">
        <el-date-picker clearable size="small"
          v-model="queryParams.applyTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择申请时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['business:record:edit']"
        >审核</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-check"
          size="mini"
          :disabled="multiple"
          @click="handleBatchAudit"
          v-hasPermi="['business:record:edit']"
        >批量审核</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          :loading="exportLoading"
          @click="handleExport"
          v-hasPermi="['business:record:export']"
        >导出</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['business:record:remove']"
        >删除</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="recordList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="用户" align="center" prop="userName" />
      <el-table-column label="提现金额" align="center" prop="amount">
        <template slot-scope="scope">
          <span style="color: #e6a23c; font-weight: bold;">¥{{ scope.row.amount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="账号类型" align="center" prop="accountType">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.withdraw_record_account_type" :value="scope.row.accountType"/>
        </template>
      </el-table-column>
      <el-table-column label="账户姓名" align="center" prop="accountName" />
      <el-table-column label="提现账号" align="center" prop="accountNo" width="180">
        <template slot-scope="scope">
          <el-tooltip :content="scope.row.accountNo" placement="top">
            <span>{{ scope.row.accountNo }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="银行名称" align="center" prop="bankName" />
      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.withdraw_record_status" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="审核批注" align="center" prop="auditRemark" width="200">
        <template slot-scope="scope">
          <el-tooltip v-if="scope.row.auditRemark" :content="scope.row.auditRemark" placement="top">
            <span style="color: #409EFF; cursor: pointer;">{{ scope.row.auditRemark.length > 15 ? scope.row.auditRemark.substring(0, 15) + '...' : scope.row.auditRemark }}</span>
          </el-tooltip>
          <span v-else style="color: #909399;">-</span>
        </template>
      </el-table-column>
      <el-table-column label="申请时间" align="center" prop="applyTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.applyTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="打款时间" align="center" prop="payTime" width="180">
        <template slot-scope="scope">
          <span v-if="scope.row.payTime">{{ parseTime(scope.row.payTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
          <span v-else style="color: #909399;">-</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="200">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleView(scope.row)"
            v-hasPermi="['business:record:query']"
          >查看</el-button>
          <el-button
            v-if="scope.row.status === 0"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['business:record:edit']"
          >审核</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['business:record:remove']"
          >删除</el-button>
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

    <!-- 添加或审核用户提现记录对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="审核状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择状态">
            <el-option
              v-for="dict in dict.type.withdraw_record_status"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="审核批注" prop="auditRemark">
          <el-input v-model="form.auditRemark" type="textarea" placeholder="请输入审核批注" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 查看提现详情对话框 -->
    <el-dialog title="提现详情" :visible.sync="viewOpen" width="600px" append-to-body>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="用户姓名">{{ viewForm.userName }}</el-descriptions-item>
        <el-descriptions-item label="提现金额">
          <span style="color: #e6a23c; font-weight: bold; font-size: 16px;">¥{{ viewForm.amount }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="账号类型">
          <dict-tag :options="dict.type.withdraw_record_account_type" :value="viewForm.accountType"/>
        </el-descriptions-item>
        <el-descriptions-item label="账户姓名">{{ viewForm.accountName }}</el-descriptions-item>
        <el-descriptions-item label="提现账号" :span="2">
          <el-input v-model="viewForm.accountNo" readonly>
            <el-button slot="append" icon="el-icon-document-copy" @click="copyAccountNo"></el-button>
          </el-input>
        </el-descriptions-item>
        <el-descriptions-item label="银行名称" v-if="viewForm.bankName">{{ viewForm.bankName }}</el-descriptions-item>
        <el-descriptions-item label="申请时间">{{ parseTime(viewForm.applyTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</el-descriptions-item>
        <el-descriptions-item label="打款时间" v-if="viewForm.payTime">
          {{ parseTime(viewForm.payTime, '{y}-{m}-{d} {h}:{i}:{s}') }}
        </el-descriptions-item>
        <el-descriptions-item label="状态">
          <dict-tag :options="dict.type.withdraw_record_status" :value="viewForm.status"/>
        </el-descriptions-item>
        <el-descriptions-item label="审核批注" :span="2" v-if="viewForm.auditRemark">
          <el-input v-model="viewForm.auditRemark" type="textarea" readonly :rows="3"></el-input>
        </el-descriptions-item>
        <el-descriptions-item label="审核批注" :span="2" v-else>
          <span style="color: #909399;">暂无审核批注</span>
        </el-descriptions-item>
      </el-descriptions>
      <div slot="footer" class="dialog-footer">
        <el-button @click="viewOpen = false">关 闭</el-button>
      </div>
    </el-dialog>

    <!-- 批量审核对话框 -->
    <el-dialog title="批量审核" :visible.sync="batchOpen" width="500px" append-to-body>
      <el-form ref="batchForm" :model="batchForm" :rules="batchRules" label-width="80px">
        <el-form-item label="审核状态" prop="status">
          <el-select v-model="batchForm.status" placeholder="请选择状态">
            <el-option
              v-for="dict in dict.type.withdraw_record_status"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="审核批注" prop="auditRemark">
          <el-input v-model="batchForm.auditRemark" type="textarea" placeholder="请输入审核批注" />
        </el-form-item>
        <el-form-item label="选中记录">
          <el-tag v-for="item in selectedRecords" :key="item.id" style="margin-right: 5px; margin-bottom: 5px;">
            {{ item.userName }} - ¥{{ item.amount }}
          </el-tag>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitBatchForm">确 定</el-button>
        <el-button @click="batchOpen = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listRecord, getRecord, delRecord, addRecord, updateRecord, batchUpdateRecord, exportRecord } from "@/api/business/record";

export default {
  name: "Record",
  dicts: ['withdraw_record_status', 'withdraw_record_account_type'],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
      // 选中数组
      ids: [],
      // 子表选中数据
      checkedAppUser: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 用户提现记录表格数据
      recordList: [],
      // APP用户表格数据
      appUserList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userName: null,
        accountNo: null,
        status: null,
        applyTime: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        status: [
          { required: true, message: "请选择审核状态", trigger: "change" }
        ],
        auditRemark: [
          { required: true, message: "请输入审核批注", trigger: "blur" }
        ]
      },
      // 查看表单参数
      viewForm: {},
      // 是否显示查看对话框
      viewOpen: false,
      // 批量审核对话框
      batchOpen: false,
      // 批量审核表单参数
      batchForm: {},
      // 批量审核表单校验
      batchRules: {
        status: [
          { required: true, message: "请选择审核状态", trigger: "change" }
        ],
        auditRemark: [
          { required: true, message: "请输入审核批注", trigger: "blur" }
        ]
      },
      // 选中记录
      selectedRecords: []
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询用户提现记录列表 */
    getList() {
      this.loading = true;
      listRecord(this.queryParams).then(response => {
        this.recordList = response.rows;
        this.total = response.total;
        this.loading = false;
      }).catch(error => {
        this.loading = false;
        this.$modal.msgError("查询提现记录失败：" + (error.message || error));
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
        status: null,
        auditRemark: null
      };
      this.appUserList = [];
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
      this.selectedRecords = selection
    },
    /** 审核按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getRecord(id).then(response => {
        this.form = response.data;
        this.appUserList = response.data.appUserList;
        this.open = true;
        this.title = "审核用户提现记录";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.form.appUserList = this.appUserList;
          if (this.form.id != null) {
            updateRecord(this.form).then(response => {
              this.$modal.msgSuccess("审核成功");
              this.open = false;
              this.getList();
            }).catch(error => {
              this.$modal.msgError("审核失败：" + (error.message || error));
            });
          } else {
            addRecord(this.form).then(response => {
              this.getList();
            }).catch(error => {
              this.$modal.msgError("新增失败：" + (error.message || error));
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除？').then(function() {
        return delRecord(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 查看按钮操作 */
    handleView(row) {
      this.viewForm = row;
      this.viewOpen = true;
    },
    // 复制提现账号
    copyAccountNo() {
      const input = document.createElement('input');
      input.value = this.viewForm.accountNo;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      this.$message.success('提现账号已复制到剪贴板');
    },
    // 批量审核按钮操作
    handleBatchAudit() {
      if (this.selectedRecords.length === 0) {
        this.$message.warning('请选择要审核的记录');
        return;
      }
      
      // 过滤掉已审核的记录
      const pendingRecords = this.selectedRecords.filter(record => record.status === 0);
      if (pendingRecords.length === 0) {
        this.$message.warning('选中的记录都已审核，无法批量审核');
        return;
      }
      
      if (pendingRecords.length !== this.selectedRecords.length) {
        this.$message.warning(`选中的 ${this.selectedRecords.length} 条记录中，有 ${this.selectedRecords.length - pendingRecords.length} 条已审核，将只审核 ${pendingRecords.length} 条待审核记录`);
      }
      
      this.selectedRecords = pendingRecords;
      this.batchForm = {
        status: null,
        auditRemark: ''
      };
      this.batchOpen = true;
    },
    // 提交批量审核表单
    submitBatchForm() {
      this.$refs["batchForm"].validate(valid => {
        if (valid) {
          this.$modal.confirm('确认批量审核选中的 ' + this.selectedRecords.length + ' 条记录？').then(() => {
            // 构建批量审核数据
            const batchData = {
              status: this.batchForm.status,
              auditRemark: this.batchForm.auditRemark,
              recordIds: this.selectedRecords.map(item => item.id)
            };
            
            // 调用批量审核API
            this.loading = true;
            batchUpdateRecord(batchData).then(response => {
              this.loading = false;
              this.$modal.msgSuccess("批量审核成功");
              this.batchOpen = false;
              this.getList();
            }).catch(error => {
              this.loading = false;
              this.$modal.msgError("批量审核失败：" + (error.message || error));
            });
          }).catch(() => {});
        }
      });
    },
    // 导出按钮操作
    handleExport() {
      this.$modal.confirm('是否确认导出所有提现记录数据项?').then(() => {
        this.exportLoading = true;
        exportRecord(this.queryParams).then(response => {
          this.download(response.msg);
          this.exportLoading = false;
        });
      }).catch(() => {});
    }
  }
};
</script>
