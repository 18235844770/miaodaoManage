<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="客户昵称" prop="customerNickname">
        <el-input
          v-model="queryParams.customerNickname"
          placeholder="请输入客户昵称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="套餐名称" prop="packageName">
        <el-input
          v-model="queryParams.packageName"
          placeholder="请输入套餐名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="订单号" prop="systemOrderNumber">
        <el-input
          v-model="queryParams.systemOrderNumber"
          placeholder="请输入订单号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          :loading="exportLoading"
          @click="handleExport"
          v-hasPermi="['business:rechargeorder:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="rechargeorderList">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="下单客户的昵称" align="center" prop="customerNickname" />
      <el-table-column label="储值套餐名称" align="center" prop="packageName" />
      <el-table-column label="实际支付的金额" align="center" prop="actualPayment" />
      <el-table-column label="充值金额" align="center" prop="rechargeAmount" />
      <el-table-column label="系统订单号" align="center" prop="systemOrderNumber" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleView(scope.row)"
          >查看</el-button>
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

    <!-- 查看充值记录对话框 -->
    <el-dialog :title="'查看充值记录'" :visible.sync="viewOpen" width="500px" append-to-body>
      <el-form :model="viewForm" label-width="100px">
        <el-form-item label="下单客户的昵称">
          <el-input v-model="viewForm.customerNickname" disabled />
        </el-form-item>
        <el-form-item label="储值套餐名称">
          <el-input v-model="viewForm.packageName" disabled />
        </el-form-item>
        <el-form-item label="实际支付的金额">
          <el-input v-model="viewForm.actualPayment" disabled />
        </el-form-item>
        <el-form-item label="充值金额">
          <el-input v-model="viewForm.rechargeAmount" disabled />
        </el-form-item>
        <el-form-item label="系统订单号">
          <el-input v-model="viewForm.systemOrderNumber" disabled />
        </el-form-item>
        <el-form-item label="支付平台订单号">
          <el-input v-model="viewForm.paymentOrderNumber" disabled />
        </el-form-item>
        <el-form-item label="下单时间">
          <el-input v-model="viewForm.orderTime" disabled />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="viewOpen = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listRechargeorder, exportRechargeorder } from "@/api/business/rechargeorder";

export default {
  name: "Rechargeorder",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 充值记录表格数据
      rechargeorderList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        customerId: null,
        customerNickname: null,
        packageName: null,
        actualPayment: null,
        rechargeAmount: null,
        systemOrderNumber: null,
        paymentOrderNumber: null,
        isDeleted: null,
        orderMethod: null
      },
      // 查看弹窗
      viewOpen: false,
      viewForm: {}
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询充值记录列表 */
    getList() {
      this.loading = true;
      listRechargeorder(this.queryParams).then(response => {
        this.rechargeorderList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
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
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$modal.confirm('是否确认导出所有充值记录数据项？').then(() => {
        this.exportLoading = true;
        return exportRechargeorder(queryParams);
      }).then(response => {
        this.$download.name(response.msg);
        this.exportLoading = false;
      }).catch(() => {});
    },
    /** 查看按钮操作 */
    handleView(row) {
      this.viewForm = Object.assign({}, row);
      this.viewOpen = true;
    }
  }
};
</script>
