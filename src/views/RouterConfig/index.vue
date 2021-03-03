<template>
  <div class="router-container">
    <!-- style 需要修改多个css属性时，可以使用对象 -->
    <div
      class="router-tree-container"
      :style="'width:' + treeContainerWdith + 'px'"
    >
      <el-button @click="addRootRouter()" style="margin-bottom: 2px"
        >添加1级菜单</el-button
      >
      <el-input placeholder="输入关键字进行过滤" v-model="filterText">
      </el-input>
      <el-scrollbar class="scroll-container">
        <el-tree
          ref="routerTree"
          class="router-tree"
          :data="routerList"
          :props="defaultProps"
          :filter-node-method="filterNode"
          @node-click="handleNodeClick"
          :key="refreshKey"
        >
          <div class="router-node" slot-scope="{ node, data }">
            <span class="router-title">{{ data.title || "未命名" }}</span>
            <div class="button-container" @click.stop="">
              <span
                class="router-order"
                title="值为导航排列顺序，值越小越靠前"
                >{{ data.meta.order }}</span
              >
              <el-tag
                type="info"
                size="small"
                v-if="!data.meta.routerId"
                class="router-onsave-tag"
                >未保存</el-tag
              >
              <el-button-group>
                <el-button
                  size="mini"
                  icon="el-icon-circle-plus-outline"
                  @click="() => addRouter(data)"
                  v-if="!data.isEdit"
                >
                </el-button>
                <el-button
                  size="mini"
                  icon="el-icon-delete"
                  @click="() => removeRouter(node, data)"
                >
                </el-button>
              </el-button-group>
            </div>
          </div>
        </el-tree>
      </el-scrollbar>
      <div class="drag" @dragend="dragEndHandler" :draggable="true"></div>
    </div>
    <div class="router-detail" v-if="this.sourceRouterData">
      <div class="router-detail-header">
        <el-button-group>
          <el-button @click="saveRouter">保存修改</el-button>
        </el-button-group>
        <i class="el-icon-question" style="cursor: pointer"></i>
      </div>
      <el-scrollbar class="scroll-container">
        <div class="router-detail-main">
          <el-form
            :model="currentRouterData"
            ref="routerForm"
            label-width="200px"
            :rules="rules"
            :inline="false"
            size="small"
          >
            <el-form-item label="是否为外链：" prop="meta.isExternal">
              <!-- 字段 noCache 为「不缓存」的意思，取反才对  -->
              <el-radio-group v-model="currentRouterData.meta.isExternal">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="导航名称(title)：" prop="meta.title">
              <el-input
                v-model="currentRouterData.meta.title"
                placeholder="导航栏菜单显示的名称"
              ></el-input>
            </el-form-item>
            <!-- 考虑到表单检验方便，加上嵌套的 DOM 节点不多,对性能影响不大， 所以用v-if  -->
            <el-form-item
              label="路由名称(routerName)："
              prop="name"
              v-show="!currentRouterData.meta.isExternal"
            >
              <el-input
                v-model="currentRouterData.name"
                placeholder="请确保名字的唯一性，只支持英文字母和数字"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="路由路径(path)："
              v-show="!currentRouterData.meta.isExternal"
              prop="path"
            >
              <el-input
                v-model="currentRouterData.path"
                placeholder="不填默认使用「路由名称」,只支持英文字母和数字"
              >
                <template slot="prepend">{{
                  parentPath(currentRouterData)
                }}</template>
              </el-input>
            </el-form-item>
            <el-form-item
              label="外链路径(path)："
              prop="path"
              v-show="currentRouterData.meta.isExternal"
            >
              <el-input
                v-model="currentRouterData.path"
                placeholder="外链即不属于本站的路由地址。例如：https://kite1874.com"
              >
              </el-input>
            </el-form-item>
            <el-form-item
              label="组件名称(component)"
              prop="component"
              v-show="!currentRouterData.meta.isExternal"
            >
              <el-input
                v-model="currentRouterData.component"
                placeholder="如果存在下级路由，主键必须为 Main ，否则无法添加下级路由"
                :disabled="
                  currentRouterData.children &&
                  currentRouterData.children.length > 0
                "
              >
                <template slot="append">.vue</template>
              </el-input>
            </el-form-item>
            <!-- <el-form-item label="导航级别(routerLevel)：">
              <el-input-number
                v-model="currentRouterData.meta.order"
                :min="1"
                :max="10000"
              ></el-input-number>
              <span class="form-item-tips">
                1 对应导航栏菜单的一级菜单，2级则表示级二级菜单,
              </span>
            </el-form-item> -->
            <el-form-item label="上级导航：" prop="meta.parentId">
              <el-select
                v-model="currentRouterData.meta.parentId"
                placeholder="不选表示添加的是「一级菜单」"
                style="min-width: 400px"
                disabled
              >
                <el-option-group
                  v-for="group in routerOptions"
                  :key="group.label"
                  :label="group.label"
                >
                  <el-option
                    v-for="item in group.options"
                    :key="item.routerId"
                    :label="item.title"
                    :value="item.routerId"
                  >
                  </el-option>
                </el-option-group>
              </el-select>
            </el-form-item>
            <el-form-item label="页面开发角色：" prop="meta.roles">
              <el-checkbox-group
                v-model="currentRouterData.meta.roles"
                size="mini"
              >
                <el-checkbox
                  :label="key"
                  :key="key"
                  border
                  :disabled="key === 'superadmin'"
                  v-for="(value, key) in CMS_USER_ROLE"
                  >{{ value }}</el-checkbox
                >
              </el-checkbox-group>
            </el-form-item>
            <el-form-item
              label="固定页签："
              prop="meta.isAffix"
              v-show="!currentRouterData.meta.isExternal"
            >
              <el-radio-group v-model="currentRouterData.meta.isAffix">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              label="缓存："
              prop="meta.noCache"
              v-show="!currentRouterData.meta.isExternal"
            >
              <!-- 字段 noCache 为「不缓存」的意思，取反才对  -->
              <el-radio-group v-model="currentRouterData.meta.noCache">
                <el-radio :label="false">是</el-radio>
                <el-radio :label="true">否</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="页面打开方式：" prop="meta.target">
              <el-radio-group v-model="currentRouterData.meta.target">
                <el-radio label="_self">在原本的页面中打开（_self）</el-radio>
                <el-radio label="_blank">在新页面中打开（_blank）</el-radio>
                <el-radio label="_top">在新窗口中打开（_top）</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="排序：" prop="meta.order">
              <el-input-number
                v-model="currentRouterData.meta.order"
                :min="1"
                :max="10000"
              ></el-input-number>
              <span class="form-item-tips">
                值越小导航菜单显示的位置越靠前
              </span>
            </el-form-item>
            <el-form-item label="图标：">
              <el-input v-model="currentRouterData.meta.icon">
                <i slot="prefix" :class="currentRouterData.meta.icon"></i>
                <el-tooltip
                  effect="dark"
                  content="点击查看「图标名称对照表」"
                  placement="top-start"
                  slot="suffix"
                >
                  <i
                    class="el-icon-question"
                    style="cursor: pointer"
                    @click="toIconManual"
                  ></i>
                </el-tooltip>
              </el-input>
            </el-form-item>

            <el-form-item label="重定向页面(路由路径)：">
              <el-input v-model="currentRouterData.redirect"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
import { deleteRouter, saveRouter } from "@/api/api";
import { CMS_USER_ROLE } from "@/common/eum";
import {
  change,
  isNoEmpty,
  isNumLetter,
  externalLink,
  arrChange,
} from "@/common/rules";
export default {
  name: "RouterConfig",
  data() {
    return {
      filterText: "",
      routerData: [],
      routerList: [],
      defaultProps: {
        children: "children",
        label: "title",
      },
      sourceRouterData: null,
      currentRouterData: {
        children: null,
        component: null,
        meta: {
          icon: null,
          isAffix: false,
          level: null,
          noCache: true,
          roles: ["superadmin"],
          title: null,
          isExternal: false,
          order: 1,
          parentId: 0,
          target: "_self",
        },
        name: null,
        path: null,
        title: null,
      },
      rules: {},
      refreshKey: 0,
      treeContainerWdith: 320,
    };
  },
  computed: {
    routerOptions() {
      const routerOptionsObj = {};
      const routerOptions = [];
      this.formatterRouterOptions(this.routerList, routerOptionsObj);
      for (const key in routerOptionsObj) {
        if (Object.hasOwnProperty.call(routerOptionsObj, key)) {
          routerOptions.push({
            label: key,
            options: routerOptionsObj[key],
          });
        }
      }
      routerOptions.unshift({
        label: "无(表示当前添加的路由为1级导航菜单)",
        options: [{ title: "无", routerId: 0 }],
      });
      return routerOptions;
    },
  },
  watch: {
    filterText(val) {
      this.$refs.routerTree.filter(val);
    },
    "currentRouterData.meta.isExternal"(val) {
      if (val) {
        this.rules.path = externalLink;
        this.rules.name = [];
        this.rules.component = [];
        this.rules["meta.isAffix"] = [];
        this.rules["meta.noCache"] = [];
      } else {
        this.rules.path = isNumLetter("请填写路由路径");
        this.rules.name = isNumLetter("请填写路由名称");
        this.rules.component = isNumLetter("请填写组件名称");
        this.rules["meta.isAffix"] = change("请选择是否固定页签");
        this.rules["meta.noCache"] = change("请选择是否缓存");
      }
    },
  },
  created() {
    this.routerList = JSON.parse(
      JSON.stringify(this.$store.state.permission.routerList)
    );
    this.formatterRouter(this.routerList);
    this.currentRouterDataBackUp = JSON.parse(
      JSON.stringify(this.currentRouterData)
    );
    this.CMS_USER_ROLE = CMS_USER_ROLE;
    this.rules = {
      "meta.isExternal": change("请选择是否为外链"),
      "meta.isAffix": change("请选择是否固定页签"),
      "meta.noCache": change("请选择是否缓存"),
      "meta.target": change("请选择打开方式"),
      "meta.parentId": change("请选择上级导航"),
      "meta.title": isNoEmpty("请填写导航名称"),
      "meta.roles": arrChange("请选择至少一个角色"),
      "meta.order": isNoEmpty("请填写排序值"),
      name: isNumLetter("请填写路由名称"),
      path: isNumLetter("请填写路由路径"),
      component: isNumLetter("请填写组件名称"),
    };
  },
  // mounted() {
  //   window.addEventListener("beforeunload", (e) => this.beforeunloadHandler(e));
  // },
  // destroyed() {
  //   window.removeEventListener("beforeunload", (e) =>
  //     this.beforeunloadHandler(e)
  //   );
  // },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.title.indexOf(value) !== -1;
    },
    handleNodeClick(data) {
      if (this.sourceRouterData === data) return;
      this.sourceRouterData = data;
      this.currentRouterData = JSON.parse(JSON.stringify(data));
    },
    formatterRouter(arr) {
      arr.forEach((x) => {
        x.title = x.meta.title;
        if (x.children && x.children.length > 0) {
          this.formatterRouter(x.children);
        }
      });
    },
    formatterRouterOptions(routerList, routerOptionsObj) {
      routerList.forEach((x) => {
        const propName = x.meta.level + "级导航";
        if (!routerOptionsObj[propName]) {
          routerOptionsObj[propName] = [];
        }
        routerOptionsObj[propName].push({
          title: x.title,
          routerId: x.meta.routerId,
        });
        if (x.children && x.children.length > 0) {
          this.formatterRouterOptions(x.children, routerOptionsObj);
        }
      });
    },
    toIconManual() {
      window.open("https://element.eleme.cn/#/zh-CN/component/icon");
    },
    //拖动结束事件
    dragEndHandler(e) {
      let wdithOffset = parseInt(this.treeContainerWdith) + e.offsetX;
      if (wdithOffset <= 320) {
        this.treeContainerWdith = 320;
      } else if (wdithOffset >= 800) {
        this.treeContainerWdith = 800;
      } else {
        this.treeContainerWdith = wdithOffset;
      }
    },
    saveRouter() {
      this.$refs.routerForm.validate(async (valid) => {
        if (valid) {
          const data = this.currentRouterData;
          if (data.meta.isExternal) {
            data.name = null;
            data.component = "Main";
            data.meta.noCache = true;
            data.meta.isAffix = false;
          }
          let res = await saveRouter(data);
          if (res.code !== 0) {
            return this.$message.warning(res.msg);
          }
          if (!data.meta.routerId) {
            data.meta.routerId = res.data.routerId;
          }
          data.title = data.meta.title;
          this.sourceRouterData = Object.assign(this.sourceRouterData, data);
          this.$message.success(
            res.msg + ",刷新页面查看最新导航栏。刷新后未保存的路由将丢失!"
          );
        } else {
          return false;
        }
      });
    },

    addRootRouter() {
      const routerItem = JSON.parse(
        JSON.stringify(this.currentRouterDataBackUp)
      );
      routerItem.component = "Main";
      routerItem.meta.level = 1;
      routerItem.meta.index = [this.routerList.length - 1];
      this.routerList.push(routerItem);
    },
    addRouter(data) {
      if (data.component !== "Main") {
        return this.$message.warning(
          "只有路由组件为「Main.vue」的时候才能下级路由"
        );
      }
      if (!data.meta.routerId)
        return this.$message.warning("未保存的路由，无法添加子级路由!");
      const routerItem = JSON.parse(
        JSON.stringify(this.currentRouterDataBackUp)
      );
      routerItem.meta.level = data.meta.level + 1;
      routerItem.meta.index = [...data.meta.index, data.children.length];
      routerItem.meta.parentId = data.meta.routerId;
      if (!data.children) data.children = [];
      data.children.push(routerItem);
    },
    async removeRouter(node, data) {
      if (node.isCurrent) {
        this.sourceRouterData = null;
        this.currentRouterData = null;
      }
      if (data.children && data.children.length != 0)
        return this.$message.warning("该分类有下级分类，无法删除");

      if (data.meta.routerId) {
        let res = await deleteRouter({ routerId: data.meta.routerId });
        if (res.code !== 0) {
          return this.$message.warning(res.msg);
        }
      }
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex((d) => d == data);
      children.splice(index, 1);
      this.$message.success("删除成功");
    },
    parentPath(item) {
      let path = "/";
      if (item.meta.level === 1) {
        return path;
      } else {
        let parent = this.routerList;
        item.meta.index.forEach((x, index) => {
          if (index == item.meta.index.length - 1) return;
          if (index === 0) {
            parent = parent[x];
          } else {
            parent = parent.children[x];
          }
          path += parent.path + "/";
        });
      }
      return path;
    },
    changeIsExternal(label) {
      if (label) {
        this.rules.path = externalLink;
      } else {
        this.rules.path = isNumLetter("请填写路由路径");
      }
    },
    beforeunloadHandler(e) {
      e.prevetDefault();
      e = e || window.event;
      if (e) {
        e.returnValue = "关闭提示";
      }
      return "关闭提示";
    },
    // recursion(arr, doSome) {
    //   arr.forEach((x) => {
    //     if (x.children && x.children.length > 0) {
    //       this.recursion(x.children, doSome);
    //     }
    //   });
    // },
  },
};
</script>

<style lang="less" scoped>
.router-container {
  display: flex;
  overflow: hidden;
  .router-tree-container {
    position: relative;
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    width: 320px;
    padding: 10px 10px 0;
    box-shadow: 0 0 10px rgb(226, 226, 226);
    box-sizing: border-box;
    .search-router {
      flex-shrink: 0;
    }
    .router-tree {
      width: 100%;
      /deep/.el-tree-node__content {
        height: 50px;
      }
      .router-node {
        width: 100%;
        height: 50px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-right: 10px;
        .router-title {
          font-size: 14px;
        }
        .button-container {
          display: flex;
          align-items: center;
          .router-order {
            border: 1px solid #eee;
            border-radius: 3px;
            font-size: 14px;
            padding: 5px;
            margin-right: 2px;
          }
          .router-onsave-tag {
            height: 28px;
            line-height: 28px;
            margin-right: 2px;
          }
        }
      }
    }
    .drag {
      display: block;
      position: absolute;
      top: 0;
      right: 0;
      height: 100%;
      width: 4px;
      cursor: move;
    }
  }
  .router-detail {
    flex: 1;
    display: flex;
    flex-direction: column;
    .router-detail-header {
      flex-shrink: 0;
      display: flex;
      padding: 10px 20px 0px;
      justify-content: space-between;
      align-items: center;
    }
  }

  .scroll-container {
    padding: 0;
    margin: 0;
    margin-top: 6px;
    flex: 1;
    /deep/.el-scrollbar__wrap {
      overflow-x: hidden !important;
    }
    .router-detail-main {
      padding: 10px 20px;
    }
  }
  .form-item-tips {
    color: #999;
    font-size: 12px;
    margin-left: 20px;
  }
}
</style>