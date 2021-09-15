<template>
  <div>
    <div class="search-box">
      <a-form class="ant-advanced-search-form" @submit="handleSearch">
        <a-row :gutter="24">
          <a-col :span="6" :style="{ display: 'block' }">
            <a-form-item :label="`标题`">
              <a-input allowClear v-model="searchItem.title" placeholder />
            </a-form-item>
          </a-col>
          <!-- <a-col :span="6" :style="{ display: 'block' }">
            <a-form-item :label="`分类`">
              <a-cascader :options="cateData" @change="handleCateChange" :placeholder="'请选择'" :fieldNames="{ label: 'cate_name', value: 'cate_id', children: 'children' }" />
            </a-form-item>
          </a-col>-->
          <a-col :span="6" :style="{ display: 'block' }">
            <a-form-item :label="`状态`">
              <a-select v-model="searchItem.status">
                <a-select-option value="1">正常</a-select-option>
                <a-select-option value="0">禁用</a-select-option>
                <a-select-option value>全部</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="6" :style="{ display: 'block' }">
            <a-form-item label="提交日期">
              <a-range-picker
                style="width: 100%"
                @change="onDatePickerChange"
                :locale="locale"
                v-model="searchItem.date"
                showToday
                allowClear
              />
            </a-form-item>
          </a-col>
          <a-col :span="6" :style="{ textAlign: 'right', float: 'right' }">
            <a-form-item>
              <a-button type="primary" icon="search" html-type="submit">搜索</a-button>
              <a-button icon="undo" :style="{ marginLeft: '8px' }" @click="handleReset">重置</a-button>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <div class="tool-bar" style="margin-bottom: 16px">
      <a-row>
        <a-col :span="12">
          <div class="page-title">信息列表</div>
        </a-col>
        <a-col :span="12">
          <div class="btn-box">
            <a-button icon="rest" type="danger" @click="delSelect" :disabled="!hasSelected" v-action:scheme-add>批量删除</a-button>
            <a-button icon="plus" type="primary" @click="addItem()" v-action:scheme-add>添加</a-button>
            <a-button icon="reload" type="link" @click="reload" :loading="tableLoading"></a-button>
          </div>
        </a-col>
      </a-row>
    </div>

    <div>
      <a-table
        :columns="columns"
        :data-source="data"
        :pagination="{
          position: 'bottom',
          pageSize: pageSize,
          total: total,
          showTotal: (total)=>{ return `共 ${total} 条信息`}
        }"
        @change="onChangePage"
        row-key="article_id"
        :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        size="small"
      >
        <div slot="img" slot-scope="text">
          <img :src="text.img" @click="previewImg=text.img;visiblePreview=true;" style="max-width: 80px; max-height: 40px; cursor: pointer;" alt="">
        </div>
        <div slot="status" slot-scope="text">
          <a-switch
            checkedChildren="正常"
            unCheckedChildren="禁用"
            :disabled="!$store.getters.hasPermission('scheme-edit')"
            :loading="text.loading"
            :checked="text.status=='1' ? true : false"
            @change="changeStatus(text)"
          />
        </div>
        <div slot="is_home" slot-scope="text">
          <a-switch checkedChildren="是" unCheckedChildren="否" :loading="text.loadingHome" :checked="text.is_home=='1' ? true : false" @change="changeIsHome(text)" />
        </div>
        <div class="action-box" slot="action" slot-scope="text">
          <a-tooltip placement="top" v-action:scheme-edit>
            <template slot="title">
              <span>修改</span>
            </template>
            <a-button type="primary" icon="edit" @click="editItem(text)"></a-button>
          </a-tooltip>
          <a-tooltip placement="top" v-action:scheme-del>
            <template slot="title">
              <span>删除</span>
            </template>
            <a-button type="danger" icon="rest" @click="deleteItem(text.article_id)"></a-button>
          </a-tooltip>
        </div>
      </a-table>
    </div>

    <a-drawer
      :title="action + '文章'"
      :width="'calc(100% - 200px)'"
      @close="onClose"
      :visible="visible"
      :bodyStyle="{paddingBottom: '80px'}"
    >
      <a-form-model
        ref="ruleForm"
        layout="vertical"
        :model="form"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-tabs default-active-key="1">
          <a-tab-pane key="1" tab="文章内容">
            <a-row :gutter="24">
              <a-col :span="12">
                <a-form-model-item ref="title" label="标题" prop="title">
                  <a-input
                    v-model="form.title"
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
              <a-col :span="4">
                <a-form-model-item ref="cate_id" label="分类" prop="cate_id">
                  <a-cascader
                    :options="cateData"
                    v-model="form.cate_id"
                    @blur="
                      () => {
                        $refs.cate_id.onFieldBlur();
                      }
                    "
                    :fieldNames="{ label: 'cate_name', value: 'cate_id', children: 'children' }"
                  />
                </a-form-model-item>
              </a-col>
            </a-row> -->
            <a-row :gutter="24">
              <a-col :span="12">
                <a-form-model-item ref="summary" label="概述" prop="summary">
                  <a-textarea
                    v-model="form.summary"
                    :auto-size="{ minRows: 3, maxRows: 5 }"
                    @blur="
                      () => {
                        $refs.summary.onFieldBlur();
                      }
                    "
                  />
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row :gutter="16">
              <a-col :span="24">
                <a-form-item label="上传Banner图片" ref="img3" prop="img3" :extra="imgSize3">
                  <a-upload
                    name="files[]"
                    list-type="picture-card"
                    class="avatar-uploader"
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
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="16">
              <a-col :span="24">
                <a-form-item label="上传图标（在首页显示）" :extra="imgSize2">
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
            <a-row :gutter="16">
              <a-col :span="24">
                <a-form-item label="上传封面图片" ref="img" prop="img" :extra="imgSize">
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
              <a-col :span="24">
                <a-form-model-item label="封面图右侧内容">
                  <vue-ueditor-wrap v-model="form.attribute1" :config="myConfig"></vue-ueditor-wrap>
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="4">
                <a-form-model-item ref="create_date" label="日期" prop="create_date">
                  <a-date-picker
                    style="width: 100%;"
                    v-model="form.create_date"
                    @blur="
                      () => {
                        $refs.create_date.onFieldBlur();
                      }
                    "
                  />
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="24">
                <a-form-model-item label="详细信息">
                  <vue-ueditor-wrap v-model="form.content" :config="myConfig"></vue-ueditor-wrap>
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="24" style="margin-top: 8px;">
                <a-form-model-item ref="is_home" label="推荐到首页" prop="is_home">
                  <a-radio-group style="width: 100%;" v-model="form.is_home">
                    <a-radio :value="'1'">
                      是
                    </a-radio>
                    <a-radio :value="'0'">
                      否
                    </a-radio>
                  </a-radio-group>
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="24" style="margin-top: 8px;">
                <a-form-model-item ref="status" label="状态" prop="status">
                  <a-radio-group style="width: 100%;" v-model="form.status">
                    <a-radio :value="'1'">正常</a-radio>
                    <a-radio :value="'0'">禁用</a-radio>
                  </a-radio-group>
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
                  <a-button
                    type="primary"
                    html-type="submit"
                    size="large"
                    @click="handleOnSubmit"
                  >提交</a-button>
                </div>
              </a-col>
            </a-row>
          </a-tab-pane>
          <a-tab-pane key="2" tab="我们的团队" force-render>
            <a-row :gutter="24">
              <a-col :span="24">
                <a-checkbox-group v-model="form.attribute2">
                  <a-row>
                    <a-col :span="24" v-for="item of teamData" :key="item.article_id">
                      <a-checkbox :value="item.article_id">{{ item.title }}</a-checkbox>
                    </a-col>
                  </a-row>
                </a-checkbox-group>
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
                  <a-button
                    type="primary"
                    html-type="submit"
                    size="large"
                    @click="handleOnSubmit"
                  >提交</a-button>
                </div>
              </a-col>
            </a-row>
          </a-tab-pane>
          <a-tab-pane key="3" tab="我们的优势" force-render>
            <a-row :gutter="24">
              <a-col :span="24">
                <vue-ueditor-wrap v-model="form.attribute3" :config="myConfig"></vue-ueditor-wrap>
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
                  <a-button
                    type="primary"
                    html-type="submit"
                    size="large"
                    @click="handleOnSubmit"
                  >提交</a-button>
                </div>
              </a-col>
            </a-row>
          </a-tab-pane>
          <a-tab-pane key="4" tab="法规、标准制定" force-render>
            <a-row :gutter="24">
              <a-col :span="24">
                <vue-ueditor-wrap v-model="form.attribute4" :config="myConfig"></vue-ueditor-wrap>
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
                  <a-button
                    type="primary"
                    html-type="submit"
                    size="large"
                    @click="handleOnSubmit"
                  >提交</a-button>
                </div>
              </a-col>
            </a-row>
          </a-tab-pane>
          <a-tab-pane key="5" tab="SEO优化" force-render>
            <a-row :gutter="16">
              <a-col :span="12">
                <a-form-item label="网站标题">
                  <a-input v-model="form.web_title" placeholder="针对搜索引擎设置的 网页标题" />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="16">
              <a-col :span="12">
                <a-form-item label="搜索标题">
                  <a-input v-model="form.meta_search_title" placeholder="针对搜索引擎设置的 搜索标题" />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="16">
              <a-col :span="12">
                <a-form-item label="网页作者">
                  <a-input v-model="form.meta_author" placeholder="针对搜索引擎设置的 网页作者" />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="16">
              <a-col :span="12">
                <a-form-item label="网页关键词">
                  <a-input v-model="form.meta_keywords" placeholder="针对搜索引擎设置的 关键词" />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="16">
              <a-col :span="12">
                <a-form-item label="网页声明">
                  <a-input v-model="form.meta_copyright" placeholder="针对搜索引擎设置的 网页声明" />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="16">
              <a-col :span="12">
                <a-form-item label="网页描述">
                  <a-textarea
                    v-model="form.meta_description"
                    placeholder="针对搜索引擎设置的 网页描述"
                    :auto-size="{ minRows: 3, maxRows: 5 }"
                  />
                </a-form-item>
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
                  <a-button
                    type="primary"
                    html-type="submit"
                    size="large"
                    @click="handleOnSubmit"
                  >提交</a-button>
                </div>
              </a-col>
            </a-row>
          </a-tab-pane>
        </a-tabs>
      </a-form-model>
    </a-drawer>

    <a-modal v-model="visiblePreview" title="" :width="imgWidth+48" :footer="null" centered>
      <div style="text-align: center;">
        <img :src="previewImg" :style="{maxWidth: imgWidth+'px'}" alt="">
      </div>
    </a-modal>
  </div>
</template>

<script>
import VueUeditorWrap from 'vue-ueditor-wrap'
import moment from 'moment'
import 'moment/locale/zh-cn'
import locale from 'ant-design-vue/es/date-picker/locale/zh_CN'
const columns = [
  // { title: 'ID', dataIndex: 'article_id', key: 'article_id' },
  { title: '封面', dataIndex: '', key: 'img', scopedSlots: { customRender: 'img' }, width: 100 },
  { title: '标题', dataIndex: 'title', key: 'title' },
  // { title: '分类', dataIndex: 'cate_name', key: 'cate_name' },
  { title: '编辑', dataIndex: 'author', key: 'author', width: 100 },
  { title: '推荐到首页', dataIndex: '', key: 'is_home', scopedSlots: { customRender: 'is_home' }, width: 100 },
  { title: '日期', dataIndex: 'create_date', key: 'create_date', width: 120 },
  {
    title: '状态',
    dataIndex: '',
    key: 'a',
    scopedSlots: { customRender: 'status' },
    width: 90
  },
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
      moment,
      locale,
      columns,
      pageSize: 10,
      currentPage: 1,
      total: 0,
      data: [],
      teamData: [],
      tableLoading: false,
      action: '',
      visible: false,
      labelCol: {},
      wrapperCol: {},
      selectedRowKeys: [],
      searchItem: {
        cate_id: '',
        title: '',
        status: '',
        date: [
          moment('2020/01/01', 'YYYY-MM-DD'),
          moment(new Date(), 'YYYY-MM-DD')
        ],
        date_Begin: '2020-01-01',
        date_end: ''
      },
      filterItem: {
        cate_id: '',
        title: '',
        status: '',
        date: [
          moment('2020/01/01', 'YYYY-MM-DD'),
          moment(new Date(), 'YYYY-MM-DD')
        ],
        date_Begin: '2020-01-01',
        date_end: ''
      },
      cateData: [],
      form: {
        cate_id: '',
        title: '',
        summary: '',
        is_home: '1',
        code: this.$route.params.code,
        create_date: moment(new Date(), 'YYYY-MM-DD'),
        status: '1',
        web_title: '',
        meta_search_title: '',
        meta_author: '',
        meta_keywords: '',
        meta_copyright: '',
        meta_description: '',
        img: '',
        img2: '',
        img3: ''
      },
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
      imgWidth: this.$route.query.img.split(',')[0],
      headers: {
        AccessToken: localStorage.getItem('token')
      },
      actionUrl: this.$baseUrl + 'admin/article/upload_img' + (process.env.NODE_ENV === 'development' ? '?voucher=token' : '?voucher=session'),
      rules: {
        cate_id: [{ required: true, message: '请选择分类', trigger: 'blur' }],
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        summary: [{ required: false, message: '', trigger: 'blur' }],
        img: [{ required: true, message: '请上传缩略图', trigger: 'blur' }],
        img3: [
          { required: true, message: '请上传Banner图', trigger: 'blur' }
        ],
        // img2: [
        //   { required: true, message: '请上传资质认证图', trigger: 'blur' }
        // ],
        sort: [{ required: true, message: '请输入排序号', trigger: blur }],
        create_date: [
          { required: true, message: '请选择日期', trigger: 'change' }
        ],
        status: [{ required: true, message: '请选择状态', trigger: 'change' }]
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
      visiblePreview: false,
      previewImg: ''
    }
  },
  name: 'Scheme',
  components: {
    VueUeditorWrap
  },
  computed: {
    hasSelected () {
      return this.selectedRowKeys.length > 0
    }
  },
  watch: {
    $route: function () {
      //   this.getCate()
      this.getList()
      this.getParentColumnByCode()
      this.form.parent_code = 'scheme'
    }
  },
  created () {
    // this.getCate()
    this.getList()
    this.getTeam()
    this.getParentColumnByCode()
    this.setImgSizeText()
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
    onChangeCate (value) {
      this.searchItem.cate_id = value.join(',')
      console.log(this.searchItem.cate_id)
    },
    onSelectChange (selectedRowKeys) {
      console.log('selectedRowKeys changed: ', selectedRowKeys)
      this.selectedRowKeys = selectedRowKeys
    },
    getParentColumnByCode () {
      this.$http
        .post('admin/column/getParentColumnByCode', {
          code: 'scheme'
        })
        .then(res => {
          if (res.data.status === 'S') {
            this.$store.commit('setBreadcrumb', {
              breadcrumbData: [
                {
                  key: '1',
                  name: '首页',
                  url: '#/main/base'
                },
                {
                  key: '2',
                  name: '信息管理',
                  url: ''
                },
                {
                  key: '3',
                  name: res.data.data.column_name,
                  url: ''
                }
              ]
            })
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    // 获取分类
    getCate () {
      this.$http
        .post('admin/cate', {
          page_size: 100,
          current_page: 1,
          parent_code: 'service-items'
        })
        .then(res => {
          if (res.data.status === 'S') {
            res.data.data.forEach(item => {
              if (!item.children) {
                delete item.children
              }
            })
            this.cateData = res.data.data
          }
        })
        .catch()
    },
    // 搜索数据
    handleSearch (e) {
      e.preventDefault()
      this.current_page = 1
      this.filterItem = JSON.parse(JSON.stringify(this.searchItem))
      this.getList(false)
    },
    // 重围搜索表单
    handleReset () {
      // this.form.resetFields();
      const date = new Date()
      this.searchItem = {
        cate_id: '',
        title: '',
        status: '',
        date: [
          moment('2020/01/01', 'YYYY-MM-DD'),
          moment(new Date(), 'YYYY-MM-DD')
        ],
        date_begin: '2020-01-01',
        date_end:
          date.getFullYear() +
          '-' +
          (date.getMonth() + 1) +
          '-' +
          date.getDate()
      }
    },
    // 分类选择
    handleCateChange (value) {
      console.log(value)
      if (value[value.length - 1]) {
        this.searchItem.cate_id = value[value.length - 1]
      } else {
        this.searchItem.cate_id = ''
      }
      console.log(this.searchItem)
    },
    // 日期选择
    onDatePickerChange (date, dateString) {
      this.searchItem.date_begin = dateString[0]
      this.searchItem.date_end = dateString[1]
    },
    getTeam () {
      this.$http
        .post('admin/article', {
          page_size: 100,
          current_page: 1,
          status: 1,
          code: 'team'
        })
        .then(res => {
          if (res.data.status === 'S') {
            this.teamData = res.data.data
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
    getList (retry) {
      if (retry) {
        setTimeout(() => {
          this.getList(true)
        }, 2000)
      }
      this.tableLoading = true
      this.$http
        .post('admin/article', {
          page_size: this.pageSize,
          current_page: this.currentPage,
          cate_id: this.filterItem.cate_id,
          title: this.filterItem.title,
          status: this.filterItem.status,
          date_begin: this.filterItem.date_begin,
          date_end: this.filterItem.date_end,
          code: 'scheme'
        })
        .then(res => {
          if (res.data.status === 'S') {
            this.total = res.data.total
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
    // 刷新数据
    reload () {
      this.getList(false)
    },
    // 页面跳转
    onChangePage (e) {
      this.currentPage = e.current
      this.getList(false)
    },
    onClose () {
      this.visible = false
    },
    addItem () {
      this.form = {
        article_id: '',
        cate_id: null,
        title: '',
        summary: '',
        code: this.$route.params.code,
        img: '',
        img2: '',
        img3: '',
        is_home: '1',
        status: '1',
        content: '',
        create_date: moment(new Date(), 'YYYY-MM-DD'),
        web_title: '',
        meta_search_title: '',
        meta_author: '',
        meta_keywords: '',
        meta_copyright: '',
        meta_description: '',
        attribute1: '',
        attribute2: [],
        attribute3: '',
        attribute4: '',
        attribute5: '',
        attribute6: ''
      }
      this.imageUrl = ''
      this.imageUrl2 = ''
      this.imageUrl3 = ''
      this.visible = true
      this.action = '新增'
    },
    editItem (item) {
      this.form = {
        article_id: item.article_id,
        cate_id: JSON.parse(item.cate_ids),
        title: item.title,
        summary: item.summary,
        code: item.code,
        img: item.img,
        img2: item.img2,
        img3: item.img3,
        is_home: item.is_home ? item.is_home.toString() : '0',
        status: item.status ? item.status.toString() : '0',
        content: item.content,
        create_date: moment(item.create_date, 'YYYY-MM-DD'),
        web_title: item.web_title,
        meta_search_title: item.meta_search_title,
        meta_author: item.meta_author,
        meta_keywords: item.meta_keywords,
        meta_copyright: item.meta_copyright,
        attribute1: item.attribute1,
        attribute2: item.attribute2 !== '' ? JSON.parse(item.attribute2) : [],
        attribute3: item.attribute3,
        attribute4: item.attribute4,
        attribute5: item.attribute5,
        attribute6: item.attribute6
      }
      this.imageUrl = item.img
      this.imageUrl2 = item.img2
      this.imageUrl3 = item.img3
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
            .post('admin/article/del', {
              article_id: id
            })
            .then(res => {
              if (res.data.status === 'S') {
                self.$message.success('删除成功')
                self.getList(false)
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
    delSelect () {
      const self = this
      this.$confirm({
        title: '提示',
        content: '确定要删除吗?',
        okText: '确定',
        cancelText: '取消',
        onOk () {
          self.$http
            .post('admin/article/delSelect', {
              ids: JSON.stringify(self.selectedRowKeys)
            })
            .then(res => {
              self.selectedRowKeys = []
              if (res.data.status === 'S') {
                self.$message.success('删除成功')
                self.getList(false)
              } else if (res.data.status !== 'T') {
                self.$error({
                  title: '提示',
                  content: res.data.msg
                })
              }
            })
            .catch(error => {
              self.selectedRowKeys = []
              console.log(error)
            })
        }
      })
    },
    handleOnSubmit () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          const params = JSON.parse(JSON.stringify(this.form))
          // if (this.form.cate_id !== '') {
          //   params.cate_id = this.form.cate_id[this.form.cate_id.length - 1]
          //   params.cate_ids = JSON.stringify(this.form.cate_id)
          // }
          params.img = this.imageUrl
          params.img2 = this.imageUrl2
          params.img3 = this.imageUrl3
          if (params.attribute2 !== '') {
            params.attribute2 = JSON.stringify(params.attribute2)
          }
          params.create_date = moment(params.create_date).format('YYYY-MM-DD HH:mm:ss')
          params.code = 'scheme'
          this.$http
            .post('admin/article/edit', params)
            .then(res => {
              if (res.data.status === 'S') {
                this.getList(false)
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
    // 修改状态
    changeStatus (item) {
      item.loading = true
      this.$http
        .post('admin/article/modifyStatus', {
          article_id: item.article_id,
          status: item.status === 1 ? 0 : 1
        })
        .then(res => {
          item.loading = false
          if (res.data.status === 'S') {
            if (item.status === 1) {
              item.status = 0
            } else {
              item.status = 1
            }
          } else if (res.data.status !== 'T') {
            this.$error({
              title: '提示',
              content: res.data.msg
            })
          }
        })
        .catch(error => {
          item.loading = false
          console.log(error)
        })
    },
    changeIsHome (item) {
      item.loadingHome = true
      this.$http
        .post('admin/article/modifyIsHome', {
          article_id: item.article_id,
          is_home: item.is_home === 1 ? 0 : 1
        })
        .then(res => {
          item.loadingHome = false
          if (res.data.status === 'S') {
            if (item.is_home === 1) {
              item.is_home = 0
            } else {
              item.is_home = 1
            }
          } else if (res.data.status !== 'T') {
            this.$error({
              title: '提示',
              content: res.data.msg
            })
          }
        })
        .catch(error => {
          item.loadingHome = false
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
/deep/ .ant-upload.ant-upload-select-picture-card > .ant-upload {
  img {
    max-width: 500px;
  }
}
</style>
