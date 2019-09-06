<template>
  <el-row>
    <el-col :span="24"></el-col>
  </el-row>
</template>
<script>
export default {
  created: function() {
    const self = this;
    console.log(self.$route.params.hash);
  },
  data() {
    return {};
  },
  methods: {}
};
</script>