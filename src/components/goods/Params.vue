<!-- 136 -->
<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片试图区 -->
    <el-card>
      <!-- 提示框 -->
      <el-alert
        show-icon
        title="注意:只允许为第三级分类设置相关参数!"
        type="warning"
      >
      </el-alert>
      <!-- 级联选择框 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 选择商品分类级联选择框 -->
          <!-- options为数据项 -->
          <!-- props为配置对象 -->
          <el-cascader
            :options="cateList"
            :props="cateProps"
            v-model="selectedCateKeys"
            @change="handleChange"
            checkStrictly
            clearable
          >
          </el-cascader>
        </el-col>
      </el-row>
      <!-- 动/静态表格 -->
      <el-tabs
        v-model="activeName"
        @tab-click="handleClick"
      >
        <!-- 动态参数 -->
        <el-tab-pane
          label="动态参数"
          name="many"
        >
          <el-button
            type="primary"
            size="mini"
            :disabled="isDisabled"
            @click="addDialogVisible = true"
          >动态参数</el-button>
          <!-- 动态参数表格 -->
          <el-table
            :data="manyTableData"
            border
            stripe
          >
            <!-- 展开列 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item ,index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  @close="handleClose(index,scope.row)"
                >{{item}}</el-tag>
                <!-- 可编辑标签 -->
                <el-input
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  class="input-new-tag"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column
              type="index"
              label="#"
            >
            </el-table-column>
            <el-table-column
              prop="attr_name"
              label="参数名称"
            >
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditParams(scope.row)"
                >修改</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="showRemoveParams(scope.row)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 静态属性 -->
        <el-tab-pane
          label="静态属性"
          name="only"
        >
          <el-button
            type="primary"
            size="mini"
            :disabled="isDisabled"
            @click="addDialogVisible = true"
          >静态属性</el-button>
          <!-- 静态表格 -->
          <el-table
            :data="onlyTableData"
            border
            stripe
          >
            <!-- 展开列 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 展开行标签 -->
                <el-tag
                  v-for="(item ,index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  @close="handleClose(index,scope.row)"
                >{{item}}</el-tag>
                <!-- 可编辑标签 -->
                <el-input
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  class="input-new-tag"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column
              type="index"
              label="#"
            >
            </el-table-column>
            <el-table-column
              prop="attr_name"
              label="属性名称"
            >
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditParams(scope.row)"
                >修改</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="showRemoveParams(scope.row)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>

        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 对话框 -->
    <el-dialog
      :title="'添加'+titleText"
      :visible.sync="addDialogVisible"
      width="30%"
      @close="addDialogClosed"
    >
      <el-form
        ref="addFormRef"
        :model="addForm"
        :rules="addFormRules"
        label-width="80px"
      >
        <el-form-item
          :label="titleText"
          prop="attr_name"
        >
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <!-- 确认、取消 -->
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="addParams"
        >确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑对话框 -->
    <el-dialog
      :title="'修改'+titleText"
      :visible.sync="editDialogVisible"
      width="30%"
      @close="editDialogClosed"
    >
      <el-form
        ref="editFormRef"
        :model="editForm"
        :rules="editFormRules"
        label-width="80px"
      >
        <el-form-item
          :label="titleText"
          prop="attr_name"
        >
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <!-- 确认、取消 -->
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="editParams"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  mounted() {
    this.getCateList();
  },
  data() {
    return {
      // 请求过来的商品分类列表
      cateList: [],
      // 级联选择框配置对象
      cateProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
        expandTrigger: "hover",
      },
      // 级联选择框当前选中值
      selectedCateKeys: [],
      // 被激活的页签名称
      activeName: "many",
      isDisabled: true,
      // 动态参数的数据
      manyTableData: [],
      // 静态属性的数据
      onlyTableData: [],
      // 对话框显隐
      addDialogVisible: false,
      addForm: {
        attr_name: "",
      },
      addFormRules: {
        attr_name: {
          required: true,
          message: "请输入参数名称",
          trigger: "blur",
        },
      },
      editDialogVisible: false,
      editForm: {
        attr_name: "",
      },
      editFormRules: {},
      submitForm: {
        attr_id: 0,
        cat_id: "",
        attr_name: "",
      },
    };
  },
  methods: {
    // 获取所有商品分类列表
    async getCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200)
        return this.$message.error("获取商品分类列表失败!");
      this.cateList = res.data;
    },
    // 级联选择框选中项变化,会触发这个函数
    async handleChange() {
      // 判断是不是三级分类
      if (this.selectedCateKeys.length !== 3) {
        // 级联选择框置空
        this.selectedCateKeys = [];
        // 动态参数项置空
        this.manyTableData = [];
        // 静态属性项置空
        this.onlyTableData = [];
        this.isDisabled = true;
        return;
      }
      // 是三级分类就请求对应数据
      const { data: res } = await this.$http.get(
        `categories/${this.selectedCateKeys[2]}/attributes`,
        {
          params: { sel: this.activeName },
        }
      );
      if (res.meta.status !== 200)
        return this.$message.error("获取参数列表失败!");
      this.isDisabled = false;
      res.data.forEach((ele) => {
        ele.attr_vals = ele.attr_vals ? ele.attr_vals.split(" ") : [];
        ele.inputVisible = false;
        ele.inputValue = "";
      });
      if (this.activeName === "many") {
        this.manyTableData = res.data;
      } else {
        this.onlyTableData = res.data;
      }
    },
    // tabs页签的点击事件
    handleClick() {
      this.handleChange();
    },
    // 监听对话框的关闭
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    async addParams() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          `categories/${this.selectedCateKeys[2]}/attributes`,
          {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName,
          }
        );
        if (res.meta.status !== 201) return this.$message.error("添加失败!");
        this.$message.success({
          message: "添加信息成功!",
          duration: 800,
        });
        this.addDialogVisible = false;
        this.handleChange();
      });
    },
    // 点击显示修改对话框
    showEditParams(data) {
      // 对话框显示
      this.editDialogVisible = true;
      // 把scope.row的值传给submitForm,供给editParams提交修改时使用
      this.submitForm.attr_id = data.attr_id;
      this.submitForm.cat_id = data.cat_id;
      // 输入框默认为当前选中项的值
      this.editForm.attr_name = data.attr_name;
    },
    async showRemoveParams(data) {
      const confirmResult = await this.$confirm(
        `此操作将永久删除该${this.titleText}(${data.attr_name})，是否继续?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmResult !== "confirm") return;
      const { data: res } = await this.$http.delete(
        `categories/${data.cat_id}/attributes/${data.attr_id}`
      );
      if (res.meta.status !== 200) return this.$message.error("删除参数失败!");
      this.$message.success({
        message: "删除参数成功!",
        duration: 800,
      });
      this.handleChange();
    },
    editDialogClosed() {},
    editParams() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.put(
          `categories/${this.submitForm.cat_id}/attributes/${this.submitForm.attr_id}`,
          {
            attr_name: this.editForm.attr_name,
            attr_sel: this.activeName,
          }
        );
        if (res.meta.status !== 200)
          return this.$message.error("修改参数失败!");
        this.$message.success({
          message: "修改参数成功!",
          duration: 800,
        });
        this.editDialogVisible = false;
        this.handleChange();
      });
    },
    // 文本框失去焦点.或者按下Enter都会触发
    async handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputVisible = false;
        row.inputValue = "";
        return;
      }
      // 把添加后的值push到attr_vals数组中,trim()为删除多余的空格
      row.attr_vals.push(row.inputValue.trim());
      // 取消输入框状态
      row.inputVisible = false;
      // 清空默认输入值
      row.inputValue = "";
      // 发送修改请求
      this.saveAttrVals(row);
    },
    // 点击显示编辑框
    showInput(row) {
      row.inputVisible = true;
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    // 将对attr_vals的操作保存到数据库
    async saveAttrVals(row) {
      const { data: res } = await this.$http.put(
        `categories/${row.cat_id}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: this.activeName,
          attr_vals: row.attr_vals.join(" "),
        }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("修改标签失败!");
      }
      this.$message.success({
        message: "修改标签成功!",
        duration: 800,
      });
    },
    handleClose(index, row) {
      row.attr_vals.splice(index, 1);
      // 发送修改请求
      this.saveAttrVals(row);
    },
  },
  computed: {
    // 动态计算标题的文本
    titleText() {
      if (this.activeName === "many") {
        return "动态参数";
      }
      return "静态属性";
    },
  },
};
</script>

<style scoped lang="less">
.cat_opt {
  margin: 15px 0;
}
.el-tag {
  margin: 10px;
}
.input-new-tag,
.button-new-tag {
  margin-left: 5px;
}
.input-new-tag {
  width: 120px;
}
</style>
