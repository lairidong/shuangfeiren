<template>
  <div>
    <div class="tool-bar" style="margin-bottom: 16px">
      <a-row>
        <a-col :span="12">
          <div class="page-title">
            {{ parent_column_name }} - {{ column_name }}
          </div>
        </a-col>
      </a-row>
    </div>
    <div>
      <a-form-model
        ref="ruleForm"
        layout="vertical"
        :model="page"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <div style="background-color: #ececec; padding: 8px;">
          <a-row :gutter="[8, 8]">
            <a-col :span="8" v-for="item in data" :key="item.id">
              <a-card :title="item.name" :bordered="false">
                <a-row :gutter="[8, 8]">
                  <a-col :span="24">
                    <UploadImgComponent :imgSize="''" :imgName="''" :imageUrl.sync="item.img" :actionUrl="actionUrl"></UploadImgComponent>
                  </a-col>
                </a-row>
                <a-row :gutter="[12,12]">
                  <a-col :span="24">
                    <a-input
                      v-model="item.name"
                      placeholder=""
                      addon-before="名字："
                    />
                  </a-col>
                  <a-col :span="24">
                    <a-input
                      v-model="item.url"
                      placeholder=""
                      addon-before="网址："
                    />
                  </a-col>
                </a-row>
              </a-card>
            </a-col>
          </a-row>
        </div>
        <a-affix :offset-bottom="10" @change="change">
          <a-row :gutter="24" style="margin-top: 8px;">
            <a-col :span="24">
              <a-button icon="save" type="primary" @click="handleSave()" v-action:global-map-edit>
                保存
              </a-button>
            </a-col>
          </a-row>
        </a-affix>
      </a-form-model>
    </div>

  </div>
</template>

<script>
import moment from 'moment'
import 'moment/locale/zh-cn'
import locale from 'ant-design-vue/es/date-picker/locale/zh_CN'
import UploadImgComponent from './modules/UploadImg.component'

export default {
  data () {
    return {
      data: [
        {
          id: 1,
          name: 'usa',
          key: 'usa',
          img: '',
          url: ''
        },
        {
          id: 2,
          name: 'boston usa',
          key: 'boston_usa',
          img: '',
          url: ''
        },
        {
          id: 3,
          name: 'ecuador',
          key: 'ecuador',
          img: '',
          url: ''
        },
        {
          id: 4,
          name: 'peru',
          key: 'peru',
          img: '',
          url: ''
        },
        {
          id: 5,
          name: 'englad',
          key: 'englad',
          img: '',
          url: ''
        },
        {
          id: 6,
          name: 'portugal',
          key: 'portugal',
          img: '',
          url: ''
        },
        {
          id: 7,
          name: 'morocco',
          key: 'morocco',
          img: '',
          url: ''
        },
        {
          id: 8,
          name: 'nigeria',
          key: 'nigeria',
          img: '',
          url: ''
        },
        {
          id: 9,
          name: 'hungary',
          key: 'hungary',
          img: '',
          url: ''
        },
        {
          id: 10,
          name: 'italy',
          key: 'usitalya',
          img: '',
          url: ''
        },
        {
          id: 11,
          name: 'belgium',
          key: 'belgium',
          img: '',
          url: ''
        },
        {
          id: 12,
          name: 'croatia',
          key: 'croatia',
          img: '',
          url: ''
        },
        {
          id: 13,
          name: 'south africa',
          key: 'south_africa',
          img: '',
          url: ''
        },
        {
          id: 14,
          name: 'middle east',
          key: 'middle_east',
          img: '',
          url: ''
        },
        {
          id: 15,
          name: 'estonia',
          key: 'estonia',
          img: '',
          url: ''
        },
        {
          id: 16,
          name: 'kuwait',
          key: 'kuwait',
          img: '',
          url: ''
        },
        {
          id: 17,
          name: 'saudi arabia',
          key: 'saudi_arabia',
          img: '',
          url: ''
        },
        {
          id: 18,
          name: 'dubai',
          key: 'dubai',
          img: '',
          url: ''
        },
        {
          id: 19,
          name: 'bahrain',
          key: 'bahrain',
          img: '',
          url: ''
        },
        {
          id: 20,
          name: 'oman',
          key: 'oman',
          img: '',
          url: ''
        },
        {
          id: 21,
          name: 'tajikistan',
          key: 'tajikistan',
          img: '',
          url: ''
        },
        {
          id: 22,
          name: 'russia',
          key: 'russia',
          img: '',
          url: ''
        },
        {
          id: 23,
          name: 'india',
          key: 'india',
          img: '',
          url: ''
        },
        {
          id: 24,
          name: 'malaysia',
          key: 'malaysia',
          img: '',
          url: ''
        },
        {
          id: 25,
          name: 'guangzhou',
          key: 'guangzhou',
          img: '',
          url: ''
        },
        {
          id: 26,
          name: 'korea',
          key: 'korea',
          img: '',
          url: ''
        },
        {
          id: 27,
          name: 'taiwan',
          key: 'taiwan',
          img: '',
          url: ''
        },
        {
          id: 28,
          name: 'philippines',
          key: 'philippines',
          img: '',
          url: ''
        },
        {
          id: 29,
          name: 'indonesia',
          key: 'indonesia',
          img: '',
          url: ''
        },
        {
          id: 30,
          name: 'japan',
          key: 'japan',
          img: '',
          url: ''
        },
        {
          id: 31,
          name: 'australia',
          key: 'australia',
          img: '',
          url: ''
        },
        {
          id: 32,
          name: 'new zealand',
          key: 'new_zealand',
          img: '',
          url: ''
        }
      ],
      moment,
      locale,
      parent_column_name: '',
      column_name: '',
      labelCol: { },
      wrapperCol: { },
      page: {
        page_title: '',
        page_content: '',
        img: ''
      },
      action: '',
      visible: false,
      headers: {
        AccessToken: localStorage.getItem('token')
      },
      actionUrl: this.$baseUrl + 'admin/article/upload_img' + (process.env.NODE_ENV === 'development' ? '?voucher=token' : '?voucher=session'),
      rules: {
        // cate_id: [{ required: true, message: '请选择分类', trigger: 'blur' }],
        // title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
      }
    }
  },
  name: 'GlobalMap',
  components: {
    UploadImgComponent
  },
  created () {
    this.getContent()
    this.getColumnByCode()
    this.$root.$on('updateToken', (data) => {
      this.headers.AccessToken = data
    })
  },
  methods: {
    getColumnByCode () {
      this.$http
        .post('admin/column/getParentColumnByCode', {
          code: 'global-map'
        })
        .then((res) => {
          if (res.data.status === 'S') {
            this.parent_column_name = res.data.data.column_name
            this.$http
              .post('admin/column/getColumnByCode', {
                code: 'global-map'
              })
              .then((res2) => {
                this.title = res2.data.data.column_name
                if (res2.data.status === 'S') {
                  this.column_name = res2.data.data.column_name
                  this.$store.commit('setBreadcrumb', {
                    breadcrumbData: [
                      {
                        key: '1',
                        name: '首页',
                        url: '#/main/base'
                      },
                      {
                        key: '2',
                        name: res.data.data.column_name,
                        url: ''
                      },
                      {
                        key: '3',
                        name: res2.data.data.column_name,
                        url: ''
                      }
                    ]
                  })
                }
              })
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    getContent () {
      this.$http
        .post('admin/page/getContent', {
          code: 'global-map'
        })
        .then(res => {
          if (res.data.status === 'S') {
            this.page = res.data.data
            if (this.page.attribute1 && this.page.attribute1.indexOf('[') > -1) {
              this.data = JSON.parse(this.page.attribute1)
            }
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
    handleSave () {
      this.page.page_title = this.column_name
      this.page.code = 'global-map'
      this.page.attribute1 = JSON.stringify(this.data)
      this.$http
        .post('admin/page/edit', this.page)
        .then(res => {
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
        .catch(error => {
          console.log(error)
        })
    }
  }
}
</script>

<style lang="less" scoped>
/deep/.ant-card-head-title{
  text-transform: capitalize;
}
</style>
