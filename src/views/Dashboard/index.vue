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

  <!-- <div style="padding: 0 20px; margin-top: 20px">
    Dashboard 开发中... 其他功能都可以正常使用，使用前建议先看<router-link
      to="/document"
      style="text-decoration: none"
      >「项目文档」</router-link
    >
    <div class="view-contianer">
      <h2>项目预览注意事项</h2>
      <p class="view-text">
        目前 Node服务端和后台管理已经部署到本人购买的 VPS
        （搬瓦工19美元/年绝版小鸡），方便大家预览！<br /><br />
        由于服务器是在国外以及配置比较低，速度自然也比较慢（特别是晚上 9 点~
        凌晨 1
        点）。大家在预览的时候不要恶意添加大量数据占用服务器资源以及删除别人的数据。让我们做个文明的中国人，这里附上
        <a
          href="https://www.bilibili.com/video/BV1wx411M7LH?from=search&seid=490646424586704806"
          >极品MV</a
        >，供大家欣赏，哈哈! <br /><br />
        预览地址：<a href="https://kiteblog.cms.kite1874.com/#/adminLogin"
          >KiteBlog</a
        >
        <br /><br />
        注意：服务器每天凌晨 2 点会进行数据还原，删除上传的文件和还原数据库。
      </p>
      <p>如果改项目对你有帮助，麻烦给个帮我在 GitHub 点个 star⭐ ~~! 谢谢</p>
    </div>
  </div> -->
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
    this.$ws.registerCallback(this.socketType, this.getData);
    this.$ws.send({
      socketType: this.socketType,
      millisecond: 3000,
    });
  },
  mounted() {},
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