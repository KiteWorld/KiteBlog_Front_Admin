<template>
  <div
    class="bar-container box-shadow"
    :style="{ height: height, width: width }"
  ></div>
</template>

<script>
require("echarts/theme/macarons");
export default {
  name: "BarChart",
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
    // color: {
    //   type: Array,
    //   default: () => ["#dc69aa"],
    // },
  },
  data() {
    return {
      chart: null,
      option: {},
      socketType: "catTotal",
    };
  },
  created() {
    this.$ws.registerCallback(this.socketType, this.getData);
    this.$ws.send({
      socketType: this.socketType,
      millisecond: 60000 * 10,
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
        tooltip: {
          trigger: "item",
        },
        legend: {
          top: "5%",
          left: "center",
        },
        series: [
          {
            name: "访问来源",
            type: "pie",
            top: "14%",
            radius: ["40%", "84%"],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: "center",
            },
            emphasis: {
              label: {
                show: true,
                fontSize: "20",
                fontWeight: "bold",
              },
            },
            labelLine: {
              show: false,
            },
            data: [
              { value: 1048, name: "搜索引擎" },
              { value: 735, name: "直接访问" },
              { value: 580, name: "邮件营销" },
            ],
          },
        ],
      };
      this.chart.setOption(this.option);
      window.addEventListener("resize", () => {
        this.chart.resize();
      });
    },
    getData(data) {
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