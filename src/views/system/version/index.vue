<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="版本号" prop="versionNumber">
        <el-input
          v-model="queryParams.versionNumber"
          placeholder="请输入版本号"
          clearable
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="版本名称" prop="versionName">
        <el-input
          v-model="queryParams.versionName"
          placeholder="请输入版本名称"
          clearable
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="版本类型" prop="versionType">
        <el-select v-model="queryParams.versionType" placeholder="版本类型" clearable style="width: 240px">
          <el-option
            v-for="dict in dict.type.version_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="发布状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="发布状态" clearable style="width: 240px">
          <el-option
            v-for="dict in dict.type.version_status"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间">
        <el-date-picker
          v-model="dateRange"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
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
          v-hasPermi="['system:version:add']"
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
          v-hasPermi="['system:version:edit']"
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
          v-hasPermi="['system:version:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:version:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="versionList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="版本ID" align="center" prop="versionId" />
      <el-table-column label="版本号" align="center" prop="versionNumber" :show-overflow-tooltip="true" />
      <el-table-column label="版本名称" align="center" prop="versionName" :show-overflow-tooltip="true" />
      <el-table-column label="版本描述" align="center" prop="versionDesc" :show-overflow-tooltip="true" />
      <el-table-column label="版本类型" align="center" prop="versionType">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.version_type" :value="scope.row.versionType"/>
        </template>
      </el-table-column>
      <el-table-column label="发布状态" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.version_status" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="强制更新" align="center" prop="forceUpdate">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_yes_no" :value="scope.row.forceUpdate"/>
        </template>
      </el-table-column>
      <el-table-column label="发布时间" align="center" prop="releaseTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.releaseTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:version:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:version:remove']"
          >删除</el-button>
          <el-button
            v-if="scope.row.status === '0'"
            size="mini"
            type="text"
            icon="el-icon-upload2"
            @click="handlePublish(scope.row)"
            v-hasPermi="['system:version:publish']"
          >发布</el-button>
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

    <!-- 添加或修改系统版本对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="版本号" prop="versionNumber">
              <el-input v-model="form.versionNumber" placeholder="请输入版本号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="版本名称" prop="versionName">
              <el-input v-model="form.versionName" placeholder="请输入版本名称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="版本类型" prop="versionType">
              <el-select v-model="form.versionType" placeholder="请选择版本类型">
                <el-option
                  v-for="dict in dict.type.version_type"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发布状态" prop="status">
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="dict in dict.type.version_status"
                  :key="dict.value"
                  :label="dict.value"
                >{{dict.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="强制更新" prop="forceUpdate">
              <el-radio-group v-model="form.forceUpdate">
                <el-radio
                  v-for="dict in dict.type.sys_yes_no"
                  :key="dict.value"
                  :label="dict.value"
                >{{dict.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发布时间" prop="releaseTime">
              <el-date-picker
                v-model="form.releaseTime"
                type="datetime"
                placeholder="选择发布时间"
                value-format="yyyy-MM-dd HH:mm:ss"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="下载地址" prop="downloadUrl">
              <el-input v-model="form.downloadUrl" placeholder="请输入下载地址" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="版本描述" prop="versionDesc">
              <el-input v-model="form.versionDesc" type="textarea" placeholder="请输入版本描述" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" type="textarea" placeholder="请输入备注" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listVersion, getVersion, delVersion, addVersion, updateVersion, publishVersion } from "@/api/system/version";

export default {
  name: "Version",
  dicts: ['version_type', 'version_status', 'sys_yes_no'],
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
      // 系统版本表格数据
      versionList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 日期范围
      dateRange: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        versionNumber: null,
        versionName: null,
        versionType: null,
        status: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        versionNumber: [
          { required: true, message: "版本号不能为空", trigger: "blur" }
        ],
        versionName: [
          { required: true, message: "版本名称不能为空", trigger: "blur" }
        ],
        versionType: [
          { required: true, message: "版本类型不能为空", trigger: "change" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询系统版本列表 */
    getList() {
      this.loading = true;
      listVersion(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.versionList = response.rows;
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
        versionId: null,
        versionNumber: null,
        versionName: null,
        versionDesc: null,
        versionType: "1",
        status: "0",
        forceUpdate: "0",
        downloadUrl: null,
        releaseTime: null,
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
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.versionId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加系统版本";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const versionId = row.versionId || this.ids
      getVersion(versionId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改系统版本";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.versionId != null) {
            updateVersion(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addVersion(this.form).then(response => {
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
      const versionIds = row.versionId || this.ids;
      this.$modal.confirm('是否确认删除系统版本编号为"' + versionIds + '"的数据项？').then(function() {
        return delVersion(versionIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 发布按钮操作 */
    handlePublish(row) {
      const versionId = row.versionId;
      this.$modal.confirm('是否确认发布版本"' + row.versionName + '"？').then(function() {
        return publishVersion(versionId);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("发布成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/version/export', {
        ...this.queryParams
      }, `version_${new Date().getTime()}.xlsx`)
    }
  }
};
</script> 