<template>
  <div class="app-container">
    <el-form>
      <el-form-item>
        <h2 style="text-align: center;">发布新课程</h2>
        <el-steps :active="2" process-status="wait" align-center style="margin-bottom: 40px;">
          <el-step title="填写课程基本信息" />
          <el-step title="创建课程大纲" />
          <el-step title="提交审核" />
        </el-steps>
      </el-form-item>

      <el-form-item style="text-align: right;">
        <el-button type="primary" icon="el-icon-plus" @click="openChapterDialog">添加章节</el-button>
        <!-- 添加和修改章节表单 -->
        <el-dialog title="添加章节" :visible.sync="dialogChapterFormVisible" width="700px" center>
          <el-form :model="chapter" label-width="120px">
            <el-form-item label="章节标题" style="width:500px; margin-bottom: 30px">
              <el-input v-model="chapter.title" />
            </el-form-item>
            <el-form-item label="章节排序">
              <el-input-number v-model="chapter.sort" :min="1" placeholder></el-input-number>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogChapterFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="addOrEdit">确 定</el-button>
          </div>
        </el-dialog>
      </el-form-item>
      <el-form-item>
        <ul class="chapterList">
          <li v-for="chapter in chapterVo" :key="chapter.id">
            <p>
              {{ chapter.title }}
              <span class="acts">
                <el-button
                  round
                  type="primary"
                  icon="el-icon-plus"
                  @click="openVideoDialog(chapter.id)"
                >添加课时</el-button>
                <el-button
                  round
                  type="primary"
                  icon="el-icon-edit"
                  @click="editChapter(chapter.id)"
                >编辑</el-button>
                <el-popconfirm
                  confirmButtonText="确认"
                  @onConfirm="removeChapter(chapter.id,chapter.title)"
                  cancelButtonText="取消"
                  icon="el-icon-info"
                  iconColor="red"
                  title="将永久删除该章节, 是否继续?"
                >
                  <el-button round type="danger" icon="el-icon-delete" slot="reference">删除</el-button>
                </el-popconfirm>
              </span>
            </p>
            <!-- 小节 -->
            <ul class="chapterList videoList">
              <li v-for="video in chapter.children" :key="video.id">
                <p>
                  {{ video.title }}
                  <span class="acts">
                    <el-button
                      round
                      type="primary"
                      icon="el-icon-edit"
                      @click="editVideo(video.id)"
                    >编辑</el-button>
                    <el-popconfirm
                      confirmButtonText="确认"
                      @onConfirm="removeVideo(video.id,video.title)"
                      cancelButtonText="取消"
                      icon="el-icon-info"
                      iconColor="red"
                      title="将永久删除该章节以及视频, 是否继续?"
                    >
                      <el-button round type="danger" icon="el-icon-delete" slot="reference">删除</el-button>
                    </el-popconfirm>
                  </span>
                </p>
              </li>
            </ul>
          </li>
        </ul>

        <!-- 添加和修改课时表单 -->
        <el-dialog :visible.sync="dialogVideoFormVisible" title="添加课时" center>
          <el-form :model="videoInfo" label-width="120px">
            <el-form-item label="课时标题" style="margin-bottom: 20px">
              <el-input v-model="videoInfo.title" />
            </el-form-item>
            <el-form-item label="课时排序" style="margin-bottom: 20px">
              <el-input-number v-model="videoInfo.sort" :min="0" controls-position="right" />
            </el-form-item>
            <el-form-item label="是否免费" style="margin-bottom: 20px">
              <el-radio-group v-model="videoInfo.isFree">
                <el-radio :label="true">免费</el-radio>
                <el-radio :label="false">收费</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="上传视频">
              <el-upload
                :on-success="handleVodUploadSuccess"
                :on-remove="handleRemoveVod"
                :before-remove="beforeRemoveVod"
                :on-exceed="handleUploadExceed"
                :file-list="fileList"
                :action="BASE_API+'/eduVod/video/uploadVideo'"
                :limit="1"
                class="upload-demo"
              >
                <el-button size="small" type="primary">上传视频</el-button>
                <el-tooltip placement="right-end">
                  <div slot="content">
                    最大支持1G，
                    <br />支持3GP、ASF、AVI、DAT、DV、FLV、F4V、
                    <br />GIF、M2T、M4V、MJ2、MJPEG、MKV、MOV、MP4、
                    <br />MPE、MPG、MPEG、MTS、OGG、QT、RM、RMVB、
                    <br />SWF、TS、VOB、WMV、WEBM 等视频格式上传
                  </div>
                  <i class="el-icon-question" />
                </el-tooltip>
              </el-upload>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogVideoFormVisible = false">取 消</el-button>
            <el-button :disabled="saveVideoBtnDisabled" type="primary" @click="addOrUpdateVideo">确 定</el-button>
          </div>
        </el-dialog>
      </el-form-item>
      <el-form-item style="text-align: center;">
        <el-button @click="previous">上一步</el-button>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="next">下一步</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import chapter from "@/api/edu/chapter";
import video from "@/api/edu/video";
export default {
  data() {
    return {
      fileList: [], //上传文件列表
      BASE_API: process.env.BASE_API, // 接口API地址
      dialogChapterFormVisible: false,
      dialogVideoFormVisible: false,
      saveBtnDisabled: false, // 保存按钮是否禁用
      saveVideoBtnDisabled: false,
      chapterVo: [], //课程大纲（包含章节小节）
      chapter: {
        courseId: "",
        title: "",
        sort: "",
      },
      videoInfo: {},
    };
  },

  created() {
    if (this.$route.params && this.$route.params.courseId) {
      this.chapter.courseId = this.$route.params.courseId;
      this.getChapterVo();
    }
  },

  methods: {
    // ================================章节操作=====================================================

    //  点击添加章节按钮时清空弹出框
    openChapterDialog() {
      this.chapter = { courseId: this.$route.params.courseId };
      this.dialogChapterFormVisible = true;
    },

    // 获取课程大纲全部信息
    getChapterVo() {
      chapter.getAllChapterVo(this.chapter.courseId).then((response) => {
        this.chapterVo = response.data.chapterVoList;
      });
    },

    // 编辑按钮回显
    editChapter(chapterId) {
      chapter.getChapter(chapterId).then((response) => {
        this.chapter = response.data.chapter;
      });
      this.dialogChapterFormVisible = true;
    },

    // 判断弹出框是添加提交还是编辑提交
    addOrEdit() {
      // 根据chapter中是否有id这个字段判断是修改还是添加
      // 有id字段代表修改  无代表添加（添加会自动生成id）
      if (!this.chapter.id) {
        this.addChapter();
      } else {
        this.updateChapter();
      }
    },

    // 添加提交
    addChapter() {
      chapter.saveChapter(this.chapter).then((response) => {
        this.dialogChapterFormVisible = false;
        this.$message({
          type: "success",
          message: "添加成功",
        });
        this.getChapterVo();
      });
    },

    // 修改提交
    updateChapter() {
      chapter.updateChapter(this.chapter).then((response) => {
        this.dialogChapterFormVisible = false;
        this.$message({
          type: "success",
          message: "修改成功",
        });
        this.getChapterVo();
      });
    },

    removeChapter(chapterId, title) {
      chapter.deleteChapter(chapterId).then((response) => {
        // 提示信息
        this.$message({
          type: "success",
          message: "已成功删除章节" + title + "!",
        });
        this.getChapterVo();
      });
    },

    previous() {
      // 跳转到上一步 并带上课程id
      this.$router.push({ path: `/course/info/${this.chapter.courseId}` });
    },

    next() {
      // 跳转到第二步 并带上课程id
      this.$router.push({
        path: `/course/finalrelease/${this.chapter.courseId}`,
      });
    },

    // ================================小节操作=====================================================

    // 根据章节id添加小节到对应章节下
    openVideoDialog(chapterId) {
      this.fileList=[]
      this.videoInfo = {
        courseId: this.$route.params.courseId,
        chapterId: chapterId,
      };
      this.dialogVideoFormVisible = true;
    },

    // 输入完毕后确定按钮

    addOrUpdateVideo() {
      if (!this.videoInfo.id) {
        this.addVideo();
      } else {
        this.updateVideo();
      }
    },

    addVideo() {
      video.saveVideoInfo(this.videoInfo).then((response) => {
        this.dialogVideoFormVisible = false;
        this.$message({
          type: "success",
          message: "添加成功",
        }),
          this.getChapterVo();
      });
    },

    updateVideo() {
      video.updateVideoInfo(this.videoInfo).then((response) => {
        this.dialogVideoFormVisible = false;
        this.$message({
          type: "success",
          message: "修改成功",
        }),
          this.getChapterVo();
      });
    },

    // 修改小节
    editVideo(videoId) {
      video.getVideoInfo(videoId).then((response) => {
        this.videoInfo = response.data.videoInfo;
        if(this.videoInfo.videoOriginalName !== ""){
          this.fileList = [{ name: this.videoInfo.videoOriginalName }];
        }else{
           this.fileList = [];
        }
        
      });
      this.dialogVideoFormVisible = true;
      
    },

    removeVideo(videoId, title) {
      video.deleteVideo(videoId).then((response) => {
        this.$message({
          type: "success",
          message: "已成功删除" + title + "小节！",
        }),
          this.getChapterVo();
      });
    },
    // ============================小节视频操作=====================

    //成功回调
    handleVodUploadSuccess(response, file, fileList) {
      this.videoInfo.videoSourceId = response.data.videoSourceId;
      this.videoInfo.videoOriginalName = file.name;
      
    },
    //视图上传多于一个视频
    handleUploadExceed() {
      this.$message.warning("想要重新上传视频，请先删除已上传的视频");
    },

    // 删除前
    beforeRemoveVod(file, fileList) {
      return this.$confirm(`确定移除 ${ file.name }？`);
    },

    // 确定删除
    handleRemoveVod() {
      video.deleteAliyunVod(this.videoInfo.videoSourceId).then((response) => {
         this.fileList = [];
        this.videoInfo.videoSourceId = "";
        this.videoInfo.videoOriginalName = "";
        this.$message({
          type: "success",
          message: "删除成功",
        });
      });
    },
  },
};
</script>

<style scoped>
.chapterList {
  position: relative;
  list-style: none;
  margin: 0;
  padding: 0;
}
.chapterList li {
  position: relative;
}
.chapterList p {
  font-size: 20px;
  margin: 10px 0;
  padding: 10px;
  height: 70px;
  line-height: 50px;
  width: 100%;
  border: 1px solid #ddd;
}
.chapterList .acts {
  float: right;
  font-size: 14px;
}
.videoList {
  padding-left: 50px;
}
.videoList p {
  font-size: 14px;
  margin: 10px 0;
  padding: 10px;
  height: 50px;
  line-height: 30px;
  width: 100%;
  border: 1px dotted #ddd;
}
</style>