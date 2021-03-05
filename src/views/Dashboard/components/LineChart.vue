<template>
  <div
    class="bar-container box-shadow"
    :style="{ height: height, width: width }"
  ></div>
</template>

<script>
require("echarts/theme/macarons");
export default {
  name: "LineChart",
  props: {
    // className: {
    //   type: String,
    //   default: "chart",
    // },
    width: {
      type: String,
      default: "100%",
    },
    height: {
      type: String,
      default: "400px",
    },
    color: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      chart: null,
      option: {},
      socketType: "trendChart",
    };
  },
  created() {
    this.$ws.registerCallback(this.socketType, this.getData);
    this.$ws.send({
      socketType: this.socketType,
      millisecond: 10000,
      day: 15,
    });
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart();
    });
  },
  methods: {
    initChart() {
      this.chart = this.$echarts.init(this.$el, "macarons");
      this.option = {
        title: {
          text: "近15天增长趋势",
          left: "center",
        },
        tooltip: {
          trigger: "axis",
          textStyle: {
            color: "#fff",
          },
          //   axisPointer: {
          //     type: "cross",
          //     label: {
          //       backgroundColor: "#6a7985",
          //     },
          //   },
        },
        legend: {
          top: 30,
          data: ["用户增长", "文章增长", "沸点增长"],
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          top: "20%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            data: [],
            inverse: true, //取反
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
        series: [
          {
            name: "用户增长",
            type: "line",
            stack: "总量1",
            areaStyle: {
              opacity: 0.3,
            },
            emphasis: {
              focus: "series",
            },
            data: [],
          },
          {
            name: "文章增长",
            type: "line",
            stack: "总量2",
            areaStyle: {
              opacity: 0.3,
            },
            emphasis: {
              focus: "series",
            },
            data: [],
          },
          {
            name: "沸点增长",
            type: "line",
            stack: "总量3",
            areaStyle: {
              opacity: 0.3,
            },
            emphasis: {
              focus: "series",
            },
            data: [],
          },
        ],
      };
      this.chart.setOption(this.option);
      window.addEventListener("resize", () => {
        this.chart.resize();
      });
    },
    getData(data) {
      this.option.xAxis[0].data = data.dayTotal.userDayTotal.map(
        (x) => x.date.split("-")[2]
      );
      this.option.series[0].data = data.dayTotal.userDayTotal.map(
        (x) => x.totalcount
      );
      this.option.series[1].data = data.dayTotal.articleDayTotal.map(
        (x) => x.totalcount
      );
      this.option.series[2].data = data.dayTotal.hotPointDayTotal.map(
        (x) => x.totalcount
      );
      this.chart.setOption(this.option);
    },
  },
};
</script>

<style lang="less" scoped>
.bar-container {
  padding: 20px;
  box-sizing: border-box;
}
</style>
