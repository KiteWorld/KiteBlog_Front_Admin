<template>
  <div>
    <template v-if="item.children.length === 0">
      <router-link :to="pathResolve(item.path)" tag="span">
        <el-menu-item
          :index="pathResolve(item.path)"
          :route="item"
          :key="item.routerId"
        >
          <i :class="item.meta.icon" v-if="item.meta.icon"></i>
          <span slot="title"> {{ item.meta.title }} </span>
        </el-menu-item>
      </router-link>
    </template>
    <template v-if="item.children.length !== 0">
      <el-submenu :index="item.path" :key="item.routerId">
        <template slot="title">
          <i :class="item.meta.icon" v-if="item.meta.icon"></i>
          <span>{{ item.meta.title }}</span>
        </template>
        <sidemenu-item
          :item="child"
          v-for="child in item.children"
          :key="child.routerId"
          :basePath="item.path"
        ></sidemenu-item>
      </el-submenu>
    </template>
  </div>
</template>

<script>
import path from "path";
export default {
  name: "SidemenuItem",
  props: {
    item: {
      type: Object,
      required: true,
    },
    basePath: {
      type: String,
      default: "",
    },
  },
  data() {
    return {};
  },
  created() {},
  methods: {
    pathResolve(routePath) {
      return path.resolve(this.basePath, routePath);
    },
  },
};
</script>

<style lang="less" scoped>
</style>