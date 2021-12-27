<template>
  <div id="user">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card class="box-card">
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input
            placeholder="请输入内容"
            class="input-with-select"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button
            type="primary"
            @click="addDialogVisible = true"
          >添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区 -->
      <el-table
        :data="userList"
        border
        stripe
      >
        <el-table-column
          type="index"
          label="#"
        ></el-table-column>
        <el-table-column
          prop="username"
          label="姓名"
        ></el-table-column>
        <el-table-column
          prop="email"
          label="邮箱"
        ></el-table-column>
        <el-table-column
          prop="mobile"
          label="电话"
        ></el-table-column>
        <el-table-column
          prop="role_name"
          label="角色"
        ></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="userStateChange(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template
            slot-scope="scope"
            id="op"
          >
            <el-tooltip
              effect="dark"
              content="编辑"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="showEditDialog(scope.row.id)"
              >
              </el-button>
            </el-tooltip>
            <el-tooltip
              effect="dark"
              content="删除"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="removeUsersById(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="setRole(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加用户对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <el-form
        label-width="70px"
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        hide-required-asterisk
      >
        <el-form-item
          label="用户名:"
          prop="username"
        >
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item
          label="密码:"
          prop="password"
        >
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item
          label="邮箱:"
          prop="email"
        >
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item
          label="手机:"
          prop="mobile"
        >
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 对话框底部区域 -->
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="addUser"
        >确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="35%"
    >
      <!-- 修改框信息 -->
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="70px"
      >
        <el-form-item
          label="用户名"
          prop="username"
        >
          <el-input
            v-model="editForm.username"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item
          label="邮箱"
          prop="email"
        >
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item
          label="手机"
          prop="mobile"
        >
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 确认取消按钮 -->
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="editUserInfo"
        >确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色对话框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="setRoleDialogVisible"
      width="35%"
      @close="setRoleDialogClosed"
    >
      <div class="setroledialog">
        <!-- 分配角色框信息 -->
        <p>当前的用户：{{setRoleInfo.username}}</p>
        <p>当前的角色：{{setRoleInfo.role_name}}</p>
        <p>分配新角色：
          <el-select
            v-model="selectRoleId"
            placeholder="请选择"
          >
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </p>
        <!-- 确认取消按钮 -->
        <span
          slot="footer"
          class="dialog-footer"
        >
          <el-button @click="setRoleDialogVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="saveRoleInfo"
          >确 定</el-button>
        </span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  created() {
    this.getUserList();
  },
  data() {
    var checkEmail = (rule, value, cb) => {
      const regEmail =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (regEmail.test(value)) {
        return cb();
      }
      cb(new Error("请输入合法的邮箱!"));
    };
    var checkMobile = (rule, value, cb) => {
      const regMobile =
        /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[189]))\d{8}$/;
      if (regMobile.test(value)) {
        return cb();
      }
      cb(new Error("请输入合法的手机号!"));
    };
    return {
      //获取用户列表参数对象
      queryInfo: {
        query: "",
        // 当前的页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 5,
      },
      userList: [],
      // 用户总数
      total: 0,
      // 控制添加用户对话框的显隐
      addDialogVisible: false,
      // 添加用户信息参数对象
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      // 添加用户输入框规则
      addFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 5,
            max: 8,
            message: "长度在 5 到 8 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "长度在 6 到 15 个字符",
            trigger: "blur",
          },
        ],
        email: [
          { required: true, message: "请输入正确邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入正确手机", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
      },
      // 控制修改用户对话框显隐
      editDialogVisible: false,
      // 编辑用户信息参数对象
      editForm: {},
      // 编辑用户输入框规则
      editFormRules: {
        email: [
          { required: true, message: "请输入正确邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入正确手机", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
      },
      setRoleDialogVisible: false,
      // 需要被分配角色的用户信息
      setRoleInfo: {},
      // 所有角色的数据列表
      rolesList: [],
      // el-select当前选中的数值
      selectRoleId: "",
    };
  },
  methods: {
    // 获取所有用户列表
    async getUserList() {
      const { data: res } = await this.$http.get("users", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取用户列表失败!");
      } else {
        // this.$message.success({
        //   message: "获取用户列表成功!",
        //   showClose: true,
        //   duration: 700,
        // });
        this.userList = res.data.users;
        this.total = res.data.total;
      }
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getUserList();
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getUserList();
    },
    async userStateChange(userinfo) {
      const { data: res } = await this.$http.put(
        `users/${userinfo.id}/state/${userinfo.mg_state}`
      );
      if (res.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state;
        return this.$message.error("更新用户状态失败!");
      } else {
        this.$message.success({
          message: "更新用户状态成功!",
          showClose: true,
          duration: 700,
        });
      }
    },
    // 监听添加用户对话框的关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    addUser() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post("users", this.addForm);
        if (res.meta.status !== 201) {
          this.$message.error("添加用户失败!");
        }
        this.$message.success("添加用户成功!");
        // 关闭添加用户的对话框
        this.addDialogVisible = false;
        // 重新获取用户列表;
        this.getUserList();
      });
    },
    // 展示编辑用户的对话框
    async showEditDialog(id) {
      let { data: res } = await this.$http.get(`users/${id}`);
      this.editForm = res.data;
      this.editDialogVisible = true;
    },
    // 用户表单验证
    editUserInfo() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return;
        let { data: res } = await this.$http.put(`users/${this.editForm.id}`, {
          email: this.editForm.email,
          mobile: this.editForm.mobile,
        });
        if (res.meta.status !== 200)
          return this.$message.error("修改用户信息失败!");
        this.$message.success({
          message: "获取用户列表成功!",
          duration: 500,
        });
        this.getUserList();
        this.editDialogVisible = false;
      });
    },
    // 根据id删除用户信息
    async removeUsersById(id) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该用户，是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmResult !== "confirm") return;
      const { data: res } = await this.$http.delete(`users/${id}`);
      this.$message.success({
        message: "成功删除用户!",
        duration: 800,
      });
      this.getUserList();
      console.log(res);
    },
    // 点击分配角色
    async setRole(userinfo) {
      // 先获取当前点击的用户的角色信息
      this.setRoleInfo = userinfo;
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200)
        return this.$message.error("获取角色列表失败!");
      this.rolesList = res.data;
      this.setRoleDialogVisible = true;
    },
    // 点击确认后提交数据分配角色
    async saveRoleInfo() {
      // 如果当前用户未更换角色,关闭对话框
      if (!this.selectRoleId) return (this.setRoleDialogVisible = false);
      const { data: res } = await this.$http.put(
        `users/${this.setRoleInfo.id}/role`,
        { rid: this.selectRoleId }
      );
      if (res.meta.status !== 200)
        return this.$message.error("更新用户的角色列表失败!");
      this.$message.success({
        message: "更新用户的角色列表成功!",
        duration: 800,
      });
      this.getUserList();
      this.setRoleDialogVisible = false;
    },
    // 监听角色分配对话框的关闭
    setRoleDialogClosed() {
      this.setRoleInfo = [];
      this.selectRoleId = "";
    },
  },
  mounted() {},
  components: {},
};
</script>

<style scoped lang="less">
#op {
  display: flex !important;
}
.el-pagination {
  margin-top: 15px;
}
.setroledialog {
  margin: 0 20px;
}
</style>
