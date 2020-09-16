<template>
  <el-dialog
    :close-on-click-modal="false"
    :title="title()"
    :visible.sync="visibvle"
    width="500px"
    @close="handleCancel"
  >
    <el-form :model="form" :rules="menuRules" ref="menuForm" v-loading="loading">
      <el-form-item label="菜单类型" :label-width="formLabelWidth" prop="menuClass">
        <el-select
          style="width: 100%"
          v-model="form.menuClass"
          placeholder="请选择菜单类型"
          @change="handleSelectMenuClass"
          :disabled="isEdit"
        >
          <el-option
            v-for="item in menuOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="form.menuClass != 1"
        label="上级菜单"
        :label-width="formLabelWidth"
        prop="parentId"
      >
        <el-cascader
          style="width: 100%"
          :options="menuListOptions"
          :show-all-levels="false"
          v-model="form.parentId"
          :props="{ checkStrictly: true, label: 'menuName', value: 'id', emitPath: false }"
          clearable
        ></el-cascader>
      </el-form-item>
      <el-form-item label="菜单名" :label-width="formLabelWidth" prop="menuName">
        <el-input v-model="form.menuName" placeholder="请输入菜单名"></el-input>
      </el-form-item>
      <el-form-item
        v-if="form.menuClass !== 3"
        label="菜单路径"
        :label-width="formLabelWidth"
        prop="menuPath"
      >
        <el-input v-model="form.menuPath" placeholder="请输入菜单路径"></el-input>
      </el-form-item>
      <el-form-item
        v-if="form.menuClass === 2"
        label="组件地址"
        :label-width="formLabelWidth"
        prop="menuComponent"
      >
        <el-input v-model="form.menuComponent" placeholder="请输入组件地址"></el-input>
      </el-form-item>
      <el-form-item
        v-if="form.menuClass === 1"
        label="重定向路径"
        :label-width="formLabelWidth"
        prop="menuRedirect"
      >
        <el-input v-model="form.menuRedirect" placeholder="请输入重定向路径"></el-input>
      </el-form-item>
      <el-form-item label="菜单图标" :label-width="formLabelWidth" prop="menuIcon">
        <el-input v-model="form.menuIcon" placeholder="请输入菜单图标"></el-input>
      </el-form-item>
      <el-form-item
        v-if="form.menuClass === 3"
        label="权限标记"
        :label-width="formLabelWidth"
        prop="menuMark"
      >
        <el-input v-model="form.menuMark" placeholder="请输入权限标记"></el-input>
      </el-form-item>
      <el-form-item label="菜单描述" :label-width="formLabelWidth" prop="menuDesc">
        <el-input v-model="form.menuDesc" placeholder="请输入菜单描述"></el-input>
      </el-form-item>
      <el-form-item label="显示排序号" :label-width="formLabelWidth" prop="menuSort">
        <el-input-number style="width: 100%" v-model="form.menuSort" label="请输入显示排序号"></el-input-number>
      </el-form-item>
      <el-form-item label="是否隐藏" :label-width="formLabelWidth" prop="isHidden">
        <el-switch
          v-model="form.isHidden"
          active-color="#13ce66"
          inactive-color="#ff4949"
          :active-value="1"
          :inactive-value="0"
        ></el-switch>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取 消</el-button>
      <el-button type="primary" @click="handleConfirm" :loading="loading">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { fetchMenu, fetchMenuList } from "@/api/menu";
export default {
  name: "AddOrEditMenu",
  data() {
    return {
      menuListOptions: [],
      loading: false,
      isEdit: false,
      visibvle: false,
      form: {
        parentId: undefined,
        menuName: undefined,
        menuPath: undefined,
        menuRedirect: undefined,
        menuComponent: undefined,
        menuMark: undefined,
        menuClass: 2,
        menuDesc: undefined,
        menuSort: 1,
        isHidden: 0,
        menuIcon: undefined,
      },
      menuOptions: [
        {
          value: 1,
          label: "目录",
        },
        {
          value: 2,
          label: "菜单",
        },
        {
          value: 3,
          label: "按钮",
        },
      ],
      formLabelWidth: "100px",
      menuRules: {
        parentId: [
          { required: true, message: "请选择上级菜单", trigger: "change" },
          { type: "number", message: "无效的上级菜单", trigger: "change" },
        ],
        menuName: [
          { required: true, message: "请输入菜单名", trigger: "blur" },
          {
            min: 2,
            max: 10,
            message: "菜单名长度在2-10个字符",
            trigger: "blur",
          },
        ],
        menuPath: [
          { required: true, message: "请输入菜单路径", trigger: "blur" },
          {
            min: 2,
            max: 50,
            message: "菜单路径长度在2-50个字符",
            trigger: "blur",
          },
        ],
        menuComponent: [
          { required: true, message: "请输入组件地址", trigger: "blur" },
          {
            min: 2,
            max: 50,
            message: "组件地址长度在2-50个字符",
            trigger: "blur",
          },
        ],
        menuRedirect: [
          { required: true, message: "请输入重定向路径", trigger: "blur" },
          {
            min: 2,
            max: 50,
            message: "重定向路径长度在2-50个字符",
            trigger: "blur",
          },
        ],
        menuIcon: [
          { required: true, message: "请输入菜单图标", trigger: "blur" },
          {
            min: 2,
            max: 50,
            message: "菜单图标长度在2-50个字符",
            trigger: "blur",
          },
        ],
        menuMark: [
          { required: true, message: "请输入菜单标记", trigger: "blur" },
          {
            min: 2,
            max: 50,
            message: "菜单标记长度在2-50个字符",
            trigger: "blur",
          },
        ],
        menuClass: [
          {
            required: true,
            message: "请输入菜单类型（1目录2菜单3按钮）",
            trigger: "change",
          },
          { type: "number", message: "无效的菜单类型", trigger: "change" },
        ],
        menuDesc: [
          { required: true, message: "请输入菜单描述", trigger: "blur" },
          {
            min: 2,
            max: 50,
            message: "菜单描述长度在2-50个字符",
            trigger: "blur",
          },
        ],
        menuSort: [
          { required: true, message: "请输入显示排序号", trigger: "blur" },
        ],
        isHidden: [
          {
            required: true,
            message: "请输入是否隐藏（1隐藏0显示）",
            trigger: "blur",
          },
        ],
      },
    };
  },
  mounted() {
    this.handleSearch();
  },
  methods: {
    handleSelectMenuClass(menuClass) {
      this.$refs.menuForm.resetFields();
      switch (menuClass) {
        case 1:
          this.form.parentId = 0;
          break;
        case 2:
          this.form.parentId = null;
          break;
        case 3:
          this.form.parentId = null;
          break;
      }
    },
    handleSearch() {
      fetchMenuList().then((res) => {
        if (res.code === "00000") {
          this.menuListOptions = res.data;
        }
      });
    },
    add() {
      this.isEdit = false;
      this.visibvle = true;
    },
    edit(data) {
      this.isEdit = true;
      this.visibvle = true;
      this.loading = true;
      fetchMenu(data.id)
        .then((res) => {
          if (res.code === "00000") {
            this.form = Object.assign({}, this.form, res.data);
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    handleCancel() {
      this.visibvle = false;
      this.$emit("cancel");
      this.$refs.menuForm.resetFields();
    },
    handleConfirm() {
      this.$refs.menuForm.validate((valid) => {
        if (!valid) {
          return false;
        } else {
          this.$emit("ok", this.isEdit, this.form);
          this.handleSearch();
        }
      });
    },
    title() {
      return (this.isEdit ? "编辑" : "添加") + "系统菜单";
    },
  },
};
</script>

<style>
</style>
