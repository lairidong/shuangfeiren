<template>
  <a-form-item :label="imgName" :extra="imgSize">
    <a-upload
      name="files[]"
      list-type="picture-card"
      class="avatar-uploader"
      :show-upload-list="false"
      :action="newActionUrl"
      :before-upload="beforeUpload"
      :headers="headers"
      @change="handleChange"
    >
      <div v-if="fileUrl&&!loadingFile">已上传</div>
      <div v-if="loadingFile">
        <a-icon :type="'loading'" />
        <div class="ant-upload-text">
          {{ percentFile }}%
        </div>
      </div>
      <div v-if="!newFileUrl&&!loadingFile">
        <a-icon :type="'plus'" />
        <div class="ant-upload-text">
          上传
        </div>
      </div>
    </a-upload>
  </a-form-item>
</template>

<script>
  export default {
    name: 'UploadFileComponent',
    props: {
      fileUrl: {
        type: String,
        default: ''
      },
      fileType: {
        type: String,
        default: 'zip,rar,7z,tar,gz,pdf,doc,docx,xls,xlsx,ppt,pptx'
      },
      maxSize: {
        type: Number,
        default: 2
      },
      imgSize: {
        type: String,
        default: ''
      },
      imgName: {
        type: String,
        default: ''
      },
      actionUrl: {
        type: String,
        default: ''
      },
      headers: {
        type: Object,
        default: () => {
          return {
            AccessToken: localStorage.getItem('token')
          }
        }
      }
    },
    data () {
      return {
        newFileUrl: '',
        loadingFile: false,
        percentFile: 0,
        newActionUrl: this.$baseUrl + 'admin/file/upload_file' + (process.env.NODE_ENV === 'development' ? '?voucher=token' : '?voucher=session')
      }
    },
    watch: {
      fileUrl (newValue, oldValue) {
        this.newFileUrl = newValue
      },
      fileType (newValue, oldValue) {
        this.fileType = newValue
      },
      actionUrl (newValue, oldValue) {
        this.newActionUrl = newValue
      }
    },
    created () {
      if (this.fileUrl) {
        this.newFileUrl = this.fileUrl
      }
      if (this.actionUrl && this.actionUrl !== '') {
        this.newActionUrl = this.actionUrl
      }
      this.$root.$on('updateToken', (data) => {
        this.headers.AccessToken = data
      })
    },
    methods: {
      handleChange (info) {
        console.log(info)
        if (info.file.status === 'uploading') {
          this.loadingFile = true
          if (info && info.event && info.event.percent) {
            this.percentFile = info.event.percent
            this.percentFile = this.percentFile.toFixed(2)
          }
          return
        }
        if (info.file.status === 'done') {
          this.loadingFile = false
          this.percentFile = 100
          if (info.file.response.data) {
            this.newFileUrl = info.file.response.data[0]
            this.$emit('update:fileUrl', this.newFileUrl)
          } else {
            if (info.file.response.status === 'T') {
              this.$store.commit('setVisibleLogin', true)
            }
            this.$message.error(info.file.response.msg)
          }
        }
      },
      beforeUpload (file) {
        const arr = file.name.split('.')
        const suffix = arr[arr.length - 1]
        const fileType = this.fileType.split(',')
        const valid = fileType.includes(suffix)
        if (!valid) {
          this.$message.error(`只能上传${this.fileType}类型的文件!`)
        }
        const isLtMaxSize = file.size / 1024 / 1024 < this.maxSize
        if (!isLtMaxSize) {
          this.$message.error('上传的文件不能大于' + this.maxSize + 'MB!')
        }
        return valid && isLtMaxSize
      }
    }
  }
</script>

<style lang="less" scoped>

</style>
