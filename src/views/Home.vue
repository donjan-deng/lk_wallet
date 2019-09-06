<template>
  <el-row>
    <el-col :span="24">
      <el-alert type="warning" :closable="false" show-ico center>
        <h1 slot="title">重要提醒</h1>
        <h3>本工具为可在浏览器运行的客户端界面，类似于以太坊的MyEtherWallet,并不会将你的钱包发送至服务器,钱包安全由您自行负责！</h3>
        <h3>节点赞助：<a href="http://www.bihe.one" target="_blank">币合区块链</a> | 问题反馈：<a href="https://github.com/lkwallet/lkwallet.github.io/issues/new" target="_blank">提交问题</a></h3>
        <h3>如果你觉得本工具好用，可以赞助几个鸡蛋，赞助钱包：0x47631e4465f753e3931ae2c6945c6a6bd35ed710</h3>
      </el-alert>
    </el-col>
    <el-col :span="6" :offset="9" class="line">
      <el-button type="primary" @click="openDialogVisible = true">打开包钱</el-button>or
      <el-button type="success" @click="showCreateDialog()">创建钱包</el-button>
    </el-col>
    <!-- 打开包钱 -->
    <el-dialog
      title="打开包钱"
      :visible.sync="openDialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form :model="openForm" label-width="100px">
        <el-form-item label="钱包文件">
          <el-upload
            :auto-upload="false"
            v-model="openForm.file"
            :multiple="false"
            :show-file-list="false"
            action
            :on-change="selectFile"
          >
            <el-button slot="trigger" size="small" type="default">选取文件</el-button>
            <div slot="tip" class="el-upload__tip">{{openForm.file_name}}</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="openForm.password" show-password></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="openDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="openButtonLoading" @click="openWallet">打开</el-button>
      </div>
    </el-dialog>
    <!-- 创建钱包 -->
    <el-dialog
      title="创建钱包"
      :visible.sync="createDialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form :model="createForm" :rules="createFormRules" ref="createForm" label-width="100px">
        <el-form-item label="密码" prop="password">
          <el-input v-model="createForm.password" show-password></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirm_password">
          <el-input v-model="createForm.confirm_password" show-password></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="createDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="createButtonLoading" @click="createWallet()">创建</el-button>
      </div>
    </el-dialog>
  </el-row>
</template>
<script>
import Wallet from "ethereumjs-wallet";

export default {
  name: "home",
  data() {
    let validatePass = (rule, value, callback) => {
      if (value !== this.createForm.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      openForm: {
        file: "",
        file_name: "",
        password: ""
      },
      createForm: {
        password: "",
        confirm_password: ""
      },
      createFormRules: {
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        confirm_password: [
          { required: true, message: "请输入确认密码", trigger: "blur" },
          { validator: validatePass, trigger: "blur" }
        ]
      },
      openDialogVisible: false,
      createDialogVisible: false,
      walletJson: "",
      openButtonLoading: false,
      createButtonLoading: false
    };
  },
  methods: {
    selectFile: function(file) {
      this.openForm.file_name = file.name;
      let reader = new FileReader();
      reader.onload = ev => {
        this.walletJson = ev.target.result;
      };
      reader.readAsText(file.raw);
    },
    openWallet: function() {
      const self = this;
      self.openButtonLoading = true;
      (async function(self) {
        if (self.walletJson.length > 0) {
          try {
            self.$root.wallet = await Wallet.fromV3(
              self.walletJson,
              self.openForm.password
            );
            self.$router.push("/send");
          } catch (e) {
            if (e.name == "SyntaxError") {
              self.$helper.warning("该文件不是一个正确的钱包文件");
            } else if (e.name == "Error") {
              self.$helper.warning("密码错误");
            } else {
              console.log(e.name);
              console.log(e.message);
              self.$helper.warning(e.message);
            }
          }
        } else {
          self.$helper.warning("请选择钱包文件");
        }
        self.openButtonLoading = false;
      })(self);
    },
    showCreateDialog: function() {
      this.createDialogVisible = true;
      this.$nextTick(function() {
        this.$refs.createForm.resetFields();
      });
    },
    createWallet: function() {
      this.$refs.createForm.validate(valid => {
        if (valid) {
          this.$wallet = Wallet.generate();
          const json = this.$wallet.toV3String(this.createForm.password);
          this.$helper.exportFile(json, this.$wallet.getV3Filename());
        } else {
          return false;
        }
      });
    }
  }
};
</script>
