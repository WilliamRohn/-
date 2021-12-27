<template>
  <div>
    <!-- 头部面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card class="box-card">
      <el-button
        type="primary"
        @click=""
      >添加角色</el-button>
      <!-- 索引列 -->
      <el-table
        :data="rolesList"
        border
        stripe
      >
        <!-- expand展开列 -->
        <el-table-column
          type="expand"
          width="80"
        >
          <template slot-scope="scope">
            <el-row
              :class="['bdbottom',i1===0?'bdtop':'','vcenter']"
              v-for="(item1,i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag
                  closable
                  @close="removeRightById(scope.row,item1.id)"
                >
                  {{item1.authName}}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级权限 -->
              <el-col :span="19">
                <el-row
                  v-for="(item2,i2) in item1.children"
                  :key="item2.id"
                  :class="[i2===0?'':'bdtop','vcenter']"
                >
                  <el-col :span="6">
                    <el-tag
                      closable
                      type="success"
                      @close="removeRightById(scope.row,item2.id)"
                    >
                      {{item2.authName}}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级权限 -->
                  <el-col :span="18">
                    <el-tag
                      closable
                      type="warning"
                      v-for="(item3,i3) in item2.children"
                      :key="item3.id"
                      @close="removeRightById(scope.row,item3.id)"
                    >
                      {{item3.authName}}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column
          width="80"
          type="index"
          label="#"
        ></el-table-column>
        <el-table-column
          label="角色名称"
          prop="roleName"
        ></el-table-column>
        <el-table-column
          label="角色描述"
          prop="roleDesc"
        ></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
            >编辑</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
            >删除</el-button>
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="showSetRightDialog(scope.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
      </el-pagination>
    </el-card>
    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="SetRightDialogClosed"
    >
      <el-tree
        :data="rightsList"
        :props="treeProps"
        show-checkbox
        default-expand-all
        :default-checked-keys="defKeys"
        node-key="id"
        ref="treeRef"
      ></el-tree>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="setRightDialogVisible = false">
          取 消
        </el-button>
        <el-button
          type="primary"
          @click="roleRights"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  created() {
    // 调用获取所有权限列表
    this.getRolesList();
  },
  data() {
    return {
      rolesList: [],
      // 控制分配权限对话框的显隐
      setRightDialogVisible: false,
      rightsList: [],
      // 树形控件
      treeProps: {
        label: "authName",
        children: "children",
      },
      // 默认选中的节点(里面为三级权限的id)
      defKeys: [],
      roleId: "",
    };
  },
  methods: {
    async getRolesList() {
      const { data: res } = await this.$http.get(`roles`);
      if (res.meta.status !== 200)
        return this.$message.error("获取角色列表失败!");
      this.rolesList = res.data;
    },
    // 根据ID删除角色
    async removeRightById(role, rightId) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该权限，是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmResult !== "confirm") return;
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      );
      if (res.meta.status !== 200)
        return this.$message.error("删除角色权限失败!");
      role.children = res.data;
      this.$message.success({
        message: "成功删除!",
        duration: 800,
      });
    },
    // 展示当前角色权限
    async showSetRightDialog(role) {
      this.roleId = role.id;
      const { data: res } = await this.$http.get(`rights/tree`);
      if (res.meta.status !== 200)
        return this.$message.error("获取权限数据失败!");
      this.rightsList = res.data;
      this.setRightDialogVisible = true;
      this.digui(role, this.defKeys);
    },
    // 通过递归获取当前角色的所有三级权限id并保存到defKeys数组中
    digui(node, arr) {
      // 是否是三级权限节点,如果没有children就是三级权限,把id放到数组里
      if (!node.children) return arr.push(node.id);
      node.children.forEach((ele) => {
        this.digui(ele, arr);
      });
    },
    // 监听分配权限对话框的关闭
    SetRightDialogClosed() {
      this.defKeys = [];
    },
    // 提交更新后的角色权限
    async roleRights() {
      // 封装权限ID列表
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ].join(",");
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        {
          rids: keys,
        }
      );
      if (res.meta.status !== 200)
        return this.$message.error("更改角色权限失败!");
      this.getRolesList();
      this.$message.success({
        message: "更改角色权限成功!",
        duration: 800,
      });
      this.setRightDialogVisible = false;
    },
  },
  mounted() {},
  components: {},
};
</script>

<style scoped lang="less">
.el-table /deep/ .cell {
  text-align: center;
}
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.el-table td.el-table__cell > div {
  margin: 0 5%;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
