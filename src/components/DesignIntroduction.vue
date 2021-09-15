<template>
  <div>
    <div class="tool-bar" style="margin-bottom: 16px">
      <a-row>
        <a-col :span="12">
          <div class="page-title">
            {{ parent_column_name }} - {{ column_name }}
          </div>
        </a-col>
      </a-row>
    </div>
    <div>
      <a-form-model
        ref="ruleForm"
        layout="vertical"
        :model="page"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-row :gutter="24">
          <a-col :span="24">
            <a-form-model-item ref="attribute1" label="图片1" prop="attribute1" :extra="imgSize">
              <a-upload
                name="files[]"
                list-type="picture-card"
                class="avatar-uploader"
                :disabled="!$store.getters.hasPermission('design-introduction-edit')"
                :show-upload-list="false"
                :action="actionUrl"
                :before-upload="beforeUpload"
                :headers="headers"
                @change="handleChange"
              >
                <img v-if="imageUrl&&!loadingImg" :src="imageUrl" class="flash-img" alt="上传图片" />
                <div v-if="loadingImg">
                  <a-icon :type="'loading'" />
                  <div class="ant-upload-text">
                    {{ percentImg }}%
                  </div>
                </div>
                <div v-if="!imageUrl&&!loadingImg">
                  <a-icon :type="'plus'" />
                  <div class="ant-upload-text">
                    上传
                  </div>
                </div>
              </a-upload>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="图片1描述">
              <a-textarea
                v-model="page.attribute2"
                placeholder=""
                :auto-size="{ minRows: 3, maxRows: 5 }"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="24">
            <a-form-model-item ref="attribute3" label="图片2" prop="attribute3" :extra="imgSize">
              <a-upload
                name="files[]"
                list-type="picture-card"
                class="avatar-uploader"
                :disabled="!$store.getters.hasPermission('design-introduction-edit')"
                :show-upload-list="false"
                :action="actionUrl"
                :before-upload="beforeUpload"
                :headers="headers"
                @change="handleChange2"
              >
                <img v-if="imageUrl2&&!loadingImg2" :src="imageUrl2" class="flash-img" alt="上传图片" />
                <div v-if="loadingImg2">
                  <a-icon :type="'loading'" />
                  <div class="ant-upload-text">
                    {{ percentImg2 }}%
                  </div>
                </div>
                <div v-if="!imageUrl2&&!loadingImg2">
                  <a-icon :type="'plus'" />
                  <div class="ant-upload-text">
                    上传
                  </div>
                </div>
              </a-upload>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="图片2描述">
              <a-textarea
                v-model="page.attribute4"
                placeholder=""
                :auto-size="{ minRows: 3, maxRows: 5 }"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="24">
            <a-form-model-item ref="attribute5" label="图片3" prop="attribute5" :extra="imgSize2">
              <a-upload
                name="files[]"
                list-type="picture-card"
                class="avatar-uploader"
                :disabled="!$store.getters.hasPermission('design-introduction-edit')"
                :show-upload-list="false"
                :action="actionUrl"
                :before-upload="beforeUpload"
                :headers="headers"
                @change="handleChange3"
              >
                <img v-if="imageUrl3&&!loadingImg3" :src="imageUrl3" class="flash-img" alt="上传图片" />
                <div v-if="loadingImg3">
                  <a-icon :type="'loading'" />
                  <div class="ant-upload-text">
                    {{ percentImg3 }}%
                  </div>
                </div>
                <div v-if="!imageUrl3&&!loadingImg3">
                  <a-icon :type="'plus'" />
                  <div class="ant-upload-text">
                    上传
                  </div>
                </div>
              </a-upload>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="图片3描述">
              <a-textarea
                v-model="page.attribute6"
                placeholder=""
                :auto-size="{ minRows: 3, maxRows: 5 }"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="24">
            <a-form-model-item ref="attribute7" label="图片4" prop="attribute7" :extra="imgSize2">
              <a-upload
                name="files[]"
                list-type="picture-card"
                class="avatar-uploader"
                :disabled="!$store.getters.hasPermission('design-introduction-edit')"
                :show-upload-list="false"
                :action="actionUrl"
                :before-upload="beforeUpload"
                :headers="headers"
                @change="handleChange4"
              >
                <img v-if="imageUrl4&&!loadingImg4" :src="imageUrl4" class="flash-img" alt="上传图片" />
                <div v-if="loadingImg4">
                  <a-icon :type="'loading'" />
                  <div class="ant-upload-text">
                    {{ percentImg4 }}%
                  </div>
                </div>
                <div v-if="!imageUrl4&&!loadingImg4">
                  <a-icon :type="'plus'" />
                  <div class="ant-upload-text">
                    上传
                  </div>
                </div>
              </a-upload>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="图片4描述">
              <a-textarea
                v-model="page.attribute8"
                placeholder=""
                :auto-size="{ minRows: 3, maxRows: 5 }"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="24">
            <a-form-model-item ref="attribute9" label="图片5" prop="attribute9" :extra="imgSize2">
              <a-upload
                name="files[]"
                list-type="picture-card"
                class="avatar-uploader"
                :disabled="!$store.getters.hasPermission('design-introduction-edit')"
                :show-upload-list="false"
                :action="actionUrl"
                :before-upload="beforeUpload"
                :headers="headers"
                @change="handleChange5"
              >
                <img v-if="imageUrl5&&!loadingImg5" :src="imageUrl5" class="flash-img" alt="上传图片" />
                <div v-if="loadingImg5">
                  <a-icon :type="'loading'" />
                  <div class="ant-upload-text">
                    {{ percentImg5 }}%
                  </div>
                </div>
                <div v-if="!imageUrl5&&!loadingImg5">
                  <a-icon :type="'plus'" />
                  <div class="ant-upload-text">
                    上传
                  </div>
                </div>
              </a-upload>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="图片4描述">
              <a-textarea
                v-model="page.attribute10"
                placeholder=""
                :auto-size="{ minRows: 3, maxRows: 5 }"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="24">
            <a-button icon="save" type="primary" @click="handleSave()" v-action:design-introduction-edit>
              保存
            </a-button>
          </a-col>
        </a-row>
      </a-form-model>
    </div>

  </div>
</template>

<script>
import moment from 'moment'
import 'moment/locale/zh-cn'
import locale from 'ant-design-vue/es/date-picker/locale/zh_CN'

export default {
  data () {
    return {
      moment,
      locale,
      parent_column_name: '',
      column_name: '',
      labelCol: { },
      wrapperCol: { },
      page: {
        page_title: '',
        page_content: '',
        img: ''
      },
      action: '',
      visible: false,
      visibleTeam: false,
      imgSize: '',
      imgSize2: '',
      loadingImg: false,
      percentImg: 0,
      imageUrl: '',
      loadingImg2: false,
      percentImg2: 0,
      imageUrl2: '',
      loadingImg3: false,
      percentImg3: 0,
      imageUrl3: '',
      loadingImg4: false,
      percentImg4: 0,
      imageUrl4: '',
      loadingImg5: false,
      percentImg5: 0,
      imageUrl5: '',
      headers: {
        AccessToken: localStorage.getItem('token')
      },
      actionUrl: this.$baseUrl + 'admin/article/upload_img' + (process.env.NODE_ENV === 'development' ? '?voucher=token' : '?voucher=session')
    }
  },
  name: 'DesignIntroduction',
  components: {
  },
  created () {
    this.getContent()
    this.setImgSizeText()
    this.getColumnByCode()
    this.$root.$on('updateToken', (data) => {
      this.headers.AccessToken = data
    })
  },
  methods: {
    setImgSizeText () {
      if (this.$route.query.img) {
        this.imgSize = '图片尺寸：' + this.$route.query.img.replace(',', '×') + '像素'
      } else {
        this.imgSize = ''
      }
      if (this.$route.query.img2) {
        this.imgSize2 = '图片尺寸：' + this.$route.query.img2.replace(',', '×') + '像素'
      } else {
        this.imgSize2 = ''
      }
    },
    getColumnByCode () {
      this.$http
        .post('admin/column/getParentColumnByCode', {
          code: 'design-introduction'
        })
        .then((res) => {
          if (res.data.status === 'S') {
            this.parent_column_name = res.data.data.column_name
            this.$http
              .post('admin/column/getColumnByCode', {
                code: 'design-introduction'
              })
              .then((res2) => {
                this.title = res2.data.data.column_name
                if (res2.data.status === 'S') {
                  this.column_name = res2.data.data.column_name
                  this.$store.commit('setBreadcrumb', {
                    breadcrumbData: [
                      {
                        key: '1',
                        name: '首页',
                        url: '#/main/base'
                      },
                      {
                        key: '2',
                        name: res.data.data.column_name,
                        url: ''
                      },
                      {
                        key: '3',
                        name: res2.data.data.column_name,
                        url: ''
                      }
                    ]
                  })
                }
              })
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    getContent () {
      this.$http
        .post('admin/page/getContent', {
          code: 'design-introduction'
        })
        .then(res => {
          if (res.data.status === 'S') {
            this.page = res.data.data
            this.imageUrl = this.page.attribute1
            this.imageUrl2 = this.page.attribute3
            this.imageUrl3 = this.page.attribute5
            this.imageUrl4 = this.page.attribute7
            this.imageUrl5 = this.page.attribute9
          } else if (res.data.status !== 'T') {
            this.$error({
              title: '提示',
              content: res.data.msg
            })
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    handleSave () {
      this.page.page_title = this.column_name
      this.page.code = 'design-introduction'
      this.$http
        .post('admin/page/edit', this.page)
        .then(res => {
          if (res.data.status === 'S') {
            this.$message.success('保存成功')
            this.getContent()
          } else if (res.data.status !== 'T') {
            this.$error({
              title: '提示',
              content: res.data.msg
            })
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    handleChange (info) {
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
          this.imageUrl = info.file.response.data[0]
          this.page.attribute1 = this.imageUrl
        } else {
          if (info.file.response.status === 'T') {
            this.$store.commit('setVisibleLogin', true)
          }
          this.$message.error(info.file.response.msg)
        }
      }
    },
    handleChange2 (info) {
      if (info.file.status === 'uploading') {
        this.loadingImg2 = true
        if (info && info.event && info.event.percent) {
          this.percentImg2 = info.event.percent
          this.percentImg2 = this.percentImg2.toFixed(2)
        }
        return
      }
      if (info.file.status === 'done') {
        this.loadingImg2 = false
        this.percentImg2 = 100
        if (info.file.response.data) {
          this.imageUrl2 = info.file.response.data[0]
          this.page.attribute3 = this.imageUrl2
        } else {
          if (info.file.response.status === 'T') {
            this.$store.commit('setVisibleLogin', true)
          }
          this.$message.error(info.file.response.msg)
        }
      }
    },
    handleChange3 (info) {
      if (info.file.status === 'uploading') {
        this.loadingImg3 = true
        if (info && info.event && info.event.percent) {
          this.percentImg3 = info.event.percent
          this.percentImg3 = this.percentImg3.toFixed(2)
        }
        return
      }
      if (info.file.status === 'done') {
        this.loadingImg3 = false
        this.percentImg3 = 100
        if (info.file.response.data) {
          this.imageUrl3 = info.file.response.data[0]
          this.page.attribute5 = this.imageUrl3
        } else {
          if (info.file.response.status === 'T') {
            this.$store.commit('setVisibleLogin', true)
          }
          this.$message.error(info.file.response.msg)
        }
      }
    },
    handleChange4 (info) {
      if (info.file.status === 'uploading') {
        this.loadingImg3 = true
        if (info && info.event && info.event.percent) {
          this.percentImg4 = info.event.percent
          this.percentImg4 = this.percentImg4.toFixed(2)
        }
        return
      }
      if (info.file.status === 'done') {
        this.loadingImg4 = false
        this.percentImg4 = 100
        if (info.file.response.data) {
          this.imageUrl4 = info.file.response.data[0]
          this.page.attribute7 = this.imageUrl4
        } else {
          if (info.file.response.status === 'T') {
            this.$store.commit('setVisibleLogin', true)
          }
          this.$message.error(info.file.response.msg)
        }
      }
    },
    handleChange5 (info) {
      if (info.file.status === 'uploading') {
        this.loadingImg5 = true
        if (info && info.event && info.event.percent) {
          this.percentImg5 = info.event.percent
          this.percentImg5 = this.percentImg5.toFixed(2)
        }
        return
      }
      if (info.file.status === 'done') {
        this.loadingImg5 = false
        this.percentImg5 = 100
        if (info.file.response.data) {
          this.imageUrl5 = info.file.response.data[0]
          this.page.attribute9 = this.imageUrl5
        } else {
          if (info.file.response.status === 'T') {
            this.$store.commit('setVisibleLogin', true)
          }
          this.$message.error(info.file.response.msg)
        }
      }
    },
    beforeUpload (file) {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
      if (!isJpgOrPng) {
        this.$message.error('只能上传JPG或PNG图片!')
      }
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('上传的图片不能大于2MB!')
      }
      return isJpgOrPng && isLt2M
    },
    beforeUpload2 (file) {
      const isVideo = file.type === 'video/mp4'
      if (!isVideo) {
        this.$message.error('只能上传mp4视频!')
      }
      const isLt35M = file.size / 1024 / 1024 < 100
      if (!isLt35M) {
        this.$message.error('上传的视频不能大于100MB!')
      }
      return isVideo && isLt35M
    }
  }
}
</script>

<style lang="less" scoped>
</style>
