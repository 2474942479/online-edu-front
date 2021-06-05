<template>
  <div id="aCoursesList" class="bg-fa of">
    <!-- 讲师列表 开始 -->
    <section class="container">
      <header class="comm-title all-teacher-title">
        <h2 class="fl tac">
          <span class="c-333">全部讲师</span>
        </h2>
        <section class="c-tab-title">
          <a id="subjectAll" title="全部" href="#">全部</a>
          <!-- <c:forEach var="subject" items="${subjectList }">
                            <a id="${subject.subjectId}" title="${subject.subjectName }" href="javascript:void(0)" onclick="submitForm(${subject.subjectId})">${subject.subjectName }</a>
          </c:forEach>-->
        </section>
      </header>
      <section class="c-sort-box unBr">
        <div>
          <!-- /无数据提示 开始-->
          <section class="no-data-wrap" v-if="pageInfo.total == 0">
            <em class="icon30 no-data-ico">&nbsp;</em>
            <span class="c-666 fsize14 ml10 vam">没有相关数据，小编正在努力整理中...</span>
          </section>
          <!-- /无数据提示 结束-->
          <article class="i-teacher-list" v-if="pageInfo.total > 0">
            <ul class="of">
              <li v-for="teacher in pageInfo.records" :key="teacher.id">
                <section class="i-teach-wrap">
                  <div class="i-teach-pic">
                    <a :href="'/teacher/'+teacher.id" :title="teacher.name" target="_top">
                      <img :src="teacher.avatar" :alt="teacher.name" width="100px" height="100px" />
                    </a>
                  </div>
                  <div class="mt10 hLh30 txtOf tac">
                    <a
                      :href="'/teacher/'+teacher.id"
                      :title="teacher.name"
                      target="_top"
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
        </div>
        <!-- 公共分页 开始 -->
        <div>
          <div class="paging">
            <!-- undisable这个class是否存在，取决于数据属性hasPrevious -->
            <a
              :class="{undisable: !pageInfo.previous}"
              href="#"
              title="首页"
              @click.prevent="gotoPage(1)"
            >首页</a>
            <a
              v-show="pageInfo.previous"
              href="#"
              title="上一页"
              @click.prevent="gotoPage(pageInfo.current-1)"
            >&lt;</a>
            <a
              v-for="page in pageInfo.pages"
              :key="page"
              :class="{current: pageInfo.current == page, undisable: pageInfo.current == page}"
              :title="'第'+page+'页'"
              href="#"
              @click.prevent="gotoPage(page)"
            >{{ page }}</a>
            <a
              v-show="pageInfo.next"
              href="#"
              title="下一页"
              @click.prevent="gotoPage(pageInfo.current+1)"
            >&gt;</a>
            <a
              :class="{undisable: !pageInfo.next}"
              href="#"
              title="末页"
              @click.prevent="gotoPage(pageInfo.pages)"
            >末页</a>
            <div class="clear" />
          </div>
        </div>
        <!-- 公共分页 结束 -->
      </section>
    </section>
    <!-- /讲师列表 结束 -->
  </div>
</template>
<script>
import teacherApi from "@/api/teacher";
export default {
  data() {
    return {
      page: 1,
      pageInfo: {},
      size: 8,
      teacherQueryDTO: {},
    };
  },

  created() {
    this.initTeacher();
  },

  methods: {
    initTeacher() {
      this.teacherQueryDTO.size = this.size;
      this.teacherQueryDTO.page = this.page;
      return teacherApi
        .getTeacherList(this.teacherQueryDTO)
        .then((response) => {
          //  相当于data():{pageInfo:{}} this.list = response.data.data的简写
          this.pageInfo = response.data.data
        });
    },

    // 分页方法
    gotoPage(page) {
      this.teacherQueryDTO.page = page;
      teacherApi.getTeacherList(this.teacherQueryDTO).then((response) => {
        this.pageInfo = response.data;
      });
    },
  },
};
</script>