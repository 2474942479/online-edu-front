<template>
  <div>
    <!-- 幻灯片 开始 -->
    <div>
      <template>
        <el-carousel :interval="4000" type="card">
          <el-carousel-item v-for="banner in bannerList" :key="banner.id">
            <a target="_blank" :href="banner.linkUrl">
              <img :src="banner.imageUrl" :alt="banner.title" width="100%" />
            </a>
          </el-carousel-item>
        </el-carousel>
      </template>
    </div>

    <!-- 幻灯片 结束 -->

    <div id="aCoursesList">
      <!-- 热门课程 开始 -->
      <div>
        <section class="container">
          <header class="comm-title">
            <h2 class="tac">
              <span class="c-333">热门课程</span>
            </h2>
          </header>
          <div>
            <article class="comm-course-list">
              <ul class="of" id="bna">
                <li v-for="course in courseList" :key="course.id">
                  <div class="cc-l-wrap">
                    <section class="course-img">
                      <img :src="course.cover" class="img-responsive" :alt="course.title" />
                      <div class="cc-mask">
                        <a :href="'/course/'+course.id" title="开始学习" class="comm-btn c-btn-1">开始学习</a>
                      </div>
                    </section>
                    <h3 class="hLh30 txtOf mt10">
                      <a
                        :href="'/course/'+course.id"
                        :title="course.title"
                        class="course-title fsize18 c-333"
                      >{{course.title}}</a>
                    </h3>
                    <section class="mt10 hLh20 of">
                      <!-- 判断价格是否为0  是则显示免费 否则不显示 Number内置函数   -->
                      <span class="fr jgTag bg-green" v-if="Number(course.price) === 0">
                        <i class="c-fff fsize12 f-fA">免费</i>
                      </span>
                      <span class="fl jgAttr c-ccc f-fA">
                        <i class="c-999 f-fA">{{course.viewCount}}人学习</i>
                        |
                        <i class="c-999 f-fA">{{course.buyCount}}评论</i>
                      </span>
                    </section>
                  </div>
                </li>
              </ul>
              <div class="clear"></div>
            </article>
            <section class="tac pt20">
              <a href="/course" title="全部课程" class="comm-btn c-btn-2" target="_top">全部课程</a>
            </section>
          </div>
        </section>
      </div>
      <!-- /热门课程 结束 -->
      <!-- 名师 开始 -->
      <div>
        <section class="container">
          <header class="comm-title">
            <h2 class="tac">
              <span class="c-333">名师大咖</span>
            </h2>
          </header>
          <div>
            <article class="i-teacher-list">
              <ul class="of">
                <li v-for="teacher in teacherList" :key="teacher.id">
                  <section class="i-teach-wrap">
                    <div class="i-teach-pic">
                      <a :href="'/teacher/'+teacher.id" :title="teacher.name">
                        <img class="teach_img" :alt="teacher.name" :src="teacher.avatar" />
                      </a>
                    </div>
                    <div class="mt10 hLh30 txtOf tac">
                      <a
                        :href="'/teacher/'+teacher.id"
                        :title="teacher.name"
                        class="fsize18 c-666"
                      >{{teacher.name}}</a>
                    </div>
                    <div class="hLh30 txtOf tac">
                      <span class="fsize14 c-999">{{teacher.career}}</span>
                    </div>
                    <div class="mt15 i-q-txt">
                      <p class="c-999 f-fA">{{teacher.intro}}</p>
                    </div>
                  </section>
                </li>
              </ul>
              <div class="clear"></div>
            </article>
            <section class="tac pt20">
              <a href="/teacher" title="全部讲师" class="comm-btn c-btn-2">全部讲师</a>
            </section>
          </div>
        </section>
      </div>
      <!-- /网校名师 结束 -->
    </div>
  </div>
</template>

<script>
import banner from "@/api/indexInfo";

export default {
  data() {
    return {
      bannerList: [],
      courseList: [],
      teacherList: [],

      swiperOption: {
        //配置分页
        pagination: {
          el: ".swiper-pagination", //分页的dom节点
        },
        //配置导航
        navigation: {
          nextEl: ".swiper-button-next", //下一页dom节点
          prevEl: ".swiper-button-prev", //前一页dom节点
        },
      },
    };
  },

  created() {
    this.getList();
  },

  methods: {
    getList() {
      banner.getIndexInfo().then((response) => {
        this.bannerList = response.data.data.bannerList;
        this.courseList = response.data.data.courseList;
        this.teacherList = response.data.data.teacherList;
      });
    },
  },
};
</script>

<style>
.el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }
  
  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }
  .teach_img:hover{
    transform: rotateY(360deg);
  }
</style>