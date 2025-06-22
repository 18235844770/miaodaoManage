<template>
  <div class="app-container">
  
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          @click="handleUpdate"
          v-hasPermi="['order:carPrice:edit']"
        >修改全局车费配置</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="carPriceList">
      <el-table-column label="白天多少公里免费" align="center" prop="distanceFree" />
      <el-table-column label="起步价" align="center" prop="startPrice" />
      <el-table-column label="起步距离" align="center" prop="startDistance" />
      <el-table-column label="每公里多少钱" align="center" prop="distancePrice" />
      <el-table-column label="虚拟里程" align="center" prop="inventedDistance" />
      <el-table-column label="计价方式" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.cashType === 1 ? '默认' : '叠加' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="夜间多少公里免费" align="center" prop="distanceFreeNight" />
      <el-table-column label="夜间起步价" align="center" prop="startPriceNight" />
      <el-table-column label="夜间每公里多少钱" align="center" prop="distancePriceNight" />
      <el-table-column label="车费白天开始时间" align="center" prop="carPriceStart" />
      <el-table-column label="车费白天结束时间" align="center" prop="carPriceEnd" />
      <el-table-column label="夜间起步距离" align="center" prop="startDistanceNight" />
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 修改车费配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="多少公里免费" prop="distanceFree">
          <el-input-number v-model="form.distanceFree" :min="0" :precision="2" placeholder="请输入多少公里免费" />
        </el-form-item>
        <el-form-item label="起步价" prop="startPrice">
          <el-input-number v-model="form.startPrice" :min="0" :precision="2" placeholder="请输入起步价" />
        </el-form-item>
        <el-form-item label="起步距离" prop="startDistance">
          <el-input-number v-model="form.startDistance" :min="0" :precision="2" placeholder="请输入起步距离" />
        </el-form-item>
        <el-form-item label="每公里多少钱" prop="distancePrice">
          <el-input-number v-model="form.distancePrice" :min="0" :precision="2" placeholder="请输入每公里多少钱" />
        </el-form-item>
        <el-form-item label="计价方式" prop="cashType">
          <el-select v-model="form.cashType" placeholder="请选择计价方式">
            <el-option label="默认" :value="1" />
            <el-option label="叠加" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="虚拟里程" prop="inventedDistance">
          <el-input-number v-model="form.inventedDistance" :min="0" :precision="2" placeholder="请输入虚拟里程" />
        </el-form-item>
        <el-form-item label="夜间多少公里免费" prop="distanceFreeNight">
          <el-input-number v-model="form.distanceFreeNight" :min="0" :precision="2" placeholder="请输入夜间多少公里免费" />
        </el-form-item>
        <el-form-item label="夜间起步价" prop="startPriceNight">
          <el-input-number v-model="form.startPriceNight" :min="0" :precision="2" placeholder="请输入夜间起步价" />
        </el-form-item>
        <el-form-item label="夜间每公里多少钱" prop="distancePriceNight">
          <el-input-number v-model="form.distancePriceNight" :min="0" :precision="2" placeholder="请输入夜间每公里多少钱" />
        </el-form-item>
        <el-form-item label="车费白天开始时间" prop="carPriceStart">
          <el-time-picker
            v-model="form.carPriceStart"
            format="HH:mm"
            value-format="HH:mm"
            placeholder="请选择车费白天开始时间"
          />
        </el-form-item>
        <el-form-item label="车费白天结束时间" prop="carPriceEnd">
          <el-time-picker
            v-model="form.carPriceEnd"
            format="HH:mm"
            value-format="HH:mm"
            placeholder="请选择车费白天结束时间"
          />
        </el-form-item>
        <el-form-item label="夜间起步距离" prop="startDistanceNight">
          <el-input-number v-model="form.startDistanceNight" :min="0" :precision="2" placeholder="请输入夜间起步距离" />
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
import { listCarPrice, getCarPrice, updateCarPrice } from "@/api/order/carPrice";

export default {
  name: "CarPrice",
  dicts: ['car_price_type', 'car_price_cash_type'],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 车费配置表格数据
      carPriceList: [],
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
        distanceFree: [
          { required: true, message: "多少公里免费不能为空", trigger: "blur" }
        ],
        startPrice: [
          { required: true, message: "起步价不能为空", trigger: "blur" }
        ],
        startDistance: [
          { required: true, message: "起步距离不能为空", trigger: "blur" }
        ],
        distancePrice: [
          { required: true, message: "每公里多少钱不能为空", trigger: "blur" }
        ],
        type: [
          { required: true, message: "时间段类型不能为空", trigger: "change" }
        ],
        cashType: [
          { required: true, message: "计价方式不能为空", trigger: "change" }
        ],
        carPriceStart: [
          { required: true, message: "车费白天开始时间不能为空", trigger: "change" }
        ],
        carPriceEnd: [
          { required: true, message: "车费白天结束时间不能为空", trigger: "change" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询车费配置列表 */
    getList() {
      this.loading = true;
      listCarPrice(this.queryParams).then(response => {
        this.carPriceList = response.rows;
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
        distanceFree: null,
        startPrice: null,
        startDistance: null,
        distancePrice: null,
        inventedDistance: null,
        status: 0,
        type: null,
        cashType: null,
        distanceFreeNight: null,
        startPriceNight: null,
        distancePriceNight: null,
        cashTypeNight: null,
        carPriceStart: null,
        carPriceEnd: null,
        startDistanceNight: null
      };
      this.resetForm("form");
    },
    /** 修改按钮操作 */
    handleUpdate() {
      this.reset();
      // 获取第一条数据
      if (this.carPriceList.length > 0) {
        const id = this.carPriceList[0].id;
        getCarPrice(id).then(response => {
          this.form = response.data;
          this.open = true;
          this.title = "修改全局车费配置";
        });
      } else {
        this.$modal.msgError("未找到全局车费配置数据");
      }
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          updateCarPrice(this.form).then(response => {
            this.$modal.msgSuccess("修改成功");
            this.open = false;
            this.getList();
          });
        }
      });
    }
  }
};
</script>
