<template>
  <div>
    <a-tabs defaultActiveKey="1">
      <a-tab-pane key="1" tab="基本信息">
        <a-form-model
          ref="ruleForm"
          layout="vertical"
          :model="page"
          :rules="rules"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-row :gutter="16">
            <a-col :span="6">
              <a-form-item label="Banner图" :extra="imgSize">
                <a-upload
                  name="files[]"
                  list-type="picture-card"
                  class="avatar-uploader"
                  :show-upload-list="false"
                  :action="actionUrl"
                  :before-upload="beforeUpload"
                  :headers="headers"
                  @change="handleChange"
                >
                  <img v-if="imageUrl&&!loadingImg" :src="imageUrl" class="flash-img" alt="上传图片" />
                  <div v-if="loadingImg">
                    <a-icon :type="'loading'" />
                    <div class="ant-upload-text">
                      {{ percentImg }}%
                    </div>
                  </div>
                  <div v-if="!imageUrl&&!loadingImg">
                    <a-icon :type="'plus'" />
                    <div class="ant-upload-text">
                      上传
                    </div>
                  </div>
                </a-upload>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="产品概况图片" :extra="imgSize2">
                <a-upload
                  name="files[]"
                  list-type="picture-card"
                  class="avatar-uploader"
                  :show-upload-list="false"
                  :action="actionUrl"
                  :before-upload="beforeUpload"
                  :headers="headers"
                  @change="handleChange2"
                >
                  <img v-if="imageUrl2&&!loadingImg2" :src="imageUrl2" class="flash-img" alt="上传图片" />
                  <div v-if="loadingImg2">
                    <a-icon :type="'loading'" />
                    <div class="ant-upload-text">
                      {{ percentImg2 }}%
                    </div>
                  </div>
                  <div v-if="!imageUrl2&&!loadingImg2">
                    <a-icon :type="'plus'" />
                    <div class="ant-upload-text">
                      上传
                    </div>
                  </div>
                </a-upload>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :span="24">
              <a-form-model-item ref="page_content" label="产品概况" prop="page_content">
                <a-textarea
                  v-model="page.page_content"
                  :auto-size="{ minRows: 5, maxRows: 5 }"
                  @blur="
                    () => {
                      $refs.page_content.onFieldBlur();
                    }
                  "
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
                <a-button :style="{marginRight: '8px'}" size="large" @click="onClose">取消</a-button>
                <a-button type="primary" html-type="submit" size="large" @click="handleOnSubmit">提交</a-button>
              </div>
            </a-col>
          </a-row>
        </a-form-model>
      </a-tab-pane>
      <a-tab-pane key="4" tab="产品功能">
        <div class="tool-bar" style="margin-bottom: 16px">
          <a-row>
            <a-col :span="24">
              <div class="btn-box">
                <a-button icon="plus" type="primary" @click="addFunctionItem()" v-action:solution-add>添加</a-button>
              </div>
            </a-col>
          </a-row>
        </div>
        <a-table
          :columns="functionColumns"
          :data-source="functionData"
          :pagination="false"
          row-key="function_id"
          size="small"
        >
          <div slot="img" slot-scope="text">
            <img :src="text.img" style="max-width: 80px; max-height: 40px; cursor: pointer;" alt="">
          </div>
          <div slot="sort" slot-scope="text">
            <div style="border-bottom: 1px solid #ddd; padding: 5px 0; text-indent: 12px;" v-if="!text.editable || !$store.getters.hasPermission('intelligent-lamppost-edit')" @click="showEdit(text)">{{ text.sort }}</div>
            <div v-else>
              <a-input class="input-sort" :id="`input_function_${text.function_id}`" v-model="text.sort" @blur="text.oldSort===text.sort?text.editable=false:text.editable=true">
                <a-button class="btn-sort" slot="addonAfter" size="small" @click="updateSort(text)">
                  <a-icon type="save" />
                </a-button>
              </a-input>
            </div>
          </div>
          <div class="action-box" slot="action" slot-scope="text">
            <a-tooltip placement="top" v-action:intelligent-lamppost-edit>
              <template slot="title">
                <span>修改</span>
              </template>
              <a-button type="primary" icon="edit" @click="editFunction(text)"></a-button>
            </a-tooltip>
            <a-tooltip placement="top" v-action:intelligent-lamppost-edit>
              <template slot="title">
                <span>删除</span>
              </template>
              <a-button type="danger" icon="rest" @click="deleteFunction(text.function_id)"></a-button>
            </a-tooltip>
          </div>
        </a-table>
        <a-row :gutter="16">
          <a-col :span="24">
            <div
              :style="{
                width: '100%',
                borderTop: '1px solid #e9e9e9',
                marginTop: '24px',
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
      </a-tab-pane>
      <a-tab-pane key="2" tab="核心优势">
        <div class="tool-bar" style="margin-bottom: 16px">
          <a-row>
            <a-col :span="24">
              <div class="btn-box">
                <a-button icon="plus" type="primary" @click="addAdvantageItem()" v-action:intelligent-lamppost-edit>添加</a-button>
              </div>
            </a-col>
          </a-row>
        </div>
        <a-table
          :columns="advantageColumns"
          :data-source="advantageData"
          :pagination="false"
          row-key="advantage_id"
          size="small"
        >
          <div slot="sort" slot-scope="text">
            <div style="border-bottom: 1px solid #ddd; padding: 5px 0; text-indent: 12px;" v-if="!text.editable || !$store.getters.hasPermission('intelligent-lamppost-edit')" @click="showEdit(text)">{{ text.sort }}</div>
            <div v-else>
              <a-input class="input-sort" :id="`input_advantage_${text.advantage_id}`" v-model="text.sort" @blur="text.oldSort===text.sort?text.editable=false:text.editable=true">
                <a-button class="btn-sort" slot="addonAfter" size="small" @click="updateSort(text)">
                  <a-icon type="save" />
                </a-button>
              </a-input>
            </div>
          </div>
          <div class="action-box" slot="action" slot-scope="text">
            <a-tooltip placement="top" v-action:intelligent-lamppost-edit>
              <template slot="title">
                <span>修改</span>
              </template>
              <a-button type="primary" icon="edit" @click="editAdvantage(text)"></a-button>
            </a-tooltip>
            <a-tooltip placement="top" v-action:intelligent-lamppost-edit>
              <template slot="title">
                <span>删除</span>
              </template>
              <a-button type="danger" icon="rest" @click="deleteAdvantage(text.advantage_id)"></a-button>
            </a-tooltip>
          </div>
        </a-table>
        <a-row :gutter="16">
          <a-col :span="24">
            <div
              :style="{
                width: '100%',
                borderTop: '1px solid #e9e9e9',
                marginTop: '24px',
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
      </a-tab-pane>
      <a-tab-pane key="3" tab="商业案例">
        <div class="tool-bar" style="margin-bottom: 16px">
          <a-row>
            <a-col :span="24">
              <div class="btn-box">
                <a-button icon="plus" type="primary" @click="addCaseItem()" v-action:intelligent-lamppost-edit>添加</a-button>
              </div>
            </a-col>
          </a-row>
        </div>
        <a-table
          :columns="caseColumns"
          :data-source="caseData"
          :pagination="false"
          row-key="case_id"
          size="small"
        >
          <div slot="img" slot-scope="text">
            <img :src="text.img" style="max-width: 80px; max-height: 40px; cursor: pointer;" alt="">
          </div>
          <div slot="sort" slot-scope="text">
            <div style="border-bottom: 1px solid #ddd; padding: 5px 0; text-indent: 12px;" v-if="!text.editable || !$store.getters.hasPermission('intelligent-lamppost-edit')" @click="showEdit(text)">{{ text.sort }}</div>
            <div v-else>
              <a-input class="input-sort" :id="`input_case_${text.case_id}`" v-model="text.sort" @blur="text.oldSort===text.sort?text.editable=false:text.editable=true">
                <a-button class="btn-sort" slot="addonAfter" size="small" @click="updateSort(text)">
                  <a-icon type="save" />
                </a-button>
              </a-input>
            </div>
          </div>
          <div class="action-box" slot="action" slot-scope="text">
            <a-tooltip placement="top" v-action:intelligent-lamppost-edit>
              <template slot="title">
                <span>修改</span>
              </template>
              <a-button type="primary" icon="edit" @click="editCase(text)"></a-button>
            </a-tooltip>
            <a-tooltip placement="top" v-action:intelligent-lamppost-edit>
              <template slot="title">
                <span>删除</span>
              </template>
              <a-button type="danger" icon="rest" @click="deleteCase(text.case_id)"></a-button>
            </a-tooltip>
          </div>
        </a-table>
        <a-row :gutter="16">
          <a-col :span="24">
            <div
              :style="{
                width: '100%',
                borderTop: '1px solid #e9e9e9',
                marginTop: '24px',
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
      </a-tab-pane>
    </a-tabs>

    <a-drawer
      :title="action + '产品功能'"
      :width="'50%'"
      @close="visibleFunction=false"
      :visible="visibleFunction"
      :bodyStyle="{paddingBottom: '80px'}"
    >
      <a-form-model
        ref="functionForm"
        layout="vertical"
        :model="formFunction"
        :rules="rulesAdvantage"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-model-item ref="title" label="标题" prop="title">
              <a-input
                v-model="formFunction.title"
                @blur="
                  () => {
                    $refs.title.onFieldBlur();
                  }
                "
              />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="24">
            <a-form-model-item ref="content" label="内容" prop="content">
              <a-textarea
                v-model="formFunction.content"
                :auto-size="{ minRows: 5, maxRows: 5 }"
                @blur="
                  () => {
                    $refs.content.onFieldBlur();
                  }
                "
              />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-model-item ref="sort" label="排序号" prop="sort" extra="数字越小越靠前">
              <a-input-number
                v-model="formFunction.sort"
                @blur="
                  () => {
                    $refs.sort.onFieldBlur();
                  }
                "
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
              <a-button :style="{marginRight: '8px'}" size="large" @click="visibleFunction=false">取消</a-button>
              <a-button type="primary" html-type="submit" size="large" @click="handleOnSubmitFunction">提交</a-button>
            </div>
          </a-col>
        </a-row>
      </a-form-model>
    </a-drawer>

    <a-drawer
      :title="action + '方案优势'"
      :width="'50%'"
      @close="visibleAdvantage=false"
      :visible="visibleAdvantage"
      :bodyStyle="{paddingBottom: '80px'}"
    >
      <a-form-model
        ref="advantageForm"
        layout="vertical"
        :model="formAdvantage"
        :rules="rulesAdvantage"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-model-item ref="title" label="标题" prop="title">
              <a-input
                v-model="formAdvantage.title"
                @blur="
                  () => {
                    $refs.title.onFieldBlur();
                  }
                "
              />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="24">
            <a-form-model-item ref="content" label="内容" prop="content">
              <a-textarea
                v-model="formAdvantage.content"
                :auto-size="{ minRows: 5, maxRows: 5 }"
                @blur="
                  () => {
                    $refs.content.onFieldBlur();
                  }
                "
              />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-model-item ref="sort" label="排序号" prop="sort" extra="数字越小越靠前">
              <a-input-number
                v-model="formAdvantage.sort"
                @blur="
                  () => {
                    $refs.sort.onFieldBlur();
                  }
                "
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
              <a-button :style="{marginRight: '8px'}" size="large" @click="visibleAdvantage=false">取消</a-button>
              <a-button type="primary" html-type="submit" size="large" @click="handleOnSubmitAdvantage">提交</a-button>
            </div>
          </a-col>
        </a-row>
      </a-form-model>
    </a-drawer>

    <a-drawer
      :title="action + '商业案例'"
      :width="'50%'"
      @close="visibleCase=false"
      :visible="visibleCase"
      :bodyStyle="{paddingBottom: '80px'}"
    >
      <a-form-model
        ref="caseForm"
        layout="vertical"
        :model="formCase"
        :rules="rulesAdvantage"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-model-item ref="title" label="标题" prop="title">
              <a-input
                v-model="formCase.title"
                @blur="
                  () => {
                    $refs.title.onFieldBlur();
                  }
                "
              />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="24" style="display: none;">
          <a-col :span="24">
            <a-form-model-item ref="content" label="内容" prop="content">
              <a-textarea
                v-model="formCase.content"
                :auto-size="{ minRows: 5, maxRows: 5 }"
                @blur="
                  () => {
                    $refs.content.onFieldBlur();
                  }
                "
              />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="24">
            <a-form-item label="上传图片" :extra="imgSize3">
              <a-upload
                name="files[]"
                list-type="picture-card"
                class="avatar-uploader"
                :show-upload-list="false"
                :action="actionUrl"
                :before-upload="beforeUpload"
                :headers="headers"
                @change="handleChange3"
              >
                <img v-if="imageUrl3&&!loadingImg3" :src="imageUrl3" class="flash-img" alt="上传图片" />
                <div v-if="loadingImg3">
                  <a-icon :type="'loading'" />
                  <div class="ant-upload-text">
                    {{ percentImg3 }}%
                  </div>
                </div>
                <div v-if="!imageUrl3&&!loadingImg3">
                  <a-icon :type="'plus'" />
                  <div class="ant-upload-text">
                    上传
                  </div>
                </div>
              </a-upload>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-model-item ref="sort" label="排序号" prop="sort" extra="数字越小越靠前">
              <a-input-number
                v-model="formCase.sort"
                @blur="
                  () => {
                    $refs.sort.onFieldBlur();
                  }
                "
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
              <a-button :style="{marginRight: '8px'}" size="large" @click="visibleCase=false">取消</a-button>
              <a-button type="primary" html-type="submit" size="large" @click="handleOnSubmitCase">提交</a-button>
            </div>
          </a-col>
        </a-row>
      </a-form-model>
    </a-drawer>
  </div>
</template>

<script>
const functionColumns = [
  { title: '标题', dataIndex: 'title', key: 'title' },
  { title: '内容', dataIndex: 'content', key: 'content' },
  { title: '排序号', dataIndex: '', key: 'sort', scopedSlots: { customRender: 'sort' }, width: 100 },
  {
    title: '操作',
    dataIndex: '',
    key: 'x',
    scopedSlots: { customRender: 'action' },
    width: 150
  }
]
const advantageColumns = [
  { title: '标题', dataIndex: 'title', key: 'title' },
  { title: '内容', dataIndex: 'content', key: 'content' },
  { title: '排序号', dataIndex: '', key: 'sort', scopedSlots: { customRender: 'sort' }, width: 100 },
  {
    title: '操作',
    dataIndex: '',
    key: 'x',
    scopedSlots: { customRender: 'action' },
    width: 150
  }
]
const caseColumns = [
  { title: '图片', dataIndex: '', key: 'img', scopedSlots: { customRender: 'img' }, width: 100 },
  { title: '标题', dataIndex: 'title', key: 'title' },
  // { title: '内容', dataIndex: 'content', key: 'content' },
  { title: '排序号', dataIndex: '', key: 'sort', scopedSlots: { customRender: 'sort' }, width: 100 },
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
      functionColumns,
      advantageColumns,
      caseColumns,
      data: [],
      parent_column_name: '',
      column_name: '',
      functionData: [],
      advantageData: [],
      caseData: [],
      labelCol: { },
      wrapperCol: { },
      tableLoading: false,
      tableLoading2: false,
      tableLoading3: false,
      visibleFunction: false,
      visibleAdvantage: false,
      visibleCase: false,
      page: {
        page_title: '',
        page_content: '',
        img: ''
      },
      formFunction: {
        function_id: '',
        title: '',
        content: '',
        sort: 99,
        editable: false
      },
      formAdvantage: {
        advantage_id: '',
        title: '',
        content: '',
        sort: 99,
        editable: false
      },
      formCase: {
        case_id: '',
        title: '',
        content: '',
        img: '',
        sort: 99,
        editable: false
      },
      action: '',
      visible: false,
      visibleTeam: false,
      imgSize: '',
      imgSize2: '',
      imgSize3: '',
      loadingImg: false,
      percentImg: 0,
      imageUrl: '',
      loadingImg2: false,
      percentImg2: 0,
      imageUrl2: '',
      loadingImg3: false,
      percentImg3: 0,
      imageUrl3: '',
      headers: {
        AccessToken: localStorage.getItem('token')
      },
      actionUrl: this.$baseUrl + 'admin/article/upload_img' + (process.env.NODE_ENV === 'development' ? '?voucher=token' : '?voucher=session'),
      rules: {
        page_content: [{ required: true, message: '请输入产品概况', trigger: 'blur' }],
        attribute1: [{ required: true, message: '请输入核心优势', trigger: 'blur' }],
        attribute2: [{ required: true, message: '请输入商业案例', trigger: 'blur' }]
      },
      rulesAdvantage: {
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        content: [{ required: false, message: '请输入内容', trigger: 'blur' }],
        sort: [{ required: true, message: '请输入排序号', trigger: 'blur' }]
      }
    }
  },
  name: 'Chip',
  created () {
    this.getContent()
    this.setImgSizeText()
    this.getColumnByCode()
    this.$root.$on('updateToken', (data) => {
      this.headers.AccessToken = data
    })
  },
  methods: {
    // 产品功能 ===================================
    addFunctionItem () {
      this.formFunction = {
        function_id: '',
        title: '',
        content: '',
        sort: 99,
        editable: false
      }
      this.visibleFunction = true
    },
    editFunction (item) {
      this.formFunction = {
        function_id: item.function_id,
        title: item.title,
        content: item.content,
        sort: item.sort,
        editable: item.editable
      }
      this.visibleFunction = true
    },
    deleteFunction (id) {
      this.functionData.forEach((item, index) => {
        if (item.function_id === id) {
          this.functionData.splice(index, 1)
        }
      })
    },
    handleOnSubmitFunction () {
      this.$refs.functionForm.validate(valid => {
        if (valid) {
          if (this.formFunction.function_id === '') {
            this.formFunction.function_id = 1
            if (this.functionData.length === 0) {
              this.formFunction.function_id = 1
            } else {
              let functionId = 1
              this.functionData.forEach(item => {
                if (item.function_id > functionId) {
                  functionId = item.function_id
                }
              })
              this.formFunction.function_id = functionId + 1
            }
            this.functionData.push({ ...this.formFunction })
          } else {
            this.functionData.forEach(item => {
              if (item.function_id === this.formFunction.function_id) {
                item.title = this.formFunction.title
                item.content = this.formFunction.content
                item.sort = this.formFunction.sort
              }
            })
          }

          this.visibleFunction = false
          this.formFunction = {
            function_id: '',
            title: '',
            content: '',
            sort: 99,
            editable: false
          }
        }
      })
    },
    // 核心优势 ===================================
    addAdvantageItem () {
      this.formAdvantage = {
        advantage_id: '',
        title: '',
        content: '',
        sort: 99,
        editable: false
      }
      this.visibleAdvantage = true
    },
    editAdvantage (item) {
      this.formAdvantage = {
        advantage_id: item.advantage_id,
        title: item.title,
        content: item.content,
        sort: item.sort,
        editable: item.editable
      }
      this.visibleAdvantage = true
    },
    deleteAdvantage (id) {
      this.advantageData.forEach((item, index) => {
        if (item.advantage_id === id) {
          this.advantageData.splice(index, 1)
        }
      })
    },
    handleOnSubmitAdvantage () {
      this.$refs.advantageForm.validate(valid => {
        if (valid) {
          if (this.formAdvantage.advantage_id === '') {
            if (this.advantageData.length === 0) {
              this.formAdvantage.advantage_id = 1
            } else {
              let advantageId = 1
              this.advantageData.forEach(item => {
                if (item.advantage_id > advantageId) {
                  advantageId = item.advantage_id
                }
              })
              this.formAdvantage.advantage_id = advantageId + 1
            }
            this.advantageData.push({ ...this.formAdvantage })
          } else {
            this.advantageData.forEach(item => {
              if (item.advantage_id === this.formAdvantage.advantage_id) {
                item.title = this.formAdvantage.title
                item.content = this.formAdvantage.content
                item.sort = this.formAdvantage.sort
              }
            })
          }

          this.visibleAdvantage = false
          this.formAdvantage = {
            advantage_id: '',
            title: '',
            content: '',
            sort: 99,
            editable: false
          }
        }
      })
    },

    // 商业案例 ===================================
    addCaseItem () {
      this.formCase = {
        case_id: '',
        title: '',
        content: '',
        img: '',
        sort: 99,
        editable: false
      }
      this.imageUrl3 = ''
      this.visibleCase = true
    },
    editCase (item) {
      this.formCase = {
        case_id: item.case_id,
        title: item.title,
        content: item.content,
        img: item.img,
        sort: item.sort,
        editable: item.editable
      }
      this.imageUrl3 = item.img
      this.visibleCase = true
    },
    deleteCase (id) {
      this.caseData.forEach((item, index) => {
        if (item.case_id === id) {
          this.caseData.splice(index, 1)
        }
      })
    },
    handleOnSubmitCase () {
      this.$refs.caseForm.validate(valid => {
        if (valid) {
          this.formCase.img = this.imageUrl3
          if (this.formCase.case_id === '') {
            this.formCase.case_id = 1
            if (this.caseData.length === 0) {
              this.formCase.case_id = 1
            } else {
              let caseId = 1
              this.caseData.forEach(item => {
                if (item.case_id > caseId) {
                  caseId = item.case_id
                }
              })
              this.formCase.case_id = caseId + 1
            }
            this.caseData.push({ ...this.formCase })
          } else {
            this.caseData.forEach(item => {
              if (item.case_id === this.formCase.case_id) {
                item.title = this.formCase.title
                item.content = this.formCase.content
                item.sort = this.formCase.sort
                item.img = this.formCase.img
              }
            })
          }

          this.visibleCase = false
          this.formCase = {
            case_id: '',
            title: '',
            content: '',
            sort: 99,
            img: '',
            editable: false
          }
          this.imageUrl3 = ''
        }
      })
    },

    // =====================================================================
    setImgSizeText () {
      if (this.$route.query.img) {
        this.imgSize = '图片尺寸：' + this.$route.query.img.replace(',', '×') + '像素'
      } else {
        this.imgSize = ''
      }
      if (this.$route.query.img2) {
        this.imgSize2 = '图片尺寸：' + this.$route.query.img2.replace(',', '×') + '像素'
      } else {
        this.imgSize2 = ''
      }
      if (this.$route.query.img3) {
        this.imgSize3 = '图片尺寸：' + this.$route.query.img3.replace(',', '×') + '像素'
      } else {
        this.imgSize3 = ''
      }
    },
    getColumnByCode () {
      this.$http
        .post('admin/column/getParentColumnByCode', {
          code: 'intelligent-lamppost'
        })
        .then((res) => {
          if (res.data.status === 'S') {
            this.parent_column_name = res.data.data.column_name
            this.$http
              .post('admin/column/getColumnByCode', {
                code: 'intelligent-lamppost'
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
    onClose () {
      this.visible = false
    },
    getContent () {
      this.$http
        .post('admin/page/getContent', {
          code: 'intelligent-lamppost'
        })
        .then(res => {
          if (res.data.status === 'S') {
            this.page = res.data.data
            this.imageUrl = this.page.banner
            this.imageUrl2 = this.page.img
            if (this.page.attribute1 && this.page.attribute1.indexOf('[') > -1) {
              this.functionData = JSON.parse(this.page.attribute1)
            } else {
              this.functionData = []
            }
            if (this.page.attribute2 && this.page.attribute2.indexOf('[') > -1) {
              this.advantageData = JSON.parse(this.page.attribute2)
            } else {
              this.advantageData = []
            }
            if (this.page.attribute3 && this.page.attribute3.indexOf('[') > -1) {
              this.caseData = JSON.parse(this.page.attribute3)
            } else {
              this.caseData = []
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
    handleOnSubmit () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.page.page_title = this.column_name
          this.page.banner = this.imageUrl
          this.page.img = this.imageUrl2
          this.page.attribute1 = JSON.stringify(this.functionData)
          this.page.attribute2 = JSON.stringify(this.advantageData)
          this.page.attribute3 = JSON.stringify(this.caseData)
          this.page.code = 'intelligent-lamppost'
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
        } else {
          return false
        }
      })
    },
    handleChange (info) {
      if (info.file.status === 'uploading') {
        this.loadingImg = true
        if (info && info.event && info.event.percent) {
          this.percentImg = info.event.percent
          this.percentImg = this.percentImg.toFixed(2)
        }
        return
      }
      if (info.file.status === 'done') {
        this.loadingImg = false
        this.percentImg = 100
        if (info.file.response.data) {
          this.imageUrl = info.file.response.data[0]
        } else {
          if (info.file.response.status === 'T') {
            this.$store.commit('setVisibleLogin', true)
          }
          this.$message.error(info.file.response.msg)
        }
      }
    },
    handleChange2 (info) {
      if (info.file.status === 'uploading') {
        this.loadingImg2 = true
        if (info && info.event && info.event.percent) {
          this.percentImg2 = info.event.percent
          this.percentImg2 = this.percentImg2.toFixed(2)
        }
        return
      }
      if (info.file.status === 'done') {
        this.loadingImg2 = false
        this.percentImg2 = 100
        if (info.file.response.data) {
          this.imageUrl2 = info.file.response.data[0]
        } else {
          if (info.file.response.status === 'T') {
            this.$store.commit('setVisibleLogin', true)
          }
          this.$message.error(info.file.response.msg)
        }
      }
    },
    handleChange3 (info) {
      if (info.file.status === 'uploading') {
        this.loadingImg3 = true
        if (info && info.event && info.event.percent) {
          this.percentImg3 = info.event.percent
          this.percentImg3 = this.percentImg3.toFixed(2)
        }
        return
      }
      if (info.file.status === 'done') {
        this.loadingImg3 = false
        this.percentImg3 = 100
        if (info.file.response.data) {
          this.imageUrl3 = info.file.response.data[0]
        } else {
          if (info.file.response.status === 'T') {
            this.$store.commit('setVisibleLogin', true)
          }
          this.$message.error(info.file.response.msg)
        }
      }
    },
    beforeUpload (file) {
      const isJpgOrPng =
        file.type === 'image/jpeg' || file.type === 'image/png'
      if (!isJpgOrPng) {
        this.$message.error('只能上传JPG或PNG图片!')
      }
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('上传的图片不能大于2MB!')
      }
      return isJpgOrPng && isLt2M
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .ant-upload.ant-upload-select-picture-card > .ant-upload {
  img {
    max-width: 200px;
  }
}
</style>
