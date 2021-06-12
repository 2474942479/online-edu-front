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
        <el-dialog title="章节详情" :visible.sync="dialogChapterFormVisible" width="700px" center>
          <el-form :model="chapterInfo" label-width="120px">
            <el-form-item label="章节标题" style="width:500px; margin-bottom: 30px">
              <el-input v-model="chapterInfo.title" />
            </el-form-item>
            <el-form-item label="章节简介" style="width:500px; margin-bottom: 30px">
              <el-input v-model="chapterInfo.description" type="textarea" />
            </el-form-item>
            <el-form-item label="章节排序">
              <el-input-number v-model="chapterInfo.sort" :min="1" placeholder></el-input-number>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogChapterFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="saveOrUpdateChapter">确 定</el-button>
          </div>
        </el-dialog>
      </el-form-item>
      <el-form-item>
        <el-collapse accordion>
          <template v-for="chapter in chapterVO">
            <el-collapse-item class=".el-collapse-item__header">
              <template slot="title" class="collapse-title">
                <el-popconfirm
                  confirmButtonText="确认"
                  @confirm="removeChapter(chapter.id,chapter.title)"
                  cancelButtonText="取消"
                  icon="el-icon-info"
                  iconColor="red"
                  title="将永久删除该章节, 是否继续?"
                >
                  <el-button round type="text" icon="el-icon-delete" slot="reference">删除</el-button>
                </el-popconfirm>
                <el-button-group>
                  <el-button
                    round
                    type="text"
                    icon="el-icon-plus"
                    @click="openVideoDialog(chapter.id)"
                  >添加课时</el-button>
                  <el-button
                    round
                    type="text"
                    icon="el-icon-edit"
                    @click="editChapter(chapter.id)"
                  >编辑</el-button>
                </el-button-group>
                <div style="margin-left:0; margin-right: auto;">
                  <b>{{chapter.title}}</b>  </b>   {{chapter.description}}
                </div>
              </template>
              <!-- 小节 -->
              <ul class="chapterList videoList">
                <li
                  v-for="video in chapter.videoVOList"
                  :key="video.id"
                  style="margin-top: 20px;margin-left:30px"
                >
                  <el-card class="box-card" shadow="hover" :body-style="{ padding: '0px' }">
                    <div style="padding: 14px;">
                      <div class="bottom clearfix">
                        <div style="font-size: 20px" class="contentRow">
                          <img
                            src="https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg"
                            style=" width: 100px;display: inline; border-radius: 5px"
                          />
                          <span class="contentRowChild">
                            {{ video.title }}
                            <el-divider direction="vertical"></el-divider>
                            <el-tag type="success" v-if="video.isFree" size="medium">免费</el-tag>
                            <el-tag type="danger" v-if="!video.isFree" size="medium">收费</el-tag>
                            <el-divider direction="vertical" v-if="video.videoOriginalName"></el-divider>
                            <el-tooltip
                              effect="dark"
                              placement="bottom"
                              v-if="video.videoOriginalName"
                            >
                              <div slot="content">
                                <br />
                                视频大小: {{video.size}}
                                <br />
                                视频时间: {{video.duration}}
                                <br />
                                视频状态: {{video.status}}
                              </div>
                              <el-tag>{{video.videoOriginalName}}</el-tag>
                            </el-tooltip>
                            <div v-if="video.description">简介: {{ video.description }}</div>
                          </span>

                          <span class="btnGroup">
                            <el-button
                              round
                              type="primary"
                              icon="el-icon-edit"
                              @click="editVideo(video.id)"
                            >编辑</el-button>
                            <el-popconfirm
                              confirmButtonText="确认"
                              @confirm="removeVideo(video.id,video.title)"
                              cancelButtonText="取消"
                              icon="el-icon-info"
                              iconColor="red"
                              title="将永久删除该章节以及视频, 是否继续?"
                            >
                              <el-button
                                round
                                type="danger"
                                icon="el-icon-delete"
                                slot="reference"
                              >删除</el-button>
                            </el-popconfirm>
                          </span>
                        </div>
                      </div>
                    </div>
                  </el-card>
                </li>
              </ul>
            </el-collapse-item>
          </template>
          <ul class="chapterList">
            <li v-for="chapter in chapterVO" :key="chapter.id"></li>
          </ul>
        </el-collapse>

        <!-- 添加和修改课时表单 -->
        <el-dialog :visible.sync="dialogVideoFormVisible" title="课时详情" center>
          <el-form :model="videoInfo" label-width="120px">
            <el-form-item label="课时标题" style="margin-bottom: 20px">
              <el-input v-model="videoInfo.title" />
            </el-form-item>
            <el-form-item label="章节简介" style="margin-bottom: 20px">
              <el-input v-model="videoInfo.description" type="textarea" />
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
                :action="BASE_API+'/eduService/vod/uploadVideo'"
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
            <el-button
              :disabled="saveVideoBtnDisabled"
              type="primary"
              @click="saveOrUpdateVideo"
            >确 定</el-button>
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
      chapterVO: [], //课程大纲（包含章节小节）
      chapterInfo: {},
      videoInfo: {},
    };
  },

  created() {
    if (this.$route.params && this.$route.params.courseId) {
      this.chapterInfo.courseId = this.$route.params.courseId;
      this.getChapterVO();
    }
  },

  methods: {
    // ================================章节操作=====================================================

    //  点击添加章节按钮时清空弹出框
    openChapterDialog() {
      this.chapterInfo = { courseId: this.$route.params.courseId };
      this.dialogChapterFormVisible = true;
    },

    // 获取课程大纲全部信息
    getChapterVO() {
      chapter.getAllChapterVO(this.chapterInfo.courseId).then((response) => {
        this.chapterVO = response.data;
      });
    },

    // 编辑按钮回显
    editChapter(chapterId) {
      chapter.getChapter(chapterId).then((response) => {
        this.chapterInfo = response.data;
      });
      this.dialogChapterFormVisible = true;
    },

    // 添加或修改
    saveOrUpdateChapter() {
      chapter.saveOrUpdateChapter(this.chapterInfo).then((response) => {
        this.dialogChapterFormVisible = false;
        this.$message({
          type: "success",
          message: "操作成功",
        });
        this.getChapterVO();
      });
    },

    removeChapter(chapterId, title) {
      chapter.removeChapter(chapterId).then((response) => {
        // 提示信息
        this.$message({
          type: "success",
          message: "已成功删除章节" + title + "!",
        });
        this.getChapterVO();
      });
    },

    previous() {
      // 跳转到上一步 并带上课程id
      this.$router.push({ path: `/course/info/${this.chapterInfo.courseId}` });
    },

    next() {
      // 跳转到第二步 并带上课程id
      this.$router.push({
        path: `/course/finalrelease/${this.chapterInfo.courseId}`,
      });
    },

    // ================================小节操作=====================================================

    // 根据章节id添加小节到对应章节下
    openVideoDialog(chapterId) {
      this.fileList = [];
      this.videoInfo = {
        courseId: this.$route.params.courseId,
        chapterId: chapterId,
      };
      this.dialogVideoFormVisible = true;
    },

    saveOrUpdateVideo() {
      video.saveOrUpdateVideo(this.videoInfo).then((response) => {
        this.dialogVideoFormVisible = false;
        this.$message({
          type: "success",
          message: "操作成功",
        }),
          this.getChapterVO();
      });
    },

    // 回显小节数据
    editVideo(videoId) {
      video.getVideoInfo(videoId).then((response) => {
        this.videoInfo = response.data;
        if (this.videoInfo.videoOriginalName !== "") {
          this.fileList = [{ name: this.videoInfo.videoOriginalName }];
        } else {
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
          this.getChapterVO();
      });
    },
    // ============================小节视频操作=====================

    //成功回调
    handleVodUploadSuccess(response, file, fileList) {
      if (response.code != 0) {
        this.$message({
          type: "error",
          message: response.message,
        });
      } else {
        this.$message({
          type: "success",
          message: "视频上传成功",
        }),
          (this.videoInfo.videoSourceId = response.data);
        this.videoInfo.videoOriginalName = file.name;
      }
    },

    //视图上传多于一个视频
    handleUploadExceed() {
      this.$message.warning("想要重新上传视频，请先删除已上传的视频");
    },

    // 删除前
    beforeRemoveVod(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
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
::v-deep .el-collapse-item__header {
  height: 60px;
  background-color: #fff;
  color: #303133;
  cursor: pointer;
  border-bottom: 1px solid #ebeef5;
  font-size: 20px;
  font-weight: 500;
  -webkit-transition: border-bottom-color 0.3s;
  transition: border-bottom-color 0.3s;
  outline: 0;
  flex-direction: row-reverse;
  justify-content: flex-end;
}

::v-deep .el-collapse-item__content {
  padding: 0;
}

::v-deep .el-collapse-item__arrow {
  margin: 4px 4px 4px 12px;
}

.collapse-title {
  display: flex;
}

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
.acts {
  float: right;
  font-size: 14px;
}
.videoList {
  padding-left: 50px;
  /* display: flex; */
}
.videoList p {
  font-size: 18px;
  margin: 10px 0;
  padding: 10px;
  height: 50px;
  line-height: 30px;
  width: 100%;
  border: 1px dotted #ddd;
}
.contentRow {
  position: relative;
}
.contentRowChild {
  position: absolute;
  top: 0;
  margin-left: 20px;
}
.btnGroup {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}
</style>