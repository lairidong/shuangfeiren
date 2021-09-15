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
        <a-row :gutter="16">
          <a-col :span="24">
            <a-form-item label="供应链解决方案">
              <vue-ueditor-wrap v-model="page.page_content" :config="myConfig"></vue-ueditor-wrap>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="[24, 24]">
          <a-col :span="24">
            <ImgTextListComponent
              :list.sync="page.attribute1"
              :title="'图文列表'"
              :vActionName="'supply-chain-solution'"
              :imgSize="imgSize"
              :imgName="imgName"
              :showSummary="true"
              :showUrl="false"
              :maxAdd="20"
              :headers="headers"
            ></ImgTextListComponent>
          </a-col>
        </a-row>
        <a-row :gutter="[24, 24]">
          <a-col :span="24">
            <a-button icon="save" type="primary" @click="handleSave()" v-action:supply-chain-solution-edit>
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
      labelCol: { },
      wrapperCol: { },
      tableLoading: false,
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
      imgSize3: '',
      imgSize4: '',
      imgName: '',
      imgName2: '',
      imgName3: '',
      imgName4: '',
      showImg: false,
      showImg2: false,
      showImg3: false,
      showImg4: false,
      headers: {
        AccessToken: localStorage.getItem('token')
      },
      actionUrl: this.$baseUrl + 'admin/article/upload_img' + (process.env.NODE_ENV === 'development' ? '?voucher=token' : '?voucher=session'),
      actionUrl2: this.$baseUrl + 'admin/img/upload_video' + (process.env.NODE_ENV === 'development' ? '?voucher=token' : '?voucher=session'),
      rules: {
        // cate_id: [{ required: true, message: '请选择分类', trigger: 'blur' }],
        // title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
      },
      myConfig: {
        // 编辑器不自动被内容撑高
        autoHeightEnabled: false,
        // 初始容器高度
        initialFrameHeight: 340,
        // 初始容器宽度
        initialFrameWidth: '100%',
        // 上传文件接口（这个地址是我为了方便各位体验文件上传功能搭建的临时接口，请勿在生产环境使用！！！部署在国外的服务器，如果无法访问，请自备梯子）
        serverUrl: '/_UEditor_/php/controller.php',
        // UEditor 资源文件的存放路径，如果你使用的是 vue-cli 生成的项目，通常不需要设置该选项，vue-ueditor-wrap 会自动处理常见的情况，如果需要特殊配置，参考下方的常见问题2
        UEDITOR_HOME_URL: '/_UEditor_/'
      }
    }
  },
  name: 'SupplyChainSolution',
  components: {
    VueUeditorWrap,
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
          code: 'supply-chain-solution'
        })
        .then((res) => {
          if (res.data.status === 'S') {
            this.parent_column_name = res.data.data.column_name
            this.title = res.data.data.column_name
            this.$http
              .post('admin/column/getColumnByCode', {
                code: 'supply-chain-solution'
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
          code: 'supply-chain-solution'
        })
        .then(res => {
          if (res.data.status === 'S') {
            this.page = res.data.data
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
      this.page.code = 'supply-chain-solution'
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
    }
  }
}
</script>

<style lang="less" scoped>
</style>
