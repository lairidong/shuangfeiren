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
            <a-form-model-item
              ref="img"
              label="右侧图片"
              prop="img"
              :extra="imgSize"
            >
              <a-upload
                name="files[]"
                list-type="picture-card"
                class="avatar-uploader"
                :disabled="!$store.getters.hasPermission('consultation-edit')"
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
        <a-row :gutter="24">
          <a-col :span="6">
            <a-form-model-item ref="attribute1" label="电话" prop="attribute1">
              <a-input
                v-model="page.attribute1"
                @blur="
                  () => {
                    $refs.attribute1.onFieldBlur();
                  }
                "
              />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="6">
            <a-form-model-item ref="attribute2" label="传真" prop="attribute2">
              <a-input
                v-model="page.attribute2"
                @blur="
                  () => {
                    $refs.attribute2.onFieldBlur();
                  }
                "
              />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="6">
            <a-form-model-item ref="attribute3" label="邮箱" prop="attribute3">
              <a-input
                v-model="page.attribute3"
                @blur="
                  () => {
                    $refs.attribute3.onFieldBlur();
                  }
                "
              />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="8">
            <a-form-model-item ref="attribute4" label="公司地址" prop="attribute4">
              <a-textarea
                v-model="page.attribute4"
                placeholder=""
                :auto-size="{ minRows: 3, maxRows: 5 }"
              />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="8">
            <a-form-model-item ref="attribute5" label="豪美新材服务热线" prop="attribute5">
              <a-textarea
                v-model="page.attribute5"
                placeholder=""
                :auto-size="{ minRows: 3, maxRows: 5 }"
              />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="24">
            <a-button
              icon="save"
              type="primary"
              @click="handleSave()"
              v-action:about-edit
            >
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
      pageSize: 100,
      currentPage: 1,
      total: 0,
      data: [],
      moment,
      locale,
      parent_column_name: '',
      column_name: '',
      labelCol: {},
      wrapperCol: {},
      tableLoading: false,
      page: {
        page_title: '',
        page_content: '',
        img: '',
        banner: '',
        attribute1: '',
        attribute2: '',
        attribute3: '',
        attribute4: '',
        attribute5: ''
      },
      action: '',
      visible: false,
      imgSize: '',
      loadingImg: false,
      percentImg: 0,
      imageUrl: '',
      headers: {
        AccessToken: localStorage.getItem('token')
      },
      actionUrl: this.$baseUrl + 'admin/article/upload_img' + (process.env.NODE_ENV === 'development' ? '?voucher=token' : '?voucher=session'),
      rules: {
        page_title: [
          { required: false, message: '请输入标题', trigger: 'blur' }
        ],
        page_content: [
          { required: false, message: '请输入内容', trigger: 'blur' }
        ],
        img: [{ required: false, message: '请上传图标', trigger: 'blur' }],
        attribute1: [{ required: false, message: '', trigger: 'blur' }],
        attribute2: [{ required: false, message: '', trigger: 'blur' }],
        attribute3: [{ required: false, message: '', trigger: 'blur' }],
        attribute4: [{ required: false, message: '', trigger: 'blur' }],
        attribute5: [{ required: false, message: '', trigger: 'blur' }]
      }
    }
  },
  name: 'Consultation',
  components: {
  },
  created () {
    this.getContent()
    this.getColumnByCode()
    this.setImgSizeText()
    this.$root.$on('updateToken', (data) => {
      this.headers.AccessToken = data
    })
  },
  methods: {
    setImgSizeText () {
      if (this.$route.query.img) {
        this.imgSize =
          '图片尺寸：' + this.$route.query.img.replace(',', '×') + '像素'
      } else {
        this.imgSize = ''
      }
    },
    getColumnByCode () {
      this.$http
        .post('admin/column/getParentColumnByCode', {
          code: 'consultation'
        })
        .then((res) => {
          if (res.data.status === 'S') {
            this.parent_column_name = res.data.data.column_name
            this.title = res.data.data.column_name
            this.$http
              .post('admin/column/getColumnByCode', {
                code: 'consultation'
              })
              .then((res2) => {
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
          code: 'consultation'
        })
        .then((res) => {
          if (res.data.status === 'S') {
            this.page = res.data.data
            this.imageUrl = this.page.attribute6
          } else if (res.data.status !== 'T') {
            this.$error({
              title: '提示',
              content: res.data.msg
            })
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    handleSave () {
      this.page.page_title = this.parent_column_name
      this.page.attribute6 = this.imageUrl
      this.page.code = 'consultation'
      this.$http
        .post('admin/page/edit', this.page)
        .then((res) => {
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
        .catch((error) => {
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
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('上传的图片不能大于2MB!')
      }
      return isJpgOrPng && isLt2M
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .ant-upload.ant-upload-select-picture-card > .ant-upload{
  img{
    max-width: 500px;
  }
}
</style>
