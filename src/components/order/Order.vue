<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getOrderList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getOrderList"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table
        stripe
        border
        :data="orderList"
      >
        <el-table-column
          type="index"
          label="#"
          align='center'
        ></el-table-column>
        <el-table-column
          align='center'
          prop="order_number"
          label="订单编号"
        ></el-table-column>
        <el-table-column
          align='center'
          prop="order_price"
          label="订单价格"
        ></el-table-column>
        <el-table-column
          label="是否付款"
          align='center'
        >
          <template slot-scope="scope">
            <el-tag
              type="success"
              v-if="scope.row.order_pay == 1"
            >已付款</el-tag>
            <el-tag
              type="warning"
              v-if="scope.row.order_pay == 0"
            >未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          align='center'
          prop="is_send"
          label="是否发货"
        ></el-table-column>
        <el-table-column
          align='center'
          label="下单时间"
        >
          <template slot-scope="scope">
            {{scope.row.create_time|dataFormat}}
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
              @click="showBox(scope.row)"
            ></el-button>
            <el-button
              type="success"
              icon="el-icon-location"
              size="mini"
              @click="showProgressBox(scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5,10,15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 物流进度对话框 -->
    <el-dialog
      title="物流进度"
      :visible.sync="progressVisible"
      width="50%"
    >
      <el-timeline :reverse="reverse">
        <el-timeline-item
          v-for="(item, index) in progressText"
          :key="index"
          :timestamp="item.time"
          placement="bottom"
        >
          {{item.context}}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
export default {
  created() {
    this.getOrderList();
  },
  mounted() {},
  data() {
    return {
      //获取用户列表参数对象
      queryInfo: {
        query: "",
        // 当前的页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 5,
      },
      orderList: [],
      total: 0,
      // 物流进度对话框
      progressVisible: false,
      // 物流进度排序
      reverse: true,
      progressText: [],
    };
  },
  methods: {
    async getOrderList() {
      const { data: res } = await this.$http.get("orders", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取订单列表失败!");
      }
      this.total = res.data.total;
      this.orderList = res.data.goods;
    },
    async showBox(row) {
      // const { data: res } = await this.$http.put(`orders/${row.order_id}`);
      // console.log(res);
    },
    // 点击查看物流信息
    async showProgressBox(row) {
      this.progressVisible = true;
      const { data: res } = await this.$http.get(`/kuaidi/1106975712662`);
      this.progressText = res.data;
    },
    // 监听当前的页码大小
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getOrderList();
    },
    // 监听当前页面变动时候触发的事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getOrderList();
    },
  },
};
</script>

<style scoped lang="less">
.el-pagination {
  margin-top: 15px;
}
</style>
