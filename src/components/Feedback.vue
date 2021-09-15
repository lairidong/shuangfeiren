<template>
  <div>
    <div class="tool-bar" style="margin-bottom: 16px">
      <a-row>
        <a-col :span="12">
          <div class="page-title">在线留言</div>
        </a-col>
        <a-col :span="12">
          <div class="btn-box">
            <a-button icon="plus" type="primary" v-action:feedback-add @click="addItem()">添加</a-button>
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
        row-key="fb_id"
        size="small"
        :scroll="{ x: 1100 }"
      >
        <div slot="status" slot-scope="text">
          <a-switch
            checkedChildren="已处理"
            unCheckedChildren="未处理"
            :disabled="!$store.getters.hasPermission('feedback-edit')"
            :loading="text.loading"
            :checked="text.status=='1' ? true : false"
            @change="changeStatus(text)"
          />
        </div>
        <div class="action-box" slot="action" slot-scope="text">
          <a-tooltip placement="top" v-action:feedback-edit>
            <template slot="title">
              <span>查看</span>
            </template>
            <a-button type="primary" icon="edit" @click="editItem(text)"></a-button>
          </a-tooltip>
          <a-tooltip placement="top" v-action:feedback-del>
            <template slot="title">
              <span>删除</span>
            </template>
            <a-button type="danger" icon="rest" @click="deleteItem(text.fb_id)"></a-button>
          </a-tooltip>
        </div>
      </a-table>
    </div>

    <a-drawer
      :title="'管理留言'"
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
          <!-- <a-col :span="24">
            <a-form-model-item ref="email" label="公司名称" prop="email">
              {{ form.email }}
            </a-form-model-item>
          </a-col> -->
          <a-col :span="24">
            <a-form-model-item ref="name" label="姓名" prop="name">
              {{ form.name }}
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item ref="phone" label="手机号码" prop="phone">
              {{ form.phone }}
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item ref="email" label="邮箱" prop="email">
              {{ form.email }}
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item ref="address" label="地址" prop="address">
              {{ form.address }}
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item ref="message" label="留言内容" prop="message">
              {{ form.message }}
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item ref="message" label="提交日期" prop="message">
              {{ form.create_date }}
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
  { title: '姓名', dataIndex: 'name', key: 'name', width: 120 },
  { title: '手机号码', dataIndex: 'phone', key: 'phone', width: 120 },
  { title: '留言内容', dataIndex: 'message', key: 'comment' },
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
      form: {
        fb_id: null,
        feedback_name: '',
        feedback_url: '',
        sort: 99,
        status: '1'
      },
      rules: {
      }
    }
  },
  name: 'Feedback',
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
          name: '参观预约',
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
        .post('admin/feedback', {
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
        fb_id: item.fb_id,
        name: item.name,
        phone: item.phone,
        email: item.email,
        address: item.address,
        region: item.region,
        amount: item.amount,
        message: item.message,
        remark: item.remark,
        create_date: item.create_date,
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
            .post('admin/feedback/del', {
              fb_id: id
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
            .post('admin/feedback/edit', this.form)
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
      if (this.$store.getters.hasPermission('feedback-edit')) {
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
        .post('admin/feedback/modifyStatus', {
          fb_id: item.fb_id,
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
