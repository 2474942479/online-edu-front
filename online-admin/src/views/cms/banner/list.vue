<template>
  <div class="app-container">
    <h1>轮播图列表</h1>
    <!-- 条件查询表单 -->
    <el-form :inline="true" :model="teacherQueryDTO" class="demo-form-inline">
      <el-form-item label="姓名">
        <el-input v-model="teacherQueryDTO.name" placeholder="请输入姓名"></el-input>
      </el-form-item>
      <el-form-item label="讲师头衔">
        <el-select v-model="teacherQueryDTO.level" placeholder="高级讲师">
          <el-option label="高级讲师" value="1"></el-option>
          <el-option label="首席讲师" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="加入时间">
        <el-date-picker
          v-model="teacherQueryDTO.begin"
          type="month"
          placeholder="选择开始时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="teacherQueryDTO.end"
          type="month"
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
    <el-table
      :data="list"
      style="width: 100%"
      v-loading="listLoading"
      element-loading-text="数据加载中"
      border
      fit
      size="medium"
      highlight-current-row
      :row-class-name="tableRowClassName"
    >
      <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
      <el-table-column label="头像" width="100" height="300" align="center">
        <template slot-scope="scope">
          <el-avatar :size="60" :src="scope.row.avatar"></el-avatar>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="姓名" width="100" align="center"></el-table-column>
      <el-table-column label="头衔" width="150" align="center">
        <!-- scope代表整个表格 scope.row 代表每行     ==判断值  ===判断类型和值 -->
        <template slot-scope="scope">{{scope.row.level===1?'高级讲师':'首席讲师'}}</template>
      </el-table-column>
      <el-table-column prop="career" label="资历" width="150" align="center"></el-table-column>

      <el-table-column label="加入时间" width="180" align="center">
        <template slot-scope="scope">
        <i class="el-icon-time"></i>
        <span style="margin-left: 10px">{{ scope.row.gmtCreate }}</span>
      </template>
      </el-table-column>
      <el-table-column prop="sort" label="排序" width="80" align="center"></el-table-column>
      <el-table-column prop="intro" label="简介" width="653"></el-table-column>
      <el-table-column label="操作" width="200" align="center" fixed="right">
        <template slot-scope="scope">
          <!-- 编辑方法一 -->
          <!-- <router-link :to="'/teacher/edit/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
          </router-link> -->
          <!-- 编辑方法二 -->
          <el-button
            round
            type="primary"
            size="small"
            icon="el-icon-edit"
            @click="getInfo(scope.row.id)"
          >编辑</el-button>

          <!-- 编辑功能 -->
          <el-drawer
            :before-close="handleCloseForm"
            :visible.sync="dialog"
            direction="rtl"
            custom-class="demo-drawer"
            ref="drawer"
            size="40%"
            :append-to-body="true"
            style="text-align: center;"
          >
            <h1>编辑信息</h1>
            <div class="demo-drawer__content">
              <el-form :model="teacherInfo">
                <el-form-item label="讲师名称" :label-width="formLabelWidth" style=" font-size: 15px">
                  <el-input v-model="teacherInfo.name" />
                </el-form-item>

                <el-form-item
                  label="讲师排序"
                  :label-width="formLabelWidth"
                  style="text-align: left; font-size: 15px"
                >
                  <el-input-number
                    v-model="teacherInfo.sort"
                    size="medium"
                    placeholder="1"
                    :min="1"
                  />
                </el-form-item>
                <el-form-item
                  label="讲师头衔"
                  :label-width="formLabelWidth"
                  style="text-align: left; font-size: 15px"
                >
                  <el-select size="medium" v-model="teacherInfo.level" clearable placeholder="请选择">
                    <!--  
            数据类型一定要和取出的json中的一致，否则没法回填
            因此，这里value使用动态绑定的值，保证其数据类型是number
                    -->
                    <el-option :value="1" label="高级讲师" />
                    <el-option :value="2" label="首席讲师" />
                  </el-select>
                </el-form-item>
                <el-form-item label="讲师资历" :label-width="formLabelWidth" style=" font-size: 15px">
                  <el-input v-model="teacherInfo.career" />
                </el-form-item>
                <el-form-item label="讲师简介" :label-width="formLabelWidth">
                  <el-input v-model="teacherInfo.intro" :rows="10" type="textarea" />
                </el-form-item>

                <!-- 讲师头像上传 -->
                <el-form-item
                  label="讲师头像"
                  :label-width="formLabelWidth"
                  style="text-align: left; font-size: 15px"
                >
                  <!-- 头像缩略图 -->
                  <el-avatar shape="square" :size="100" :src="teacherInfo.avatar"></el-avatar>
                  <!-- 文件上传按钮 -->
                  <div>
                    <el-button
                      round
                      type="primary"
                      icon="el-icon-upload"
                      @click="innerDrawer = true"
                    >更换头像</el-button>
                  </div>
                  <el-drawer
                    :destroy-on-close="true"
                    :before-close="handleCloseAvatar"
                    :append-to-body="true"
                    :visible.sync="innerDrawer"
                    direction="rtl"
                    size="25%"
                    style="text-align: center;"
                  >
                    <el-container>
                      <el-header>
                        <h1>更换头像</h1>
                      </el-header>
                      <el-main>
                        <el-upload
                          ref="upload"
                          :drag="true"
                          :action="BASE_API+'/eduService/oss/upload2Oss'"
                          :multiple="false"
                          :on-success="uploadSuccess"
                          :on-error="uploadFail"
                          :limit="1"
                          :before-upload="beforeAvatarUpload"
                          :on-exceed="fileNum"
                        >
                          <i class="el-icon-upload"></i>
                          <div class="el-upload__text">
                            将文件拖到此处，或
                            <em>点击上传</em>
                          </div>
                          <div
                            style=" font-size: 15px"
                            class="el-upload__tip"
                            slot="tip"
                          >只能上传jpg/png文件，且不超过500kb</div>
                        </el-upload>
                      </el-main>
                      <el-footer>
                        <el-button size="medium" @click="innerDrawer=false">取 消</el-button>
                      </el-footer>
                    </el-container>
                  </el-drawer>
                </el-form-item>
              </el-form>
              <div class="demo-drawer__footer">
                <el-button size="medium" @click="cancelForm">取 消</el-button>
                <el-button
                  icon="el-icon-upload"
                  size="medium"
                  type="primary"
                  @click="update"
                  :loading="loading"
                >{{ loading ? '提交中 ...' : '提交' }}</el-button>
              </div>
            </div>
          </el-drawer>

          <!-- 删除方式二 -->
          <el-popconfirm
            confirmButtonText="确认"
            @confirm="removeTeacher(scope.row.id,scope.row.name)"
            cancelButtonText="取消"
            icon="el-icon-info"
            iconColor="red"
            title="将永久删除讲师, 是否继续?"
          >
            <el-button round type="danger" size="small" icon="el-icon-delete" slot="reference">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 
    current-page:当前页 
    page-size页面显示的数量    
    确定了page-size和total 根据total/size 可以自动判断出有多少页   
    @current-change="方法名（不可以加（））"  当前页变动时候触发的事件
    -->
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
// 引入调用teacher.js文件  框架中必须用@/
import teacher from "@/api/edu/teacher.js";

export default {
  // 写核心代码的部分
  // 简单实例中
  // data: {
  // },

  // 组件应用中函数式写法  调用data函数生成的数据副本，避免了数据污染
  data() {
    //定义变量和初始值
    return {
      innerDrawer: false,

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
      teacherInfo: {},
      listLoading: true, // 是否显示loading信息
      page: 1, //当前页
      size: 5, //每页记录数
      total: 0, //总记录数
      teacherQueryDTO: {}, //查询条件对象  双向绑定自动填充
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

    // 创建具体的方法  调用api/teacher.js中定义的方法
    handleCurrentChange(val) {
      this.getList(val);
    },

    // 讲师列表 page = 1 意思是page默认值为1 改变后 将page赋值给this.page 做到分页切换
    getList(page = 1) {
      this.teacherQueryDTO.current = page;

      this.teacherQueryDTO.size = this.size;
      teacher.getTeacherListPage(this.teacherQueryDTO).then((response) => {
        // 请求成功
        this.listLoading = true;
        this.page = response.data.current;
        this.list = response.data.records;
        this.total = response.data.total;
        this.listLoading = false;
      });
    },

    // 清空查询条件并刷新页面(重新查询)
    resetteacherQueryDTO() {
      this.teacherQueryDTO = {};
      this.getList();
    },

    // 删除方式二
    removeTeacher(id, name) {
      teacher.removeTeacherById(id).then((response) => {
        // 提示信息
        this.$message({
          type: "success",
          message: "已成功删除讲师" + name + "!",
        });
        // 刷新列表
        this.getList();
      });
    },
    // 编辑前查询
    getInfo(id) {
      teacher.getTeacherInfoById(id).then((response) => {
        this.teacherInfo = response.data;
        this.dialog = true;
      });
    },
    // 编辑完成后提交
    update() {
      this.loading = true;
      this.timer = setTimeout(() => {
        teacher.saveOrUpdateTeacher(this.teacherInfo).then((response) => {
          // 1 提示修改成功
          this.$message({
            type: "success",
            message: "修改成功!",
          });
          // 重新查询列表
          this.getList();
        });

        // 动画关闭需要一定的时间
        setTimeout(() => {
          this.loading = false;
          this.dialog = false;
        }, 400);
      }, 1000);
    },

    handleCloseForm() {
      if (this.loading) {
        return;
      }
      this.$confirm("还有未保存的工作哦确定关闭吗？")
      .then((_) => {
            this.loading = false;
            this.dialog = false;
      })
      .catch(_ => {});
    },

    // 关闭编辑框
    cancelForm() {
      this.loading = false;
      this.dialog = false;
      clearTimeout(this.timer);
    },

    handleCloseAvatar() {
      this.$confirm("还未上传图片，是否退出？").then(() => {
        this.innerDrawer = false;
      });
    },

    // 文件上传前判断类型以及大小
    beforeAvatarUpload(file) {
      const isIMage =
        file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "image/pipeg";
      const isLt500KB = file.size / 1024 < 500;

      if (!isIMage) {
        this.$message.error("上传头像图片只能是 JPG/PNG/JFIF 格式!");
      }
      if (!isLt500KB) {
        this.$message.error("上传头像图片大小不能超过 500KB!");
      }
      return isIMage && isLt500KB;
    },

    // 文件上传个数限制
    fileNum(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，请重新上传文件`
      );
    },

    // 上传成功的方法  data是封装后的response.data
    uploadSuccess(response) {
      // 上传之后接口返回图片地址url
      this.teacherInfo.avatar = response.data;
      this.innerDrawer = false;
      this.$refs.upload.clearFiles();
      this.$message({
        type: "success",
        message: "上传成功!",
      });
    },

    uploadFail() {
      this.$message({
        type: "error",
        message: "上传失败,请重新上传!",
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