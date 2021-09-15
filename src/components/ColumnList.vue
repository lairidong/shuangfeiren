<template>
  <div>
    <div class="tool-bar" style="margin-bottom: 16px">
      <a-row>
        <a-col :span="12">
          <div class="page-title">
            栏目管理
          </div>
        </a-col>
        <a-col :span="12">
          <div class="btn-box">
            <a-button icon="plus" type="primary" @click="addItem()" v-action:column-add>
              添加
            </a-button>
            <a-button icon="reload" type="link" @click="reload" :loading="tableLoading"></a-button>
          </div>
        </a-col>
      </a-row>
    </div>

    <div>
      <a-table
        v-if="data.length"
        :columns="columns"
        :data-source="data"
        :default-expand-all-rows="true"
        :pagination="false"
        row-key="column_id"
        size="small">
        <div slot="column_type" slot-scope="text">
          <a-tag color="orange" v-if="text.column_type==='column'">栏目</a-tag>
          <a-tag color="green" v-if="text.column_type==='menu'">菜单</a-tag>
          <a-tag color="blue" v-if="text.column_type==='button'">按钮</a-tag>
        </div>
        <div slot="status" slot-scope="text">
          <a-switch
            checkedChildren="正常"
            unCheckedChildren="禁用"
            :disabled="!$store.getters.hasPermission('column-edit')"
            :loading="text.loading"
            :checked="text.status=='1' ? true : false"
            @change="changeStatus(text)" />
        </div>
        <div class="action-box" slot="action" slot-scope="text">
          <a-tooltip placement="top" v-action:column-add>
            <template slot="title">
              <span>添加子栏目/子菜单/按钮</span>
            </template>
            <a-button type="primary" icon="plus" @click="addSubItem(text)"></a-button>
          </a-tooltip>
          <a-tooltip placement="top" v-action:column-edit>
            <template slot="title">
              <span>编辑</span>
            </template>
            <a-button type="primary" icon="edit" @click="editItem(text)"></a-button>
          </a-tooltip>
          <a-tooltip placement="top" v-action:column-del>
            <template slot="title">
              <span>删除</span>
            </template>
            <a-button type="danger" icon="rest" @click="deleteItem(text.column_id)"></a-button>
          </a-tooltip>
        </div>
      </a-table>
    </div>

    <a-drawer
      :title="action + '栏目'"
      :width="'60%'"
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
          <a-col :span="8">
            <a-form-model-item ref="column_type" label="类型" prop="column_type">
              <a-radio-group v-model="form.column_type" button-style="solid" @change="handleColumnTypeChange">
                <a-radio-button :value="'column'">
                  栏目
                </a-radio-button>
                <a-radio-button :value="'menu'">
                  菜单
                </a-radio-button>
                <a-radio-button :value="'button'">
                  按钮
                </a-radio-button>
              </a-radio-group>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item ref="ids" label="名称" prop="ids">
              <a-cascader
                change-on-select
                v-model="form.ids"
                @blur="
                  () => {
                    $refs.ids.onFieldBlur();
                  }
                "
                :options="cate"
                @change="handleCateChange"
                :placeholder="'请选择父级分类'"
                :fieldNames="{ label: 'column_name', value: 'column_id', children: 'children' }" />
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item ref="column_name" label="名称" prop="column_name">
              <a-input
                v-model="form.column_name"
                @blur="
                  () => {
                    $refs.column_name.onFieldBlur();
                  }
                "
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="8" v-if="form.column_type==='menu'">
            <a-form-model-item
              ref="url"
              label="URL"
              prop="url"
              :rules="{
                required: form.column_type==='menu',
                message: `${form.column_type==='menu' ? '请输入URL': ''}`,
                trigger: 'blur',
              }"
            >
              <a-input
                v-model="form.url"
                @blur="
                  () => {
                    $refs.url.onFieldBlur();
                  }
                "
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="8" v-if="form.column_type!=='column'">
            <a-form-model-item
              ref="code"
              label="标识码"
              prop="code"
              :rules="[{
                required: form.column_type!=='column',
                message: '请输入标识码',
                trigger: 'blur',
              },{ validator: checkCode, trigger: 'blur' }]"
            >
              <a-input
                v-model="form.code"
                @blur="
                  () => {
                    $refs.code.onFieldBlur();
                  }
                "
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
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
          <a-col :span="8" v-if="form.column_type==='column'">
            <a-form-model-item ref="icon" label="图标" prop="icon">
              <a-select
                v-model="form.icon"
              >
                <a-select-option v-for="item in iconData" :key="item" :value="item">
                  <icon-font :type="item" style="font-size:18px;" />
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" v-if="form.column_type==='menu'">
            <a-form-model-item
              ref="img_size"
              label="图片1尺寸"
              prop="img_size"
              :rules="{
                required: false,
                message: '',
                trigger: 'blur',
              }"
            >
              <a-input
                v-model="form.img_size"
                @blur="
                  () => {
                    $refs.img_size.onFieldBlur();
                  }
                "
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="8" v-if="form.column_type==='menu'">
            <a-form-model-item
              ref="img_size2"
              label="图片2尺寸"
              prop="img_size2"
              :rules="{
                required: false,
                message: '',
                trigger: 'blur',
              }"
            >
              <a-input
                v-model="form.img_size2"
                @blur="
                  () => {
                    $refs.img_size2.onFieldBlur();
                  }
                "
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="8" v-if="form.column_type==='menu'">
            <a-form-model-item
              ref="img_size3"
              label="图片3尺寸"
              prop="img_size3"
              :rules="{
                required: false,
                message: '',
                trigger: 'blur',
              }"
            >
              <a-input
                v-model="form.img_size3"
                @blur="
                  () => {
                    $refs.img_size3.onFieldBlur();
                  }
                "
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="8" v-if="form.column_type==='menu'">
            <a-form-model-item
              ref="img_size4"
              label="图片4尺寸"
              prop="img_size4"
              :rules="{
                required: false,
                message: '',
                trigger: 'blur',
              }"
            >
              <a-input
                v-model="form.img_size4"
                @blur="
                  () => {
                    $refs.img_size4.onFieldBlur();
                  }
                "
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="8" v-if="form.column_type==='menu'">
            <a-form-model-item
              ref="img_size5"
              label="图片5尺寸"
              prop="img_size5"
              :rules="{
                required: false,
                message: '',
                trigger: 'blur',
              }"
            >
              <a-input
                v-model="form.img_size5"
                @blur="
                  () => {
                    $refs.img_size5.onFieldBlur();
                  }
                "
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="8" v-if="form.column_type==='menu'">
            <a-form-model-item
              ref="img_size6"
              label="图片6尺寸"
              prop="img_size6"
              :rules="{
                required: false,
                message: '',
                trigger: 'blur',
              }"
            >
              <a-input
                v-model="form.img_size6"
                @blur="
                  () => {
                    $refs.img_size6.onFieldBlur();
                  }
                "
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="8" v-if="form.column_type==='menu'">
            <a-form-model-item
              ref="img_size7"
              label="图片7尺寸"
              prop="img_size7"
              :rules="{
                required: false,
                message: '',
                trigger: 'blur',
              }"
            >
              <a-input
                v-model="form.img_size7"
                @blur="
                  () => {
                    $refs.img_size7.onFieldBlur();
                  }
                "
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="8" v-if="form.column_type==='menu'">
            <a-form-model-item
              ref="img_size8"
              label="图片8尺寸"
              prop="img_size8"
              :rules="{
                required: false,
                message: '',
                trigger: 'blur',
              }"
            >
              <a-input
                v-model="form.img_size8"
                @blur="
                  () => {
                    $refs.img_size8.onFieldBlur();
                  }
                "
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="8" v-if="form.column_type==='menu'">
            <a-form-model-item
              ref="img_size9"
              label="图片9尺寸"
              prop="img_size9"
              :rules="{
                required: false,
                message: '',
                trigger: 'blur',
              }"
            >
              <a-input
                v-model="form.img_size9"
                @blur="
                  () => {
                    $refs.img_size9.onFieldBlur();
                  }
                "
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="8" v-if="form.column_type==='menu'">
            <a-form-model-item
              ref="img_title"
              label="图片1标题"
              prop="img_title"
              :rules="{
                required: false,
                message: '',
                trigger: 'blur',
              }"
            >
              <a-input
                v-model="form.img_title"
                @blur="
                  () => {
                    $refs.img_title.onFieldBlur();
                  }
                "
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="8" v-if="form.column_type==='menu'">
            <a-form-model-item
              ref="img_title2"
              label="图片2标题"
              prop="img_title2"
              :rules="{
                required: false,
                message: '',
                trigger: 'blur',
              }"
            >
              <a-input
                v-model="form.img_title2"
                @blur="
                  () => {
                    $refs.img_title2.onFieldBlur();
                  }
                "
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="8" v-if="form.column_type==='menu'">
            <a-form-model-item
              ref="img_title3"
              label="图片3标题"
              prop="img_title3"
              :rules="{
                required: false,
                message: '',
                trigger: 'blur',
              }"
            >
              <a-input
                v-model="form.img_title3"
                @blur="
                  () => {
                    $refs.img_title3.onFieldBlur();
                  }
                "
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="8" v-if="form.column_type==='menu'">
            <a-form-model-item
              ref="img_title4"
              label="图片4标题"
              prop="img_title4"
              :rules="{
                required: false,
                message: '',
                trigger: 'blur',
              }"
            >
              <a-input
                v-model="form.img_title4"
                @blur="
                  () => {
                    $refs.img_title4.onFieldBlur();
                  }
                "
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="8" v-if="form.column_type==='menu'">
            <a-form-model-item
              ref="img_title5"
              label="图片5标题"
              prop="img_title5"
              :rules="{
                required: false,
                message: '',
                trigger: 'blur',
              }"
            >
              <a-input
                v-model="form.img_title5"
                @blur="
                  () => {
                    $refs.img_title5.onFieldBlur();
                  }
                "
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="8" v-if="form.column_type==='menu'">
            <a-form-model-item
              ref="img_title6"
              label="图片6标题"
              prop="img_title6"
              :rules="{
                required: false,
                message: '',
                trigger: 'blur',
              }"
            >
              <a-input
                v-model="form.img_title6"
                @blur="
                  () => {
                    $refs.img_title6.onFieldBlur();
                  }
                "
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="8" v-if="form.column_type==='menu'">
            <a-form-model-item
              ref="img_title7"
              label="图片7标题"
              prop="img_title7"
              :rules="{
                required: false,
                message: '',
                trigger: 'blur',
              }"
            >
              <a-input
                v-model="form.img_title7"
                @blur="
                  () => {
                    $refs.img_title7.onFieldBlur();
                  }
                "
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="8" v-if="form.column_type==='menu'">
            <a-form-model-item
              ref="img_title8"
              label="图片8标题"
              prop="img_title8"
              :rules="{
                required: false,
                message: '',
                trigger: 'blur',
              }"
            >
              <a-input
                v-model="form.img_title8"
                @blur="
                  () => {
                    $refs.img_title8.onFieldBlur();
                  }
                "
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="8" v-if="form.column_type==='menu'">
            <a-form-model-item
              ref="img_title9"
              label="图片9标题"
              prop="img_title9"
              :rules="{
                required: false,
                message: '',
                trigger: 'blur',
              }"
            >
              <a-input
                v-model="form.img_title9"
                @blur="
                  () => {
                    $refs.img_title9.onFieldBlur();
                  }
                "
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="8" v-if="form.column_type==='menu'">
            <a-form-model-item ref="show_summary" label="是否显示简述" prop="show_summary">
              <a-radio-group v-model="form.show_summary">
                <a-radio :value="'1'">
                  是
                </a-radio>
                <a-radio :value="'0'">
                  否
                </a-radio>
              </a-radio-group>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" v-if="form.column_type==='menu'">
            <a-form-model-item ref="show_url" label="是否显示可填写url" prop="show_url">
              <a-radio-group v-model="form.show_url">
                <a-radio :value="'1'">
                  是
                </a-radio>
                <a-radio :value="'0'">
                  否
                </a-radio>
              </a-radio-group>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" v-if="form.column_type==='menu'">
            <a-form-model-item ref="show_cate" label="是否显示分类选择" prop="show_cate">
              <a-radio-group v-model="form.show_cate">
                <a-radio :value="'1'">
                  是
                </a-radio>
                <a-radio :value="'0'">
                  否
                </a-radio>
              </a-radio-group>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" v-if="form.column_type==='menu'">
            <a-form-model-item ref="show_is_home" label="是否显示推荐到首页" prop="show_is_home">
              <a-radio-group v-model="form.show_is_home">
                <a-radio :value="'1'">
                  是
                </a-radio>
                <a-radio :value="'0'">
                  否
                </a-radio>
              </a-radio-group>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" v-if="form.column_type==='menu'">
            <a-form-model-item ref="show_video" label="是否显示上传视频" prop="show_video">
              <a-radio-group v-model="form.show_video">
                <a-radio :value="'1'">
                  是
                </a-radio>
                <a-radio :value="'0'">
                  否
                </a-radio>
              </a-radio-group>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" v-if="form.column_type==='menu'">
            <a-form-model-item ref="show_sort" label="是否显示排序" prop="show_sort">
              <a-radio-group v-model="form.show_sort">
                <a-radio :value="'1'">
                  是
                </a-radio>
                <a-radio :value="'0'">
                  否
                </a-radio>
              </a-radio-group>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" v-if="form.column_type==='menu'">
            <a-form-model-item ref="show_img_in_list" label="是否在列表显示封面图" prop="show_img_in_list">
              <a-radio-group v-model="form.show_img_in_list">
                <a-radio :value="'1'">
                  是
                </a-radio>
                <a-radio :value="'0'">
                  否
                </a-radio>
              </a-radio-group>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" v-if="form.column_type==='menu'">
            <a-form-model-item ref="show_search" label="是否显示搜索" prop="show_search">
              <a-radio-group v-model="form.show_search">
                <a-radio :value="'1'">
                  是
                </a-radio>
                <a-radio :value="'0'">
                  否
                </a-radio>
              </a-radio-group>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" v-if="form.column_type==='menu'">
            <a-form-model-item ref="show_seo" label="是否显示SEO" prop="show_seo">
              <a-radio-group v-model="form.show_seo">
                <a-radio :value="'1'">
                  是
                </a-radio>
                <a-radio :value="'0'">
                  否
                </a-radio>
              </a-radio-group>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" v-if="form.column_type==='menu'">
            <a-form-model-item ref="show_rich_text" label="是否显示富文本" prop="show_rich_text">
              <a-radio-group v-model="form.show_rich_text">
                <a-radio :value="'1'">
                  是
                </a-radio>
                <a-radio :value="'0'">
                  否
                </a-radio>
              </a-radio-group>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" v-if="form.column_type==='menu'">
            <a-form-model-item ref="show_sub_title" label="是否显示副标题" prop="show_sub_title">
              <a-radio-group v-model="form.show_sub_title">
                <a-radio :value="'1'">
                  是
                </a-radio>
                <a-radio :value="'0'">
                  否
                </a-radio>
              </a-radio-group>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" v-if="form.column_type==='menu'">
            <a-form-model-item ref="show_recommend" label="是否推荐" prop="show_recommend">
              <a-radio-group v-model="form.show_recommend">
                <a-radio :value="'1'">
                  是
                </a-radio>
                <a-radio :value="'0'">
                  否
                </a-radio>
              </a-radio-group>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item ref="status" label="状态" prop="status">
              <a-radio-group v-model="form.status">
                <a-radio :value="'1'">
                  启用
                </a-radio>
                <a-radio :value="'0'">
                  停用
                </a-radio>
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
import { Icon } from 'ant-design-vue'
const IconFont = Icon.createFromIconfontCN({
  scriptUrl: './js/iconfont.js'
})
const columns = [
    { title: '名称', dataIndex: 'column_name', key: 'column_name' },
    { title: '标识码', dataIndex: 'code', key: 'code' },
    { title: 'URL', dataIndex: 'url', key: 'url', width: '30%' },
    { title: '类型', dataIndex: '', key: 'column_type', scopedSlots: { customRender: 'column_type' } },
    { title: '排序号', dataIndex: 'sort', key: 'sort' },
    { title: '状态', dataIndex: '', key: 'a', scopedSlots: { customRender: 'status' }, width: 90 },
    { title: '操作', dataIndex: '', key: 'x', scopedSlots: { customRender: 'action' }, width: 150 }
  ]
export default {
  components: {
    IconFont
  },
    data () {
      // const checkName = (rule, value, callback) => {
      //   if (!value) {
      //     return callback()
      //   } else {
      //     this.$http
      //       .post('admin/column/checkName', {
      //         column_name: this.form.column_name,
      //         column_id: this.form.column_id
      //       })
      //       .then(res => {
      //         if (res.data.msg === '') {
      //           callback()
      //         } else {
      //           callback(new Error(res.data.msg))
      //         }
      //       })
      //       .catch(error => {
      //         console.log(error)
      //       })
      //   }
      // }
      const checkCode = (rule, value, callback) => {
        if (!value) {
          return callback()
        } else {
          this.$http
            .post('admin/column/checkCode', {
              code: this.form.code,
              column_id: this.form.column_id
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
      checkCode,
      pageSize: 100,
      currentPage: 1,
      total: 0,
      data: [],
      cate: [{
        column_id: 0,
        column_name: '顶级分类',
        children: null
      }],
      tableLoading: false,
      action: '',
      visible: false,
      labelCol: { },
      wrapperCol: { },
      form: {
        column_id: null,
        column_name: '',
        parent_id: 0,
        ids: [0],
        code: '',
        icon: '',
        sort: 99,
        status: '1',
        img_size: '',
        img_size2: '',
        img_size3: '',
        img_size4: '',
        img_size5: '',
        img_size6: '',
        img_size7: '',
        img_size8: '',
        img_size9: '',
        img_title: '',
        img_title2: '',
        img_title3: '',
        img_title4: '',
        img_title5: '',
        img_title6: '',
        img_title7: '',
        img_title8: '',
        img_title9: '',
        show_summary: '1',
        show_url: '1',
        show_is_home: '1',
        show_cate: '0',
        show_video: '0',
        show_sort: '0',
        show_img_in_list: '0',
        show_recommend: '0',
        show_search: '0',
        show_seo: '0',
        show_rich_text: '0',
        show_sub_title: '0'
      },
      rules: {
        column_type: [{ required: true, message: '请选择类型', trigger: 'change' }],
        column_name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
          // { validator: checkName, trigger: 'blur' }
        ],
        // url: [
        //   // { required: true, message: '请输入URL', trigger: 'blur' }
        //   { message: '请输入URL', trigger: 'blur' }
        // ],
        icon: [
          { required: true, message: '请选择图标', trigger: 'change' }
        ],
        ids: [
          { required: true, message: '请选择上级分类', trigger: 'blur' }
        ],
        // code: [
        //   // { required: true, message: '请输入标识码', trigger: 'blur' },
        //   { message: '请输入标识码', trigger: 'blur' },
        //   { validator: checkCode, trigger: 'blur' }
        // ],
        sort: [{ required: true, message: '请输入排序号', trigger: blur }],
        status: [{ required: true, message: '请选择状态', trigger: 'change' }]
      },
      iconData: [
        'icon-tel', 'icon-earth', 'icon-flash', 'icon-contact', 'icon-info', 'icon-mail', 'icon-message', 'icon-menu', 'icon-links', 'icon-case', 'icon-banner', 'icon-about-us', 'icon-group', 'icon-data', 'icon-copyright', 'icon-department', 'icon-home', 'icon-admin', 'icon-config', 'icon-page', 'icon-product', 'icon-order', 'icon-company', 'icon-permission', 'icon-itembank', 'icon-role'
      ]
    }
  },
  name: 'ColumnList',
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
          name: '菜单管理',
          url: ''
        }
      ]
    })
  },
  watch: {
    // form: {
    //   handler (newValue, oldValue) {
    //     if (newValue.column_type === 'menu') {
    //       this.rules.url[0].required = true
    //       this.rules.parent_id[0].required = true
    //       this.rules.parent_id[0].message = '请选择父级目录'
    //     } else {
    //       this.rules.url[0].required = false
    //       if (newValue.column_type === 'button') {
    //         this.rules.parent_id[0].required = true
    //         this.rules.parent_id[0].message = '请选择父级菜单'
    //       } else {
    //         this.rules.parent_id[0].required = false
    //       }
    //     }
    //   },
    //   deep: true
    // }
  },
  methods: {
    handleCateChange (value) {
      if (value[value.length - 1]) {
        this.form.parent_id = value[value.length - 1]
      } else {
        this.form.parent_id = ''
      }
    },
    getList (retry) {
      if (retry) {
        setTimeout(() => {
          this.getList(true)
        }, 2000)
      }
      this.tableLoading = true
      this.$http
        .post('admin/column', {
          page_size: this.pageSize,
          current_page: this.currentPage
        })
        .then(res => {
          this.defaultExpandedRowKeys = []
          if (res.data.status === 'S') {
            this.total = res.data.total
            this.data = res.data.data
            this.data.forEach(item => {
              item.ids = JSON.parse(item.ids)
              if (item.children.length === 0) {
                item.children = null
              } else {
                item.children.forEach(item2 => {
                  item2.ids = JSON.parse(item2.ids)
                  if (item2.children.length === 0) {
                    item2.children = null
                  } else {
                    item2.children.forEach(item3 => {
                      // console.log(item3)
                      item3.ids = JSON.parse(item3.ids)
                      if (item3.children.length === 0) {
                        item3.children = null
                      }
                    })
                  }
                })
              }
            })
            this.cate[0].children = (this.data)
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
    onClose () {
      this.visible = false
    },
    addSubItem (i) {
      console.log(i)
      const item = { ...i }
      item.ids.push(item.column_id)
      this.form = {
        column_id: null,
        column_name: '',
        column_module: 'article',
        column_type: item.column_type === 'column' ? 'menu' : 'button',
        parent_id: item.parent_id,
        ids: item.ids,
        url: '',
        permission_code: '',
        icon: '',
        sort: 99,
        status: '1',
        img_size: '',
        img_size2: '',
        img_size3: '',
        img_size4: '',
        img_size5: '',
        img_size6: '',
        img_size7: '',
        img_size8: '',
        img_size9: '',
        img_title: '',
        img_title2: '',
        img_title3: '',
        img_title4: '',
        img_title5: '',
        img_title6: '',
        img_title7: '',
        img_title8: '',
        img_title9: '',
        show_summary: '1',
        show_url: '1',
        show_is_home: '1',
        show_cate: '1',
        show_video: '0',
        show_sort: '0',
        show_img_in_list: '0',
        show_recommend: '0',
        show_search: '0',
        show_seo: '0',
        show_rich_text: '0',
        show_sub_title: '0'
      }
      this.visible = true
      this.action = '新增'
    },
    addItem () {
      this.form = {
        column_id: null,
        column_name: '',
        column_type: 'column',
        parent_id: 0,
        ids: [0],
        url: '',
        code: '',
        icon: '',
        sort: 99,
        status: '1',
        img_size: '',
        img_size2: '',
        img_size3: '',
        img_size4: '',
        img_size5: '',
        img_size6: '',
        img_size7: '',
        img_size8: '',
        img_size9: '',
        img_title: '',
        img_title2: '',
        img_title3: '',
        img_title4: '',
        img_title5: '',
        img_title6: '',
        img_title7: '',
        img_title8: '',
        img_title9: '',
        show_summary: '1',
        show_url: '1',
        show_is_home: '1',
        show_cate: '1',
        show_video: '0',
        show_sort: '0',
        show_img_in_list: '0',
        show_recommend: '0',
        show_search: '0',
        show_seo: '0',
        show_rich_text: '0',
        show_sub_title: '0'
      }
      this.visible = true
      this.action = '新增'
    },
    editItem (item) {
      if (typeof item.ids === 'string') {
        item.ids = JSON.parse(item.ids)
      }
      this.form = {
        column_id: item.column_id,
        column_name: item.column_name,
        column_type: item.column_type,
        parent_id: item.parent_id,
        ids: item.ids,
        url: item.url,
        code: item.code,
        icon: item.icon,
        sort: item.sort,
        status: item.status ? item.status.toString() : '0',
        img_size: item.img_size,
        img_size2: item.img_size2,
        img_size3: item.img_size3,
        img_size4: item.img_size4,
        img_size5: item.img_size5,
        img_size6: item.img_size6,
        img_size7: item.img_size7,
        img_size8: item.img_size8,
        img_size9: item.img_size9,
        img_title: item.img_title,
        img_title2: item.img_title2,
        img_title3: item.img_title3,
        img_title4: item.img_title4,
        img_title5: item.img_title5,
        img_title6: item.img_title6,
        img_title7: item.img_title7,
        img_title8: item.img_title8,
        img_title9: item.img_title9,
        show_summary: item.show_summary ? item.show_summary.toString() : '0',
        show_url: item.show_url ? item.show_url.toString() : '0',
        show_is_home: item.show_is_home ? item.show_is_home.toString() : '0',
        show_cate: item.show_cate ? item.show_cate.toString() : '0',
        show_video: item.show_video ? item.show_video.toString() : '0',
        show_sort: item.show_sort ? item.show_sort.toString() : '0',
        show_img_in_list: item.show_img_in_list ? item.show_img_in_list.toString() : '0',
        show_recommend: item.show_recommend ? item.show_recommend.toString() : '0',
        show_search: item.show_search ? item.show_search.toString() : '0',
        show_seo: item.show_seo ? item.show_seo.toString() : '0',
        show_rich_text: item.show_rich_text ? item.show_rich_text.toString() : '0',
        show_sub_title: item.show_sub_title ? item.show_sub_title.toString() : '0'
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
            .post('admin/column/del', {
              column_id: id
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
    handleColumnTypeChange (e) {
      this.$refs.ruleForm.clearValidate()
    },
    handleOnSubmit () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          const params = {
            column_name: this.form.column_name,
            column_type: this.form.column_type,
            parent_id: this.form.ids[this.form.ids.length - 1],
            ids: JSON.stringify(this.form.ids),
            url: this.form.url,
            sort: this.form.sort,
            code: this.form.code,
            icon: this.form.icon,
            status: this.form.status,
            img_size: this.form.img_size,
            img_size2: this.form.img_size2,
            img_size3: this.form.img_size3,
            img_size4: this.form.img_size4,
            img_size5: this.form.img_size5,
            img_size6: this.form.img_size6,
            img_size7: this.form.img_size7,
            img_size8: this.form.img_size8,
            img_size9: this.form.img_size9,
            img_title: this.form.img_title,
            img_title2: this.form.img_title2,
            img_title3: this.form.img_title3,
            img_title4: this.form.img_title4,
            img_title5: this.form.img_title5,
            img_title6: this.form.img_title6,
            img_title7: this.form.img_title7,
            img_title8: this.form.img_title8,
            img_title9: this.form.img_title9,
            show_summary: this.form.show_summary,
            show_url: this.form.show_url,
            show_is_home: this.form.show_is_home,
            show_cate: this.form.show_cate,
            show_video: this.form.show_video,
            show_sort: this.form.show_sort,
            show_img_in_list: this.form.show_img_in_list,
            show_recommend: this.form.show_recommend,
            show_search: this.form.show_search,
            show_seo: this.form.show_seo,
            show_rich_text: this.form.show_rich_text,
            show_sub_title: this.form.show_sub_title
          }
          if (this.form.column_id !== '') {
            params.column_id = this.form.column_id
          }
          this.$http
            .post('admin/column/edit', params)
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
    // 修改状态
    changeStatus (item) {
      item.loading = true
      this.$http
        .post('admin/column/modifyStatus', {
          column_id: item.column_id,
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

<style lang="scss" scoped>
</style>
