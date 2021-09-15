<template>
  <div>
    <a-tabs default-active-key="1">
      <a-tab-pane key="1" tab="轮播图">
        <div class="tool-bar" style="margin-bottom: 16px">
          <a-button icon="plus" type="primary" @click="addItem()">添加</a-button>
        </div>
        <div>
          <a-table
            :columns="columns"
            :dataSource="data"
            :pagination="{
              position: 'bottom',
              pageSize: pageSize,
              total: total,
              showTotal: (total)=>{ return `共 ${total} 条信息`}
            }"
            :loading="tableLoading"
            @change="onChangePage"
            row-key="ad_id"
            size="small"
          >
            <div slot="img" slot-scope="text">
              <img :src="text.img" style="max-width: 80px; max-height: 80px;" alt="">
            </div>
            <div slot="state" slot-scope="text">
              <a-switch
                checkedChildren="正常"
                unCheckedChildren="禁用"
                :loading="text.loading"
                :checked="text.state=='1' ? true : false"
                @change="changeStatus(text)"
              />
            </div>
            <div class="action-box" slot="action" slot-scope="text">
              <a-tooltip placement="top">
                <template slot="title">
                  <span>编辑</span>
                </template>
                <a-button type="primary" icon="edit" @click="editItem(text)"></a-button>
              </a-tooltip>
              <a-tooltip placement="top">
                <template slot="title">
                  <span>删除</span>
                </template>
                <a-button type="danger" icon="rest" @click="deleteItem(text.ad_id)"></a-button>
              </a-tooltip>
            </div>
          </a-table>
        </div>
      </a-tab-pane>
      <a-tab-pane key="2" tab="分类广告图" force-render>
        <div class="tool-bar" style="margin-bottom: 16px">
          <a-button icon="plus" type="primary" @click="addItemAd()">添加</a-button>
        </div>
        <div>
          <a-table
            :columns="columnsAd"
            :dataSource="dataAd"
            :pagination="{
              position: 'bottom',
              pageSize: pageSizeAd,
              total: totalAd,
              showTotal: (totalAd)=>{ return `共 ${totalAd} 条信息`}
            }"
            :loading="tableLoadingAd"
            @change="onChangePageAd"
            row-key="ad_id"
            bordered
            size="small"
          >
            <div slot="img" slot-scope="text">
              <img :src="text.img" style="max-width: 80px; max-height: 80px;" alt="">
            </div>
            <div slot="state" slot-scope="text">
              <a-switch
                checkedChildren="正常"
                unCheckedChildren="禁用"
                :loading="text.loading"
                :checked="text.state=='1' ? true : false"
                @change="changeStatusAd(text)"
              />
            </div>
            <div class="action-box" slot="action" slot-scope="text">
              <a-tooltip placement="top">
                <template slot="title">
                  <span>编辑</span>
                </template>
                <a-button type="primary" icon="edit" @click="editItemAd(text)"></a-button>
              </a-tooltip>
              <a-tooltip placement="top">
                <template slot="title">
                  <span>删除</span>
                </template>
                <a-button type="danger" icon="rest" @click="deleteItemAd(text.ad_id)"></a-button>
              </a-tooltip>
            </div>
          </a-table>
        </div>
      </a-tab-pane>
    </a-tabs>

    <!-- 轮播图 -->
    <a-drawer
      :title="action + '轮播图'"
      :width="720"
      @close="onClose"
      :visible="visible"
      :bodyStyle="{paddingBottom: '80px'}"
    >
      <a-form :form="form" layout="vertical" @submit="handleSubmit">
        <a-row :gutter="16">
          <a-col :span="24">
            <a-form-item label="上传图片">
              <a-upload
                name="files[]"
                list-type="picture-card"
                class="avatar-uploader"
                :show-upload-list="false"
                :action="actionUrl"
                :before-upload="beforeUpload"
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
        <a-row :gutter="16">
          <a-col :span="24">
            <a-form-item
              label="链接地址"
            >
              <a-input
                v-decorator="['url', {}]"
                placeholder="http://"
                :allowClear="true"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="状态">
              <a-radio-group v-decorator="['state', {rules: [{required: true, message: ''}]}]">
                <a-radio :value="'1'">正常</a-radio>
                <a-radio :value="'0'">禁用</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="24">
            <div style="display: none;">
              <a-form-item label="ad_id">
                <a-input
                  v-decorator="['ad_id', {
                    rules: [{ required: false, message: '' }]
                  }]"
                />
              </a-form-item>
            </div>
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
                :disabled="hasErrors(form.getFieldsError())"
              >提交</a-button>
            </div>
          </a-col>
        </a-row>
      </a-form>
    </a-drawer>

    <!-- 分类广告 -->
    <a-drawer
      :title="actionAd + '分类广告'"
      :width="720"
      @close="onCloseAd"
      :visible="visibleAd"
      :bodyStyle="{paddingBottom: '80px'}"
    >
      <a-form :form="formAd" layout="vertical" @submit="handleSubmitAd">
        <a-row :gutter="16">
          <a-col :span="24">
            <a-form-item label="上传图片">
              <a-upload
                name="files[]"
                list-type="picture-card"
                class="avatar-uploader"
                :show-upload-list="false"
                :action="actionUrl"
                :before-upload="beforeUploadAd"
                @change="handleChangeAd"
              >
                <img v-if="imageUrlAd" :src="imageUrlAd" class="flash-img" alt="flash" />
                <div v-else>
                  <a-icon :type="loadingImgAd ? 'loading' : 'plus'" />
                  <div class="ant-upload-text">
                    上传
                  </div>
                </div>
                <img v-if="imageUrlAd&&!loadingImgAd" :src="imageUrlAd" class="flash-img" alt="上传图片" />
                <div v-if="loadingImg">
                  <a-icon :type="'loading'" />
                  <div class="ant-upload-text">
                    {{ percentImgAd }}%
                  </div>
                </div>
                <div v-if="!imageUrlAd&&!loadingImgAd">
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
          <a-col :span="12">
            <a-form-item
              label="所属分类"
              :validate-status="catNameError() ? 'error' : ''"
              :help="catNameError() || ''"
            >
              <a-select
                v-decorator="['cat_id', {
                  rules: [{ required: true, message: '请选择分类' }]
                }]"
              >
                <a-select-option
                  v-for="item in catData"
                  :key="item.cat_id"
                  :value="item.cat_id"
                >{{ item.cat_name }}</a-select-option>
                <a-select-option value>请选择分类</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="24">
            <a-form-item
              label="链接地址"
            >
              <a-input
                v-decorator="['url', {}]"
                placeholder="http://"
                :allowClear="true"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="状态">
              <a-radio-group v-decorator="['state', {rules: [{required: true, message: ''}]}]">
                <a-radio :value="'1'">正常</a-radio>
                <a-radio :value="'0'">禁用</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="24">
            <div style="display: none;">
              <a-form-item label="ad_id">
                <a-input
                  v-decorator="['ad_id', {
                    rules: [{ required: false, message: '' }]
                  }]"
                />
              </a-form-item>
            </div>
            <div
              :style="{
                width: '100%',
                borderTop: '1px solid #e9e9e9',
                padding: '10px 0',
                background: '#fff',
                textAlign: 'right',
              }"
            >
              <a-button :style="{marginRight: '8px'}" size="large" @click="onCloseAd">取消</a-button>
              <a-button
                type="primary"
                html-type="submit"
                size="large"
                :disabled="hasErrorsAd(form.getFieldsError())"
              >提交</a-button>
            </div>
          </a-col>
        </a-row>
      </a-form>
    </a-drawer>
  </div>
</template>

<script>
const columns = [
  {
    title: '轮播图',
    dataIndex: '',
    key: 'a',
    width: 100,
    scopedSlots: { customRender: 'img' }
  },
  { title: '链接地址', dataIndex: 'url', key: 'b' },
  {
    title: '状态',
    dataIndex: '',
    key: 'c',
    width: 90,
    scopedSlots: { customRender: 'state' }
  },
  {
    title: '操作',
    dataIndex: '',
    key: 'x',
    scopedSlots: { customRender: 'action' },
    width: 150
  }
]
const columnsAd = [
  {
    title: '广告图',
    dataIndex: '',
    key: 'a',
    width: 100,
    scopedSlots: { customRender: 'img' }
  },
  {
    title: '所属分类',
    dataIndex: 'cat_name',
    key: 'b',
    width: 150
  },
  { title: '链接地址', dataIndex: 'url', key: 'c' },
  {
    title: '状态',
    dataIndex: '',
    key: 'd',
    width: 90,
    scopedSlots: { customRender: 'state' }
  },
  {
    title: '操作',
    dataIndex: '',
    key: 'x',
    width: 150,
    scopedSlots: { customRender: 'action' }
  }
]
function hasErrors (fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field])
}
function hasErrorsAd (fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field])
}
export default {
  data () {
    return {
      columns,
      pageSize: 10,
      currentPage: 1,
      total: 0,
      data: [],
      selectedRowKeys: [],
      tableLoading: false,
      loading: false,
      action: '',
      flash: {},
      visible: false,
      hasErrors,
      form: this.$form.createForm(this),
      loadingImg: false,
      percentImg: 0,
      imageUrl: '',
      actionUrl: this.$baseUrl + 'admin/ad/upload_img' + (process.env.NODE_ENV === 'development' ? '?voucher=token' : '?voucher=session'),

      columnsAd,
      pageSizeAd: 10,
      currentPageAd: 1,
      totalAd: 0,
      dataAd: [],
      selectedRowKeysAd: [],
      tableLoadingAd: false,
      loadingAd: false,
      actionAd: '',
      ad: {},
      visibleAd: false,
      hasErrorsAd,
      formAd: this.$form.createForm(this),
      loadingImgAd: false,
      imageUrlAd: '',
      percentImgAd: 0,
      catData: []
    }
  },
  name: 'Ad',
  components: {},
  props: [],
  created () {
    this.getList()
    this.getListAd()
    this.getCate()
  },
  methods: {
    // 获取分类
    getCate () {
      this.$http
        .post('admin/cate/getCate', {})
        .then(res => {
          if (res.data.status === 'S') {
            this.catData = res.data.data
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
        .post('admin/ad', {
          type: 1,
          pageSize: this.pageSize,
          currentPage: this.currentPage
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
          this.loading = false
        })
        .catch(error => {
          console.log(error)
          this.tableLoading = false
          this.loading = false
        })
    },
    // 显示抽屉
    showDrawer () {
      this.visible = true
    },
    // 隐藏抽屉
    onClose () {
      this.visible = false
    },
    // 添加
    addItem () {
      this.action = '添加'
      this.showDrawer()
      this.flash = {
        ad_id: '',
        url: '',
        state: '1'
      }
      this.imageUrl = ''
      this.$nextTick(() => {
        this.form.resetFields()
        this.form.setFieldsValue(this.flash)
      })
    },
    // 编辑
    editItem (item) {
      this.action = '编辑'
      this.showDrawer()
      this.flash = {
        ad_id: item.ad_id,
        img: item.img,
        url: item.url,
        state: item.state ? item.state.toString() : '0'
      }
      this.imageUrl = item.img
      this.$nextTick(() => {
        this.form.resetFields()
        this.form.setFieldsValue(this.flash)
      })
    },
    // 提交表单
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, value) => {
        if (!err) {
          value.img = this.imageUrl
          value.type = 1
          this.$http
            .post('admin/ad/edit', value)
            .then(res => {
              if (res.data.status === 'S') {
                this.$message.success(this.action + '成功')
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
        }
      })
    },
    // 页面跳转
    onChangePage (e) {
      this.currentPage = e.current
      this.getList(false)
    },
    // 修改状态
    changeStatus (item) {
      item.loading = true
      this.$http
        .post('admin/ad/modifyStatus', {
          ad_id: item.ad_id,
          state: item.state === '1' ? 0 : 1
        })
        .then(res => {
          item.loading = false
          if (res.data.status === 'S') {
            if (item.state === 1) {
              item.state = 0
            } else {
              item.state = 1
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

    handleChange (info) {
      console.log(info)
      if (info.file.status === 'uploading') {
        this.loading = true
        if (info && info.event && info.event.percent) {
          this.percentImg = info.event.percent
          this.percentImg = this.percentImg.toFixed(2)
        }
        return
      }
      if (info.file.status === 'done') {
        if (info.file.response.data) {
          this.loading = false
          this.percentImg = 100
          this.imageUrl = info.file.response.data[0]
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
    },

    //= ===========================================================================

    catNameError () {
      const { getFieldError } = this.formAd
      return getFieldError('cat_id')
    },
    getListAd (retry) {
      if (retry) {
        setTimeout(() => {
          this.getListAd(true)
        }, 2000)
      }
      this.tableLoadingAd = true
      this.$http
        .post('admin/ad', {
          type: 2,
          pageSize: this.pageSizeAd,
          currentPage: this.currentPageAd
        })
        .then(res => {
          if (res.data.status === 'S') {
            this.totalAd = res.data.total
            this.dataAd = res.data.data
          } else if (res.data.status !== 'T') {
            this.$error({
              title: '提示',
              content: res.data.msg
            })
          }
          this.tableLoadingAd = false
          this.loadingAd = false
        })
        .catch(error => {
          console.log(error)
          this.tableLoadingAd = false
          this.loadingAd = false
        })
    },
    // 显示抽屉
    showDrawerAd () {
      this.visibleAd = true
    },
    // 隐藏抽屉
    onCloseAd () {
      this.visibleAd = false
    },
    // 添加
    addItemAd () {
      this.actionAd = '添加'
      this.showDrawerAd()
      this.ad = {
        ad_id: '',
        cat_id: '',
        url: '',
        state: '1'
      }
      this.imageUrlAd = ''
      this.$nextTick(() => {
        this.formAd.resetFields()
        this.formAd.setFieldsValue(this.ad)
      })
    },
    // 编辑
    editItemAd (item) {
      this.actionAd = '编辑'
      this.showDrawerAd()
      this.ad = {
        ad_id: item.ad_id,
        cat_id: item.cat_id,
        img: item.img,
        url: item.url,
        state: item.state ? item.state.toString() : '0'
      }
      this.imageUrlAd = item.img
      this.$nextTick(() => {
        this.formAd.resetFields()
        this.formAd.setFieldsValue(this.ad)
      })
    },
    // 提交表单
    handleSubmitAd (e) {
      e.preventDefault()
      this.formAd.validateFields((err, value) => {
        if (!err) {
          value.img = this.imageUrlAd
          value.type = 2
          this.$http
            .post('admin/ad/edit', value)
            .then(res => {
              if (res.data.status === 'S') {
                this.$message.success(this.action + '成功')
                this.getListAd(false)
                this.visibleAd = false
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
      })
    },
    // 页面跳转
    onChangePageAd (e) {
      this.currentPageAd = e.current
      this.getListAd(false)
    },
    // 修改状态
    changeStatusAd (item) {
      item.loading = true
      this.$http
        .post('admin/ad/modifyStatus', {
          ad_id: item.ad_id,
          state: item.state === '1' ? 0 : 1
        })
        .then(res => {
          item.loading = false
          if (res.data.status === 'S') {
            if (item.state === 1) {
              item.state = 0
            } else {
              item.state = 1
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

    handleChangeAd (info) {
      console.log(info)
      if (info.file.status === 'uploading') {
        this.loadingAd = true
        if (info && info.event && info.event.percent) {
          this.percentImgAd = info.event.percent
          this.percentImgAd = this.percentImgAd.toFixed(2)
        }
        return
      }
      if (info.file.status === 'done') {
        this.loadingAd = false
        this.percentImgAd = 100
        if (info.file.response.data) {
          this.imageUrlAd = info.file.response.data[0]
        } else {
          if (info.file.response.status === 'T') {
            this.$store.commit('setVisibleLogin', true)
          }
          this.$message.error(info.file.response.msg)
        }
      }
    },
    beforeUploadAd (file) {
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

<style lang="less">
/deep/.flash-img {
  max-width: 90px;
  max-height: 90px;
}
.avatar-uploader > .ant-upload {
  width: 128px;
  height: 128px;
}
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}

.action-box button {
  margin-right: 8px;
}
</style>
