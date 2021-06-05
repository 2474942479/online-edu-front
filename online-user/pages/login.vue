<template>
  <div class="main">
    <div class="title">
      <a class="active" href="/login">登录</a>
      <span>·</span>
      <a href="/register">注册</a>
    </div>

    <div class="sign-up-container">
      <el-form ref="userForm" :model="loginInfo">
        <el-form-item
          class="input-prepend restyle"
          prop="mobile"
          :rules="[{ required: true, message: '请输入手机号码', trigger: 'blur' },{validator: checkPhone, trigger: 'blur'}]"
        >
          <div>
            <el-input type="text" placeholder="手机号" v-model="loginInfo.mobile" />
            <i class="iconfont icon-phone" />
          </div>
        </el-form-item>

        <el-form-item
          class="input-prepend"
          prop="password"
          :rules="[{ required: true, message: '请输入密码', trigger: 'blur' }]"
        >
          <div>
            <el-input type="password" placeholder="密码" v-model="loginInfo.password" />
            <i class="iconfont icon-password" />
          </div>
        </el-form-item>

        <div class="btn">
          <input type="button" class="sign-in-button" value="登录" @click="login()" />
        </div>
      </el-form>
      <!-- 更多登录方式 -->
      <div class="more-sign">
        <h6>社交帐号登录</h6>
        <ul>
          <li>
            <a
              id="weixin"
              class="weixin"
              target="_top"
              href="http://localhost:8150/api/ucenter/wx/login"
            >
              <i class="iconfont icon-weixin" />
            </a>
          </li>
          <li>
            <a id="qq" class="qq" target="_blank" href="#">
              <i class="iconfont icon-qq" />
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import "~/assets/css/sign.css";
import "~/assets/css/iconfont.css";
import cookie from "js-cookie";

import loginApi from "@/api/login";
export default {
  layout: "sign",

  data() {
    return {
      loginInfo: {
        mobile: "",
        password: "",
      },
    };
  },

  methods: {
    login() {
      // 第一步 调用接口返回token字符串
      loginApi.postLoginInfo(this.loginInfo).then((response) => {
        // 第二步 将返回的token字符串放到cookie中
        // 三个参数 1 cookie中参数名 2 参数对应的值 3 作用范围
        cookie.set("token", response.data.data, {
          domain: "localhost",
        });
        // 第三步 request.js中添加拦截器
        // 调用接口 根据token中的id获取用户信息 在首页展示
        loginApi.getUserInfoByToken().then((response) => {
          // 获取用户信息放到cookie中
          cookie.set("userInfo", response.data.data, {
            domain: "localhost",
          });

          // js跳转主页面
         window.location.href = "/";
        });

        this.$message({
          type: "success",
          message: "登录成功",
        });
      });
    },
    checkPhone(rule, value, callback) {
      if (!/^1[34578]\d{9}$/.test(value)) {
        return callback(new Error("手机号码格式不正确"));
      }
      return callback();
    },
  },
};
</script>
<style>
.el-form-item__error {
  z-index: 9999999;
}
</style>