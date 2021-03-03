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
    width: {
      type: String,
      default: "100%",
    },
    height: {
      type: String,
      default: "400px",
    },
    socketType: {
      type: String,
      default: "articleCatTotal",
    },
    coustomOption: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      chart: null,
      option: {},
      //   socketType: "articleCatTotal",
    };
  },
  created() {
    this.$ws.registerCallback(this.socketType, this.getData);
    this.$ws.send({
      socketType: this.socketType,
      millisecond: 60000 * 10,
    });
	console.log(this.coustomOption)
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
          //   text: "文章分类数量占比",
          text: this.coustomOption.title,
          left: "center",
        },
        tooltip: {
          trigger: "item",
          textStyle: {
            color: "#fff",
          },
        },
        legend: {
          top: "8%",
          left: "center",
          type: "scroll",
        },
        series: [
          {
            name: this.coustomOption.name,
            type: "pie",
            top: "14%",
            radius: [0, "90%"],
            avoidLabelOverlap: false,
            label: {
              show: true,
              fontSize: "12",
              position: "inner",
              formatter: "{b} {d}%",
            },
            emphasis: {
              label: {
                show: true,
                fontSize: "14",
                fontWeight: "bold",
              },
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.2)",
              },
            },
            labelLine: {
              show: false,
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
      this.option.series[0].data = [];
      data.catTotal.forEach((x) => {
        this.option.series[0].data.push({
          value: x.total,
          name: x.categoryName,
        });
      });
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