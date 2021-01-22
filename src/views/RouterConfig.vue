<template>
  <div class="router-container">
    <!-- style 需要修改多个css属性时，可以使用对象 -->
    <div
      class="router-tree-container"
      :style="'width:' + treeContainerWdith + 'px'"
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
              <el-tag
                type="info"
                size="small"
                v-if="!data.meta.routerId"
                style="height: 28px; line-height: 28px; margin-right: 2px"
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
          <!-- <el-button @click="addRouter">添加路由</el-button> -->
        </el-button-group>
        <i class="el-icon-question" style="cursor: pointer"></i>
      </div>
      <el-scrollbar class="scroll-container">
        <div class="router-detail-main">
          <el-form
            :model="currentRouterData"
            ref="routerForm"
            label-width="200px"
            :inline="false"
            size="small"
          >
            <el-form-item label="导航名称(title)：">
              <el-input
                v-model="currentRouterData.title"
                placeholder="导航栏菜单显示的名称"
              ></el-input>
            </el-form-item>
            <el-form-item label="路由名称(routerName)：">
              <el-input
                v-model="currentRouterData.name"
                placeholder="请确保名字的唯一性"
              ></el-input>
            </el-form-item>
            <el-form-item label="路由路径(path)：">
              <el-input
                v-model="currentRouterData.path"
                placeholder="不填默认使用「路由名称」,只支持英文字母和数字"
              ></el-input>
            </el-form-item>
            <el-form-item label="组件名称(component)">
              <el-input
                v-model="currentRouterData.component"
                placeholder="「一级菜单」且不是外链时，默认为 Main"
              ></el-input>
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
            <el-form-item label="上级导航：">
              <el-select
                v-model="currentRouterData.meta.parentId"
                placeholder="不选表示添加的是「一级菜单」"
                style="min-width: 400px"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="页面开发角色：">
              <el-checkbox-group
                v-model="currentRouterData.meta.roles"
                size="mini"
              >
                <el-checkbox
                  :label="key"
                  :key="key"
                  border
                  v-for="(value, key) in CMS_USER_ROLE"
                  >{{ value }}</el-checkbox
                >
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="固定页签：">
              <el-radio-group v-model="currentRouterData.meta.isAffix">
                <el-radio :label="true" border>是</el-radio>
                <el-radio :label="false" border>否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="排序：">
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
                <el-tooltip
                  effect="dark"
                  content="点击查看「图标名称」"
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
            <el-form-item label="缓存：">
              <!-- 字段 noCache 为「不缓存」的意思，取反才对  -->
              <el-radio-group v-model="currentRouterData.meta.noCache">
                <el-radio :label="false" border>是</el-radio>
                <el-radio :label="true" border>否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="重定向页面（组件名称）：">
              <el-input v-model="currentRouterData.redirect"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
import { CMS_USER_ROLE } from "../common/eum";
export default {
  name: "RouterConfig",
  data() {
    return {
      filterText: "",
      routerData: [],
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
          roles: [],
          title: null,
          order: 1,
        },
        name: null,
        path: null,
        title: null,
      },
      refreshKey: 0,
      treeContainerWdith: 280,
    };
  },
  computed: {
    routerList() {
      const routerListFormatter = JSON.parse(
        JSON.stringify(this.$store.state.permission.routerList)
      );
      this.formatterRouter(routerListFormatter);
      console.log(routerListFormatter);
      return routerListFormatter;
    },
  },
  watch: {
    filterText(val) {
      this.$refs.routerTree.filter(val);
    },
  },
  created() {
    this.currentRouterDataBackUp = JSON.parse(
      JSON.stringify(this.currentRouterData)
    );
    this.CMS_USER_ROLE = CMS_USER_ROLE;
  },
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
        if (x.children.length > 0) {
          this.formatterRouter(x.children);
        }
      });
    },
    toIconManual() {
      window.open("https://element.eleme.cn/#/zh-CN/component/icon");
    },
    handleScroll(e) {
      const eventDelta = e.wheelDelta || -e.deltaY * 40;
      const $scrollWrapper = this.$refs.scrollContainer.$refs.wrap;
      $scrollWrapper.scrollLeft = $scrollWrapper.scrollLeft + eventDelta / 4;
    },
    dragEndHandler(e) {
      let wdithOffset = parseInt(this.treeContainerWdith) + e.offsetX;
      if (wdithOffset <= 280) {
        this.treeContainerWdith = 280;
      } else if (wdithOffset >= 800) {
        this.treeContainerWdith = 800;
      } else {
        this.treeContainerWdith = wdithOffset;
      }
    },
    saveRouter() {},
    async removeRouter(node, data) {
      if (data.children) {
        if (data.children.length != 0)
          return this.$message.warning("该分类有下级分类，无法删除");
      }
      if (data.categoryId) {
        // let res = await deleteCategory({ categoryId: data.categoryId });
        // if (res.code !== 0) {
        //   return this.$message.warning(res.msg);
        // }
      }
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex((d) => d == data);

      children.splice(index, 1);
      if (children[1].meta.level == 1) {
        this.refreshKey++;
      }
      this.$message.success("删除成功");
    },
    addRouter(data) {
      if (!data.meta.routerId)
        return this.$message.warning("未保存的路由，无法添加子级路由!");
      const routerItem = JSON.parse(
        JSON.stringify(this.currentRouterDataBackUp)
      );
      if (!data.children) data.children = [];
      data.children.push(routerItem);
    },
  },
};
</script>

<style lang="less" scoped>
.router-container {
  display: flex;
  .router-tree-container {
    position: relative;
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    height: 100%;
    width: 280px;
    padding: 10px 10px 0;
    box-shadow: 0 0 10px rgb(226, 226, 226);
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
        }
      }
    }
    .drag {
      display: block;
      position: absolute;
      top: 0;
      right: 0;
      height: 100%;
      width: 2px;
      cursor: move;
    }
  }
  .router-detail {
    flex: 1;
    .router-detail-header {
      display: flex;
      padding: 10px 20px 0px;
      justify-content: space-between;
      align-items: center;
    }
  }

  .scroll-container {
    margin-top: 6px;
    height: 100%;
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

/deep/.el-checkbox,
/deep/ .el-radio {
  margin-right: 0;
}
</style>