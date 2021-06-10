<template>
  <div class="app-container">
    <div>
      <el-input v-model="filterText" placeholder="输入关键字进行过滤" style="margin-bottom: 20px;" />
      <el-button type="primary" @click="dialogVisible = true" style="margin-bottom: 20px;">
        导入课程分类
        <i class="el-icon-upload el-icon--right"></i>
      </el-button>
    </div>

    <el-dialog title="导入课程分类" :visible.sync="dialogVisible" :before-close="handleClose">
      <template>
        <div class="app-container" style="text-align: center;">
          <el-form>
            <el-form-item label="模板下载">
              <el-tag>
                <i class="el-icon-download" />
                <a
                  :href="OSS_PATH+'/subject-demo/%E8%AF%BE%E7%A8%8B%E5%88%86%E7%B1%BB%E6%A8%A1%E6%9D%BF.xlsx'"
                >点击下载课程分类模版</a>
              </el-tag>
            </el-form-item>

            <el-form-item label="上传文件">
              <el-upload
                :action="BASE_API+'/eduService/subject/addSubject'"
                :drag="true"
                :multiple="false"
                :on-success="uploadSuccess"
                :on-error="uploadFail"
                :limit="1"
                :before-upload="beforeExcelUpload"
                :on-exceed="fileNum"
              >
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">
                  将文件拖到此处，或
                  <em>点击上传</em>
                </div>
                <div
                  style="margin-left: 100px;font-size:15px; color:red"
                  class="el-upload__tip"
                  slot="tip"
                >
                  <span>只能上传xla/xlc/xlm/xls/xlt/xlw文件</span>
                </div>
              </el-upload>
            </el-form-item>
          </el-form>
        </div>
      </template>
    </el-dialog>
    <el-tree
      empty-text="尚无课程分类信息，请添加"
      ref="subjectTree"
      :data="data"
      node-key="id"
      :props="defaultProps"
      :filter-node-method="filterNode"
      class="filter-tree"
      default-expand-all
      expand-on-click-node
    >
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <div>{{ node.data.title }}</div>
        <div>
          <!--增加分组-->
          <!-- <i @click="() => append(node,data)" class="el-icon-plus">添加</i> -->
          <!-- 根节点不需要删除和重命名 -->
          <!--重命名分组-->
          <!-- <i v-if="data.id !== 0" @click="() => rename(node,data)" class="el-icon-edit">编辑</i> -->
          <!--删除分组-->
          <!-- <i v-if="data.id !== 0" @click="() => deletes(node,data)" class="el-icon-delete">删除</i></i> -->

          <el-button
            plain
            type="primary"
            icon="el-icon-plus"
            size="mini"
            @click="() => append(node, data.id)"
          >添加</el-button>
          <el-button
            plain
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="() => edit(node, data.id)"
          >重命名</el-button>
          <el-button
            plain
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="() => remove(node, data.id)"
          >删除</el-button>
        </div>
      </span>
    </el-tree>
  </div>
</template>

<script>
import subject from "@/api/edu/subject";

export default {
  data() {
    return {
      dialogVisible: false,
      BASE_API: process.env.BASE_API, // 接口API地址
      OSS_PATH: process.env.OSS_PATH, // 阿里云OSS地址
      filterText: "",
      data: [],
      defaultProps: {
        children: "children",
        label: "title",
      },

      subjectDTO: {
        id: "",
        title: "",
        parentId: "",
      },
    };
  },

  watch: {
    filterText(val) {
      this.$refs.subjectTree.filter(val);
    },
  },
  mounted() {
    this.getSubject();
  },

  methods: {
    getSubject() {
      subject.getAllList().then((response) => {
        this.data = response.data;
      });
    },

    filterNode(value, data) {
      if (!value) return true;
      return data.title.toLowerCase().indexOf(value.toLowerCase()) !== -1;
    },

    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },

    // 文件上传前判断类型
    beforeExcelUpload(file) {
      // 获取后缀名
      const isExcel = file.type === "application/vnd.ms-excel";

      if (!isExcel) {
        this.$message.error(
          "上传Excel文件只支持 xla/xlc/xlm/xls/xlt/xlw 格式!"
        );
      }

      return isExcel;
    },

    // 文件上传个数限制
    fileNum(files, fileList) {
      this.$message.warning(`别贪心哦，一次只能上传 1 个文件,请重新上传文件`);
    },

    uploadSuccess(response) {
      this.$message({
        type: "success",
        message: "上传成功",
      });
      // 跳转到课程列表页面
      this.$router.push({ path: `/course/subject/list` });
    },
    uploadFail() {
      this.$message({
        type: "error",
        message: "上传失败,请重新上传!",
      });
    },

    append(node, id) {
      this.subjectDTO.parentId = id;
      this.$prompt("请输入标题", "添加分类标题", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(({ value }) => {
          this.subjectDTO.title = value;

          subject.saveOrUpdateSubject(this.subjectDTO).then(() => {
            this.$message({
              type: "success",
              message: "添加成功",
            });
            this.getSubject();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消添加",
          });
        });
    },

    edit(node, id) {
      subject.getSubjectInfo(id).then((response) => {
        this.$prompt("重命名课程分类", "修改分类标题", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          inputPlaceholder: response.title,
        })
          .then(({ value }) => {
            // console.log(response);

            this.subjectDTO.id = id;
            this.subjectDTO.title = value;
            this.subjectDTO.parentId = response.data.parentId;
            subject.saveOrUpdateSubject(this.subjectDTO).then(() => {
              this.$message({
                type: "success",
                message: "重命名成功",
              });
              this.getSubject();
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消重命名",
            });
          });
      });
    },

    remove(node, id) {
      this.$confirm("此操作将永久删除该分类以及子分类, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          subject.removeSubject(id).then(() => {
            this.$message({
              type: "success",
              message: "删除成功",
            });
            this.getSubject();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>
<style>
.el-tree-node__content {
  margin: 5px;
  padding: 15px;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 18px;
  font-weight: 550;
}
</style>

