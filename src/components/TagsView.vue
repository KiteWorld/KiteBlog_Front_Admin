<template>
  <div>
    <div class="tags-container">
      <el-tag
        v-for="item in visitedViews"
        :key="item.path"
        :closable="!item.meta.isAffix"
        size="small"
        :type="isActive(item) ? '' : 'info'"
        @click="clickView(item)"
        @close="closeView(item)"
        style="margin-left: 4px"
        >{{ item.meta.title }}</el-tag
      >
    </div>
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
      this.$router.push({ path: view.path });
    },
    closeView(view) {
      this.$store.dispatch("tagsView/delVisitedView", view);
      this.$router.push({
        path: this.visitedViews[this.visitedViews.length - 1].path,
      });
    },
  },
};
</script>

<style lang="less" scoped>
.tags-container {
  list-style: none;
  padding: 4px 0;
}
</style>