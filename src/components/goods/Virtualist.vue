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
          <el-input placeholder="请输入内容">
            <i
              slot="append"
              class="el-icon-search"
            ></i>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button
            type="primary"
            class="addgoods"
          >添加商品</el-button>
        </el-col>
      </el-row>
      <div class="container">
        <ul class="header">
          <li>#</li>
          <li>商品名称</li>
          <li>商品价格</li>
          <li>商品重量</li>
          <li>创建时间</li>
          <li>操作</li>
        </ul>
        <virtual-dynamic-scroller
          :items="goodslist"
          class="vc"
        />
      </div>
      <!-- table表格区域 -->
      <!-- 分页区 -->
      <!-- <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryinfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryinfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination> -->
    </el-card>
  </div>
</template>

<script>
import virtualDynamicScroller from "@/components/goods/virtualDynamicScroller.vue";

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
        pagesize: 926,
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
      //   this.goodslist = res.data.goods.goods_id;
      this.total = res.data.total;
      res.data.goods.forEach((element) => {
        this.goodslist.push({
          id: element.goods_id,
          goods_name: element.goods_name,
          add_time: element.add_time,
        });
      });
      //   console.log(res.data.goods);
      //   console.log(this.goodslist);
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
  },
  components: {
    virtualDynamicScroller,
  },
  props: {},
};
</script>

<style scoped lang="less">
.addgoods {
  margin-left: 20px;
}
.el-pagination {
  margin-top: 15px;
}
.container {
  height: 500px;
  border: 1px solid #ebeef5;
  margin-top: 20px;
}
.vc {
  height: auto;
}
.header {
  list-style: none;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  margin: 0 !important;
  padding: 0 !important;
}
.header > li {
  padding: 12px 0;
  width: 90px;
  text-align: center;
  color: #909399;
  box-sizing: border-box;
  border-bottom: 1px solid #ebeef5;
  border-right: 1px solid #ebeef5;
}
.header > li:nth-of-type(2) {
  width: 454px;
}
</style>
