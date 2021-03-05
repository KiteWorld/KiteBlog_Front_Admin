<template>
  <div
    class="bar-container box-shadow"
    :style="{ height: height, width: width }"
  ></div>
</template>

<script>
require("echarts/theme/macarons");
// import axios from "axios";
import china from "@/utils/china.json";

export default {
  name: "BarChart",
  props: {
    width: {
      type: String,
      default: "100%",
    },
    height: {
      type: String,
      default: "600px",
    },
  },
  data() {
    return {
      chart: null,
      option: {},
      socketType: "map",
      time: "today",
      dataList: [
        {
          name: "南海诸岛",
          value: 0,
        },
        {
          name: "北京",
          value: 54,
        },
        {
          name: "天津",
          value: 13,
        },
        {
          name: "上海",
          value: 40,
        },
        {
          name: "重庆",
          value: 75,
        },
        {
          name: "河北",
          value: 13,
        },
        {
          name: "河南",
          value: 83,
        },
        {
          name: "云南",
          value: 11,
        },
        {
          name: "辽宁",
          value: 19,
        },
        {
          name: "黑龙江",
          value: 15,
        },
        {
          name: "湖南",
          value: 69,
        },
        {
          name: "安徽",
          value: 60,
        },
        {
          name: "山东",
          value: 39,
        },
        {
          name: "新疆",
          value: 4,
        },
        {
          name: "江苏",
          value: 31,
        },
        {
          name: "浙江",
          value: 104,
        },
        {
          name: "江西",
          value: 36,
        },
        {
          name: "湖北",
          value: 1052,
        },
        {
          name: "广西",
          value: 33,
        },
        {
          name: "甘肃",
          value: 7,
        },
        {
          name: "山西",
          value: 9,
        },
        {
          name: "内蒙古",
          value: 7,
        },
        {
          name: "陕西",
          value: 22,
        },
        {
          name: "吉林",
          value: 4,
        },
        {
          name: "福建",
          value: 18,
        },
        {
          name: "贵州",
          value: 5,
        },
        {
          name: "广东",
          value: 98,
        },
        {
          name: "青海",
          value: 1,
        },
        {
          name: "西藏",
          value: 0,
        },
        {
          name: "四川",
          value: 44,
        },
        {
          name: "宁夏",
          value: 4,
        },
        {
          name: "海南",
          value: 22,
        },
        {
          name: "台湾",
          value: 3,
        },
        {
          name: "香港",
          value: 5,
        },
        {
          name: "澳门",
          value: 5,
        },
      ],
    };
  },
  async created() {
    // this.$ws.registerCallback(this.socketType, this.getData);
    // this.$ws.send({
    //   socketType: this.socketType,
    //   millisecond: 60000 * 10,
    // });
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart();
    });
  },
  methods: {
    initChart() {
      this.chart = this.$echarts.init(this.$el, "macarons");
      this.$echarts.registerMap("china", china);
      this.option = {
		title:{
			text:"用户分布（目前未前端假数据，后端未实现）"
		},
        tooltip: {
          //   triggerOn: "hover",
          textStyle: {
            color: "#fff",
          },
        //   formatter: function (e) {
        //     return 0.5 == e.value
        //       ? e.name + "：有疑似病例"
        //       : e.seriesName + "<br />" + e.name + "：" + e.value;
        //   },
        },
        visualMap: {
          min: 0,
          max: 1000,
          left: 26,
          bottom: 40,
          showLabel: !0,
          text: ["高", "低"],
          pieces: [
            {
              gt: 100,
              label: "> 100 ",
              color: "#3fc9ce",
            },
            {
              gte: 50,
              lte: 100,
              label: "50 - 100 ",
              color: "#6bdee2",
            },
            {
              gte: 20,
              lt: 50,
              label: "20 - 50",
              color: "#94edf0",
            },
            {
              gte: 1,
              lt: 20,
              label: "1 - 20",
              color: "#b8ecee",
            },
            {
              value: 0,
              color: "#e6f3f3",
            },
          ],
          show: !0,
        },
        geo: {
          map: "china",
          roam: !1,
          scaleLimit: {
            min: 1,
            max: 2,
          },
          zoom: 1,
          top: "5%",
          label: {
            normal: {
              show: !0,
              fontSize: "14",
              color: "rgba(0,0,0,0.4)",
            },
          },
          itemStyle: {
            normal: {
              shadowBlur: 50,
              shadowColor: "rgba(0, 0, 0, 0.2)",
              borderColor: "rgba(0, 0, 0, 0.1)",
            },
            emphasis: {
              areaColor: "#ca90f058",
              shadowOffsetX: 0,
              shadowOffsetY: 0,
              borderWidth: 0,
            },
          },
          select: {
            itemStyle: {
              areaColor: "#ca90f058",
            },
          },
        },
        series: [
          {
            name: "人数",
            type: "map",
            geoIndex: 0,
            data: this.dataList,
          },
        ],
      };
      this.chart.setOption(this.option);
      window.addEventListener("resize", () => {
        this.chart.resize();
      });
    },
    getData(data) {
      data;
      this.chart.setOption(this.option);
    },
  },
};
</script>

<style lang="less" scoped>
.bar-container {
  padding: 20px;
  box-sizing: border-box;
  color: #ca90f058;
}
</style>