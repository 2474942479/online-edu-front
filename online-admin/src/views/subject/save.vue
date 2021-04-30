<template>
  <div class="app-container" style="text-align: center;">
    <el-form >
      <el-form-item label="模板下载">
        <el-tag>
          <i class="el-icon-download" />
          <a
            :href="OSS_PATH+'/subject-demo/%E8%AF%BE%E7%A8%8B%E5%88%86%E7%B1%BB%E6%A8%A1%E6%9D%BF.xlsx'"
          >点击下载课程分类模版</a>
        </el-tag>
      </el-form-item>

      <el-form-item label="上传文件" >
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
          <div style="margin-left: 100px;font-size:15px; color:red" class="el-upload__tip" slot="tip">只能上传xla/xlc/xlm/xls/xlt/xlw文件</div>
        </el-upload>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      BASE_API: process.env.BASE_API, // 接口API地址
      OSS_PATH: process.env.OSS_PATH, // 阿里云OSS地址
    };
  },

  created() {},

  methods: {
    // 文件上传前判断类型
    beforeExcelUpload(file) {
      // 获取后缀名
      const isExcel =
        file.type === "application/vnd.ms-excel" 

      if (!isExcel) {
        this.$message.error("上传Excel文件只支持 xla/xlc/xlm/xls/xlt/xlw 格式!");
      }
      
      return isExcel ;
    },

    // 文件上传个数限制
    fileNum(files, fileList) {
      this.$message.warning(
        `别贪心哦，一次只能上传 1 个文件,请重新上传文件`
      );
    },

    uploadSuccess(response) {
      console.log(response);
      this.$message({
        type: "success",
        message: "上传成功",
      })
      // 跳转到课程列表页面
        this.$router.push({ path: `/subject/list` });
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