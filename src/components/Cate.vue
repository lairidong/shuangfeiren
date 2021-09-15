<template>
  <div>
    <div class="tool-bar" style="margin-bottom: 16px">
      <a-row>
        <a-col :span="12">
          <div class="page-title">
            栏目管理
          </div>
        </a-col>
        <a-col :span="12">
          <div class="btn-box">
            <a-button icon="plus" type="primary" v-action:[cateAddAction] @click="addItem()">
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
        row-key="cate_id"
        size="small">
        <div slot="sort" slot-scope="text">
          <div style="border-bottom: 1px solid #ddd; padding: 5px 0; text-indent: 12px;" v-if="!text.editable || !$store.getters.hasPermission(cateEditAction)" @click="showEdit(text)">{{ text.sort }}</div>
          <div v-else>
            <a-input class="input-sort" :id="`input_${text.cate_id}`" v-model="text.sort" @blur="text.oldSort===text.sort?text.editable=false:text.editable=true">
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
            :disabled="!$store.getters.hasPermission(cateEditAction)"
            :loading="text.loading"
            :checked="text.status=='1' ? true : false"
            @change="changeStatus(text)" />
        </div>
        <div class="action-box" slot="action" slot-scope="text">
          <a-tooltip placement="top" v-action:[cateAddAction]>
            <template slot="title">
              <span>添加子分类</span>
            </template>
            <a-button type="primary" icon="plus" @click="addSubItem(text)"></a-button>
          </a-tooltip>
          <a-tooltip placement="top" v-action:[cateEditAction]>
            <template slot="title">
              <span>修改分类</span>
            </template>
            <a-button type="primary" icon="edit" @click="editItem(text)"></a-button>
          </a-tooltip>
          <a-tooltip placement="top" v-action:[cateDelAction]>
            <template slot="title">
              <span>删除该分类</span>
            </template>
            <a-button type="danger" icon="rest" @click="deleteItem(text.cate_id)"></a-button>
          </a-tooltip>
        </div>
      </a-table>
    </div>

    <a-drawer
      :title="action + '栏目'"
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
          <a-col :span="12">
            <a-form-model-item ref="cate_name" label="名称" prop="cate_name">
              <a-input
                v-model="form.cate_name"
                @blur="
                  () => {
                    $refs.cate_name.onFieldBlur();
                  }
                "
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="12" v-if="showSubTitle">
            <a-form-model-item ref="sub_cate_name" label="子名称/英文名称" prop="sub_cate_name">
              <a-input
                v-model="form.sub_cate_name"
                @blur="
                  () => {
                    $refs.sub_cate_name.onFieldBlur();
                  }
                "
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item ref="code" label="标识码" prop="code" extra="添加后不能修改，用于管理相应的栏目信息">
              <a-input
                :disabled="action=='编辑'"
                v-model="form.code"
                @blur="
                  () => {
                    $refs.code.onFieldBlur();
                  }
                "
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
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
          <a-col :span="12">
            <a-form-model-item ref="parent_id" label="父级分类" prop="parent_id">
              <a-select v-model="form.parent_id" >
                <a-select-option value="0">
                  顶级分类
                </a-select-option>
                <a-select-option v-for="item in data" :key="item.cate_id" :value="item.cate_id">
                  {{ item.cate_name }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" v-if="showSummary">
            <a-form-model-item ref="summary" label="栏目概述" prop="summary">
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
          <a-col :span="12" v-if="showImg">
            <UploadImgComponent :imgSize="imgSize" :imgName="imgName" :imageUrl.sync="form.img"></UploadImgComponent>
          </a-col>
          <a-col :span="12" v-if="showImg2">
            <UploadImgComponent :imgSize="imgSize2" :imgName="imgName2" :imageUrl.sync="form.img2"></UploadImgComponent>
          </a-col>
          <a-col :span="12" v-if="showImg3">
            <UploadImgComponent :imgSize="imgSize3" :imgName="imgName3" :imageUrl.sync="form.img3"></UploadImgComponent>
          </a-col>
          <a-col :span="12" v-if="showImg4">
            <UploadImgComponent :imgSize="imgSize4" :imgName="imgName4" :imageUrl.sync="form.img4"></UploadImgComponent>
          </a-col>
          <a-col :span="12" v-if="showImg5">
            <UploadImgComponent :imgSize="imgSize5" :imgName="imgName5" :imageUrl.sync="form.img5"></UploadImgComponent>
          </a-col>
          <a-col :span="12" v-if="showImg6">
            <UploadImgComponent :imgSize="imgSize6" :imgName="imgName6" :imageUrl.sync="form.img6"></UploadImgComponent>
          </a-col>
          <a-col :span="24">
            <a-form-model-item ref="status" label="状态" prop="status">
              <a-radio-group v-model="form.status">
                <a-radio :value="'1'">
                  启用
                </a-radio>
                <a-radio :value="'0'">
                  停用
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
      </a-form-model>
    </a-drawer>
  </div>
</template>

<script>
import UploadImgComponent from './modules/UploadImg.component'
const columns = [
    { title: '名称', dataIndex: 'cate_name', key: 'cate_name' },
    // { title: '标识码', dataIndex: 'code', key: 'code' },
    { title: '排序号', dataIndex: '', key: 'sort', scopedSlots: { customRender: 'sort' }, width: '100px' },
    { title: '状态', dataIndex: '', key: 'a', scopedSlots: { customRender: 'status' }, width: 90 },
    { title: '操作', dataIndex: '', key: 'x', scopedSlots: { customRender: 'action' }, width: 150 }
  ]
export default {
  data () {
    const checkName = (rule, value, callback) => {
        if (!value) {
          return callback()
        } else {
          this.$http
            .post('admin/cate/checkName', {
              cate_name: this.form.cate_name,
              cate_id: this.form.cate_id,
              parent_id: this.form.parent_id,
              parent_code: this.$route.params.code
            })
            .then(res => {
              if (res.data.msg === '') {
                callback()
              } else {
                callback(new Error(res.data.msg))
              }
            })
            .catch(error => {
              console.log(error)
            })
        }
      }
      const checkCode = (rule, value, callback) => {
        if (!value) {
          return callback()
        } else {
          this.$http
            .post('admin/cate/checkCode', {
              code: this.form.code,
              cate_id: this.form.cate_id,
              parent_id: this.form.parent_id,
              parent_code: this.$route.params.code
            })
            .then(res => {
              if (res.data.msg === '') {
                callback()
              } else {
                callback(new Error(res.data.msg))
              }
            })
            .catch(error => {
              console.log(error)
            })
        }
      }
    return {
      columns,
      pageSize: 30,
      currentPage: 1,
      total: 0,
      data: [],
      tableLoading: false,
      action: '',
      visible: false,
      labelCol: { },
      wrapperCol: { },
      imgSize: '',
      imgName: '',
      showImg: false,
      imgSize2: '',
      imgName2: '',
      showImg2: false,
      imgSize3: '',
      imgName3: '',
      showImg3: false,
      imgSize4: '',
      imgName4: '',
      showImg4: false,
      imgSize5: '',
      imgName5: '',
      showImg5: false,
      imgSize6: '',
      imgName6: '',
      showImg6: false,
      showSummary: false,
      showSubTitle: false,
      headers: {
        AccessToken: localStorage.getItem('token')
      },
      actionUrl: this.$baseUrl + 'admin/cate/upload_img' + (process.env.NODE_ENV === 'development' ? '?voucher=token' : '?voucher=session'),
      form: {
        cate_id: null,
        cate_name: '',
        code: '',
        parent_code: this.$route.params.code,
        sort: 99,
        status: '1'
      },
      rules: {
        // cate_type: [{ required: true, message: '请选择类型', trigger: 'change' }],
        cate_name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { validator: checkName, trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入标识码', trigger: 'blur' },
          { validator: checkCode, trigger: 'blur' }
        ],
        sort: [{ required: true, message: '请输入排序号', trigger: blur }],
        parent_id: [{ required: true, message: '请选择父分类', trigger: 'change' }],
        status: [{ required: true, message: '请选择状态', trigger: 'change' }]
      },
      cateAddAction: this.$route.params.code + '-add',
      cateEditAction: this.$route.params.code + '-edit',
      cateDelAction: this.$route.params.code + '-del'
    }
  },
  name: 'Cate',
  components: {
    UploadImgComponent
  },
  watch: {
    $route: function () {
      this.getList()
      this.getParentColumnByCode()
      this.getColumnByCode()
      this.form.parent_code = this.$route.params.code
      this.cateAddAction = this.$route.params.code + '-add'
      this.cateEditAction = this.$route.params.code + '-edit'
      this.cateDelAction = this.$route.params.code + '-del'
    }
  },
  created () {
    this.getList()
    this.getParentColumnByCode()
    this.getColumnByCode()
    this.cateAddAction = this.$route.params.code + '-add'
    this.cateEditAction = this.$route.params.code + '-edit'
    this.cateDelAction = this.$route.params.code + '-del'
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
            if (data.show_summary && data.show_summary.toString() === '1') {
              this.showSummary = true
            } else {
              this.showSummary = false
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
    showEdit (item) {
      if (this.$store.getters.hasPermission(this.cateEditAction)) {
        item.editable = true
        setTimeout(() => {
          document.querySelector('#input_' + item.cate_id).focus()
        }, 500)
      }
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
                  name: '分类管理',
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
    getList (retry) {
      if (retry) {
        setTimeout(() => {
          this.getList(true)
        }, 2000)
      }
      this.tableLoading = true
      this.$http
        .post('admin/cate', {
          page_size: this.pageSize,
          current_page: this.currentPage,
          parent_code: this.$route.params.code
        })
        .then(res => {
          if (res.data.status === 'S') {
            this.total = res.data.total
            res.data.data.forEach(item => {
              item.cate_id = item.cate_id.toString()
              item.parent_id = item.parent_id.toString()
              item.editable = false
              item.oldSort = item.sort
              if (item.children) {
                item.children.forEach(item2 => {
                  item2.cate_id = item2.cate_id.toString()
                  item2.parent_id = item2.parent_id.toString()
                  if (item2.children) {
                    item2.children.forEach(item3 => {
                      item3.cate_id = item3.cate_id.toString()
                      item3.parent_id = item3.parent_id.toString()
                    })
                  }
                })
              }
            })
            this.data = res.data.data
            console.log(this.data)
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
        cate_name: '',
        sub_cate_name: '',
        // cate_type: 'page',
        parent_id: '0',
        code: '',
        sort: 99,
        status: '1',
        img: '',
        img2: '',
        img3: '',
        img4: '',
        img5: '',
        img6: '',
        summary: ''
      }
      this.visible = true
      this.action = '新增'
    },
    addSubItem (item) {
      this.form = {
        cate_id: null,
        cate_name: '',
        // cate_type: 'page',
        parent_id: item.cate_id.toString(),
        parent_code: this.$route.params.code,
        code: '',
        sort: 99,
        status: '1',
        img: '',
        img2: '',
        img3: '',
        img4: '',
        img5: '',
        img6: '',
        summary: ''
      }
      this.visible = true
      this.action = '新增'
    },
    editItem (item) {
      this.form = {
        cate_id: item.cate_id.toString(),
        cate_name: item.cate_name,
        sub_cate_name: item.sub_cate_name,
        // cate_type: item.cate_type,
        parent_id: item.parent_id ? item.parent_id.toString() : '0',
        parent_code: this.$route.params.code,
        code: item.code,
        sort: item.sort,
        status: item.status ? item.status.toString() : '0',
        img: item.img,
        img2: item.img2,
        img3: item.img3,
        img4: item.img4,
        img5: item.img5,
        img6: item.img6,
        summary: item.summary
      }
      this.visible = true
      this.action = '编辑'
    },
    editPage (item) {},
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
            .post('admin/cate/del', {
              cate_id: id
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
          const params = {
            cate_name: this.form.cate_name,
            sub_cate_name: this.form.sub_cate_name,
            // cate_type: this.form.cate_type,
            parent_id: this.form.parent_id,
            img: this.form.img,
            img2: this.form.img2,
            img3: this.form.img3,
            img4: this.form.img4,
            img5: this.form.img5,
            img6: this.form.img6,
            parent_code: this.$route.params.code,
            sort: this.form.sort,
            code: this.form.code,
            status: this.form.status,
            summary: this.form.summary
          }
          if (this.form.cate_id !== '') {
            params.cate_id = this.form.cate_id
          }
          this.$http
            .post('admin/cate/edit', params)
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
        .post('admin/cate/updateSort', {
          cate_id: item.cate_id,
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
        .post('admin/cate/modifyStatus', {
          cate_id: item.cate_id,
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
    max-width: 120px;
  }
}
</style>
