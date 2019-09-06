<template>
  <div id="app">
    <el-row>
      <el-col :span="24">
        <el-menu
          :default-active="$route.path"
          class="el-menu-demo"
          mode="horizontal"
          :router="true"
        >
          <el-menu-item>LK WALLET</el-menu-item>
          <el-menu-item index="/">打开钱包</el-menu-item>
          <el-menu-item index="/send">转帐</el-menu-item>
          <el-menu-item index="/search">区块查询</el-menu-item>
        </el-menu>
      </el-col>
    </el-row>
    <div class="line"></div>
    <router-view/>
  </div>
</template>
<script>
export default {
  name: "app",
  data() {
    return {
      
    };
  }
};
</script>
<style>
.line {
  height: 1px;
  margin: 20px 0 20px 0;
}
</style>
