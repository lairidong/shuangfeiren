<template>
  <div>
    <div class="search-box">
      <a-form class="ant-advanced-search-form" @submit="handleSearch">
        <a-row :gutter="24">
          <a-col :span="6" :style="{ display: 'block' }">
            <a-form-item :label="`标题`">
              <a-input allowClear v-model="searchItem.title" placeholder />
            </a-form-item>
          </a-col>
          <a-col :span="6" :style="{ display: 'block' }">
            <a-form-item :label="`状态`">
              <a-select v-model="searchItem.status">
                <a-select-option value="1">正常</a-select-option>
                <a-select-option value="0">禁用</a-select-option>
                <a-select-option value>全部</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="6" :style="{ display: 'block' }">
            <a-form-item label="提交日期">
              <a-range-picker
                style="width: 100%"
                @change="onDatePickerChange"
                :locale="locale"
                v-model="searchItem.date"
                showToday
                allowClear
              />
            </a-form-item>
          </a-col>
          <a-col :span="6" :style="{ textAlign: 'right', float: 'right' }">
            <a-form-item>
              <a-button type="primary" icon="search" html-type="submit">搜索</a-button>
              <a-button icon="undo" :style="{ marginLeft: '8px' }" @click="handleReset">重置</a-button>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <div class="tool-bar" style="margin-bottom: 16px">
      <a-row>
        <a-col :span="12">
          <div class="page-title">信息列表</div>
        </a-col>
        <a-col :span="12">
          <div class="btn-box">
            <a-button icon="rest" type="danger" @click="delSelect" :disabled="!hasSelected" v-action:solution-del>批量删除</a-button>
            <a-button icon="plus" type="primary" @click="addItem()" v-action:solution-add>添加</a-button>
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
        row-key="article_id"
        :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        size="small"
      >
        <div slot="sort" slot-scope="text">
          <div style="border-bottom: 1px solid #ddd; padding: 5px 0; text-indent: 12px;" v-if="!text.editable || !$store.getters.hasPermission('solution-edit')" @click="showEdit(text)">{{ text.sort }}</div>
          <div v-else>
            <a-input class="input-sort" :id="`input_${text.article_id}`" v-model="text.sort" @blur="text.oldSort===text.sort?text.editable=false:text.editable=true">
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
            :disabled="!$store.getters.hasPermission('solution-edit')"
            :loading="text.loading"
            :checked="text.status=='1' ? true : false"
            @change="changeStatus(text)"
          />
        </div>
        <div class="action-box" slot="action" slot-scope="text">
          <a-tooltip placement="top" v-action:solution-edit>
            <template slot="title">
              <span>修改</span>
            </template>
            <a-button type="primary" icon="edit" @click="editItem(text)"></a-button>
          </a-tooltip>
          <a-tooltip placement="top" v-action:solution-del>
            <template slot="title">
              <span>删除</span>
            </template>
            <a-button type="danger" icon="rest" @click="deleteItem(text.article_id)"></a-button>
          </a-tooltip>
        </div>
      </a-table>
    </div>

    <a-drawer
      :title="action + '解决方案'"
      :width="'calc(100% - 200px)'"
      @close="onClose"
      :visible="visible"
      :bodyStyle="{paddingBottom: '80px'}"
    >
      <a-tabs defaultActiveKey="1">
        <a-tab-pane key="1" tab="基本信息">
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
                <a-form-model-item ref="title" label="标题" prop="title">
                  <a-textarea
                    v-model="form.title"
                    :auto-size="{ minRows: 2, maxRows: 2 }"
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
              <a-col :span="12">
                <a-form-model-item ref="sub_title" label="副标题" prop="sub_title">
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
              <a-col :span="4">
                <a-form-model-item ref="cate_id" label="分类" prop="cate_id">
                  <a-cascader
                    :allowClear="false"
                    :options="cateData"
                    v-model="form.cate_id"
                    @blur="
                      () => {
                        $refs.cate_id.onFieldBlur();
                      }
                    "
                    :fieldNames="{ label: 'cate_name', value: 'cate_id', children: 'children' }" />
                </a-form-model-item>
              </a-col>
            </a-row>
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
                <a-form-item label="方案图片" :extra="imgSize2">
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
              <a-col :span="6" style="display: none;">
                <a-form-item label="图标" :extra="imgSize3">
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
              <a-col :span="6" style="display: none;">
                <a-form-item label="图标（鼠标移上）" :extra="imgSize4">
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
                    <img v-if="imageUrl4&&!loadingImg4" :src="imageUrl4" class="flash-img" alt="上传图片" />
                    <div v-if="loadingImg4">
                      <a-icon :type="'loading'" />
                      <div class="ant-upload-text">
                        {{ percentImg4 }}%
                      </div>
                    </div>
                    <div v-if="!imageUrl4&&!loadingImg4">
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
                <a-form-model-item label="方案概述">
                  <vue-ueditor-wrap v-model="form.content" :config="myConfig"></vue-ueditor-wrap>
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="12">
                <a-form-model-item ref="sort" label="排序号" prop="sort" extra="数字越小越靠前">
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
            </a-row>
            <a-row :gutter="24">
              <a-col :span="24" style="margin-top: 8px;">
                <a-form-model-item ref="status" label="状态" prop="status">
                  <a-radio-group style="width: 100%;" v-model="form.status">
                    <a-radio :value="'1'">正常</a-radio>
                    <a-radio :value="'0'">禁用</a-radio>
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
        </a-tab-pane>
        <!-- <a-tab-pane key="2" tab="产品功能" style="display: none;">
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
              <div style="border-bottom: 1px solid #ddd; padding: 5px 0; text-indent: 12px;" v-if="!text.editable || !$store.getters.hasPermission('solution-edit')" @click="showEdit(text)">{{ text.sort }}</div>
              <div v-else>
                <a-input class="input-sort" :id="`input_function_${text.function_id}`" v-model="text.sort" @blur="text.oldSort===text.sort?text.editable=false:text.editable=true">
                  <a-button class="btn-sort" slot="addonAfter" size="small" @click="updateSort(text)">
                    <a-icon type="save" />
                  </a-button>
                </a-input>
              </div>
            </div>
            <div class="action-box" slot="action" slot-scope="text">
              <a-tooltip placement="top" v-action:solution-edit>
                <template slot="title">
                  <span>修改</span>
                </template>
                <a-button type="primary" icon="edit" @click="editFunction(text)"></a-button>
              </a-tooltip>
              <a-tooltip placement="top" v-action:solution-del>
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
        </a-tab-pane> -->
        <a-tab-pane key="3" tab="方案优势">
          <div class="tool-bar" style="margin-bottom: 16px">
            <a-row>
              <a-col :span="24">
                <div class="btn-box">
                  <a-button icon="plus" type="primary" @click="addAdvantageItem()" v-action:solution-add>添加</a-button>
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
              <div>{{ text.sort }}</div>
            </div>
            <div class="action-box" slot="action" slot-scope="text">
              <a-tooltip placement="top" v-action:solution-edit>
                <template slot="title">
                  <span>修改</span>
                </template>
                <a-button type="primary" icon="edit" @click="editAdvantage(text)"></a-button>
              </a-tooltip>
              <a-tooltip placement="top" v-action:solution-del>
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
        <a-tab-pane key="4" tab="商业案例">
          <div class="tool-bar" style="margin-bottom: 16px">
            <a-row>
              <a-col :span="24">
                <div class="btn-box">
                  <a-button icon="plus" type="primary" @click="addCaseItem()" v-action:solution-add>添加</a-button>
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
              <div>{{ text.sort }}</div>
            </div>
            <div class="action-box" slot="action" slot-scope="text">
              <a-tooltip placement="top" v-action:solution-edit>
                <template slot="title">
                  <span>修改</span>
                </template>
                <a-button type="primary" icon="edit" @click="editCase(text)"></a-button>
              </a-tooltip>
              <a-tooltip placement="top" v-action:solution-del>
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
    </a-drawer>

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
        <a-row :gutter="16">
          <a-col :span="24">
            <a-form-item label="上传图片" :extra="imgSize5">
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
                <img v-if="imageUrl5&&!loadingImg5" :src="imageUrl5" class="flash-img" alt="上传图片" />
                <div v-if="loadingImg5">
                  <a-icon :type="'loading'" />
                  <div class="ant-upload-text">
                    {{ percentImg5 }}%
                  </div>
                </div>
                <div v-if="!imageUrl5&&!loadingImg5">
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
                @change="handleChange6"
              >
                <img v-if="imageUrl6&&!loadingImg6" :src="imageUrl6" class="flash-img" alt="上传图片" />
                <div v-if="loadingImg6">
                  <a-icon :type="'loading'" />
                  <div class="ant-upload-text">
                    {{ percentImg6 }}%
                  </div>
                </div>
                <div v-if="!imageUrl6&&!loadingImg6">
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
import VueUeditorWrap from 'vue-ueditor-wrap'
import moment from 'moment'
import 'moment/locale/zh-cn'
import locale from 'ant-design-vue/es/date-picker/locale/zh_CN'
const columns = [
  // { title: 'ID', dataIndex: 'article_id', key: 'article_id' },
  { title: '标题', dataIndex: 'title', key: 'title' },
  { title: '分类', dataIndex: 'cate_name', key: 'cate_name', width: 200 },
  { title: '排序号', dataIndex: '', key: 'sort', scopedSlots: { customRender: 'sort' }, width: 100 },
  { title: '编辑', dataIndex: 'author', key: 'author', width: 100 },
  // { title: '日期', dataIndex: 'create_date', key: 'create_date', width: 120 },
  {
    title: '状态',
    dataIndex: '',
    key: 'a',
    scopedSlots: { customRender: 'status' },
    width: 90
  },
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

const functionColumns = [
  { title: '图片', dataIndex: '', key: 'img', scopedSlots: { customRender: 'img' }, width: 100 },
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
      moment,
      locale,
      columns,
      functionColumns,
      advantageColumns,
      caseColumns,
      pageSize: 10,
      currentPage: 1,
      total: 0,
      data: [],
      advantageData: [],
      functionData: [],
      caseData: [],
      tableLoading: false,
      action: '',
      visible: false,
      visibleAdvantage: false,
      visibleFunction: false,
      visibleCase: false,
      labelCol: {},
      wrapperCol: {},
      selectedRowKeys: [],
      searchItem: {
        cate_id: '',
        title: '',
        status: '',
        date: [
          moment('2020/01/01', 'YYYY-MM-DD'),
          moment(new Date(), 'YYYY-MM-DD')
        ],
        date_Begin: '2020-01-01',
        date_end: ''
      },
      filterItem: {
        cate_id: '',
        title: '',
        status: '',
        date: [
          moment('2020/01/01', 'YYYY-MM-DD'),
          moment(new Date(), 'YYYY-MM-DD')
        ],
        date_Begin: '2020-01-01',
        date_end: ''
      },
      cateData: [],
      form: {
        cate_id: '',
        title: '',
        sub_title: '',
        summary: '',
        code: this.$route.params.code,
        create_date: moment(new Date(), 'YYYY-MM-DD'),
        status: '1',
        web_title: '',
        meta_search_title: '',
        meta_author: '',
        meta_keywords: '',
        meta_copyright: '',
        meta_description: '',
        img: '',
        img2: '',
        img3: '',
        img4: '',
        img5: '',
        img6: '',
        sort: 99
      },
      formFunction: {
        function_id: '',
        title: '',
        content: '',
        img: '',
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
      imageUrl5: '',
      loadingImg6: false,
      percentImg6: 0,
      imageUrl6: '',
      imgSize: '',
      imgSize2: '',
      imgSize3: '',
      imgSize4: '',
      imgSize5: '',
      imgSize6: '',
      headers: {
        AccessToken: localStorage.getItem('token')
      },
      actionUrl: this.$baseUrl + 'admin/article/upload_img' + (process.env.NODE_ENV === 'development' ? '?voucher=token' : '?voucher=session'),
      rules: {
        cate_id: [{ required: true, message: '请选择分类', trigger: 'blur' }],
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        summary: [{ required: false, message: '', trigger: 'blur' }],
        img: [{ required: true, message: '请上传缩略图', trigger: 'blur' }],
        // img2: [
        //   { required: true, message: '请上传Banner图', trigger: 'blur' }
        // ],
        // img3: [
        //   { required: true, message: '请上传资质认证图', trigger: 'blur' }
        // ],
        sort: [{ required: true, message: '请输入排序号', trigger: blur }],
        // create_date: [
        //   { required: true, message: '请选择日期', trigger: 'change' }
        // ],
        status: [{ required: true, message: '请选择状态', trigger: 'change' }]
      },
      rulesAdvantage: {
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        content: [{ required: false, message: '请输入内容', trigger: 'blur' }],
        sort: [{ required: true, message: '请输入排序号', trigger: 'blur' }]
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
  name: 'Product',
  components: {
    VueUeditorWrap
  },
  computed: {
    hasSelected () {
      return this.selectedRowKeys.length > 0
    }
  },
  watch: {
    $route: function () {
      this.getCate()
      this.getList()
      this.getParentColumnByCode()
      this.form.parent_code = 'solution'
    }
  },
  created () {
    this.getCate()
    this.getList()
    this.setImgSizeText()
    this.getParentColumnByCode()
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
      if (this.$route.query.img5) {
        this.imgSize5 = '图片尺寸：' + this.$route.query.img5.replace(',', '×') + '像素'
      } else {
        this.imgSize5 = ''
      }
      if (this.$route.query.img6) {
        this.imgSize6 = '图片尺寸：' + this.$route.query.img6.replace(',', '×') + '像素'
      } else {
        this.imgSize6 = ''
      }
    },
    // 产品功能 ===================================
    addFunctionItem () {
      this.formFunction = {
        function_id: '',
        title: '',
        content: '',
        img: '',
        sort: 99,
        editable: false
      }
      this.imageUrl5 = ''
      this.visibleFunction = true
    },
    editFunction (item) {
      this.formFunction = {
        function_id: item.function_id,
        title: item.title,
        content: item.content,
        img: item.img,
        sort: item.sort,
        editable: item.editable
      }
      this.imageUrl5 = item.img
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
          this.formFunction.img = this.imageUrl5
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
                item.img = this.formFunction.img
              }
            })
          }

          this.visibleFunction = false
          this.formFunction = {
            function_id: '',
            title: '',
            content: '',
            sort: 99,
            img: '',
            editable: false
          }
          this.imageUrl5 = ''
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
                console.log(item)
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
      this.imageUrl6 = ''
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
      this.imageUrl6 = item.img
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
          this.formCase.img = this.imageUrl6
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
          this.imageUrl6 = ''
        }
      })
    },

    // =====================================================================
    onChangeCate (value) {
      this.searchItem.cate_id = value.join(',')
      console.log(this.searchItem.cate_id)
    },
    onSelectChange (selectedRowKeys) {
      console.log('selectedRowKeys changed: ', selectedRowKeys)
      this.selectedRowKeys = selectedRowKeys
    },
    getParentColumnByCode () {
      this.$http
        .post('admin/column/getParentColumnByCode', {
          code: 'solution'
        })
        .then(res => {
          if (res.data.status === 'S') {
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
                  name: '核心产品',
                  url: ''
                }
              ]
            })
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    // 获取分类
    getCate () {
      this.$http
        .post('admin/cate', {
          page_size: 100,
          current_page: 1,
          parent_code: 'cate-solution'
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
    // 搜索数据
    handleSearch (e) {
      e.preventDefault()
      this.current_page = 1
      this.filterItem = JSON.parse(JSON.stringify(this.searchItem))
      this.getList(false)
    },
    // 重围搜索表单
    handleReset () {
      // this.form.resetFields();
      const date = new Date()
      this.searchItem = {
        cate_id: '',
        title: '',
        status: '',
        date: [
          moment('2020/01/01', 'YYYY-MM-DD'),
          moment(new Date(), 'YYYY-MM-DD')
        ],
        date_begin: '2020-01-01',
        date_end:
          date.getFullYear() +
          '-' +
          (date.getMonth() + 1) +
          '-' +
          date.getDate()
      }
    },
    // 分类选择
    handleCateChange (value) {
      console.log(value)
      if (value[value.length - 1]) {
        this.searchItem.cate_id = value[value.length - 1]
      } else {
        this.searchItem.cate_id = ''
      }
      console.log(this.searchItem)
    },
    // 日期选择
    onDatePickerChange (date, dateString) {
      this.searchItem.date_begin = dateString[0]
      this.searchItem.date_end = dateString[1]
    },
    getList (retry) {
      if (retry) {
        setTimeout(() => {
          this.getList(true)
        }, 2000)
      }
      this.tableLoading = true
      this.$http
        .post('admin/article', {
          page_size: this.pageSize,
          current_page: this.currentPage,
          cate_id: this.filterItem.cate_id,
          title: this.filterItem.title,
          status: this.filterItem.status,
          date_begin: this.filterItem.date_begin,
          date_end: this.filterItem.date_end,
          code: 'solution'
        })
        .then(res => {
          if (res.data.status === 'S') {
            this.total = res.data.total
            res.data.data.forEach(item => {
              item.editable = false
              item.oldSort = item.sort
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
        article_id: '',
        cate_id: null,
        title: '',
        sub_title: '',
        summary: '',
        code: this.$route.params.code,
        img: '',
        sort: 99,
        status: '1',
        content: '',
        create_date: moment(new Date(), 'YYYY-MM-DD'),
        web_title: '',
        meta_search_title: '',
        meta_author: '',
        meta_keywords: '',
        meta_copyright: '',
        meta_description: '',
        attribute1: '',
        attribute2: '',
        attribute3: '',
        attribute4: '',
        attribute5: '',
        attribute6: ''
      }
      this.imageUrl = ''
      this.imageUrl2 = ''
      this.imageUrl3 = ''
      this.imageUrl4 = ''
      this.imageUrl5 = ''
      this.imageUrl6 = ''
      this.visible = true
      this.action = '新增'
      this.functionData = []
      this.advantageData = []
      this.caseData = []
    },
    editItem (item) {
      this.form = {
        article_id: item.article_id,
        cate_id: JSON.parse(item.cate_ids),
        title: item.title,
        sub_title: item.sub_title,
        summary: item.summary,
        code: item.code,
        sort: item.sort,
        img: item.img,
        img2: item.img2,
        img3: item.img3,
        status: item.status ? item.status.toString() : '0',
        content: item.content,
        create_date: moment(item.create_date, 'YYYY-MM-DD'),
        web_title: item.web_title,
        meta_search_title: item.meta_search_title,
        meta_author: item.meta_author,
        meta_keywords: item.meta_keywords,
        meta_copyright: item.meta_copyright,
        attribute1: item.attribute1,
        attribute2: item.attribute2,
        attribute3: item.attribute3,
        attribute4: item.attribute4,
        attribute5: item.attribute5,
        attribute6: item.attribute6
      }
      this.imageUrl = item.img
      this.imageUrl2 = item.img2
      this.imageUrl3 = item.img3
      this.imageUrl4 = item.img4
      this.imageUrl5 = item.img5
      this.imageUrl6 = item.img6
      this.visible = true
      this.action = '编辑'
      if (item.attribute1 !== '' && item.attribute1.indexOf('[') > -1) {
        this.functionData = JSON.parse(item.attribute1)
        this.functionData.forEach(list => {
          list.editable = false
        })
      }
      if (item.attribute2 !== '' && item.attribute2.indexOf('[') > -1) {
        this.advantageData = JSON.parse(item.attribute2)
        this.advantageData.forEach(list => {
          list.editable = false
        })
      }
      if (item.attribute3 !== '' && item.attribute3.indexOf('[') > -1) {
        this.caseData = JSON.parse(item.attribute3)
        this.caseData.forEach(list => {
          list.editable = false
        })
      }
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
            .post('admin/article/del', {
              article_id: id
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
    delSelect () {
      const self = this
      this.$confirm({
        title: '提示',
        content: '确定要删除吗?',
        okText: '确定',
        cancelText: '取消',
        onOk () {
          self.$http
            .post('admin/article/delSelect', {
              ids: JSON.stringify(self.selectedRowKeys)
            })
            .then(res => {
              self.selectedRowKeys = []
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
              self.selectedRowKeys = []
              console.log(error)
            })
        }
      })
    },
    showEdit (item) {
      if (this.$store.getters.hasPermission('solution-edit')) {
        item.editable = true
        setTimeout(() => {
          document.querySelector('#input_' + item.article_id).focus()
        }, 500)
      }
    },
    updateSort (item) {
      if (item.sort === item.oldSort) {
        item.editable = false
      } else {
        this.$http
        .post('admin/article/updateSort', {
          article_id: item.article_id,
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
    handleOnSubmit () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          const params = JSON.parse(JSON.stringify(this.form))
          if (this.form.cate_id !== '') {
            params.cate_id = this.form.cate_id[this.form.cate_id.length - 1]
            params.cate_ids = JSON.stringify(this.form.cate_id)
          }
          params.img = this.imageUrl
          params.img2 = this.imageUrl2
          params.img3 = this.imageUrl3
          params.img4 = this.imageUrl4
          params.create_date = moment(params.create_date).format(
            'YYYY-MM-DD HH:mm:ss'
          )
          params.attribute1 = JSON.stringify(this.functionData)
          params.attribute2 = JSON.stringify(this.advantageData)
          params.attribute3 = JSON.stringify(this.caseData)
          params.code = 'solution'
          this.$http
            .post('admin/article/edit', params)
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
        .post('admin/article/modifyStatus', {
          article_id: item.article_id,
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
          this.imageUrl4 = info.file.response.data[0]
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
          this.imageUrl5 = info.file.response.data[0]
        } else {
          if (info.file.response.status === 'T') {
            this.$store.commit('setVisibleLogin', true)
          }
          this.$message.error(info.file.response.msg)
        }
      }
    },
    handleChange6 (info) {
      if (info.file.status === 'uploading') {
        this.loadingImg6 = true
        if (info && info.event && info.event.percent) {
          this.percentImg6 = info.event.percent
          this.percentImg6 = this.percentImg6.toFixed(2)
        }
        return
      }
      if (info.file.status === 'done') {
        this.loadingImg6 = false
        this.percentImg6 = 100
        if (info.file.response.data) {
          this.imageUrl6 = info.file.response.data[0]
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
