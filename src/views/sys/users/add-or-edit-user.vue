<template>
  <el-dialog
    :close-on-click-modal="false"
    :title="title()"
    :visible.sync="visibvle"
    width="500px"
    @close="handleCancel"
  >
    <el-form :model="form" :rules="userRules" ref="userForm" v-loading="loading">
      <el-form-item label="部门" :label-width="formLabelWidth" prop="orgId">
        <el-select v-model="form.orgId" placeholder="请选择部门" filterable style="width: 100%">
          <el-option
            v-for="item in orgOptions"
            :key="item.id"
            :label="item.orgName"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="姓名" :label-width="formLabelWidth" prop="userName">
        <el-input v-model="form.userName" placeholder="请输入姓名"></el-input>
      </el-form-item>
      <el-form-item label="登录名" :label-width="formLabelWidth" prop="loginName">
        <el-input v-model="form.loginName" placeholder="请输入登录名"></el-input>
      </el-form-item>
      <el-form-item label="登录密码" :label-width="formLabelWidth" prop="loginPwd" v-if="!isEdit">
        <el-input v-model="form.loginPwd" placeholder="请输入登录密码" show-password></el-input>
      </el-form-item>
      <el-form-item label="手机号" :label-width="formLabelWidth" prop="phoneNum">
        <el-input v-model="form.phoneNum" placeholder="请输入手机号"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" :label-width="formLabelWidth" prop="userEmail">
        <el-input v-model="form.userEmail" placeholder="请输入邮箱"></el-input>
      </el-form-item>
      <el-form-item label="生日" :label-width="formLabelWidth" prop="birthDate">
        <el-date-picker
          style="width: 100%"
          v-model="form.birthDate"
          type="date"
          placeholder="请选择生日"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取 消</el-button>
      <el-button type="primary" @click="handleConfirm" :loading="loading">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { fetchUser, fetchOrgList } from "@/api/user";
export default {
  name: "AddOrEditUser",
  data() {
    return {
      loading: false,
      isEdit: false,
      visibvle: false,
      form: {
        orgId: "",
        userName: "",
        loginName: "",
        loginPwd: "",
        phoneNum: "",
        userEmail: "",
        birthDate: ""
      },
      orgOptions: [],
      formLabelWidth: "100px",
      userRules: {
        orgId: [{ required: true, message: "请选择部门", trigger: "change" }],
        userName: [
          { required: true, message: "请输入姓名", trigger: "blur" },
          {
            min: 1,
            max: 20,
            message: "姓名长度在 1 到 20 个字符",
            trigger: "blur"
          }
        ],
        loginName: [
          { required: true, message: "请输入登录名", trigger: "blur" },
          {
            min: 5,
            max: 20,
            message: "登录名长度在 5 到 20 个字符",
            trigger: "blur"
          }
        ],
        loginPwd: [
          { required: true, message: "请输入登录密码", trigger: "blur" }
        ],
        phoneNum: [
          { required: true, message: "请输入手机号", trigger: "blur" }
        ],
        userEmail: [],
        birthDate: [{ required: true, message: "请输入生日", trigger: "blur" }]
      }
    };
  },
  mounted() {
    fetchOrgList().then(res => {
      if (res.code === '00000') {
        this.orgOptions = res.data;
      }
    });
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
      fetchUser(data.userNum)
        .then(res => {
          if (res.code === '00000') {
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
      this.$refs.userForm.resetFields();
    },
    handleConfirm() {
      this.$refs.userForm.validate(valid => {
        if (!valid) {
          return false;
        } else {
          this.$emit("ok", this.isEdit, this.form);
        }
      });
    },
    title() {
      return (this.isEdit ? "编辑" : "添加") + "用户";
    }
  }
};
</script>

<style>
</style>