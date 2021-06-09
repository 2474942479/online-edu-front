<template>
  <div class="main">
    <div class="title">
      <a href="/login">登录</a>
      <span>·</span>
      <a class="active" href="/register">注册</a>
    </div>

    <div class="sign-up-container">
      <el-form ref="userForm" :model="registerInfo">
        <el-form-item
          class="input-prepend restyle"
          prop="nickname"
          :rules="[{ required: true, message: '请输入你的昵称', trigger: 'blur' }]"
        >
          <div>
            <el-input type="text" placeholder="你的昵称" v-model="registerInfo.nickname" />
            <i class="iconfont icon-user" />
          </div>
        </el-form-item>

        <!-- :rules 三个参数 1 required 是否为必填 2 message：没有纸提示信息 3trigger 失去焦点进行提示 
        validator 自定义规则-->

        <el-form-item
          class="input-prepend restyle no-radius"
          prop="mobile"
          :rules="[{ required: true, message: '请输入手机号码', trigger: 'blur' },{validator: checkPhone, trigger: 'blur'}]"
        >
          <div>
            <el-input type="text" placeholder="手机号" v-model="registerInfo.mobile" />
            <i class="iconfont icon-phone" />
          </div>
        </el-form-item>

        <el-form-item
          class="input-prepend restyle no-radius"
          prop="code"
          :rules="[{ required: true, message: '请输入验证码', trigger: 'blur' }]"
        >
          <div style="width: 100%;display: block;float: left;position: relative">
            <el-input type="text" placeholder="验证码" v-model="registerInfo.code" />
            <i class="iconfont icon-phone" />
          </div>
          <div class="btn" style="position:absolute;right: 0;top: 6px;width: 40%;">
            <a
              href="javascript:#"
              type="button"
              @click="getCode()"
              :value="codeText"
              style="border: none;background-color: none"
            >{{codeText}}</a>
          </div>
        </el-form-item>

        <el-form-item
          class="input-prepend"
          prop="password"
          :rules="[{ required: true, message: '请输入密码', trigger: 'blur' }]"
        >
          <div>
            <el-input type="password" placeholder="设置密码" v-model="registerInfo.password" />
            <i class="iconfont icon-password" />
          </div>
        </el-form-item>

        <div class="btn">
          <input type="button" class="sign-up-button" value="注册" @click="register()" />
        </div>
        <p class="sign-up-msg">
          点击 “注册” 即表示您同意并愿意遵守简书
          <br />
          <a target="_blank" href="http://www.jianshu.com/p/c44d171298ce">用户协议</a>
          和
          <a target="_blank" href="http://www.jianshu.com/p/2ov8x3">隐私政策</a> 。
        </p>
      </el-form>
      <!-- 更多注册方式 -->
      <div class="more-sign">
        <h6>社交帐号直接注册</h6>
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
import registerApi from "@/api/register";
import msmApi from "@/api/msm";

export default {
  layout: "sign",
  data() {
    return {
      registerInfo: {
        mobile: "",
        code: "",
        nickname: "",
        password: "",
      },
      sendBtnDisabled: true, //是否发送验证码
      second: 60, //倒计时间
      codeText: "发送验证码",
    };
  },
  created() {},
  methods: {
    //   获取验证码
    getCode() {

      if(!this.registerInfo.mobile) {
        this.$notify.error({
          title: '错误',
          message: '手机号不能为空'
        });
        return;
      }

      if (!this.sendBtnDisabled) {
        return;
      }
      // 按钮不可用
      this.sendBtnDisabled = false;
      // 开始倒计时
      this.timeDown();
      msmApi
        .sendCodeByMobile(this.registerInfo.mobile)
        .then((response) => {
          // 提示信息
          this.$message({
            type: 'success',
            message: "验证码发送成功",
          });
        })
        .catch((response) => {
          this.$message({
            type: 'error',
            message: response.data.message,
          });
        });
    },

    // 获取验证码倒计时
    timeDown() {
      let result = setInterval(() => {
        this.second--;
        this.codeText = this.second+"秒后重新发送";
        if (this.second < 1) {
          clearInterval(result);
          this.sendBtnDisabled = true;
          this.second = 60;
          this.codeText = "发送验证码";
        }
      }, 1000);
    },

    register() {

      registerApi
        .postRegisterInfo(this.registerInfo)
        .then((response) => {
          // 提示注册成功
          this.$message({
            type: "success",
            message: "注册成功, 请登录!",
          });
          // 跳转到登录页面
          this.$router.push({ path: "/login" });
        })
        .catch((response) => {
          this.$message({
            type: 'error',
            message: response.data.message,
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