<template>
  <div>
    <div class="tool-bar" style="margin-bottom: 16px">
      <a-row>
        <a-col :span="8">
          <span style="font-weight: 400; color: #333;">{{ title }}</span>
        </a-col>
        <a-col :span="16">
          <div class="btn-box" v-if="data.length<maxAdd">
            <a-button icon="plus" type="primary" @click="addItem()" v-action:[articleAddAction]>添加</a-button>
          </div>
        </a-col>
      </a-row>
    </div>
    <a-table
      :columns="columns"
      :data-source="data"
      :pagination="false"
      row-key="id"
      size="small"
    >
      <div slot="img" slot-scope="text">
        <img :src="text.img" style="max-width: 80px; max-height: 40px; cursor: pointer;" alt="">
      </div>
      <div slot="content" slot-scope="text">
        <div v-if="showEditor" v-html="text.content"></div>
        <div v-else>{{ text.content }}</div>
      </div>
      <div slot="sort" slot-scope="text">
        <div>{{ text.sort }}</div>
      </div>
      <div class="action-box" slot="action" slot-scope="text">
        <a-tooltip placement="top" v-action:[articleEditAction]>
          <template slot="title">
            <span>修改</span>
          </template>
          <a-button type="primary" icon="edit" @click="editItem(text)"></a-button>
        </a-tooltip>
        <a-tooltip placement="top" v-action:[articleDelAction]>
          <template slot="title">
            <span>删除</span>
          </template>
          <a-button type="danger" icon="rest" @click="deleteItem(text.id)"></a-button>
        </a-tooltip>
      </div>
    </a-table>

    <a-drawer
      :title="action + title"
      :width="'50%'"
      @close="visible=false"
      :visible="visible"
      :bodyStyle="{paddingBottom: '80px'}"
    >
      <a-form-model
        ref="form"
        layout="vertical"
        :model="form"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-row :gutter="24" v-if="showTitle">
          <a-col :span="24">
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
          <a-col :span="24">
            <a-form-model-item ref="sub_title" label="子标题" prop="sub_title">
              <a-input
                v-model="form.sub_title"
                @blur="
                  () => {
                    $refs.sub_title.onFieldBlur();
                  }
                "
              />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="24" v-if="showUrl">
          <a-col :span="24">
            <a-form-model-item ref="url" label="URL链接" prop="url">
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
        <a-row :gutter="24" v-if="showSummary && !showEditor">
          <a-col :span="24">
            <a-form-model-item ref="content" label="说明" prop="content">
              <a-textarea
                v-model="form.content"
                :auto-size="{ minRows: 5, maxRows: 5 }"
                @blur="
                  () => {
                    $refs.content.onFieldBlur();
                  }
                "
              />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="24" v-if="showSummary && showEditor">
          <a-col :span="24">
            <a-form-model-item ref="content" label="说明" prop="content">
              <vue-ueditor-wrap v-model="form.content" :config="myConfig"></vue-ueditor-wrap>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="16" v-if="showImg">
          <a-col :span="24">
            <UploadImgComponent :maxSize="maxSize" :imgSize="imgSize" :imgName="imgName" :imageUrl.sync="form.img"></UploadImgComponent>
          </a-col>
        </a-row>
        <a-row :gutter="16" v-if="showImg2">
          <a-col :span="24">
            <UploadImgComponent :maxSize="maxSize" :imgSize="imgSize2" :imgName="imgName2" :imageUrl.sync="form.img2"></UploadImgComponent>
          </a-col>
        </a-row>
        <a-row :gutter="16" v-if="showFile">
          <a-col :span="24">
            <UploadFileComponent :fileType="fileType" :maxSize="maxSizeFile" :imgName="fileName" :fileUrl.sync="form.file" :actionUrl="newActionUrlFile"></UploadFileComponent>
          </a-col>
        </a-row>
        <a-row :gutter="24">
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
              <a-button :style="{marginRight: '8px'}" size="large" @click="visible=false">取消</a-button>
              <a-button type="primary" html-type="submit" size="large" @click="handleOnSubmit">确定</a-button>
            </div>
          </a-col>
        </a-row>
      </a-form-model>
    </a-drawer>
  </div>
</template>

<script>
import VueUeditorWrap from 'vue-ueditor-wrap'
import UploadImgComponent from './UploadImg.component'
import UploadFileComponent from './UploadFile.component'
const columnImg = [{ title: '图片', dataIndex: '', key: 'img', scopedSlots: { customRender: 'img' }, width: 100 }]
const columnsCommon = [
  { title: '标题', dataIndex: 'title', key: 'title' },
  { title: '排序号', dataIndex: '', key: 'sort', scopedSlots: { customRender: 'sort' }, width: 100 },
  {
    title: '操作',
    dataIndex: '',
    key: 'x',
    scopedSlots: { customRender: 'action' },
    width: 150
  }
]
const columnsWithContent = [
  { title: '标题', dataIndex: 'title', key: 'title' },
  { title: '内容', dataIndex: '', key: 'content', scopedSlots: { customRender: 'content' } },
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
  components: {
    VueUeditorWrap,
    UploadImgComponent,
    UploadFileComponent
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    vActionName: {
      type: String,
      default: ''
    },
    list: {
      type: String,
      default: ''
    },
    showEditor: {
      type: Boolean,
      default: false
    },
    showTitle: {
      type: Boolean,
      default: true
    },
    showSubTitle: {
      type: Boolean,
      default: false
    },
    showSummary: {
      type: Boolean,
      default: true
    },
    showUrl: {
      type: Boolean,
      default: true
    },
    showFile: {
      type: Boolean,
      default: false
    },
    showImg: {
      type: Boolean,
      default: true
    },
    showImg2: {
      type: Boolean,
      default: false
    },
    maxAdd: {
      type: Number,
      default: 99
    },
    maxSize: {
      type: Number,
      default: 2
    },
    maxSizeFile: {
      type: Number,
      default: 2
    },
    imgSize: {
      type: String,
      default: ''
    },
    imgSize2: {
      type: String,
      default: ''
    },
    imgName: {
      type: String,
      default: ''
    },
    imgName2: {
      type: String,
      default: ''
    },
    fileName: {
      type: String,
      default: ''
    },
    fileType: {
      type: String,
      default: 'zip,rar,7z,tar,gz,pdf,doc,docx,xls,xlsx,ppt,pptx'
    },
    actionUrl: {
      type: String,
      default: ''
    },
    actionUrlFile: {
      type: String,
      default: ''
    },
    headers: {
      type: Object,
      default: () => {
        return {
          AccessToken: localStorage.getItem('token')
        }
      }
    }
  },
  data () {
    return {
      articleAddAction: '',
      articleEditAction: '',
      articleDelAction: '',
      action: '',
      visible: false,
      columnImg,
      columns: [],
      data: [],
      newActionUrl: this.$baseUrl + 'admin/article/upload_img' + (process.env.NODE_ENV === 'development' ? '?voucher=token' : '?voucher=session'),
      newActionUrlFile: this.$baseUrl + 'admin/file/upload_file' + (process.env.NODE_ENV === 'development' ? '?voucher=token' : '?voucher=session'),
      form: {
        id: '',
        title: '',
        sub_title: '',
        url: '',
        content: '',
        img: '',
        img2: '',
        file: '',
        sort: 99,
        editable: false
      },
      rules: {
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        url: [{ required: false, message: '请输入URL', trigger: 'blur' }],
        content: [{ required: false, message: '请输入内容', trigger: 'blur' }],
        sort: [{ required: true, message: '请输入排序号', trigger: 'blur' }]
      },
      labelCol: {},
      wrapperCol: {},
      myConfig: {
        // 编辑器不自动被内容撑高
        autoHeightEnabled: false,
        // 初始容器高度
        initialFrameHeight: 200,
        // 初始容器宽度
        initialFrameWidth: '100%',
        // 上传文件接口（这个地址是我为了方便各位体验文件上传功能搭建的临时接口，请勿在生产环境使用！！！部署在国外的服务器，如果无法访问，请自备梯子）
        serverUrl: '/_UEditor_/php/controller.php',
        // UEditor 资源文件的存放路径，如果你使用的是 vue-cli 生成的项目，通常不需要设置该选项，vue-ueditor-wrap 会自动处理常见的情况，如果需要特殊配置，参考下方的常见问题2
        UEDITOR_HOME_URL: '/_UEditor_/'
      }
    }
  },
  name: 'ImgTextListComponent',
  watch: {
    list: {
      handler (newValue, oldValue) {
        if (newValue) {
          if (newValue === '') {
            this.data = []
          } else {
            this.data = JSON.parse(newValue)
          }
        } else {
          this.data = []
        }
      },
      deep: true,
      immediate: true
    },
    vActionName (newValue, oldValue) {
      this.articleAddAction = newValue + '-add'
      this.articleEditAction = newValue + '-edit'
      this.articleDelAction = newValue + '-del'
    },
    fileType (newValue, oldValue) {
      if (newValue && newValue !== '') {
        this.fileType = newValue
      }
    },
    actionUrl (newValue, oldValue) {
      if (newValue && newValue !== '') {
        this.newActionUrl = newValue
      }
    },
    actionUrlFile (newValue, oldValue) {
      if (newValue && newValue !== '') {
        this.actionUrlFile = newValue
      }
    },
    showSummary (newValue, oldValue) {
      let column = []
      if (this.showImg) {
        column = column.concat(columnImg)
      }
      if (newValue) {
        column = column.concat(columnsWithContent)
      } else {
        column = column.concat(columnsCommon)
      }
      this.columns = column
    }
  },
  created () {
    if (this.list) {
      if (this.list === '') {
        this.data = []
      } else {
        this.data = JSON.parse(this.list)
      }
    } else {
      this.data = []
    }
    if (this.vActionName) {
      this.articleAddAction = this.vActionName + '-add'
      this.articleEditAction = this.vActionName + '-edit'
      this.articleDelAction = this.vActionName + '-del'
    }
    if (this.actionUrl && this.actionUrl !== '') {
      this.newActionUrl = this.actionUrl
    }
    if (this.actionUrlFile && this.actionUrlFile !== '') {
      this.newActionUrlFile = this.actionUrlFile
    }
    let column = []
    if (this.showImg) {
      column = column.concat(columnImg)
    }
    if (this.showSummary) {
      column = column.concat(columnsWithContent)
    } else {
      column = column.concat(columnsCommon)
    }
    this.columns = column
    this.$root.$on('updateToken', (data) => {
      this.headers.AccessToken = data
    })
  },
  updated () {
  },
  mounted () {
    //
  },
  methods: {
    onClose () {
      this.visible = false
    },
    addItem () {
      this.form = {
        id: '',
        title: '',
        sub_title: '',
        url: '',
        content: '',
        img: '',
        img2: '',
        file: '',
        sort: 99
      }
      this.visible = true
      this.action = '添加'
    },
    editItem (item) {
      this.form = {
        id: item.id,
        title: item.title,
        sub_title: item.sub_title,
        url: item.url,
        content: item.content,
        img: item.img,
        img2: item.img2,
        file: item.file || '',
        sort: item.sort
      }
      this.visible = true
      this.action = '编辑'
    },
    deleteItem (id) {
      this.data.forEach((item, index) => {
        if (item.id === id) {
          this.data.splice(index, 1)
        }
      })
      this.$emit('update:list', JSON.stringify(this.data))
    },
    handleOnSubmit () {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.form.id === '') {
            this.form.id = 1
            if (this.data.length === 0) {
              this.form.id = 1
            } else {
              let id = 1
              this.data.forEach(item => {
                if (item.id > id) {
                  id = item.id
                }
              })
              this.form.id = id + 1
            }
            this.data.push({ ...this.form })
          } else {
            this.data.forEach(item => {
              if (item.id === this.form.id) {
                item.title = this.form.title
                item.sub_title = this.form.sub_title
                item.url = this.form.url
                item.content = this.form.content
                item.sort = this.form.sort
                item.img = this.form.img
                item.img2 = this.form.img2
                item.file = this.form.file
              }
            })
          }

          this.visible = false
          this.form = {
            id: '',
            title: '',
            sub_title: '',
            url: '',
            content: '',
            sort: 99,
            img: '',
            img2: '',
            file: ''
          }
          // this.$message.success('已保存')
          this.$emit('update:list', JSON.stringify(this.data))
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>

</style>
