<template>
  <div ref="container" class="container">
    <el-row :gutter="20">
      <el-col :span="12" :offset="0">
        <el-button-group style="margin-bottom: 5px">
          <!-- 要写成 showUserDialog()，简写成 showUserDialog 会默认接收一个 事件点击对象（MouseEvent）作为参数  -->
          <el-button plain size="small" @click="showUserDialog()"
            >新增</el-button
          >
          <el-button v-popover:popover plain size="small">修改状态</el-button>
          <el-button plain size="small" @click="delUsers()">删除</el-button>
        </el-button-group>
      </el-col>
      <el-col :span="12" :offset="0">
        <SearchInput @onSearch="search()" @onReset="reset()" ref="search">
          <el-input
            slot="main"
            v-model="searchData.userName"
            placeholder="用户名称"
            size="small"
            clearable
          ></el-input>
          <div class="search-item" slot="sub">
            <span class="search-label">角色：</span>
            <el-select
              v-model="searchData.userRole"
              placeholder="请选择"
              clearable
              filterable
              style="width: 100%"
              size="small"
            >
              <el-option
                v-for="(value, name) in TOC_USER_ROLE"
                :key="name"
                :value="name"
                :label="value"
              >
                <!-- $refs.search.$refs.messageDrop.show() 为了解决下拉选择之后，dropdown收起问题 -->
                {{ value }}
              </el-option>
            </el-select>
          </div>
          <div class="search-item" slot="sub">
            <span class="search-label">状态：</span>
            <el-select
              v-model="searchData.userStatus"
              placeholder="请选择"
              clearable
              filterable
              style="width: 100%"
              size="small"
            >
              <el-option
                v-for="(value, name) in USER_STATUS"
                :key="name"
                :value="name"
                :label="value"
              >
                {{ value }}
              </el-option>
            </el-select>
          </div>
          <div class="search-item" slot="sub">
            <span class="search-label">性别：</span>
            <el-select
              v-model="searchData.userSex"
              placeholder="请选择"
              clearable
              filterable
              style="width: 100%"
              size="small"
            >
              <el-option
                v-for="(value, name) in USER_SEX"
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
              size="small"
              style="width: 100%"
              value-format="yyyy-MM-dd HH:mm:ss"
            >
            </el-date-picker>
          </div>
        </SearchInput>
      </el-col>
    </el-row>
    <Table ref="usersTable" :tableProps="tableProps" :columns="columns"></Table>
    <el-popover
      ref="popover"
      v-model="propverVisible"
      placement="bottom"
      trigger="click"
      @show="showPopoverHandle('propverVisible', 'usersTable')"
    >
      <ul class="status-container">
        <li
          v-for="(value, name) in USER_STATUS"
          :key="name"
          class="status-item click-item"
          @click="changeStatus(name)"
        >
          {{ value }}
        </li>
      </ul>
    </el-popover>
    <el-dialog
      :title="set_user.title"
      :visible.sync="set_user.visible"
      width="600px"
      top="8vh"
    >
      <el-form
        :model="set_user.data"
        ref="UserForm"
        :rules="rules"
        label-width="100px"
        :inline="false"
        size="samll"
      >
        <el-form-item label="用户名：" prop="userName">
          <el-input
            size="small"
            v-model="set_user.data.userName"
            placeholder="请输入"
            style="width: 400px"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="密码：" prop="password">
          <el-input
            size="small"
            v-model="set_user.data.password"
            placeholder="请输入"
            type="password"
            show-password
            style="width: 400px"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="角色类型:" prop="userRole">
          <el-radio-group v-model="set_user.data.userRole" size="mini">
            <el-radio
              :label="key"
              :key="key"
              border
              v-for="(value, key) in TOC_USER_ROLE"
              >{{ value }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item label="状态：" prop="userStatus">
          <el-radio-group v-model="set_user.data.userStatus" size="mini">
            <el-radio
              :label="Number(key)"
              :key="key"
              border
              v-for="(value, key) in USER_STATUS"
              >{{ value }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item label="性别：" prop="userSex">
          <el-radio-group v-model="set_user.data.userSex" size="mini">
            <el-radio :label="0" border>未知</el-radio>
            <el-radio :label="1" border>男</el-radio>
            <el-radio :label="2" border>女</el-radio>
          </el-radio-group>
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
        <el-button size="small" @click="set_user.visible = false"
          >取 消</el-button
        >
        <el-button size="small" type="primary" @click="saveUser"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  updateUserStatus,
  deleteUsers,
  saveUser,
  queryUserById,
} from "../api/api";
import {
  USER_STATUS,
  TOC_USER_ROLE,
  USER_SEX,
  USER_STATUS_TAG_TYPE,
} from "../common/eum";
import UploadAvatar from "@/components/UploadAvatar";
import {
  userName,
  password,
  userRole,
  userStatus,
  userSex,
} from "@/common/rules";
import { checkTableSelect, showPopoverHandle } from "@/common/mixin";
import Cookies from "js-cookie";

export default {
  name: "UserToC",
  components: {
    UploadAvatar,
  },
  mixins: [checkTableSelect, showPopoverHandle],
  data() {
    return {
      tableData: [],
      selection: [],
      total: null,
      currentPage: 1,
      pageSize: 20,
      tableHeight: null,
      rows: null,
      propverVisible: false,
      searchData: {
        userId: null,
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
          userName: null,
          password: null,
          userRole: null,
          userStatus: 0,
          avatar: null,
          userSex: 0,
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
      rules: {},
      tableProps: {
        selection: true,
        setting: {
          url: "users/queryUser",
        },
      },
      columns: [
        { prop: "userName", label: "名字" },
        {
          prop: "userRole",
          label: "角色",
          formatter: (row, column, cellValue) => TOC_USER_ROLE[cellValue], //加index eslint报错
        },
        {
          prop: "userStatus",
          label: "状态",
          render: (h, { row }) => {
            return h(
              "el-tag",
              {
                attrs: {
                  type: USER_STATUS_TAG_TYPE[row.userStatus],
                },
              },
              USER_STATUS[row.userStatus]
            );
          },
        },
        {
          prop: "userSex",
          label: "性别",
          formatter: (row, column, cellValue) => USER_SEX[cellValue],
        },
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
    this.rules = { userName, password, userRole, userStatus, userSex };
    this.USER_STATUS = USER_STATUS;
    this.TOC_USER_ROLE = TOC_USER_ROLE;
    this.USER_SEX = USER_SEX;
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

    async changeStatus(statusCode) {
      let param = {
        status: statusCode,
        userIds: this.$refs.usersTable.selection.map((x) => x.userId),
      };
      let res = await updateUserStatus(param);
      this.$message.success(res.msg);
      if (res.code === 0) this.search();
    },
    async showUserDialog(row) {
      let set = this.set_user;
      if (row) {
        let res = await queryUserById({ userId: row.userId });
        if (res.code !== 0) {
          return this.$message.error("获取用户信息失败！");
        }
        set.data = Object.assign(set.data, res.data);
        console.log(set.data);
      } else {
        set.data = Object.assign(set.data, this.userDateInit);
      }
      set.visible = true;
    },
    saveUser() {
      this.$refs.UserForm.validate(async (valid) => {
        if (valid) {
          let res = await saveUser(this.set_user.data);
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
    async delUsers() {
      let rows = this.checkTableSelect("usersTable");
      if (!rows) return;
      let res = await deleteUsers({
        userIds: rows.map((x) => x.userId),
      });
      if (res.code === 0) {
        this.$message.success(res.msg);
        this.search();
        return;
      }
      this.$message.warning(
        "操作失败，请确保后台用户（ToC）没有关联该用户再删除"
      );
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