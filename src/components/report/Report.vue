<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card>
      <div
        id="main"
        style="width: 800px;height:500px;"
      ></div>
    </el-card>
  </div>
</template>

<script>
import * as echarts from "echarts";
import _ from "lodash";
export default {
  created() {},
  async mounted() {
    // 初始化echarts
    var myChart = echarts.init(document.getElementById("main"));
    // 获取折线图数据
    const { data: res } = await this.$http.get("reports/type/1");
    if (res.meta.status !== 200) {
      return this.$message.error("获取折线图数据失败!");
    }
    console.log(res.data);
    // 准备数据和配置项
    const result = _.merge(res.data, this.options);
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(result);
  },
  data() {
    return {
      // 需要合并的数据
      options: {
        title: {
          text: "用户来源",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#E9EEF3",
            },
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            boundaryGap: false,
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
      },
    };
  },
  methods: {},
  components: {},
  props: {},
};
</script>

<style scoped lang="less">
#main {
  margin: 0 auto;
}
</style>
