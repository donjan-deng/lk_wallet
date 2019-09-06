<template>
  <el-row>
    <el-col :span="24">
      <p>钱包地址：{{address}}</p>
      <p>钱包余额：{{balance}}</p>
    </el-col>
    <el-col :span="24">
    </el-col>
  </el-row>
</template>
<script>
export default {
  created: function() {
    const self = this;
    self.address = self.$route.params.address;
    if (!self.$helper.isAddress(self.address)) {
      self.$router.push("/search");
    }
    self.$root.web3.eth.getBalance(self.address, function(err, balance) {
      if (err) {
        self.$helper.warning(err);
      } else {
        self.balance = self.$root.web3.utils.fromWei(balance);
      }
    });
    // self.$root.web3.eth.getPastLogs({fromBlock:self.$root.web3.utils.toHex(5000)},function(err,res){
    //   console.log(err);
    //   console.log(res);
    // });
  },
  data() {
    return {
      address: "",
      balance: 0
    };
  },
  methods: {}
};
</script>