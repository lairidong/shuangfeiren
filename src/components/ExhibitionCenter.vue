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
        <a-row :gutter="[24,24]">
          <a-col :span="12">
            <UploadImgComponent :imgSize="imgSize" :imgName="'上传视频封面'" :imageUrl.sync="page.img" :actionUrl="actionUrl"></UploadImgComponent>
          </a-col>
        </a-row>
        <a-row :gutter="[24, 24]">
          <a-col :span="12">
            <UploadFileComponent :maxSize="100" :fileType="'mp4'" :imgName="'上传视频'" :fileUrl.sync="page.attribute1" :actionUrl="actionUrlVideo"></UploadFileComponent>
          </a-col>
        </a-row>
        <a-row :gutter="[24, 24]">
          <a-col :span="12">
            <a-form-item label="文字说明1">
              <a-textarea
                v-model="page.page_content"
                placeholder=""
                :auto-size="{ minRows: 3, maxRows: 5 }"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="[24,24]">
          <a-col :span="12">
            <UploadImgComponent :imgSize="imgSize" :imgName="'第二部分内容的图片'" :imageUrl.sync="page.attribute2" :actionUrl="actionUrl"></UploadImgComponent>
          </a-col>
        </a-row>
        <a-row :gutter="[24, 24]">
          <a-col :span="12">
            <UploadImgListComponent :imgSize="imgSize3" :imgName="'图片集'" :imageUrl.sync="page.attribute3" :actionUrl="actionUrl" :headers="headers"></UploadImgListComponent>
          </a-col>
        </a-row>
        <a-row :gutter="[24,24]">
          <a-col :span="12">
            <a-form-item label="第二部分内容">
              <a-textarea
                v-model="page.attribute4"
                placeholder=""
                :auto-size="{ minRows: 3, maxRows: 5 }"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
          </a-col>
        </a-row>
        <a-row :gutter="[24,24]">
          <a-col :span="12">
            <UploadImgComponent :imgSize="imgSize" :imgName="'第三部分内容的图片'" :imageUrl.sync="page.attribute5" :actionUrl="actionUrl"></UploadImgComponent>
          </a-col>
        </a-row>
        <a-row :gutter="[24, 24]">
          <a-col :span="12">
            <UploadImgListComponent :imgSize="imgSize3" :imgName="'图片集'" :imageUrl.sync="page.attribute6" :actionUrl="actionUrl" :headers="headers"></UploadImgListComponent>
          </a-col>
        </a-row>
        <a-row :gutter="[24,24]">
          <a-col :span="12">
            <a-form-item label="第三部分内容">
              <a-textarea
                v-model="page.attribute7"
                placeholder=""
                :auto-size="{ minRows: 3, maxRows: 5 }"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
          </a-col>
        </a-row>
        <a-row :gutter="[24,24]">
          <a-col :span="24">
            <a-button
              icon="save"
              type="primary"
              @click="handleSave()"
              v-action:exhibition-center-edit
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
import VueUeditorWrap from 'vue-ueditor-wrap'
import moment from 'moment'
import 'moment/locale/zh-cn'
import locale from 'ant-design-vue/es/date-picker/locale/zh_CN'
import UploadImgComponent from './modules/UploadImg.component'
import ImgTextListComponent from './modules/ImgTextlist.component'
import UploadImgListComponent from './modules/UploadImgList.component'
import UploadFileComponent from './modules/UploadFile.component'

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
      showImg: false,
      imgName: '',
      imgSize2: '',
      showImg2: false,
      imgName2: '',
      imgSize3: '',
      showImg3: false,
      imgName3: '',
      headers: {
        AccessToken: localStorage.getItem('token')
      },
      actionUrl: this.$baseUrl + 'admin/article/upload_img' + (process.env.NODE_ENV === 'development' ? '?voucher=token' : '?voucher=session'),
      actionUrlVideo: this.$baseUrl + 'admin/article/upload_video' + (process.env.NODE_ENV === 'development' ? '?voucher=token' : '?voucher=session'),
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
      },
      myConfig: {
        // 编辑器不自动被内容撑高
        autoHeightEnabled: false,
        // 初始容器高度
        initialFrameHeight: 300,
        // 初始容器宽度
        initialFrameWidth: '100%',
        // 上传文件接口（这个地址是我为了方便各位体验文件上传功能搭建的临时接口，请勿在生产环境使用！！！部署在国外的服务器，如果无法访问，请自备梯子）
        serverUrl: '/_UEditor_/php/controller.php',
        // UEditor 资源文件的存放路径，如果你使用的是 vue-cli 生成的项目，通常不需要设置该选项，vue-ueditor-wrap 会自动处理常见的情况，如果需要特殊配置，参考下方的常见问题2
        UEDITOR_HOME_URL: '/_UEditor_/'
      }
    }
  },
  name: 'ExhibitionCenter',
  components: {
    VueUeditorWrap,
    UploadImgComponent,
    ImgTextListComponent,
    UploadImgListComponent,
    UploadFileComponent
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
          code: 'exhibition-center'
        })
        .then((res) => {
          if (res.data.status === 'S') {
            this.parent_column_name = res.data.data.column_name
            this.title = res.data.data.column_name
            this.$http
              .post('admin/column/getColumnByCode', {
                code: 'exhibition-center'
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
          code: 'exhibition-center'
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
      this.page.code = 'exhibition-center'
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
