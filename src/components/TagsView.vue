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
        @click="clickTag(item)"
        @close="closeTag(item)"
        style="margin-left: 4px; cursor: pointer"
        >{{ item.meta.title }}</el-tag
      >
    </el-scrollbar>
    <el-button-group class="tag-button">
      <el-button size="mini" @click="closeOthersTags">关闭其他</el-button>
      <el-button size="mini" @click="closeAllTags">关闭全部</el-button>
    </el-button-group>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "TagsView",
  data() {
    return {
      currentView: null,
    };
  },
  computed: {
    ...mapState({
      visitedViews: (state) => state.tagsView.visitedViews,
    }),
  },
  created() {
    this.currentView = this.visitedViews[0] || null;
    this.$store.dispatch("tagsView/addVisitedView", this.$route);
  },
  watch: {
    $route(next) {
      this.$store.dispatch("tagsView/addVisitedView", next);
      this.currentView = next;
    },
  },
  methods: {
    isActive(view) {
      return view.path === this.$route.path;
    },
    clickTag(view) {
      if (this.$route.name === view.name) return;
      this.$router.push({ path: view.path });
    },
    closeTag(view) {
      this.$store.dispatch("tagsView/delVisitedView", view);
      if (
        this.visitedViews[this.visitedViews.length - 1].name ===
        this.$route.name
      ) {
        return;
      }
      this.$router.push({
        path: this.visitedViews[this.visitedViews.length - 1].path,
      });
    },
    closeOthersTags() {
      this.$store.dispatch("tagsView/delOthersView", this.currentView);
    },
    closeAllTags() {
      this.$store.dispatch("tagsView/delAllView");
      console.log(this.currentView);
      if (
        this.visitedViews.length > 0 &&
        this.currentView.path !== this.visitedViews[0].path
      ) {
        this.$router.push({ path: this.visitedViews[0].path });
      }
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  background: rgb(245, 245, 245);
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
  .tag-button {
    flex-shrink: 0;
  }
}
</style>