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
            <router-link to="/teacher" tag="li" active-class="current">
              <a>外教</a>
            </router-link>
            <router-link to="/course" tag="li" active-class="current">
              <a>课程</a>
            </router-link>
            <router-link to="/#" tag="li" active-class="current">
              <a>关于</a>
            </router-link>
            <router-link to="/#" tag="li" active-class="current">
              <a>商务合作</a>
            </router-link>
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
              <span>&nbsp;&nbsp;</span>
              <!-- <el-link @click="drawer = true" style="margin-top: -20px;">{{userDTO.nickname}}</el-link> -->
              <el-dropdown @command="handleCommand" style=" font-size: 16px;top:-8px">
                <span class="el-dropdown-link">
                  {{userDTO.nickname}}
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="userInfo">账号与安全</el-dropdown-item>
                  <el-dropdown-item command="orderList" :divided="true">购买记录</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <span>&nbsp;&nbsp;</span>
              <el-link type="danger" @click="logout" style="margin-top: -20px;">退出</el-link>
            </li>
            <!-- /未登录显示第1 li；登录后显示第2，3 li -->
          </ul>
          <aside class="h-r-search">
            <form action="#" method="post">
              <label class="h-r-s-box">
                <input type="text" placeholder="输入你想学的课程" name="queryCourse.courseName" />
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
        <span style="font-size:35px">帐号与安全</span>
        <div class="demo-drawer__content">
          <el-form :model="userDTO" ref="userForm" style="text-align:left" :rules="rules">
            <el-form-item label="昵称" :label-width="drawer_width">
              <el-input v-model="userDTO.nickname" />
            </el-form-item>
            <el-form-item label="性别" prop="sex" :label-width="drawer_width">
              <el-select v-model="userDTO.sex" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="年龄" prop="age" :label-width="drawer_width">
              <el-input v-model.number="userDTO.age" />
            </el-form-item>
            <el-form-item label="登录密码" :label-width="drawer_width">
              <el-input :disabled="true" type="text" v-model="password" style="width:73%" />
              <el-button
                plain
                type="primary"
                style="font-size:14px;margin-left:-4px;width: 119px;"
                @click="pwdDialog=true"
              >
                <span>修改密码&nbsp;&nbsp;&nbsp;</span>
                <i class="el-icon-arrow-right"></i>
              </el-button>
            </el-form-item>
            <el-form-item label="手机号" :label-width="drawer_width">
              <el-input v-model="userDTO.mobile" :disabled="true" style="width:73%" />
              <el-button
                plain
                type="primary"
                style="font-size:14px;margin-left:-4px;width: 119px;"
                @click="mobileDialog = true"
              >
                <span>更换手机号</span>
                <i class="el-icon-arrow-right"></i>
              </el-button>
            </el-form-item>

            <el-form-item label="创建时间" :label-width="drawer_width">
              <el-date-picker v-model="userDTO.gmtCreate" type="date" :readonly="true"></el-date-picker>
            </el-form-item>

            <!-- 讲师头像上传 -->
            <el-form-item label="用户头像" :label-width="drawer_width" style="text-align: left;">
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
                      :action="'http://localhost:10002/eduService/oss/upload2Oss'"
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
                      <div style=" font-size: 15px" class="el-upload__tip" slot="tip">
                        <el-tag type="warning">只能上传jpg/png文件，且不超过500kb</el-tag>
                      </div>
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
          :model="resetDTO"
          status-icon
          :rules="rules"
          ref="ruleForm"
          label-width="80px"
          class="demo-ruleForm"
          label-position="right"
        >
          <el-form-item label="密码" prop="pass">
            <el-input type="password" v-model="resetDTO.pass" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="checkPass">
            <el-input type="password" v-model="resetDTO.checkPass" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="手机号" :label-width="drawer_width" prop="mobile">
            <el-input type="text" v-model="resetDTO.mobile" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-popover placement="top" width="160" v-model="visible">
            <p>是否确定提交?</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="visible = false">取消</el-button>
              <el-button type="primary" size="mini" @click="saveUserMobile">确定</el-button>
            </div>
            <el-button slot="reference">提交</el-button>
          </el-popover>
        </div>
      </el-dialog>

      <el-dialog title="设置密码" :visible.sync="pwdDialog" width="30%" :destroy-on-close="true">
        <el-form
          :model="resetDTO"
          status-icon
          :rules="rules"
          ref="resetDTO"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="原密码" prop="oldPass">
            <el-input type="password" v-model="resetDTO.oldPass"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="pass">
            <el-input type="password" v-model="resetDTO.pass" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="checkPass">
            <el-input type="password" v-model="resetDTO.checkPass" autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="updateUserPass('resetDTO')">提交</el-button>
            <el-button @click="resetForm('resetDTO')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>

      <el-dialog title="更换手机号" :visible.sync="mobileDialog" width="30%" :destroy-on-close="true">
        <el-form
          :model="resetDTO"
          status-icon
          :rules="rules"
          ref="mobileForm"
          label-width="80px"
          class="demo-ruleForm"
          label-position="right"
        >
          <el-form-item label="手机号" :label-width="drawer_width" prop="mobile">
            <el-input type="text" v-model="resetDTO.mobile" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="验证码" :label-width="drawer_width" prop="code">
            <el-input type="text" v-model.number="resetDTO.code" autocomplete="off"></el-input>
            <el-link @click="sendCode" :underline="false">
              <el-tag style="font-size:15px;height:33px;">{{codeText}}</el-tag>
            </el-link>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="mobileDialog = false">取 消</el-button>
          <el-button type="primary" @click="resetMobile('mobileForm')">确 定</el-button>
        </span>
      </el-dialog>

      <el-drawer
        title="购买记录"
        style="font-size:20px"
        :visible.sync="orderDrawer"
        direction="rtl"
        size="40%"
        :before-close="handleClose"
      >
        <el-table :data="orderList" style="width: 100%" :row-class-name="tableRowClassName">
          <el-table-column label="课程名称" prop="courseTitle">
            <template slot-scope="scope">
              <i class="el-icon-shopping-bag-1"></i>
              <span>{{ scope.row.courseTitle }}</span>
            </template>
          </el-table-column>
          <el-table-column label="外教名称" prop="teacherName">
            <template slot-scope="scope">
              <i class="el-icon-user"></i>
              <span>{{ scope.row.teacherName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="下单人" prop="nickname">
            <template slot-scope="scope">
              <i class="el-icon-user-solid"></i>
              <span>{{ scope.row.nickname }}</span>
            </template>
          </el-table-column>
          <el-table-column label="支付金额">
            <template slot-scope="scope">
              <el-tag type="success">{{ scope.row.payMoney }} 元</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="订单状态" prop="status">
            <template slot-scope="props">
              <el-tag type="success" v-if="props.row.status== -1" size="medium">已取消订单</el-tag>
              <el-tag type="danger" v-if="props.row.status== 0" size="medium">待付款</el-tag>
              <el-tag v-if="props.row.status== 1" size="medium">已完成</el-tag>
              <el-tag type="info" v-if="props.row.status== 2" size="medium">已付款/待发货</el-tag>
              <el-tag type="info" v-if="props.row.status== 3" size="medium">已发货/待收货</el-tag>
              <el-tag type="success" v-if="props.row.status== 4" size="medium">已确认收货</el-tag>
              <el-tag type="warning" v-if="props.row.status== 5" size="medium">已超时关闭</el-tag>
            </template>
          </el-table-column>

          <el-table-column type="expand">
            <template slot-scope="props">
              <el-card class="box-card" shadow="hover">
                <el-form label-position="left" inline class="demo-table-expand">
                  <el-form-item>
                    <el-link
                      :href="'/course/' + props.row.courseId "
                      target="_blank"
                      :underline="false"
                    >
                      <el-image
                        style="width: 100px; height: 150px"
                        :src="props.row.courseCover"
                        fit="cover"
                      ></el-image>
                    </el-link>
                  </el-form-item>
                  <el-form-item label="课程名称">
                    <i class="el-icon-shopping-bag-1"></i>
                    <span>{{ props.row.courseTitle }}</span>
                  </el-form-item>
                  <el-form-item label="讲师名称">
                    <i class="el-icon-user"></i>
                    <span>{{ props.row.teacherName }}</span>
                  </el-form-item>

                  <el-form-item label="下单人">
                    <i class="el-icon-user-solid"></i>
                    <span>{{ props.row.nickname }}</span>
                  </el-form-item>
                  <el-form-item label="下单手机号">
                    <i class="el-icon-mobile-phone"></i>
                    <span>{{ props.row.mobile }}</span>
                  </el-form-item>
                  <el-form-item label="课程金额">
                    <el-tag type="info">{{ props.row.courseMoney }} 元</el-tag>
                  </el-form-item>
                  <el-form-item label="优惠金额">
                    <el-tag type="danger">{{ props.row.reductionMoney }} 元</el-tag>
                  </el-form-item>
                  <el-form-item label="支付金额">
                    <el-tag type="success">{{ props.row.payMoney }} 元</el-tag>
                  </el-form-item>
                  <el-form-item label="支付类型">
                    <el-tag v-if="props.row.payType== 1" size="medium">支付宝</el-tag>
                    <el-tag v-if="props.row.payType== 2" size="medium">微信</el-tag>
                  </el-form-item>

                  <el-form-item label="订单号">
                    <span>{{ props.row.orderNumber }}</span>
                  </el-form-item>
                  <el-form-item label="下单时间">
                    <i class="el-icon-time"></i>
                    <span>{{ props.row.gmtCreate }}</span>
                  </el-form-item>
                  <el-form-item label="支付时间">
                    <i class="el-icon-time"></i>
                    <span>{{ props.row.gmtModified }}</span>
                  </el-form-item>
                  <el-form-item label="订单状态">
                    <el-tag type="success" v-if="props.row.status== -1" size="medium">已取消订单</el-tag>
                    <el-tag type="danger" v-if="props.row.status== 0" size="medium">待付款</el-tag>
                    <el-tag v-if="props.row.status== 1" size="medium">已完成</el-tag>
                    <el-tag type="info" v-if="props.row.status== 2" size="medium">已付款/待发货</el-tag>
                    <el-tag type="info" v-if="props.row.status== 3" size="medium">已发货/待收货</el-tag>
                    <el-tag type="success" v-if="props.row.status== 4" size="medium">已确认收货</el-tag>
                    <el-tag type="warning" v-if="props.row.status== 5" size="medium">已超时关闭</el-tag>
                  </el-form-item>
                </el-form>
              </el-card>
            </template>
          </el-table-column>
        </el-table>
      </el-drawer>
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
import msmApi from "@/api/msm";
import orderApi from "@/api/order";
export default {
  data() {
    var validateCheckPass = (rule, value, callback) => {
      if (!value || value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.resetDTO.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };

    var validateOldPass = (rule, value, callback) => {
      if (!value || value === "") {
        callback(new Error("请输入原密码"));
      } else {
        callback();
      }
    };

    var validateResetPass = (rule, value, callback) => {
      if (!value || value === "") {
        callback(new Error("请输入密码"));
      } else {
        callback();
      }
    };

    var mobile = (rule, value, callback) => {
      if (!value || value === "") {
        callback(new Error("请输入手机号"));
      } else if (!/^1[34578]\d{9}$/.test(value)) {
        return callback(new Error("手机号码格式不正确"));
      }
      return callback();
    };

    var checkAge = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("年龄不能为空"));
      }
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error("请输入数字值"));
        } else {
          if (value < 0 || value > 99) {
            callback(new Error("年龄必须在0 - 100岁之间"));
          } else {
            callback();
          }
        }
      }, 10);
    };

    return {
      page: 1,
      size: 10,
      orderQueryDTO: {},
      orderList: [],
      orderDrawer: false,
      resetDTO: {},
      second: 60, //倒计时间
      codeText: "发送验证码",
      pwdDialog: false,
      mobileDialog: false,
      password: "*********",
      token: "",
      userDTO: {},
      drawer: false,
      drawer_width: "80px",
      innerDrawer: false,
      // 上传组件key的值 (唯一标识)
      imagecropperKey: 0,
      // 上传组件是否显示
      imagecropperShow: false,
      loading: false,
      timer: null,
      dialogFormVisible: false,
      visible: false,
      sendBtnDisabled: false,
      rules: {
        pass: [{ validator: validateResetPass, trigger: "blur" }],
        checkPass: [{ validator: validateCheckPass, trigger: "blur" }],
        oldPass: [{ validator: validateOldPass, trigger: "blur" }],
        mobile: [{ validator: mobile, trigger: "blur" }],
        age: [{ validator: checkAge, trigger: "blur" }],
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
      }
    },

    getUserInfoByToken() {
      loginApi.getUserInfoByToken().then((response) => {
        this.userDTO = response.data.data;
        // 获取用户信息放到cookie中
        cookie.set("userInfo", this.userDTO, { domain: "localhost" });
        if (!this.userDTO.mobile) {
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
          this.resetDTO.id = this.userDTO.id;
          loginApi.perfectUser(this.resetDTO).then((response) => {
            // 1 提示修改成功
            this.$message({
              type: "success",
              message: "修改成功!",
            });
            this.resetDTO = {};
            // 重新获取token
            this.getUserInfoByToken();
            this.getUserInfo();
            this.dialogFormVisible = false;
          });
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
            this.getUserInfo();

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

    updateUserPass(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.resetDTO.id = this.userDTO.id;
          loginApi.updateUserPass(this.resetDTO).then((response) => {
            this.$message({
              type: "success",
              message: "重置成功!",
            });

            this.logout();
          });
        } else {
          return false;
        }
      });
    },

    resetMobile(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.resetDTO.id = this.userDTO.id;
          loginApi.updateUserMobile(this.resetDTO).then((response) => {
            this.$message({
              type: "success",
              message: "修改成功!",
            });

            this.logout();
          });
        } else {
          return false;
        }
      });
    },

    // 用户下拉选项
    handleCommand(command) {
      if (command === "userInfo") {
        this.drawer = true;
      }

      if (command === "orderList") {
        this.getOrderListByUserId(1);
        this.orderDrawer = true;
      }
    },

    getOrderListByUserId(page = 1) {
      this.orderQueryDTO.current = page;
      this.orderQueryDTO.size = this.size;
      this.orderQueryDTO.queryKey = "user_id";
      this.orderQueryDTO.queryValue = this.userDTO.id;
      orderApi.getOrderListByUserId(this.orderQueryDTO).then((response) => {
        this.page = response.data.data.current;
        this.orderList = response.data.data.records;
        this.total = response.data.data.total;
      });
      console.log(this.orderList);
    },

    checkMobile() {
      if (!JSON.parse(cookie.get("userInfo")).mobile) {
        done(false);
      } else {
        done();
      }
    },

    sendCode() {
      if (!this.resetDTO.mobile) {
        this.$notify.error({
          title: "错误",
          message: "手机号不能为空",
        });
        return;
      }

      if (this.sendBtnDisabled) {
        return;
      }
      // 按钮不可用
      this.sendBtnDisabled = true;
      // 开始倒计时
      this.timeDown();
      msmApi.sendCodeByMobile(this.resetDTO.mobile).then((response) => {
        // 提示信息
        this.$message({
          type: "success",
          message: "验证码发送成功",
        });
      });
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

    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 获取验证码倒计时
    timeDown() {
      let result = setInterval(() => {
        this.second--;
        this.codeText = this.second + "秒后重新发送";
        if (this.second < 1) {
          clearInterval(result);
          this.sendBtnDisabled = true;
          this.second = 60;
          this.codeText = "发送验证码";
        }
      }, 1000);
    },

    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
    // 给行加颜色
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === 1) {
        return "warning-row";
      } else if (rowIndex === 3) {
        return "success-row";
      }
      return "";
    },
  },
};
</script>

<style>
.item {
  margin-top: 10px;
  margin-right: 40px;
}

.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
.el-icon-arrow-down {
  font-size: 12px;
}

.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
</style>