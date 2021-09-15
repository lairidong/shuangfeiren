<template>
  <div>
    <div class="tool-bar" style="margin-bottom: 16px">
      <a-row>
        <a-col :span="12">
          <div class="page-title">数据库备份/还原</div>
        </a-col>
        <a-col :span="12">
          <div class="btn-box">
            <a-button
              icon="export"
              type="primary"
              v-action:database-backup
              @click="backup()"
              :disabled="loading"
              :loading="loading">备份</a-button>
            <a-button icon="reload" type="link" @click="reload" :loading="tableLoading"></a-button>
          </div>
        </a-col>
      </a-row>
    </div>

    <div>
      <a-table
        :columns="columns"
        :data-source="data"
        :pagination="false"
        row-key="file_id"
        size="small"
      >
        <div class="action-box" slot="action" slot-scope="text">
          <a-tooltip placement="top" v-action:database-restore>
            <template slot="title">
              <span>还原</span>
            </template>
            <a-button type="primary" icon="import" :loading="text.loading" @click="restore(text)"></a-button>
          </a-tooltip>
          <a-tooltip placement="top" v-action:database-restore>
            <template slot="title">
              <span>下载</span>
            </template>
            <a-button type="primary" icon="download" @click="download(text.file)"></a-button>
          </a-tooltip>
          <a-tooltip placement="top" v-action:database-del>
            <template slot="title">
              <span>删除</span>
            </template>
            <a-button type="danger" icon="rest" @click="deleteItem(text.file)"></a-button>
          </a-tooltip>
        </div>
      </a-table>
    </div>
  </div>
</template>

<script>
const columns = [
  { title: '文件名', dataIndex: 'file', key: 'file' },
  { title: '文件大小', dataIndex: 'size', key: 'size', width: 170 },
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
      loading: false,
      tableLoading: false,
      columns,
      data: []
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
          name: '数据库备份/还原',
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
        .post('admin/database', {})
        .then(res => {
          if (res.data.status === 'S') {
            res.data.data.forEach(item => {
              item.loading = false
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
    backup () {
      this.loading = true
      this.$http
        .post('admin/database/backup', {})
        .then(res => {
          if (res.data.status === 'S') {
            this.getList(false)
          } else if (res.data.status !== 'T') {
            this.$error({
              title: '提示',
              content: res.data.msg
            })
          }
          this.loading = false
        })
        .catch(error => {
          console.log(error)
          this.loading = false
        })
    },
    restore (item) {
      const self = this
      this.$confirm({
        title: '提示',
        content: '确定要还原该数据吗?还原后会覆盖当前所有数据，请谨慎操作!',
        okText: '确定',
        cancelText: '取消',
        onOk () {
          item.loading = true
          self.$http
            .post('admin/database/restore', {
              file: item.file
            })
            .then(res => {
              if (res.data.status === 'S') {
                self.$message.success('还原成功')
              } else if (res.data.status !== 'T') {
                self.$error({
                  title: '提示',
                  content: res.data.msg
                })
              }
              item.loading = false
            })
            .catch(error => {
              console.log(error)
              item.loading = false
            })
        }
      })
    },
    download (file) {
      this.$http
        .post('admin/database/download', {
          file: file
        })
        .then(res => {
          var blob = new Blob([res.data], { type: 'application/stream' })
          var downloadElement = document.createElement('a')
          var href = window.URL.createObjectURL(blob)
          downloadElement.href = href
          downloadElement.download = file
          document.body.appendChild(downloadElement)
          downloadElement.click()
          document.body.removeChild(downloadElement)
          window.URL.revokeObjectURL(href)
        })
        .catch(error => {
          console.log(error)
          this.loading = false
        })
    },
    deleteItem (file) {
      const self = this
      this.$confirm({
        title: '提示',
        content: '确定要删除吗?',
        okText: '确定',
        cancelText: '取消',
        onOk () {
          self.$http
            .post('admin/database/del', {
              file: file
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
    }
  }
}
</script>

<style lang="less" scoped>
</style>
