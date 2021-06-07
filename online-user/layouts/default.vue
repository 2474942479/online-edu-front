<template>
  <div class="in-wrap">
    <!-- 公共头引入 -->
    <header id="header">
      <section class="container">
        <h1 id="logo">
          <a href="#" title="假老外外语">
            <img src="~/assets/img/JLWLogo.png" width="100%" alt="假老外外语" />
          </a>
        </h1>
        <div class="h-r-nsl">
          <ul class="nav">
            <router-link to="/" tag="li" active-class="current" exact>
              <a>首页</a>
            </router-link>
            <router-link to="/course" tag="li" active-class="current">
              <a>课程</a>
            </router-link>
            <router-link to="/teacher" tag="li" active-class="current">
              <a>名师</a>
            </router-link>
            <!-- <router-link to="/article" tag="li" active-class="current">
              <a>文章</a>
            </router-link>
            <router-link to="/qa" tag="li" active-class="current">
              <a>问答</a>
            </router-link>-->
          </ul>
          <!-- / nav -->
          <ul class="h-r-login">
            <li v-if="!userDTO.id" id="no-login">
              <a href="/login" title="登录">
                <em class="icon18 login-icon">&nbsp;</em>
                <span class="vam ml5">登录</span>
              </a>
              |
              <a href="/register" title="注册">
                <span class="vam ml5">注册</span>
              </a>
            </li>
            <li v-if="userDTO.id" id="is-login-one" class="mr10">
              <a id="headerMsgCountId" href="#" title="消息">
                <em class="icon18 news-icon">&nbsp;</em>
              </a>
              <q class="red-point" style="display: none">&nbsp;</q>
            </li>
            <li v-if="userDTO.id" id="is-login-two" class="h-r-user">
              <el-image
                style="height: 40px; width: 40px"
                v-if="userDTO.avatar"
                :src="userDTO.avatar"
                fit="cover"
                @click="drawer = true"
              ></el-image>
              <el-link @click="drawer = true" style="margin-top: -20px;">{{userDTO.nickname}}</el-link>
              <span>&nbsp;&nbsp;&nbsp;</span>
              <el-link type="danger" @click="logout" style="margin-top: -20px;">退出</el-link>
            </li>
            <!-- /未登录显示第1 li；登录后显示第2，3 li -->
          </ul>
          <aside class="h-r-search">
            <form action="#" method="post">
              <label class="h-r-s-box">
                <input type="text" placeholder="输入你想学的课程" name="queryCourse.courseName" value />
                <button type="submit" class="s-btn">
                  <em class="icon18">&nbsp;</em>
                </button>
              </label>
            </form>
          </aside>
        </div>
        <aside class="mw-nav-btn">
          <div class="mw-nav-icon"></div>
        </aside>
        <div class="clear"></div>
      </section>
      <!-- 用户信息 -->
      <el-drawer
        v-if="drawer"
        :before-close="handleCloseForm"
        :visible.sync="drawer"
        direction="rtl"
        custom-class="demo-drawer"
        ref="drawer"
        :append-to-body="false"
        style="text-align: center;"
        :close-on-press-escape="false"
        :show-close="false"
        :wrapperClosable="false"
      >
        <h1>用户信息</h1>
        <div class="demo-drawer__content">
          <el-form :model="userDTO" ref="userForm">
            <el-form-item label="用户昵称" :label-width="drawer_width" style=" font-size: 15px">
              <el-input v-model="userDTO.nickname" />
            </el-form-item>
            <el-form-item label="性别" prop="sex" :label-width="drawer_width" v-if="sex">
              <el-select v-model="userDTO.sex" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="年龄"
              prop="age"
              :label-width="drawer_width"
              :rules="[
                        { required: true, message: '年龄不能为空'},
                        { type: 'number', message: '年龄必须为数字值'}
                      ]"
            >
              <el-input v-model.number="userDTO.age" type="age" />
            </el-form-item>
            <el-form-item label="手机号" :label-width="drawer_width" style=" font-size: 15px">
              <el-input v-model="userDTO.mobile" disabled="true" />
            </el-form-item>

            <el-form-item label="创建时间" :label-width="drawer_width" style=" font-size: 15px">
              <el-date-picker v-model="userDTO.gmtCreate" type="date" :readonly="true"></el-date-picker>
            </el-form-item>

            <!-- 讲师头像上传 -->
            <el-form-item
              label="用户头像"
              :label-width="drawer_width"
              style="text-align: left; font-size: 15px"
            >
              <!-- 头像缩略图 -->
              <el-avatar shape="square" :size="100" :src="userDTO.avatar"></el-avatar>
              <!-- 文件上传按钮 -->
              <div>
                <el-button
                  round
                  type="primary"
                  icon="el-icon-upload"
                  @click="innerDrawer = true"
                >更换头像</el-button>
              </div>
              <el-drawer
                :destroy-on-close="true"
                :before-close="handleCloseAvatar"
                :append-to-body="true"
                :visible.sync="innerDrawer"
                direction="rtl"
                size="25%"
                style="text-align: center;"
              >
                <el-container>
                  <el-header>
                    <h1>更换头像</h1>
                  </el-header>
                  <el-main>
                    <el-upload
                      ref="upload"
                      :drag="true"
                      :action="BASE_API+'/eduService/oss/upload2Oss'"
                      :multiple="false"
                      :on-success="uploadSuccess"
                      :on-error="uploadFail"
                      :limit="1"
                      :before-upload="beforeAvatarUpload"
                      :on-exceed="fileNum"
                    >
                      <i class="el-icon-upload"></i>
                      <div class="el-upload__text">
                        将文件拖到此处，或
                        <em>点击上传</em>
                      </div>
                      <div
                        style=" font-size: 15px"
                        class="el-upload__tip"
                        slot="tip"
                      >只能上传jpg/png文件，且不超过500kb</div>
                    </el-upload>
                  </el-main>
                  <el-footer></el-footer>
                  <el-button size="medium" @click="innerDrawer=false;">取 消</el-button>
                </el-container>
              </el-drawer>
            </el-form-item>
          </el-form>
          <div class="demo-drawer__footer">
            <el-button size="medium" @click="cancelForm">取 消</el-button>
            <el-button
              icon="el-icon-upload"
              size="medium"
              type="primary"
              @click="edit"
              :loading="loading"
            >{{ loading ? '提交中 ...' : '提交' }}</el-button>
          </div>
        </div>
      </el-drawer>

      <el-dialog
        v-if="dialogFormVisible"
        :append-to-body="true"
        :center="true"
        title="完善信息"
        :visible.sync="dialogFormVisible"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
        :before-close="checkMobile"
      >
        <el-form
          :model="userDTO"
          status-icon
          :rules="rules"
          ref="ruleForm"
          label-width="80px"
          class="demo-ruleForm"
          label-position="right"
        >
          <el-form-item label="密码" prop="pass">
            <el-input type="password" v-model="userDTO.password" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="checkPass">
            <el-input type="password" v-model="userDTO.checkPass" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="手机号" :label-width="drawer_width" prop="mobile">
            <el-input type="text" v-model="userDTO.mobile" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-popover placement="top" width="160" v-model="visible">
            <p>手机号一经绑定, 暂时将无法修改</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="visible = false">取消</el-button>
              <el-button type="primary" size="mini" @click="saveUserMobile">确定</el-button>
            </div>
            <el-button slot="reference">提交</el-button>
          </el-popover>
        </div>
      </el-dialog>
    </header>
    <!-- /公共头引入 -->

    <nuxt />

    <!-- 公共底引入 -->
    <footer id="footer">
      <section class="container">
        <div class>
          <h4 class="hLh30">
            <span class="fsize18 f-fM c-999">友情链接</span>
          </h4>
          <ul class="of flink-list">
            <li>
              <a href="/" title="假老外外语" target="_blank">假老外外语</a>
            </li>
          </ul>
          <div class="clear"></div>
        </div>
        <div class="b-foot">
          <section class="fl col-7">
            <section class="mr20">
              <section class="b-f-link">
                <a href="#" title="关于我们" target="_blank">关于我们</a>|
                <a href="#" title="联系我们" target="_blank">联系我们</a>|
                <a href="#" title="帮助中心" target="_blank">帮助中心</a>|
                <a href="#" title="资源下载" target="_blank">资源下载</a>|
                <span>服务热线：010-56253825(太原)) 0755-85293825(杭州)</span>
                <span>Email：2474942479@qq.com</span>
              </section>
              <section class="b-f-link mt10">
                <span>©2021课程版权均归假老外所有 京ICP备17055252号</span>
              </section>
            </section>
          </section>
          <aside class="fl col-3 tac mt15">
            <section class="gf-tx">
              <span>
                <img src="~/assets/img/wx-icon.png" alt />
              </span>
            </section>
            <section class="gf-tx">
              <span>
                <img src="~/assets/img/wb-icon.png" alt />
              </span>
            </section>
          </aside>
          <div class="clear"></div>
        </div>
      </section>
    </footer>
    <!-- /公共底引入 -->
  </div>
</template>
<script>
import "~/assets/css/reset.css";
import "~/assets/css/theme.css";
import "~/assets/css/global.css";
import "~/assets/css/web.css";
import "~/assets/css/base.css";
import "~/assets/css/activity_tab.css";
import "~/assets/css/bottom_rec.css";
import "~/assets/css/nice_select.css";
import "~/assets/css/order.css";
import "~/assets/css/swiper-3.3.1.min.css";
import "~/assets/css/pages-weixinpay.css";

import cookie from "js-cookie";
import loginApi from "@/api/login";
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.userDTO.password !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.userDTO.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };

    var mobile = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入手机号"));
      } else if (!/^1[34578]\d{9}$/.test(value)) {
        return callback(new Error("手机号码格式不正确"));
      }
      return callback();
    };
    return {
      token: "",
      userDTO: {},
      drawer: false,
      drawer_width: "80px",
      innerDrawer: false,
      // 获取dev.env中BASE_API的值
      BASE_API: process.env.BASE_API,
      // 上传组件key的值 (唯一标识)
      imagecropperKey: 0,
      // 上传组件是否显示
      imagecropperShow: false,
      loading: false,
      timer: null,
      dialogFormVisible: false,
      visible: false,
      rules: {
        pass: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }],
        mobile: [{ validator: mobile, trigger: "blur" }],
      },
      options: [
        {
          value: 1,
          label: "男",
        },
        {
          value: 2,
          label: "女",
        },
        {
          value: 0,
          label: "未知",
        },
      ],
    };
  },

  mounted() {
    this.token = this.$route.query.token;
    if (this.token) {
      cookie.set("token", this.token, { domain: "localhost" });
      this.getUserInfoByToken();
    }
    this.getUserInfo();
  },

  methods: {
    // 从cookie获取信息
    getUserInfo() {
      var userInfo = cookie.get("userInfo");
      if (userInfo) {
        this.userDTO = JSON.parse(userInfo);
        this.sex = this.userDTO.sex;
      }
    },

    getUserInfoByToken() {
      loginApi.getUserInfoByToken().then((response) => {
        this.userDTO = response.data.data;
        // 获取用户信息放到cookie中
        cookie.set("userInfo", this.userDTO, { domain: "localhost" });
        if (!this.userDTO.mobile && !this.userDTO.password) {
          // 刷新后才加载
          this.dialogFormVisible = true;
        }
      });
    },

    logout() {
      cookie.set("userInfo", "", { domain: "localhost" });
      cookie.set("token", "", { domain: "localhost" });
      window.location.href = "/";
    },

    saveUserMobile() {
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          this.updateUser();
          this.visible = false;
        } else {
          return false;
        }
      });
    },

    updateUser() {
      loginApi.updateUser(this.userDTO).then((response) => {
        // 1 提示修改成功
        this.$message({
          type: "success",
          message: "修改成功!",
        });
        this.token = response.data.data;
        // 重新获取token
        this.getUserInfoByToken();
        this.getUserInfo();
        this.dialogFormVisible = false;
      });
    },

    edit() {
      this.$refs["userForm"].validate((valid) => {
        if (valid) {
          this.loading = true;
          this.timer = setTimeout(() => {
            this.updateUser();

            // 动画关闭需要一定的时间
            setTimeout(() => {
              this.loading = false;
              this.drawer = false;
            }, 400);
          }, 1000);
        } else {
          return false;
        }
      });
    },

    checkMobile() {
      if (!JSON.parse(cookie.get("userInfo")).mobile) {
        done(false);
      } else {
        done();
      }
    },

    handleCloseForm() {
      if (this.loading) {
        return;
      }
      this.$confirm("还有未保存的工作哦确定关闭吗？")
        .then((_) => {
          this.loading = false;
          this.drawer = false;
        })
        .catch((_) => {});
    },

    // 关闭编辑框
    cancelForm() {
      this.loading = false;
      this.drawer = false;
      this.getUserInfo();
      clearTimeout(this.timer);
    },

    handleCloseAvatar() {
      this.$confirm("还未上传图片，是否退出？").then(() => {
        this.innerDrawer = false;
      });
    },

    // 文件上传前判断类型以及大小
    beforeAvatarUpload(file) {
      const isIMage =
        file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "image/pipeg";
      const isLt500KB = file.size / 1024 < 500;

      if (!isIMage) {
        this.$message.error("上传头像图片只能是 JPG/PNG/JFIF 格式!");
      }
      if (!isLt500KB) {
        this.$message.error("上传头像图片大小不能超过 500KB!");
      }
      return isIMage && isLt500KB;
    },

    // 文件上传个数限制
    fileNum(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，请重新上传文件`
      );
    },

    // 上传成功的方法  data是封装后的response.data
    uploadSuccess(response) {
      // 上传之后接口返回图片地址url
      this.userDTO.avatar = response.data;
      this.innerDrawer = false;
      this.$refs.upload.clearFiles();
      this.$message({
        type: "success",
        message: "上传成功!",
      });
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

<style>
.item {
  margin-top: 10px;
  margin-right: 40px;
}
</style>