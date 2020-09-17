<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        style="width: 240px"
        class="filter-item"
        placeholder="用户名/登录名/手机号/邮箱"
        v-model="searchObject.condition"
        type="text"
        clearable
        @change="handleSearch"
      />
      <el-button
        style="margin-left: 10px;"
        class="filter-item"
        icon="el-icon-search"
        type="primary"
        @click="handleSearch()"
      >查询</el-button>
      <el-button
        style="margin-left: 10px;"
        class="filter-item"
        icon="el-icon-plus"
        type="primary"
        @click="handleAdd()"
        v-if="$authed('sys:users:add')"
      >添加</el-button>
      <el-button
        v-if="multipleSelection.length > 0 && $authed('sys:users:deletes')"
        class="filter-item"
        icon="el-icon-delete"
        type="danger"
        @click="handleRemoveAll"
      >批量删除</el-button>
    </div>
    <div class="table-container">
      <el-table
        :data="tableData"
        style="width: 100%"
        stripe
        border
        @selection-change="handleSelectionChange"
        show-overflow-tooltip
        v-loading="loading"
        @sort-change="handleSortChange"
      >
        <el-table-column type="selection"></el-table-column>
        <el-table-column type="index" label="序号" align="center" width="50"></el-table-column>
        <el-table-column prop="userName" label="姓名" width="180" sortable="custom"></el-table-column>
        <el-table-column prop="loginName" label="登录名" width="180" sortable="custom"></el-table-column>
        <el-table-column prop="phoneNum" label="手机号" width="160"></el-table-column>
        <el-table-column prop="userEmail" label="邮箱" min-width="200"></el-table-column>
        <el-table-column prop="birthDate" label="生日" width="200" sortable="custom"></el-table-column>
        <el-table-column prop="roles" label="角色" width="150"></el-table-column>
        <el-table-column prop="status" label="状态" width="120" align="center" sortable="custom">
          <template slot-scope="scope">
            <el-switch
              :disabled="true"
              v-model="scope.row.status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="1"
              :inactive-value="0"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="150"
          align="center"
          v-if="$authed('sys:users:update') || $authed('sys:users:role_assign') || $authed('sys:users:delete')"
        >
          <template slot-scope="scope">
            <el-button
              @click="handleOperate(scope.row, 'edit')"
              v-if="$authed('sys:users:update')"
              type="text"
              size="small"
            >编辑</el-button>
            <el-divider direction="vertical" v-if="$authed('sys:users:update')"></el-divider>
            <el-button
              @click="handleOperate(scope.row, 'assign')"
              v-if="$authed('sys:users:role_assign')"
              type="text"
              size="small"
            >角色</el-button>
            <el-divider
              direction="vertical"
              v-if="$authed('sys:users:role_assign') && $authed('sys:users:delete')"
            ></el-divider>
            <el-popconfirm
              v-if="$authed('sys:users:delete')"
              :title="`您确定删除用户 【${scope.row.userName}】 吗？`"
              @onConfirm="handleOperate(scope.row, 'delete')"
            >
              <el-button slot="reference" class="el-delete-btn" type="text" size="small">删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
        <div slot="empty" class="el-table-empty">
          <svg-icon icon-class="empty" class-name="el-table-empty-icon" />

          <br />暂无数据
        </div>
      </el-table>
    </div>
    <el-pagination
      v-if="total > 0"
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="searchObject.page"
      :page-sizes="[10, 30, 50, 100]"
      :page-size="searchObject.limit"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>

    <add-or-edit-user ref="userDialog" @ok="handleConfirm" @cancel="handleCancel"></add-or-edit-user>
    <assign-role ref="assignRoleDialog" @ok="handleAssign"></assign-role>
  </div>
</template>

<script>
import {
  fetchList,
  removeUser,
  addUser,
  editUser,
  assignUserRole,
} from "@/api/user";
import AddOrEditUser from "./add-or-edit-user";
import AssignRole from "./assign-role";
export default {
  name: "User",
  components: {
    AddOrEditUser,
    AssignRole,
  },
  data() {
    return {
      searchObject: {
        condition: "",
        page: 1,
        limit: 10,
      },
      total: 0,
      multipleSelection: [],
      tableData: [],
      loading: false,
    };
  },
  mounted() {
    this.handleSearch();
  },
  methods: {
    handleAdd() {
      this.$refs.userDialog.add();
    },
    handleSearch() {
      this.loading = true;
      fetchList({
        ...this.searchObject,
      })
        .then((res) => {
          if (res.code === "00000") {
            this.searchObject.page = res.data.currPage;
            this.searchObject.limit = res.data.pageSize;
            this.total = res.data.totalCount;
            this.tableData = res.data.list;
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    handleSortChange(column, prop, order) {
      let desc = column.order === "descending" ? 1 : 0;
      let field = column.order ? column.prop : undefined;
      this.searchObject.field = field;
      this.searchObject.desc = desc;
      console.log(column.prop, column.order);
      // this.handleSearch();
    },
    handleOperate(data, param) {
      console.log(data, param, "handleOperate");
      switch (param) {
        case "edit":
          this.$refs.userDialog.edit(data);
          break;
        case "assign":
          this.$refs.assignRoleDialog.assign(data);
          break;
        case "delete":
          this.handleDelete([data.userNum]);
          break;
        default:
      }
    },
    handleSizeChange(val) {
      this.searchObject.limit = val;
      this.handleSearch();
    },
    handleCurrentChange(val) {
      this.searchObject.page = val;
      this.handleSearch();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleDelete(userNums) {
      console.log(userNums, "11111111");
      removeUser(userNums).then((res) => {
        if (res.code === "00000") {
          this.$message.success("删除用户成功");
          this.handleSearch();
        }
      });
    },
    handleRemoveAll() {
      console.log(this.multipleSelection);
      let userNames = this.multipleSelection
        .map((item) => item.userName)
        .join(",");
      this.$confirm(`确认删除 【${userNames}】 等用户吗?`, "确认", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        callback: (action) => {
          if (action === "confirm") {
            let userNums = this.multipleSelection.map((item) => item.userNum);
            this.handleDelete(userNums);
            console.log("按下 确定");
          } else {
            console.log("按下 取消");
          }
        },
      });
    },
    handleConfirm(param, data) {
      console.log(param, data, "confirm");
      this.$refs.userDialog.loading = true;
      if (param) {
        editUser(data.userNum, data)
          .then((res) => {
            if (res.code === "00000") {
              this.$message.success("修改用户成功");
              this.$refs.userDialog.handleCancel();
              this.handleSearch();
            }
          })
          .finally(() => {
            this.$refs.userDialog.loading = false;
          });
      } else {
        addUser(data)
          .then((res) => {
            if (res.code === "00000") {
              this.$message.success("添加用户成功");
              this.$refs.userDialog.handleCancel();
              this.handleSearch();
            }
          })
          .finally(() => {
            this.$refs.userDialog.loading = false;
          });
      }
    },
    handleAssign(data) {
      console.log("角色分配：", data);
      this.$refs.assignRoleDialog.loading = true;
      assignUserRole(data.userNum, data.userRoles).then((res) => {
        if (res.code === "00000") {
          this.$message.success("用户角色分配成功");
          this.$refs.assignRoleDialog.handleCancel();
          this.handleSearch();
        }
      });
    },
    handleCancel() {},
  },
};
</script>