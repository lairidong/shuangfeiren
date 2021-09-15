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
      <a-tabs defaultActiveKey="1">
        <a-tab-pane key="1" tab="人">
          <a-form-model
            ref="ruleForm"
            layout="vertical"
            :model="page1"
            :rules="rules"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
          >
            <a-row :gutter="24">
              <a-col :span="24">
                <a-form-model-item ref="attribute1" label="" prop="attribute1">
                  <a-input
                    v-model="page1.attribute1"
                    @blur="
                      () => {
                        $refs.attribute1.onFieldBlur();
                      }
                    "
                  />
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="24">
                <a-form-model-item ref="attribute2" label="" prop="attribute2">
                  <a-textarea
                    v-model="page1.attribute2"
                    :auto-size="{ minRows: 5, maxRows: 5 }"
                    @blur="
                      () => {
                        $refs.attribute2.onFieldBlur();
                      }
                    "
                  />
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="24">
                <!-- 谢建新教授标题 -->
                <a-form-model-item ref="attribute3" label="" prop="attribute3">
                  <a-input
                    v-model="page1.attribute3"
                    @blur="
                      () => {
                        $refs.attribute3.onFieldBlur();
                      }
                    "
                  />
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="24">
                <!-- 谢建新教授图片 -->
                <a-form-model-item ref="attribute4" label="" prop="attribute4" :extra="imgSize">
                  <a-upload
                    name="files[]"
                    list-type="picture-card"
                    class="avatar-uploader"
                    :disabled="!$store.getters.hasPermission('strength-edit')"
                    :show-upload-list="false"
                    :action="actionUrl"
                    :before-upload="beforeUpload"
                    :headers="headers"
                    @change="handleChange"
                  >
                    <img v-if="page1.attribute4&&!loadingImg" :src="page1.attribute4" class="flash-img" alt="上传图片" />
                    <div v-if="loadingImg">
                      <a-icon :type="'loading'" />
                      <div class="ant-upload-text">
                        {{ percentImg }}%
                      </div>
                    </div>
                    <div v-if="!page1.attribute4&&!loadingImg">
                      <a-icon :type="'plus'" />
                      <div class="ant-upload-text">
                        上传
                      </div>
                    </div>
                  </a-upload>
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="24">
                <!-- 谢建新教授介绍 -->
                <a-form-model-item ref="attribute5" label="" prop="attribute5">
                  <a-textarea
                    v-model="page1.attribute5"
                    :auto-size="{ minRows: 5, maxRows: 5 }"
                    @blur="
                      () => {
                        $refs.attribute5.onFieldBlur();
                      }
                    "
                  />
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="24">
                <a-form-model-item ref="attribute6" label="" prop="attribute6">
                  <a-input
                    v-model="page1.attribute6"
                    @blur="
                      () => {
                        $refs.attribute6.onFieldBlur();
                      }
                    "
                  />
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="24">
                <!-- 王自焘教授和谢建新教授图片 -->
                <a-form-model-item ref="attribute7" label="" prop="attribute7" :extra="imgSize2">
                  <a-upload
                    name="files[]"
                    list-type="picture-card"
                    class="avatar-uploader"
                    :disabled="!$store.getters.hasPermission('strength-edit')"
                    :show-upload-list="false"
                    :action="actionUrl"
                    :before-upload="beforeUpload"
                    :headers="headers"
                    @change="handleChange2"
                  >
                    <img v-if="page1.attribute7&&!loadingImg2" :src="page1.attribute7" class="flash-img" alt="上传图片" />
                    <div v-if="loadingImg2">
                      <a-icon :type="'loading'" />
                      <div class="ant-upload-text">
                        {{ percentImg2 }}%
                      </div>
                    </div>
                    <div v-if="!page1.attribute7&&!loadingImg2">
                      <a-icon :type="'plus'" />
                      <div class="ant-upload-text">
                        上传
                      </div>
                    </div>
                  </a-upload>
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="24">
                <a-form-model-item ref="attribute8" label="" prop="attribute8">
                  <a-input
                    v-model="page1.attribute8"
                    @blur="
                      () => {
                        $refs.attribute8.onFieldBlur();
                      }
                    "
                  />
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="24">
                <!-- 刘静安教授图片 -->
                <a-form-model-item ref="attribute9" label="" prop="attribute9" :extra="imgSize2">
                  <a-upload
                    name="files[]"
                    list-type="picture-card"
                    class="avatar-uploader"
                    :disabled="!$store.getters.hasPermission('strength-edit')"
                    :show-upload-list="false"
                    :action="actionUrl"
                    :before-upload="beforeUpload"
                    :headers="headers"
                    @change="handleChange3"
                  >
                    <img v-if="page1.attribute9&&!loadingImg3" :src="page1.attribute9" class="flash-img" alt="上传图片" />
                    <div v-if="loadingImg3">
                      <a-icon :type="'loading'" />
                      <div class="ant-upload-text">
                        {{ percentImg3 }}%
                      </div>
                    </div>
                    <div v-if="!page1.attribute9&&!loadingImg3">
                      <a-icon :type="'plus'" />
                      <div class="ant-upload-text">
                        上传
                      </div>
                    </div>
                  </a-upload>
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="24">
                <a-form-model-item ref="attribute10" label="末尾内容" prop="attribute10">
                  <a-textarea
                    v-model="page1.attribute10"
                    :auto-size="{ minRows: 5, maxRows: 5 }"
                    @blur="
                      () => {
                        $refs.attribute10.onFieldBlur();
                      }
                    "
                  />
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="24">
                <a-button icon="save" type="primary" @click="handleSave()" v-action:strength-edit>
                  保存
                </a-button>
              </a-col>
            </a-row>
          </a-form-model>
        </a-tab-pane>
        <a-tab-pane key="2" tab="财">
          <a-form-model
            ref="ruleForm"
            layout="vertical"
            :model="page2"
            :rules="rules"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
          >
            <a-row :gutter="24">
              <a-col :span="24">
                <a-form-model-item ref="attribute1" label="" prop="attribute1">
                  <a-input
                    v-model="page2.attribute1"
                    @blur="
                      () => {
                        $refs.attribute1.onFieldBlur();
                      }
                    "
                  />
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="24">
                <a-form-model-item ref="attribute2" label="" prop="attribute2">
                  <a-textarea
                    v-model="page2.attribute2"
                    :auto-size="{ minRows: 5, maxRows: 5 }"
                    @blur="
                      () => {
                        $refs.attribute2.onFieldBlur();
                      }
                    "
                  />
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="24">
                <a-button icon="save" type="primary" @click="handleSave()" v-action:strength-edit>
                  保存
                </a-button>
              </a-col>
            </a-row>
          </a-form-model>
        </a-tab-pane>
        <a-tab-pane key="3" tab="物">
          <a-form-model
            ref="ruleForm"
            layout="vertical"
            :model="page3"
            :rules="rules"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
          >
            <a-row :gutter="24">
              <a-col :span="24">
                <a-form-model-item ref="attribute1" label="" prop="attribute1">
                  <a-input
                    v-model="page3.attribute1"
                    @blur="
                      () => {
                        $refs.attribute1.onFieldBlur();
                      }
                    "
                  />
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="24">
                <a-form-model-item ref="attribute2" label="" prop="attribute2">
                  <a-textarea
                    v-model="page3.attribute2"
                    :auto-size="{ minRows: 5, maxRows: 5 }"
                    @blur="
                      () => {
                        $refs.attribute2.onFieldBlur();
                      }
                    "
                  />
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="24">
                <div class="tool-bar" style="margin-bottom: 16px">
                  <a-row>
                    <a-col :span="24">
                      <div class="btn-box">
                        <a-button icon="plus" type="primary" @click="addFunctionItem()" v-action:strength-edit>添加</a-button>
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
                    <div>{{ text.sort }}</div>
                  </div>
                  <div class="action-box" slot="action" slot-scope="text">
                    <a-tooltip placement="top" v-action:strength-edit>
                      <template slot="title">
                        <span>修改</span>
                      </template>
                      <a-button type="primary" icon="edit" @click="editFunction(text)"></a-button>
                    </a-tooltip>
                    <a-tooltip placement="top" v-action:strength-edit>
                      <template slot="title">
                        <span>删除</span>
                      </template>
                      <a-button type="danger" icon="rest" @click="deleteFunction(text.function_id)"></a-button>
                    </a-tooltip>
                  </div>
                </a-table>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="24">
                <a-button icon="save" type="primary" @click="handleSave()" v-action:strength-edit>
                  保存
                </a-button>
              </a-col>
            </a-row>
          </a-form-model>
        </a-tab-pane>
        <a-tab-pane key="4" tab="平台">
          <a-form-model
            ref="ruleForm"
            layout="vertical"
            :model="page4"
            :rules="rules"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
          >
            <a-row :gutter="24">
              <a-col :span="24">
                <a-form-model-item ref="attribute1" label="" prop="attribute1">
                  <a-input
                    v-model="page4.attribute1"
                    @blur="
                      () => {
                        $refs.attribute1.onFieldBlur();
                      }
                    "
                  />
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="24">
                <a-form-model-item ref="attribute2" label="" prop="attribute2">
                  <a-textarea
                    v-model="page4.attribute2"
                    :auto-size="{ minRows: 5, maxRows: 5 }"
                    @blur="
                      () => {
                        $refs.attribute2.onFieldBlur();
                      }
                    "
                  />
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="24">
                <div class="tool-bar" style="margin-bottom: 16px">
                  <a-row>
                    <a-col :span="24">
                      <div class="btn-box">
                        <a-button icon="plus" type="primary" @click="addFunctionItem2()" v-action:strength-edit>添加</a-button>
                      </div>
                    </a-col>
                  </a-row>
                </div>
                <a-table
                  :columns="functionColumns"
                  :data-source="functionData2"
                  :pagination="false"
                  row-key="function_id"
                  size="small"
                >
                  <div slot="img" slot-scope="text">
                    <img :src="text.img" style="max-width: 80px; max-height: 40px; cursor: pointer;" alt="">
                  </div>
                  <div slot="sort" slot-scope="text">
                    <div>{{ text.sort }}</div>
                  </div>
                  <div class="action-box" slot="action" slot-scope="text">
                    <a-tooltip placement="top" v-action:strength-edit>
                      <template slot="title">
                        <span>修改</span>
                      </template>
                      <a-button type="primary" icon="edit" @click="editFunction2(text)"></a-button>
                    </a-tooltip>
                    <a-tooltip placement="top" v-action:strength-edit>
                      <template slot="title">
                        <span>删除</span>
                      </template>
                      <a-button type="danger" icon="rest" @click="deleteFunction2(text.function_id)"></a-button>
                    </a-tooltip>
                  </div>
                </a-table>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="24">
                <a-button icon="save" type="primary" @click="handleSave()" v-action:strength-edit>
                  保存
                </a-button>
              </a-col>
            </a-row>
          </a-form-model>
        </a-tab-pane>
        <a-tab-pane key="5" tab="产学研">
          <a-form-model
            ref="ruleForm"
            layout="vertical"
            :model="page5"
            :rules="rules"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
          >
            <a-row :gutter="24">
              <a-col :span="24">
                <a-form-model-item ref="attribute1" label="" prop="attribute1">
                  <a-input
                    v-model="page5.attribute1"
                    @blur="
                      () => {
                        $refs.attribute1.onFieldBlur();
                      }
                    "
                  />
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="24">
                <a-form-model-item ref="attribute2" label="" prop="attribute2">
                  <a-textarea
                    v-model="page5.attribute2"
                    :auto-size="{ minRows: 5, maxRows: 5 }"
                    @blur="
                      () => {
                        $refs.attribute2.onFieldBlur();
                      }
                    "
                  />
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="24">
                <a-form-model-item ref="attribute3" label="" prop="attribute3">
                  <a-input
                    v-model="page5.attribute3"
                    @blur="
                      () => {
                        $refs.attribute3.onFieldBlur();
                      }
                    "
                  />
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="24">
                <a-form-model-item ref="attribute4" label="" prop="attribute4">
                  <a-textarea
                    v-model="page5.attribute4"
                    :auto-size="{ minRows: 5, maxRows: 5 }"
                    @blur="
                      () => {
                        $refs.attribute4.onFieldBlur();
                      }
                    "
                  />
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="24">
                <a-button icon="save" type="primary" @click="handleSave()" v-action:strength-edit>
                  保存
                </a-button>
              </a-col>
            </a-row>
          </a-form-model>
        </a-tab-pane>
      </a-tabs>
    </div>

    <a-drawer
      :title="action + '图片'"
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
                @change="handleChange4"
              >
                <img v-if="imageUrl3&&!loadingImg4" :src="imageUrl3" class="flash-img" alt="上传图片" />
                <div v-if="loadingImg4">
                  <a-icon :type="'loading'" />
                  <div class="ant-upload-text">
                    {{ percentImg4 }}%
                  </div>
                </div>
                <div v-if="!imageUrl3&&!loadingImg4">
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
              <a-button type="primary" html-type="submit" size="large" @click="handleOnSubmitFunction">确定</a-button>
            </div>
          </a-col>
        </a-row>
        <!-- <a-row :gutter="16">
          <a-col :span="24"><p style="color: red;">注意：添加或修改小图后，需要在上层点击提交按钮才会保存简介的修改。</p></a-col>
        </a-row> -->
      </a-form-model>
    </a-drawer>

    <a-drawer
      :title="action + '图片'"
      :width="'50%'"
      @close="visibleFunction2=false"
      :visible="visibleFunction2"
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
        <a-row :gutter="16">
          <a-col :span="24">
            <a-form-item label="上传图片" :extra="imgSize4">
              <a-upload
                name="files[]"
                list-type="picture-card"
                class="avatar-uploader"
                :show-upload-list="false"
                :action="actionUrl"
                :before-upload="beforeUpload"
                :headers="headers"
                @change="handleChange5"
              >
                <img v-if="imageUrl4&&!loadingImg5" :src="imageUrl4" class="flash-img" alt="上传图片" />
                <div v-if="loadingImg5">
                  <a-icon :type="'loading'" />
                  <div class="ant-upload-text">
                    {{ percentImg5 }}%
                  </div>
                </div>
                <div v-if="!imageUrl4&&!loadingImg5">
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
              <a-button :style="{marginRight: '8px'}" size="large" @click="visibleFunction2=false">取消</a-button>
              <a-button type="primary" html-type="submit" size="large" @click="handleOnSubmitFunction2">确定</a-button>
            </div>
          </a-col>
        </a-row>
        <!-- <a-row :gutter="16">
          <a-col :span="24"><p style="color: red;">注意：添加或修改小图后，需要在上层点击提交按钮才会保存简介的修改。</p></a-col>
        </a-row> -->
      </a-form-model>
    </a-drawer>
  </div>
</template>

<script>
import VueUeditorWrap from 'vue-ueditor-wrap'
import moment from 'moment'
import 'moment/locale/zh-cn'
import locale from 'ant-design-vue/es/date-picker/locale/zh_CN'

const functionColumns = [
  { title: '图片', dataIndex: '', key: 'img', scopedSlots: { customRender: 'img' }, width: 100 },
  { title: '标题', dataIndex: 'title', key: 'title' },
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
      functionData: [],
      functionData2: [],
      visibleFunction: false,
      visibleFunction2: false,
      formFunction: {
        function_id: '',
        title: '',
        img: '',
        sort: 99,
        editable: false
      },
      rulesAdvantage: {
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        sort: [{ required: true, message: '请输入排序号', trigger: 'blur' }]
      },
      pageSize: 100,
      currentPage: 1,
      total: 0,
      data: [],
      moment,
      locale,
      parent_column_name: '',
      column_name: '',
      labelCol: { },
      wrapperCol: { },
      tableLoading: false,
      tableLoading2: false,
      page: {
        page_title: '',
        page_content: '',
        img: ''
      },
      page1: {
        page_title: '',
        page_content: '',
        img: '',
        attribute1: '',
        attribute2: '',
        attribute3: '',
        attribute4: '',
        attribute5: '',
        attribute6: '',
        attribute7: '',
        attribute8: '',
        attribute9: '',
        attribute10: ''
      },
      page2: {
        page_title: '',
        page_content: '',
        img: '',
        attribute1: '',
        attribute2: '',
        attribute3: '',
        attribute4: '',
        attribute5: '',
        attribute6: '',
        attribute7: '',
        attribute8: '',
        attribute9: '',
        attribute10: ''
      },
      page3: {
        page_title: '',
        page_content: '',
        img: '',
        attribute1: '',
        attribute2: '',
        attribute3: '',
        attribute4: '',
        attribute5: '',
        attribute6: '',
        attribute7: '',
        attribute8: '',
        attribute9: '',
        attribute10: ''
      },
      page4: {
        page_title: '',
        page_content: '',
        img: '',
        attribute1: '',
        attribute2: '',
        attribute3: '',
        attribute4: '',
        attribute5: '',
        attribute6: '',
        attribute7: '',
        attribute8: '',
        attribute9: '',
        attribute10: ''
      },
      page5: {
        page_title: '',
        page_content: '',
        img: '',
        attribute1: '',
        attribute2: '',
        attribute3: '',
        attribute4: '',
        attribute5: '',
        attribute6: '',
        attribute7: '',
        attribute8: '',
        attribute9: '',
        attribute10: ''
      },
      action: '',
      visible: false,
      visibleTeam: false,
      imgSize: '',
      imgSize2: '',
      imgSize3: '',
      imgSize4: '',
      loadingImg: false,
      percentImg: 0,
      imageUrl: '',
      loadingImg2: false,
      percentImg2: 0,
      imageUrl2: '',
      loadingImg3: false,
      percentImg3: 0,
      imageUrl3: '',
      loadingImg4: false,
      percentImg4: 0,
      imageUrl4: '',
      loadingImg5: false,
      percentImg5: 0,
      headers: {
        AccessToken: localStorage.getItem('token')
      },
      actionUrl: this.$baseUrl + 'admin/article/upload_img' + (process.env.NODE_ENV === 'development' ? '?voucher=token' : '?voucher=session'),
      rules: {
        // cate_id: [{ required: true, message: '请选择分类', trigger: 'blur' }],
        // title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
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
  name: 'Strength',
  components: {
    VueUeditorWrap
  },
  created () {
    this.getContent()
    this.setImgSizeText()
    this.getColumnByCode()
    this.$root.$on('updateToken', (data) => {
      this.headers.AccessToken = data
    })
  },
  methods: {
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
      if (this.$route.query.img4) {
        this.imgSize4 = '图片尺寸：' + this.$route.query.img4.replace(',', '×') + '像素'
      } else {
        this.imgSize4 = ''
      }
    },
    getColumnByCode () {
      this.$http
        .post('admin/column/getParentColumnByCode', {
          code: 'strength'
        })
        .then((res) => {
          if (res.data.status === 'S') {
            this.parent_column_name = res.data.data.column_name
            this.$http
              .post('admin/column/getColumnByCode', {
                code: 'strength'
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
    // 产品功能 ===================================
    addFunctionItem () {
      this.formFunction = {
        function_id: '',
        title: '',
        img: '',
        sort: 99,
        editable: false
      }
      this.imageUrl3 = ''
      this.visibleFunction = true
    },
    editFunction (item) {
      this.formFunction = {
        function_id: item.function_id,
        title: item.title,
        img: item.img,
        sort: item.sort,
        editable: item.editable
      }
      this.imageUrl3 = item.img
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
          this.formFunction.img = this.imageUrl3
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
                item.sort = this.formFunction.sort
                item.img = this.formFunction.img
              }
            })
          }

          this.visibleFunction = false
          this.formFunction = {
            function_id: '',
            title: '',
            sort: 99,
            img: '',
            editable: false
          }
          this.imageUrl3 = ''
          // this.$message.success('已保存到列表，请注意提交表单')
          this.handleSave()
        }
      })
    },
    // 产品功能 ===================================

    // 产品功能2 ===================================
    addFunctionItem2 () {
      this.formFunction = {
        function_id: '',
        title: '',
        img: '',
        sort: 99,
        editable: false
      }
      this.imageUrl4 = ''
      this.visibleFunction2 = true
    },
    editFunction2 (item) {
      this.formFunction = {
        function_id: item.function_id,
        title: item.title,
        img: item.img,
        sort: item.sort,
        editable: item.editable
      }
      this.imageUrl4 = item.img
      this.visibleFunction2 = true
    },
    deleteFunction2 (id) {
      this.functionData2.forEach((item, index) => {
        if (item.function_id === id) {
          this.functionData2.splice(index, 1)
        }
      })
    },
    handleOnSubmitFunction2 () {
      this.$refs.functionForm.validate(valid => {
        if (valid) {
          this.formFunction.img = this.imageUrl4
          if (this.formFunction.function_id === '') {
            this.formFunction.function_id = 1
            if (this.functionData2.length === 0) {
              this.formFunction.function_id = 1
            } else {
              let functionId = 1
              this.functionData2.forEach(item => {
                if (item.function_id > functionId) {
                  functionId = item.function_id
                }
              })
              this.formFunction.function_id = functionId + 1
            }
            this.functionData2.push({ ...this.formFunction })
          } else {
            this.functionData2.forEach(item => {
              if (item.function_id === this.formFunction.function_id) {
                item.title = this.formFunction.title
                item.sort = this.formFunction.sort
                item.img = this.formFunction.img
              }
            })
          }

          this.visibleFunction2 = false
          this.formFunction = {
            function_id: '',
            title: '',
            sort: 99,
            img: '',
            editable: false
          }
          this.imageUrl4 = ''
          // this.$message.success('已保存到列表，请注意提交表单')
          this.handleSave()
        }
      })
    },
    // 产品功能2 ===================================
    getContent () {
      this.$http
        .post('admin/page/getContent', {
          code: 'strength1'
        })
        .then(res => {
          if (res.data.status === 'S') {
            this.page1 = res.data.data
            // this.imageUrl = this.page.img
            // this.imageUrl3 = this.page.attribute2
            // if (this.page.attribute1 !== '' && this.page.attribute1.indexOf('[') > -1) {
            //   this.functionData = JSON.parse(this.page.attribute1)
            //   this.functionData.forEach(list => {
            //     list.editable = false
            //   })
            // } else {
            //   this.functionData = []
            // }
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

      this.$http
        .post('admin/page/getContent', {
          code: 'strength2'
        })
        .then(res => {
          if (res.data.status === 'S') {
            this.page2 = res.data.data
            // this.imageUrl = this.page.img
            // this.imageUrl3 = this.page.attribute2
            // if (this.page.attribute1 !== '' && this.page.attribute1.indexOf('[') > -1) {
            //   this.functionData = JSON.parse(this.page.attribute1)
            //   this.functionData.forEach(list => {
            //     list.editable = false
            //   })
            // } else {
            //   this.functionData = []
            // }
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

      this.$http
        .post('admin/page/getContent', {
          code: 'strength3'
        })
        .then(res => {
          if (res.data.status === 'S') {
            this.page3 = res.data.data
            // this.imageUrl = this.page.img
            // this.imageUrl3 = this.page.attribute2
            if (this.page3.attribute3 !== '' && this.page3.attribute3.indexOf('[') > -1) {
              this.functionData = JSON.parse(this.page3.attribute3)
              this.functionData.forEach(list => {
                list.editable = false
              })
            } else {
              this.functionData = []
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

      this.$http
        .post('admin/page/getContent', {
          code: 'strength4'
        })
        .then(res => {
          if (res.data.status === 'S') {
            this.page4 = res.data.data
            // this.imageUrl = this.page.img
            // this.imageUrl3 = this.page.attribute2
            if (this.page4.attribute3 !== '' && this.page4.attribute3.indexOf('[') > -1) {
              this.functionData2 = JSON.parse(this.page4.attribute3)
              this.functionData2.forEach(list => {
                list.editable = false
              })
            } else {
              this.functionData2 = []
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

      this.$http
        .post('admin/page/getContent', {
          code: 'strength5'
        })
        .then(res => {
          if (res.data.status === 'S') {
            this.page5 = res.data.data
            // this.imageUrl = this.page.img
            // this.imageUrl3 = this.page.attribute2
            // if (this.page.attribute1 !== '' && this.page.attribute1.indexOf('[') > -1) {
            //   this.functionData = JSON.parse(this.page.attribute1)
            //   this.functionData.forEach(list => {
            //     list.editable = false
            //   })
            // } else {
            //   this.functionData = []
            // }
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
    async handleSave () {
      this.page1.page_title = this.column_name
      // this.page.img = this.imageUrl
      // this.page.attribute1 = JSON.stringify(this.functionData)
      this.page1.code = 'strength1'
      await this.$http
        .post('admin/page/edit', this.page1)
        .then(res => {
          if (res.data.status === 'S') {
            // this.$message.success('保存成功')
            // this.getContent()
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

      this.page2.page_title = this.column_name + '2'
      // this.page.img = this.imageUrl
      // this.page.attribute1 = JSON.stringify(this.functionData)
      this.page2.code = 'strength2'
      await this.$http
        .post('admin/page/edit', this.page2)
        .then(res => {
          if (res.data.status === 'S') {
            // this.$message.success('保存成功')
            // this.getContent()
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

      this.page3.page_title = this.column_name + '3'
      // this.page.img = this.imageUrl
      // this.page.attribute1 = JSON.stringify(this.functionData)
      this.page3.code = 'strength3'
      this.page3.attribute3 = JSON.stringify(this.functionData)
      await this.$http
        .post('admin/page/edit', this.page3)
        .then(res => {
          if (res.data.status === 'S') {
            // this.$message.success('保存成功')
            // this.getContent()
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

      this.page4.page_title = this.column_name + '4'
      // this.page.img = this.imageUrl
      // this.page.attribute1 = JSON.stringify(this.functionData)
      this.page4.code = 'strength4'
      this.page4.attribute3 = JSON.stringify(this.functionData2)
      await this.$http
        .post('admin/page/edit', this.page4)
        .then(res => {
          if (res.data.status === 'S') {
            // this.$message.success('保存成功')
            // this.getContent()
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

      this.page5.page_title = this.column_name + '5'
      // this.page.img = this.imageUrl
      // this.page.attribute1 = JSON.stringify(this.functionData)
      this.page5.code = 'strength5'
      await this.$http
        .post('admin/page/edit', this.page5)
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
          this.page1.attribute4 = info.file.response.data[0]
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
          this.page1.attribute7 = info.file.response.data[0]
          this.$refs.ruleForm.clearValidate()
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
          this.page1.attribute9 = info.file.response.data[0]
          // this.$refs.ruleFormTeam.clearValidate()
        } else {
          if (info.file.response.status === 'T') {
            this.$store.commit('setVisibleLogin', true)
          }
          this.$message.error(info.file.response.msg)
        }
      }
    },
    handleChange4 (info) {
      if (info.file.status === 'uploading') {
        this.loadingImg4 = true
        if (info && info.event && info.event.percent) {
          this.percentImg4 = info.event.percent
          this.percentImg4 = this.percentImg4.toFixed(2)
        }
        return
      }
      if (info.file.status === 'done') {
        this.loadingImg4 = false
        this.percentImg4 = 100
        if (info.file.response.data) {
          this.imageUrl3 = info.file.response.data[0]
          // this.$refs.ruleFormTeam.clearValidate()
        } else {
          if (info.file.response.status === 'T') {
            this.$store.commit('setVisibleLogin', true)
          }
          this.$message.error(info.file.response.msg)
        }
      }
    },
    handleChange5 (info) {
      if (info.file.status === 'uploading') {
        this.loadingImg5 = true
        if (info && info.event && info.event.percent) {
          this.percentImg5 = info.event.percent
          this.percentImg5 = this.percentImg5.toFixed(2)
        }
        return
      }
      if (info.file.status === 'done') {
        this.loadingImg5 = false
        this.percentImg5 = 100
        if (info.file.response.data) {
          this.imageUrl4 = info.file.response.data[0]
          // this.$refs.ruleFormTeam.clearValidate()
        } else {
          if (info.file.response.status === 'T') {
            this.$store.commit('setVisibleLogin', true)
          }
          this.$message.error(info.file.response.msg)
        }
      }
    },
    beforeUpload (file) {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
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
</style>
