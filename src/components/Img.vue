<template>
  <div>
    <div class="tool-bar" style="margin-bottom: 16px">
      <a-row>
        <a-col :span="12">
          <div class="page-title">{{ column_name }}</div>
        </a-col>
        <a-col :span="12">
          <div class="btn-box">
            <a-button icon="plus" v-action:[imgAddAction] type="primary" @click="addItem()">添加</a-button>
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
        row-key="img_id"
        size="small"
      >
        <div slot="sort" slot-scope="text">
          <div style="border-bottom: 1px solid #ddd; padding: 5px 0; text-indent: 12px;" v-if="!text.editable || !$store.getters.hasPermission(imgEditAction)" @click="showEdit(text)">{{ text.sort }}</div>
          <div v-else>
            <a-input class="input-sort" :id="`input_${text.img_id}`" v-model="text.sort" @blur="text.oldSort===text.sort?text.editable=false:text.editable=true">
              <a-button class="btn-sort" slot="addonAfter" size="small" @click="updateSort(text)">
                <a-icon type="save" />
              </a-button>
            </a-input>
          </div>
        </div>
        <div slot="img" slot-scope="text">
          <img :src="text.img" @click="previewImg=text.img;visiblePreview=true;" style="max-width: 80px; max-height: 40px; cursor: pointer;" alt="">
        </div>
        <div slot="status" slot-scope="text">
          <a-switch
            checkedChildren="正常"
            unCheckedChildren="禁用"
            :disabled="!$store.getters.hasPermission(imgEditAction)"
            :loading="text.loading"
            :checked="text.status=='1' ? true : false"
            @change="changeStatus(text)"
          />
        </div>
        <div class="action-box" slot="action" slot-scope="text">
          <a-tooltip placement="top" v-action:[imgEditAction]>
            <template slot="title">
              <span>修改</span>
            </template>
            <a-button type="primary" icon="edit" @click="editItem(text)"></a-button>
          </a-tooltip>
          <a-tooltip placement="top" v-action:[imgDelAction]>
            <template slot="title">
              <span>删除</span>
            </template>
            <a-button type="danger" icon="rest" @click="deleteItem(text.img_id)"></a-button>
          </a-tooltip>
        </div>
      </a-table>
    </div>

    <a-drawer
      :title="action + column_name"
      :width="'50%'"
      @close="onClose"
      :visible="visible"
      :bodyStyle="{paddingBottom: '80px'}"
    >
      <a-form-model
        ref="ruleForm"
        layout="horizontal"
        :model="form"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-row :gutter="24">
          <a-col :span="12" v-if="showCate">
            <a-form-model-item ref="cate_id" label="分类" prop="cate_id">
              <a-select v-model="form.cate_id">
                <a-select-option v-for="item in cateData" :key="item.cate_id" :value="item.cate_id">
                  {{ item.cate_name }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="16">
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
          <a-col :span="16" v-if="showSubTitle">
            <a-form-model-item ref="sub_title" label="副标题" prop="sub_title">
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
          <a-col :span="16">
            <UploadImgComponent :imgSize="imgSize" :imgName="imgName" :imageUrl.sync="form.img" :actionUrl="actionUrl"></UploadImgComponent>
          </a-col>
          <a-col :span="16" v-if="imgSize2!=''">
            <UploadImgComponent :imgSize="imgSize2" :imgName="imgName2" :imageUrl.sync="form.img2" :actionUrl="actionUrl"></UploadImgComponent>
          </a-col>
          <a-col :span="16" v-if="showUrl">
            <a-form-model-item ref="url" label="链接网址" prop="url">
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
          <a-col :span="16" v-if="showSummary">
            <a-form-model-item ref="summary" label="概述" prop="summary">
              <a-textarea
                v-model="form.summary"
                placeholder=""
                :auto-size="{ minRows: 3, maxRows: 5 }"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="16">
            <a-form-model-item ref="sort" label="排序" prop="sort">
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
          <a-col :span="16">
            <a-form-model-item ref="status" label="状态" prop="status">
              <a-radio-group v-model="form.status">
                <a-radio :value="'1'">启用</a-radio>
                <a-radio :value="'0'">停用</a-radio>
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
    </a-drawer>

    <a-modal v-model="visiblePreview" title="" :width="imgWidth+48" :footer="null" centered>
      <div style="text-align: center;">
        <img :src="previewImg" :style="{maxWidth: imgWidth+'px'}" alt="">
      </div>
    </a-modal>
  </div>
</template>

<script>
import UploadImgComponent from './modules/UploadImg.component'
const columns1 = [
  { title: '图片', dataIndex: '', key: 'img', scopedSlots: { customRender: 'img' }, width: 100 },
  { title: '标题', dataIndex: 'title', key: 'title' }
]
const columnsUrl = [
  { title: '链接地址', dataIndex: 'url', key: 'url' }
]
const columnsCate = [
  { title: '分类', dataIndex: 'cate_name', key: 'cate_name' }
]
const columns2 = [
  { title: '排序号', dataIndex: '', key: 'sort', scopedSlots: { customRender: 'sort' }, width: '100px' },
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
      columns: columns1.concat(columns2),
      column_name: '',
      pageSize: 10,
      currentPage: 1,
      total: 0,
      data: [],
      cateData: [],
      tableLoading: false,
      action: '',
      visible: false,
      labelCol: { },
      wrapperCol: { },
      imgSize: '',
      imgSize2: '',
      imgName: '',
      imgName2: '',
      imgWidth: 300,
      showUrl: true,
      showSummary: true,
      showCate: true,
      showSubTitle: false,
      headers: {
        AccessToken: localStorage.getItem('token')
      },
      actionUrl: this.$baseUrl + 'admin/img/upload_img' + (process.env.NODE_ENV === 'development' ? '?voucher=token' : '?voucher=session'),
      form: {
        img_id: null,
        title: '',
        sub_title: '',
        code: '',
        summary: '',
        url: '',
        img: '',
        img2: '',
        sort: 99,
        status: '1'
      },
      rules: {
        title: [
          { required: false, message: '请输入标题', trigger: 'blur' }
        ],
        url: [
          { required: false, message: '请输入链接地址', trigger: 'blur' }
        ],
        summary: [
          { required: false, message: '请输入概述', trigger: 'blur' }
        ],
        img: [
          { required: false, message: '请上传图片', trigger: 'blur' }
        ],
        img2: [
          { required: false, message: '请上传图片', trigger: 'blur' }
        ],
        sort: [{ required: true, message: '请输入排序号', trigger: blur }],
        status: [{ required: true, message: '请选择状态', trigger: 'change' }]
      },
      visiblePreview: false,
      previewImg: '',
      imgAddAction: this.$route.params.code + '-add',
      imgEditAction: this.$route.params.code + '-edit',
      imgDelAction: this.$route.params.code + '-del'
    }
  },
  name: 'Img',
    components: {
    UploadImgComponent
  },
  watch: {
    $route: function () {
      this.getList()
      this.getColumnByCode()
      // this.imgWidth = this.$route.query.img.split(',')[0] > 800 ? 800 : this.$route.query.img.split(',')[0]
      this.imgAddAction = this.$route.params.code + '-add'
      this.imgEditAction = this.$route.params.code + '-edit'
      this.imgDelAction = this.$route.params.code + '-del'
    }
  },
  created () {
    this.getList()
    this.getColumnByCode()
    this.imgAddAction = this.$route.params.code + '-add'
    this.imgEditAction = this.$route.params.code + '-edit'
    this.imgDelAction = this.$route.params.code + '-del'
    this.$root.$on('updateToken', (data) => {
      this.headers.AccessToken = data
    })
  },
  methods: {
    getColumnByCode () {
      this.$http
        .post('admin/column/getColumnByCode', {
          code: this.$route.params.code
        })
        .then(res => {
          if (res.data.status === 'S') {
            const data = res.data.data
            this.columns = columns1
            if (data.img_size && data.img_size !== '') {
              this.imgSize = '图片尺寸：' + data.img_size.replace(',', '×') + '像素'
              this.showImg = true
              this.imgWidth = data.img_size.split(',')[0] > 800 ? 800 : data.img_size.split(',')[0]
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
            if (data.show_summary && data.show_summary.toString() === '1') {
              this.showSummary = true
            } else {
              this.showSummary = false
            }
            if (data.show_url && data.show_url.toString() === '1') {
              this.showUrl = true
              this.columns = this.columns.concat(columnsUrl)
            } else {
              this.showUrl = false
            }
            if (data.show_cate && data.show_cate.toString() === '1') {
              this.getCate()
              this.showCate = true
              this.columns = this.columns.concat(columnsCate)
            } else {
              this.showCate = false
              this.cateData = []
            }
            if (data.show_sub_title && data.show_sub_title.toString() === '1') {
              this.showSubTitle = true
            } else {
              this.showSubTitle = false
            }
            this.columns = this.columns.concat(columns2)
            this.column_name = data.column_name
            this.$store.commit('setBreadcrumb', {
              breadcrumbData: [
                {
                  key: '1',
                  name: '首页',
                  url: '#/main/base'
                },
                {
                  key: '3',
                  name: data.column_name,
                  url: ''
                },
                {
                  key: '2',
                  name: '图片管理',
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
          parent_code: this.$route.query.cate ? this.$route.query.cate : 'cate-none'
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
    getList (retry) {
      if (retry) {
        setTimeout(() => {
          this.getList(true)
        }, 2000)
      }
      this.tableLoading = true
      this.$http
        .post('admin/img', {
          page_size: this.pageSize,
          current_page: this.currentPage,
          code: this.$route.params.code
        })
        .then(res => {
          if (res.data.status === 'S') {
            res.data.data.forEach(item => {
              item.editable = false
              item.oldSort = item.sort
            })
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
        cate_id: null,
        img_id: null,
        title: '',
        sub_title: '',
        url: '',
        summary: '',
        code: this.$route.params.code,
        img: '',
        img2: '',
        sort: 99,
        status: '1'
      }
      this.visible = true
      this.action = '新增'
    },
    editItem (item) {
      this.form = {
        cate_id: item.cate_id,
        img_id: item.img_id,
        title: item.title,
        sub_title: item.sub_title,
        url: item.url,
        img: item.img,
        img2: item.img2,
        code: item.code,
        summary: item.summary,
        sort: item.sort,
        status: item.status ? item.status.toString() : '0'
      }
      this.visible = true
      this.action = '新增'
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
            .post('admin/img/del', {
              img_id: id
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
    handleOnSubmit () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.$http
            .post('admin/img/edit', this.form)
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
    showEdit (item) {
      if (this.$store.getters.hasPermission(this.imgEditAction)) {
        item.editable = true
        setTimeout(() => {
          document.querySelector('#input_' + item.img_id).focus()
        }, 500)
      }
    },
    updateSort (item) {
      if (item.sort === item.oldSort) {
        item.editable = false
      } else {
        this.$http
        .post('admin/img/updateSort', {
          img_id: item.img_id,
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
        .post('admin/img/modifyStatus', {
          img_id: item.img_id,
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
