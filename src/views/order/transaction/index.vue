<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['order:transaction:edit']"
        >修改</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="transactionList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="提现方式,逗号分隔" align="center" prop="withdrawalMethods" />
      <el-table-column label="转账方式,逗号分隔" align="center" prop="transferMethods" />
      <el-table-column label="订单超时时间" align="center" prop="orderTimeoutMinutes" />
      <el-table-column label="技师间隔时间" align="center" prop="technicianIntervalMinutes" />
      <el-table-column label="最长预约时间" align="center" prop="maxSchedulingDays" />
      <el-table-column label="时长单位值" align="center" prop="durationUnitValue" />
      <el-table-column label="运营费" align="center" prop="operationFee" />
      <el-table-column label="运营费规则" align="center" prop="operationFeeRule" />
      <el-table-column label="商家保证金" align="center" prop="merchantReserveFund" />
      <el-table-column label="技师保证金" align="center" prop="personalTechnicianReserveFund" />
      <el-table-column label="代理保证金" align="center" prop="agentReserveFund" />
      <el-table-column label="技师距离限制开关" align="center" prop="technicianDistanceLimitEnabled">
        <template slot-scope="scope">
          <el-tag :type="scope.row.technicianDistanceLimitEnabled === 1 ? 'success' : 'danger'">
            {{ scope.row.technicianDistanceLimitEnabled === 1 ? '开启' : '关闭' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="技师最大距离限制(公里)" align="center" prop="technicianMaxDistanceKm" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['order:transaction:edit']"
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

    <!-- 修改全局交易配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1000px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="200px">
        <el-form-item label="提现方式，多个用逗号分隔" prop="withdrawalMethods">
          <el-input v-model="form.withdrawalMethods" placeholder="请输入提现方式，多个用逗号分隔" />
        </el-form-item>
        <el-form-item label="转账方式，多个用逗号分隔" prop="transferMethods">
          <el-input v-model="form.transferMethods" placeholder="请输入转账方式，多个用逗号分隔" />
        </el-form-item>
        <el-form-item label="订单超时时间，以分钟为单位" prop="orderTimeoutMinutes">
          <el-input v-model="form.orderTimeoutMinutes" placeholder="请输入订单超时时间，以分钟为单位" />
        </el-form-item>
        <el-form-item label="技师间隔时间，以分钟为单位" prop="technicianIntervalMinutes">
          <el-input v-model="form.technicianIntervalMinutes" placeholder="请输入技师间隔时间，以分钟为单位" />
        </el-form-item>
        <el-form-item label="最长预约时间，以天为单位" prop="maxSchedulingDays">
          <el-input v-model="form.maxSchedulingDays" placeholder="请输入最长预约时间，以天为单位" />
        </el-form-item>
        <el-form-item label="时长单位值" prop="durationUnitValue">
          <el-input v-model="form.durationUnitValue" placeholder="请输入时长单位值" />
        </el-form-item>
        <el-form-item label="运营费" prop="operationFee">
          <el-input v-model="form.operationFee" placeholder="请输入运营费" />
        </el-form-item>
        <el-form-item label="运营费规则" prop="operationFeeRule">
          <el-input v-model="form.operationFeeRule" placeholder="请输入运营费规则" />
        </el-form-item>
        <el-form-item label="商家保证金" prop="merchantReserveFund">
          <el-input v-model="form.merchantReserveFund" placeholder="请输入商家保证金" />
        </el-form-item>
        <el-form-item label="技师保证金" prop="personalTechnicianReserveFund">
          <el-input v-model="form.personalTechnicianReserveFund" placeholder="请输入技师保证金" />
        </el-form-item>
        <el-form-item label="代理保证金" prop="agentReserveFund">
          <el-input v-model="form.agentReserveFund" placeholder="请输入代理保证金" />
        </el-form-item>
        <el-form-item label="技师距离限制开关" prop="technicianDistanceLimitEnabled">
          <el-radio-group v-model="form.technicianDistanceLimitEnabled">
            <el-radio :label="1">开启</el-radio>
            <el-radio :label="0">关闭</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="技师最大距离限制(公里)" prop="technicianMaxDistanceKm">
          <el-input v-model="form.technicianMaxDistanceKm" placeholder="请输入技师最大距离限制，单位为公里" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" />
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
import { listTransaction, getTransaction, updateTransaction} from "@/api/order/transaction";

export default {
  name: "Transaction",
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
      // 全局交易配置表格数据
      transactionList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        technicianMaxDistanceKm: [
          { required: false, message: "请输入技师最大距离限制", trigger: "blur" },
          { type: "number", min: 1, max: 1000, message: "距离限制必须在1-1000公里之间", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询全局交易配置列表 */
    getList() {
      this.loading = true;
      listTransaction(this.queryParams).then(response => {
        this.transactionList = response.rows;
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
        withdrawalMethods: null,
        transferMethods: null,
        orderTimeoutMinutes: null,
        technicianIntervalMinutes: null,
        maxSchedulingDays: null,
        durationUnitValue: null,
        operationFee: null,
        operationFeeRule: null,
        merchantReserveFund: null,
        personalTechnicianReserveFund: null,
        agentReserveFund: null,
        technicianDistanceLimitEnabled: null,
        technicianMaxDistanceKm: null,
        remark: null
      };
      this.resetForm("form");
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getTransaction(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改全局交易配置";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateTransaction(this.form).then(response => {
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
