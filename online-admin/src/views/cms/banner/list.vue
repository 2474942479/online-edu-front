<template>
  <div class="app-container">
    <h1>轮播图列表</h1>
    <!-- 条件查询表单 -->
    <el-form :inline="true" :model="bannerQueryDTO" class="demo-form-inline">
      <el-form-item label="标题">
        <el-input v-model="bannerQueryDTO.title" placeholder="请输入标题"></el-input>
      </el-form-item>

      <el-form-item label="添加时间">
        <el-date-picker
          v-model="bannerQueryDTO.begin"
          type="month"
          placeholder="选择开始时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="bannerQueryDTO.end"
          type="month"
          placeholder="选择截止时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>
      <el-form-item>
        <el-button round type="primary" icon="el-icon-search" @click="getList()">查询</el-button>
        <el-button round type="danger " icon="el-icon-delete" @click="resetteacherQueryDTO()">清空</el-button>
        <el-button round type="primary" icon="el-icon-search" @click="() => {imgFilesList = [],this.bannerInfo={},dialog = true}">添加</el-button>
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
      <el-table-column label="图片" align="center" width="500px">
        <template slot-scope="scope">
          <el-image :src="scope.row.imageUrl" fit="scale-down" v-if="scope.row.imageUrl"></el-image>
        </template>
      </el-table-column>
      <el-table-column prop="title" label="标题" align="center"></el-table-column>
      <el-table-column prop="linkUrl" label="跳转路径" align="center"></el-table-column>
      <el-table-column prop="sort" label="排序" align="center"></el-table-column>
      <el-table-column prop="description" label="描述" align="center"></el-table-column>
      <el-table-column label="添加时间" align="center">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.gmtCreate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" align="center" fixed="right">
        <template slot-scope="scope">
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
            <h1>详情信息</h1>
            <div class="demo-drawer__content">
              <el-form :model="bannerInfo">
                <el-form-item label="标题" :label-width="formLabelWidth" style=" font-size: 15px">
                  <el-input v-model="bannerInfo.title" />
                </el-form-item>

                <el-form-item
                  label="排序"
                  :label-width="formLabelWidth"
                  style="text-align: left; font-size: 15px"
                >
                  <el-input-number
                    v-model="bannerInfo.sort"
                    size="medium"
                    placeholder="1"
                    :min="1"
                  />
                </el-form-item>

                <el-form-item label="跳转路径" :label-width="formLabelWidth" style=" font-size: 15px">
                  <el-input v-model="bannerInfo.linkUrl" />
                </el-form-item>
                <el-form-item label="简介" :label-width="formLabelWidth">
                  <el-input v-model="bannerInfo.description" :rows="10" type="textarea" />
                </el-form-item>

                <!-- 图片上传 -->
                <el-form-item
                  label="图片"
                  :label-width="formLabelWidth"
                  style="text-align: left; font-size: 15px"
                >
                  <el-upload
                    :action="BASE_API+'/eduService/oss/upload2Oss'"
                    list-type="picture-card"
                    :auto-upload="true"
                    :limit="1"
                    :on-success="cropSuccess"
                    :before-upload="beforeCoverUpload"
                    :file-list="imgFilesList"
                    class="upload_list"
                  >
                    <i slot="default" class="el-icon-plus"></i>
                    <div slot="file" slot-scope="{file}">
                      <img class="el-upload-list__item-thumbnail" :src="bannerInfo.imageUrl" alt />
                      <span class="el-upload-list__item-actions">
                        <span class="el-upload-list__item-preview" @click="imgPreview(file)">
                          <i class="el-icon-zoom-in"></i>
                        </span>
                        <span
                          v-if="!disabled"
                          class="el-upload-list__item-delete"
                          @click="imgDownload(file)"
                        >
                          <i class="el-icon-download"></i>
                        </span>
                        <span
                          v-if="!disabled"
                          class="el-upload-list__item-delete"
                          @click="imgRemove(file)"
                        >
                          <i class="el-icon-delete"></i>
                        </span>
                      </span>
                    </div>
                  </el-upload>
                </el-form-item>
              </el-form>
              <div class="demo-drawer__footer">
                <el-button size="medium" @click="cancelForm">取 消</el-button>
                <el-button
                  icon="el-icon-upload"
                  size="medium"
                  type="primary"
                  @click="saveOrUpdateBanner"
                  :loading="loading"
                >{{ loading ? '提交中 ...' : '提交' }}</el-button>
              </div>
            </div>
          </el-drawer>

          <el-popconfirm
            confirmButtonText="确认"
            @confirm="removeBanner(scope.row.id,scope.row.title)"
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
    <el-dialog :visible.sync="dialogVisible" width="80%">
      <img width="100%" :src="dialogImageUrl" alt />
    </el-dialog>

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
import banner from "@/api/edu/banner.js";
import oss from "@/api/edu/oss.js";

export default {
  // 组件应用中函数式写法  调用data函数生成的数据副本，避免了数据污染
  data() {
    //定义变量和初始值
    return {
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
      bannerQueryDTO: {}, //查询条件对象  双向绑定自动填充
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
      this.bannerQueryDTO.current = page;

      this.bannerQueryDTO.size = this.size;
      banner.getBannerList(this.bannerQueryDTO).then((response) => {
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
      this.bannerQueryDTO = {};
      this.getList();
    },

    // 删除方式二
    removeBanner(id, title) {
      banner.removeBanner(id).then((response) => {
        // 提示信息
        this.$message({
          type: "success",
          message: "已成功删除轮播图" + title + "!",
        });
        // 刷新列表
        this.getList();
      });
    },
    // 编辑前查询
    getInfo(id) {
      this.imgFilesList = []
      banner.getBannerById(id).then((response) => {
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

    // 编辑完成后提交
    saveOrUpdateBanner() {
      this.loading = true;
      this.timer = setTimeout(() => {
        banner.saveOrUpdateBanner(this.bannerInfo).then((response) => {
          // 1 提示修改成功
          this.$message({
            type: "success",
            message: "操作成功!",
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
        .catch((_) => {});
    },

    // 关闭编辑框
    cancelForm() {
      this.loading = false;
      this.dialog = false;
      clearTimeout(this.timer);
    },

    // 上传成功的方法
    cropSuccess(response) {
      // 上传之后接口返回图片地址url
      this.bannerInfo.imageUrl = response.data;
      if (response.success) {
        this.$message({
          type: "success",
          message: "上传成功!",
        });
      }
      // this.imagecropperShow = false;
      // 上传成功后，重新打开上传组件时初始化组件，否则显示上一次的上传结果
      // this.imagecropperKey = this.imagecropperKey + 1;
    },

    // 课程封面
    handleCoverSuccess(res) {
      this.bannerInfo.imageUrl = res.data.url;
    },

    beforeCoverUpload(file) {
      const isJPG =
        file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "image/pipeg";
      const isLt50M = file.size / 1024 / 1024 < 50;
      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG/PNG/JFIF 格式!");
      }
      if (!isLt50M) {
        this.$message.error("上传头像图片大小不能超过 50MB!");
      }
      return isJPG && isLt50M;
    },

    // 封面预览
    imgPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },

    imgDownload(file) {
      window.open(file.url, "_blank");
    },

    imgRemove(file) {
      var fileUrls = [];
      fileUrls.push(this.bannerInfo.imageUrl);
      oss.removeBatchOssFile(fileUrls).then(() => {
        this.$message({
          type: "success",
          message: "删除图片成功",
        });
        this.imgFilesList = [];
        this.bannerInfo.imageUrl = null;
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
<style>
.upload_list .el-upload-list--picture-card .el-upload-list__item{
 width: 501px;
 height: 201px;
}
</style>