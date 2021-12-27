<template>
  <div>
    <!-- 头部面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card class="box-card">
      <el-table :data="rightsList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="权限名称" prop="authName"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="权限等级">
         <template slot-scope="scope">
            <el-tag v-if="scope.row.level == 0">一级</el-tag>
            <el-tag type="success" v-if="scope.row.level == 1">二级</el-tag>
            <el-tag type="warning" v-if="scope.row.level == 2">三级</el-tag>
         </template>
        </el-table-column>
      </el-table>
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    // 调用获取所有权限列表
    this.getRightsList();
  },
  data() {
    return {
      // 权限列表
      rightsList: [],
    };
  },
  methods: {
    //获取所有权限列表
   async getRightsList() {
     const {data:res} = await this.$http.get(`rights/list`);
     if(res.meta.status !== 200)return this.$message.error('获取权限列表失败!')
    this.rightsList = res.data
    console.log(this.rightsList);
   },
  },
  mounted() {},
  components: {},
};
</script>

<style scoped lang="less">
.el-table /deep/ .cell{
  text-align: center;
}
</style>
