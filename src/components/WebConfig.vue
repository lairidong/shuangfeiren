<template>
  <div>
    <a-form-model
      ref="ruleForm"
      layout="vertical"
      :model="form"
      :rules="rules"
      :label-col="{}"
      :wrapper-col="{}"
    >
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-model-item ref="web_title" label="网站名称" prop="web_title">
            <a-input
              v-model="form.web_title"
              @blur="
                () => {
                  $refs.web_title.onFieldBlur();
                }
              "
            />
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="4">
          <UploadImgComponent :imgSize="'图片尺寸：120 × 120像素'" :imgName="'天猫商城二维码'" :imageUrl.sync="form.tmall" :actionUrl="actionUrl"></UploadImgComponent>
        </a-col>
        <a-col :span="4">
          <UploadImgComponent :imgSize="'图片尺寸：120 × 120像素'" :imgName="'京东商城二维码'" :imageUrl.sync="form.jd" :actionUrl="actionUrl"></UploadImgComponent>
        </a-col>
        <a-col :span="4">
          <UploadImgComponent :imgSize="'图片尺寸：120 × 120像素'" :imgName="'微博二维码'" :imageUrl.sync="form.weibo" :actionUrl="actionUrl"></UploadImgComponent>
        </a-col>
        <a-col :span="4">
          <UploadImgComponent :imgSize="'图片尺寸：120 × 120像素'" :imgName="'微信公众号'" :imageUrl.sync="form.wx" :actionUrl="actionUrl"></UploadImgComponent>
        </a-col>
      </a-row>
      <!-- <a-row :gutter="24">
        <a-col :span="4">
          <UploadImgComponent :imgSize="'图片尺寸：260 × 260像素'" :imgName="'二维码'" :imageUrl.sync="form.qr_code" :actionUrl="actionUrl"></UploadImgComponent>
        </a-col>
      </a-row> -->
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-model-item ref="tmall_url" label="天猫商城网址" prop="tmall_url">
            <a-input
              v-model="form.tmall_url"
              placeholder=""
              @blur="
                () => {
                  $refs.tmall_url.onFieldBlur();
                }
              "
            />
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-model-item ref="jd_url" label="京东商城网址" prop="jd_url">
            <a-input
              v-model="form.jd_url"
              placeholder=""
              @blur="
                () => {
                  $refs.jd_url.onFieldBlur();
                }
              "
            />
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-model-item ref="about" label="双飞人介绍" prop="about">
            <a-textarea
              v-model="form.about"
              placeholder=""
              :auto-size="{ minRows: 3, maxRows: 5 }"
            />
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-model-item ref="tel" label="电话" prop="tel">
            <a-input
              v-model="form.tel"
              placeholder=""
              @blur="
                () => {
                  $refs.tel.onFieldBlur();
                }
              "
            />
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-model-item ref="fax" label="传真" prop="fax">
            <a-input
              v-model="form.fax"
              placeholder=""
              @blur="
                () => {
                  $refs.fax.onFieldBlur();
                }
              "
            />
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-model-item ref="email" label="邮箱" prop="email">
            <a-input
              v-model="form.email"
              placeholder=""
              @blur="
                () => {
                  $refs.email.onFieldBlur();
                }
              "
            />
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-model-item ref="address" label="地址" prop="address">
            <a-input
              v-model="form.address"
              placeholder=""
              @blur="
                () => {
                  $refs.address.onFieldBlur();
                }
              "
            />
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-model-item ref="copyright" label="CopyRight" prop="copyright">
            <a-input
              v-model="form.copyright"
              placeholder=""
              @blur="
                () => {
                  $refs.copyright.onFieldBlur();
                }
              "
            />
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-model-item ref="icp" label="备案号" prop="icp">
            <a-input
              v-model="form.icp"
              placeholder=""
              @blur="
                () => {
                  $refs.icp.onFieldBlur();
                }
              "
            />
          </a-form-model-item>
        </a-col>
      </a-row>
      <!-- <a-row :gutter="24">
        <a-col :span="12">
          <a-form-model-item ref="web_footer" label="粤公网安备" prop="web_footer">
            <a-input
              v-model="form.web_footer"
              placeholder=""
              @blur="
                () => {
                  $refs.web_footer.onFieldBlur();
                }
              "
            />
          </a-form-model-item>
        </a-col>
      </a-row> -->
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-model-item ref="meta_search_title" label="搜索标题" prop="meta_search_title">
            <a-input
              v-model="form.meta_search_title"
              placeholder="针对搜索引擎设置的 搜索标题"
              @blur="
                () => {
                  $refs.meta_search_title.onFieldBlur();
                }
              "
            />
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-model-item ref="meta_author" label="网页作者" prop="meta_author">
            <a-input
              v-model="form.meta_author"
              placeholder="针对搜索引擎设置的 网页作者"
              @blur="
                () => {
                  $refs.meta_author.onFieldBlur();
                }
              "
            />
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-model-item ref="meta_keywords" label="网页关键词" prop="meta_keywords">
            <a-input
              v-model="form.meta_keywords"
              placeholder="针对搜索引擎设置的 关键词"
              @blur="
                () => {
                  $refs.meta_keywords.onFieldBlur();
                }
              "
            />
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-model-item ref="meta_copyright" label="网页声明" prop="meta_copyright">
            <a-input
              v-model="form.meta_copyright"
              placeholder="针对搜索引擎设置的 网页声明"
              @blur="
                () => {
                  $refs.meta_copyright.onFieldBlur();
                }
              "
            />
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-model-item ref="meta_description" label="网页描述" prop="meta_description">
            <a-textarea
              v-model="form.meta_description"
              placeholder="针对搜索引擎设置的 网页描述"
              :auto-size="{ minRows: 3, maxRows: 5 }"
            />
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
            <a-button
              type="primary"
              html-type="submit"
              size="large"
              v-action:web-config-edit
              @click="handleOnSubmit"
            >提交</a-button>
          </div>
        </a-col>
      </a-row>
    </a-form-model>
  </div>
</template>

<script>
import VueUeditorWrap from 'vue-ueditor-wrap'
import UploadImgComponent from './modules/UploadImg.component'
export default {
  data () {
    return {
      loadingImg: false,
      percentImg: 0,
      loadingImg2: false,
      percentImg2: 0,
      headers: {
        AccessToken: localStorage.getItem('token')
      },
      actionUrl: this.$baseUrl + 'admin/webConfig/upload_img' + (process.env.NODE_ENV === 'development' ? '?voucher=token' : '?voucher=session'),
      form: {
        web_title: '',
        qr_code: '',
        wx: '',
        weibo: '',
        tmall: '',
        tamll_url: '',
        jd: '',
        jd_url: '',
        url: '',
        douyin: '',
        about: '',
        copyright: '',
        web_logo: '',
        icp: '',
        meta_search_title: '',
        meta_author: '',
        meta_keywords: '',
        meta_copyright: '',
        meta_description: ''
      },
      rules: {
        web_title: [{ required: true, message: '请输入网站名称', trigger: 'blur' }],
        web_logo: [{ required: false, message: '请上传网站LOGO', trigger: 'blur' }],
        qr_code: [{ required: false, message: '', trigger: 'blur' }],
        web_footer: [{ required: false, message: '请输入网站底部内容', trigger: 'blur' }],
        meta_search_title: [{ required: false, message: '', trigger: 'blur' }],
        meta_author: [{ required: false, message: '', trigger: blur }],
        meta_keywords: [{ required: false, message: '', trigger: 'blur' }],
        meta_copyright: [{ required: false, message: '', trigger: 'blur' }],
        meta_description: [{ required: false, message: '', trigger: 'blur' }]
      },
      myConfig: {
        // 编辑器不自动被内容撑高
        autoHeightEnabled: false,
        // 初始容器高度
        initialFrameHeight: 540,
        // 初始容器宽度
        initialFrameWidth: '100%',
        // 上传文件接口（这个地址是我为了方便各位体验文件上传功能搭建的临时接口，请勿在生产环境使用！！！部署在国外的服务器，如果无法访问，请自备梯子）
        serverUrl: '/_UEditor_/php/controller.php',
        // UEditor 资源文件的存放路径，如果你使用的是 vue-cli 生成的项目，通常不需要设置该选项，vue-ueditor-wrap 会自动处理常见的情况，如果需要特殊配置，参考下方的常见问题2
        UEDITOR_HOME_URL: '/_UEditor_/'
      }
    }
  },
  name: 'WebConfig',
  components: {
    VueUeditorWrap,
    UploadImgComponent
  },
  props: [],
  mounted () {
  },
  created () {
    this.initConfig()
    this.$store.commit('setBreadcrumb', {
      breadcrumbData: [
        {
          key: '1',
          name: '首页',
          url: '#/main/base'
        },
        {
          key: '2',
          name: '基本配置',
          url: ''
        }
      ]
    })
    this.$root.$on('updateToken', (data) => {
      this.headers.AccessToken = data
    })
  },
  destroyed () {
    console.log('destroyed')
  },
  activated () {
    console.log('activated')
    this.tinymceFlag++
  },
  methods: {
    onContentChange (val) {
      console.log(val)
    },
    getContent (content) {
      this.form.web_footer = content
    },
    afterChange () {},
    initConfig () {
      this.$http
        .post('admin/webConfig', {})
        .then(res => {
          if (res.data.status === 'S') {
            this.form = res.data.data
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
    // 提交表单
    handleOnSubmit () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.$http
            .post('admin/webConfig/edit', this.form)
            .then(res => {
              if (res.data.status === 'S') {
                this.$message.success('保存成功')
                this.initConfig()
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
    }
  }
}
</script>

<style lang="less" scoped>
</style>
