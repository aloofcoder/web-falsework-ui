<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        style="width: 240px"
        class="filter-item"
        placeholder="请输入角色名/角色标记"
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
      >添加</el-button>
      <el-button
        v-if="multipleSelection.length > 0"
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
        <el-table-column prop="roleName" label="角色名" sortable="custom"></el-table-column>
        <el-table-column prop="roleMark" label="角色标记" sortable="custom"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述" sortable="custom"></el-table-column>
        <el-table-column prop="roleSort" label="排序号" sortable="custom"></el-table-column>
        <el-table-column prop="status" label="状态" width="120" align="center" sortable="custom">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="1"
              :inactive-value="0"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="150" align="center">
          <template slot-scope="scope">
            <el-button @click="handleOperate(scope.row, 'edit')" type="text" size="small">编辑</el-button>
            <el-divider direction="vertical"></el-divider>
            <el-button @click="handleOperate(scope.row, 'auth')" type="text" size="small">权限</el-button>
            <el-divider direction="vertical"></el-divider>
            <el-popconfirm :title="`您确定删除吗？`" @onConfirm="handleOperate(scope.row, 'delete')">
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

    <add-or-edit-role ref="roleDialog" @ok="handleConfirm" @cancel="handleCancel"></add-or-edit-role>
    <add-role-auth ref="roleAuthDialog" @ok="handleAuth" @cancel="handleCancel"></add-role-auth>
  </div>
</template>

<script>
import {
  fetchList,
  removeRole,
  addRole,
  editRole,
  roleAuthMenu,
} from "@/api/role";
import AddOrEditRole from "./add-or-edit-role";
import AddRoleAuth from "./add-role-auth";
export default {
  name: "RoleList",
  components: {
    AddOrEditRole,
    AddRoleAuth,
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
      this.$refs.roleDialog.add();
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
      console.log(column.prop, column.order);
    },
    handleOperate(data, param) {
      switch (param) {
        case "edit":
          this.$refs.roleDialog.edit(data);
          break;
        case "auth":
          this.$refs.roleAuthDialog.auth(data);
          break;
        case "delete":
          this.handleDelete([data.roleId]);
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
    handleDelete(ids) {
      removeRole(ids).then((res) => {
        if (res.code === "00000") {
          this.$message.success("删除成功");
          this.handleSearch();
        }
      });
    },
    handleRemoveAll() {
      this.$confirm(`确认删除吗?`, "确认", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        callback: (action) => {
          if (action === "confirm") {
            let roleIds = this.multipleSelection.map((item) => item.roleId);
            this.handleDelete(roleIds);
          }
        },
      });
    },
    handleConfirm(param, data) {
      this.$refs.roleDialog.loading = true;
      if (param) {
        editRole(data.roleId, data)
          .then((res) => {
            this.$refs.roleDialog.loading = true;
            if (res.code === "00000") {
              this.$message.success("修改成功");
              this.$refs.roleDialog.handleCancel();
              this.handleSearch();
            }
          })
          .finally(() => {
            this.$refs.roleDialog.loading = false;
          });
      } else {
        addRole(data)
          .then((res) => {
            if (res.code === "00000") {
              this.$message.success("添加成功");
              this.$refs.roleDialog.handleCancel();
              this.handleSearch();
            }
          })
          .finally(() => {
            this.$refs.roleDialog.loading = false;
          });
      }
    },
    handleAuth(data) {
      this.$refs.roleAuthDialog.loading = true;
      roleAuthMenu(data.roleId, data.authMenus)
        .then((res) => {
          if (res.code === "00000") {
            this.$message.success("角色授权菜单成功");
            this.$refs.roleAuthDialog.handleCancel();
          }
        })
        .finally(() => {
          this.$refs.roleAuthDialog.loading = false;
          this.$store.dispatch("user/getInfo");
        });
    },
    handleCancel() {},
  },
};
</script>
