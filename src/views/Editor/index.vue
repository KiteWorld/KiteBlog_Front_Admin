<template>
  <div class="editor-container" @click="routerPopoverVisible = false">
    <div class="editor-header">
      <el-radio-group v-model="type" @change="changeContent">
        <el-radio label="article" :disabled="id && type != 'article'"
          >文章</el-radio
        >
        <el-radio label="hotpoint" :disabled="id && type != 'hotpoint'"
          >沸点</el-radio
        >
        <el-radio label="template" :disabled="id && type != 'template'"
          >官方模板</el-radio
        >
      </el-radio-group>
      <el-select
        v-model="categoryId"
        placeholder="选择分类"
        style="margin-left: 20px"
      >
        <el-option
          v-for="item in categorySeletion"
          :key="item.categoryId"
          :label="item.categoryName"
          :value="item.categoryId"
        >
        </el-option>
      </el-select>
      <el-select
        v-model="recommendType"
        placeholder="选择推荐分类"
        style="margin-left: 5px"
        v-show="type !== 'template'"
      >
        <el-option
          v-for="(value, key) in ARTICLE_RECOMMEND_TYPE"
          :key="key"
          :label="value"
          :value="key"
          style="text-align: center"
        >
        </el-option>
      </el-select>
      <el-button-group>
        <el-button
          type="primary"
          style="margin-left: 4px"
          :plain="false"
          @click="saveContent"
          v-popover:routerPopover
          >{{ saveBtnText }}</el-button
        >
        <el-button @click="clearEditor">新建</el-button>
      </el-button-group>
    </div>
    <div class="editor-main">
      <el-input
        v-model="article.title"
        placeholder="标题"
        size="normal"
        style="margin-bottom: 2px"
        v-show="type == 'article'"
      ></el-input>
      <el-input
        v-model="template.title"
        placeholder="标题"
        size="normal"
        style="margin-bottom: 2px"
        v-show="type == 'template'"
      ></el-input>
      <!-- VueSimplemde编辑器 图标默认使用Font Awesome, CDN 地址用的是 Font Awesome 官方提供的地址，国内无法访问，
      可以在 node_modules 里搜索 simplemde.js 并修改下方的 CDN 地址，图标就可以正常显示了。  
      https://cdn.bootcdn.net/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css -->
      <div class="editor-container">
        <vue-simplemde
          v-model="article.markdown"
          ref="articleEditor"
          :configs="configs"
          :highlight="true"
          v-show="type == 'article'"
          :key="refreshKey1"
        />
        <el-input
          v-model="hotPoint.hotPointContent"
          type="textarea"
          :rows="12"
          :maxlength="300"
          show-word-limit
          v-show="type == 'hotpoint'"
        ></el-input>
        <vue-simplemde
          v-model="template.markdown"
          ref="templateEditor"
          :configs="configs"
          :highlight="true"
          v-show="type == 'template'"
          :key="refreshKey2"
        />
      </div>
    </div>
    <el-popover
      ref="routerPopover"
      placement="bottom"
      width="230"
      trigger="manual"
      :value="routerPopoverVisible"
    >
      <!-- trigger="manual" 设置为手动控制显示/隐藏 -->
      <p style="padding: 0 10px; text-align: center">
        是否跳转到「{{ typeText }}列表」页面
      </p>
      <el-button
        size="default"
        @click="OkRouter"
        style="width: 103%; margin-top: 1px"
        >确认</el-button
      >
    </el-popover>
  </div>
</template>

<script>
import "codemirror/lib/codemirror.css";
import VueSimplemde from "vue-simplemde";
import "simplemde-theme-base/dist/simplemde-theme-base.min.css";
import {
  getCategoriesList,
  queryArticleById,
  queryHotPointById,
  saveHotPoint,
  saveArticle,
} from "@/api/api";
import { ARTICLE_RECOMMEND_TYPE } from "@/common/eum";
import Cookies from "js-cookie";
export default {
  name: "Editor",
  components: {
    VueSimplemde,
  },
  data() {
    return {
      categorySeletion: [],
      article: {
        title: null,
        content: null,
        markdown: null,
        categoryId: null,
        userId: null,
        type: null,
        status: "pending",
        articleId: null,
      },
      hotPoint: {
        hotPointContent: null,
        hotPointType: null,
        hotPointStatus: null,
        categoryId: null,
        userId: null,
        hotPointId: null,
      },
      template: {
        title: null,
        content: null,
        markdown: null,
        categoryId: null,
        userId: null,
        type: null,
        status: "pending",
        articleId: null,
      },
      categoryId: null,
      recommendType: null,
      type: "article",
      typeText: "文章",
      id: null,
      configs: {
        spellChecker: false, //取消语法检查，VueSimplemde 使用的是英文语法的校验，输入中文会高亮红色。当字数超过5000字数时，巨卡！
      },
      refreshKey1: 1,
      refreshKey2: -1,
      routerPopoverVisible: false,
      messageHtml: "",
    };
  },
  computed: {
    saveBtnText() {
      return this.id ? "保存" : "添加";
    },
  },
  async created() {
    this.ARTICLE_RECOMMEND_TYPE = ARTICLE_RECOMMEND_TYPE;
    this.articleInit = JSON.parse(JSON.stringify(this.article));
    this.templateInit = JSON.parse(JSON.stringify(this.template));
    this.hotPointInit = JSON.parse(JSON.stringify(this.hotPoint));
    this.type = this.$route.query.type || "article";
    this.id = this.$route.query.id || null;
    let res = {};
    if (this.type !== "hotpoint") {
      if (this.id) {
        res = await queryArticleById({ articleId: this.id });
        this.article = res.data;
        this.recommendType = res.data.articleType;
      }
    } else {
      if (this.id) {
        res = await queryHotPointById({ hotPointId: this.id });
        this.hotPoint = res.data;
        this.recommendType = res.data.hotPointType;
      }
    }
    await this.getCategoriesList();
    this.categoryId = res.data ? res.data.categoryId : null;
  },
  mounted() {
    if (!Cookies.get("userId")) {
      const h = this.$createElement;
      const dom = [
        h(
          "p",
          `你的账号还没有关联前台账号（ToC用户）,将无法保存编辑的文章。${
            Cookies.get("role") !== "superadmin"
              ? "请联系「超级管理员」进行配置"
              : ""
          }`
        ),
      ];
      if (Cookies.get("role") === "superadmin") {
        dom.push(
          h(
            "a",
            {
              class: "notify-router",
              on: {
                click: () => {
                  this.notifyInstance.close();
                  this.$router.push({ path: "/user/user_cms" });
                },
              },
            },
            "跳转到「用户管理」"
          )
        );
      }
      this.notifyInstance = this.$notify({
        title: "提示",
        duration: 15000,
        type: "warning",
        dangerouslyUseHTMLString: true,
        message: h("div", {}, dom),
      });
    }
  },
  methods: {
    async changeContent() {
      this.categoryId = null;
      this.recommendType = null;
      this.getCategoriesList();
    },

    async getCategoriesList() {
      this.typeText =
        this.type === "article"
          ? "文章"
          : this.type === "hotpoint"
          ? "沸点"
          : "模板";
      this.categorySeletion = (
        await getCategoriesList({ categoryType: this.type })
      ).data.dataList;
    },

    async saveContent() {
      if (!Cookies.get("userId")) {
        return this.$message.warning(
          "你的账号还没有关联前台账号（ToC用户）,无法保存编辑的文章,请联系超级管理员进行配置"
        );
      }
      let res = null;
      switch (this.type) {
        case "article":
          res = (await this.saveContentType(this.type)) || null;
          break;
        case "hotpoint":
          this.hotPoint.categoryId = this.categoryId;
          this.hotPoint.hotPointType = this.recommendType;
          this.hotPoint.userId = Cookies.get("userId");
          if (!this.hotPoint.hotPointContent)
            return this.$message.warning("内容不能为空");
          if (!this.hotPoint.categoryId)
            return this.$message.warning("请选择分类");
          if (!this.hotPoint.hotPointType)
            return this.$message.warning("请选择推荐分类");
          res = await saveHotPoint(this.hotPoint);
          this.hotPoint.hotPointId = this.id = res.data
            ? res.data.hotPointId
            : null;
          break;
        case "template":
          res = (await this.saveContentType(this.type)) || null;
          break;
        default:
          break;
      }
      if (!res) return;
      if (res.code !== 0) {
        return this.$message.error(res.msg);
      }
      this.routerPopoverVisible = true;
      this.$message.success(res.msg);
    },
    async saveContentType(type) {
      let res = null;
      this[type].content = this[type].markdown
        ? this.$refs[type + "Editor"].simplemde.markdown(this[type].markdown)
        : null;
      this[type].categoryId = this.categoryId;
      this[type].type = type !== "template" ? this.recommendType : null;
      if (!this[type].title) {
        this.$message.warning("请输入标题");
        return res;
      }
      if (!this[type].markdown) {
        this.$message.warning("内容不能为空");
        return res;
      }
      if (!this[type].categoryId) {
        this.$message.warning("请选择分类");
        return res;
      }
      if (!this[type].type && type !== "template") {
        this.$message.warning("请选择推荐分类");
        return res;
      }
      if (!this[type].userId) {
        this[type].userId = Cookies.get("userId");
      } else {
        this[type].modifierId = Cookies.get("userId");
      }

      res = await saveArticle(this[type]);
      this[type].articleId = this.id = res.data ? res.data.articleId : null;
      return res;
    },

    imgUpload() {},

    clearEditor() {
      this.$confirm(`之前编辑的内容将清空,确认新增？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.id = null;
          this.categoryId = null;
          this.recommendType = null;
          switch (this.type) {
            case "article":
              this.article = Object.assign(this.article, this.articleInit);
              this.refreshKey1++;
              break;
            case "hotpoint":
              this.hotPoint = Object.assign(this.hotPoint, this.hotPointInit);
              break;
            case "template":
              this.template = Object.assign(this.template, this.templateInit);
              this.refreshKey2--;
              break;
            default:
              break;
          }
        })
        .catch(() => {
          return;
        });
    },

    OkRouter() {
      this.$router.push({ path: `/${this.type}` });
    },
  },
};
</script>

<style lang="less" scoped>
.editor-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  .editor-header {
    display: flex;
    align-items: center;
    padding: 5px 20px;
    box-sizing: border-box;
  }
  .editor-main {
    padding: 0 10px 10px;
    flex: 1;
    display: flex;
    flex-direction: column;
    .editor-container {
      flex: 1;
      padding-bottom: 50px;
      box-sizing: border-box;
      overflow: hidden;
    }
  }
}
/deep/.CodeMirror,
/deep/.CodeMirror-scroll {
  min-height: 200px;
}
/deep/.CodeMirror {
  height: 450px;
}

</style>