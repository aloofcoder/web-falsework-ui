<template>
  <el-dialog :title="title()" :visible.sync="visibvle" width="500px" @close="handleCancel">
    <el-form :model="form" :rules="roleRules" ref="roleForm" v-loading="loading">
      <el-form-item label="角色名" :label-width="formLabelWidth" prop="roleName">
        <el-input v-model="form.roleName" placeholder="请输入角色名"></el-input>
      </el-form-item>
      <el-form-item label="角色标记" :label-width="formLabelWidth" prop="roleMark">
        <el-input v-model="form.roleMark" placeholder="请输入角色标记"></el-input>
      </el-form-item>
      <el-form-item label="角色描述" :label-width="formLabelWidth" prop="roleDesc">
        <el-input v-model="form.roleDesc" placeholder="请输入角色描述"></el-input>
      </el-form-item>
      <el-form-item label="排序号" :label-width="formLabelWidth" prop="roleSort">
        <el-input-number style="width: 100%" v-model="form.roleSort" label="请输入排序号"></el-input-number>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取 消</el-button>
      <el-button type="primary" @click="handleConfirm" :loading="loading">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { fetchRole } from "@/api/role";
export default {
  name: "AddOrEditRole",
  data() {
    return {
      loading: false,
      isEdit: false,
      visibvle: false,
      form: {
        roleName: "",
        roleMark: "",
        roleDesc: "",
        roleSort: "",
        status: "",
      },
      formLabelWidth: "100px",
      roleRules: {
        roleName: [
          { required: true, message: "请输入角色名", trigger: "blur" },
        ],
        roleMark: [
          { required: true, message: "请输入角色标记", trigger: "blur" },
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" },
        ],
        roleSort: [
          { required: true, message: "请输入排序号", trigger: "blur" },
        ],
        status: [
          {
            required: true,
            message: "请输入状态(1正常2禁用)",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    add() {
      this.isEdit = false;
      this.visibvle = true;
    },
    edit(data) {
      this.isEdit = true;
      this.visibvle = true;
      this.loading = true;
      fetchRole(data.roleId)
        .then((res) => {
          if (res.code === 0) {
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
      this.$refs.roleForm.resetFields();
    },
    handleConfirm() {
      this.$refs.roleForm.validate((valid) => {
        if (!valid) {
          return false;
        } else {
          this.$emit("ok", this.isEdit, this.form);
        }
      });
    },
    title() {
      return (this.isEdit ? "编辑" : "添加") + "";
    },
  },
};
</script>

<style>
</style>
