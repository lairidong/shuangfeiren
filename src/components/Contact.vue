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
          <a-col :span="8">
            <a-form-model-item ref="attribute1" label="全国服务热线" prop="attribute1">
              <a-input
                v-model="page.attribute1"
              />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="8">
            <a-card title="樟树总部" :bordered="true">
              <a-row :gutter="24">
                <a-col :span="24">
                  <a-form-model-item ref="attribute2" label="电话" prop="attribute2">
                    <a-input
                      v-model="page.attribute2"
                    />
                  </a-form-model-item>
                </a-col>
                <a-col :span="24">
                  <a-form-model-item ref="attribute3" label="传真" prop="attribute3">
                    <a-input
                      v-model="page.attribute3"
                    />
                  </a-form-model-item>
                </a-col>
                <a-col :span="24">
                  <a-form-model-item ref="attribute4" label="地址" prop="attribute4">
                    <a-input
                      v-model="page.attribute4"
                    />
                  </a-form-model-item>
                </a-col>
              </a-row>
            </a-card>
          </a-col>
          <a-col :span="8">
            <a-card title="广州总部" :bordered="true">
              <a-row :gutter="24">
                <a-col :span="24">
                  <a-form-model-item ref="attribute5" label="电话" prop="attribute5">
                    <a-input
                      v-model="page.attribute5"
                    />
                  </a-form-model-item>
                </a-col>
                <a-col :span="24">
                  <a-form-model-item ref="attribute6" label="传真" prop="attribute6">
                    <a-input
                      v-model="page.attribute6"
                    />
                  </a-form-model-item>
                </a-col>
                <a-col :span="24">
                  <a-form-model-item ref="attribute7" label="地址" prop="attribute7">
                    <a-input
                      v-model="page.attribute7"
                    />
                  </a-form-model-item>
                </a-col>
              </a-row>
            </a-card>
          </a-col>
        </a-row>
        <a-row :gutter="[24, 24]">
          <a-col :span="24">
            <a-button
              icon="save"
              type="primary"
              @click="handleSave()"
              v-action:contact-edit
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
import UploadImgComponent from './modules/UploadImg.component'

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
        attribute5: '',
        attribute6: '',
        attribute7: ''
      },
      action: '',
      visible: false,
      imgSize: '',
      loadingImg: false,
      percentImg: 0,
      imageUrl: '',
      showImg: false,
      imgName: '',
      imgSize2: '',
      loadingImg2: false,
      percentImg2: 0,
      imageUrl2: '',
      showImg2: false,
      imgName2: '',
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
        attribute5: [{ required: false, message: '', trigger: 'blur' }],
        attribute6: [{ required: false, message: '', trigger: 'blur' }],
        attribute7: [{ required: false, message: '', trigger: 'blur' }]
      }
    }
  },
  name: 'Contact',
  components: {
    UploadImgComponent
  },
  created () {
    this.getContent()
    this.getColumnByCode()
    this.$root.$on('updateToken', (data) => {
      this.headers.AccessToken = data
    })
  },
  methods: {
    getColumnByCode () {
      this.$http
        .post('admin/column/getParentColumnByCode', {
          code: 'contact'
        })
        .then((res) => {
          if (res.data.status === 'S') {
            this.parent_column_name = res.data.data.column_name
            this.title = res.data.data.column_name
            this.$http
              .post('admin/column/getColumnByCode', {
                code: 'contact'
              })
              .then((res2) => {
                if (res2.data.status === 'S') {
                  const data = res2.data.data
                  if (data.img_size && data.img_size !== '') {
                    this.imgSize = '图片尺寸：' + data.img_size.replace(',', '×') + '像素'
                    this.showImg = true
                  } else {
                    this.imgSize = ''
                    this.showImg = false
                  }
                  if (data.img_size2 && data.img_size2 !== '') {
                    this.imgSize2 = '图片尺寸：' + data.img_size2.replace(',', '×') + '像素'
                    this.showImg2 = true
                  } else {
                    this.imgSize2 = ''
                    this.showImg2 = false
                  }
                  if (data.img_title && data.img_name !== '') {
                    this.imgName = data.img_title
                  }
                  if (data.img_title2 && data.img_title2 !== '') {
                    this.imgName2 = data.img_title2
                  }
                  this.column_name = data.column_name
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
          code: 'contact'
        })
        .then((res) => {
          if (res.data.status === 'S') {
            this.page = res.data.data
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
      this.page.code = 'contact'
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
