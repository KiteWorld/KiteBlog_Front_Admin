<template>
  <div>
    <ul class="link-list">
      <li>
        <span>项目文档：</span>
        <a target="_blank" href="http://kiteworld.gitee.io/kiteblog-site/"
          >文档地址1「国内推荐」</a
        >
        <a target="_blank" href="https://kiteworld.github.io/kiteblog-site/"
          >文档地址2</a
        >
      </li>
      <li>
        <span>Gitee：</span>
        <a target="_blank" href="https://gitee.com/KiteWorld/KiteBlog"
          >Node 服务端</a
        >
        <a
          target="_blank"
          href="https://gitee.com/KiteWorld/KiteBlog_Front_Admin"
          >管理后台</a
        >
        <a target="_blank" href="https://gitee.com/KiteWorld/KiteBlog_Front_ToC"
          >ToC前台页面(未开发)</a
        >
      </li>
      <li>
        <span>Gitbub：</span>
        <a target="_blank" href="https://github.com/KiteWorld/KiteBlog"
          >Node 服务端</a
        >
        <a
          target="_blank"
          href="https://github.com/KiteWorld/KiteBlog_Front_Admin"
          >管理后台</a
        >
        <a
          target="_blank"
          href="https://github.com/KiteWorld/KiteBlog_Front_ToC"
          >ToC前台页面(未开发)</a
        >
      </li>
    </ul>
    <div class="view-contianer">
      <h2>项目预览注意事项</h2>
       <!-- 目前 Node服务端和后台管理已经部署到本人购买的 VPS
        （搬瓦工19美元/年绝版小鸡），方便大家预览！<br /><br />
        由于服务器是在国外以及配置比较低，速度自然也比较慢（特别是晚上 9 点~
        凌晨 1
        点）。 -->
      <p class="view-text">
       目前 「Node服务端」和「后台管理」已经部署到本人购买服务器上，大家在预览的时候不要恶意添加大量数据占用服务器资源以及删除别人的数据。让我们做个文明的中国人，这里附上
        <a
          href="https://www.bilibili.com/video/BV1wx411M7LH?from=search&seid=490646424586704806"
          >极品MV</a
        >，供大家欣赏，哈哈! <br /><br />
        预览地址：<a href="https://kiteblog.cms.kite1874.com/#/adminLogin"
          >KiteBlog</a
        >
        <br /><br />
        注意：服务器每天凌晨 2 点会进行数据还原，删除上传的文件和还原数据库。
      </p>
      <p>如果这个项目对你有帮助，麻烦给个帮我在 GitHub 点个  star⭐ ~~! 谢谢</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "Document",
  data() {
    return {};
  },
};
</script>

<style lang="less" scoped>
.link-list {
  list-style: none;
  li {
    line-height: 34px;
    margin: 3px 0;
    span {
      display: inline-block;
      width: 100px;
      text-align: right;
    }
    a {
      text-decoration: none;
      margin: 0 8px;
      padding: 6px;
      background: #5cadff;
      color: #fff;
      border-radius: 5px;
    }
  }
}
.view-contianer {
  padding: 30px;
  margin-top: 10px;
  a {
    text-decoration: none;
  }
}
</style>