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
        <a-row :gutter="[24, 24]">
          <a-col :span="24">
            <ImgTextListComponent
              :list.sync="page.attribute1"
              :title="'轮播图'"
              :vActionName="'guide-page-home'"
              :imgSize="imgSize"
              :imgSize2="imgSize2"
              :imgName="'PC端图片'"
              :imgName2="'移动端图片'"
              :showImg2="true"
              :showSummary="false"
              :showUrl="false"
              :maxAdd="8"
              :headers="headers"
            ></ImgTextListComponent>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-model-item ref="attribute2" label="中部标题" prop="attribute2">
              <a-input
                v-model="page.attribute2"
                placeholder=""
              />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-model-item ref="attribute3" label="中部内容" prop="attribute3">
              <a-textarea
                v-model="page.attribute3"
                placeholder=""
                :auto-size="{ minRows: 2, maxRows: 5 }"
              />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="[24, 24]">
          <a-col :span="24">
            <ImgTextListComponent
              :list.sync="page.attribute4"
              :title="'中部列表'"
              :vActionName="'guide-page-home'"
              :imgSize="imgSize3"
              :imgName="imgName"
              :showImg="true"
              :showSubTitle="true"
              :showSummary="false"
              :showUrl="true"
              :maxAdd="4"
              :headers="headers"
            ></ImgTextListComponent>
          </a-col>
        </a-row>
        <a-row :gutter="[24, 24]">
          <a-col :span="24">
            <ImgTextListComponent
              :list.sync="page.attribute5"
              :title="'底部列表'"
              :vActionName="'guide-page-home'"
              :imgSize="imgSize4"
              :imgSize2="imgSize4"
              :imgName="imgName"
              :imgName2="imgName"
              :showImg="true"
              :showImg2="true"
              :showSummary="true"
              :showUrl="true"
              :maxAdd="4"
              :headers="headers"
            ></ImgTextListComponent>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="24">
            <a-button
              icon="save"
              type="primary"
              @click="handleSave()"
              v-action:guide-page-home-edit
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
import ImgTextListComponent from './modules/ImgTextlist.component'

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
      imgName: '',
      imgSize2: '',
      imgName2: '',
      imgSize3: '',
      imgName3: '',
      imgSize4: '',
      imgName4: '',
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
  name: 'GuidePageHome',
  components: {
    UploadImgComponent,
    ImgTextListComponent
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
          code: 'guide-page-home'
        })
        .then((res) => {
          if (res.data.status === 'S') {
            this.parent_column_name = res.data.data.column_name
            this.title = res.data.data.column_name
            this.$http
              .post('admin/column/getColumnByCode', {
                code: 'guide-page-home'
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
                  if (data.img_size3 && data.img_size3 !== '') {
                    this.imgSize3 = '图片尺寸：' + data.img_size3.replace(',', '×') + '像素'
                    this.showImg3 = true
                  } else {
                    this.imgSize3 = ''
                    this.showImg3 = false
                  }
                  if (data.img_size4 && data.img_size4 !== '') {
                    this.imgSize4 = '图片尺寸：' + data.img_size4.replace(',', '×') + '像素'
                    this.showImg4 = true
                  } else {
                    this.imgSize4 = ''
                    this.showImg4 = false
                  }
                  if (data.img_title && data.img_name !== '') {
                    this.imgName = data.img_title
                  }
                  if (data.img_title2 && data.img_title2 !== '') {
                    this.imgName2 = data.img_title2
                  }
                  if (data.img_title3 && data.img_title3 !== '') {
                    this.imgName3 = data.img_title3
                  }
                  if (data.img_title4 && data.img_title4 !== '') {
                    this.imgName4 = data.img_title4
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
          code: 'guide-page-home'
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
      this.page.code = 'guide-page-home'
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
