<template>
  <el-row>
    <el-col :span="24">
      <el-form :model="form" :rules="formRules" ref="form" label-width="80px">
        <el-form-item label="查询" prop="keyword">
          <el-input v-model="form.keyword" placeholder="请输入钱包地址或者交易hash"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>
<script>
export default {
  data() {
    return {
      form: {
        keyword: ""
      },
      formRules: {
        keyword: [
          { required: true, message: "请输入转帐金额", trigger: "blur" },
          { validator: this.$helper.validateSearchKeyword, trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    search: function() {
      const self = this;
      this.$refs.form.validate(valid => {
        if (valid) {
          if (self.$helper.isAddress(self.form.keyword)) {
            //查询钱包
            //self.$router.push(`/address/${self.form.keyword}`);
            window.open(
              "https://explorer.lianxiangcloud.com/#/address/" +
                self.form.keyword,
              "_blank"
            );
          } else if (self.$helper.isTransaction(self.form.keyword)) {
            //交易
            //self.$router.push(`/transaction/${self.form.keyword}`);
            window.open(
              "https://explorer.lianxiangcloud.com/#/trade/detail/" +
                self.form.keyword,
              "_blank"
            );
          }
        } else {
          return false;
        }
      });
    }
  }
};
</script>