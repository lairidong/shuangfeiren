<template>
  <div>
    <div class="tool-bar" style="margin-bottom: 16px">
      <a-button icon="plus" type="primary" @click="addItem()" v-action:admin-list-add>
        添加
      </a-button>
      <a-button icon="reload" type="primary" @click="reload" :loading="loading">
        刷新
      </a-button>
      <a-dropdown icon="down" :disabled="!hasSelected" v-action:admin-list-del>
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="delSelect"><a-icon type="rest" />删除</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down" /> </a-button>
      </a-dropdown>
      <span style="margin-left: 8px">
        <template v-if="hasSelected">
          {{ `选中了 ${selectedRowKeys.length} 条记录` }}
        </template>
      </span>
    </div>
    <div>
      <a-table
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
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
        row-key="admin_id"
        size="small"
      >
        <div slot="status" slot-scope="text">
          <a-switch
            checkedChildren="正常"
            unCheckedChildren="禁用"
            :disabled="!$store.getters.hasPermission('admin-list-edit')"
            :loading="text.loading"
            :checked="text.status=='1' ? true : false"
            @change="changeStatus(text)" />
        </div>
        <div class="action-box" slot="action" slot-scope="text">
          <a-tooltip placement="top" v-action:admin-list-edit>
            <template slot="title">
              <span>编辑</span>
            </template>
            <a-button type="primary" icon="edit" @click="editItem(text)"></a-button>
          </a-tooltip>
          <a-tooltip placement="top" v-action:admin-list-del>
            <template slot="title">
              <span>{{ adminId===text.admin_id ? '不能删除自己' : '删除' }}</span>
            </template>
            <a-button type="danger" icon="rest" @click="deleteItem(text.admin_id)" :disabled="adminId===text.admin_id"></a-button>
          </a-tooltip>
        </div>
      </a-table>
    </div>
    <a-drawer
      :title="action + '后台用户'"
      :width="'calc(100% - 200px)'"
      @close="onClose"
      :visible="visible"
      :bodyStyle="{paddingBottom: '80px'}"
      ref="container"
    >
      <a-form :form="form" layout="vertical" @submit="handleSubmit">
        <a-row :gutter="16">
          <a-col :span="6">
            <a-row :gutter="16">
              <a-col :span="24" style="border-right: 1px solid #ddd;">
                <a-form-item label="权限">
                  <a-tree
                    v-decorator="['power', {
                      rules: [{ required: false, message: '' }]
                    }]"
                    :replace-fields="{title: 'column_name', children: 'children', key: 'column_id'}"
                    checkable
                    :tree-data="columnData"
                    :default-expanded-keys="defaultExpandedKeys"
                    :checked-keys="checkedKeys"
                    @expand="onExpand"
                    @check="onCheck"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </a-col>
          <a-col :span="1"></a-col>
          <a-col :span="16">
            <a-row :gutter="16">
              <a-col :span="12">
                <a-form-item label="用户名" :validate-status="nameError()||nameExisted ? 'error' : ''" :help="nameError()|| nameExisted || ''">
                  <a-input
                    v-decorator="['name', {
                      rules: [{ required: true, message: '请输入用户名' }]
                    }]"
                    placeholder="请输入用户名"
                    :allowClear="true"
                    :disabled="this.action == '添加' ? false : true"
                    @blur="checkName"
                    :loading="checkNameLoading"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="密码" :validate-status="pwdError() ? 'error' : ''" :help="pwdError() || ''">
                  <a-input
                    v-decorator="['pwd', {
                      rules: [{ required: this.action == '添加' ? true : false, message: '请输入密码' }]
                    }]"
                    style="width: 100%"
                    :placeholder="this.action == '添加' ? '请输入密码' : '不修改密码则留空'"
                    :allowClear="true"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="16">
              <a-col :span="12">
                <a-form-item label="状态">
                  <a-radio-group v-decorator="['status', {rules: [{required: true, message: ''}]}]" de>
                    <a-radio :value="'1'">正常</a-radio>
                    <a-radio :value="'0'">禁用</a-radio>
                  </a-radio-group>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="16">
              <a-col :span="24">
                <a-form-item label="备注">
                  <a-textarea
                    v-decorator="['remark', {
                      rules: [{ required: false, message: '' }]
                    }]"
                    :autoSize="{ minRows: 2, maxRows: 6 }"
                    placeholder=""
                    allowClear
                  />
                </a-form-item>
              </a-col>
            </a-row>

            <a-row :gutter="16">
              <a-col :span="24">
                <div style="display: none;">
                  <a-form-item label="admin_id">
                    <a-input
                      v-decorator="['admin_id', {
                        rules: [{ required: false, message: '' }]
                      }]"/>
                  </a-form-item>
                </div>

              </a-col>
            </a-row>
          </a-col>
        </a-row>

        <a-affix :offset-bottom="0">
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
            <a-button type="primary" html-type="submit" size="large" :disabled="hasErrors(form.getFieldsError())||nameExisted.length>0">提交</a-button>
          </div>
        </a-affix>
      </a-form>
    </a-drawer>
  </div>
</template>

<script>
const columns = [
    { title: '用户名', dataIndex: 'name', key: 'name' },
    { title: '备注', dataIndex: 'remark', key: 'remark' },
    { title: '日期', dataIndex: 'create_date', key: 'create_date', width: 120 },
    { title: '状态', dataIndex: '', key: 'a', scopedSlots: { customRender: 'status' }, width: 90 },
    { title: '操作', dataIndex: '', key: 'x', scopedSlots: { customRender: 'action' }, width: 150 }
  ]
function hasErrors (fieldsError) {
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
      filterItem: {
        name: ''
      },
      admin: {},
      visible: false,
      hasErrors,
      form: this.$form.createForm(this),
      checkNameLoading: false,
      nameExisted: '',
      columnData: [],
      autoExpandParent: true,
      expandedKeys: [],
      checkedKeys: [],
      defaultExpandedKeys: [],
      adminId: 0 // 当前管理员ID
    }
  },
  name: 'AdminList',
  props: [],
  created () {
    this.getList(false)
    this.getColumnList()
    this.$store.commit('setBreadcrumb', {
      breadcrumbData: [
        {
          key: '1',
          name: '首页',
          url: '#/main/base'
        },
        {
          key: '2',
          name: '系统管理',
          url: ''
        },
        {
          key: '6',
          name: '后台用户',
          url: ''
        }
      ],
      menuKey: '6'
    })
    // this.$root.$emit('breadcrumb', {
    //   breadcrumbData:[
    //     {
    //       key: '1',
    //       name: '首页',
    //       url: '#/main/base'
    //     },
    //     {
    //       key: '6',
    //       name: '管理员',
    //       url: ''
    //     }
    //   ],
    //   menuKey: '6'
    // });
  },
  mounted () {

  },
  computed: {
    hasSelected () {
      return this.selectedRowKeys.length > 0
    }
  },
  methods: {
    getColumnList (retry) {
      this.$http
        .post('admin/column', {
          page_size: 1000,
          current_page: 1
        })
        .then(res => {
          this.defaultExpandedRowKeys = []
          if (res.data.status === 'S') {
            this.columnData = res.data.data
            this.columnData.forEach(item => {
              item.ids = JSON.parse(item.ids)
              if (item.children.length === 0) {
                item.children = null
              } else {
                this.defaultExpandedKeys.push(item.column_id)
                item.children.forEach(item2 => {
                  item2.ids = JSON.parse(item2.ids)
                  if (item2.children.length === 0) {
                    item2.children = null
                  } else {
                    this.defaultExpandedKeys.push(item2.column_id)
                    // item2.children.forEach(item3 => {
                    //   console.log(item3)
                    //   // item3.ids = JSON.parse(item3.ids)
                    //   // if (item3.children.length === 0) {
                    //   //   item3.children = null
                    //   // }
                    // })
                  }
                })
              }
            })
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
        .post('admin/admins', {
          name: this.filterItem.name,
          pageSize: this.pageSize,
          currentPage: this.currentPage
        })
        .then(res => {
          if (res.data.status === 'S') {
            this.total = res.data.total
            this.data = res.data.data
            this.adminId = res.data.admin_id
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
    // 刷新数据
    reload () {
      this.loading = true
      this.selectedRowKeys = []
      this.getList(false)
    },
    // 页面跳转
    onChangePage (e) {
      this.currentPage = e.current
      this.getList(false)
    },
    // 复选框
    onSelectChange (selectedRowKeys) {
      // console.log('selectedRowKeys changed: ', selectedRowKeys);
      this.selectedRowKeys = selectedRowKeys
    },
    // 添加
    addItem () {
      this.action = '添加'
      this.showDrawer()
      this.admin = {
        admin_id: '',
        name: '',
        pwd: '',
        status: '0',
        remark: '',
        power: []
      }
      this.$nextTick(() => {
        this.form.resetFields()
        this.form.setFieldsValue(this.admin)
      })
    },
    // 编辑
    editItem (item) {
      this.action = '编辑'
      this.showDrawer()
      console.log(item)
      this.admin = {
        admin_id: item.admin_id,
        name: item.name,
        pwd: '',
        status: item.status ? item.status.toString() : '0',
        remark: item.remark,
        power: item.power
      }
      if (this.admin.power === '' || this.admin.power === null) {
        this.admin.power = []
      } else {
        this.admin.power = JSON.parse(this.admin.power)
      }
      const delId = []
      this.columnData.forEach(item => {
        if (item.children && item.children.length > 0) {
          item.children.forEach(item2 => {
            if (item2.children && item2.children.length > 0) {
              item2.children.forEach(item3 => {
                if (item3.children && item3.children.length > 0) {
                  item3.children.forEach(item4 => {
                    if (!this.admin.power.includes(item4.column_id)) {
                      delId.push(item.column_id)
                      delId.push(item2.column_id)
                      delId.push(item3.column_id)
                      // this.admin.power.forEach((p, i) => {
                      //   if (p === item.column_id) {
                      //     delId.push(item.column_id)
                      //   }
                      //   if (p === item2.column_id) {
                      //     delId.push(item2.column_id)
                      //   }
                      //   if (p === item3.column_id) {
                      //     delId.push(item3.column_id)
                      //   }
                      // })
                    }
                  })
                } else {
                  if (!this.admin.power.includes(item3.column_id)) {
                    delId.push(item.column_id)
                    delId.push(item2.column_id)
                    // this.admin.power.forEach((p, i) => {
                    //   if (p === item.column_id) {
                    //     delId.push(item.column_id)
                    //   }
                    //   if (p === item2.column_id) {
                    //     delId.push(item2.column_id)
                    //   }
                    // })
                  }
                }
              })
            } else {
              if (!this.admin.power.includes(item2.column_id)) {
                delId.push(item.column_id)
                // this.admin.power.forEach((p, i) => {
                //   if (p === item.column_id) {
                //     delId.push(item.column_id)
                //   }
                // })
              }
            }
          })
        }
      })
      const power = []
      this.admin.power.forEach(item => {
        if (!delId.includes(item)) {
          power.push(item)
        }
      })
      this.admin.power = power
      this.checkedKeys = this.admin.power
      this.$nextTick(() => {
        this.form.resetFields()
        this.form.setFieldsValue(this.admin)
      })
    },
    checkName (e) {
      if (this.action === '编辑') return
      this.$http
      .post('admin/admins/checkName', {
        name: e.target.value
      })
      .then(res => {
        if (res.data.status === 'S') {
          this.nameExisted = res.data.msg
        } else if (res.data.status !== 'T') {
          this.nameExisted = ''
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
    nameError () {
      const { getFieldError } = this.form
      return getFieldError('name')
    },
    pwdError () {
      const { getFieldError } = this.form
      return getFieldError('pwd')
    },
    roleError () {
      const { getFieldError } = this.form
      return getFieldError('roleId')
    },
    onExpand (expandedKeys) {
      console.log('onExpand', expandedKeys)
      // if not set autoExpandParent to false, if children expanded, parent can not collapse.
      // or, you can remove all expanded children keys.
      // this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    onCheck (checkedKeys) {
      console.log('onCheck', checkedKeys)
      this.checkedKeys = checkedKeys
    },
    // 提交表单
    handleSubmit (e) {
      e.preventDefault()
      if (this.nameExisted !== '') return
      this.form.validateFields((err, value) => {
        if (!err) {
          let power = []
          this.columnData.forEach(item => {
            if (item.children && item.children.length > 0) {
              item.children.forEach(item2 => {
                if (item2.children && item2.children.length > 0) {
                  item2.children.forEach(item3 => {
                    if (item3.children && item3.children.length > 0) {
                      item3.children.forEach(item4 => {
                        if (this.checkedKeys.includes(item4.column_id)) {
                          power.push(item.column_id)
                          power.push(item2.column_id)
                          power.push(item3.column_id)
                          power.push(item4.column_id)
                        } else if (this.checkedKeys.includes(item3.column_id)) {
                          power.push(item.column_id)
                          power.push(item2.column_id)
                          power.push(item3.column_id)
                        } else if (this.checkedKeys.includes(item2.column_id)) {
                          power.push(item.column_id)
                          power.push(item2.column_id)
                        } else if (this.checkedKeys.includes(item.column_id)) {
                          power.push(item.column_id)
                        }
                      })
                    } else {
                      if (this.checkedKeys.includes(item3.column_id)) {
                        power.push(item.column_id)
                        power.push(item2.column_id)
                        power.push(item3.column_id)
                      } else if (this.checkedKeys.includes(item2.column_id)) {
                        power.push(item.column_id)
                        power.push(item2.column_id)
                      } else if (this.checkedKeys.includes(item.column_id)) {
                        power.push(item.column_id)
                      }
                    }
                  })
                } else {
                  if (this.checkedKeys.includes(item2.column_id)) {
                    power.push(item.column_id)
                    power.push(item2.column_id)
                  } else if (this.checkedKeys.includes(item.column_id)) {
                    power.push(item.column_id)
                  }
                }
              })
            } else {
              if (this.checkedKeys.includes(item.column_id)) {
                power.push(item.column_id)
              }
            }
          })
          power = new Set(power)
          value.power = JSON.stringify([...power])
          this.nameExisted = ''
          this.$http
            .post('admin/admins/edit', value)
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
    // 显示抽屉
    showDrawer () {
      this.visible = true
    },
    // 隐藏抽屉
    onClose () {
      this.visible = false
      this.nameExisted = ''
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
            .post('admin/admins/del', {
              admin_id: id
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
    // 批量删除
    delSelect () {
      const self = this
      this.$confirm({
        title: '提示',
        content: '确定要删除吗?',
        okText: '确定',
        cancelText: '取消',
        onOk () {
          self.$http
            .post('admin/admins/delSelect', {
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
    // 修改状态
    changeStatus (item) {
      item.loading = true
      this.$http
        .post('admin/admins/modifyStatus', {
          admin_id: item.admin_id,
          status: item.status === '1' ? 0 : 1
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

<style lang="less">
  .search-box{
    background: #fff;
    border-bottom: 1px solid #e8e8e8;
    margin-bottom: 24px;
    .ant-advanced-search-form .ant-form-item {
      display: flex;
    }
    .ant-advanced-search-form .ant-form-item-control-wrapper {
      flex: 1;
    }
    .ant-form {
      max-width: none;
    }
  }
  .tool-bar {
    >button{
    margin-right: 8px;
    }
  }
  .action-box button {
    margin-right: 8px;
  }
</style>
