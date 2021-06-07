<template>
  <div class="Page Confirm">
    <el-steps :active="2" finish-status="success" simple style="margin-top: 20px">
      <el-step title="购买课程"></el-step>
      <el-step title="确认订单"></el-step>
      <el-step title="支付订单"></el-step>
    </el-steps>
    <el-divider>
      <i class="el-icon-mobile-phone"></i>
    </el-divider>

    <el-card class="box-card">
      <el-form :label-position="labelPosition" label-width="80px" model="formLabelAlign">
        <el-form-item>
          <el-table :data="orderVO" style="width: 100%">
            <el-table-column prop="courseCover" label="商品" width="580" align="center">
              <div style="display:flex;jus">
                <el-image
                  style="width: 150px; height: 200px;display:block"
                  :src="orderInfo.courseCover"
                  fit="cover"
                ></el-image>
                <div style="text-align:left;margin-left:20px">
                  <el-link
                    type="info"
                    :underline="false"
                    :href="'/course/'+orderInfo.courseId"
                    target="_blank"
                    style="font-size:20px;display:block;margin-bottom:30px"
                  >{{orderInfo.courseTitle}}</el-link>
                  <el-link
                    type="info"
                    :underline="false"
                    :href="'/teacher/'+orderInfo.teacherId"
                    target="_blank"
                    style="font-size:20px;display:block;margin-bottom:30px"
                  >{{orderInfo.teacherName}}</el-link>
                </div>
              </div>
            </el-table-column>
            <el-table-column
              prop="name"
              label="原价"
              width="180"
              align="center"
              style="text-align:center"
            >
              <span style="font-size:20px">￥{{Number(orderInfo.courseMoney)}}</span>
              <el-tag
                type="danger"
                style="font-size:20px;display:block;width:90px;margin-left:35px;margin-top:20px"
              >优惠￥{{Number(orderInfo.reductionMoney)}}</el-tag>
            </el-table-column>
            <el-table-column prop="name" label="现价" width="180" align="center">
              <span style="font-size:20px">￥{{Number(orderInfo.payMoney)}}</span>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item>
          <div>
            <el-link type="info" :href="'/course/'+orderInfo.courseId" :underline="false">返回课程详情页</el-link>
            <div style="margin-top:0;display:inline-block;margin-left:510px">
              共
              <strong class="red">1</strong> 件商品，合计
              <span class="red f20">
                ￥
                <strong id="AllPrice">{{Number(orderInfo.payMoney)}}</strong>
              </span>
              <el-divider direction="vertical"></el-divider>
              <el-button
                @click="toPay()"
                :disabled="!buttonDisabled"
                style="width:120px;height:45px"
                type="primary"
                round
              >去支付</el-button>
            </div>
          </div>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="buttonDisabled" style="margin-left:660px">我已阅读并同意</el-checkbox>
          <el-link type="primary" :underline="false">《假老外购买协议》</el-link>
        </el-form-item>
      </el-form>
    </el-card>
    <el-divider></el-divider>
  </div>
</template>
<script>
import orderApi from "@/api/order";
export default {
  data() {
    return {
      orderVO: [],
      orderInfo: {},
      buttonDisabled: false,
    };
  },

  created() {
    this.init(this.$route.params.orderNumber);
  },

  methods: {
    init(id) {
      orderApi.getOrderInfo(id).then((response) => {
        this.orderInfo = response.data.data;
        this.orderVO.push(response.data.data);
      });
    },

    //点击去支付，跳转到支付页面
    toPay() {
      this.buttonDisabled = false;
      this.$router.push({ path: "/pay/" + this.orderInfo.orderNumber });
    },
  },
};
</script>