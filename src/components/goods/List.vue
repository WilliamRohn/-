<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryinfo.query"
            clearable
            @clear="getGoodsList"
          >
            <el-button
              slot="append"
              class="el-icon-search"
              @click="getGoodsList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button
            type="primary"
            @click="goAddpage"
          >添加商品</el-button>
        </el-col>
      </el-row>
      <!-- table表格区域 -->
      <el-table
        :data="goodslist"
        border
        stripe
      >
        <el-table-column
          type="index"
          label="#"
          align='center'
        ></el-table-column>
        <el-table-column
          prop="goods_name"
          label="商品名称"
          header-align='center'
        ></el-table-column>
        <el-table-column
          prop="goods_price"
          label="商品价格(元)"
          width="110px"
          align='center'
        ></el-table-column>
        <el-table-column
          prop="goods_weight"
          label="商品重量"
          width="80px"
          align='center'
        ></el-table-column>
        <el-table-column
          prop="add_time"
          label="创建时间"
          width="170px"
          align='center'
        >
          <template slot-scope="scope">
            {{scope.row.add_time|dataFormat}}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="130px"
          align='center'
        >
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editGoods(scope.row)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeGoods(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryinfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryinfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getGoodsList();
  },
  mounted() {},
  data() {
    return {
      // 查询参数对象
      queryinfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      // 商品列表详情
      goodslist: [],
      // 数据总数
      total: 0,
    };
  },
  methods: {
    // 获取商品列表数据
    async getGoodsList() {
      const { data: res } = await this.$http.get(`goods`, {
        params: this.queryinfo,
      });
      if (res.meta.status !== 200)
        return this.$message.error("获取商品列表失败!");
      // this.$message.success({
      //   message: "获取商品列表成功!",
      //   duration: 800,
      // });
      this.goodslist = res.data.goods;
      this.total = res.data.total;
      console.log(res.data);
    },
    editGoods() {},
    removeGoods() {},
    handleSizeChange(newSize) {
      this.queryinfo.pagesize = newSize;
      this.getGoodsList();
    },
    handleCurrentChange(newPage) {
      this.queryinfo.pagenum = newPage;
      this.getGoodsList();
    },
    async removeGoods(id) {
      console.log(id);
      const confirmResult = await this.$confirm(
        "此操作将永久删除该商品，是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmResult !== "confirm") return;
      const { data: res } = await this.$http.delete(`goods/${id}`);
      this.$message.success({
        message: "成功删除商品!",
        duration: 800,
      });
      console.log(res);
      this.getGoodsList();
    },
    goAddpage() {
      this.$router.push(`/goods/add`);
    },
  },
  components: {},
  props: {},
};
</script>

<style scoped lang="less">
.el-pagination {
  margin-top: 15px;
}
</style>
