<template>
  <div id="aCoursesList" class="bg-fa of">
    <!-- /课程列表 开始 -->
    <section class="container">
      <header class="comm-title">
        <h2 class="fl tac">
          <span class="c-333">全部课程</span>
        </h2>
      </header>
      <section class="c-sort-box">
        <section class="c-s-dl">
          <dl>
            <dt>
              <span class="c-999 fsize14">课程类别</span>
            </dt>
            <dd class="c-s-dl-li">
              <ul class="clearfix">
                <li>
                  <a title="全部" href="#" @click="searchOne('')">全部</a>
                </li>
                <li
                  v-for="(item,index) in subjectOneList"
                  :key="index"
                  :class="{active:oneIndex==index}"
                >
                  <a :title="item.title" href="#" @click="searchOne(item.id,index)">{{item.title}}</a>
                </li>
              </ul>
            </dd>
          </dl>
          <dl>
            <dt>
              <span class="c-999 fsize14"></span>
            </dt>
            <dd class="c-s-dl-li">
              <ul class="clearfix">
                <li
                  v-for="(item,index) in subjectTwoList"
                  :key="index"
                  :class="{active:twoIndex==index}"
                >
                  <a :title="item.title" href="#" @click="searchTwo(item.id,index)">{{item.title}}</a>
                </li>
              </ul>
            </dd>
          </dl>
          <div class="clear"></div>
        </section>
        <div class="js-wrap">
          <section class="fr">
            <span class="c-ccc">
              <i class="c-master f-fM">1</i>/
              <i class="c-666 f-fM">1</i>
            </span>
          </section>
          <section class="fl">
            <ol class="js-tap clearfix">
              <li :class="{'current bg-orange':buyCountSort!=''}">
                <a title="销量" href="javascript:void(0);" @click="searchBuyCount()">
                  销量
                  <span :class="{hide:buyCountSort==''}">↓</span>
                </a>
              </li>
              <li :class="{'current bg-orange':gmtCreateSort!=''}">
                <a title="最新" href="javascript:void(0);" @click="searchGmtCreate()">
                  最新
                  <span :class="{hide:gmtCreateSort==''}">↓</span>
                </a>
              </li>
              <li :class="{'current bg-orange':priceSort!=''}">
                <a title="价格" href="javascript:void(0);" @click="searchPrice()">
                  价格&nbsp;
                  <span :class="{hide:priceSort==''}">↓</span>
                </a>
              </li>
            </ol>
          </section>
        </div>
        <div class="mt40">
          <!-- /无数据提示 开始-->
          <section class="no-data-wrap" v-show="responseInfo.total == 0">
            <em class="icon30 no-data-ico">&nbsp;</em>
            <span class="c-666 fsize14 ml10 vam">没有相关数据，小编正在努力整理中...</span>
          </section>
          <!-- /无数据提示 结束-->
          <article class="comm-course-list" v-if="responseInfo.total > 0">
            <ul class="of" id="bna">
              <li v-for="course in responseInfo.records" :key="course.id">
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
                    <span class="fr jgTag bg-green" v-if=" Number(course.price) == 0 ">
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
        </div>
        <!-- 公共分页 开始 -->
        <div>
          <div class="paging">
            <!-- undisable这个class是否存在，取决于数据属性hasPrevious -->
            <a
              :class="{undisable: !responseInfo.previous}"
              href="#"
              title="首页"
              @click.prevent="gotoPage(1)"
            >首页</a>
            <a
              v-show="responseInfo.previous"
              href="#"
              title="上一页"
              @click.prevent="gotoPage(responseInfo.current-1)"
            >&lt;</a>
            <a
              v-for="page in responseInfo.pages"
              :key="page"
              :class="{current: responseInfo.current == page, undisable: responseInfo.current == page}"
              :title="'第'+page+'页'"
              href="#"
              @click.prevent="gotoPage(page)"
            >{{ page }}</a>
            <a
              v-show="responseInfo.next"
              href="#"
              title="下一页"
              @click.prevent="gotoPage(responseInfo.current+1)"
            >&gt;</a>
            <a
              :class="{undisable: !responseInfo.next}"
              href="#"
              title="末页"
              @click.prevent="gotoPage(responseInfo.pages)"
            >末页</a>
            <div class="clear" />
          </div>
        </div>
        <!-- 公共分页 结束 -->
      </section>
    </section>
    <!-- /课程列表 结束 -->
  </div>
</template>
<script>
import courseApi from "@/api/course";
export default {
  data() {
    return {
      page: 1,
      responseInfo: {},
      subjectOneList: [], // 一级分类列表
      subjectTwoList: [], // 二级分类列表
      courseQuery: {}, // 查询表单对象
      // 选中效果
      oneIndex: -1,
      twoIndex: -1,
      buyCountSort: "",
      gmtCreateSort: "",
      priceSort: "",
    };
  },

  created() {
    this.initCourse();
    this.initSubject();
  },

  methods: {
    // 初始化课程信息
    initCourse() {
      courseApi.getCourseList(1, 8, this.courseQuery).then((response) => {
        this.responseInfo = response.data.data;
      });
    },

    // 初始化课程分类信息
    initSubject() {
      courseApi.getAllSubject().then((response) => {
        this.subjectOneList = response.data.data.list;
      });
    },

    //点击一级分类，显示对应的二级分类，并查询数据
    searchOne(parentId, index) {
      // active样式生效
      this.oneIndex = index;
      this.twoIndex = -1;

      //    清空查询条件中二级分类id和二级分类列表
      this.courseQuery.subjectId = "";
      this.subjectTwoList = [];
      // 点击一级分类进行查询
      this.courseQuery.subjectParentId = parentId;
      this.gotoPage(1);

      for (let i = 0; i < this.subjectOneList.length; i++) {
        if (this.subjectOneList[i].id === parentId) {
          this.subjectTwoList = this.subjectOneList[i].children;
        }
      }
    },

    // 二级分类查询
    searchTwo(id, index) {
      this.twoIndex = index;
      // 点击一级分类进行查询
      this.courseQuery.subjectId = id;
      this.gotoPage(1);
    },

    //购买量查询
    searchBuyCount() {
      this.buyCountSort = "1";
      this.gmtCreateSort = "";
      this.priceSort = "";
      this.courseQuery.buyCountSort = this.buyCountSort;
      this.courseQuery.gmtCreateSort = this.gmtCreateSort;
      this.courseQuery.priceSort = this.priceSort;
      this.gotoPage(this.page);
    },
    //更新时间查询
    searchGmtCreate() {
      this.buyCountSort = "";
      this.gmtCreateSort = "1";
      this.priceSort = "";
      this.courseQuery.buyCountSort = this.buyCountSort;
      this.courseQuery.gmtCreateSort = this.gmtCreateSort;
      this.courseQuery.priceSort = this.priceSort;
      this.gotoPage(this.page);
    },
    //价格查询
    searchPrice() {
      this.buyCountSort = "";
      this.gmtCreateSort = "";
      this.priceSort = "1";
      this.courseQuery.buyCountSort = this.buyCountSort;
      this.courseQuery.gmtCreateSort = this.gmtCreateSort;
      this.courseQuery.priceSort = this.priceSort;
      this.gotoPage(this.page);
    },

    // 分页切换
    gotoPage(page) {
      courseApi.getCourseList(page, 8, this.courseQuery).then((response) => {
        this.responseInfo = response.data.data;
      });
    },
  },
};
</script>
<style scoped>
.active {
  background: #b2f5d0;
}
.hide {
  display: none;
}
.show {
  display: block;
}
</style>