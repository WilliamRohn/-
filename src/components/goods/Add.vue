<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 提示区域 -->
      <el-alert
        title="消息提示的文案"
        type="info"
        show-icon
        center
        :closable="false"
      >
      </el-alert>
      <!-- 步骤条 -->
      <el-steps
        :space="200"
        :active='activeIndex-0'
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- 添加表单 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-position='top'
      >
        <!-- 竖向tab栏 -->
        <el-tabs
          :tab-position="
        'left'"
          v-model="activeIndex"
          :before-leave="beforeTabLeave"
          @tab-click="tabClicked"
        >
          <el-tab-pane
            label="基本信息"
            name="0"
          >
            <el-form-item
              label="商品名称:"
              prop="goods_name"
            >
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item
              label="商品价格:"
              prop="goods_price"
            >
              <el-input
                v-model="addForm.goods_price"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="商品重量:"
              prop="goods_weight"
            >
              <el-input
                v-model="addForm.goods_weight"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="商品数量:"
              prop="goods_number"
            >
              <el-input
                v-model="addForm.goods_number"
                type="number"
              ></el-input>
            </el-form-item>
            <el-row class="cat_opt">
              <!-- 选择商品分类级联选择框 -->
              <!-- options为数据项 -->
              <!-- props为配置对象 -->
              <el-form-item
                label="商品分类:"
                prop="goods_cat"
              >
                <el-cascader
                  :options="cateList"
                  :props="cateProps"
                  v-model="addForm.goods_cat"
                  @change="handleChange"
                  checkStrictly
                  clearable
                >
                </el-cascader>
              </el-form-item>
            </el-row>
          </el-tab-pane>
          <el-tab-pane
            label="商品参数"
            name="1"
          >
            <el-form-item
              v-for="item in manyTableData"
              :label="item.attr_name"
              :key="item.attr_id"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  :label="cb"
                  v-for="(cb,i) in item.attr_vals"
                  :key="i"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane
            label="商品属性"
            name="2"
          >
            <el-form-item
              v-for="item in onlyTableData"
              :label="item.attr_name"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane
            label="商品图片"
            name="3"
          >
            <!-- 上传图片 -->
            <el-upload
              :action="uploadUrl"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerObj"
              :on-success="handleSuccess"
            >
              <el-button
                size="small"
                type="primary"
              >点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane
            label="商品内容"
            name="4"
          >
            <!-- 富文本编辑器组件 -->
            <quill-editor v-model="addForm.goods_introduce">
            </quill-editor>
            <el-button
              type="primary"
              class="btnadd"
              @click="add"
            >添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 点击预览对话框 -->
    <el-dialog
      title="预览图"
      :visible.sync="previewVisible"
      width="50%"
    >
      <span></span>
      <img
        :src="previewPath"
        class="previewImg"
      >
    </el-dialog>
  </div>
</template>

<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

import { quillEditor } from "vue-quill-editor";

export default {
  created() {
    this.getCateList();
  },
  data() {
    return {
      activeIndex: "0",
      addForm: {
        goods_name: "",
        goods_price: "",
        goods_weight: "",
        goods_number: "",
        // 级联选择框当前选中值(商品所属的分类数组)
        goods_cat: [],
        pics: [],
        // 商品的详细描述
        goods_introduce: "",
        attrs: [],
      },
      copyaddForm: {
        goods_cat: [],
      },
      addFormRules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" },
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" },
        ],
        goods_number: [
          { required: true, message: "请输入商品分类", trigger: "blur" },
        ],
      },
      // 请求过来的商品分类列表
      cateList: [],
      // 级联选择框配置对象
      cateProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
        expandTrigger: "hover",
      },
      // 动态参数列表
      manyTableData: [],
      // 静态属性列表
      onlyTableData: [],
      checked1: "",
      checkList: [],
      baseURL: "http://106.12.6.169:8888/",
      // 图片上传路径
      uploadUrl: "http://106.12.6.169:8888/api/private/v1/upload",
      headerObj: {
        Authorization: window.sessionStorage.getItem("token"),
      },
      // 预览图片的path
      previewPath: "",
      // 点击预览对话框
      previewVisible: false,
    };
  },
  methods: {
    // 获取所有商品分类列表
    async getCateList() {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status !== 200)
        return this.$message.error("获取商品分类列表失败!");
      this.cateList = res.data;
    },
    // 级联选择框变化时候触发
    async handleChange() {
      // 判断是不是三级分类
      if (this.addForm.goods_cat.length !== 3) {
        // 级联选择框置空
        this.addForm.goods_cat = [];
        return;
      }
    },
    // Tab跳转之前触发
    beforeTabLeave(activeName, oldActiveName) {
      if (
        oldActiveName === "0" &&
        this.addForm.goods_cat.length !== 3
        // this.addForm.goods_name === "" &&
        // this.addForm.goods_price !== "" &&
        // this.addForm.goods_weight !== "" &&
        // this.addForm.goods_number !== ""
      ) {
        this.$message.error("请填写商品分类!");
        return false;
      } else if (this.addForm.goods_name === "") {
        this.$message.error("请填写商品名称!");
        return false;
      } else if (this.addForm.goods_price === "") {
        this.$message.error("请填写商品价格!");
        return false;
      } else if (this.addForm.goods_weight === "") {
        this.$message.error("请填写商品重量!");
        return false;
      } else if (this.addForm.goods_number === "") {
        this.$message.error("请填写商品数量!");
        return false;
      }
      //  else {
      // console.log(this.addForm.goods_cat.length !== 3);
      // console.log(this.addForm.goods_name !== "");
      // console.log(this.addForm.goods_price !== "");
      // console.log(this.addForm.goods_weight !== "");
      // console.log(this.addForm.goods_number !== "");
      //   return true;
      // }
    },
    // 商品参数
    async canshu() {
      const { data: res } = await this.$http.get(
        `categories/${this.addForm.goods_cat[2]}/attributes`,
        {
          params: { sel: "many" },
        }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("获取动态参数失败!");
      }
      res.data.forEach((item) => {
        item.attr_vals =
          item.attr_vals.length === 0 ? [] : item.attr_vals.split(" ");
      });
      this.manyTableData = res.data;
    },
    // 商品属性
    async shuxing() {
      const { data: res } = await this.$http.get(
        `categories/${this.addForm.goods_cat[2]}/attributes`,
        {
          params: { sel: "only" },
        }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("获取静态属性失败!");
      }
      this.onlyTableData = res.data;
    },
    // 点击竖向tab时触发
    async tabClicked() {
      if (this.activeIndex === "1") {
        this.canshu();
      }
      if (this.activeIndex === "2") {
        this.shuxing();
      }
    },
    // 删除上传的图片时触发
    handleRemove(file) {
      const i = this.addForm.pics.findIndex(
        (x) => x.pics === file.response.data.tmp_path
      );
      this.addForm.pics.splice(i, 1);
    },
    // 点击预览上传的图片时触发
    handlePreview(file) {
      this.previewVisible = true;
      this.previewPath = this.baseURL + file.response.data.tmp_path;
      console.log(file.response.data.tmp_path);
    },
    // 上传成功后触发
    handleSuccess(res) {
      this.addForm.pics.push(res.data.tmp_path);
    },
    // 点击提交添加商品
    add() {
      this.$refs.addFormRef.validate(async (valid) => {
        // 判断表单是否有效
        if (!valid) {
          return this.$message.error("请填写必要的表单项!");
        }
        if (this.manyTableData === "") {
          this.canshu();
        } else {
          this.manyTableData.forEach((item) => {
            const newInfo = {
              attr_id: item.attr_id,
              attr_value: item.attr_vals,
            };
            this.addForm.attrs.push(newInfo);
          });
        }
        if (this.onlyTableData === "") {
          this.shuxing();
        } else {
          this.onlyTableData.forEach((item) => {
            const newInfo = {
              attr_id: item.attr_id,
              attr_value: item.attr_vals,
            };
            this.addForm.attrs.push(newInfo);
          });
        }
        this.addForm.goods_cat = this.addForm.goods_cat.join(",");
        const { data: res } = await this.$http.post("goods", this.addForm);
        if (res.meta.status !== 201) {
          return this.$message.error("添加商品失败!");
        }
        this.$message.success("添加商品成功!");
        this.$router.push("/goods");
      });
    },
  },
  components: {
    quillEditor,
  },
  props: {},
};
</script>

<style scoped lang="less">
.el-checkbox {
  margin: 0 5px 0 0 !important;
}
.previewImg {
  width: 100%;
}
.btnadd {
  margin-top: 15px;
}
</style>
