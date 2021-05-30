    <template>
  <div class="app-container">
    <!--表单-->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="——"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
          format="yyyy 年 MM 月 dd 日"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="showChart()">查询</el-button>
    </el-form>

    <div class="chart-container">
      <div id="chart" class="chart" style="height:500px;width:100%" />
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import statistics from "@/api/edu/statistics";
export default {
  data() {
    return {
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      dateRange: [],
      xAxisData: [],
      registerData: [],
      loginData: [],
      videoData: [],
      courseData: [],
      begin: "",
      end: "",
    };
  },
  watch: {
    dateRange(newVal, oldVal) {
      if (newVal === null) {
        this.dateRange = [];
      }
    },
  },

  created() {
    this.showChart();
  },
  methods: {
    showChart() {
      this.initChartData();
    },

    // 准备图表数据
    initChartData() {
      this.begin = this.dateRange[0];
      this.end = this.dateRange[1];
      statistics.show(this.begin, this.end).then((response) => {
        response.data.forEach((data) => {
          this.xAxisData.push(data.dateCalculated);
          this.registerData.push(data.registerNum);
          this.loginData.push(data.loginNum);
          this.videoData.push(data.videoViewNum);
          this.courseData.push(data.courseNum);
        });

        console.log(this.xAxisData);

        this.setChart();
      });
    },

    // 设置图标参数
    setChart() {
      // 基于准备好的dom，初始化echarts实例
      this.chart = echarts.init(document.getElementById("chart"));

      // 指定图表的配置项和数据
      var option = {
        title: {
          text: "统计折线图展示",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985",
            },
          },
        },
        legend: {
          data: [
            "学员登录数统计",
            "学员注册数统计",
            "课程播放数统计",
            "每日课程数统计",
          ],
        },
        toolbox: {
          feature: {
            saveAsImage: {},
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            data: this.xAxisData,
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
        dataZoom: [
          {
            show: true,
            height: 30,
            xAxisIndex: [0],
            bottom: 30,
            start: 0,
            end: 100,
            handleIcon:
              "path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z",
            handleSize: "110%",
            handleStyle: {
              color: "#d3dee5",
            },
            textStyle: {
              color: "#fff",
            },
            borderColor: "#90979c",
          },
          {
            type: "inside",
            show: true,
            height: 15,
            start: 1,
            end: 35,
          },
        ],
        series: [
          {
            name: "学员登录数统计",
            type: "line",
            stack: "总量",
            areaStyle: {},
            data: this.loginData,
          },
          {
            name: "学员注册数统计",
            type: "line",
            stack: "总量",
            areaStyle: {},
            data: this.registerData,
          },
          {
            name: "课程播放数统计",
            type: "line",
            stack: "总量",
            areaStyle: {},
            data: this.videoData,
          },
          {
            name: "每日课程数统计",
            type: "line",
            stack: "总量",
            areaStyle: {},
            data: this.courseData,
          },
        ],
      };

      this.chart.setOption(option);
    },
  },
};
</script>
