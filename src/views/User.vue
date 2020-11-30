<template>
  <div class="container">
    <el-button-group style="margin-bottom: 5px">
      <el-button v-popover:popover plain>修改状态</el-button>
      <!-- <el-button plain>轻微违规</el-button>
      <el-button plain>严重违规</el-button>
      <el-button plain>封号</el-button> -->
      <el-button plain>删除</el-button>
    </el-button-group>
    <!-- <div style="height: 500px; overflow: auto"> -->
    <!-- <el-scrollbar style="height: calc(100% - 5px); width: calc(100% - 5px)"> -->
    <el-table
      :data="tableData"
      border
      style="width: 100%"
      height="500"
      @selection-change="selectionChange"
    >
      <el-table-column align="center" prop="name" type="selection">
      </el-table-column>
      <el-table-column align="center" prop="name" label="名字">
      </el-table-column>
      <el-table-column align="center" prop="role" label="角色">
      </el-table-column>
      <el-table-column align="center" prop="status" label="状态">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.status == 0">{{
            USER_STATUS[scope.row.status]
          }}</el-tag>
          <el-tag type="warning" v-else-if="scope.row.status == 1">{{
            USER_STATUS[scope.row.status]
          }}</el-tag>
          <el-tag type="danger" v-else-if="scope.row.status == 2">{{
            USER_STATUS[scope.row.status]
          }}</el-tag>
          <el-tag type="info" v-else>{{
            USER_STATUS[scope.row.status]
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="sex" label="性别">
      </el-table-column>
      <el-table-column align="center" prop="icon" label="头像">
        <template slot-scope="scope">
          <img :src="scope.row.icon" v-if="scope.row.icon" class="user-icon" />
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="createTime"
        label="注册日期"
      ></el-table-column>
      <el-table-column align="center" prop="do" label="操作"> </el-table-column>
    </el-table>
    <!-- </el-scrollbar> -->
    <!-- </div> -->
    <el-pagination
      @size-change="sizeChange"
      @current-change="currentChange"
      :current-page="currentPage"
      :page-sizes="[20, 50, 100, 200]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      style="margin-top: 6px; text-align: center"
    >
    </el-pagination>
    <el-popover ref="popover" placement="bottom" trigger="click">
      <ul class="status-container">
        <li
          v-for="(value, name) in USER_STATUS"
          :key="name"
          class="status-item"
          @click="changeStatus(name)"
        >
          {{ value }}
        </li>
      </ul>
    </el-popover>
    <!-- <el-dialog :title="set_modify.title" :visible.sync="set_modify.visible">
      <el-form
        :model="form"
        ref="form"
        :rules="rules"
        label-width="80px"
        :inline="false"
        size="normal"
      >
        <el-form-item label="">
          <el-input v-model="form."></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">立即创建</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>

      <span slot="footer">
        <el-button @click="set_modify.visible = false">取消</el-button>
        <el-button type="primary" @click="modify">保存</el-button>
      </span>
    </el-dialog> -->
  </div>
</template>

<script>
import { getUsers, updateUserStatus } from "../api/api";
import { USER_STATUS } from "../common/eum";
export default {
  name: "",
  data() {
    return {
      tableData: [],
      selection: [],
      total: null,
      currentPage: 1,
      pageSize: 20,
      set_modify: {
        visible: false,
        loading: true,
        title: "修改用户信息",
      },
      modifyForm: {},
      USER_STATUS: {},
    };
  },
  async created() {
    this.USER_STATUS = USER_STATUS;
    this.getUsers();
  },
  methods: {
    async getUsers() {
      let param = { pageSize: this.pageSize, page: this.currentPage };
      let res = await getUsers(param);
      this.tableData = res.data.users;
      this.total = res.data.total;
    },

    async changeStatus(statusCode) {
      let param = {
        status: statusCode,
        userIds: this.selection.map((x) => x.userId),
      };
      let res = await updateUserStatus(param);
      this.$message.success(res.msg);
      this.getUsers();
    },
    selectionChange(selection) {
      this.selection = selection;
    },
    currentChange(currentPage) {
      this.currentPage = currentPage;
      this.getUsers();
    },
    sizeChange(pageSize) {
      console.log(pageSize);
      this.pageSize = pageSize;
      this.getUsers();
    },
  },
};
</script>

<style lang="less" scoped>
.container {
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
  padding: 10px 4px;
  .user-icon {
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
}
</style>