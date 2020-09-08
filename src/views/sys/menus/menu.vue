<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        style="width: 240px"
        class="filter-item"
        placeholder="请输入菜单名/菜单路径"
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
        :row-key="getRowKeys"
        :expand-row-keys="expands"
        @expand-change="handleExpandChange"
        :data="tableData"
        style="width: 100%"
        stripe
        border
        @selection-change="handleSelectionChange"
        show-overflow-tooltip
        v-loading="loading"
        @sort-change="handleSortChange"
        :tree-props="{children: 'children'}"
      >
        <el-table-column type="selection"></el-table-column>
        <el-table-column type="index" label="序号" align="center" width="50"></el-table-column>
        <el-table-column prop="menuName" label="菜单名" min-width="150" sortable="custom">
          <template slot-scope="scope">{{scope.row.menuName}}</template>
        </el-table-column>
        <el-table-column prop="menuPath" label="菜单路径" min-width="200" sortable="custom"></el-table-column>
        <el-table-column prop="menuRedirect" label="重定向路径" min-width="150" sortable="custom"></el-table-column>
        <el-table-column prop="menuIcon" label="菜单图标" min-width="80" align="center">
          <template slot-scope="scope">
            <i
              v-if="scope.row.menuClass !== 3 && scope.row.menuIcon.startsWith('el-')"
              :class="scope.row.menuIcon"
            />
            <svg-icon
              v-if="scope.row.menuClass !== 3 && !scope.row.menuIcon.startsWith('el-')"
              :icon-class="scope.row.menuIcon"
            />
          </template>
        </el-table-column>
        <el-table-column prop="menuComponent" label="组件地址" min-width="150" sortable="custom"></el-table-column>
        <el-table-column prop="menuMark" label="权限标记" min-width="150" sortable="custom"></el-table-column>
        <el-table-column
          prop="menuClass"
          label="菜单类型"
          min-width="120"
          sortable="custom"
          align="center"
        >
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.menuClass === 1 ? 'success' : scope.row.menuClass === 2 ? '' : 'warning'"
              size="mini"
            >{{scope.row.menuClass === 1 ? '目录' : scope.row.menuClass === 2 ? '菜单' : '按钮'}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="menuSort"
          label="显示排序"
          min-width="120"
          sortable="custom"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="isHidden"
          label="是否隐藏"
          min-width="120"
          sortable="custom"
          align="center"
        >
          <template slot-scope="scope">{{scope.row.isHidden === 1 ? '是' : '否'}}</template>
        </el-table-column>
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
        <el-table-column prop="menuDesc" label="菜单描述" min-width="180" sortable="custom"></el-table-column>
        <el-table-column fixed="right" label="操作" width="110" align="center">
          <template slot-scope="scope">
            <el-button @click="handleOperate(scope.row, 'edit')" type="text" size="small">编辑</el-button>
            <el-divider direction="vertical"></el-divider>
            <el-popconfirm
              :title="`您确定删除菜单【${scope.row.menuName}】吗？`"
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
    <add-or-edit-menu ref="menuDialog" @ok="handleConfirm" @cancel="handleCancel"></add-or-edit-menu>
  </div>
</template>

<script>
import {
  fetchTree,
  fetchList,
  removeMenu,
  addMenu,
  editMenu,
} from "@/api/menu";
import AddOrEditMenu from "./add-or-edit-menu";
export default {
  name: "MenuList",
  components: {
    AddOrEditMenu,
  },
  data() {
    return {
      searchObject: {
        condition: "",
      },
      multipleSelection: [],
      tableData: [],
      loading: false,
      getRowKeys(row) {
        return row.id;
      },
      expands: [],
    };
  },
  mounted() {
    this.handleSearch();
  },
  methods: {
    handleExpandChange(row, expanded) {
      console.log(row, expanded);
      if (expanded) {
        this.expands.push(`${row.id}`);
      } else {
        this.expands.pop(`${row.id}`);
      }
    },
    handleAdd() {
      this.$refs.menuDialog.add();
    },
    handleSearch() {
      this.loading = true;
      fetchTree({
        ...this.searchObject,
      })
        .then((res) => {
          if (res.code === '00000') {
            this.tableData = res.data;
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
          this.$refs.menuDialog.edit(data);
          break;
        case "delete":
          this.handleDelete([data.id]);
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
      removeMenu(ids).then((res) => {
        if (res.code === '00000') {
          this.$message.success("删除成功");
          this.handleSearch();
        }
      });
    },
    handleRemoveAll() {
      this.$confirm(`确认删除系统菜单吗?`, "确认", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        callback: (action) => {
          if (action === "confirm") {
            let ids = this.multipleSelection.map((item) => item.id);
            this.handleDelete(ids);
          }
        },
      });
    },
    handleConfirm(param, data) {
      console.log(data.parentId);
      this.$refs.menuDialog.loading = true;
      if (param) {
        editMenu(data.id, data)
          .then((res) => {
            this.$refs.menuDialog.loading = true;
            if (res.code === '00000') {
              this.$message.success("修改成功");
              this.$refs.menuDialog.handleCancel();
              this.handleSearch();
              this.expands.push(`${data.parentId}`);
            }
          })
          .finally(() => {
            this.$refs.menuDialog.loading = false;
          });
      } else {
        addMenu(data)
          .then((res) => {
            if (res.code === '00000') {
              this.$message.success("添加成功");
              this.$refs.menuDialog.handleCancel();
              this.handleSearch();
              this.expands.push(`${data.parentId}`);
            }
          })
          .finally(() => {
            this.$refs.menuDialog.loading = false;
          });
      }
    },
    handleCancel() {},
  }
};
</script>
