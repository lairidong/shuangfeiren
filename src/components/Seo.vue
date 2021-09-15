<template>
  <div>
    <div class="tool-bar" style="margin-bottom: 16px">
      <a-row>
        <a-col :span="12">
          <div class="page-title">网站SEO管理</div>
        </a-col>
      </a-row>
    </div>

    <div>
      <a-tabs default-active-key="1" :tab-position="'left'">
        <a-tab-pane :tab="item.column_name" v-for="(item, index) of data" :key="item.seo_id">
          <a-row :gutter="24">
            <a-col :span="12">
              <a-form-model-item label="搜索标题">
                <a-input
                  v-model="item.meta_search_title"
                  placeholder="针对搜索引擎设置的 搜索标题"
                />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :span="12">
              <a-form-model-item label="网页作者">
                <a-input
                  v-model="item.meta_author"
                  placeholder="针对搜索引擎设置的 网页作者"
                />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :span="12">
              <a-form-model-item label="网页关键词">
                <a-input
                  v-model="item.meta_keywords"
                  placeholder="针对搜索引擎设置的 关键词"
                />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :span="12">
              <a-form-model-item label="网页声明">
                <a-input
                  v-model="item.meta_copyright"
                  placeholder="针对搜索引擎设置的 网页声明"
                />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :span="12">
              <a-form-model-item label="网页描述">
                <a-textarea
                  v-model="item.meta_description"
                  placeholder="针对搜索引擎设置的 网页描述"
                  :auto-size="{ minRows: 3, maxRows: 5 }"
                />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :span="12">
              <a-form-model-item label="" extra="注意：只保存当前栏目">
                <a-button icon="save" type="primary" @click="handleSubmit(index)" v-action:web-seo-edit>
                  保存
                </a-button>
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      data: []
    }
  },
  name: 'Seo',
  created () {
    this.getList()
  },
  methods: {
    getList () {
      this.$http
        .post('admin/seo', {
        })
        .then(res => {
          if (res.data.status === 'S') {
            this.data = res.data.data
          }
        })
        .catch()
    },
    handleSubmit (index) {
      this.$http
        .post('admin/seo/edit', this.data[index])
        .then(res => {
          if (res.data.status === 'S') {
            this.$message.success('保存成功')
            this.getList()
          } else if (res.data.status !== 'T') {
            this.$error({
              title: '提示',
              content: res.data.msg
            })
          }
        })
        .catch()
    }
  }
}
</script>

<style lang="less" scoped>
</style>
