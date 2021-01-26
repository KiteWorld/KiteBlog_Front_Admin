<template>
  <div>
    <template v-if="item.children && item.children.length === 0">
      <router-link
        :to="pathResolve(item.path)"
        style="text-decoration: none"
        :target="item.meta.target"
        v-if="!item.meta.isExternal"
      >
        <el-menu-item
          :index="pathResolve(item.path)"
          :route="item"
          :key="item.routerId"
        >
          <i :class="item.meta.icon" v-if="item.meta.icon"></i>
          <span slot="title"> {{ item.meta.title }} </span>
        </el-menu-item>
      </router-link>
      <a
        :href="item.path"
        :target="item.meta.target"
        v-else
        style="text-decoration: none"
      >
        <el-menu-item :key="item.routerId">
          <i :class="item.meta.icon" v-if="item.meta.icon"></i>
          <span slot="title"> {{ item.meta.title }} </span>
        </el-menu-item>
      </a>
    </template>
    <template v-else>
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
    pathResolve(routerPath) {
      return path.resolve(this.basePath, routerPath);
    },
  },
};
</script>

<style lang="less" scoped>
</style>