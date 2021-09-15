<template>
  <div>
    <div class="tool-bar" style="margin-bottom: 16px">
      <a-row>
        <a-col :span="12">
          <div class="page-title">人才招聘</div>
        </a-col>
        <a-col :span="12">
          <div class="btn-box">
            <a-button icon="plus" type="primary" v-action:job-add @click="addItem()">添加</a-button>
            <a-button icon="reload" type="job" @click="reload" :loading="tableLoading"></a-button>
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
        :scroll="{ x: 1410 }"
        @change="onChangePage"
        row-key="job_id"
        size="small"
      >
        <div slot="sort" slot-scope="text">
          <div style="border-bottom: 1px solid #ddd; padding: 5px 0; text-indent: 12px;" v-if="!text.editable || !$store.getters.hasPermission('job-edit')" @click="showEdit(text)">{{ text.sort }}</div>
          <div v-else>
            <a-input class="input-sort" :id="`input_${text.job_id}`" v-model="text.sort" @blur="text.oldSort===text.sort?text.editable=false:text.editable=true">
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
            :disabled="!$store.getters.hasPermission('job-edit')"
            :loading="text.loading"
            :checked="text.status=='1' ? true : false"
            @change="changeStatus(text)"
          />
        </div>
        <div class="action-box" slot="action" slot-scope="text">
          <a-tooltip placement="top" v-action:job-edit>
            <template slot="title">
              <span>修改</span>
            </template>
            <a-button type="primary" icon="edit" @click="editItem(text)"></a-button>
          </a-tooltip>
          <a-tooltip placement="top" v-action:job-del>
            <template slot="title">
              <span>删除</span>
            </template>
            <a-button type="danger" icon="rest" @click="deleteItem(text.job_id)"></a-button>
          </a-tooltip>
        </div>
      </a-table>
    </div>

    <a-drawer
      :title="action + '人才招聘'"
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
          <!-- <a-col :span="12">
            <a-form-model-item ref="cate_id" label="分类" prop="cate_id">
              <a-select v-model="form.cate_id">
                <a-select-option v-for="item in cateData" :key="item.cate_id" :value="item.cate_id">
                  {{ item.cate_name }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col> -->
          <a-col :span="12">
            <a-form-model-item ref="job_name" label="职位" prop="job_name">
              <a-input
                v-model="form.job_name"
                @blur="
                  () => {
                    $refs.job_name.onFieldBlur();
                  }
                "
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item ref="department" label="部门" prop="department">
              <a-input
                v-model="form.department"
                @blur="
                  () => {
                    $refs.department.onFieldBlur();
                  }
                "
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item ref="num" label="招聘人数" prop="num">
              <a-input
                v-model="form.num"
                @blur="
                  () => {
                    $refs.num.onFieldBlur();
                  }
                "
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item ref="address" label="工作地点" prop="address">
              <a-input
                v-model="form.address"
                @blur="
                  () => {
                    $refs.address.onFieldBlur();
                  }
                "
              />
            </a-form-model-item>
          </a-col>
          <!-- <a-col :span="12">
            <a-form-model-item ref="education" label="学历要求" prop="education">
              <a-input
                v-model="form.education"
                @blur="
                  () => {
                    $refs.education.onFieldBlur();
                  }
                "
              />
            </a-form-model-item>
          </a-col> -->
          <!-- <a-col :span="12">
            <a-form-model-item ref="category" label="职位类别" prop="category">
              <a-input
                v-model="form.category"
                @blur="
                  () => {
                    $refs.category.onFieldBlur();
                  }
                "
              />
            </a-form-model-item>
          </a-col> -->
          <!-- <a-col :span="12">
            <a-form-model-item ref="job_nature" label="工作性质" prop="job_nature">
              <a-input
                v-model="form.job_nature"
                placeholder="如：全职"
                @blur="
                  () => {
                    $refs.job_nature.onFieldBlur();
                  }
                "
              />
            </a-form-model-item>
          </a-col> -->
          <!-- <a-col :span="12">
            <a-form-model-item ref="salary" label="薪酬" prop="salary">
              <a-input
                v-model="form.salary"
                placeholder=""
                @blur="
                  () => {
                    $refs.salary.onFieldBlur();
                  }
                "
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item ref="working_years" label="工作年限" prop="working_years">
              <a-input
                v-model="form.working_years"
                placeholder=""
                @blur="
                  () => {
                    $refs.working_years.onFieldBlur();
                  }
                "
              />
            </a-form-model-item>
          </a-col> -->
          <a-col :span="12">
            <a-form-model-item ref="email" label="应聘邮箱" prop="email">
              <a-input
                v-model="form.email"
                @blur="
                  () => {
                    $refs.email.onFieldBlur();
                  }
                "
              />
            </a-form-model-item>
          </a-col>
          <!-- <a-col :span="12">
            <a-form-model-item ref="tel" label="应聘电话" prop="tel">
              <a-input
                v-model="form.tel"
                @blur="
                  () => {
                    $refs.tel.onFieldBlur();
                  }
                "
              />
            </a-form-model-item>
          </a-col> -->
          <a-col :span="12">
            <a-form-model-item ref="create_date" label="发布日期" prop="create_date">
              <a-date-picker
                style="width: 100%;"
                v-model="form.create_date"
                @blur="
                  () => {
                    $refs.create_date.onFieldBlur();
                  }
                " />
            </a-form-model-item>
          </a-col>
          <!-- <a-col :span="12">
            <a-form-model-item ref="end_date" label="有效日期" prop="end_date">
              <a-date-picker
                style="width: 100%;"
                v-model="form.end_date"
                @blur="
                  () => {
                    $refs.end_date.onFieldBlur();
                  }
                " />
            </a-form-model-item>
          </a-col> -->
          <a-col :span="24">
            <a-form-item label="岗位职责">
              <a-textarea
                v-model="form.duty"
                placeholder=""
                :auto-size="{ minRows: 3, maxRows: 5 }"
              />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="任职要求">
              <a-textarea
                v-model="form.requirements"
                placeholder=""
                :auto-size="{ minRows: 3, maxRows: 5 }"
              />
            </a-form-item>
          </a-col>
          <!-- <a-col :span="24">
            <a-form-item label="员工福利">
              <a-textarea
                v-model="form.welfare"
                placeholder=""
                :auto-size="{ minRows: 3, maxRows: 5 }"
              />
            </a-form-item>
          </a-col> -->
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
import moment from 'moment'
import 'moment/locale/zh-cn'
import locale from 'ant-design-vue/es/date-picker/locale/zh_CN'
const columns = [
  { title: '职位', dataIndex: 'job_name', key: 'job_name', width: 200, fixed: 'left' },
  { title: '职位类别', dataIndex: 'category', key: 'category', width: 150 },
  { title: '招聘人数', dataIndex: 'num', key: 'num', width: 100 },
  { title: '工作地点', dataIndex: 'address', key: 'address' },
  { title: '应聘邮箱', dataIndex: 'email', key: 'email', width: 150 },
  // { title: '应聘电话', dataIndex: 'tel', key: 'tel', width: 150 },
  { title: '排序号', dataIndex: '', key: 'sort', scopedSlots: { customRender: 'sort' }, width: '100px' },
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
    const checkName = (rule, value, callback) => {
      if (!value) {
        return callback()
      } else {
        this.$http
          .post('admin/job/checkName', {
            job_name: this.form.job_name,
            job_id: this.form.job_id
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
      moment,
      locale,
      columns,
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
      form: {
        job_id: null,
        job_name: '',
        department: '',
        num: '',
        address: '',
        category: '',
        duty: '',
        requirements: '',
        welfare: '',
        email: '',
        create_date: moment(new Date(), 'YYYY-MM-DD'),
        sort: 99,
        status: '1'
      },
      rules: {
        // cate_id: [{ required: true, message: '请选择分类', trigger: 'change' }],
        job_name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { validator: checkName, trigger: 'blur' }
        ],
        department: [
          { required: false, message: '请输入部门', trigger: 'blur' }
        ],
        create_date: [{ required: true, message: '请选择日期', trigger: 'change' }],
        sort: [{ required: true, message: '请输入排序号', trigger: blur }],
        status: [{ required: true, message: '请选择状态', trigger: 'change' }]
      }
    }
  },
  name: 'Job',
  watch: {
    $route: function () {
      this.getList()
    }
  },
  created () {
    this.getList()
    this.getCate()
    this.$store.commit('setBreadcrumb', {
      breadcrumbData: [
        {
          key: '1',
          name: '首页',
          url: '#/main/base'
        },
        {
          key: '2',
          name: '人才招聘',
          url: ''
        }
      ]
    })
  },
  methods: {
    // 获取分类
    getCate () {
      this.$http
        .post('admin/cate', {
          page_size: 100,
          current_page: 1,
          parent_code: 'cate-job'
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
        .post('admin/job', {
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
        cate_id: null,
        job_id: null,
        job_name: '',
        department: '',
        education: '',
        num: '',
        address: '',
        category: '',
        duty: '',
        requirements: '',
        welfare: '',
        email: '',
        tel: '',
        working_years: '',
        salary: '',
        job_nature: '',
        create_date: '',
        sort: 99,
        status: '1'
      }
      this.visible = true
      this.action = '新增'
    },
    editItem (item) {
      this.form = {
        cate_id: item.cate_id,
        job_id: item.job_id,
        job_name: item.job_name,
        department: item.department,
        education: item.education,
        num: item.num,
        address: item.address,
        category: item.category,
        duty: item.duty,
        requirements: item.requirements,
        welfare: item.welfare,
        email: item.email,
        tel: item.tel,
        working_years: item.working_years,
        salary: '',
        job_nature: item.job_nature,
        create_date: item.create_date,
        end_date: item.end_date,
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
            .post('admin/job/del', {
              job_id: id
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
          this.form.create_date = moment(this.form.create_date).isValid() ? moment(this.form.create_date).format('YYYY-MM-DD HH:mm:ss') : null
          this.form.end_date = moment(this.form.end_date).isValid() ? moment(this.form.end_date).format('YYYY-MM-DD HH:mm:ss') : null
          this.$http
            .post('admin/job/edit', this.form)
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
      if (this.$store.getters.hasPermission('job-edit')) {
        item.editable = true
        setTimeout(() => {
          document.querySelector('#input_' + item.job_id).focus()
        }, 500)
      }
    },
    updateSort (item) {
      if (item.sort === item.oldSort) {
        item.editable = false
      } else {
        this.$http
        .post('admin/job/updateSort', {
          job_id: item.job_id,
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
        .post('admin/job/modifyStatus', {
          job_id: item.job_id,
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
