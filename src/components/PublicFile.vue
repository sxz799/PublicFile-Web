<template>
  <img alt="Vue logo" src="../assets/logo.png">
  <a-divider />

  <a-row type="flex">
    <a-col :flex="2"></a-col>
    <a-col :flex="6">
      <div>
        <a-input v-model:value="fileCode" placeholder="请输入文件提取码" style="width: calc(100% - 150px)" />
        <a-divider type="vertical" />
        <a-button @click="download" type="primary">提取文件</a-button>
      </div>
      <a-divider />
      <div>
        <a-upload-dragger :progress="progress" name="file" :before-upload="beforeUpload" :showUploadList="true"
          :multiple="false" action="/file/upload" @change="handleChange">
          <p class="ant-upload-drag-icon">
            <inbox-outlined></inbox-outlined>
          </p>
          <p class="ant-upload-text">点击或拖拽文件到这里进行上传</p>
        </a-upload-dragger>

        <a-result v-show="showResult" status="success" :title="uploadResult" sub-title="请牢记此提取码！文件有效期为24小时！">
        </a-result>
      </div>
    </a-col>
    <a-col :flex="2"></a-col>
  </a-row>


</template>

<script>
import { InboxOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { defineComponent, ref } from 'vue';
import axios from 'axios';
export default defineComponent({
  components: {
    InboxOutlined,
  },
  data() {
    const beforeUpload = file => {
      const sizeLimit = file.size / 1024 / 1024 < 30;
      if (!sizeLimit) {
        message.error('文件大小不可超过 30 MB !');
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
      fileCode: '',
      showResult: false,
      uploadResult: '',
      uploadStatus: 'success',
      handleChange: e => {
        if (e.file.status == 'done') {
          this.showResult = true
          if (e.file.response.success) {
            this.uploadResult = e.file.response.message
          } else {
            this.uploadStatus = 'warning'
            this.uploadResult = e.file.response.message
          }
        }
      },
      beforeUpload,
      progress,
    };
  },
  methods: {
    download() {
      axios.get("/file/exist", {
        params: { code: this.fileCode },
      }).then((res) => {
        if (res.data.success) {
          message.info("即将开始下载！文件大小为：" + parseFloat(res.data.fileObj.fileSize / 1024 / 1024).toFixed(2) + " MB！", 10)
          window.location.href = "/file/download?code=" + this.fileCode
        } else {
          message.warning("此提取码不存在！")
        }
      });
    },
  }
});
</script>