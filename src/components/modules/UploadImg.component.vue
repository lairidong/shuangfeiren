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
      <img v-if="newImageUrl&&!loadingImg" :src="newImageUrl" class="flash-img" alt="上传图片" />
      <div v-if="loadingImg">
        <a-icon :type="'loading'" />
        <div class="ant-upload-text">
          {{ percentImg }}%
        </div>
      </div>
      <div v-if="!newImageUrl&&!loadingImg">
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
    name: 'UploadImgComponent',
    props: {
      imageUrl: {
        type: String,
        default: ''
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
        newImageUrl: '',
        loadingImg: false,
        percentImg: 0,
        newActionUrl: this.$baseUrl + 'admin/article/upload_img' + (process.env.NODE_ENV === 'development' ? '?voucher=token' : '?voucher=session')
      }
    },
    watch: {
      imageUrl (newValue, oldValue) {
        this.newImageUrl = newValue
      },
      actionUrl (newValue, oldValue) {
        this.newActionUrl = newValue
      }
    },
    created () {
      if (this.imageUrl) {
        this.newImageUrl = this.imageUrl
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
          this.loadingImg = true
          if (info && info.event && info.event.percent) {
            this.percentImg = info.event.percent
            this.percentImg = this.percentImg.toFixed(2)
          }
          return
        }
        if (info.file.status === 'done') {
          this.loadingImg = false
          this.percentImg = 100
          if (info.file.response.data) {
            this.newImageUrl = info.file.response.data[0]
            this.$emit('update:imageUrl', this.newImageUrl)
          } else {
            if (info.file.response.status === 'T') {
              this.$store.commit('setVisibleLogin', true)
            }
            this.$message.error(info.file.response.msg)
          }
        }
      },
      beforeUpload (file) {
        const isJpgOrPng =
          file.type === 'image/jpeg' || file.type === 'image/png'
        if (!isJpgOrPng) {
          this.$message.error('只能上传JPG或PNG图片!')
        }
        const isLtMaxSize = file.size / 1024 / 1024 < this.maxSize
        if (!isLtMaxSize) {
          this.$message.error('上传的图片不能大于' + this.maxSize + 'MB!')
        }
        return isJpgOrPng && isLtMaxSize
      }
    }
  }
</script>

<style lang="less" scoped>

</style>
