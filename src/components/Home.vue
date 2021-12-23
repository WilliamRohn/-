<template>
  <div id="home">
    <p>home页面</p>
    <el-button type="info" @click="exit">退出</el-button>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {};
  },
  methods: {
    exit() {
      window.sessionStorage.clear;
      this.$router.push("/login");
    },
  },
  mounted() {},
  components: {},
};
</script>

<style scoped lang="less"></style>
