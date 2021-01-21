<template>
  <div ref="container" class="container">
    <el-row :gutter="20">
      <el-col :span="12" :offset="0">
        <el-button-group style="margin-bottom: 5px">
          <el-button @click="showUserDialog()">新增</el-button>
          <el-button @click="deleteCMSUser()">删除</el-button>
        </el-button-group>
      </el-col>
      <el-col :span="12" :offset="0">
        <SearchInput @onSearch="search()" @onReset="reset()" ref="search">
          <el-input
            slot="main"
            v-model="searchData.userName"
            placeholder="用户名称"
          ></el-input>
          <div class="search-item" slot="sub">
            <span class="search-label">角色：</span>
            <el-select
              v-model="searchData.userRole"
              placeholder="请选择"
              style="width: 100%"
            >
              <el-option
                v-for="(value, name) in CMS_USER_ROLE"
                :key="name"
                :value="name"
                :label="value"
              >
                {{ value }}
              </el-option>
            </el-select>
          </div>
          <div class="search-item" slot="sub">
            <span class="search-label">注册时间：</span>
            <el-date-picker
              type="datetimerange"
              v-model="searchData.createDate"
              style="width: 100%"
              size="small"
              value-format="yyyy-MM-dd HH:mm:ss"
            >
            </el-date-picker>
          </div>
        </SearchInput>
      </el-col>
    </el-row>
    <Table ref="usersTable" :tableProps="tableProps" :columns="columns"></Table>
    <el-dialog
      :title="set_user.title"
      :visible.sync="set_user.visible"
      width="620px"
    >
      <el-form
        :model="set_user.data"
        ref="UserForm"
        :rules="rules"
        label-width="100px"
        :inline="false"
        size="samll"
      >
        <el-form-item label="工号：" prop="jobNo">
          <el-input
            v-model="set_user.data.jobNo"
            placeholder="无法获取工号，请重新打开窗口重试"
            style="width: 400px"
            disabled
          >
          </el-input>
        </el-form-item>
        <el-form-item label="用户名：" prop="userName">
          <el-input
            v-model="set_user.data.userName"
            placeholder="请输入"
            style="width: 400px"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="密码：" prop="password">
          <el-input
            v-model="set_user.data.password"
            placeholder="请输入"
            type="password"
            show-password
            style="width: 400px"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="角色类型:" prop="userRole">
          <el-radio-group v-model="set_user.data.userRole" @change="changeRole">
            <el-radio
              :label="key"
              :key="key"
              border
              v-for="(value, key) in CMS_USER_ROLE"
              >{{ value }}</el-radio
            >
          </el-radio-group>
        </el-form-item>

        <el-form-item label="关联ToC用户:">
          <el-select
            v-model="set_user.data.ToCUserId"
            remote
            reserve-keyword
            placeholder="请输入用户名搜索（需要先选择角色类型）"
            :remote-method="searchUser"
            :loading="set_user.loading"
            style="width: 400px"
          >
            <el-option
              v-for="item in tocUserList"
              :key="item.userId"
              :label="item.userName"
              :value="item.userId"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上传头像：">
          <UploadAvatar
            ref=""
            :uploadProps="set_user.uploadProps"
            :imgUrl="set_user.data.avatar"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="set_user.visible = false">取 消</el-button>
        <el-button type="primary" :plain="false" @click="saveUser"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  deleteCMSUser,
  queryAllUsersList,
  queryCMSUserById,
  saveCMSUser,
  queryJobNoMax,
} from "../api/api";
import { userName, password, userRole, jobNo } from "@/common/rules";
import { CMS_USER_ROLE } from "../common/eum";
import Cookies from "js-cookie";
import { checkTableSelect, showPopoverHandle } from "@/common/mixin";
import UploadAvatar from "@/components/UploadAvatar";

export default {
  name: "UserCMS",
  components: {
    UploadAvatar,
  },
  mixins: [checkTableSelect, showPopoverHandle],
  data() {
    return {
      propverVisible: false,
      searchData: {
        userName: null,
        userRole: null,
        userStatus: null,
        userSex: null,
        userCreateDate: null,
      },
      set_user: {
        title: "添加CMS用户",
        visible: false,
        loading: false,
        data: {
          CMSUserId: null,
          userName: null,
          password: null,
          userRole: "visitor",
          ToCUserId: null,
          avatar: null,
          jobNo: null,
        },
        tocUserList: [], //嵌套太深，可以用 push 或者 this.$set() 来刷新列表。嫌麻烦的话，可以直接写在 data 里面 。为了照顾萌新（我也是萌新，所以深知萌新的痛苦），我这里演示一下。
        uploadProps: {
          action: "http://localhost:1874/upload/uploadAvatar",
          headers: {
            Authorization: "Bearer " + Cookies.get("token"),
          },
          accept: "image/jpeg,image/png",
          onSuccess: (res) => {
            this.set_user.data.avatar = res.data.imgUrl;
          },
        },
      },
      tocUserList: [], // 直接写在 data 里， Vue是可以监听到 toUserList 的引用发生改变，所以视图就会刷新
      rules: {},
      tableProps: {
        selection: true,
        setting: {
          url: "users/queryCMSUser",
        },
      },
      columns: [
        { prop: "userName", label: "用户名" },
        {
          prop: "userRole",
          label: "角色",
          formatter: (row, column, cellValue) => CMS_USER_ROLE[cellValue], //加index eslint报错
        },
        { prop: "jobNo", label: "工号" },
        { prop: "ToCUserName", label: "关联的ToC用户" },
        {
          prop: "avatar",
          label: "头像",
          render: (h, { row }) => {
            if (row.avatar) {
              return h("img", {
                attrs: {
                  class: "user-avatar", // less可以使用 /deep/使样式生效
                  src: row.avatar,
                },
              });
            }
          },
        },
        { prop: "createDate", label: "注册日期" },
        {
          prop: "doSome",
          label: "操作",
          render: (h, { row }) => {
            return h("el-button", {
              attrs: {
                icon: "el-icon-edit",
                size: "small",
              },
              on: {
                click: () => {
                  this.showUserDialog(row);
                },
              },
            });
          },
        },
      ],
    };
  },
  async created() {
    this.searchDataBackUp = JSON.parse(JSON.stringify(this.searchData));
    this.userDateInit = JSON.parse(JSON.stringify(this.set_user.data));
    this.rules = { userName, password, userRole, jobNo };
    this.CMS_USER_ROLE = CMS_USER_ROLE;
  },
  methods: {
    search() {
      this.tableProps.setting.params = this.searchData;
      this.$refs.usersTable.searchTableData();
    },
    reset() {
      this.searchData = JSON.parse(JSON.stringify(this.searchDataBackUp));
      this.search();
    },
    async searchUser(query) {
      if (query !== "") {
        this.set_user.loading = true;
        let res = await queryAllUsersList({ userName: query });
        if (res.code == 0) {
          // 1、使用 this.$set 赋值，并刷新视图
          // this.$set(this.set_user, "tocUserList", res.data.dataList);

          //2、用 push 来追加数据，视图也会刷新
          // this.set_user.toUserList = [] // 先清空数组
          // this.set_user.toUserList.push(...res.data.dataList)

          //3、直接写在 data 里面的 tocUserList ，直接赋值就可以了。Vue 可以监听到 tocUserList 的应用发生变化。
          //tocUserList只是用于遍历加载下来选择项，这里已经可以满足需求了。
          //如果数组里面有嵌套了多次对象，视图还是没法监听到的。这里就不展开了。
          this.tocUserList = res.data.dataList || [];
        }
        this.set_user.loading = false;
      } else {
        this.tocUserList = [];
      }
    },
    async showUserDialog(row) {
      let set = this.set_user;
      if (row) {
        let res = await queryCMSUserById({ CMSUserId: row.CMSUserId });
        if (res.code !== 0) {
          return this.$message.error("获取用户信息失败！");
        }
        set.title = "修改ToC用户信息";
        set.data = Object.assign(set.data, res.data);
        if (set.data.ToCUserId) {
          this.tocUserList = [
            {
              userName: set.data.ToCUserName,
              userId: set.data.ToCUserId,
            },
          ];
        }
      } else {
        set.data = Object.assign(set.data, this.userDateInit);
        set.data.jobNo = (await queryJobNoMax()).data.jobNo;
      }
      set.visible = true;
    },
    async changeRole(role) {
      const user = this.set_user.data;
      if (!user.CMSUserId) {
        if (role === "superadmin") {
          user.jobNo = (await queryJobNoMax({ userRole: role })).data.jobNo;
        } else {
          user.jobNo = (await queryJobNoMax()).data.jobNo;
        }
      }
    },
    saveUser() {
      this.$refs.UserForm.validate(async (valid) => {
        if (valid) {
          let res = await saveCMSUser(this.set_user.data);
          if (res.code === 0) {
            this.search();
            this.$message.success(res.msg);
            this.set_user.visible = false;
            return;
          }
          this.$message.warning(res.msg);
        } else {
          return false;
        }
      });
    },
    async deleteCMSUser() {
      let rows = this.checkTableSelect("usersTable");
      if (!rows) return;
      let res = await deleteCMSUser({
        CMSUserIds: rows.map((x) => x.CMSUserId),
      });
      if (res.code === 0) {
        this.$message.success(res.msg);
        this.search();
      } else {
        this.$message.warning(res.msg);
      }
    },
  },
};
</script>

<style lang="less" scoped>
.container {
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
  padding: 10px 4px;
  /deep/.user-avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }
  /deep/.status-container {
    height: 100%;
    width: 100%;
    list-style: none;
    flex-direction: column;
  }
  /deep/ .el-radio {
    margin-right: 0;
  }
}
</style>