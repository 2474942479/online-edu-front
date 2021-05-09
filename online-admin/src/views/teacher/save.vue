<template>
  <div class="app-container">
    <el-form label-width="120px" v-model="teacherInfo">
      <el-form-item label="讲师名称" style="width:300px">
        <el-input v-model="teacherInfo.name" />
      </el-form-item>
      <el-form-item label="讲师排序">
        <el-input-number
          v-model="teacherInfo.sort"
          controls-position="right"
          placeholder="1"
          :min="1"
        />
      </el-form-item>
      <el-form-item label="讲师头衔">
        <el-select v-model="teacherInfo.level" clearable placeholder="请选择">
          <!--
            数据类型一定要和取出的json中的一致，否则没法回填
            因此，这里value使用动态绑定的值，保证其数据类型是number
          -->
          <el-option :value="1" label="高级讲师" />
          <el-option :value="2" label="首席讲师" />
        </el-select>
      </el-form-item>
      <el-form-item label="讲师资历" style="width:500px">
        <el-input v-model="teacherInfo.career" />
      </el-form-item>
      <el-form-item label="讲师简介" style="width:700px">
        <el-input v-model="teacherInfo.intro" :rows="10" type="textarea" />
      </el-form-item>
      <!-- 讲师头像上传 -->
      <el-form-item label="讲师头像">
        <!-- 头像缩略图 -->
        <pan-thumb :image="teacherInfo.avatar"/>
        <!-- 文件上传按钮 -->
        <el-button round type="primary" icon="el-icon-upload" @click="imagecropperShow=true">添加头像</el-button>
        <!-- v-show：是否显示上传组件
                  :key：类似于id，如果一个页面多个图片上传控件，可以做区分
                  :url：后台上传的url地址
                  @close：关闭上传组件
                  @crop-upload-success：上传成功后的回调 
        -->
        <image-cropper
          v-show="imagecropperShow"
          :width="300"
          :height="300"
          :key="imagecropperKey"
          :url="BASE_API+'/eduOss/fileOss/uploadAvatar'"
          field="file"
          @close="close"
          @crop-upload-success="cropSuccess"
        />
      </el-form-item>

      <el-form-item style="text-align: center;">
        <el-button :disabled="saveBtnDisabled" type="primary" @click="addOrEdit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// 引入调用teacher.js文件  框架中必须用@/
import teacher from "@/api/edu/teacher";

// 引入上传头像
import ImageCropper from "@/components/ImageCropper";
import PanThumb from "@/components/PanThumb";
export default {
  // 声明上传组件
  components: { ImageCropper, PanThumb },
  // 数据定义与初始化
  //定义变量和初始值
  data() {
    return {
      // 获取dev.env中BASE_API的值
      BASE_API: process.env.BASE_API,
      // 上传组件key的值 (唯一标识)
      imagecropperKey: 0,
      // 上传组件是否显示
      imagecropperShow: false,
      teacherInfo: {},
      saveBtnDisabled: false,
    };
  },

  // 页面渲染前执行
  created() {
    this.init();
    this.teacherInfo.avatar=process.env.OSS_PATH +"/online-teacher-avatar/teacher_avatar_default.png"
  },

  watch: {
    //监听
    $route(to, from) {
      this.init();
    },
  },

  methods: {
    //   初始化方法
    init() {
      // 根据路径判断是否有id值来决定是否进行数据回显 即区分修改和增加
      if (this.$route.params && this.$route.params.id) {
        // 从路径获取id值
        const id = this.$route.params.id;
        // 调用根据id查询的方法
        this.getInfo(id);
      } else {
        this.teacherInfo = {};
      }
    },

    add() {
      teacher.addTeacher(this.teacherInfo).then((response) => {
        // 1 提示添加成功
        this.$message({
          type: "success",
          message: "添加成功!",
        });
        // 2 跳转到列表页面 路由跳转
        this.$router.push({ path: "/teacher/list" });
      });
    },

    getInfo(id) {
      teacher.getTeacherInfoById(id).then((response) => {
        this.teacherInfo = response.data.info;
      });
    },

    update() {
      teacher.uptateTeacher(this.teacherInfo).then((response) => {
        // 1 提示修改成功
        this.$message({
          type: "success",
          message: "修改成功!",
        });
        // 2 跳转到列表页面 路由跳转
        this.$router.push({ path: "/teacher/list" });
      });
    },

    addOrEdit() {
      // 根据teacher中是否有id这个字段判断是修改还是添加
      // 有id字段代表修改  无代表添加（添加会自动生成id）

      if (!this.teacherInfo.id) {
        this.add();
      } else {
        this.update();
      }
    },

    // 关闭上传弹框的方法
    close() {
      this.imagecropperShow = false;
      // 上传失败后，重新打开上传组件时初始化组件，否则显示上一次的上传结果
      this.imagecropperKey = this.imagecropperKey + 1;
    },

    // 上传成功的方法  data是封装后的response.data
    cropSuccess(data) {
      // 上传之后接口返回图片地址url
      this.teacherInfo.avatar = data.url;
      this.imagecropperShow = false;
      // 上传成功后，重新打开上传组件时初始化组件，否则显示上一次的上传结果
      this.imagecropperKey = this.imagecropperKey + 1;
    },
  },
};
</script>