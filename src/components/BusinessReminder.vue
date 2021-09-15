<template>
  <div>
    <div class="tool-bar" style="margin-bottom: 16px">
      <a-row>
        <a-col :span="12">
          <div class="page-title">信息管理</div>
        </a-col>
        <a-col :span="12">
          <div class="btn-box">
            <a-button icon="reload" type="link" @click="reload" :loading="tableLoading"></a-button>
          </div>
        </a-col>
      </a-row>
    </div>

    <div>
      <a-form-model
        ref="ruleForm"
        layout="vertical"
        :model="page"
        :rules="rules2"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item ref="page_content" label="提醒内容" prop="page_content">
          <a-row :gutter="[16, 16]">
            <a-col :span="12">
              <a-textarea
                v-model="page.page_content"
                placeholder=""
                :auto-size="{ minRows: 2, maxRows: 5 }"
              />
            </a-col>
            <a-col :span="12">
              <a-button
                icon="save"
                type="primary"
                @click="handleSave()"
                v-action:business-reminder-edit
              >
                保存
              </a-button>
            </a-col>
          </a-row>
        </a-form-model-item>
      </a-form-model>
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
        row-key="remind_id"
        size="small"
        :scroll="{ x: 1100 }"
      >
        <div slot="status" slot-scope="text">
          <a-switch
            checkedChildren="已处理"
            unCheckedChildren="未处理"
            :disabled="!$store.getters.hasPermission('business-reminder-edit')"
            :loading="text.loading"
            :checked="text.status=='1' ? true : false"
            @change="changeStatus(text)"
          />
        </div>
        <div class="action-box" slot="action" slot-scope="text">
          <a-tooltip placement="top" v-action:business-reminder-edit>
            <template slot="title">
              <span>查看</span>
            </template>
            <a-button type="primary" icon="edit" @click="editItem(text)"></a-button>
          </a-tooltip>
          <a-tooltip placement="top" v-action:business-reminder-del>
            <template slot="title">
              <span>删除</span>
            </template>
            <a-button type="danger" icon="rest" @click="deleteItem(text.remind_id)"></a-button>
          </a-tooltip>
        </div>
      </a-table>
    </div>

    <a-drawer
      :title="'管理信息'"
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
          <a-col :span="24">
            <a-form-model-item ref="merchant" label="商家" prop="merchant">
              {{ form.merchant }}
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item ref="cate_name" label="分类" prop="cate_name">
              {{ form.cate_name }}
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item ref="region" label="区域" prop="region">
              {{ form.region }}
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item ref="remark" label="备注" prop="remark">
              <a-textarea
                v-model="form.remark"
                placeholder=""
                :auto-size="{ minRows: 3, maxRows: 5 }"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item ref="status" label="状态" prop="status">
              <a-radio-group v-model="form.status">
                <a-radio :value="'1'">已处理</a-radio>
                <a-radio :value="'0'">未处理</a-radio>
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
  { title: '商家', dataIndex: 'merchant', key: 'merchant' },
  { title: '分类', dataIndex: 'cate_name', key: 'cate_name', width: 120 },
  { title: '区域', dataIndex: 'region', key: 'region', width: 120 },
  { title: '备注', dataIndex: 'remark', key: 'remark' },
  { title: '日期', dataIndex: 'create_date', key: 'create_date', width: 120 },
  {
    title: '状态',
    dataIndex: '',
    key: 'a',
    scopedSlots: { customRender: 'status' },
    width: 90,
    fixed: 'right'
  },
  {
    title: '操作',
    dataIndex: '',
    key: 'x',
    scopedSlots: { customRender: 'action' },
    width: 150,
    fixed: 'right'
  }
]
export default {
  data () {
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
      page: {
        page_title: '',
        page_content: ''
      },
      form: {
      },
      rules: {
      },
      rules2: {
      }
    }
  },
  name: 'BusinessReminder',
  watch: {
    $route: function () {
      this.getList()
    }
  },
  created () {
    this.getList()
    this.getContent()
    this.$store.commit('setBreadcrumb', {
      breadcrumbData: [
        {
          key: '1',
          name: '首页',
          url: '#/main/base'
        },
        {
          key: '2',
          name: '留言管理',
          url: ''
        }
      ]
    })
  },
  methods: {
    getContent () {
      this.$http
        .post('admin/page/getContent', {
          code: 'remind'
        })
        .then((res) => {
          if (res.data.status === 'S') {
            this.page = res.data.data
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
    },
    handleSave () {
      this.page.page_title = '覆盖提醒内容'
      this.page.code = 'remind'
      this.$http
        .post('admin/page/edit', this.page)
        .then((res) => {
          if (res.data.status === 'S') {
            this.$message.success('保存成功')
            this.getContent()
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
    },
    getList (retry) {
      if (retry) {
        setTimeout(() => {
          this.getList(true)
        }, 2000)
      }
      this.tableLoading = true
      this.$http
        .post('admin/remind', {
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
    editItem (item) {
      this.form = {
        remind_id: item.remind_id,
        merchant: item.merchant,
        cate_name: item.cate_name,
        region: item.region,
        remark: item.remark,
        status: item.status ? item.status.toString() : '0'
      }
      this.visible = true
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
            .post('admin/remind/del', {
              remind_id: id
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
            .post('admin/remind/edit', this.form)
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
      if (this.$store.getters.hasPermission('business-reminder-edit')) {
        item.editable = true
        setTimeout(() => {
          document.querySelector('#input_' + item.fb_id).focus()
        }, 500)
      }
    },
    // 修改状态
    changeStatus (item) {
      item.loading = true
      this.$http
        .post('admin/remind/modifyStatus', {
          remind_id: item.remind_id,
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
