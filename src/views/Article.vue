<template>
  <div class="container">
    <el-row :gutter="20">
      <el-col :span="12" :offset="0">
        <el-button-group style="margin-bottom: 5px">
          <el-button plain size="small" @click="auditedAticle()"
            >审核</el-button
          >
          <el-button plain size="small" @click="showRejectDailog()"
            >驳回</el-button
          >
          <el-button plain size="small" @click="deleteArticle()"
            >删除</el-button
          >
          <el-button plain size="small" v-popover:catPopover
            >修改分类</el-button
          >

          <el-button plain size="small" v-popover:recommendPopover
            >推荐设置</el-button
          >
        </el-button-group>
      </el-col>
      <el-col :span="12" :offset="0">
        <SearchInput @onSearch="search()" @onReset="reset()" ref="search">
          <el-input
            slot="main"
            v-model="searchData.title"
            placeholder="文章标题"
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
              v-model="searchData.status"
              placeholder="请选择"
              clearable
              filterable
              style="width: 100%"
              size="small"
            >
              <el-option
                v-for="(value, name) in APPROVE_STATUS"
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
          <div class="search-item" slot="sub">
            <span class="search-label">更新时间：</span>
            <el-date-picker
              type="datetimerange"
              v-model="searchData.updateDate"
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
      ref="articleTable"
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
      ref="catPopover"
      v-model="catPopoverVisible"
      placement="bottom"
      width="200"
      trigger="click"
      @show="showPopoverHandle('catPopoverVisible', 'articleTable')"
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
        @click="updateArticleCat"
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
      @show="showPopoverHandle('recomPopoverVisible', 'articleTable')"
    >
      <ul class="status-container">
        <li
          v-for="(value, key) in ARTICLE_HOTPOINT_TYPE"
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
  deleteArticle,
  auditedAticle,
  rejectArticle,
  updateArticleCat,
  updateArticleType,
  getCategoriesList,
} from "@/api/api";
import { APPROVE_STATUS, ARTICLE_HOTPOINT_TYPE } from "@/common/eum";
import { checkTableSelect, showPopoverHandle } from "@/common/mixin";
export default {
  name: "Article",
  mixins: [checkTableSelect, showPopoverHandle],
  data() {
    return {
      searchData: {
        title: null,
        categoryName: null,
        userName: null,
        createDate: null,
        updateDate: null,
      },
      tableProps: {
        selection: true,
        setting: {
          url: "article/queryArticles",
        },
      },
      columns: [
        {
          prop: "title",
          label: "标题",
          render: (h, { row }) => {
            return h(
              "a",
              {
                style: {
                  color: "#409EFF",
                  cursor: "pointer",
                },
                on: {
                  click: () => {
                    this.$message.success(
                      "跳转到文章详细页面和前端共用(后面开发toC时补上)"
                    );
                  },
                },
              },
              row.title
            );
          },
        },
        { prop: "likeCount", label: "点赞数" },
        { prop: "viewCount", label: "浏览量" },
        {
          prop: "banner",
          label: "封面图",
          render: (h, { row }) => {
            if (row.banner) {
              return h("img", {
                attrs: {
                  class: "banner-img", // less可以使用 /deep/使样式生效
                  src: row.banner,
                },
              });
            }
          },
        },
        {
          prop: "status",
          label: "状态",
          formatter: (row, columns, cellValue) => {
            return APPROVE_STATUS[cellValue];
          },
        },
        {
          prop: "categoryName",
          label: "分类",
        },
        {
          prop: "userName",
          label: "创建人",
        },
        {
          prop: "articleType",
          label: "文章推荐",
          formatter: (row, columns, cellValue) => {
            return ARTICLE_HOTPOINT_TYPE[cellValue];
          },
        },
        { prop: "createDate", label: "创建时间" },
        { prop: "updateDate", label: "更新时间" },
        { prop: "rejectRemark", label: "驳回备注" },
      ],
      set_reject: {
        visible: false,
        data: {
          articleIds: [],
          rejectRemark: null,
        },
      },
      templateList: [],
      catergorySeletion: [],
      categorySeletionItem: null,
      catPopoverVisible: false,
      recomPopoverVisible: false,
      rows: [],
    };
  },
  async created() {
    this.APPROVE_STATUS = APPROVE_STATUS;
    this.ARTICLE_HOTPOINT_TYPE = ARTICLE_HOTPOINT_TYPE;
    this.searchDataBackUp = JSON.parse(JSON.stringify(this.searchData));
    this.catergorySeletion = (await getCategoriesList()).data.dataList;
  },
  methods: {
    search() {
      this.tableProps.setting.params = this.searchData;
      this.$refs.articleTable.searchTableData();
    },
    reset() {
      this.searchData = JSON.parse(JSON.stringify(this.searchDataBackUp));
      this.search();
    },
    async showRejectDailog() {
      let rows = this.checkTableSelect("articleTable", "single");
      if (rows) {
        this.set_reject.visible = true;
        this.set_reject.data.articleIds = rows.map((x) => x.articleId);
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
      let rows = this.checkTableSelect("articleTable");
      if (!rows) return;
      let res = await auditedAticle({
        articleIds: rows.map((x) => x.articleId),
      });
      if (res.code === 0) {
        this.$message.success(res.msg);
        this.search();
      }
    },
    async deleteArticle() {
      let rows = this.checkTableSelect("articleTable");
      if (!rows) return;
      let res = await deleteArticle({
        articleIds: rows.map((x) => x.articleId),
      });
      if (res.code === 0) {
        this.$message.success(res.msg);
        this.search();
      }
    },
    async updateArticleCat() {
      let res = await updateArticleCat({
        articleIds: this.rows.map((x) => x.articleId),
        categoryId: this.categorySeletionItem,
      });
      if (res.code === 0) {
        this.$message.success(res.msg);
        this.catPopoverVisible = false;
        this.search();
      }
    },
    async changeType(articleType) {
      let params = {
        articleType: articleType,
        articleIds: this.rows.map((x) => x.articleId),
      };
      let res = await updateArticleType(params);
      this.$message.success(res.msg);
      if (res.code === 0) {
        this.recomPopoverVisible = false;
        this.search();
      }
    },
    changeTemplate() {},
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