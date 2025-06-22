<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="手机号码" prop="phoneNumber">
        <el-input
          v-model="queryParams.phoneNumber"
          placeholder="请输入手机号码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="用户昵称" prop="nickName">
        <el-input
          v-model="queryParams.nickName"
          placeholder="请输入用户昵称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="用户状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择用户状态" clearable size="small">
          <el-option
            v-for="dict in dict.type.sys_user_status"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="用户类型" prop="userType">
        <el-select v-model="queryParams.userType" placeholder="请选择用户类型" clearable size="small">
          <el-option
            v-for="dict in dict.type.sys_user_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="实名认证状态" prop="realNameStatus">
        <el-select v-model="queryParams.realNameStatus" placeholder="请选择实名认证状态" clearable size="small">
          <el-option
            v-for="dict in dict.type.sys_real_name_status"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item> -->
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
        >删除</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="userList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="手机号码" align="center" prop="phoneNumber" />
      <el-table-column label="用户昵称" align="center" prop="nickName" />
      <el-table-column label="用户头像" align="center" prop="avatar">
        <template slot-scope="scope">
          <el-image
            style="width: 50px; height: 50px"
            :src="scope.row.avatar"
            :preview-src-list="[scope.row.avatar]"
            fit="cover">
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="用户状态" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_user_status" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="用户类型" align="center" prop="userType">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_user_type" :value="scope.row.userType"/>
        </template>
      </el-table-column>
      <el-table-column label="账户余额" align="center" prop="balance" />
      <el-table-column label="冻结金额" align="center" prop="frozenBalance" />
      <el-table-column label="会员到期时间" align="center" prop="memberExpireTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.memberExpireTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="实名认证状态" align="center" prop="realNameStatus">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_real_name_status" :value="scope.row.realNameStatus"/>
        </template>
      </el-table-column> -->
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
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

    <!-- 添加或修改APP用户对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="手机号码" prop="phoneNumber">
          <el-input v-model="form.phoneNumber" placeholder="请输入手机号码" />
        </el-form-item>
        <el-form-item label="用户昵称" prop="nickName">
          <el-input v-model="form.nickName" placeholder="请输入用户昵称" />
        </el-form-item>
        <el-form-item label="用户头像" prop="avatar">
          <el-upload
            class="avatar-uploader"
            :action="upload.url"
            :headers="upload.headers"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="form.avatar" :src="form.avatar" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="用户状态">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in dict.type.sys_user_status"
              :key="dict.value"
              :label="dict.value"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- <el-form-item label="用户类型" prop="userType">
          <el-select v-model="form.userType" placeholder="请选择用户类型">
            <el-option
              v-for="dict in dict.type.sys_user_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item> -->
        <el-form-item label="所在省份" prop="province">
          <el-input v-model="form.province" placeholder="请输入所在省份" />
        </el-form-item>
        <el-form-item label="所在城市" prop="city">
          <el-input v-model="form.city" placeholder="请输入所在城市" />
        </el-form-item>
        <el-form-item label="所在区县" prop="district">
          <el-input v-model="form.district" placeholder="请输入所在区县" />
        </el-form-item>
        <el-form-item label="详细地址" prop="address">
          <el-input v-model="form.address" placeholder="请输入详细地址" />
        </el-form-item>
        <el-form-item label="个性签名" prop="signature">
          <el-input v-model="form.signature" placeholder="请输入个性签名" />
        </el-form-item>
        <el-form-item label="民族" prop="ethnicGroup">
          <el-input v-model="form.ethnicGroup" placeholder="请输入民族" />
        </el-form-item>
        <el-form-item label="籍贯" prop="nativePlace">
          <el-input v-model="form.nativePlace" placeholder="请输入籍贯" />
        </el-form-item>
        <el-form-item label="实名认证状态">
          <el-radio-group v-model="form.realNameStatus">
            <el-radio
              v-for="dict in dict.type.sys_real_name_status"
              :key="dict.value"
              :label="dict.value"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
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
import { listUser, getUser, delUser, addUser, updateUser } from "@/api/business/user";
import { getToken } from "@/utils/auth";

export default {
  name: "User",
  dicts: ['sys_user_status', 'sys_user_type', 'sys_real_name_status'],
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
      // APP用户表格数据
      userList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        phoneNumber: null,
        nickName: null,
        status: null,
        userType: null,
        realNameStatus: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        phoneNumber: [
          { required: true, message: "手机号码不能为空", trigger: "blur" }
        ],
        createTime: [
          { required: true, message: "创建时间不能为空", trigger: "blur" }
        ],
      },
      // 上传参数
      upload: {
        url: process.env.VUE_APP_BASE_API + "/common/upload",
        headers: { Authorization: "Bearer " + getToken() }
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询APP用户列表 */
    getList() {
      this.loading = true;
      listUser(this.queryParams).then(response => {
        this.userList = response.rows;
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
        userId: null,
        phoneNumber: null,
        nickName: null,
        avatar: null,
        sex: null,
        birthday: null,
        status: "0",
        userType: null,
        balance: null,
        frozenBalance: null,
        memberExpireTime: null,
        wxOpenid: null,
        aliUserId: null,
        defaultAddressId: null,
        province: null,
        city: null,
        district: null,
        address: null,
        longitude: null,
        latitude: null,
        signature: null,
        followCount: null,
        fansCount: null,
        postCount: null,
        favoriteCount: null,
        commentCount: null,
        ethnicGroup: null,
        nativePlace: null,
        realNameStatus: "0",
        createTime: null,
        updateTime: null,
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
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.userId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加APP用户";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const userId = row.userId || this.ids
      getUser(userId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改APP用户";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.userId != null) {
            updateUser(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addUser(this.form).then(response => {
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
      const userIds = row.userId || this.ids;
      this.$modal.confirm('是否确认删除APP用户编号为"' + userIds + '"的数据项？').then(function() {
        return delUser(userIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 头像上传成功处理 */
    handleAvatarSuccess(res, file) {
      console.log(res, file);

      if (res.code === 200) {
        this.form.avatar = res.url;
        this.$modal.msgSuccess("上传成功");
      } else {
        this.$modal.msgError("上传失败");
      }
    },
    /** 上传前图片格式校验 */
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
      const isLt10M = file.size / 1024 / 1024 < 10;

      if (!isJPG) {
        this.$modal.msgError('上传头像图片只能是 JPG/PNG 格式!');
      }
      if (!isLt10M) {
        this.$modal.msgError('上传头像图片大小不能超过 10MB!');
      }
      return isJPG && isLt10M;
    },
  }
};
</script>

<style scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}
.avatar {
  width: 100px;
  height: 100px;
  display: block;
  object-fit: cover;
}
</style>
