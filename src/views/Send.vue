<template>
  <el-row>
    <el-col :span="24">
      <el-form :model="sendForm" :rules="sendFormRules" ref="sendForm" label-width="80px">
        <el-form-item label="钱包地址">{{sendForm.from}}</el-form-item>
        <el-form-item label="钱包余额">
          {{sendForm.balance}}
          <!-- <span style="color:#F56C6C">
            由于服务器磁盘已占满，余额可能不正确，转帐功能正常，你可以在
            <a
              :href="'https://explorer.lianxiangcloud.com/#/address/'+sendForm.from"
              target="_blank"
            >官方查询余额</a>
          </span>-->
        </el-form-item>
        <el-form-item label="接收地址" prop="to">
          <el-input v-model="sendForm.to"></el-input>
        </el-form-item>
        <el-form-item label="转帐金额" prop="value">
          <el-input v-model="sendForm.value"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="send">立即转帐</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <el-col :span="24">
      <el-alert v-if="err" title="出错拉" type="error" :closable="false">
        <!-- <p slot="title">{{err}}</p> -->
        <p>{{err}}</p>
      </el-alert>
      <el-alert v-if="hash" title="发送成功" type="success" :closable="false">
        <p>
          发送成功，稍候可查询HASH:
          <a
            :href="'https://explorer.lianxiangcloud.com/#/trade/detail/'+hash"
            target="_blank"
          >{{hash}}</a>
        </p>
      </el-alert>
    </el-col>
  </el-row>
</template>
<script>
import Tx from "ethereumjs-tx";

export default {
  created: function() {
    const self = this;
    // this.$root.wallet = Wallet.fromPrivateKey(
    //   Buffer.from(
    //     "",
    //     "hex"
    //   )
    // );
    if (this.$root.wallet === null) {
      this.$router.push("/");
      return;
    }
    this.sendForm.from = this.$root.wallet.getAddressString();
    // this.$http.get(
    //     "https://explorer.lianxiangcloud.com/api/getAccountInfo?address=" +
    //       this.sendForm.from
    //   )
    //   .then(function(res) {
    //     console.log(res);
    //   })
    //   .catch(function(err) {
    //     console.log(err);
    //   });
    this.$root.web3.eth.getBalance(this.sendForm.from, function(err, balance) {
      if (err) {
        self.$helper.warning(err);
      } else {
        self.sendForm.balance = self.$root.web3.utils.fromWei(balance);
      }
    });
  },
  data() {
    return {
      sendForm: {
        from: "",
        balance: 0,
        to: "",
        value: ""
      },
      sendFormRules: {
        to: [
          { required: true, message: "请输入接收地址", trigger: "blur" },
          { validator: this.$helper.validateAddress, trigger: "blur" }
        ],
        value: [
          {
            required: true,
            message: "请输入转帐金额",
            trigger: "blur"
          },
          {
            validator: this.$helper.validateFloat,
            trigger: "blur"
          }
        ]
      },
      hash: null,
      err: null
    };
  },
  methods: {
    send: function() {
      const self = this;
      this.$refs.sendForm.validate(valid => {
        if (valid) {
          self.err = null;
          self.hash = null;
          const key = this.sendForm.from + "nonce";
          let nonce = this.$store.get(key) || 0;
          // 计算手续费
          const calValue = Math.ceil(this.sendForm.value); //不足1链克的小数部分按照1链克计算
          let gasPrice = calValue * 0.005; //0.5%手续费
          if (gasPrice < 0.05) {
            //单笔转账手续费最低收取0.05链克
            gasPrice = 0.05;
          }
          if (gasPrice > 500) {
            //单笔转账手续费最高收取500链克
            gasPrice = 500;
          }
          gasPrice = this.$root.web3.utils.toWei(gasPrice.toString());
          let gasLimit = gasPrice / 100000000000;
          // console.log(gasLimit);
          // return;
          const txParams = {
            from: this.sendForm.from,
            to: this.sendForm.to,
            //gasLimit: this.$root.web3.utils.toHex("100000"),
            gasLimit: gasLimit,
            value: this.$root.web3.utils.toHex(
              this.$root.web3.utils.toWei(this.sendForm.value)
            ),
            gasPrice: "0x174876e800", //web3.utils.toHex('100000000000')
            nonce: this.$root.web3.utils.toHex(nonce)
          };
          const tx = new Tx(txParams);
          tx.sign(this.$root.wallet.getPrivateKey());
          const serializedTx = tx.serialize();
          const txStr = "0x" + serializedTx.toString("hex");
          this.$root.web3.eth.sendSignedTransaction(txStr, function(err, hash) {
            if (err) {
              if (err.message.indexOf("nonce too low") > 0) {
                //{"code":-3010,"message":"nonce too low"}
                nonce++;
                self.err = "网络连接失败，请重试";
              } else if (err.message.indexOf("nonce too high") > 0) {
                // {"code":-32000,"message":"nonce too high"}
                nonce--;
                self.err = "网络连接失败，请重试";
              } else {
                self.err = err;
              }
            } else {
              self.hash = hash;
            }
            self.$store.set(key, nonce);
          });
        } else {
          return false;
        }
      });
    }
  }
};
</script>