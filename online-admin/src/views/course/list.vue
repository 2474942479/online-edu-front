
<template>
  <div class="app-container">
    <h1>课程列表</h1>
    <!-- 条件查询表单 -->
    <el-form :inline="true" :model="courseQueryDTO" class="demo-form-inline">
      <el-form-item label="课程标题">
        <el-input v-model="courseQueryDTO.title" placeholder="请输入课程标题"></el-input>
      </el-form-item>
      <el-form-item label="课程状态">
        <el-select v-model="courseQueryDTO.status" placeholder="未发布">
          <el-option label="已发布" value="Normal"></el-option>
          <el-option label="未发布" value="Draft"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="添加时间">
        <el-date-picker
          v-model="courseQueryDTO.begin"
          type="datetime"
          placeholder="选择开始时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="courseQueryDTO.end"
          type="datetime"
          placeholder="选择截止时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>
      <el-form-item>
        <el-button round type="primary" icon="el-icon-search" @click="getList()">查询</el-button>
        <el-button round type="danger " icon="el-icon-delete" @click="resetcourseQueryDTO()">清空</el-button>
      </el-form-item>
    </el-form>
    <!-- 结果展示列表 -->
    <el-table
      :data="list"
      style="width: 100% "
      v-loading="listLoading"
      element-loading-text="数据加载中"
      border
      fit
      size="medium"
      highlight-current-row
      :row-class-name="tableRowClassName"
    >
      <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
      <el-table-column label="课程封面" width="300px" height="300px" align="center">
        <template slot-scope="scope">
          <el-image  :src="scope.row.cover" fit="scale-down"></el-image>
        </template>
      </el-table-column>
      <el-table-column prop="title" label="课程标题" width="150" align="center"></el-table-column>
      <el-table-column show-overflow-tooltip prop="description" label="课程简介" width="250" align="center"></el-table-column>
      <el-table-column label="发布状态" width="150" align="center">
        <!-- scope代表整个表格 scope.row 代表每行     ==判断值  ===判断类型和值 -->
        <template slot-scope="scope">{{scope.row.status==="Draft"?'未发布':'已发布'}}</template>
      </el-table-column>
      <el-table-column prop="price" label="价格" width="100" align="center"></el-table-column>
      <el-table-column prop="reductionMoney" label="优惠" width="100" align="center"></el-table-column>
      <el-table-column prop="lessonNum" label="课时数" width="100" align="center"></el-table-column>
      <el-table-column label="添加时间" width="250" align="center">
        <template slot-scope="scope">
        <i class="el-icon-time"></i>
        <span style="margin-left: 10px">{{ scope.row.gmtCreate }}</span>
      </template>
      </el-table-column>
      <el-table-column label="操作" width="150" align="center" fixed="right">
        <template slot-scope="scope">
          <!-- 编辑方法一 -->
          <router-link :to="'/course/info/'+scope.row.id">
            <el-button  round type="primary" size="medium" icon="el-icon-edit">编辑</el-button>
          </router-link>

          <!-- 删除方式二 -->
          <el-popconfirm
            confirmButtonText="确认"
            @confirm="removeCourse(scope.row.id,scope.row.title)"
            cancelButtonText="取消"
            icon="el-icon-info"
            iconColor="red"
            title="将永久删除该课程, 是否继续?"
          >
            <el-button round type="danger" size="medium" icon="el-icon-delete" slot="reference" style="margin-left:30px">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 current-page:当前页 page-size页面显示的数量    
    确定了page-size和total 根据total/size 可以自动判断出有多少页   
    @current-change="方法名（不可以加（））"  当前页变动时候触发的事件-->
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



<script>
import course from "@/api/edu/course";

export default {
  // 写核心代码的部分
  // 简单实例中
  // data: {
  // },

  // 组件应用中函数式写法  调用data函数生成的数据副本，避免了数据污染
  data() {
    //定义变量和初始值
    return {
      // 获取dev.env中BASE_API的值
      BASE_API: process.env.BASE_API,

      formLabelWidth: "80px",
      loading: false,
      timer: null,
      listLoading: true, // 是否显示loading信息
      page: 1, //当前页
      size: 5, //每页记录数
      total: 0, //总记录数
      courseQueryDTO: {}, //查询条件对象  双向绑定自动填充
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
      this.courseQueryDTO.current = page
      this.courseQueryDTO.size = this.size
      course
        .getCourseListPage(this.courseQueryDTO)
        .then((response) => {
          //请求成功
          this.listLoading = true;
          // response是接口返回的数据
          // console.log(response);
          this.list = response.data.records;
          this.total = response.data.total;
          this.listLoading = false;
        });
    },

    // 清空查询条件并刷新页面(重新查询)
    resetcourseQueryDTO() {
      this.courseQueryDTO = {};
      this.getList();
    },


    // 删除方式二
    removeCourse(id, title) {
      course.removeCourseById(id).then((response) => {
        // 提示信息
        this.$message({
          type: "success",
          message: "已成功删除 [ " + title + " ] 课程!",
        });
        // 刷新列表
        this.getList();
      });
    },
   
  },
};
</script>

<style rel="stylesheet/scss" lang="scss">
:focus {
  outline: 0;
}
.el-drawer {
  overflow: scroll;
}
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
</style>