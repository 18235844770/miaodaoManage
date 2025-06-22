<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
     
      <el-form-item label="技师姓名" prop="technicianName">
        <el-input
          v-model="queryParams.technicianName"
          placeholder="请输入技师姓名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="手机号码" prop="phoneNumber">
        <el-input
          v-model="queryParams.phoneNumber"
          placeholder="请输入手机号码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="技师类型" prop="technicianType">
        <el-select v-model="queryParams.technicianType" placeholder="请选择技师类型" clearable size="small">
          <el-option label="个人" value="0" />
          <el-option label="挂靠" value="1" />
        </el-select>
      </el-form-item>
      <el-form-item label="代理商" prop="agentName">
        <el-input
          v-model="queryParams.agentName"
          placeholder="请输入代理商"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="门店" prop="merchantName">
        <el-input
          v-model="queryParams.merchantName"
          placeholder="请输入门店"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="服务状态" prop="isAcceptingOrders">
        <el-select v-model="queryParams.isAcceptingOrders" placeholder="请选择服务状态" clearable size="small">
          <el-option label="暂停接单" value="0" />
          <el-option label="接单中" value="1" />

        </el-select>
      </el-form-item>
      <el-form-item label="在线状态" prop="onlineStatus">
        <el-select v-model="queryParams.onlineStatus" placeholder="请选择在线状态" clearable size="small">
          <el-option label="离线" value="0" />
          <el-option label="在线" value="1" />
        </el-select>
      </el-form-item>
      <el-form-item label="保证金状态" prop="depositStatus">
        <el-select v-model="queryParams.depositStatus" placeholder="请选择保证金状态" clearable size="small">
          <el-option label="未缴纳" value="0" />
          <el-option label="已缴纳" value="1" />
        </el-select>
      </el-form-item>
      <el-form-item label="入驻审核状态" prop="entryAuditStatus">
        <el-select v-model="queryParams.entryAuditStatus" placeholder="请选择入驻审核状态" clearable size="small">
          <el-option label="未审核" value="0" />
          <el-option label="已审核" value="1" />
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
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['business:technicians:edit']"
        >修改</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="techniciansList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="技师姓名" align="center" prop="technicianName" />
      <el-table-column label="手机号码" align="center" prop="phoneNumber" />
      <el-table-column label="技师类型" align="center" prop="technicianType">
        <template slot-scope="scope">
          <span>{{ scope.row.technicianType === 0 ? '个人' : '挂靠' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="代理商" align="center" prop="agentName" />
      <el-table-column label="门店" align="center" prop="merchantName" />
      <el-table-column label="服务状态" align="center" prop="isAcceptingOrders">
        <template slot-scope="scope">
          <span>{{ scope.row.isAcceptingOrders === 1 ? '接单中' : '暂停接单' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="平台抽成比例" align="center" prop="platformRate" />
      <el-table-column label="在线状态" align="center" prop="onlineStatus">
        <template slot-scope="scope">
          <span>{{ scope.row.onlineStatus === 1 ? '在线' : '离线' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="保证金状态" align="center" prop="depositStatus">
        <template slot-scope="scope">
          <span>{{ scope.row.depositStatus === 1 ? '已缴纳' : '未缴纳' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单量" align="center" prop="orderQuantity" />
      <el-table-column label="入驻审核状态" align="center" prop="entryAuditStatus">
        <template slot-scope="scope">
          <span>{{ scope.row.entryAuditStatus === 1 ? '已审核' : '未审核' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['business:technicians:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-check"
            @click="handleAudit(scope.row)"
            v-hasPermi="['business:technicians:audit']"
            v-if="scope.row.entryAuditStatus !== 1"
          >入驻审核</el-button>
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

    <!-- 修改技师对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="技师姓名" prop="technicianName">
          <el-input v-model="form.technicianName" placeholder="请输入技师姓名" />
        </el-form-item>
        <el-form-item label="手机号码" prop="phoneNumber">
          <el-input v-model="form.phoneNumber" placeholder="请输入手机号码" disabled />
        </el-form-item>
        <el-form-item label="生活照" prop="lifeImage">
          <imageUpload v-model="form.lifeImage" uploadUrl="/common/upload" />
        </el-form-item>
        <el-form-item label="个人视频" prop="personalVideoIntroduction">
          <el-input v-model="form.personalVideoIntroduction" placeholder="请输入个人视频" />
        </el-form-item>
        <el-form-item label="虚拟订单量" prop="virtualOrderQuantity">
          <el-input v-model="form.virtualOrderQuantity" placeholder="请输入虚拟订单量" />
        </el-form-item>
        <el-form-item label="民族" prop="ethnicGroup">
          <el-input v-model="form.ethnicGroup" placeholder="请输入民族" />
        </el-form-item>
        <el-form-item label="籍贯" prop="nativePlace">
          <el-input v-model="form.nativePlace" placeholder="请输入籍贯" />
        </el-form-item>
        <el-form-item label="体重" prop="weight">
          <el-input v-model="form.weight" placeholder="请输入体重" />
        </el-form-item>
        <el-form-item label="身高" prop="height">
          <el-input v-model="form.height" placeholder="请输入身高" />
        </el-form-item>
        <el-form-item label="平台抽成比例" prop="platformRate">
          <el-input v-model="form.platformRate" placeholder="请输入平台抽成比例" />
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
import { listTechnicians, getTechnicians, delTechnicians, addTechnicians, updateTechnicians } from "@/api/business/technicians";

export default {
  name: "Technicians",
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
      // 技师表格数据
      techniciansList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        technicianName: null,
        phoneNumber: null,
        technicianType: null,
        agentName: null, 
        merchantName: null,
        isAcceptingOrders: null,
        onlineStatus: null,
        depositStatus: null,
        entryAuditStatus: null
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
    /** 查询技师列表 */
    getList() {
      this.loading = true;
      listTechnicians(this.queryParams).then(response => {
        this.techniciansList = response.rows;
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
        technicianId: null,
        userId: null,
        technicianName: null,
        technicianAvatar: null,
        gender: null,
        birthDate: null,
        phoneNumber: null,
        applicationTime: null,
        isBound: null,
        technicianType: null,
        certificationStatus: 0,
        authorizationStatus: 0,
        collectionNumber: null,
        agentId: null,
        merchantId: null,
        currentLocation: null,
        technicianIntroduction: null,
        idNumber: null,
        idCardFront: null,
        idCardBack: null,
        certificate: null,
        workImage: null,
        personalVideoIntroduction: null,
        virtualOrderQuantity: null,
        isAcceptingOrders: null,
        startTime: null,
        endTime: null,
        createTime: null,
        updateTime: null,
        isDeleted: null,
        isRecommended: null,
        lifeImage: null,
        ethnicGroup: null,
        nativePlace: null,
        weight: null,
        height: null,
        platformRate: null,
        onlineStatus: "0",
        depositStatus: "0",
        applicant: null,
        orderQuantity: null,
        praiseRate: null,
        entryAuditStatus: 0
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
      this.ids = selection.map(item => item.technicianId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加技师";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const technicianId = row.technicianId || this.ids
      getTechnicians(technicianId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改技师";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.technicianId != null) {
            updateTechnicians(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addTechnicians(this.form).then(response => {
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
      const technicianIds = row.technicianId || this.ids;
      this.$modal.confirm('是否确认删除技师编号为"' + technicianIds + '"的数据项？').then(function() {
        return delTechnicians(technicianIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 审核按钮操作 */
    handleAudit(row) {
      const technicianId = row.technicianId || this.ids;
      this.$modal.confirm('是否确认通过该技师的入驻申请？').then(function() {
        return updateTechnicians({
          technicianId: technicianId,
          entryAuditStatus: 1 // 1表示审核通过
        });
      }).then(() => { 
        this.getList();
        this.$modal.msgSuccess("审核通过成功");
      }).catch(() => {});
    }
  }
};
</script>
