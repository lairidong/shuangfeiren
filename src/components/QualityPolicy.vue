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
      <a-tabs defaultActiveKey="1" @change="handleChangeTabs">
        <a-tab-pane key="1" tab="基本信息">
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
                <a-form-model-item ref="content" label="详情内容" prop="content">
                  <vue-ueditor-wrap v-model="page.page_content" :config="myConfig"></vue-ueditor-wrap>
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="24">
                <a-button icon="save" type="primary" @click="handleSave()" v-action:quality-policy-edit>
                  保存
                </a-button>
              </a-col>
            </a-row>
          </a-form-model>
        </a-tab-pane>
        <a-tab-pane key="2" tab="第一屏内容">
          <div class="tool-bar" style="margin-bottom: 16px">
            <a-row>
              <a-col :span="12">
                <div class="page-title"></div>
              </a-col>
              <a-col :span="12">
                <div class="btn-box">
                  <!-- <a-button icon="plus" type="primary" @click="addItem(1)">添加</a-button> -->
                  <a-button icon="reload" type="link" @click="reload" :loading="tableLoading"></a-button>
                </div>
              </a-col>
            </a-row>
          </div>
          <a-table
            :columns="columns"
            :data-source="data"
            :pagination="false"
            row-key="page_id"
            size="small"
          >
            <div slot="img" slot-scope="text">
              <img :src="text.img" style="max-width: 50px;">
            </div>
            <div class="action-box" slot="action" slot-scope="text">
              <a-tooltip placement="top" v-action:quality-policy-edit>
                <template slot="title">
                  <span>修改</span>
                </template>
                <a-button type="primary" icon="edit" @click="editItem(text, 1)"></a-button>
              </a-tooltip>
              <!-- <a-tooltip placement="top">
                <template slot="title">
                  <span>删除</span>
                </template>
                <a-button type="danger" icon="rest" @click="deleteItem(text.page_id)"></a-button>
              </a-tooltip> -->
            </div>
          </a-table>
        </a-tab-pane>
        <a-tab-pane key="3" tab="第二屏内容">
          <div class="tool-bar" style="margin-bottom: 16px">
            <a-row>
              <a-col :span="12">
                <div class="page-title"></div>
              </a-col>
              <a-col :span="12">
                <div class="btn-box">
                  <!-- <a-button icon="plus" type="primary" @click="addItem(2)">添加</a-button> -->
                  <a-button icon="reload" type="link" @click="reload" :loading="tableLoading"></a-button>
                </div>
              </a-col>
            </a-row>
          </div>
          <a-table
            :columns="columns"
            :data-source="data2"
            :pagination="false"
            row-key="page_id"
            size="small"
          >
            <div slot="img" slot-scope="text">
              <img :src="text.img" style="max-width: 50px;">
            </div>
            <div class="action-box" slot="action" slot-scope="text">
              <a-tooltip placement="top" v-action:quality-policy-edit>
                <template slot="title">
                  <span>修改</span>
                </template>
                <a-button type="primary" icon="edit" @click="editItem(text, 2)"></a-button>
              </a-tooltip>
              <!-- <a-tooltip placement="top">
                <template slot="title">
                  <span>删除</span>
                </template>
                <a-button type="danger" icon="rest" @click="deleteItem(text.page_id)"></a-button>
              </a-tooltip> -->
            </div>
          </a-table>
        </a-tab-pane>
        <a-tab-pane key="4" tab="第三屏内容">
          <div class="tool-bar" style="margin-bottom: 16px">
            <a-row>
              <a-col :span="12">
                <div class="page-title"></div>
              </a-col>
              <a-col :span="12">
                <div class="btn-box">
                  <!-- <a-button icon="plus" type="primary" @click="addItem(3)">添加</a-button> -->
                  <a-button icon="reload" type="link" @click="reload" :loading="tableLoading"></a-button>
                </div>
              </a-col>
            </a-row>
          </div>
          <a-table
            :columns="columns"
            :data-source="data3"
            :pagination="false"
            row-key="page_id"
            size="small"
          >
            <div slot="img" slot-scope="text">
              <img :src="text.img" style="max-width: 50px;">
            </div>
            <div class="action-box" slot="action" slot-scope="text">
              <a-tooltip placement="top" v-action:quality-policy-edit>
                <template slot="title">
                  <span>修改</span>
                </template>
                <a-button type="primary" icon="edit" @click="editItem(text, 3)"></a-button>
              </a-tooltip>
              <!-- <a-tooltip placement="top">
                <template slot="title">
                  <span>删除</span>
                </template>
                <a-button type="danger" icon="rest" @click="deleteItem(text.page_id)"></a-button>
              </a-tooltip> -->
            </div>
          </a-table>
        </a-tab-pane>
      </a-tabs>
    </div>

    <a-drawer
      :title="action + '信息'"
      :width="'calc(100% - 200px)'"
      @close="onClose"
      :visible="visible"
      :bodyStyle="{paddingBottom: '80px'}"
    >
      <a-form-model
        ref="ruleForm"
        layout="vertical"
        :model="form"
        :rules="rules2"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-model-item ref="page_title" label="标题" prop="page_title">
              <a-input
                v-model="form.page_title"
                @blur="
                  () => {
                    $refs.page_title.onFieldBlur();
                  }
                "
              />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="24" v-if="showContent">
          <a-col :span="24">
            <a-form-model-item ref="page_content" label="详细信息" prop="page_content">
              <a-textarea
                v-model="form.page_content"
                :auto-size="{ minRows: 5, maxRows: 7 }"
                @blur="
                  () => {
                    $refs.page_content.onFieldBlur();
                  }
                "
              />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="24" v-if="showImg">
          <a-col :span="24" style="margin-top: 8px;">
            <a-form-model-item ref="img" label="上传图片" prop="img" :extra="tabKey==3?imgSize:imgSize2">
              <a-upload
                name="files[]"
                list-type="picture-card"
                class="avatar-uploader"
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
          <a-col :span="24">
            <div
              :style="{
                width: '100%',
                borderTop: '1px solid #e9e9e9',
                padding: '10px 0',
                background: '#fff',
                textAlign: 'right',
              }"
            >
              <a-button :style="{marginRight: '8px'}" size="large" @click="onClose">取消</a-button>
              <a-button type="primary" html-type="submit" size="large" @click="handleOnSubmit">提交</a-button>
            </div>
          </a-col>
        </a-row>
      </a-form-model>
    </a-drawer>
  </div>
</template>

<script>
import VueUeditorWrap from 'vue-ueditor-wrap'
import moment from 'moment'
import 'moment/locale/zh-cn'
import locale from 'ant-design-vue/es/date-picker/locale/zh_CN'
const columns = [
  // {
  //   title: '图标',
  //   dataIndex: '',
  //   key: 'img',
  //   scopedSlots: { customRender: 'img' }
  // },
  { title: '标题', dataIndex: 'page_title', key: 'page_title' },
  {
    title: '操作',
    dataIndex: '',
    key: 'x',
    width: '100px',
    scopedSlots: { customRender: 'action' }
  }
]
export default {
  data () {
    return {
      tabKey: 1,
      pageSize: 100,
      currentPage: 1,
      total: 0,
      data: [],
      data2: [],
      data3: [],
      columns,
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
      form: {
        page_title: '',
        page_content: '',
        img: ''
      },
      action: '',
      visible: false,
      imgSize: '',
      imgSize2: '',
      loadingImg: false,
      percentImg: 0,
      imageUrl: '',
      loadingImg2: false,
      percentImg2: 0,
      imageUrl2: '',
      headers: {
        AccessToken: localStorage.getItem('token')
      },
      actionUrl: this.$baseUrl + 'admin/article/upload_img' + (process.env.NODE_ENV === 'development' ? '?voucher=token' : '?voucher=session'),
      rules: {
        // cate_id: [{ required: true, message: '请选择分类', trigger: 'blur' }],
        // title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
      },
      rules2: {
        page_title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        page_content: [{ required: true, message: '请输入内容', trigger: 'blur' }],
        img: [{ required: true, message: '请上传图标', trigger: 'blur' }]
      },
      myConfig: {
        // 编辑器不自动被内容撑高
        autoHeightEnabled: false,
        // 初始容器高度
        initialFrameHeight: 540,
        // 初始容器宽度
        initialFrameWidth: '100%',
        // 上传文件接口（这个地址是我为了方便各位体验文件上传功能搭建的临时接口，请勿在生产环境使用！！！部署在国外的服务器，如果无法访问，请自备梯子）
        serverUrl: '/_UEditor_/php/controller.php',
        // UEditor 资源文件的存放路径，如果你使用的是 vue-cli 生成的项目，通常不需要设置该选项，vue-ueditor-wrap 会自动处理常见的情况，如果需要特殊配置，参考下方的常见问题2
        UEDITOR_HOME_URL: '/_UEditor_/'
      },
      showContent: true,
      showImg: true
    }
  },
  name: 'QualityPolicy',
  components: {
    VueUeditorWrap
  },
  created () {
    this.getContent()
    this.getList()
    this.getList2()
    this.getList3()
    this.getColumnByCode()
    this.setImgSizeText()
    this.$root.$on('updateToken', (data) => {
      this.headers.AccessToken = data
    })
  },
  methods: {
    handleChangeTabs (val) {
      this.tabKey = val
    },
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
          code: 'quality-policy'
        })
        .then((res) => {
          if (res.data.status === 'S') {
            this.parent_column_name = res.data.data.column_name
            this.$http
              .post('admin/column/getColumnByCode', {
                code: 'quality-policy'
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
    getList () {
      this.tableLoading = true
      this.$http
        .post('admin/page/getList', {
          code: 'quality-policy-service'
        })
        .then(res => {
          if (res.data.status === 'S') {
            this.data = res.data.data
          } else if (res.data.status !== 'T') {
            this.$error({
              title: '提示',
              content: res.data.msg
            })
          }
          this.tableLoading = false
        })
        .catch(error => {
          console.log(error)
          this.tableLoading = false
        })
    },
    getList2 () {
      this.tableLoading = true
      this.$http
        .post('admin/page/getList', {
          code: 'quality-policy-img'
        })
        .then(res => {
          if (res.data.status === 'S') {
            this.data2 = res.data.data
          } else if (res.data.status !== 'T') {
            this.$error({
              title: '提示',
              content: res.data.msg
            })
          }
          this.tableLoading = false
        })
        .catch(error => {
          console.log(error)
          this.tableLoading = false
        })
    },
    getList3 () {
      this.tableLoading = true
      this.$http
        .post('admin/page/getList', {
          code: 'quality-policy-ability'
        })
        .then(res => {
          if (res.data.status === 'S') {
            this.data3 = res.data.data
          } else if (res.data.status !== 'T') {
            this.$error({
              title: '提示',
              content: res.data.msg
            })
          }
          this.tableLoading = false
        })
        .catch(error => {
          console.log(error)
          this.tableLoading = false
        })
    },
    // 刷新数据
    reload () {
      this.getList()
      this.getList2()
      this.getList3()
    },
    // 页面跳转
    onChangePage (e) {
      this.currentPage = e.current
      this.getList()
      this.getList2()
      this.getList3()
    },
    onClose () {
      this.visible = false
    },
    addItem (index) {
      this.showContent = true
      this.showImg = true
      let code = 'quality-policy-service'
      if (index === 1) {
        this.showImg = false
      }
      if (index === 2) {
        code = 'quality-policy-img'
      }
      if (index === 3) {
        this.showContent = false
        code = 'quality-policy-ability'
      }
      this.form = {
        page_id: '',
        page_title: '',
        code: code,
        img: '',
        page_content: ''
      }
      this.imageUrl2 = ''
      this.visible = true
      this.action = '新增'
    },
    editItem (item, index) {
      this.showContent = true
      this.showImg = true
      if (index === 1) {
        this.showImg = false
      }
      if (index === 3) {
        this.showContent = false
      }
      this.form = {
        page_id: item.page_id,
        page_title: item.page_title,
        code: item.code,
        img: item.img,
        page_content: item.page_content
      }
      this.imageUrl2 = item.img
      this.visible = true
      this.action = '编辑'
    },
    // 删除单个
    deleteItem (id) {
      const self = this
      this.$confirm({
        title: '提示',
        content: '确定要删除吗?',
        okText: '确定',
        cancelText: '取消',
        onOk () {
          self.$http
            .post('admin/page/del', {
              page_id: id
            })
            .then(res => {
              if (res.data.status === 'S') {
                self.$message.success('删除成功')
                self.getList()
                self.getList2()
                self.getList3()
              } else if (res.data.status !== 'T') {
                self.$error({
                  title: '提示',
                  content: res.data.msg
                })
              }
            })
            .catch(error => {
              console.log(error)
            })
        }
      })
    },
    handleOnSubmit () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          const params = JSON.parse(JSON.stringify(this.form))
          params.img = this.imageUrl2
          this.$http
            .post('admin/page/edit', params)
            .then(res => {
              if (res.data.status === 'S') {
                this.getList()
                this.getList2()
                this.getList3()
                this.visible = false
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
        } else {
          return false
        }
      })
    },
    getContent () {
      this.$http
        .post('admin/page/getContent', {
          code: 'quality-policy'
        })
        .then(res => {
          if (res.data.status === 'S') {
            this.page = res.data.data
            this.imageUrl = this.page.img
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
      this.page.img = this.imageUrl
      this.page.code = 'quality-policy'
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
          this.form.img = this.imageUrl2
          this.$refs.ruleForm.clearValidate()
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
    }
  }
}
</script>

<style lang="less" scoped>
</style>
