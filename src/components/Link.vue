<template>
  <div>
    <div class="tool-bar" style="margin-bottom: 16px">
      <a-row>
        <a-col :span="12">
          <div class="page-title">友情链接</div>
        </a-col>
        <a-col :span="12">
          <div class="btn-box">
            <a-button icon="plus" type="primary" v-action:link-add @click="addItem()">添加</a-button>
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
        row-key="link_id"
        size="small"
      >
        <div slot="sort" slot-scope="text">
          <div style="border-bottom: 1px solid #ddd; padding: 5px 0; text-indent: 12px;" v-if="!text.editable || !$store.getters.hasPermission('link-edit')" @click="showEdit(text)">{{ text.sort }}</div>
          <div v-else>
            <a-input class="input-sort" :id="`input_${text.link_id}`" v-model="text.sort" @blur="text.oldSort===text.sort?text.editable=false:text.editable=true">
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
            :disabled="!$store.getters.hasPermission('link-edit')"
            :loading="text.loading"
            :checked="text.status=='1' ? true : false"
            @change="changeStatus(text)"
          />
        </div>
        <div class="action-box" slot="action" slot-scope="text">
          <a-tooltip placement="top" v-action:link-edit>
            <template slot="title">
              <span>修改</span>
            </template>
            <a-button type="primary" icon="edit" @click="editItem(text)"></a-button>
          </a-tooltip>
          <a-tooltip placement="top" v-action:link-del>
            <template slot="title">
              <span>删除</span>
            </template>
            <a-button type="danger" icon="rest" @click="deleteItem(text.link_id)"></a-button>
          </a-tooltip>
        </div>
      </a-table>
    </div>

    <a-drawer
      :title="action + '友情链接'"
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
            <a-form-model-item ref="link_name" label="名称" prop="link_name">
              <a-input
                v-model="form.link_name"
                @blur="
                  () => {
                    $refs.link_name.onFieldBlur();
                  }
                "
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item ref="link_url" label="链接网址" prop="link_url">
              <a-input
                v-model="form.link_url"
                @blur="
                  () => {
                    $refs.link_url.onFieldBlur();
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
  </div>
</template>

<script>
const columns = [
  { title: '名称', dataIndex: 'link_name', key: 'link_name' },
  { title: '链接地址', dataIndex: 'link_url', key: 'link_url' },
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
    const checkName = (rule, value, callback) => {
      if (!value) {
        return callback()
      } else {
        this.$http
          .post('admin/link/checkName', {
            link_name: this.form.link_name,
            link_id: this.form.link_id
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
      form: {
        link_id: null,
        link_name: '',
        link_url: '',
        sort: 99,
        status: '1'
      },
      rules: {
        link_name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { validator: checkName, trigger: 'blur' }
        ],
        link_url: [
          { required: true, message: '请输入链接地址', trigger: 'blur' }
        ],
        sort: [{ required: true, message: '请输入排序号', trigger: blur }],
        status: [{ required: true, message: '请选择状态', trigger: 'change' }]
      }
    }
  },
  name: 'Link',
  watch: {
    $route: function () {
      this.getList()
    }
  },
  created () {
    this.getList()
    this.$store.commit('setBreadcrumb', {
      breadcrumbData: [
        {
          key: '1',
          name: '首页',
          url: '#/main/base'
        },
        {
          key: '2',
          name: '友情链接',
          url: ''
        }
      ]
    })
  },
  methods: {
    getList (retry) {
      if (retry) {
        setTimeout(() => {
          this.getList(true)
        }, 2000)
      }
      this.tableLoading = true
      this.$http
        .post('admin/link', {
          page_size: this.pageSize,
          current_page: this.currentPage
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
        link_id: null,
        link_name: '',
        link_url: '',
        sort: 99,
        status: '1'
      }
      this.visible = true
      this.action = '新增'
    },
    editItem (item) {
      this.form = {
        link_id: item.link_id,
        link_name: item.link_name,
        link_url: item.link_url,
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
            .post('admin/link/del', {
              link_id: id
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
            .post('admin/link/edit', this.form)
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
      if (this.$store.getters.hasPermission('link-edit')) {
        item.editable = true
        setTimeout(() => {
          document.querySelector('#input_' + item.link_id).focus()
        }, 500)
      }
    },
    updateSort (item) {
      if (item.sort === item.oldSort) {
        item.editable = false
      } else {
        this.$http
        .post('admin/link/updateSort', {
          link_id: item.link_id,
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
        .post('admin/link/modifyStatus', {
          link_id: item.link_id,
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
</style>
