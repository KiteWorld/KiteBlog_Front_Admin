<template>
  <div class="container">
    <el-row :gutter="20">
      <el-col :span="12" :offset="0">
        <el-button-group style="margin-bottom: 5px">
          <el-button plain size="small" @click="search()">刷新</el-button>
          <el-button plain size="small" @click="deleteHotPoint()"
            >删除（数据库中移除）</el-button
          >
          <el-button plain size="small" v-popover:statusPopover
            >修改状态</el-button
          >
          <el-button plain size="small" v-popover:catPopover
            >修改分类</el-button
          >
          <el-button plain size="small" v-popover:recommendPopover
            >推荐设置</el-button
          >
          <el-button plain size="small" @click="addHotPoint"
            >新增沸点</el-button
          >
        </el-button-group>
      </el-col>
      <el-col :span="12" :offset="0">
        <SearchInput @onSearch="search()" @onReset="reset()" ref="search">
          <el-input
            slot="main"
            v-model="searchData.hotPointContent"
            placeholder="沸点内容"
            size="small"
            clearable
          ></el-input>
          <div class="search-item" slot="sub">
            <span class="search-label">分类：</span>
            <el-select
              v-model="searchData.categoryId"
              placeholder="请选择"
              clearable
              filterable
              size="small"
              style="width: 100%"
            >
              <el-option
                v-for="item in catergorySeletion"
                :key="item.categoryId"
                :label="item.categoryName"
                :value="item.categoryId"
              >
              </el-option>
            </el-select>
          </div>
          <div class="search-item" slot="sub">
            <span class="search-label">创建人：</span>
            <el-input
              v-model="searchData.userName"
              placeholder="请输入"
              size="small"
              clearable
            ></el-input>
          </div>
          <div class="search-item" slot="sub">
            <span class="search-label">状态：</span>
            <el-select
              v-model="searchData.hotPointStatus"
              placeholder="请选择"
              clearable
              filterable
              style="width: 100%"
              size="small"
            >
              <el-option
                v-for="(value, name) in HOTPOINT_STATUS"
                :key="name"
                :value="name"
                :label="value"
              >
                {{ value }}
              </el-option>
            </el-select>
          </div>
          <div class="search-item" slot="sub">
            <span class="search-label">创建时间：</span>
            <el-date-picker
              type="datetimerange"
              v-model="searchData.createDate"
              size="small"
              style="width: 100%"
              value-format="yyyy-MM-dd HH:mm:ss"
            >
            </el-date-picker>
          </div>
        </SearchInput>
      </el-col>
    </el-row>
    <Table
      ref="HotPointTable"
      :tableProps="tableProps"
      :columns="columns"
    ></Table>
    <el-dialog
      title="填写驳回信息"
      :visible.sync="set_reject.visible"
      width="40%"
      :before-close="rejectClose"
    >
      <div class="reject-template">
        <el-select
          v-model="set_reject.data.rejectRemark"
          placeholder="选择模板"
          clearable
          filterable
          @change="changeTemplate"
          size="small"
          style="width: 100%"
        >
          <el-option
            v-for="(item, index) in templateList"
            :key="index"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <el-button size="small">使用模板</el-button>
      </div>
      <el-input
        type="textarea"
        placeholder="请输入内容"
        v-model="set_reject.data.rejectRemark"
        maxlength="200"
        :autosize="{ minRows: 2, maxRows: 8 }"
        show-word-limit
      >
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button-group>
          <el-button @click="rejectClose">取 消</el-button>
          <el-button type="primary" @click="rejectOk">确 定</el-button>
        </el-button-group>
      </span>
    </el-dialog>
    <el-popover
      ref="statusPopover"
      v-model="statusPopoverVisible"
      placement="bottom"
      width="200"
      trigger="click"
      @show="showPopoverHandle('statusPopoverVisible', 'HotPointTable')"
    >
      <ul class="status-container">
        <li
          v-for="(value, key) in HOTPOINT_STATUS"
          :key="key"
          class="status-item click-item"
          @click="changeStatus(key)"
        >
          {{ value }}
        </li>
      </ul>
    </el-popover>
    <el-popover
      ref="catPopover"
      v-model="catPopoverVisible"
      placement="bottom"
      width="200"
      trigger="click"
      @show="showPopoverHandle('catPopoverVisible', 'HotPointTable')"
    >
      <el-select
        v-model="categorySeletionItem"
        placeholder="选择分类"
        clearable
        filterable
        size="small"
        style="margin: 10px"
      >
        <el-option
          v-for="item in catergorySeletion"
          :key="item.categoryId"
          :label="item.categoryName"
          :value="item.categoryId"
        >
        </el-option>
      </el-select>
      <el-button
        size="small"
        @click="updateHotPointCat"
        style="width: calc(100% + 4px); border-bottom: none"
        >保存修改</el-button
      >
    </el-popover>
    <el-popover
      ref="recommendPopover"
      v-model="recomPopoverVisible"
      placement="bottom"
      width="150"
      trigger="click"
      @show="showPopoverHandle('recomPopoverVisible', 'HotPointTable')"
    >
      <ul class="status-container">
        <li
          v-for="(value, key) in ARTICLE_RECOMMEND_TYPE"
          :key="key"
          class="status-item click-item"
          @click="changeType(key)"
        >
          {{ value }}
        </li>
      </ul>
    </el-popover>
  </div>
</template>
<script>
import {
  deleteHotPoint,
  updateHotPointCat,
  auditedAticle,
  rejectArticle,
  getCategoriesList,
  updateHotPointType,
  updateHotPointStatus,
} from "@/api/api";
import { HOTPOINT_STATUS, ARTICLE_RECOMMEND_TYPE } from "@/common/eum";
import { checkTableSelect, showPopoverHandle, toEdit } from "@/common/mixin";
export default {
  name: "HotPoint",
  mixins: [checkTableSelect, showPopoverHandle, toEdit],
  data() {
    return {
      searchData: {
        hotPointContent: null,
        categoryId: null,
        hotPointStatus: null,
        userName: null,
        createDate: null,
      },
      tableProps: {
        showNum: true,
        selection: true,
        setting: {
          url: "hotPoint/queryHotPoint",
        },
      },
      columns: [
        {
          prop: "hotPointId",
          label: "沸点",
          "show-overflow-tooltip": true,
          render: (h, { row }) => {
            return h(
              "a",
              {
                // domProps: {
                //   innerHTML: row.hotPointContent,
                // },
                style: {
                  color: "#409EFF",
                  cursor: "pointer",
                },
                on: {
                  click: () => {
                    this.toEdit(row.userId, row.hotPointId, "hotpoint", "沸点");
                  },
                },
              },
              row.hotPointContent
            );
          },
        },
        {
          prop: "hotPointPictrues",
          label: "沸点图片",
          render: (h, { row }) => {
            if (row.hotPointPictrues) {
              let url = row.hotPointPictrues[0];
              return h("el-image", {
                attrs: {
                  src: url,
                  "preview-src-list": row.hotPointPictrues,
                },
              });
            } else {
              return h("span", row.hotPointPictrues);
            }
          },
        },
        {
          prop: "userName",
          label: "创建人",
        },
        {
          prop: "categoryName",
          label: "分类",
        },
        {
          prop: "hotPointStatus",
          label: "状态",
          formatter: (row, columns, cellValue) => {
            return HOTPOINT_STATUS[cellValue];
          },
        },
        { prop: "likeCount", label: "点赞数" },
        {
          prop: "hotPointType",
          label: "沸点推荐",
          formatter: (row, columns, cellValue) => {
            return ARTICLE_RECOMMEND_TYPE[cellValue];
          },
        },
        { prop: "createDate", label: "创建时间" },
        { prop: "rejectRemark", label: "驳回备注" },
      ],
      set_reject: {
        visible: false,
        data: {
          hotPointIds: [],
          rejectRemark: null,
        },
      },
      templateList: [],
      catergorySeletion: [],
      categorySeletionItem: null,
      catPopoverVisible: false,
      recomPopoverVisible: false,
      statusPopoverVisible: false,
      rows: [],
    };
  },
  created() {
    console.log("hotpoint");
    this.getCategoriesList();
    this.HOTPOINT_STATUS = HOTPOINT_STATUS;
    this.ARTICLE_RECOMMEND_TYPE = ARTICLE_RECOMMEND_TYPE;
    this.searchDataBackUp = JSON.parse(JSON.stringify(this.searchData));
  },
  methods: {
    search() {
      this.tableProps.setting.params = this.searchData;
      this.$refs.HotPointTable.searchTableData();
    },
    reset() {
      this.searchData = JSON.parse(JSON.stringify(this.searchDataBackUp));
      this.search();
    },
    async showRejectDailog() {
      let rows = this.checkTableSelect("HotPointTable", "single");
      if (rows) {
        this.set_reject.visible = true;
        this.set_reject.data.hotPointIds = rows.map((x) => x.hotPointId);
      }
    },
    async rejectOk() {
      if (!this.set_reject.data.rejectRemark) {
        return this.$message.warning("驳回备注不能为空");
      }
      let res = await rejectArticle(this.set_reject.data);
      if (res.code === 0) {
        this.$message.success(res.msg);
        this.set_reject.visible = false;
        this.search();
      }
    },
    rejectClose() {
      this.set_reject.visible = false;
      this.set_reject.data.rejectRemark = null;
    },
    async auditedAticle() {
      let rows = this.checkTableSelect("HotPointTable");
      if (!rows) return;
      let res = await auditedAticle({
        hotPointIds: rows.map((x) => x.hotPointId),
      });
      if (res.code === 0) {
        this.$message.success(res.msg);
        this.search();
      }
    },
    async deleteHotPoint() {
      let rows = this.checkTableSelect("HotPointTable");
      if (!rows) return;
      let res = await deleteHotPoint({
        hotPointIds: rows.map((x) => x.hotPointId),
      });
      if (res.code !== 0) {
        return this.$message.warning(res.msg);
      }
      this.search();
      this.$message.success(res.msg);
    },
    async updateHotPointCat() {
      let res = await updateHotPointCat({
        hotPointIds: this.rows.map((x) => x.hotPointId),
        categoryId: this.categorySeletionItem,
      });
      if (res.code !== 0) {
        return this.$message.warning(res.msg);
      }
      this.search();
      this.$message.success(res.msg);
      this.catPopoverVisible = false;
    },
    async changeType(hotPointType) {
      let params = {
        hotPointType: hotPointType,
        hotPointIds: this.rows.map((x) => x.hotPointId),
      };
      let res = await updateHotPointType(params);
      if (res.code !== 0) {
        return this.$message.warning(res.msg);
      }
      this.search();
      this.$message.success(res.msg);
      this.recomPopoverVisible = false;
    },
    async changeStatus(hotPointStatus) {
      let params = {
        hotPointStatus: hotPointStatus,
        hotPointIds: this.rows.map((x) => x.hotPointId),
      };
      let res = await updateHotPointStatus(params);
      if (res.code !== 0) {
        return this.$message.warning(res.msg);
      }
      this.search();
      this.$message.success(res.msg);
      this.statusPopoverVisible = false;
    },
    changeTemplate() {},
    async getCategoriesList() {
      let res = await getCategoriesList({ categoryType: "hotpoint" });
      this.catergorySeletion = res.data.dataList;
    },
    addHotPoint() {
      this.$router.push({ name: "Editor", query: { type: "hotpoint" } });
    },
  },
};
</script>

<style lang="less" scoped>
.container {
  padding: 8px;
  /deep/.banner-img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }
  .reject-template {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 2px;
  }
}
</style>