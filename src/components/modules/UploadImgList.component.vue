<template>
  <a-form-item :label="imgName" :extra="imgSize">
    <div class="clearfix">
      <a-upload
        name="files[]"
        :action="newActionUrl"
        list-type="picture-card"
        :file-list="fileList"
        :headers="headers"
        :multiple="true"
        @preview="handlePreview"
        @change="handleChangeImg"
        :remove="handleRemoveImg"
      >
        <div v-if="fileList.length < 12">
          <a-icon type="plus" />
          <div class="ant-upload-text">
            选择图片
          </div>
        </div>
      </a-upload>
      <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
        <img alt="example" style="width: 100%" :src="previewImage" />
      </a-modal>
    </div>
  </a-form-item>
</template>

<script>
function getBase64 (file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}
  export default {
    name: 'UploadImgListComponent',
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
        fileList: [],
        previewImage: '',
        previewVisible: false,
        newImageUrl: '',
        newActionUrl: this.$baseUrl + 'admin/article/upload_img' + (process.env.NODE_ENV === 'development' ? '?voucher=token' : '?voucher=session')
      }
    },
    watch: {
      imageUrl (newValue, oldValue) {
        this.fileList = []
        if (newValue !== '') {
          if (newValue.indexOf('[') > -1) {
            const imgList = JSON.parse(newValue)
            imgList.forEach(item2 => {
              const file = {
                uid: '-' + Math.random().toString().replace('.', ''),
                name: 'image',
                status: 'done',
                url: item2
              }
              this.fileList.push(file)
            })
          }
        }
      },
      actionUrl (newValue, oldValue) {
        this.newActionUrl = newValue
      }
    },
    created () {
      this.fileList = []
      if (this.imageUrl) {
        if (this.imageUrl !== '') {
          if (this.imageUrl.indexOf('[') > -1) {
            const imgList = JSON.parse(this.imageUrl)
            imgList.forEach(item2 => {
              const file = {
                uid: '-' + Math.random().toString().replace('.', ''),
                name: 'image',
                status: 'done',
                url: item2
              }
              this.fileList.push(file)
            })
          }
        }
      }
      if (this.actionUrl && this.actionUrl !== '') {
        this.newActionUrl = this.actionUrl
      }
      this.$root.$on('updateToken', (data) => {
        this.headers.AccessToken = data
      })
    },
    methods: {
      handleChangeImg ({ fileList }) {
        this.fileList = fileList
        const imgList = []
        fileList.forEach((info, index) => {
          if (info && info.status && info.status === 'done') {
            if (info.response && info.response.data) {
              imgList.push(info.response.data[0])
            } else if (info && info.url) {
              imgList.push(info.url)
            } else {
              if (info.response && info.response.status && info.response.status === 'T') {
                this.$store.commit('setVisibleLogin', true)
                const files = []
                this.fileList.forEach(item => {
                  if (item && item.status && item.status === 'done' && !item.thumbUrl) {
                    files.push(item)
                  }
                })
                this.fileList = files
              }
              if (info.response && info.response.msg) {
                this.$message.error(info.response.msg)
              }
            }
            if (index === fileList.length - 1) {
              this.$emit('update:imageUrl', JSON.stringify(imgList))
            }
          }
        })
      },
      handleRemoveImg (file) {
        const self = this
        return new Promise(function (resolve, reject) {
          self.$confirm({
            title: '提示',
            content: '确定要删除吗?',
            okText: '确定',
            cancelText: '取消',
            onOk () {
              resolve('')
            },
            onCancel () {
              reject(new Error('取消删除'))
            }
          })
        })
        .then(() => {
          console.log('handleRemoveImg', this.fileList)
        })
        .catch(() => {
          return false
        })
      },
      async handlePreview (file) {
        if (!file.url && !file.preview) {
          file.preview = await getBase64(file.originFileObj)
        }
        this.previewImage = file.url || file.preview
        this.previewVisible = true
      },
      handleCancel () {
        this.previewVisible = false
      }
    }
  }
</script>

<style lang="less" scoped>

</style>
