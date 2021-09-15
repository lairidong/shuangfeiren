<template>
  <div>
    <div class="tool-bar" style="margin-bottom: 16px">
      <a-row>
        <a-col :span="12">
          <div class="page-title">{{ title }}</div>
        </a-col>
        <a-col :span="12">
          <div class="btn-box">
            <a-button
              icon="plus"
              type="primary"
              v-action:[fileAddAction]
              @click="addItem()"
            >添加</a-button
            >
            <a-button
              icon="reload"
              type="link"
              @click="reload"
              :loading="tableLoading"
            ></a-button>
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
        row-key="file_id"
        size="small"
      >
        <div slot="sort" slot-scope="text">
          <div style="border-bottom: 1px solid #ddd; padding: 5px 0; text-indent: 12px;" v-if="!text.editable || !$store.getters.hasPermission(fileEditAction)" @click="showEdit(text)">{{ text.sort }}</div>
          <div v-else>
            <a-input class="input-sort" :id="`input_${text.file_id}`" v-model="text.sort" @blur="text.oldSort===text.sort?text.editable=false:text.editable=true">
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
            :disabled="!$store.getters.hasPermission(fileEditAction)"
            :loading="text.loading"
            :checked="text.status == '1' ? true : false"
            @change="changeStatus(text)"
          />
        </div>
        <div class="action-box" slot="action" slot-scope="text">
          <a-tooltip placement="top" v-action:[fileEditAction]>
            <template slot="title">
              <span>修改</span>
            </template>
            <a-button
              type="primary"
              icon="edit"
              @click="editItem(text)"
            ></a-button>
          </a-tooltip>
          <a-tooltip placement="top" v-action:[fileEditAction]>
            <template slot="title">
              <span>删除</span>
            </template>
            <a-button
              type="danger"
              icon="rest"
              @click="deleteItem(text.file_id)"
            ></a-button>
          </a-tooltip>
          <a-tooltip placement="top">
            <template slot="title">
              <span>下载</span>
            </template>
            <a-button
              type="danger"
              icon="download"
              @click="downloadItem(text.file_id, text.file)"
            ></a-button>
          </a-tooltip>
        </div>
      </a-table>
    </div>

    <a-drawer
      :title="action + title"
      :width="'50%'"
      @close="onClose"
      :visible="visible"
      :bodyStyle="{ paddingBottom: '80px' }"
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
          <a-col :span="16">
            <a-form-model-item ref="title" label="标题" prop="title">
              <a-input
                v-model="form.title"
                @blur="
                  () => {
                    $refs.title.onFieldBlur()
                  }
                "
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="16">
            <a-form-model-item ref="file" label="上传文件" prop="file" extra="可上传的文件格式：zip，rar，7z，tar，gz，pdf，doc，docx，xls，xlsx，ppt，pptx">
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
                <div v-if="fileUrl&&!loadingFile">已上传</div>
                <div v-if="loadingFile">
                  <a-icon :type="'loading'" />
                  <div class="ant-upload-text">
                    {{ percentFile }}%
                  </div>
                </div>
                <div v-if="!fileUrl&&!loadingFile">
                  <a-icon :type="'plus'" />
                  <div class="ant-upload-text">
                    上传
                  </div>
                </div>
              </a-upload>
            </a-form-model-item>
          </a-col>
          <a-col :span="16">
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
                    $refs.sort.onFieldBlur()
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
              <a-button
                :style="{ marginRight: '8px' }"
                size="large"
                @click="onClose"
              >取消</a-button
              >
              <a-button
                type="primary"
                html-type="submit"
                size="large"
                @click="handleOnSubmit"
              >提交</a-button
              >
            </div>
          </a-col>
        </a-row>
      </a-form-model>
    </a-drawer>
  </div>
</template>

<script>
const columns = [
  { title: '标题', dataIndex: 'title', key: 'title' },
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
      columns,
      pageSize: 10,
      currentPage: 1,
      total: 0,
      title: '',
      data: [],
      tableLoading: false,
      action: '',
      visible: false,
      labelCol: {},
      wrapperCol: {},
      loadingFile: false,
      percentFile: 0,
      fileUrl: '',
      headers: {
        AccessToken: localStorage.getItem('token')
      },
      actionUrl: this.$baseUrl + 'admin/file/upload_file' + (process.env.NODE_ENV === 'development' ? '?voucher=token' : '?voucher=session'),
      form: {
        file_id: null,
        title: '',
        code: '',
        summary: '',
        file: '',
        sort: 99,
        status: '1'
      },
      rules: {
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        summary: [{ required: false, message: '请输入概述', trigger: 'blur' }],
        file: [{ required: true, message: '请上传文件', trigger: 'blur' }],
        sort: [{ required: true, message: '请输入排序号', trigger: blur }],
        status: [{ required: true, message: '请选择状态', trigger: 'change' }]
      },
      fileAddAction: this.$route.params.code + '-add',
      fileEditAction: this.$route.params.code + '-edit',
      fileDelAction: this.$route.params.code + '-del'
    }
  },
  name: 'File',
  watch: {
    $route: function () {
      this.getList()
      this.getColumnByCode()
      this.fileAddAction = this.$route.params.code + '-add'
      this.fileEditAction = this.$route.params.code + '-edit'
      this.fileDelAction = this.$route.params.code + '-del'
    }
  },
  created () {
    this.getList()
    this.getColumnByCode()
    this.fileAddAction = this.$route.params.code + '-add'
    this.fileEditAction = this.$route.params.code + '-edit'
    this.fileDelAction = this.$route.params.code + '-del'
    this.$root.$on('updateToken', (data) => {
      this.headers.AccessToken = data
    })
  },
  methods: {
    getColumnByCode () {
      this.$http
        .post('admin/column/getParentColumnByCode', {
          code: this.$route.params.code
        })
        .then((res) => {
          if (res.data.status === 'S') {
            this.$http
              .post('admin/column/getColumnByCode', {
                code: this.$route.params.code
              })
              .then((res2) => {
                this.title = res2.data.data.column_name
                if (res2.data.status === 'S') {
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
    getList (retry) {
      if (retry) {
        setTimeout(() => {
          this.getList(true)
        }, 2000)
      }
      this.tableLoading = true
      this.$http
        .post('admin/file', {
          page_size: this.pageSize,
          current_page: this.currentPage,
          code: this.$route.params.code
        })
        .then((res) => {
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
        .catch((error) => {
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
        file_id: null,
        title: '',
        url: '',
        summary: '',
        code: this.$route.params.code,
        file: '',
        sort: 99,
        status: '1'
      }
      this.fileUrl = ''
      this.visible = true
      this.action = '新增'
    },
    editItem (item) {
      this.form = {
        file_id: item.file_id,
        title: item.title,
        url: item.url,
        file: item.file,
        code: item.code,
        summary: item.summary,
        sort: item.sort,
        status: item.status ? item.status.toString() : '0'
      }
      this.fileUrl = item.file
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
            .post('admin/file/del', {
              file_id: id
            })
            .then((res) => {
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
            .catch((error) => {
              console.log(error)
            })
        }
      })
    },
    downloadItem (id, filePath) {
      // window.location.href = this.$baseUrl + filePath
      window.open(this.$baseUrl + filePath)
      // const arr = filePath.split('/')
      // const file = arr[arr.length - 1]
      // this.$http
      //   .post('admin/file/download', {
      //     file_id: id
      //   })
      //   .then((res) => {
      //       var blob = new Blob([res.data], { type: 'application/pdf;charset=UTF-8' })
      //       var downloadElement = document.createElement('a')
      //       var href = window.URL.createObjectURL(blob)
      //       // downloadElement.href = href
      //       downloadElement.href = href
      //       downloadElement.download = `${file}`
      //       // document.body.appendChild(downloadElement)
      //       downloadElement.click()
      //       document.body.removeChild(downloadElement)
      //       window.URL.revokeObjectURL(href)
      //   })
      //   .catch((error) => {
      //     console.log(error)
      //   })
    },
    handleOnSubmit () {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.$http
            .post('admin/file/edit', this.form)
            .then((res) => {
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
            .catch((error) => {
              console.log(error)
            })
        } else {
          return false
        }
      })
    },
    showEdit (item) {
      if (this.$store.getters.hasPermission(this.fileEditAction)) {
        item.editable = true
        setTimeout(() => {
          document.querySelector('#input_' + item.file_id).focus()
        }, 500)
      }
    },
    updateSort (item) {
      if (item.sort === item.oldSort) {
        item.editable = false
      } else {
        this.$http
        .post('admin/file/updateSort', {
          file_id: item.file_id,
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
        .post('admin/file/modifyStatus', {
          file_id: item.file_id,
          status: item.status === 1 ? 0 : 1
        })
        .then((res) => {
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
        .catch((error) => {
          item.loading = false
          console.log(error)
        })
    },
    handleChange (info) {
      if (info.file.status === 'uploading') {
        this.loadingFile = true
        if (info && info.event && info.event.percent) {
          this.percentFile = info.event.percent
          this.percentFile = this.percentFile.toFixed(2)
        }
        return
      }
      if (info.file.status === 'done') {
        this.loadingFile = false
        this.percentFile = 100
        if (info.file.response.data) {
          this.fileUrl = info.file.response.data[0]
          this.form.file = this.fileUrl
        } else {
          if (info.file.response.status === 'T') {
            this.$store.commit('setVisibleLogin', true)
          }
          this.$message.error(info.file.response.msg)
        }
      }
    },
    beforeUpload (file) {
      console.log(file)
      const isJpgOrPng = file.type === 'application/pdf' || file.type === 'application/zip' || file.type === 'application/vnd.ms-excel' || file.name.indexOf('.xls') > -1 || file.name.indexOf('.doc') > -1 || file.name.indexOf('.ppt') > -1 || file.name.indexOf('.rar') > -1 || file.name.indexOf('.7z') > -1 || file.name.indexOf('.tar') > -1 || file.name.indexOf('.gz') > -1
      if (!isJpgOrPng) {
        this.$message.error('只能上传zip，rar，7z，tar，gz，pdf，doc，docx，xls，xlsx，ppt，pptx格式的文件!')
      }
      const isLt20M = file.size / 1024 / 1024 < 20
      if (!isLt20M) {
        this.$message.error('上传的图片不能大于20MB!')
      }
      return isJpgOrPng && isLt20M
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
