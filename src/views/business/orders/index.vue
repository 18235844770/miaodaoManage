<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">

      <!-- 服务名称 --> 
      <el-form-item label="服务名称" prop="serviceName">
        <el-input
          v-model="queryParams.serviceName"
          placeholder="请输入服务名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!-- 下单人 -->
      <el-form-item label="下单人" prop="userName">
        <el-input
          v-model="queryParams.userName"
          placeholder="请输入下单人"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!-- 技师姓名 -->
      <el-form-item label="技师姓名" prop="technicianName">
        <el-input
          v-model="queryParams.technicianName"
          placeholder="请输入技师姓名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!-- 系统订单号 -->
      <el-form-item label="系统订单号" prop="systemOrderNumber">
        <el-input
          v-model="queryParams.systemOrderNumber"
          placeholder="请输入系统订单号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!-- 代理商名称 -->
      <el-form-item label="代理商" prop="agentName">
        <el-input
          v-model="queryParams.agentName"
          placeholder="请输入代理商名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!-- 商家名称 -->
      <el-form-item label="商家" prop="merchantName">
        <el-input
          v-model="queryParams.merchantName"
          placeholder="请输入商家名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!-- 下单时间 -->
      <el-form-item label="下单时间" prop="orderTime">
        <el-date-picker clearable size="small"
          v-model="queryParams.orderTime"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择下单时间">
        </el-date-picker>
      </el-form-item>
      <!-- 开始时间 -->
      <el-form-item label="开始时间" prop="beginTime">
        <el-date-picker clearable size="small"
          v-model="queryParams.beginTime"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择开始时间">
        </el-date-picker>
      </el-form-item>
      <!-- 结束时间 -->
      <el-form-item label="结束时间" prop="endTime">
        <el-date-picker clearable size="small"
          v-model="queryParams.endTime"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择结束时间">
        </el-date-picker>
      </el-form-item> 
      <!-- 支付方式 -->
      <el-form-item label="支付方式" prop="paymentMethod">
        <el-select v-model="queryParams.paymentMethod" placeholder="请选择支付方式" clearable size="small">
          <el-option
            v-for="dict in dict.type.payment_method"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <!-- 状态 -->
      <el-form-item label="状态" prop="orderStatus">
        <el-select v-model="queryParams.orderStatus" placeholder="请选择订单状态" clearable size="small">
          <el-option
            v-for="dict in dict.type.order_status"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
        >导出</el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['business:orders:remove']"
        >删除</el-button>
      </el-col> -->
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="ordersList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="服务名称" align="center" prop="serviceName" />
      <el-table-column label="下单人" align="center" prop="userName" />
      <el-table-column label="技师姓名" align="center" prop="technicianName" />
      <el-table-column label="系统订单号" align="center" prop="systemOrderNumber" />
      <el-table-column label="服务开始时间" align="center" prop="serviceStartTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.serviceStartTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="服务结束时间" align="center" prop="serviceEndTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.serviceEndTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="出行费用" align="center" prop="travelCost" />
      <el-table-column label="原价" align="center" prop="originalPrice" />
      <el-table-column label="实收金额" align="center" prop="receivedAmount" />
      <el-table-column label="优惠总金额" align="center" prop="couponAmount" />
      <el-table-column label="商家名称" align="center" prop="merchantName" />
      <el-table-column label="代理商名称" align="center" prop="agentName" />
      <el-table-column label="下单时间" align="center" prop="orderTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.orderTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="支付方式" align="center" prop="paymentMethod">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.payment_method" :value="scope.row.paymentMethod"/>
        </template>
      </el-table-column>
      <el-table-column label="订单状态" align="center" prop="orderStatus">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.order_status" :value="scope.row.orderStatus"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <!-- <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleView(scope.row)"
            v-hasPermi="['business:orders:query']"
          >查看</el-button> -->
          <!-- <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['business:orders:remove']"
          >删除</el-button> -->
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

    <!-- 查看订单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="服务名称" prop="serviceName">
          <el-input v-model="form.serviceName" disabled />
        </el-form-item>
        <el-form-item label="下单人" prop="userName">
          <el-input v-model="form.userName" disabled />
        </el-form-item>
        <el-form-item label="技师姓名" prop="technicianName">
          <el-input v-model="form.technicianName" disabled />
        </el-form-item>
        <el-form-item label="服务方式" prop="serviceMethod">
          <el-input v-model="form.serviceMethod" disabled />
        </el-form-item>
        <el-form-item label="服务开始时间" prop="serviceStartTime">
          <el-date-picker clearable size="small"
            v-model="form.serviceStartTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            disabled>
          </el-date-picker>
        </el-form-item>
        <el-form-item label="服务结束时间" prop="serviceEndTime">
          <el-date-picker clearable size="small"
            v-model="form.serviceEndTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            disabled>
          </el-date-picker>
        </el-form-item>
        <el-form-item label="出行费用" prop="travelCost">
          <el-input v-model="form.travelCost" disabled />
        </el-form-item>
        <el-form-item label="服务项目费用" prop="serviceCost">
          <el-input v-model="form.serviceCost" disabled />
        </el-form-item>
        <el-form-item label="服务数量" prop="servceNum">
          <el-input v-model="form.servceNum" disabled />
        </el-form-item>
        <el-form-item label="原价" prop="originalPrice">
          <el-input v-model="form.originalPrice" disabled />
        </el-form-item>
        <el-form-item label="实收金额" prop="receivedAmount">
          <el-input v-model="form.receivedAmount" disabled />
        </el-form-item>
        <el-form-item label="系统订单号" prop="systemOrderNumber">
          <el-input v-model="form.systemOrderNumber" disabled />
        </el-form-item>
        <el-form-item label="付款订单号" prop="paymentOrderNumber">
          <el-input v-model="form.paymentOrderNumber" disabled />
        </el-form-item>
        <el-form-item label="代理商名称" prop="agentName">
          <el-input v-model="form.agentName" disabled />
        </el-form-item>
        <el-form-item label="下单时间" prop="orderTime">
          <el-date-picker clearable size="small"
            v-model="form.orderTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            disabled>
          </el-date-picker>
        </el-form-item>
        <el-form-item label="支付方式" prop="paymentMethod">
          <el-radio-group v-model="form.paymentMethod" disabled>
            <el-radio
              v-for="dict in dict.type.payment_method"
              :key="dict.value"
              :label="dict.value"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="订单状态" prop="orderStatus">
          <el-radio-group v-model="form.orderStatus" disabled>
            <el-radio
              v-for="dict in dict.type.order_status"
              :key="dict.value"
              :label="dict.value"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="orderRemark">
          <el-input v-model="form.orderRemark" disabled />
        </el-form-item>
        <el-form-item label="优惠券id" prop="couponId">
          <el-input v-model="form.couponId" disabled />
        </el-form-item>
        <el-form-item label="优惠总金额" prop="couponAmount">
          <el-input v-model="form.couponAmount" disabled />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listOrders, getOrders, delOrders, addOrders, updateOrders, exportOrders } from "@/api/business/orders";

export default {
  name: "Orders",
  dicts: ['order_status', 'payment_method'],
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
      // 订单表格数据
      ordersList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        serviceName: null,
        technicianName: null,
        technicianId: null,
        systemOrderNumber: null,
        customerPhoneNumber: null,
        beginTime: null,
        endTime: null,
        serviceMethod: null,
        agentName: null,
        merchantName: null,
        orderStatus: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询订单列表 */
    getList() {
      this.loading = true;
      listOrders(this.queryParams).then(response => {
        this.ordersList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 查看按钮操作 */
    handleView(row) {
      this.reset();
      const orderId = row.orderId || this.ids
      getOrders(orderId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "查看订单";
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
        orderId: null,
        serviceName: null,
        userName: null,
        technicianName: null,
        serviceMethod: null,
        serviceStartTime: null,
        serviceEndTime: null,
        travelCost: null,
        serviceCost: null,
        servceNum: null,
        originalPrice: null,
        receivedAmount: null,
        systemOrderNumber: null,
        paymentOrderNumber: null,
        agentName: null,
        orderTime: null,
        paymentMethod: null,
        orderStatus: null,
        orderRemark: null,
        couponId: null,
        couponAmount: null
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
      this.ids = selection.map(item => item.orderId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加订单";
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const orderIds = row.orderId || this.ids;
      this.$modal.confirm('是否确认删除订单编号为"' + orderIds + '"的数据项？').then(function() {
        return delOrders(orderIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$modal.confirm('是否确认导出所有订单数据项？').then(() => {
        this.exportLoading = true;
        return exportOrders(queryParams);
      }).then(response => {
        this.$download.name(response.msg);
        this.exportLoading = false;
      }).catch(() => {});
    }
  }
};
</script>
