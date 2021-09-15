<template>
  <div>
    <div class="tool-bar" style="margin-bottom: 16px">
      <a-row>
        <a-col :span="12">
          <div class="page-title">
            菜单管理
          </div>
        </a-col>
        <a-col :span="12">
          <div class="btn-box">
            <a-button icon="plus" type="primary" v-action:footer-menu-add @click="addItem()">
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
          <div style="border-bottom: 1px solid #ddd; padding: 5px 0; text-indent: 12px;" v-if="!text.editable || !$store.getters.hasPermission('footer-menu-edit')" @click="showEdit(text)">{{ text.sort }}</div>
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
            :disabled="!$store.getters.hasPermission('footer-menu-edit')"
            :loading="text.loading"
            :checked="text.status=='1' ? true : false"
            @change="changeStatus(text)" />
        </div>
        <div class="action-box" slot="action" slot-scope="text">
          <a-tooltip placement="top" v-action:footer-menu-add>
            <template slot="title">
              <span>添加子菜单</span>
            </template>
            <a-button type="primary" icon="plus" @click="addSubItem(text)"></a-button>
          </a-tooltip>
          <a-tooltip placement="top" v-action:footer-menu-edit>
            <template slot="title">
              <span>修改</span>
            </template>
            <a-button type="primary" icon="edit" @click="editItem(text)"></a-button>
          </a-tooltip>
          <a-tooltip placement="top" v-action:footer-menu-del>
            <template slot="title">
              <span>删除该菜单</span>
            </template>
            <a-button type="danger" icon="rest" @click="deleteItem(text.cate_id)"></a-button>
          </a-tooltip>
        </div>
      </a-table>
    </div>

    <a-drawer
      :title="action + '菜单'"
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
            <a-form-model-item ref="cate_name" label="菜单" prop="cate_name">
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
          <a-col :span="12">
            <a-form-model-item ref="summary" label="Url" prop="summary">
              <a-input
                v-model="form.summary"
                @blur="
                  () => {
                    $refs.summary.onFieldBlur();
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
            <a-form-model-item ref="parent_id" label="父级菜单" prop="parent_id">
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
const columns = [
    { title: '名称', dataIndex: 'cate_name', key: 'cate_name' },
    { title: 'Url', dataIndex: 'summary', key: 'summary' },
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
              parent_code: 'footer-menu'
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
              code: this.form.cate_name,
              cate_id: this.form.cate_id,
              parent_code: 'footer-menu'
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
      pageSize: 10,
      currentPage: 1,
      total: 0,
      data: [],
      tableLoading: false,
      action: '',
      visible: false,
      labelCol: { },
      wrapperCol: { },
      headers: {
        AccessToken: localStorage.getItem('token')
      },
      actionUrl: this.$baseUrl + 'admin/cate/upload_img' + (process.env.NODE_ENV === 'development' ? '?voucher=token' : '?voucher=session'),
      form: {
        cate_id: null,
        cate_name: '',
        code: '',
        parent_code: 'footer-menu',
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
          { required: false, message: '请输入url', trigger: 'blur' },
          { validator: checkCode, trigger: 'blur' }
        ],
        sort: [{ required: true, message: '请输入排序号', trigger: blur }],
        parent_id: [{ required: true, message: '请选择父分类', trigger: 'change' }],
        status: [{ required: true, message: '请选择状态', trigger: 'change' }]
      }
    }
  },
  name: 'FooterMenu',
  watch: {
    $route: function () {
      this.getList()
      this.getParentColumnByCode()
    }
  },
  created () {
    this.getList()
    this.getParentColumnByCode()
  },
  methods: {
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
          code: 'footer-menu'
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
                  name: '底部菜单管理',
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
          parent_code: 'footer-menu'
        })
        .then(res => {
          if (res.data.status === 'S') {
            this.total = res.data.total
            res.data.data.forEach(item => {
              item.cate_id = item.cate_id.toString()
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
    addItem () {
      this.form = {
        cate_id: null,
        cate_name: '',
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
        parent_id: item.cate_id,
        parent_code: 'footer-menu',
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
        cate_id: item.cate_id,
        cate_name: item.cate_name,
        // cate_type: item.cate_type,
        parent_id: item.parent_id.toString(),
        parent_code: 'footer-menu',
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
            // cate_type: this.form.cate_type,
            parent_id: this.form.parent_id,
            parent_code: 'footer-menu',
            sort: this.form.sort,
            code: this.form.cate_name,
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
