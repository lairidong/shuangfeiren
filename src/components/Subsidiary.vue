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
        <a-tabs defaultActiveKey="1">
          <a-tab-pane key="1" tab="子公司列表">
            <div class="tool-bar" style="margin-bottom: 16px">
              <a-row>
                <a-col :span="24">
                  <div class="btn-box">
                    <a-button icon="plus" type="primary" @click="addFunctionItem()" v-action:subsidiary-edit>添加</a-button>
                  </div>
                </a-col>
              </a-row>
            </div>
            <a-table
              :columns="functionColumns"
              :data-source="functionData"
              :pagination="false"
              row-key="function_id"
              size="small"
            >
              <div slot="img" slot-scope="text">
                <img :src="text.img" style="max-width: 80px; max-height: 40px; cursor: pointer;" alt="">
              </div>
              <div slot="sort" slot-scope="text">
                <div>{{ text.sort }}</div>
              </div>
              <div class="action-box" slot="action" slot-scope="text">
                <a-tooltip placement="top" v-action:subsidiary-edit>
                  <template slot="title">
                    <span>修改</span>
                  </template>
                  <a-button type="primary" icon="edit" @click="editFunction(text)"></a-button>
                </a-tooltip>
                <a-tooltip placement="top" v-action:subsidiary-edit>
                  <template slot="title">
                    <span>删除</span>
                  </template>
                  <a-button type="danger" icon="rest" @click="deleteFunction(text.function_id)"></a-button>
                </a-tooltip>
              </div>
            </a-table>
            <a-row :gutter="24" style="margin-top: 24px;">
              <a-col :span="24">
                <a-button icon="save" type="primary" @click="handleSave()" v-action:subsidiary-edit>
                  保存
                </a-button>
              </a-col>
            </a-row>
          </a-tab-pane>
          <a-tab-pane key="2" tab="首页相关">
            <div class="tool-bar" style="margin-bottom: 16px">
              <a-row>
                <a-col :span="24">
                  <div class="btn-box">
                    <a-button icon="plus" type="primary" @click="addAdvantageItem()" v-action:subsidiary-edit>添加</a-button>
                  </div>
                </a-col>
              </a-row>
            </div>
            <a-table
              :columns="advantageColumns"
              :data-source="advantageData"
              :pagination="false"
              row-key="advantage_id"
              size="small"
            >
              <div slot="img" slot-scope="text">
                <img :src="text.img" style="max-width: 80px; max-height: 40px; cursor: pointer;" alt="">
              </div>
              <div slot="sort" slot-scope="text">
                <div style="border-bottom: 1px solid #ddd; padding: 5px 0; text-indent: 12px;" v-if="!text.editable || !$store.getters.hasPermission('subsidiary-edit')" @click="showEdit(text)">{{ text.sort }}</div>
                <div v-else>
                  <a-input class="input-sort" :id="`input_advantage_${text.advantage_id}`" v-model="text.sort" @blur="text.oldSort===text.sort?text.editable=false:text.editable=true">
                    <a-button class="btn-sort" slot="addonAfter" size="small" @click="updateSort(text)">
                      <a-icon type="save" />
                    </a-button>
                  </a-input>
                </div>
              </div>
              <div class="action-box" slot="action" slot-scope="text">
                <a-tooltip placement="top" v-action:subsidiary-edit>
                  <template slot="title">
                    <span>修改</span>
                  </template>
                  <a-button type="primary" icon="edit" @click="editAdvantage(text)"></a-button>
                </a-tooltip>
                <a-tooltip placement="top" v-action:subsidiary-edit>
                  <template slot="title">
                    <span>删除</span>
                  </template>
                  <a-button type="danger" icon="rest" @click="deleteAdvantage(text.advantage_id)"></a-button>
                </a-tooltip>
              </div>
            </a-table>
            <a-row :gutter="24" style="margin-top: 24px;">
              <a-col :span="24">
                <a-button icon="save" type="primary" @click="handleSave()" v-action:subsidiary-edit>
                  保存
                </a-button>
              </a-col>
            </a-row>
          </a-tab-pane>
        </a-tabs>
      </a-form-model>
    </div>

    <a-drawer
      :title="action + '子公司'"
      :width="'50%'"
      @close="visibleFunction=false"
      :visible="visibleFunction"
      :bodyStyle="{paddingBottom: '80px'}"
    >
      <a-form-model
        ref="functionForm"
        layout="vertical"
        :model="formFunction"
        :rules="rulesFunction"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-row :gutter="24">
          <a-col :span="18">
            <a-form-model-item ref="title" label="公司全称" prop="title">
              <a-input
                v-model="formFunction.title"
                placeholder=""
                @blur="
                  () => {
                    $refs.title.onFieldBlur();
                  }
                "
              />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="18">
            <a-form-model-item ref="sub_title" label="公司简称" prop="sub_title">
              <a-input
                v-model="formFunction.sub_title"
                placeholder=""
                @blur="
                  () => {
                    $refs.sub_title.onFieldBlur();
                  }
                "
              />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="18">
            <a-form-model-item ref="url" label="公司网址" prop="url">
              <a-input
                v-model="formFunction.url"
                placeholder=""
                @blur="
                  () => {
                    $refs.url.onFieldBlur();
                  }
                "
                :auto-size="{ minRows: 3, maxRows: 5 }"
              />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="18">
            <a-form-model-item ref="summary" label="公司简介" prop="summary">
              <a-input
                v-model="formFunction.summary"
                placeholder=""
                @blur="
                  () => {
                    $refs.url.onFieldBlur();
                  }
                "
              />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="18">
            <a-form-model-item ref="content" label="公司介绍" prop="content">
              <a-textarea
                v-model="formFunction.content"
                placeholder=""
                @blur="
                  () => {
                    $refs.content.onFieldBlur();
                  }
                "
                :auto-size="{ minRows: 3, maxRows: 5 }"
              />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="24">
            <a-form-item label="上传图片" :extra="imgSize">
              <a-upload
                name="files[]"
                list-type="picture-card"
                class="avatar-uploader"
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
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-model-item ref="sort" label="排序号" prop="sort" extra="数字越小越靠前">
              <a-input-number
                v-model="formFunction.sort"
                @blur="
                  () => {
                    $refs.sort.onFieldBlur();
                  }
                "
              />
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
              <a-button :style="{marginRight: '8px'}" size="large" @click="visibleFunction=false">取消</a-button>
              <a-button type="primary" html-type="submit" size="large" @click="handleOnSubmitFunction">确定</a-button>
            </div>
          </a-col>
        </a-row>
        <!-- <a-row :gutter="16">
          <a-col :span="24"><p style="color: red;">注意：添加或修改小图后，需要在上层点击提交按钮才会保存简介的修改。</p></a-col>
        </a-row> -->
      </a-form-model>
    </a-drawer>

    <a-drawer
      :title="action + '首页相关信息'"
      :width="'50%'"
      @close="visibleAdvantage=false"
      :visible="visibleAdvantage"
      :bodyStyle="{paddingBottom: '80px'}"
    >
      <a-form-model
        ref="advantageForm"
        layout="vertical"
        :model="formAdvantage"
        :rules="rulesAdvantage"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-model-item ref="title" label="标题" prop="title">
              <a-input
                v-model="formAdvantage.title"
                @blur="
                  () => {
                    $refs.title.onFieldBlur();
                  }
                "
              />
            </a-form-model-item>
          </a-col>
        </a-row>
        <!-- <a-row :gutter="24">
          <a-col :span="24">
            <a-form-model-item ref="content" label="内容" prop="content">
              <a-textarea
                v-model="formAdvantage.content"
                :auto-size="{ minRows: 5, maxRows: 5 }"
                @blur="
                  () => {
                    $refs.content.onFieldBlur();
                  }
                "
              />
            </a-form-model-item>
          </a-col>
        </a-row> -->
        <a-row :gutter="16">
          <a-col :span="24">
            <a-form-item label="上传图片" :extra="imgSize2">
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
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-model-item ref="sort" label="排序号" prop="sort" extra="数字越小越靠前">
              <a-input-number
                v-model="formAdvantage.sort"
                @blur="
                  () => {
                    $refs.sort.onFieldBlur();
                  }
                "
              />
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
              <a-button :style="{marginRight: '8px'}" size="large" @click="visibleAdvantage=false">取消</a-button>
              <a-button type="primary" html-type="submit" size="large" @click="handleOnSubmitAdvantage">提交</a-button>
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

const advantageColumns = [
  // { title: '图片', dataIndex: '', key: 'img', scopedSlots: { customRender: 'img' }, width: 100 },
  { title: '标题', dataIndex: 'title', key: 'title' },
  // { title: '内容', dataIndex: 'content', key: 'content' },
  { title: '排序号', dataIndex: '', key: 'sort', scopedSlots: { customRender: 'sort' }, width: 100 },
  {
    title: '操作',
    dataIndex: '',
    key: 'x',
    scopedSlots: { customRender: 'action' },
    width: 150
  }
]

const functionColumns = [
  // { title: '图片', dataIndex: '', key: 'img', scopedSlots: { customRender: 'img' }, width: 100 },
  { title: '公司名称', dataIndex: 'title', key: 'title' },
  { title: '排序号', dataIndex: '', key: 'sort', scopedSlots: { customRender: 'sort' }, width: 100 },
  {
    title: '操作',
    dataIndex: '',
    key: 'x',
    scopedSlots: { customRender: 'action' },
    width: 150
  }
]

export default {
  data () {
    return {
      functionColumns,
      advantageColumns,
      functionData: [],
      advantageData: [],
      visibleFunction: false,
      formFunction: {
        function_id: '',
        title: '',
        img: '',
        sort: 99,
        editable: false
      },
      formAdvantage: {
        advantage_id: '',
        title: '',
        content: '',
        sort: 99,
        editable: false
      },
      rulesFunction: {
        title: [{ required: true, message: '请输入公司全称', trigger: 'blur' }],
        sub_title: [{ required: true, message: '请输入公司简称', trigger: 'blur' }],
        url: [{ required: true, message: '请输入公司网站', trigger: 'blur' }],
        summary: [{ required: true, message: '请输入公司简介', trigger: 'blur' }],
        content: [{ required: true, message: '请输入公司介绍', trigger: 'blur' }],
        sort: [{ required: true, message: '请输入排序号', trigger: 'blur' }]
      },
      rulesAdvantage: {
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        sort: [{ required: true, message: '请输入排序号', trigger: 'blur' }]
      },
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
      tableLoading2: false,
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
      loadingImg: false,
      percentImg: 0,
      imageUrl: '',
      loadingImg2: false,
      percentImg2: 0,
      imageUrl2: '',
      loadingImg3: false,
      percentImg3: 0,
      imageUrl3: '',
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
        initialFrameHeight: 540,
        // 初始容器宽度
        initialFrameWidth: '100%',
        // 上传文件接口（这个地址是我为了方便各位体验文件上传功能搭建的临时接口，请勿在生产环境使用！！！部署在国外的服务器，如果无法访问，请自备梯子）
        serverUrl: '/_UEditor_/php/controller.php',
        // UEditor 资源文件的存放路径，如果你使用的是 vue-cli 生成的项目，通常不需要设置该选项，vue-ueditor-wrap 会自动处理常见的情况，如果需要特殊配置，参考下方的常见问题2
        UEDITOR_HOME_URL: '/_UEditor_/'
      }
    }
  },
  name: 'Subsidiary',
  components: {
    VueUeditorWrap
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
      if (this.$route.query.img3) {
        this.imgSize3 = '图片尺寸：' + this.$route.query.img3.replace(',', '×') + '像素'
      } else {
        this.imgSize3 = ''
      }
    },
    getColumnByCode () {
      this.$http
        .post('admin/column/getParentColumnByCode', {
          code: 'subsidiary'
        })
        .then((res) => {
          if (res.data.status === 'S') {
            this.parent_column_name = res.data.data.column_name
            this.$http
              .post('admin/column/getColumnByCode', {
                code: 'subsidiary'
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
    // 核心优势 ===================================
    addAdvantageItem () {
      this.formAdvantage = {
        advantage_id: '',
        title: '',
        content: '',
        img: '',
        sort: 99,
        editable: false
      }
      this.visibleAdvantage = true
    },
    editAdvantage (item) {
      this.formAdvantage = {
        advantage_id: item.advantage_id,
        title: item.title,
        content: item.content,
        img: item.img,
        sort: item.sort,
        editable: item.editable
      }
      this.imageUrl2 = item.img
      this.visibleAdvantage = true
    },
    deleteAdvantage (id) {
      this.advantageData.forEach((item, index) => {
        if (item.advantage_id === id) {
          this.advantageData.splice(index, 1)
        }
      })
    },
    handleOnSubmitAdvantage () {
      this.$refs.advantageForm.validate(valid => {
        if (valid) {
          this.formAdvantage.img = this.imageUrl2
          if (this.formAdvantage.advantage_id === '') {
            if (this.advantageData.length === 0) {
              this.formAdvantage.advantage_id = 1
            } else {
              let advantageId = 1
              this.advantageData.forEach(item => {
                if (item.advantage_id > advantageId) {
                  advantageId = item.advantage_id
                }
              })
              this.formAdvantage.advantage_id = advantageId + 1
            }
            this.advantageData.push({ ...this.formAdvantage })
          } else {
            this.advantageData.forEach(item => {
              if (item.advantage_id === this.formAdvantage.advantage_id) {
                item.title = this.formAdvantage.title
                item.content = this.formAdvantage.content
                item.sort = this.formAdvantage.sort
                item.img = this.formAdvantage.img
              }
            })
          }

          this.visibleAdvantage = false
          this.formAdvantage = {
            advantage_id: '',
            title: '',
            content: '',
            img: '',
            sort: 99,
            editable: false
          }
          this.imageUrl2 = ''
          this.handleSave()
        }
      })
    },

    // 产品功能 ===================================
    addFunctionItem () {
      this.formFunction = {
        function_id: '',
        title: '',
        sub_title: '',
        summary: '',
        content: '',
        url: '',
        img: '',
        sort: 99,
        editable: false
      }
      this.imageUrl = ''
      this.visibleFunction = true
    },
    editFunction (item) {
      this.formFunction = {
        function_id: item.function_id,
        title: item.title,
        sub_title: item.sub_title,
        summary: item.summary,
        content: item.content,
        url: item.url,
        img: item.img,
        sort: item.sort,
        editable: item.editable
      }
      this.imageUrl = item.img
      this.visibleFunction = true
    },
    deleteFunction (id) {
      this.functionData.forEach((item, index) => {
        if (item.function_id === id) {
          this.functionData.splice(index, 1)
        }
      })
    },
    handleOnSubmitFunction () {
      this.$refs.functionForm.validate(valid => {
        if (valid) {
          this.formFunction.img = this.imageUrl
          if (this.formFunction.function_id === '') {
            this.formFunction.function_id = 1
            if (this.functionData.length === 0) {
              this.formFunction.function_id = 1
            } else {
              let functionId = 1
              this.functionData.forEach(item => {
                if (item.function_id > functionId) {
                  functionId = item.function_id
                }
              })
              this.formFunction.function_id = functionId + 1
            }
            this.functionData.push({ ...this.formFunction })
          } else {
            this.functionData.forEach(item => {
              if (item.function_id === this.formFunction.function_id) {
                item.title = this.formFunction.title
                item.sub_title = this.formFunction.sub_title
                item.summary = this.formFunction.summary
                item.content = this.formFunction.content
                item.sort = this.formFunction.sort
                item.url = this.formFunction.url
                item.img = this.formFunction.img
              }
            })
          }

          this.visibleFunction = false
          this.formFunction = {
            function_id: '',
            title: '',
            sub_title: '',
            summary: '',
            content: '',
            sort: 99,
            url: '',
            img: '',
            editable: false
          }
          this.imageUrl = ''
          // this.$message.success('已保存到列表，请注意提交表单')
          this.handleSave()
        }
      })
    },
    // 产品功能 ===================================
    getContent () {
      this.$http
        .post('admin/page/getContent', {
          code: 'subsidiary'
        })
        .then(res => {
          if (res.data.status === 'S') {
            this.page = res.data.data
            this.imageUrl = this.page.img
            this.imageUrl3 = this.page.attribute2
            if (this.page.attribute1 !== '' && this.page.attribute1.indexOf('[') > -1) {
              this.functionData = JSON.parse(this.page.attribute1)
              this.functionData.forEach(list => {
                list.editable = false
              })
            } else {
              this.functionData = []
            }
            if (this.page.attribute2 && this.page.attribute2.indexOf('[') > -1) {
              this.advantageData = JSON.parse(this.page.attribute2)
            } else {
              this.advantageData = []
            }
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
      this.page.attribute1 = JSON.stringify(this.functionData)
      this.page.attribute2 = JSON.stringify(this.advantageData)
      this.page.code = 'subsidiary'
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
