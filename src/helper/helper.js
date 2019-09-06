import Vue from 'vue'
import Blob from 'blob';
import fileSaver from 'file-saver';
import helper from '@/helper/helper';

export default {
    warning: (msg) => {
        Vue.prototype.$notify({
            title: "警告",
            message: msg,
            type: "warning"
        });
    },
    exportFile: function (content, filename, type = 'application/json') {
        // let blob = null;
        // if (typeof (window.Blob) == "function") {
        //         blob = new Blob(content, {
        //         type: type
        //         });
        // } else {
        //     let BlobBuilder = window.BlobBuilder || window.MozBlobBuilder || window.WebKitBlobBuilder || window.MSBlobBuilder;
        //     let bb = new BlobBuilder();
        //     bb.append(content);
        //     blob = bb.getBlob(type);
        // }
        let blob = new Blob([content]);
        fileSaver.saveAs(blob, filename);
        // let URL = window.URL || window.webkitURL;
        // let bloburl = URL.createObjectURL(blob);
        // window.open(bloburl);
    },
    validateAddress: function (rule, value, callback) {
        if (helper.isAddress(value)) {
            callback();
        } else {
            callback(new Error('请输入正确的地址'));
        }
    },
    validateSearchKeyword: function (rule, value, callback) {
        if (helper.isAddress(value) || helper.isTransaction(value)) {
            callback();
        } else {
            callback(new Error('请输入正确的钱包地址或者交易hash'));
        }
    },
    isAddress: function (value) {
        if (value.length !== 42) {
            return false;
        }
        if (value.indexOf('0x') < 0) {
            return false;
        }
        const address = parseInt(value);
        //console.log('ad:'+address);
        if (isNaN(address)) {
            return false;
        }
        return true;
    },
    isTransaction: function (value) {
        if (value.indexOf('0x') < 0) {
            return false;
        }
        const address = parseInt(value);
        //console.log('tr:'+address);
        if (isNaN(address)) {
            return false;
        }
        return true;
    },
    validateFloat: function (rule, value, callback) {
        if (helper.isFloat(value)) {
            callback();
        } else {
            callback(new Error('请输入正确的数字'))
        }
    },
    isFloat: function (value) {
        if (parseFloat(value) > 0) {
            return true;
        } else {
            return false;
        }
    }
}