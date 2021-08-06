<template>
  <div class="app-container">
    <h1>订单列表</h1>
    <!-- 条件查询表单 -->
    <el-form :inline="true" :model="orderQueryDTO" class="demo-form-inline">
      <el-form-item label="查询条件">
        <el-select v-model="orderQueryDTO.queryKey" placeholder="请选择查询条件" clearable>
          <el-option-group v-for="group in options" :key="group.label" :label="group.label">
            <el-option
              v-for="item in group.options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
              <span style="float: left">{{ item.label }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
            </el-option>
          </el-option-group>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="orderQueryDTO.queryValue" placeholder="请输入查询内容" clearable></el-input>
      </el-form-item>

      <el-form-item label="订单状态">
        <el-select v-model="orderQueryDTO.status" placeholder="请选择查询条件" clearable>
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="添加时间">
        <el-date-picker
          v-model="orderQueryDTO.begin"
          type="datetime"
          placeholder="选择开始时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="orderQueryDTO.end"
          type="datetime"
          placeholder="选择截止时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>
      <el-form-item>
        <el-button round type="primary" icon="el-icon-search" @click="getList()">查询</el-button>
        <el-button round type="danger " icon="el-icon-delete" @click="resetteacherQueryDTO()">清空</el-button>
      </el-form-item>
    </el-form>
    <!-- 结果展示列表 -->

    <el-table :data="orderList" style="width: 100%" :row-class-name="tableRowClassName">
      <el-table-column label="订单 ID" prop="id"></el-table-column>
      <el-table-column label="订单号" prop="orderNumber"></el-table-column>
      <el-table-column label="下单人" prop="nickname">
        <template slot-scope="scope">
          <i class="el-icon-user-solid"></i>
          <span>{{ scope.row.nickname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="支付金额" prop="payMoney">
        <template slot-scope="scope">
          <el-tag type="success">{{ scope.row.payMoney }} 元</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="订单状态" prop="status">
        <template slot-scope="props">
          <el-tag type="success" v-if="props.row.status== -1" size="medium">已取消订单</el-tag>
          <el-tag type="danger" v-if="props.row.status== 0" size="medium">待付款</el-tag>
          <el-tag v-if="props.row.status== 1" size="medium">已完成</el-tag>
          <el-tag type="info" v-if="props.row.status== 2" size="medium">已付款/待发货</el-tag>
          <el-tag type="info" v-if="props.row.status== 3" size="medium">已发货/待收货</el-tag>
          <el-tag type="success" v-if="props.row.status== 4" size="medium">已确认收货</el-tag>
          <el-tag type="warning" v-if="props.row.status== 5" size="medium">已超时关闭</el-tag>
        </template>
      </el-table-column>

      <el-table-column type="expand">
        <template slot-scope="props">
          <el-card class="box-card" shadow="hover">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="课程封面">
                <el-image
                  style="width: 100px; height: 150px"
                  :src="props.row.courseCover"
                  fit="cover"
                ></el-image>
              </el-form-item>
              <el-form-item label="课程名称">
                <span>{{ props.row.courseTitle }}</span>
              </el-form-item>
              <el-form-item label="讲师名称">
                <span>{{ props.row.teacherName }}</span>
              </el-form-item>
              <el-form-item label="用户 ID">
                <span>{{ props.row.userId }}</span>
              </el-form-item>
              <el-form-item label="下单人">
                <i class="el-icon-user-solid" style="margin-left:-44px"></i>
                <span style="margin-left:25px">{{ props.row.nickname }}</span>
              </el-form-item>
              <el-form-item label="下单手机号">
                <i class="el-icon-mobile-phone"></i>
                <span>{{ props.row.mobile }}</span>
              </el-form-item>
              <el-form-item label="课程金额">
                <el-tag type="info">{{ props.row.courseMoney }} 元</el-tag>
              </el-form-item>
              <el-form-item label="优惠金额">
                <el-tag type="danger">{{ props.row.reductionMoney }} 元</el-tag>
              </el-form-item>
              <el-form-item label="支付金额">
                <el-tag type="success">{{ props.row.payMoney }} 元</el-tag>
              </el-form-item>
              <el-form-item label="支付类型">
                <el-tag v-if="props.row.payType== 1" size="medium">支付宝</el-tag>
                <el-tag v-if="props.row.payType== 2" size="medium">微信</el-tag>
              </el-form-item>
              <el-form-item label="订单 ID">
                <span>{{ props.row.id }}</span>
              </el-form-item>
              <el-form-item label="订单号">
                <span>{{ props.row.orderNumber }}</span>
              </el-form-item>
              <el-form-item label="下单时间">
                <i class="el-icon-time"></i>
                <span>{{ props.row.gmtCreate }}</span>
              </el-form-item>
              <el-form-item label="支付时间">
                <i class="el-icon-time"></i>
                <span>{{ props.row.gmtModified }}</span>
              </el-form-item>
              <el-form-item label="订单状态">
                <el-tag type="success" v-if="props.row.status== -1" size="medium">已取消订单</el-tag>
                <el-tag type="danger" v-if="props.row.status== 0" size="medium">待付款</el-tag>
                <el-tag v-if="props.row.status== 1" size="medium">已完成</el-tag>
                <el-tag type="info" v-if="props.row.status== 2" size="medium">已付款/待发货</el-tag>
                <el-tag type="info" v-if="props.row.status== 3" size="medium">已发货/待收货</el-tag>
                <el-tag type="success" v-if="props.row.status== 4" size="medium">已确认收货</el-tag>
                <el-tag type="warning" v-if="props.row.status== 5" size="medium">已超时关闭</el-tag>
              </el-form-item>
            </el-form>
          </el-card>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      :current-page="page"
      :page-size="size"
      :total="total"
      style="padding: 30px 0; text-align: center;"
      layout="total, prev, pager, next, jumper"
      @current-change="getList"
      hide-on-single-page
    />
  </div>
</template>

<style>
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}

.orderList {
  position: relative;
  list-style: none;
  margin: 0;
  padding: 0;
}
.orderList li {
  position: relative;
}

.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}

.image {
  width: 20%;
  display: block;
}
.contentRow {
  position: relative;
}
</style>


<script>
// 引入调用teacher.js文件  框架中必须用@/
import order from "@/api/edu/order.js";

export default {
  // 组件应用中函数式写法  调用data函数生成的数据副本，避免了数据污染
  data() {
    //定义变量和初始值
    return {
      queryKey: "",
      queryValue: "",
      options: [
        {
          label: "常用查询条件",
          options: [
            {
              value: "id",
              label: "订单ID",
            },
            {
              value: "orderNumber",
              label: "订单号",
            },
            {
              value: "nickName",
              label: "下单昵称",
            },
            {
              value: "mobile",
              label: "手机号",
            },
            {
              value: "userId",
              label: "用户ID",
            },
          ],
        },
        {
          label: "特殊查询条件",
          options: [
            {
              value: "courseId",
              label: "课程ID",
            },
            {
              value: "courseTitle",
              label: "课程名称",
            },
            {
              value: "teacherName",
              label: "外教名称",
            },
          ],
        },
      ],
      statusOptions: [
        {
          value: -1,
          label: "取消订单",
        },
        {
          value: 0,
          label: "待付款",
        },
        {
          value: 1,
          label: "已完成",
        },
        {
          value: 2,
          label: "已付款/待发货",
        },
        {
          value: 3,
          label: "已发货/待收货",
        },
        {
          value: 4,
          label: "已确认收货",
        },

        {
          value: 5,
          label: "已超时关闭",
        },
      ],

      orderList: [],

      dialogVisible: false,
      dialogImageUrl: "",
      imgFilesList: [],
      innerDrawer: false,
      disabled: false,

      // 获取dev.env中BASE_API的值
      BASE_API: process.env.BASE_API,
      // 上传组件key的值 (唯一标识)
      imagecropperKey: 0,
      // 上传组件是否显示
      imagecropperShow: false,

      formLabelWidth: "80px",
      dialog: false,
      loading: false,
      timer: null,
      bannerInfo: {},
      listLoading: true, // 是否显示loading信息
      page: 1, //当前页
      size: 5, //每页记录数
      total: 0, //总记录数
      orderQueryDTO: {}, //查询条件对象  双向绑定自动填充
      list: null, //查询之后接口返回的集合
    };
  },
  created() {
    //页面渲染之前执行  调用methods中定义的方法
    this.getList();
  },

  methods: {
    // 给行加颜色
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === 1) {
        return "warning-row";
      } else if (rowIndex === 3) {
        return "success-row";
      }
      return "";
    },

    // 讲师列表 page = 1 意思是page默认值为1 改变后 将page赋值给this.page 做到分页切换
    getList(page = 1) {
      this.orderQueryDTO.current = page;

      this.orderQueryDTO.size = this.size;
      order.getOrderList(this.orderQueryDTO).then((response) => {
        // console.log(response.data);
        // 请求成功
        this.listLoading = true;
        this.page = response.data.current;
        this.orderList = response.data.records;
        this.total = response.data.total;
        this.listLoading = false;
      });
    },

    // 清空查询条件并刷新页面(重新查询)
    resetteacherQueryDTO() {
      this.orderQueryDTO = {};
      this.getList();
    },

    // 编辑前查询
    getInfo(id) {
      this.imgFilesList = [];
      order.getBannerById(id).then((response) => {
        this.bannerInfo = response.data;
        if (response.data.imageUrl) {
          this.imgFilesList.push({
            url: response.data.imageUrl,
            name: response.data.title,
          });
        }
        this.dialog = true;
      });
    },
  },
};
</script>

