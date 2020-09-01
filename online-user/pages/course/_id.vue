<template>
  <div id="aCoursesList" class="bg-fa of">
    <!-- /课程详情 开始 -->
    <section class="container">
      <section class="path-wrap txtOf hLh30">
        <a href="/" title class="c-999 fsize14">首页</a>
        \
        <a href="/course" title class="c-999 fsize14">课程列表</a>
        \
        <span class="c-333 fsize14">{{courseBaseInfo.title}}</span>
      </section>
      <div>
        <article class="c-v-pic-wrap" style="height: 357px;">
          <section class="p-h-video-box" id="videoPlay">
            <img
              height="357px"
              width="640px"
              :src="courseBaseInfo.cover"
              :alt="courseBaseInfo.title"
              class="dis c-v-pic"
            />
          </section>
        </article>
        <aside class="c-attr-wrap">
          <section class="ml20 mr15">
            <h2 class="hLh30 txtOf mt15">
              <span class="c-fff fsize24">{{courseBaseInfo.title}}</span>
            </h2>
            <section class="c-attr-jg">
              <span class="c-fff">价格：</span>
              <b class="c-yellow" style="font-size:24px;">￥{{courseBaseInfo.price}}</b>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <span class="c-fff">优惠：</span>
              <b class="c-yellow" style="font-size:24px;">￥{{courseBaseInfo.reductionMoney}}</b>
            </section>
            
            <section class="c-attr-mt c-attr-undis">
              <span class="c-fff fsize14">主讲人： {{courseBaseInfo.teacherName}}&nbsp;&nbsp;&nbsp;</span>
            </section>
            <section class="c-attr-mt of">
              <span class="ml10 vam">
                <em class="icon18 scIcon"></em>
                <a class="c-fff vam" title="收藏" href="#">收藏</a>
              </span>
            </section>
            <section class="c-attr-mt" v-if="Number(courseBaseInfo.price) == 0 || this.isBuy">
              <a href="#" title="立即观看" class="comm-btn c-btn-3">立即观看</a>
            </section>
            <section class="c-attr-mt" v-else>
              <a
                href="#"
                @click="buyCourse()"
                :disabled="this.disabled"
                title="立即购买"
                class="comm-btn c-btn-3"
              >立即购买</a>
            </section>
          </section>
        </aside>
        <aside class="thr-attr-box">
          <ol class="thr-attr-ol ">
            <li>
              <p>&nbsp;</p>
              <aside>
                <span class="c-fff f-fM">购买数</span>
                <br />
                <h6 class="c-fff f-fM mt10">{{courseBaseInfo.buyCount}}</h6>
              </aside>
            </li>
            <li>
              <p>&nbsp;</p>
              <aside>
                <span class="c-fff f-fM">课时数</span>
                <br />
                <h6 class="c-fff f-fM mt10">{{courseBaseInfo.lessonNum}}</h6>
              </aside>
            </li>
            <li>
              <p>&nbsp;</p>
              <aside>
                <span class="c-fff f-fM">浏览数</span>
                <br />
                <h6 class="c-fff f-fM mt10">{{courseBaseInfo.viewCount}}</h6>
              </aside>
            </li>
          </ol>
        </aside>
        <div class="clear"></div>
      </div>
      <!-- /课程封面介绍 -->
      <div class="mt20 c-infor-box">
        <article class="fl col-7">
          <section class="mr30">
            <div class="i-box">
              <div>
                <section id="c-i-tabTitle" class="c-infor-tabTitle c-tab-title">
                  <a name="c-i" class="current" title="课程详情">课程详情</a>
                </section>
              </div>
              <article class="ml10 mr10 pt20">
                <div>
                  <h6 class="c-i-content c-infor-title">
                    <span>课程简介</span>
                  </h6>
                  <div class="course-txt-body-wrap">
                    <section class="course-txt-body">
                      <p>{{courseBaseInfo.description}}</p>
                    </section>
                  </div>
                </div>
                <!-- /课程介绍 -->
                <div class="mt50">
                  <h6 class="c-g-content c-infor-title">
                    <span>课程大纲</span>
                  </h6>
                  <section class="mt20">
                    <div class="lh-menu-wrap">
                      <menu id="lh-menu" class="lh-menu mt10 mr10">
                        <ul>
                          <!-- 文件目录 -->
                          <li
                            class="lh-menu-stair"
                            v-for="chapter in chapterAllInfo"
                            :key="chapter.id"
                          >
                            <a href="javascript: void(0)" :title="chapter.title" class="current-1">
                              <em class="lh-menu-i-1 icon18 mr10"></em>
                              {{chapter.title}}
                            </a>
                            <ol class="lh-menu-ol" style="display: block;">
                              <li
                                class="lh-menu-second ml30"
                                v-for="video in chapter.children"
                                :key="video.id"
                              >
                                <a
                                  :href="'/videos/'+video.videoSourceId"
                                  :title="video.title"
                                  target="_blank"
                                >
                                  <span class="fr">
                                    <i class="free-icon vam mr10">免费试听</i>
                                  </span>
                                  <em class="lh-menu-i-2 icon16 mr5">&nbsp;</em>
                                  {{video.title}}
                                </a>
                              </li>
                            </ol>
                          </li>
                        </ul>
                      </menu>
                    </div>
                  </section>
                </div>
                <!-- /课程大纲 -->
              </article>
            </div>
          </section>
        </article>

        <aside class="fl col-3">
          <div class="i-box">
            <div>
              <section class="c-infor-tabTitle c-tab-title">
                <a title href="javascript:void(0)">主讲讲师</a>
              </section>
              <section class="stud-act-list">
                <ul style="height: auto;">
                  <li>
                    <div class="u-face">
                      <a :href="'/teacher/'+courseBaseInfo.teacherId">
                        <img
                          :src="courseBaseInfo.avatar"
                          width="50"
                          height="50"
                          :alt="courseBaseInfo.teacherName"
                        />
                      </a>
                    </div>
                    <section class="hLh30 txtOf">
                      <a
                        class="c-333 fsize16 fl"
                        :href="'/teacher/'+courseBaseInfo.teacherId"
                      >{{courseBaseInfo.teacherName}}</a>
                    </section>
                    <section class="hLh20 txtOf">
                      <span class="c-999">{{courseBaseInfo.intro}}</span>
                    </section>
                  </li>
                </ul>
              </section>
            </div>
          </div>
          <div class="mt50 commentHtml">
            <div>
              <h6 class="c-c-content c-infor-title" id="i-art-comment">
                <span class="commentTitle">课程评论</span>
              </h6>
              <section class="lh-bj-list pr mt20 replyhtml">
                <ul>
                  <li class="unBr">
                    <aside class="noter-pic">
                      <img width="50" height="50" class="picImg" :src="loginInfo.avatar" />
                    </aside>
                    <div class="of">
                      <section class="n-reply-wrap">
                        <fieldset>
                          <textarea
                            name
                            placeholder="输入您要评论的文字"
                            v-model="commentInfo.content"
                            id="commentContent"
                          ></textarea>
                        </fieldset>
                        <p class="of mt5 tar pl10 pr10">
                          <span class="fl">
                            <tt class="c-red commentContentmeg" style="display: none;"></tt>
                          </span>
                          <input
                            type="button"
                            value="发表"
                            @click="saveComment()"
                            class="lh-reply-btn"
                          />
                        </p>
                      </section>
                    </div>
                  </li>
                </ul>
              </section>
              <section class>
                <section class="question-list lh-bj-list pr">
                  <ul class="pr10">
                    <li v-for="(comment,index) in commentAllInfo.records" :key="index">
                      <aside class="noter-pic">
                        <img width="50" height="50" class="picImg" :src="comment.avatar" />
                      </aside>
                      <div class="of">
                        <span class="fl">
                          <font class="fsize12 c-blue">{{comment.nickname}}</font>
                          <font class="fsize12 c-999 ml5">评论：</font>
                        </span>
                      </div>
                      <div class="noter-txt mt5">
                        <p>{{comment.content}}</p>
                      </div>
                      <div class="of mt5">
                        <span class="fr">
                          <font class="fsize12 c-999 ml5">{{comment.gmtCreate}}</font>
                        </span>
                      </div>
                    </li>
                  </ul>
                </section>
              </section>

              <!-- 公共分页 开始 -->
              <div>
                <div class="paging">
                  <!-- undisable这个class是否存在，取决于数据属性hasPrevious -->
                  <a
                    :class="{undisable: !commentAllInfo.previous}"
                    href="#"
                    title="首页"
                    @click.prevent="gotoPage(1)"
                  >首页</a>
                  <a
                    v-show="commentAllInfo.previous"
                    href="#"
                    title="上一页"
                    @click.prevent="gotoPage(commentAllInfo.current-1)"
                  >&lt;</a>
                  <a
                    v-for="page in commentAllInfo.pages"
                    :key="page"
                    :class="{current: commentAllInfo.current == page, undisable: commentAllInfo.current == page}"
                    :title="'第'+page+'页'"
                    href="#"
                    @click.prevent="gotoPage(page)"
                  >{{ page }}</a>
                  <a
                    v-show="commentAllInfo.next"
                    href="#"
                    title="下一页"
                    @click.prevent="gotoPage(commentAllInfo.current+1)"
                  >&gt;</a>
                  <a
                    :class="{undisable: !commentAllInfo.next}"
                    href="#"
                    title="末页"
                    @click.prevent="gotoPage(commentAllInfo.pages)"
                  >末页</a>
                  <div class="clear" />
                </div>
              </div>
              <!-- 公共分页 结束 -->
            </div>
          </div>
        </aside>
        <div class="clear"></div>
      </div>
    </section>
    <!-- /课程详情 结束 -->
  </div>
</template>

<script>
import courseApi from "@/api/course";
import commentApi from "@/api/comment";
import orderApi from "@/api/order";
import cookie from "js-cookie";
export default {
  data() {
    return {
      disabled: true,
      courseId: "",
      loginInfo: {
        avatar: "",
      },
      // 初始化数据
      courseBaseInfo: {},
      chapterAllInfo: {},
      commentAllInfo: {},
      isBuy:"",
      commentInfo: {},
      size: 5,
      orderInfo: {},
      checkOrderInfo: {},
    };
  },

  created() {
    this.initCourseAllInfo()
    this.initComment();
    this.getUserInfo();

  },

  methods: {

    initCourseAllInfo(){
      courseApi.getCourseAllInfo(this.$route.params.id).then((response) => {
        this.courseId= this.$route.params.id,
        this.courseBaseInfo = response.data.data.courseBaseInfo,
        this.chapterAllInfo = response.data.data.chapterVoList,
        this.isBuy = response.data.data.isBuy
    });
    },

    // 从cookie获取信息
    getUserInfo() {
      this.loginInfo.avatar =
        "https://online-zsq.oss-cn-beijing.aliyuncs.com/online-teacher-avatar/teacher_avatar_default.png";
      let userInfo = cookie.get("userInfo");
      if (userInfo) {
        this.loginInfo = JSON.parse(userInfo);
      }
    },

    // 初始化评论列表
    initComment() {
      commentApi
        .getCommentList(1, this.size, this.$route.params.id)
        .then((response) => {
          this.commentAllInfo = response.data.data;
        });
    },
    // 评论翻页
    gotoPage(page) {
      commentApi
        .getCommentList(page, this.size, this.courseId)
        .then((response) => {
          this.commentAllInfo = response.data.data;
        });
    },

    // 发表评论
    saveComment() {
      this.commentInfo.courseId = this.courseId;
      this.commentInfo.teacherId = this.courseBaseInfo.teacherId;
      this.commentInfo.userId = this.loginInfo.id;
      this.commentInfo.nickname = this.loginInfo.nickname;
      this.commentInfo.avatar = this.loginInfo.avatar;
      commentApi.saveComment(this.commentInfo).then((response) => {
        this.$message({
          type: "success",
          message: response.data.message,
        });
        this.commentInfo.content = "";
        this.initComment();
      });
    },
    // ------------------------------------购买课程--------------------------------------------------------
    // 1 创建订单
    buyCourse() {

      this.orderInfo.courseId = this.courseId;
      this.orderInfo.courseTitle = this.courseBaseInfo.title;
      this.orderInfo.courseCover = this.courseBaseInfo.cover;
      this.orderInfo.teacherName = this.courseBaseInfo.teacherName;
      this.orderInfo.userId = this.loginInfo.id;
      this.orderInfo.nickname = this.loginInfo.nickname;
      this.orderInfo.mobile = this.loginInfo.mobile;
      this.orderInfo.courseMoney = this.courseBaseInfo.price;
      this.orderInfo.reductionMoney = this.courseBaseInfo.reductionMoney;
      this.orderInfo.payMoney = Number(this.courseBaseInfo.price)-Number(this.courseBaseInfo.reductionMoney)

//    判断是否提交过 提交后点击提示错误信息
      if (this.disabled) {
        this.disabled = false
        orderApi
          .creatOrder(this.orderInfo)
          .then((response) => {
            this.$message({
              type: "success",
              message: response.data.message,
            });
            // 跳转确认订单页面
            this.$router.push({
              path: "/order/" + response.data.data.orderNumber,
            });
          })
          .catch((response) => {
            this.disabled = true;
          });
      } else {
        this.$message.error("已提交，请勿重复提交");
      }
    },
  },
};
</script>
