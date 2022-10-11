<template>
  <a-row type="flex">
    <a-col :flex="2"></a-col>
    <a-col :flex="1">
      <a-divider />
      <a-row>

        <a-col :span="11">
          <img src="../assets/logo.png" />
        </a-col>
        <a-col :span="2"></a-col>
        <a-col :span="10">
          <a-card title="温馨提示">
            <h4>欢迎使用临时网盘系统,请勿上传隐私文件！</h4>
            <h4>文件有效期为 <a style="color: red"> {{fileLife}} </a> 小时！</h4>
            <h4>文件大小限制 <a style="color: red"> {{fileSize}} </a> MB！</h4>
          </a-card>
        </a-col>


      </a-row>
      <a-divider />
      <div style="padding-inline: 3%;">
        <a-upload-dragger :progress="progress" name="file" :before-upload="beforeUpload" :showUploadList="true"
          :capture="camera" :multiple="false" action="/file/upload" @change="handleChange">
          <p class="ant-upload-drag-icon">
            <inbox-outlined></inbox-outlined>
          </p>
          <p class="ant-upload-text">点击或拖拽文件到这里进行上传</p>
        </a-upload-dragger>
      </div>
      <a-modal v-model:visible="showResult" title="上传结果" okText="确定" cancelText="取消" @ok="handleOk">
        <a-result :status="uploadStatus" :title="uploadResult" :sub-title="subTitle">
          {{this.downLoadUrl}}
          <a-divider type="vertical" />
          <a-button @click="copy" type="primary">复制下载链接</a-button>
        </a-result>
      </a-modal>
      <a-divider />
      <div>
        <a-input v-model:value="fileCode" allowClear placeholder="请输入文件提取码" show-count :maxlength="10"
          style="vertical-align:middle;width: calc(95% - 150px);height: 40px;" />
        <a-divider type="vertical" />
        <a-button @click="download" type="primary" shape="round" style="vertical-align:middle;height: 40px;">
          <template #icon>
            <DownloadOutlined />
          </template>
          提取文件
        </a-button>
      </div>
      <a-divider />
    </a-col>
    <a-col :flex="2"></a-col>
  </a-row>


</template>

<script>
import { InboxOutlined } from '@ant-design/icons-vue';
import { DownloadOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { defineComponent, ref } from 'vue';
import useClipboard from 'vue-clipboard3';
import axios from 'axios';

const { toClipboard } = useClipboard();

export default defineComponent({
  components: {
    InboxOutlined, DownloadOutlined
  },
  mounted() {
    axios.get("/file/config").then((res) => {
      this.fileSize = res.data.fileSize
      this.fileLife = res.data.fileLife
    });
  },
  data() {
    const beforeUpload = file => {
      const sizeLimit = file.size / 1024 / 1024 < this.fileSize;
      if (!sizeLimit) {
        message.error('文件大小不可超过 ' + this.fileSize + ' MB !');
      }
      return sizeLimit;
    };
    const progress = {
      strokeColor: {
        '0%': '#108ee9',
        '100%': '#87d068',
      },
      strokeWidth: 3,
      format: percent => `${parseFloat(percent.toFixed(2))}%`,
      class: 'test',
    };
    return {
      downLoadUrl: '',
      fileSize: 10,
      fileLife: 10,
      subTitle: '',
      fileCode: '',
      showResult: false,
      uploadResult: '',
      uploadStatus: 'info',
      handleChange: e => {
        if (e.file.status == 'done') {
          this.showResult = true
          this.uploadStatus = e.file.response.status
          this.subTitle = "上传成功!文件有效期为 " + this.fileLife + " 小时,请牢记提取码！"
          this.downLoadUrl = window.location.href + "file/" + e.file.response.fileObj.shareCode
          if (e.file.response.success) {
            this.uploadResult = e.file.response.message + "提取码：" + e.file.response.fileObj.shareCode
          } else {
            this.uploadResult = e.file.response.message + "提取码：" + e.file.response.fileObj.shareCode
          }
        }
      },
      beforeUpload,
      progress,
    };
  },
  methods: {
    handleOk() {
      this.showResult = false
    },
    download() {
      axios.get("/file/exist/" + this.fileCode).then((res) => {
        if (res.data.success) {
          message.info("即将开始下载！文件大小为：" + parseFloat(res.data.fileObj.fileSize / 1024 / 1024).toFixed(2) + " MB！", 10)
          window.location.href = "/file/download/" + this.fileCode
        } else {
          message.warning("此提取码不存在！")
        }
      });
    },
    copy() {
      try {
        toClipboard(this.downLoadUrl)
        message.success('复制成功！')
      } catch (e) {
        message.error('复制失败！')
      }
    },
  }
});
</script>

