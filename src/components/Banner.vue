<template>
  <div>
    <div class="tool-bar" style="margin-bottom: 16px">
      <a-row>
        <a-col :span="12">
          <div class="page-title">Banner管理</div>
        </a-col>
        <a-col :span="12">
          <div class="btn-box">
            <a-button icon="reload" type="link" @click="reload" :loading="tableLoading"></a-button>
          </div>
        </a-col>
      </a-row>
    </div>

    <div>
      <a-row :gutter="16">
        <a-col :span="6" v-for="item in data" :key="item.banner_id" style="margin-bottom: 16px;">
          <a-card hoverable >
            <img
              v-if="item.img!==''"
              slot="cover"
              :alt="item.title"
              :src="item.img"
            />
            <template slot="actions" class="ant-card-actions">
              <a-icon key="edit" v-action:banners-edit type="edit" @click="editItem(item)" />
            </template>
            <a-card-meta :title="item.name" description="">
            </a-card-meta>
          </a-card>
        </a-col>
      </a-row>
    </div>

    <a-drawer
      :title="action + 'Banner'"
      :width="'calc(100% - 200px)'"
      @close="onClose"
      :visible="visible"
      :bodyStyle="{paddingBottom: '80px'}"
    >
      <a-form-model
        ref="ruleForm"
        layout="vertical"
        :model="form"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-model-item ref="name" label="栏目" prop="name">
              <a-input
                :disabled="true"
                v-model="form.name"
                @blur="
                  () => {
                    $refs.name.onFieldBlur();
                  }
                "
              />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-model-item ref="title" label="标题1" prop="title">
              <a-input
                v-model="form.title"
                @blur="
                  () => {
                    $refs.title.onFieldBlur();
                  }
                "
              />
            </a-form-model-item>
          </a-col>
        </a-row>
        <!-- <a-row :gutter="24">
          <a-col :span="12">
            <a-form-model-item ref="sub_title" label="标题2" prop="sub_title">
              <a-input
                v-model="form.sub_title"
                @blur="
                  () => {
                    $refs.sub_title.onFieldBlur();
                  }
                "
              />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-model-item ref="summary" label="标题3" prop="summary">
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
        </a-row> -->
        <a-row :gutter="16">
          <a-col :span="24">
            <UploadImgComponent :imgSize="imgSize" :imgName="imgName" :imageUrl.sync="form.img" :actionUrl="actionUrl"></UploadImgComponent>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="24">
            <UploadImgComponent :imgSize="imgSize2" :imgName="imgName2" :imageUrl.sync="form.img2" :actionUrl="actionUrl"></UploadImgComponent>
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
export default {
  data () {
    return {
      data: [],
      tableLoading: false,
      form: {
        banner_id: '',
        title: '',
        sub_title: '',
        summary: '',
        code: '',
        img: '',
        img2: ''
      },
      imgSize: '',
      imgName: '',
      imgSize2: '',
      imgName2: '',
      labelCol: { },
      wrapperCol: { },
      visible: false,
      action: '',
      headers: {
        AccessToken: localStorage.getItem('token')
      },
      actionUrl: this.$baseUrl + 'admin/banner/upload_img' + (process.env.NODE_ENV === 'development' ? '?voucher=token' : '?voucher=session'),
      rules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' }
        ],
        img: [
          { required: false, message: '请上传图片', trigger: 'blur' }
        ]
      }
    }
  },
  components: {
    UploadImgComponent
  },
  created () {
    this.getList()
    this.getColumnByCode()
    this.$store.commit('setBreadcrumb', {
      breadcrumbData: [
        {
          key: '1',
          name: '首页',
          url: '#/main/base'
        },
        {
          key: '2',
          name: 'Banner管理',
          url: ''
        }
      ]
    })
    this.$root.$on('updateToken', (data) => {
      this.headers.AccessToken = data
    })
  },
  methods: {
    getColumnByCode () {
      this.$http
        .post('admin/column/getColumnByCode', {
          code: 'banners'
        })
        .then(res => {
          if (res.data.status === 'S') {
            const data = res.data.data
            if (data.img_size && data.img_size !== '') {
              this.imgSize = '图片尺寸：' + data.img_size.replace(',', '×') + '像素'
            } else {
              this.imgSize = ''
            }
            if (data.img_size2 && data.img_size2 !== '') {
              this.imgSize2 = '图片尺寸：' + data.img_size2.replace(',', '×') + '像素'
            } else {
              this.imgSize2 = ''
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
      this.$http
        .post('admin/banner', {})
        .then(res => {
          this.tableLoading = false
          if (res.data.status === 'S') {
            this.data = res.data.data
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
    reload () {
      this.tableLoading = true
      this.getList()
    },
    editItem (item) {
      this.form = {
        banner_id: item.banner_id,
        name: item.name,
        title: item.title,
        sub_title: item.sub_title,
        summary: item.summary,
        code: item.code,
        img: item.img,
        img2: item.img2
      }
      this.visible = true
      this.action = '编辑'
    },
    handleOnSubmit () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          const params = JSON.parse(JSON.stringify(this.form))
          this.$http
            .post('admin/banner/edit', params)
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
    onClose () {
      this.visible = false
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .ant-upload.ant-upload-select-picture-card > .ant-upload{
  img{
    max-width: 500px;
  }
}
:host .flash-img {
  max-width: 90px;
  max-height: 90px;
}
.avatar-uploader > .ant-upload {
  width: 128px;
  height: 128px;
}
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>
