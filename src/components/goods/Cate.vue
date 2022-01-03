<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button
            type="primary"
            @click="showAddCateDialog"
          >添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 树表 -->
      <tree-table
        :data="catelist"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
      >
        <!-- 是否有效列 -->
        <template
          slot="isok"
          slot-scope="scope"
        >
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color:lightgreen;"
          ></i>
          <i
            class="el-icon-error"
            style="color:red;"
            v-else
          ></i>
        </template>
        <!-- 排序列 -->
        <template
          slot="sort"
          slot-scope="scope"
        >
          <el-tag
            size="small"
            v-if="scope.row.cat_level === 0"
          >一级</el-tag>
          <el-tag
            type="success"
            size="small"
            v-else-if="scope.row.cat_level === 1"
          >二级</el-tag>
          <el-tag
            type="warning"
            size="small"
            v-else-if="scope.row.cat_level === 2"
          >三级</el-tag>
        </template>
        <!-- 操作列 -->
        <template
          slot="opt"
          slot-scope="scope"
        >
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="showEditDialog(scope.row)"
          >编辑</el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="removeCateById(scope.row.cat_id)"
          >删除</el-button>
        </template>
      </tree-table>
      <!-- 分页区 -->
      <!-- size-change和current-change事件来处理页码大小和当前页变动时候触发的事件 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="35%"
      @close="addCateDialogClosed"
    >
      <div class="addCateDialog">
        <!-- 分配角色框信息 -->
        <el-form
          :model="addCateForm"
          :rules="addCateFormRules"
          ref="addCateFormRef"
          label-width="100px"
        >
          <el-form-item
            label="分类名称："
            prop="cat_name"
          >
            <el-input v-model="addCateForm.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类：">
            <!-- options为数据项 -->
            <!-- props为配置对象 -->
            <el-cascader
              expand-trigger="hover"
              :options="parentCateList"
              :props="cascaderProps"
              v-model="selectedKeys"
              @change="parentCateChanged"
              checkStrictly
              clearable
            >
            </el-cascader>
          </el-form-item>
        </el-form>
      </div>
      <!-- 确认、取消 -->
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="saveCateInfo"
        >确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑分类对话框 -->
    <el-dialog
      title="编辑分类"
      :visible.sync="editCateDialogVisible"
      width="35%"
      @close="editCateDialogClosed"
    >
      <div class="editCateDialog">
        <!-- 分配角色框信息 -->
        <el-form
          :model="editCateForm"
          :rules="editCateFormRules"
          ref="addCateFormRef"
          label-width="100px"
          hide-required-asterisk
        >
          <el-form-item
            label="分类名称："
            prop="cat_name"
          >
            <el-input v-model="editCateForm.cat_name"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <!-- 确认、取消 -->
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="saveCateName"
        >确 定</el-button>
      </span>
    </el-dialog>
    <!-- 删除分类对话框 -->
    <el-dialog>

    </el-dialog>
  </div>
</template>

<script>
export default {
  created() {
    this.getCateList();
  },
  mounted() {},
  data() {
    return {
      // 商品分类的数据列表
      catelist: [],
      //获取用户列表参数对象
      queryInfo: {
        type: 3,
        // 当前的页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 5,
      },
      total: 0,
      // tree-table每一列的数据
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
        },
        {
          label: "是否有效",
          type: "template",
          template: "isok",
        },
        {
          label: "排序",
          type: "template",
          template: "sort",
        },
        {
          label: "操作",
          type: "template",
          template: "opt",
        },
      ],
      addCateDialogVisible: false,
      // 添加分类的表单数据对象
      addCateForm: {
        // 将要添加的分类名称
        cat_name: "",
        // 父类分类的ID
        cat_pid: "",
        // 分类的等级,默认添加的是1级分类
        cat_level: 0,
      },
      // 添加分类表单的验证规则
      addCateFormRules: {
        cat_name: [
          {
            required: true,
            message: "请输入分类名称",
            trigger: "blur",
          },
        ],
      },
      // 父级分类的列表
      parentCateList: [],
      // 指定级联选择器的配置对象
      cascaderProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      // 选中的父级分类的ID数组
      selectedKeys: [],
      editCateDialogVisible: false,
      editCateForm: {
        cat_id: 0,
        cat_name: "",
      },
      editCateFormRules: {
        cat_name: [
          {
            required: true,
            message: "请输入分类名称",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200)
        return this.$message.error("获取商品分类列表失败!");
      this.catelist = res.data.result;
      this.total = res.data.total;
    },
    // 监听当前的页码大小
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getCateList();
    },
    // 监听当前页面变动时候触发的事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getCateList();
    },
    // 分类对话框的显示
    showAddCateDialog() {
      // 获取父级分类数据
      this.getParentsCateDialog();
      this.addCateDialogVisible = true;
    },
    // 获取父级分类数据
    async getParentsCateDialog() {
      const { data: res } = await this.$http.get("categories", {
        params: { type: 2 },
      });
      if (res.meta.status !== 200)
        return this.$message.error("获取父级分类数据失败!");
      this.parentCateList = res.data;
    },
    // 选择项发生变化后触发的函数
    parentCateChanged() {
      // 如果选中值(数组)为长度大于0
      if (this.selectedKeys.length > 0) {
        // 添加分类的表单数据对象的id为选中数组的最后一项
        this.addCateForm.cat_pid =
          this.selectedKeys[this.selectedKeys.length - 1];
        // 添加分类的表单数据对象的等级为所选数组长度
        this.addCateForm.cat_level = this.selectedKeys.length;
        return;
      } else {
        this.addCateForm.cat_pid = 0;
        this.addCateForm.cat_level = 0;
      }
    },
    // 点击提交添加分类的信息
    async saveCateInfo() {
      this.$refs.addCateFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          "categories",
          this.addCateForm
        );
        if (res.meta.status !== 201)
          return this.$message.error("添加分类失败!");
        this.$message.success({
          message: "添加分类成功!",
          duration: 800,
        });
        this.getCateList();
        this.addCateDialogVisible = false;
      });
    },
    // 监听分类对话框关闭,重置表单
    addCateDialogClosed() {
      this.$refs.addCateFormRef.resetFields();
      this.selectedKeys = [];
      this.addCateForm.cat_pid = 0;
      this.addCateForm.cat_level = 0;
    },
    showEditDialog(data) {
      this.editCateDialogVisible = true;
      this.editCateForm.cat_id = data.cat_id;
    },
    editCateDialogClosed() {
      this.$refs.addCateFormRef.resetFields();
    },
    async saveCateName() {
      const { data: res } = await this.$http.put(
        `categories/${this.editCateForm.cat_id}`,
        { cat_name: this.editCateForm.cat_name }
      );
      if (res.meta.status !== 200) return;
      this.$message.success({
        message: "更改分类名称成功!",
        duration: 800,
        onClose: () => {
          this.getCateList();
          this.editCateDialogVisible = false;
        },
      });
    },
    async removeCateById(id) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该分类，是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmResult !== "confirm") return;
      const { data: res } = await this.$http.delete(`categories/${id}`);
      this.$message.success({
        message: "成功删除分类!",
        duration: 800,
      });
      this.getCateList();
    },
  },
  components: {},
  props: {},
};
</script>

<style scoped lang="less">
.el-pagination {
  margin-top: 20px;
}
.el-card /deep/ .el-row {
  margin-bottom: 20px;
}
.el-cascader {
  width: 100%;
}
/deep/ .el-dialog__body {
  padding: 20px;
}
/deep/ .el-dialog__footer {
  padding: 0px 20px 20px;
}
</style>
