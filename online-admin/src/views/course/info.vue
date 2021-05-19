<template>
  <div class="app-container">
    <h2 style="text-align: center;">发布新课程</h2>
    <el-steps :active="1" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息" />
      <el-step title="创建课程大纲" />
      <el-step title="最终发布" />
    </el-steps>
    <el-form label-width="120px">
      <el-form-item label="课程标题" style="width:650px">
        <el-input v-model="courseInfo.title" placeholder=" 示例：机器学习项目课。专业名称注意大小写" />
      </el-form-item>
      <!-- 课程分类 TODO -->

      <el-form-item label="课程分类">
        <el-cascader
          v-model="subjectIdList"
          placeholder="请选择课程所属分类"
          :options="subjectList"
          :props="defaultProps"
          clearable
        ></el-cascader>
      </el-form-item>

      <!-- 课程讲师 TODO -->
      <el-form-item label="课程讲师">
        <el-select v-model="courseInfo.teacherId" filterable placeholder="请选择课程所属讲师" clearable>
          <el-option
            v-for="teacher in teacherList"
            :key="teacher.id"
            :label="teacher.name"
            :value="teacher.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="总课时">
        <el-input-number
          placeholder="请填写课程的总课时数"
          size="medium"
          :min="0"
          v-model="courseInfo.lessonNum"
          controls-position="right"
        />
      </el-form-item>
      <el-form-item label="课程简介" style="width:650px">
        <el-input
          type="textarea"
          v-model="courseInfo.description"
          placeholder=" 示例：全程外教一对一教学，在原有学校课堂的基础上，更快速的巩固和提高孩子的英语听说读写综合能力。"
        />
      </el-form-item>

      <el-form-item label="课程价格">
        <el-input-number
          placeholder="价格默认为0元"
          size="medium"
          :min="0"
          v-model="courseInfo.price"
          controls-position="right"
        />元
      </el-form-item>
      <el-form-item label="课程优惠">
        <el-input-number
          placeholder="优惠默认为0元"
          size="medium"
          :min="0"
          v-model="courseInfo.reductionMoney"
          controls-position="right"
        />元
      </el-form-item>
      <el-form-item label="课程封面">
        <!-- 头像缩略图 -->
        <!-- <pan-thumb :image="courseInfo.cover" /> -->
        <!-- 文件上传按钮 -->
        <!-- <el-button round type="primary" icon="el-icon-upload" @click="imagecropperShow=true">添加封面</el-button> -->
        <!-- v-show：是否显示上传组件
                  :key：类似于id，如果一个页面多个图片上传控件，可以做区分
                  :url：后台上传的url地址
                  @close：关闭上传组件
                  @crop-upload-success：上传成功后的回调 
        -->
        <!-- <image-cropper
          v-show="imagecropperShow"
          :width="300"
          :height="300"
          :key="imagecropperKey"
          :url="BASE_API+'/eduService/oss/upload2Oss'"
          field="file"
          @close="close"
          @crop-upload-success="cropSuccess"
        />-->
        <el-upload
          :action="BASE_API+'/eduService/oss/upload2Oss'"
          list-type="picture-card"
          :auto-upload="true"
          :limit="1"
          :on-success="cropSuccess"
          :before-upload="beforeCoverUpload"
          :file-list="imgFilesList"
        >
          <i slot="default" class="el-icon-plus"></i>
          <div slot="file" slot-scope="{file}">
            <img class="el-upload-list__item-thumbnail" :src="courseInfo.cover" alt />
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
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt />
        </el-dialog>
      </el-form-item>

      <el-form-item style="margin-top:30px;text-align: center;">
        <el-button
          size="medium"
          :disabled="saveBtnDisabled"
          type="primary"
          @click="saveOrUpdate"
        >保存并下一步</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import course from "@/api/edu/course";
import subject from "@/api/edu/subject";
// 引入上传头像
import ImageCropper from "@/components/ImageCropper";
import PanThumb from "@/components/PanThumb";
export default {
  // 声明上传组件
  components: { ImageCropper, PanThumb },
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      disabled: false,

      // 上传组件key的值 (唯一标识)
      imagecropperKey: 0,
      // 上传组件是否显示
      imagecropperShow: false,
      BASE_API: process.env.BASE_API,
      saveBtnDisabled: false,

      teacherList: [],
      subjectList: [],
      subjectIdList: [],
      imgFilesList: [],
      defaultProps: {
        children: "children",
        label: "title",
        value: "id",
        expandTrigger: "hover",
      },
      courseInfo: {
        id: "",
        title: "",
        subjectIds: "",
        teacherId: "",
        description: "",
        cover: "",
      },
    };
  },

  created() {
    course.getAllTeacher().then((response) => {
      this.teacherList = response.data;
    });

    subject.getAllList().then((response) => {
      this.subjectList = response.data;
    });

    this.init();
  },

  watch: {
    //监听
    $route(to, from) {
      this.init();
    },
  },

  methods: {
    init() {
      // 根据路径判断是否有id值来决定是否进行数据回显 即区分修改和增加
      if (this.$route.params && this.$route.params.courseId) {
        this.getCourseInfo(this.$route.params.courseId);
      } else {
        this.courseInfo = {};
        this.subjectIdList = [];
        this.courseInfo.cover =
          process.env.OSS_PATH + "/crouse/course_cover_default.png";
      }
    },

    // 关闭上传弹框的方法
    close() {
      this.imagecropperShow = false;
      // 上传失败后，重新打开上传组件时初始化组件，否则显示上一次的上传结果
      this.imagecropperKey = this.imagecropperKey + 1;
    },

    // 上传成功的方法
    cropSuccess(response) {
      // 上传之后接口返回图片地址url
      this.courseInfo.cover = response.data;
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
      this.courseInfo.cover = res.data.url;
    },

    beforeCoverUpload(file) {
      const isJPG =
        file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "image/pipeg";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG/PNG/JFIF 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },

    // 根据课程id查询课程基本信息

    getCourseInfo(courseId) {
      course.getCourseInfoById(courseId).then((response) => {
        this.courseInfo = response.data;
        this.subjectIdList = JSON.parse(response.data.subjectIds);
        this.imgFilesList.push({
          url: response.data.cover,
          name: response.data.title,
          id: response.data.id,
        });
      });
    },

    // 判断是添加还是修改
    saveOrUpdate() {
      if (this.$route.params && this.$route.params.courseId) {
        this.update();
      } else {
        this.save();
      }
    },

    // 添加课程基本信息
    save() {
      this.courseInfo.subjectIds = JSON.stringify(this.subjectIdList);
      course.addCourseInfo(this.courseInfo).then((response) => {
        // 提示添加成功
        this.$message({
          type: "success",
          message: "添加课程基本信息成功",
        });
        // 跳转到下一步 并带上课程id
        this.$router.push({
          path: `/course/chapter/${response.data}`,
        });
      });
    },

    // 修改课程基本信息
    update() {
      this.courseInfo.subjectIds = JSON.stringify(this.subjectIdList);
      // 将课程分类级联选择器回显的的subjectIDList中的值赋值给courseInfo
      course.updateCourseInfo(this.courseInfo).then((response) => {
        // 提示修改成功
        this.$message({
          type: "success",
          message: "修改课程基本信息成功",
        });
        // 跳转到下一步 并带上课程id
        this.$router.push({
          path: `/course/chapter/${this.courseInfo.id}`,
        });
      });
    },

    // 封面预览
    imgPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },

    imgDownload(file) {

    },

    imgRemove(file) {
      
    }


  },
};
</script>
