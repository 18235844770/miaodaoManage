<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="服务名称" prop="serviceName">
        <el-input
          v-model="queryParams.serviceName"
          placeholder="请输入服务名称"
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
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['business:management:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['business:management:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['business:management:remove']"
        >删除</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="managementList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="服务名称" align="center" prop="serviceName" />
      <el-table-column label="副标题" align="center" prop="subtitle" />
      <el-table-column label="封面图1" align="center" prop="coverImage" >
        <template slot-scope="scope">
          <!-- <el-image :src="scope.row.coverImage" :preview-src-list="[scope.row.coverImage]" fit="cover" /> -->
          <ImagePreview :src="scope.row.coverImage" width="100" height="100" />

        </template>
      </el-table-column>
      <el-table-column label="价格" align="center" prop="servicePrice" />
      <el-table-column label="原价" align="center" prop="originalPrice" />
      <el-table-column label="总销售量" align="center" >
        <template slot-scope="scope">
          <span>{{ scope.row.serviceCount + scope.row.virtualSales }}</span>
        </template>
      </el-table-column>
      <el-table-column label="时长" align="center" prop="serviceDuration" />
      <el-table-column label="项目介绍" align="center" prop="projectIntroduction" />
      <el-table-column label="按摩部位" align="center" prop="massagePart" />
      <el-table-column label="服务姿势" align="center" prop="servicePosture" />
      <el-table-column label="适宜人群" align="center" prop="suitableCrowd" />
      <el-table-column label="功效介绍" align="center" prop="effectIntroduction" />
      <el-table-column label="用品提供" align="center" prop="suppliesProvided" />
      <el-table-column label="服务流程" align="center" prop="serviceProcess" />
      <el-table-column label="想约数" align="center" prop="wantOrderQuantity" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['business:management:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['business:management:remove']"
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

    <!-- 添加或修改服务项目对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="服务名称" prop="serviceName">
          <el-input v-model="form.serviceName" placeholder="请输入服务名称" />
        </el-form-item>
        <el-form-item label="副标题" prop="subtitle">
          <el-input v-model="form.subtitle" placeholder="请输入副标题" />
        </el-form-item>
        <el-form-item label="封面图">
          <imageUpload v-model="form.coverImage"/>
        </el-form-item>
        <el-form-item label="价格" prop="servicePrice">
          <el-input v-model="form.servicePrice" placeholder="请输入价格" />
        </el-form-item>
        <el-form-item label="原价" prop="originalPrice">
          <el-input v-model="form.originalPrice" placeholder="请输入原价" />
        </el-form-item>
        <el-form-item label="物料费" prop="materialCost">
          <el-input v-model="form.materialCost" placeholder="请输入物料费" />
        </el-form-item>
        <el-form-item label="实际销售量" prop="serviceCount">
          <el-input v-model="form.serviceCount" placeholder="请输入实际销售量" />
        </el-form-item>
        <el-form-item label="虚拟销售量" prop="virtualSales">
          <el-input v-model="form.virtualSales" placeholder="请输入虚拟销售量" />
        </el-form-item>
        <el-form-item label="时长" prop="serviceDuration">
          <el-input v-model="form.serviceDuration" placeholder="请输入时长" />
        </el-form-item>
        <el-form-item label="排序值" prop="sortValue">
          <el-input v-model="form.sortValue" placeholder="请输入排序值" />
        </el-form-item>
        <el-form-item label="项目介绍">
          <el-input v-model="form.projectIntroduction" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="禁忌说明">
          <el-input v-model="form.tabooNotes" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="下单须知">
          <el-input v-model="form.orderNotes" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="是否删除">
          <el-input v-model="form.isDeleted" placeholder="请输入是否删除" />
        </el-form-item>
        <el-form-item label="按摩部位" prop="massagePart">
          <el-input v-model="form.massagePart" placeholder="请输入按摩部位" />
        </el-form-item>
        <el-form-item label="服务姿势" prop="servicePosture">
          <el-input v-model="form.servicePosture" placeholder="请输入服务姿势" />
        </el-form-item>
        <el-form-item label="适宜人群" prop="suitableCrowd">
          <el-input v-model="form.suitableCrowd" placeholder="请输入适宜人群" />
        </el-form-item>
        <el-form-item label="功效介绍" prop="effectIntroduction">
          <el-input v-model="form.effectIntroduction" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="用品提供" prop="suppliesProvided">
          <el-input v-model="form.suppliesProvided" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="服务流程" prop="serviceProcess">
          <el-input v-model="form.serviceProcess" type="textarea" placeholder="请输入内容" />
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
import { listManagement, getManagement, delManagement, addManagement, updateManagement, exportManagement } from "@/api/business/management";

export default {
  name: "Management",
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
      // 服务项目表格数据
      managementList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        serviceName: null,
        subtitle: null,
        coverImage: null,
        carouselImages: null,
        servicePrice: null,
        originalPrice: null,
        materialCost: null,
        serviceCount: null,
        virtualSales: null,
        serviceDuration: null,
        sortValue: null,
        projectIntroduction: null,
        tabooNotes: null,
        orderNotes: null,
        isDeleted: null,
        massagePart: null,
        servicePosture: null,
        suitableCrowd: null,
        effectIntroduction: null,
        suppliesProvided: null,
        serviceProcess: null,
        praiseRate: null
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
    /** 查询服务项目列表 */
    getList() {
      this.loading = true;
      listManagement(this.queryParams).then(response => {
        this.managementList = response.rows;
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
        serviceId: null,
        serviceName: null,
        subtitle: null,
        coverImage: null,
        carouselImages: null,
        servicePrice: null,
        originalPrice: null,
        materialCost: null,
        serviceCount: null,
        virtualSales: null,
        serviceDuration: null,
        sortValue: null,
        projectIntroduction: null,
        tabooNotes: null,
        orderNotes: null,
        createTime: null,
        updateTime: null,
        isDeleted: null,
        massagePart: null,
        servicePosture: null,
        suitableCrowd: null,
        effectIntroduction: null,
        suppliesProvided: null,
        serviceProcess: null,
        praiseRate: null
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
      this.ids = selection.map(item => item.serviceId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加服务项目";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const serviceId = row.serviceId || this.ids
      getManagement(serviceId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改服务项目";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.serviceId != null) {
            updateManagement(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addManagement(this.form).then(response => {
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
      const serviceIds = row.serviceId || this.ids;
      this.$modal.confirm('是否确认删除服务项目编号为"' + serviceIds + '"的数据项？').then(function() {
        return delManagement(serviceIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$modal.confirm('是否确认导出所有服务项目数据项？').then(() => {
        this.exportLoading = true;
        return exportManagement(queryParams);
      }).then(response => {
        this.$download.name(response.msg);
        this.exportLoading = false;
      }).catch(() => {});
    }
  }
};
</script>
