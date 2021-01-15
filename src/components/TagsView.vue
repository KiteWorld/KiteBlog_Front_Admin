<template>
  <div class="tags-container">
    <el-scrollbar
      ref="scrollContainer"
      :vertical="false"
      class="scroll-container"
      @wheel.native.prevent="handleScroll"
    >
      <el-tag
        v-for="item in visitedViews"
        :key="item.path"
        :closable="!item.meta.isAffix"
        size="small"
        :type="isActive(item) ? '' : 'info'"
        @click="clickView(item)"
        @close="closeView(item)"
        style="margin-left: 4px; cursor: pointer"
        >{{ item.meta.title }}</el-tag
      >
    </el-scrollbar>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "TagsView",
  data() {
    return {};
  },
  computed: {
    ...mapState({
      visitedViews: (state) => state.tagsView.visitedViews,
    }),
  },
  created() {
    this.$store.dispatch("tagsView/addVisitedView", this.$route);
  },
  watch: {
    $route(next) {
      this.$store.dispatch("tagsView/addVisitedView", next);
    },
  },
  methods: {
    isActive(view) {
      return view.path === this.$route.path;
    },
    clickView(view) {
      if (this.$route.name === view.name) return;
      this.$router.push({ path: view.path });
    },
    closeView(view) {
      this.$store.dispatch("tagsView/delVisitedView", view);
      if (
        this.visitedViews[this.visitedViews.length - 1].name ===
        this.$route.name
      )
        return;
      this.$router.push({
        path: this.visitedViews[this.visitedViews.length - 1].path,
      });
    },
    handleScroll(e) {
      const eventDelta = e.wheelDelta || -e.deltaY * 40;
      const $scrollWrapper = this.$refs.scrollContainer.$refs.wrap;
      $scrollWrapper.scrollLeft = $scrollWrapper.scrollLeft + eventDelta / 4;
    },
  },
};
</script>

<style lang="less" scoped>
.tags-container {
  width: 100%;
  background: rgb(245, 245, 245);
}
.scroll-container {
  white-space: nowrap;
  // position: relative;
  overflow: hidden;
  width: 100%;
  /deep/.el-scrollbar__bar {
    bottom: 0;
  }
  /deep/.el-scrollbar__wrap {
    height: 50px;
  }
  /deep/ .el-scrollbar__view {
    height: 100%;
    display: flex;
    align-items: center;
    padding: 0 4px;
  }
}
</style>