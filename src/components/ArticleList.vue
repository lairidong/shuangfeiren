<template>
  <div>
    <div class="search-box" v-if="showSearch">
      <a-form class="ant-advanced-search-form" @submit="handleSearch">
        <a-row :gutter="24">
          <a-col :span="6" :style="{ display: 'block' }">
            <a-form-item :label="`标题`">
              <a-input allowClear v-model="searchItem.title" placeholder />
            </a-form-item>
          </a-col>
          <a-col :span="6" :style="{ display: 'block' }">
            <a-form-item :label="`分类`">
              <a-cascader v-model="cateSelected" :options="cateData" @change="handleCateChange" :placeholder="'请选择'" :fieldNames="{ label: 'cate_name', value: 'cate_id', children: 'children' }" />
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
          <div class="page-title">
            信息列表
          </div>
        </a-col>
        <a-col :span="12">
          <div class="btn-box">
            <a-button icon="rest" type="danger" @click="delSelect" :disabled="!hasSelected" v-action:[articleEditAction]>
              批量删除
            </a-button>
            <a-button icon="plus" type="primary" @click="addItem()" v-action:[articleEditAction]>
              添加
            </a-button>
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
        :scroll="{ x: 1210 }"
        size="small">
        <div slot="img" slot-scope="text">
          <img :src="text.img" @click="previewImg=text.img;visiblePreview=true;" style="max-width: 80px; max-height: 40px; cursor: pointer;" alt="">
        </div>
        <div slot="sort" slot-scope="text">
          <div style="border-bottom: 1px solid #ddd; padding: 5px 0; text-indent: 12px;" v-if="!text.editable || !$store.getters.hasPermission(articleEditAction)" @click="showEdit(text)">{{ text.sort }}</div>
          <div v-else>
            <a-input class="input-sort" :id="`input_${text.article_id}`" v-model="text.sort" @blur="text.oldSort===text.sort?text.editable=false:text.editable=true">
              <a-button class="btn-sort" slot="addonAfter" size="small" @click="updateSort(text)">
                <a-icon type="save" />
              </a-button>
            </a-input>
          </div>
        </div>
        <div slot="status" slot-scope="text">
          <a-switch
            checkedChildren="正常"
            unCheckedChildren="禁用"
            :disabled="!$store.getters.hasPermission(articleEditAction)"
            :loading="text.loading"
            :checked="text.status=='1' ? true : false"
            @change="changeStatus(text)" />
        </div>
        <div slot="is_home" slot-scope="text">
          <a-switch
            checkedChildren="是"
            unCheckedChildren="否"
            :disabled="!$store.getters.hasPermission(articleEditAction)"
            :loading="text.loadingHome"
            :checked="text.is_home=='1' ? true : false"
            @change="changeIsHome(text)" />
        </div>
        <div slot="is_recommend" slot-scope="text">
          <a-switch
            checkedChildren="是"
            unCheckedChildren="否"
            :disabled="!$store.getters.hasPermission(articleEditAction)"
            :loading="text.loadingRecommend"
            :checked="text.is_recommend=='1' ? true : false"
            @change="changeIsRecommend(text)" />
        </div>
        <div class="action-box" slot="action" slot-scope="text">
          <a-tooltip placement="top" v-action:[articleEditAction]>
            <template slot="title">
              <span>修改</span>
            </template>
            <a-button type="primary" icon="edit" @click="editItem(text)"></a-button>
          </a-tooltip>
          <a-tooltip placement="top" v-action:[articleEditAction]>
            <template slot="title">
              <span>删除</span>
            </template>
            <a-button type="danger" icon="rest" @click="deleteItem(text.article_id)"></a-button>
          </a-tooltip>
        </div>
      </a-table>
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
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-tabs default-active-key="1">
          <a-tab-pane key="1" tab="内容">
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
            <a-row :gutter="24" v-if="showSubTitle">
              <a-col :span="12">
                <a-form-model-item ref="sub_title" label="副标题" prop="sub_title">
                  <a-textarea
                    v-model="form.sub_title"
                    :auto-size="{ minRows: 2, maxRows: 5 }"
                    @blur="
                      () => {
                        $refs.sub_title.onFieldBlur();
                      }
                    "
                  />
                </a-form-model-item>
              </a-col>
            </a-row>
            <!-- <a-row :gutter="24">
              <a-col :span="12">
                <a-form-model-item ref="attribute1" label="标签" prop="attribute1">
                  <a-input
                    v-model="form.attribute1"
                    @blur="
                      () => {
                        $refs.attribute1.onFieldBlur();
                      }
                    "
                  />
                </a-form-model-item>
              </a-col>
            </a-row> -->
            <a-row :gutter="24" v-if="cateData.length>1">
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
                    @change="changeCate"
                    :fieldNames="{ label: 'cate_name', value: 'cate_id', children: 'children' }" />
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row :gutter="24" v-if="showSummary">
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
            <a-row :gutter="16" v-if="showImg">
              <a-col :span="24">
                <UploadImgComponent :imgSize="imgSize" :imgName="imgName" :imageUrl.sync="form.img" :actionUrl="actionUrl"></UploadImgComponent>
              </a-col>
            </a-row>
            <a-row :gutter="24" v-if="showVideo">
              <a-col :span="24">
                <a-form-model-item ref="video" label="上传视频" prop="video">
                  <a-upload
                    name="files[]"
                    list-type="picture-card"
                    class="avatar-uploader"
                    :show-upload-list="false"
                    :action="actionUrlVideo"
                    :before-upload="beforeUploadVideo"
                    :headers="headers"
                    @change="handleChangeVideo"
                  >
                    <div v-if="videoUrl&&!loadingVideo">已上传</div>
                    <div v-if="loadingVideo">
                      <a-icon :type="'loading'" />
                      <div class="ant-upload-text">
                        {{ percentVideo }}%
                      </div>
                    </div>
                    <div v-if="!videoUrl&&!loadingVideo">
                      <a-icon :type="'plus'" />
                      <div class="ant-upload-text">
                        上传
                      </div>
                    </div>
                  </a-upload>
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row :gutter="24" v-if="showSort">
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
                    " />
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row :gutter="24" v-if="showUrl">
              <a-col :span="24" style="margin-top: 8px;">
                <a-form-model-item ref="is_url" label="是否外链" prop="is_url">
                  <a-radio-group style="width: 100%;" v-model="form.is_url">
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
            <a-row :gutter="24" v-if="form.is_url=='1'&&showUrl&&!showVideo">
              <a-col :span="12">
                <a-form-model-item
                  ref="url"
                  label="外部链接地址"
                  prop="url"
                  :rules="{
                    required: form.is_url == '1',
                    message: '请输入外部链接地址',
                    trigger: 'blur',
                  }">
                  <a-input
                    v-model="form.url"
                    @blur="
                      () => {
                        $refs.url.onFieldBlur();
                      }
                    "
                  />
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row :gutter="24" v-if="form.is_url=='0'&&showRichText">
              <a-col :span="24">
                <vue-ueditor-wrap v-model="form.content" :config="myConfig"></vue-ueditor-wrap>
              </a-col>
            </a-row>
            <a-row :gutter="24" v-if="form.is_url=='0'&&!showRichText">
              <a-col :span="12">
                <a-form-model-item ref="content" label="内容" prop="content">
                  <a-textarea
                    v-model="form.content"
                    :auto-size="{ minRows: 3, maxRows: 5 }"
                  />
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row :gutter="24" v-if="showHome">
              <a-col :span="24" style="margin-top: 8px;">
                <a-form-model-item ref="is_home" label="推荐到首页?" prop="is_home">
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
            <a-row :gutter="24" v-if="showRecommend">
              <a-col :span="24" style="margin-top: 8px;">
                <a-form-model-item ref="is_recommend" label="推荐?" prop="is_recommend">
                  <a-radio-group style="width: 100%;" v-model="form.is_recommend">
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
                    <a-radio :value="'1'">
                      正常
                    </a-radio>
                    <a-radio :value="'0'">
                      禁用
                    </a-radio>
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
                  <a-button :style="{marginRight: '8px'}" size="large" @click="onClose">
                    取消
                  </a-button>
                  <a-button type="primary" html-type="submit" size="large" @click="handleOnSubmit">提交</a-button>
                </div>
              </a-col>
            </a-row>
          </a-tab-pane>
          <a-tab-pane key="2" tab="SEO优化" force-render v-if="showSeo">
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
import UploadImgComponent from './modules/UploadImg.component'
const columnImg = [
  { title: '封面', dataIndex: '', key: 'img', scopedSlots: { customRender: 'img' }, width: 100 }
]
const columnSort = [
  { title: '排序号', dataIndex: '', key: 'sort', scopedSlots: { customRender: 'sort' }, width: 100 }
]
const columnHome = [
  { title: '推荐到首页', dataIndex: '', key: 'is_home', scopedSlots: { customRender: 'is_home' }, width: 100 }
]
const columnRecommend = [
  { title: '推荐', dataIndex: '', key: 'is_recommend', scopedSlots: { customRender: 'is_recommend' }, width: 100 }
]
const columnsCate = [
    { title: '分类', dataIndex: 'cate_name', key: 'cate_name', width: 200 }
]
const columns1 = [
    { title: '标题', dataIndex: 'title', key: 'title' },
    { title: '编辑', dataIndex: 'author', key: 'author', width: 100 }
]
const columns2 = [
  { title: '日期', dataIndex: 'create_date', key: 'create_date', width: 120 },
  { title: '状态', dataIndex: '', key: 'a', scopedSlots: { customRender: 'status' }, width: 90, fixed: 'right' },
  { title: '操作', dataIndex: '', key: 'x', scopedSlots: { customRender: 'action' }, width: 150, fixed: 'right' }
]
export default {
  data () {
    return {
      moment,
      locale,
      columns: columns1.concat(columns2),
      pageSize: 10,
      currentPage: 1,
      total: 0,
      data: [],
      tableLoading: false,
      action: '',
      visible: false,
      labelCol: { },
      wrapperCol: { },
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
      cateSelected: [],
      form: {
        cate_id: '',
        product_id: '0',
        title: '',
        summary: '',
        sort: '99',
        is_home: '0',
        is_url: '0',
        is_recommend: '0',
        url: '',
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
        video: '',
        attribute1: ''
      },
      imgSize: '',
      imgSize2: '',
      imgSize3: '',
      imgSize4: '',
      imgName: '',
      imgName2: '',
      imgName3: '',
      imgName4: '',
      imgWidth: 400,
      loadingVideo: false,
      percentVideo: 0,
      videoUrl: '',
      showImg: false,
      showImg2: false,
      showImg3: false,
      showImg4: false,
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
      actionUrlVideo: this.$baseUrl + 'admin/img/upload_video' + (process.env.NODE_ENV === 'development' ? '?voucher=token' : '?voucher=session'),
      rules: {
        cate_id: [
          { required: true, message: '请选择分类', trigger: 'blur' }
        ],
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' }
        ],
        summary: [
          { required: false, message: '', trigger: 'blur' }
        ],
        sort: [{ required: true, message: '请输入排序号', trigger: blur }],
        create_date: [{ required: true, message: '请选择日期', trigger: 'change' }],
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
      previewImg: '',
      articleAddAction: this.$route.params.code + '-add',
      articleEditAction: this.$route.params.code + '-edit',
      articleDelAction: this.$route.params.code + '-del',
      isVideo: false
    }
  },
  name: 'ArticleList',
  components: {
    VueUeditorWrap,
    UploadImgComponent
  },
  computed: {
    hasSelected () {
      return this.selectedRowKeys.length > 0
    }
  },
  watch: {
    $route: function () {
      // this.getCate()
      this.getList()
      this.getParentColumnByCode()
      this.getColumnByCode()
      this.form.parent_code = this.$route.params.code
      this.articleAddAction = this.$route.params.code + '-add'
      this.articleEditAction = this.$route.params.code + '-edit'
      this.articleDelAction = this.$route.params.code + '-del'
    }
  },
  created () {
    // this.getCate()
    this.getList()
    this.getParentColumnByCode()
    this.getColumnByCode()
    this.articleAddAction = this.$route.params.code + '-add'
    this.articleEditAction = this.$route.params.code + '-edit'
    this.articleDelAction = this.$route.params.code + '-del'
    this.$root.$on('updateToken', (data) => {
      this.headers.AccessToken = data
    })
  },
  methods: {
    showEdit (item) {
      if (this.$store.getters.hasPermission(this.articleEditAction)) {
        item.editable = true
        setTimeout(() => {
          document.querySelector('#input_' + item.article_id).focus()
        }, 500)
      }
    },
    getColumnByCode () {
      this.$http
        .post('admin/column/getColumnByCode', {
          code: this.$route.params.code
        })
        .then(res => {
          if (res.data.status === 'S') {
            const data = res.data.data
            let columns = []
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
              columns = columns.concat(columnImg)
            } else {
              this.showImgInList = false
            }
            columns = columns.concat(columns1)
            if (data.show_cate && data.show_cate.toString() === '1') {
              this.showCate = true
              this.getCate()
              columns = columns.concat(columnsCate)
            } else {
              this.cateData = []
              this.showCate = false
            }
            if (data.show_sort && data.show_sort.toString() === '1') {
              this.showSort = true
              columns = columns.concat(columnSort)
            } else {
              this.showSort = false
            }
            if (data.show_is_home && data.show_is_home.toString() === '1') {
              this.showHome = true
              columns = columns.concat(columnHome)
            } else {
              this.showHome = false
            }
            if (data.show_recommend && data.show_recommend.toString() === '1') {
              this.showRecommend = true
              columns = columns.concat(columnRecommend)
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
            columns = columns.concat(columns2)
            this.columns = columns
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    changeCate (value) {
      let isVideo = false
      this.cateData.forEach(item => {
        if (item.cate_id.toString() === value.toString()) {
          isVideo = item.code === 'video'
        }
      })
      this.isVideo = isVideo
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
          code: this.$route.params.code
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
          parent_code: this.$route.params.cate
        })
        .then(res => {
          if (res.data.status === 'S') {
            res.data.data.forEach(item => {
              if (!item.children) {
                delete item.children
              }
            })
            this.cateData = res.data.data
            console.log(this.cateData)
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
      this.cateSelected = []
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
      this.current_page = 1
      this.filterItem = JSON.parse(JSON.stringify(this.searchItem))
      this.getList(false)
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
    getList (retry) {
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
          code: this.$route.params.code
        })
        .then(res => {
          if (res.data.status === 'S') {
            this.total = res.data.total
            res.data.data.forEach(item => {
              item.editable = false
              item.oldSort = item.sort
            })
            this.data = res.data.data
            if (!retry) {
              this.getList(true)
            }
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
        cate_id: this.cateData.length === 1 ? [this.cateData[0].cate_id] : null,
        title: '',
        sub_title: '',
        summary: '',
        code: this.$route.params.code,
        img: '',
        video: '',
        sort: '99',
        is_home: '0',
        is_url: '0',
        is_recommend: '0',
        url: 'http://',
        status: '1',
        content: '',
        create_date: moment(new Date(), 'YYYY-MM-DD'),
        web_title: '',
        meta_search_title: '',
        meta_author: '',
        meta_keywords: '',
        meta_copyright: '',
        meta_description: '',
        attribute1: ''
      }
      this.videoUrl = ''
      this.visible = true
      this.action = '新增'
      this.changeCate(0)
    },
    editItem (item) {
      this.form = {
        article_id: item.article_id,
        cate_id: JSON.parse(item.cate_ids),
        title: item.title,
        sub_title: item.sub_title,
        summary: item.summary,
        code: item.code,
        img: item.img,
        video: item.video,
        sort: item.sort,
        is_home: item.is_home ? item.is_home.toString() : '0',
        is_url: item.is_url ? item.is_url.toString() : '0',
        is_recommend: item.is_recommend ? item.is_recommend.toString() : '0',
        status: item.status ? item.status.toString() : '0',
        url: item.url,
        content: item.content,
        create_date: moment(new Date(item.create_date), 'YYYY-MM-DD'),
        web_title: item.web_title,
        meta_search_title: item.meta_search_title,
        meta_author: item.meta_author,
        meta_keywords: item.meta_keywords,
        meta_copyright: item.meta_copyright,
        meta_description: item.meta_description,
        attribute1: item.attribute1
      }
      this.videoUrl = item.video
      this.visible = true
      this.action = '编辑'
      this.changeCate(item.cate_id)
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
          if (this.form.cate_id && this.form.cate_id !== '') {
            params.cate_id = this.form.cate_id[this.form.cate_id.length - 1]
            params.cate_ids = JSON.stringify(this.form.cate_id)
          } else {
            params.cate_id = 0
          }
          params.video = this.videoUrl
          params.code = this.$route.params.code
          params.create_date = moment(params.create_date).isValid() ? moment(params.create_date).format('YYYY-MM-DD') : null
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
    changeIsRecommend (item) {
      item.loadingRecommend = true
      this.$http
        .post('admin/article/modifyIsRecommend', {
          article_id: item.article_id,
          is_recommend: item.is_recommend === 1 ? 0 : 1
        })
        .then(res => {
          item.loadingRecommend = false
          if (res.data.status === 'S') {
            if (item.is_recommend === 1) {
              item.is_recommend = 0
            } else {
              item.is_recommend = 1
            }
          } else if (res.data.status !== 'T') {
            this.$error({
              title: '提示',
              content: res.data.msg
            })
          }
        })
        .catch(error => {
          item.loadingRecommend = false
          console.log(error)
        })
    },
    handleChangeVideo (info) {
      if (info.file.status === 'uploading') {
        this.loadingVideo = true
        if (info && info.event && info.event.percent) {
          this.percentVideo = info.event.percent
          this.percentVideo = this.percentVideo.toFixed(2)
        }
        return
      }
      if (info.file.status === 'done') {
        this.loadingVideo = false
        this.percentVideo = 100
        if (info.file.response.data) {
          this.videoUrl = info.file.response.data[0]
        } else {
          if (info.file.response.status === 'T') {
            this.$store.commit('setVisibleLogin', true)
          }
          this.$message.error(info.file.response.msg)
        }
      }
    },
    beforeUploadVideo (file) {
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
/deep/ .ant-upload.ant-upload-select-picture-card > .ant-upload{
  img{
    max-width: 500px;
  }
}
</style>
