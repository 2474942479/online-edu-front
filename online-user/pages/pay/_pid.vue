<template>
  <div class="cart py-container">
    <!--主内容-->
    <div class="checkout py-container pay">
      <div class="checkout-tit">
        <h4 class="fl tit-txt">
          <span class="success-icon"></span>
          <span class="success-info">订单提交成功，请您及时付款！订单号：{{payObj.orderNumber}}</span>
        </h4>
        <span class="fr">
          <em class="sui-lead">应付金额：</em>
          <em class="orange money">￥{{payObj.payMoney}}</em>
        </span>
        <div class="clearfix"></div>
      </div>
      <div class="checkout-steps">
        <div class="fl weixin">微信支付</div>
        <div class="fl sao">
          <p class="red">请使用微信扫一扫。</p>
          <div class="fl code">
            <!-- <img id="qrious" src="~/assets/img/erweima.png" alt=""> -->
            <!-- <qriously value="weixin://wxpay/bizpayurl?pr=R7tnDpZ" :size="338"/> -->
            <qriously :value="payObj.code_url" :size="338" />
            <div class="saosao">
              <p>请使用微信扫一扫</p>
              <p>扫描二维码支付</p>
            </div>
          </div>
        </div>
        <div class="clearfix"></div>
        <!-- <p><a href="pay.html" target="_blank">> 其他支付方式</a></p> -->
      </div>
    </div>
  </div>
</template>
<script>
import payApi from "@/api/pay";
import orderApi from "@/api/order";
export default {
  //根据订单id生成微信支付二维码  params取路径参数: 页面名为_** 取值为params.**
  asyncData({ params, error }) {
    return payApi.createNative(params.pid).then((response) => {
      return {
        payObj: response.data.data,
      };
    });
  },
  data() {
    return {
      initQCode: "",
      timer: null, // 定时器名称
    };
  },
  mounted() {
    //在页面渲染之后执行
    //每隔三秒，去查询一次支付状态
    this.timer = setInterval(() => {
      this.selectPayStatus(this.payObj.orderNumber);
    }, 3000);
  },

  // 离开支付页面(路由跳转)，清除定时器
  beforeRouteLeave(to, from, next) {
    if (this.timer !== null) {
      this.$confirm("此操作将退出支付并取消该订单, 是否继续?", "提示", {
        confirmButtonText: "退出",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          orderApi.removeOrder(this.payObj.orderNumber).then((response) => {
            clearInterval(this.timer);
            this.$message({
              type: "error",
              message: response.data.message,
            });
            next();
          });
        })
        .catch(() => {
          // clearInterval(this.timer);
          next(false);
        });
    }
  },
  methods: {
    //查询支付状态的方法
    selectPayStatus(orderNumber) {
      payApi.getPayStatus(orderNumber).then((response) => {
        if (response.data.success) {
          //如果支付成功，清除定时器
          clearInterval(this.timer);
          this.timer = null;
          this.$message({
            type: "success",
            message: response.data.message,
          });
          //跳转到课程详情页面观看视频
          window.location.href="/course/" + this.payObj.courseId 
          // window.setTimeout=("window.location='/login'",3000)
        }
      });
    },
  },
};
</script>