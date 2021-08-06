<template>
  <div class="app-container">
    <!--表单-->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="日期">
        <el-date-picker v-model="day" type="date" placeholder="选择要统计的日期" value-format="yyyy-MM-dd" />
      </el-form-item>

      <el-button :disabled="btnDisabled" type="primary" @click="create()">生成</el-button>
    </el-form>
    <div id="chart" class="chart" style="height:500px;width:100%" />
  </div>
</template>

<script>
import daily from "@/api/edu/statistics";
import * as echarts from "echarts";

export default {
  data() {
    return {
      day: "",
      btnDisabled: false,
    };
  },

  created() {
    this.btnDisabled = false;
  },

  watch: {
    day: {
      handler() {
        this.btnDisabled = false;
      },
      deep: true,
    },
  },

  methods: {
    create() {
      this.btnDisabled = true;
      daily.createStatistics(this.day).then((response) => {
        this.btnDisabled = false;
        this.$message({
          type: "success",
          message: "生成成功",
        });
        this.getDailyByDay();
      });
    },

    getDailyByDay() {
      daily.getStatisticsByDay(this.day).then((response) => {
        this.setChart(response.data);
      });
    },

    setChart(data) {
      var myChart = echarts.init(document.getElementById("chart"));
      var option;

      option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },

        xAxis: {
          type: "category",
          data: ["注册人数", "登录人数", "每日播放视频数", "每日新增课程数"],
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: [
              data.registerNum,
              data.loginNum,
              data.videoViewNum,
              data.courseNum,
            ],
            type: "bar",
          },
        ],
      };

      option && myChart.setOption(option);
    },
  },
};
</script>