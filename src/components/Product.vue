<template>
  <div>
    <div class="search-box">
      <a-form class="ant-advanced-search-form" @submit="handleSearch">
        <a-row :gutter="24">
          <a-col :span="6" :style="{ display: 'block' }">
            <a-form-item :label="`产品名称`">
              <a-input allowClear v-model="searchItem.title" placeholder />
            </a-form-item>
          </a-col>
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
          <div class="page-title">产品列表</div>
        </a-col>
        <a-col :span="12">
          <div class="btn-box">
            <a-button icon="rest" type="danger" @click="delSelect" :disabled="!hasSelected" v-action:product-del>批量删除</a-button>
            <a-button icon="plus" type="primary" @click="addItem()" v-action:product-add>添加</a-button>
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
          <img :src="text.img" style="max-width: 80px; max-height: 40px; cursor: pointer;" alt="">
        </div>
        <div slot="sort" slot-scope="text">
          <div style="border-bottom: 1px solid #ddd; padding: 5px 0; text-indent: 12px;" v-if="!text.editable || !$store.getters.hasPermission('product-edit')" @click="showEdit(text)">{{ text.sort }}</div>
          <div v-else>
            <a-input class="input-sort" :id="`input_${text.article_id}`" v-model="text.sort" @blur="text.oldSort===text.sort?text.editable=false:text.editable=true">
              <a-button class="btn-sort" slot="addonAfter" size="small" @click="updateSort(text)">
                <a-icon type="save" />
              </a-button>
            </a-input>
          </div>
        </div>
        <div slot="is_home" slot-scope="text">
          <a-switch
            checkedChildren="是"
            unCheckedChildren="否"
            :disabled="!$store.getters.hasPermission('product-edit')"
            :loading="text.loadingHome"
            :checked="text.is_home=='1' ? true : false"
            @change="changeIsHome(text)" />
        </div>
        <div slot="status" slot-scope="text">
          <a-switch
            checkedChildren="正常"
            unCheckedChildren="禁用"
            :disabled="!$store.getters.hasPermission('product-edit')"
            :loading="text.loading"
            :checked="text.status=='1' ? true : false"
            @change="changeStatus(text)"
          />
        </div>
        <div class="action-box" slot="action" slot-scope="text">
          <a-tooltip placement="top" v-action:product-edit>
            <template slot="title">
              <span>修改</span>
            </template>
            <a-button type="primary" icon="edit" @click="editItem(text)"></a-button>
          </a-tooltip>
          <a-tooltip placement="top" v-action:product-del>
            <template slot="title">
              <span>删除</span>
            </template>
            <a-button type="danger" icon="rest" @click="deleteItem(text.article_id)"></a-button>
          </a-tooltip>
        </div>
      </a-table>
    </div>

    <a-drawer
      :title="action + '产品'"
      :width="'calc(100% - 200px)'"
      @close="onClose"
      :visible="visible"
      :bodyStyle="{paddingBottom: '80px'}"
    >
      <a-tabs defaultActiveKey="1">
        <a-tab-pane key="1" tab="基本信息">
          <a-form-model
            ref="ruleForm"
            layout="vertical"
            :model="form"
            :rules="rules"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
          >
            <a-row :gutter="24">
              <a-col :span="4">
                <a-form-model-item ref="cate_id" label="分类" prop="cate_id">
                  <a-cascader
                    :allowClear="false"
                    :options="cateData"
                    v-model="form.cate_id"
                    @blur="
                      () => {
                        $refs.cate_id.onFieldBlur();
                      }
                    "
                    :fieldNames="{ label: 'cate_name', value: 'cate_id', children: 'children' }" />
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="12">
                <a-form-model-item ref="title" label="产品名称" prop="title">
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
            <a-row :gutter="16">
              <a-col :span="6">
                <UploadImgComponent :imgSize="imgSize" :imgName="imgName" :imageUrl.sync="form.img"></UploadImgComponent>
              </a-col>
            </a-row>
            <a-row :gutter="16">
              <a-col :span="24">
                <UploadImgListComponent :imgSize="imgSize2" :imgName="'产品轮播图'" :imageUrl.sync="form.attribute1" :actionUrl="actionUrl" :headers="headers"></UploadImgListComponent>
              </a-col>
            </a-row>
            <a-row :gutter="16">
              <a-col :span="12">
                <a-form-item label="产品描述">
                  <a-textarea
                    v-model="form.summary"
                    placeholder=""
                    :auto-size="{ minRows: 3, maxRows: 5 }"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="16">
              <a-col :span="12">
                <a-form-item label="规格">
                  <a-input
                    v-model="form.attribute2"
                    placeholder=""
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="16">
              <a-col :span="12">
                <a-form-item label="价格">
                  <a-input
                    v-model="form.attribute3"
                    placeholder=""
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="16">
              <a-col :span="12">
                <a-form-item label="购买链接">
                  <a-input
                    v-model="form.url"
                    placeholder=""
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="16">
              <a-col :span="24">
                <a-form-item label="产品介绍">
                  <vue-ueditor-wrap v-model="form.content" :config="myConfig"></vue-ueditor-wrap>
                </a-form-item>
              </a-col>
            </a-row>
            <!-- <a-row :gutter="24">
              <a-col :span="12">
                <a-form-model-item ref="sort" label="排序号" prop="sort" extra="数字越小越靠前">
                  <a-input-number
                    v-model="form.sort"
                    @blur="
                      () => {
                        $refs.sort.onFieldBlur();
                      }
                    "
                  />
                </a-form-model-item>
              </a-col>
            </a-row> -->
            <a-row :gutter="24">
              <a-col :span="24" style="margin-top: 8px;">
                <a-form-model-item ref="is_home" label="推荐到首页" prop="is_home">
                  <a-radio-group style="width: 100%;" v-model="form.is_home">
                    <a-radio :value="'1'">是</a-radio>
                    <a-radio :value="'0'">否</a-radio>
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
                  <a-button type="primary" html-type="submit" size="large" @click="handleOnSubmit">提交</a-button>
                </div>
              </a-col>
            </a-row>
          </a-form-model>
        </a-tab-pane>
        <a-tab-pane key="4" tab="SEO优化" force-render>
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="网站标题">
                <a-input
                  v-model="form.web_title"
                  placeholder="针对搜索引擎设置的 网页标题"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="搜索标题">
                <a-input
                  v-model="form.meta_search_title"
                  placeholder="针对搜索引擎设置的 搜索标题"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="网页作者">
                <a-input
                  v-model="form.meta_author"
                  placeholder="针对搜索引擎设置的 网页作者"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="网页关键词">
                <a-input
                  v-model="form.meta_keywords"
                  placeholder="针对搜索引擎设置的 关键词"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="网页声明">
                <a-input
                  v-model="form.meta_copyright"
                  placeholder="针对搜索引擎设置的 网页声明"
                />
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
                <a-button :style="{marginRight: '8px'}" size="large" @click="onClose">
                  取消
                </a-button>
                <a-button type="primary" html-type="submit" size="large" @click="handleOnSubmit">提交</a-button>
              </div>
            </a-col>
          </a-row>
        </a-tab-pane>
      </a-tabs>
    </a-drawer>
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
const columns = [
  { title: '图片', dataIndex: '', key: 'img', scopedSlots: { customRender: 'img' }, width: 100 },
  // { title: 'ID', dataIndex: 'article_id', key: 'article_id' },
  { title: '产品名称', dataIndex: 'title', key: 'title' },
  { title: '分类', dataIndex: 'cate_name', key: 'cate_name', width: 200 },
  { title: '排序号', dataIndex: '', key: 'sort', scopedSlots: { customRender: 'sort' }, width: 100 },
  { title: '编辑', dataIndex: 'author', key: 'author', width: 100 },
  { title: '推荐到首页', dataIndex: '', key: 'is_home', scopedSlots: { customRender: 'is_home' }, width: 100 },
  // { title: '日期', dataIndex: 'create_date', key: 'create_date', width: 120 },
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

const featureColumns = [
  { title: '图片', dataIndex: '', key: 'img', scopedSlots: { customRender: 'img' }, width: 100 },
  { title: '特征优势名称', dataIndex: '', key: 'title', scopedSlots: { customRender: 'title' } },
  {
    title: '操作',
    dataIndex: '',
    key: 'x',
    scopedSlots: { customRender: 'action' },
    width: 150
  }
]

const modelColumns = [
  { title: '图片', dataIndex: '', key: 'img', scopedSlots: { customRender: 'img' }, width: 100 },
  { title: '型号', dataIndex: 'title', key: 'title' },
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
      featureColumns,
      modelColumns,
      pageSize: 10,
      currentPage: 1,
      total: 0,
      data: [],
      featureData: [],
      modelData: [],
      tableLoading: false,
      action: '',
      featureAction: '',
      modelAction: '',
      visible: false,
      featureVisible: false,
      modelVisible: false,
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
        sub_title: '',
        summary: '',
        code: this.$route.params.code,
        create_date: moment(new Date(), 'YYYY-MM-DD'),
        status: '1',
        is_home: '0',
        web_title: '',
        meta_search_title: '',
        meta_author: '',
        meta_keywords: '',
        meta_copyright: '',
        meta_description: '',
        img: '',
        img2: '',
        img3: '',
        img4: '',
        img5: '',
        img6: '',
        video: '',
        sort: 99,
        url: ''
      },
      featureForm: {
        feature_id: '',
        title: '',
        img: '',
        content: []
      },
      modelForm: {
        model_id: '',
        article_id: '',
        title: '',
        content: '',
        img: '',
        img2: '',
        parameter: '',
        description: ''
      },
      imgSize: '',
      imgSize2: '',
      imgSize3: '',
      imgSize4: '',
      imgSize5: '',
      imgSize6: '',
      imgSize7: '',
      imgSize8: '',
      imgSize9: '',
      imgName: '',
      imgName2: '',
      imgName3: '',
      imgName4: '',
      imgName5: '',
      imgName6: '',
      imgName7: '',
      imgName8: '',
      imgName9: '',
      showImg: false,
      showImg2: false,
      showImg3: false,
      showImg4: false,
      showImg5: false,
      showImg6: false,
      showImg7: false,
      showImg8: false,
      showImg9: false,
      showVideo: false,
      showHome: false,
      showSort: false,
      showSummary: false,
      showUrl: false,
      showImgInList: false,
      showRecommend: false,
      showSearch: false,
      showSeo: false,
      showRichText: false,
      showSubTitle: false,
      headers: {
        AccessToken: localStorage.getItem('token')
      },
      actionUrl: this.$baseUrl + 'admin/article/upload_img' + (process.env.NODE_ENV === 'development' ? '?voucher=token' : '?voucher=session'),
      rules: {
        cate_id: [{ required: true, message: '请选择分类', trigger: 'blur' }],
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        summary: [{ required: false, message: '', trigger: 'blur' }],
        img: [{ required: true, message: '请上传缩略图', trigger: 'blur' }],
        // img2: [
        //   { required: true, message: '请上传Banner图', trigger: 'blur' }
        // ],
        // img3: [
        //   { required: true, message: '请上传资质认证图', trigger: 'blur' }
        // ],
        sort: [{ required: true, message: '请输入排序号', trigger: blur }],
        // create_date: [
        //   { required: true, message: '请选择日期', trigger: 'change' }
        // ],
        status: [{ required: true, message: '请选择状态', trigger: 'change' }]
      },
      featureRules: {},
      modelRules: {
        title: [{ required: true, message: '请输入型号', trigger: 'blur' }]
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
  name: 'Product',
  components: {
    VueUeditorWrap,
    ImgTextListComponent,
    UploadImgComponent,
    UploadImgListComponent
  },
  computed: {
    hasSelected () {
      return this.selectedRowKeys.length > 0
    }
  },
  watch: {
    $route: function () {
      this.getCate()
      this.getList()
      this.getParentColumnByCode()
      this.form.parent_code = 'product'
    }
  },
  created () {
    this.getCate()
    this.getList()
    this.getColumnByCode()
    this.getParentColumnByCode()
    this.$root.$on('updateToken', (data) => {
      this.headers.AccessToken = data
    })
  },
  methods: {
    getColumnByCode () {
      this.$http
        .post('admin/column/getColumnByCode', {
          code: 'product'
        })
        .then(res => {
          if (res.data.status === 'S') {
            const data = res.data.data
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
            if (data.img_size5 && data.img_size5 !== '') {
              this.imgSize5 = '图片尺寸：' + data.img_size5.replace(',', '×') + '像素'
              this.showImg5 = true
            } else {
              this.imgSize5 = ''
              this.showImg5 = false
            }
            if (data.img_size6 && data.img_size6 !== '') {
              this.imgSize6 = '图片尺寸：' + data.img_size6.replace(',', '×') + '像素'
              this.showImg6 = true
            } else {
              this.imgSize6 = ''
              this.showImg6 = false
            }
            if (data.img_size7 && data.img_size7 !== '') {
              this.imgSize7 = '图片尺寸：' + data.img_size7.replace(',', '×') + '像素'
              this.showImg7 = true
            } else {
              this.imgSize7 = ''
              this.showImg7 = false
            }
            if (data.img_size8 && data.img_size8 !== '') {
              this.imgSize8 = '图片尺寸：' + data.img_size8.replace(',', '×') + '像素'
              this.showImg8 = true
            } else {
              this.imgSize8 = ''
              this.showImg8 = false
            }
            if (data.img_size9 && data.img_size9 !== '') {
              this.imgSize9 = '图片尺寸：' + data.img_size9.replace(',', '×') + '像素'
              this.showImg9 = true
            } else {
              this.imgSize9 = ''
              this.showImg9 = false
            }
            if (data.img_title && data.img_title !== '') {
              this.imgName = data.img_title
            } else {
              this.imgName = ''
            }
            if (data.img_title2 && data.img_title2 !== '') {
              this.imgName2 = data.img_title2
            } else {
              this.imgName2 = ''
            }
            if (data.img_title3 && data.img_title3 !== '') {
              this.imgName3 = data.img_title3
            } else {
              this.imgName3 = ''
            }
            if (data.img_title4 && data.img_title4 !== '') {
              this.imgName4 = data.img_title4
            } else {
              this.imgName4 = ''
            }
            if (data.img_title5 && data.img_title5 !== '') {
              this.imgName5 = data.img_title5
            } else {
              this.imgName5 = ''
            }
            if (data.img_title6 && data.img_title6 !== '') {
              this.imgName6 = data.img_title6
            } else {
              this.imgName6 = ''
            }
            if (data.img_title7 && data.img_title7 !== '') {
              this.imgName7 = data.img_title7
            } else {
              this.imgName7 = ''
            }
            if (data.img_title8 && data.img_title8 !== '') {
              this.imgName8 = data.img_title8
            } else {
              this.imgName8 = ''
            }
            if (data.img_title9 && data.img_title9 !== '') {
              this.imgName9 = data.img_title9
            } else {
              this.imgName9 = ''
            }
            if (data.show_summary && data.show_summary.toString() === '1') {
              this.showSummary = true
            } else {
              this.showSummary = false
            }
            if (data.show_url && data.show_url.toString() === '1') {
              this.showUrl = true
            } else {
              this.showUrl = false
            }
            if (data.show_video && data.show_video.toString() === '1') {
              this.showVideo = true
            } else {
              this.showVideo = false
            }
            if (data.show_img_in_list && data.show_img_in_list.toString() === '1') {
              this.showImgInList = true
            } else {
              this.showImgInList = false
            }
            if (data.show_cate && data.show_cate.toString() === '1') {
              this.showCate = true
            } else {
              this.showCate = false
            }
            if (data.show_sort && data.show_sort.toString() === '1') {
              this.showSort = true
            } else {
              this.showSort = false
            }
            if (data.show_is_home && data.show_is_home.toString() === '1') {
              this.showHome = true
            } else {
              this.showHome = false
            }
            if (data.show_recommend && data.show_recommend.toString() === '1') {
              this.showRecommend = true
            } else {
              this.showRecommend = false
            }
            if (data.show_search && data.show_search.toString() === '1') {
              this.showSearch = true
            } else {
              this.showSearch = false
            }
            if (data.show_seo && data.show_seo.toString() === '1') {
              this.showSeo = true
            } else {
              this.showSeo = false
            }
            if (data.show_rich_text && data.show_rich_text.toString() === '1') {
              this.showRichText = true
            } else {
              this.showRichText = false
            }
            if (data.show_sub_title && data.show_sub_title.toString() === '1') {
              this.showSubTitle = true
            } else {
              this.showSubTitle = false
            }
          }
        })
        .catch(error => {
          console.log(error)
        })
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
          code: 'product'
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
                  name: res.data.data.column_name,
                  url: ''
                },
                {
                  key: '3',
                  name: '核心产品',
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
          parent_code: 'cate-product'
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
    // 获取型号
    getModel (articleId) {
      this.$http
        .post('admin/model', {
          article_id: articleId
        })
        .then(res => {
          if (res.data.status === 'S') {
            this.modelData = res.data.data
          }
        })
        .catch()
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
          code: 'product'
        })
        .then(res => {
          if (res.data.status === 'S') {
            this.total = res.data.total
            res.data.data.forEach(item => {
              item.editable = false
              item.oldSort = item.sort
            })
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
    addFeature () {
      this.featureVisible = true
      this.featureAction = '新增'
      this.featureForm = {
        id: '',
        title: '',
        img: '',
        content: ''
      }
    },
    editFeature (item) {
      this.featureVisible = true
      this.featureAction = '编辑'
      this.featureForm = {
        id: item.id,
        title: item.title,
        img: item.img,
        content: item.content
      }
    },
    handleOnSubmitFeature () {
      const featureForm = { ...this.featureForm }
      if (this.featureForm.id === '') {
        this.featureForm.id = 1
        if (this.featureData.length === 0) {
          this.featureForm.id = 1
        } else {
          let id = 1
          this.featureData.forEach(item => {
            if (item.id > id) {
              id = item.id
            }
          })
          this.featureForm.id = id + 1
        }
        this.featureData.push(this.featureForm)
      } else {
        this.featureData.forEach((item, index) => {
          if (item.id === this.featureForm.id) {
            this.featureData[index] = {
              id: featureForm.id,
              title: featureForm.title,
              img: featureForm.img,
              content: featureForm.content
            }
          }
        })
        const featureData = JSON.parse(JSON.stringify(this.featureData))
        this.featureData = []
        this.featureData = featureData
      }
      this.featureForm = {
        id: '',
        title: '',
        img: '',
        content: ''
      }
      this.featureVisible = false
    },
    deleteFeature (id) {
      this.featureData.forEach((item, index) => {
        if (item.id === id) {
          this.featureData.splice(index, 1)
        }
      })
    },
    addModel () {
      if (this.form.article_id === '') {
        this.$warning({
          title: '提示',
          content: '请先保存产品后再添加型号'
        })
      } else {
        this.modelForm = {
          model_id: '',
          article_id: this.form.article_id,
          title: '',
          content: '',
          img: '',
          img2: '',
          parameter: '',
          description: ''
        }
        this.modelVisible = true
        this.modelAction = '新增'
      }
    },
    editModel (item) {
      this.modelForm = {
        model_id: item.model_id,
        article_id: item.article_id,
        title: item.title,
        content: item.content,
        img: item.img,
        img2: item.img2,
        parameter: item.parameter,
        description: item.description
      }
      this.modelVisible = true
      this.modelAction = '编辑'
    },
    // 删除单个型号
    deleteModel (id, articleId) {
      const self = this
      this.$confirm({
        title: '提示',
        content: '确定要删除吗?',
        okText: '确定',
        cancelText: '取消',
        onOk () {
          self.$http
            .post('admin/model/del', {
              model_id: id
            })
            .then(res => {
              if (res.data.status === 'S') {
                self.$message.success('删除成功')
                self.getModel(articleId)
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
    addItem () {
      this.form = {
        article_id: '',
        cate_id: null,
        title: '',
        sub_title: '',
        summary: '',
        code: this.$route.params.code,
        img: '',
        img2: '',
        img3: '',
        img4: '',
        img5: '',
        video: '',
        url: '',
        sort: 99,
        is_home: '0',
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
        attribute2: '',
        attribute3: '',
        attribute4: '',
        attribute5: '',
        attribute6: '',
        attribute7: '',
        attribute8: '',
        attribute9: '',
        attribute10: '',
        attribute11: '',
        attribute12: '',
        attribute13: '',
        attribute14: '',
        attribute15: '',
        attribute16: ''
      }
      this.featureData = []
      this.modelData = []
      this.visible = true
      this.action = '新增'
    },
    editItem (item) {
      this.getModel(item.article_id)
      this.form = {
        article_id: item.article_id,
        cate_id: JSON.parse(item.cate_ids),
        title: item.title,
        sub_title: item.sub_title,
        summary: item.summary,
        code: item.code,
        sort: item.sort,
        is_home: item.is_home ? item.is_home.toString() : '0',
        img: item.img,
        img2: item.img2,
        img3: item.img3,
        img4: item.img4,
        img5: item.img5,
        url: item.url,
        video: item.video,
        status: item.status ? item.status.toString() : '0',
        content: item.content,
        create_date: moment(item.create_date, 'YYYY-MM-DD'),
        web_title: item.web_title,
        meta_search_title: item.meta_search_title,
        meta_author: item.meta_author,
        meta_keywords: item.meta_keywords,
        meta_copyright: item.meta_copyright,
        attribute1: item.attribute1,
        attribute2: item.attribute2,
        attribute3: item.attribute3,
        attribute4: item.attribute4,
        attribute5: item.attribute5,
        attribute6: item.attribute6,
        attribute7: item.attribute7,
        attribute8: item.attribute8,
        attribute9: item.attribute9,
        attribute10: item.attribute10,
        attribute11: item.attribute11,
        attribute12: item.attribute12,
        attribute13: item.attribute13,
        attribute14: item.attribute14,
        attribute15: item.attribute15,
        attribute16: item.attribute16
      }
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
    showEdit (item) {
      if (this.$store.getters.hasPermission('product-edit')) {
        item.editable = true
        setTimeout(() => {
          document.querySelector('#input_' + item.article_id).focus()
        }, 500)
      }
    },
    updateSort (item) {
      if (item.sort === item.oldSort) {
        item.editable = false
      } else {
        this.$http
        .post('admin/article/updateSort', {
          article_id: item.article_id,
          sort: item.sort
        })
        .then(res => {
          if (res.data.status === 'S') {
            item.oldSort = item.sort
            item.editable = false
            this.$message.success('修改成功')
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
    },
    handleOnSubmit () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          const params = JSON.parse(JSON.stringify(this.form))
          if (this.form.cate_id !== '') {
            params.cate_id = this.form.cate_id[this.form.cate_id.length - 1]
            params.cate_ids = JSON.stringify(this.form.cate_id)
          }
          params.create_date = moment(params.create_date).format(
            'YYYY-MM-DD HH:mm:ss'
          )
          params.code = 'product'
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
    handleOnSubmitModel () {
      this.$refs.modelRuleForm.validate(valid => {
        if (valid) {
          const params = JSON.parse(JSON.stringify(this.modelForm))
          this.$http
            .post('admin/model/edit', params)
            .then(res => {
              if (res.data.status === 'S') {
                this.getModel(this.modelForm.article_id)
                this.modelVisible = false
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
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .ant-upload.ant-upload-select-picture-card > .ant-upload {
  img {
    max-width: 200px;
  }
}
</style>
