<template>
  <el-scrollbar style="height: 100%:width:100%">
    <div class="dashboard-container" style="overflow: hidden">
      <el-row :gutter="20" class="total-card-container">
        <el-col :sm="24" :md="8">
          <TotalCard
            :icon="'el-icon-user-solid'"
            :total="totalFormatter(totalData.user_total)"
          />
        </el-col>
        <el-col :sm="24" :md="8">
          <TotalCard
            :icon="'el-icon-document'"
            :total="totalFormatter(totalData.article_total)"
          />
        </el-col>
        <el-col :sm="24" :md="8">
          <TotalCard
            :icon="'el-icon-chat-line-round'"
            :total="totalFormatter(totalData.hotpoint_total)"
          />
        </el-col>
      </el-row>
      <el-row :gutter="20" class="total-card-container">
        <el-col :sm="24" :md="12">
          <LineChart />
        </el-col>
        <el-col :sm="24" :md="12">
          <BarChart />
        </el-col>
      </el-row>
      <el-row :gutter="20" class="total-card-container">
        <el-col :span="24" :offset="0">
          <MapChart />
        </el-col>
      </el-row>

      <el-row :gutter="20" class="total-card-container">
        <el-col :sm="24" :md="12">
          <PieChart
            :socketType="'articleCatTotal'"
            :coustomOption="articlePieChartOption"
          />
        </el-col>
        <el-col :sm="24" :md="12">
          <PieChart
            :socketType="'hotPointCatTotal'"
            :coustomOption="hotPointPieChartOption"
          />
        </el-col>
      </el-row>

      <!-- <div style="background-color: red; height: 20px; width: 100%"></div> -->
    </div>
  </el-scrollbar>
</template>

<script>
import TotalCard from "./components/TotalCard";
import BarChart from "./components/BarChart";
import LineChart from "./components/LineChart";
import PieChart from "./components/PieChart";
import MapChart from "./components/MapChart";
export default {
  name: "Dashboard",
  components: {
    TotalCard,
    BarChart,
    LineChart,
    PieChart,
    MapChart,
  },
  data() {
    return {
      socketType: "total",
      totalData: {},
      articlePieChartOption: {
        title: "文章分类数量占比",
        name: "文章分类数量",
      },
      hotPointPieChartOption: {
        title: "热点分类数量占比",
        name: "热点分类数量",
      },
    };
  },
  created() {
    this.$ws.connect();
    this.$ws.registerCallback(this.socketType, this.getData);
    this.$ws.send({
      socketType: this.socketType,
      millisecond: 3000,
    });
  },
  mounted() {
    const h = this.$createElement;
    const dom = [
      h("p", "操作前请先查看文档以及注意事项"),
      h(
        "a",
        {
          class: "notify-router",
          on: {
            click: () => {
              this.notifyInstance.close();
              this.$router.push({name:"Document"});
            },
          },
        },
        "跳转到「文档页面」"
      ),
    ];
    this.notifyInstance = this.$notify({
      title: "提示",
      duration: 15000,
      type: "warning",
      dangerouslyUseHTMLString: true,
      message: h("div", {}, dom),
    });
  },
  methods: {
    getData(data) {
      this.totalData = data.total;
    },
    totalFormatter(total) {
      if (!total) return "-";
      return total === -1 ? "-" : total.toLocaleString();
    },
  },
};
</script>

<style lang="less" scoped>
.dashboard-container {
  padding-bottom: 10px;
}
.total-card-container {
  padding: 0 20px;
  margin-top: 12px;
  box-sizing: border-box;
}
/deep/.el-scrollbar__wrap {
  // overflow: auto;
  overflow-x: hidden !important;
}
</style>