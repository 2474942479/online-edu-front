<template>
  <div class="app-container">
    <h2 style="text-align: center;">发布新课程</h2>
    <el-steps :active="3" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息" />
      <el-step title="创建课程大纲" />
      <el-step title="确认发布" />
    </el-steps>
    <div style="text-align: center;margin-bottom:30px">
      <el-radio v-model="courseInfo.status" label="Draft">不发布</el-radio>
      <el-radio v-model="courseInfo.status" label="Normal">发布</el-radio>
    </div>
    <div class="ccInfo">
      <img :src="finalreleaseInfo.cover" />
      <div class="main">
        <h2>{{ finalreleaseInfo.title }}</h2>
        <p class="gray">
          <span>共{{ finalreleaseInfo.lessonNum }}课时</span>
        </p>
        <p>
          <span>所属分类：{{ finalreleaseInfo.oneSubjectTitle }} — {{ finalreleaseInfo.twoSubjectTitle }}</span>
        </p>
        <p class="gray">课程讲师：{{ finalreleaseInfo.teacherName }}</p>
        <h4 class="red">优惠:{{ Number(finalreleaseInfo.reductionMoney) }}￥</h4><br><br><br>
        <h3 class="red">合计:{{ Number(finalreleaseInfo.price - finalreleaseInfo.reductionMoney).toFixed(2)}}￥</h3>
        
        
      </div>
    </div>
    <div style="text-align:center">
      <el-button @click="previous">返回修改</el-button>
      <el-button :disabled="saveBtnDisabled" type="primary" @click="release">提交</el-button>
    </div>
  </div>
</template>
<script>
import finalrelease from "@/api/edu/finalrelease";

export default {
  data() {
    return {
      saveBtnDisabled: false,
      finalreleaseInfo: {},
      courseInfo:{
        id:"",
        status:"Normal"
        }
    };
  },

  created() {
    if (this.$route.params && this.$route.params.courseId) {
      this.courseInfo.id = this.$route.params.courseId;
      this.getfinalreleaseInfo();
    }
  },

  methods: {
    getfinalreleaseInfo() {
      finalrelease
        .getFinalRelease(this.courseInfo.id)
        .then((response) => {
          this.finalreleaseInfo = response.data;
        });
    },

    previous() {
      // 跳转到上一步 并带上课程id
      this.$router.push({
        path: `/course/chapter/${this.courseInfo.id}`,
      });
    },

    // 发布课课程
    release() {
      this.$confirm("确定要提交该课程?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          finalrelease
            .changeReleaseStatus(this.courseInfo)
            .then((response) => {
              this.$message({
                type: "success",
                message: "发布成功",
              });
              // 保存课程并跳转到课程列表页面
              this.$router.push({ path: `/course/list` });
            });
        })
        
    },
  },
};
</script>

<style scoped>
.ccInfo {
  background: #f5f5f5;
  padding: 20px;
  overflow: hidden;
  border: 1px dashed #ddd;
  margin-bottom: 40px;
  position: relative;
}
.ccInfo img {
  background: #d6d6d6;
  width: 500px;
  height: 278px;
  display: block;
  float: left;
  border: none;
}
.ccInfo .main {
  margin-left: 520px;
}
.ccInfo .main h2 {
  font-size: 28px;
  margin-bottom: 30px;
  line-height: 1;
  font-weight: normal;
}
.ccInfo .main p {
  margin-bottom: 10px;
  word-wrap: break-word;
  line-height: 24px;
  max-height: 48px;
  overflow: hidden;
}
.ccInfo .main p {
  margin-bottom: 10px;
  word-wrap: break-word;
  line-height: 24px;
  max-height: 48px;
  overflow: hidden;
}
.ccInfo .main h3 {
  left: 540px;
  bottom: 20px;
  line-height: 1;
  font-size: 28px;
  color: #d32f24;
  font-weight: normal;
  position: absolute;
}
</style>