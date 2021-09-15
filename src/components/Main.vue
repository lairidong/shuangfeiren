<template>
  <a-layout id="components-layout-demo-fixed-sider">
    <a-layout-sider
      :style="{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0 }"
      :trigger="null"
      collapsible
      v-model="collapsed"
      theme="dark"
    >
      <div class="logo" style="background: none;">
        <img src="../assets/logo.png" alt style="height: 35px" />
      </div>
      <a-menu
        v-if="menuData.length"
        theme="dark"
        mode="inline"
        :selectedKeys="menuKey"
        :defaultOpenKeys="openKeys"
        :defaultSelectedKeys="['/main/base']"
      >
        <a-sub-menu v-for="item in menuData" :key="item.id">
          <span slot="title">
            <icon-font :type="item.icon" />
            <span>{{ item.name }}</span>
          </span>
          <template v-if="item.column_type==='menu'">
            <a-menu-item
              v-for="subItem in item.children"
              :key="subItem.path"
              @click="push(subItem.path)"
            >
              {{ subItem.name }}1
            </a-menu-item>
          </template>
          <template v-if="item.column_type==='column'">
            <template v-for="subItem in item.children">
              <template v-if="subItem.column_type==='column'">
                <a-sub-menu :title="subItem.name" :key="subItem.path">
                  <a-menu-item v-for="list in subItem.children" :key="list.path" @click="push(list.path)">{{ list.name }}</a-menu-item>
                </a-sub-menu>
              </template>
              <template v-else>
                <a-menu-item :key="subItem.path" @click="push(subItem.path)">
                  {{ subItem.name }}
                </a-menu-item>
              </template>
            </template>
          </template>
        </a-sub-menu>
        <!-- <a-menu-item v-for="item in menuData" :key="item.path" @click="push(item.path)">
          <icon-font :type="item.icon" />
          <span class="nav-text">
            {{ item.name }}
          </span>
        </a-menu-item> -->
      </a-menu>
    </a-layout-sider>
    <a-layout class="right-content" :class="collapsed ? 'max' : ''">
      <a-layout-header :style="{ background: '#fff', padding: 0 }">
        <div class="app-header">
          <a-icon
            class="trigger"
            :type="collapsed ? 'menu-unfold' : 'menu-fold'"
            @click="()=> collapsed = !collapsed"
          />
          <div style="flex: 1 1 0%;"></div>
          <div class="global-header-index-right">
            <a-button type="link" @click="clearCache"><a-icon type="rocket" />清除缓存</a-button>
          </div>
          <div class="global-header-index-right">
            <a-avatar src="./img/header.png" />
            <a-dropdown>
              <a class="ant-dropdown-link">
                {{ userName }}
                <a-icon type="down" />
              </a>
              <a-menu slot="overlay">
                <a-menu-item @click="visible=true">
                  <a rel="noopener noreferrer">
                    <a-icon type="edit"></a-icon>修改密码
                  </a>
                </a-menu-item>
                <a-menu-divider />
                <a-menu-item @click="logout()">
                  <a rel="noopener noreferrer">
                    <a-icon type="poweroff"></a-icon>退出
                  </a>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </div>
        </div>
      </a-layout-header>
      <a-layout-content :style="{ margin: '16px', overflow: 'initial' }">
        <div class="breadcrumb-box" v-if="breadcrumbData.length>0">
          <a-breadcrumb>
            <a-breadcrumb-item v-for="item in breadcrumbData" :key="item.key">
              <router-link :to="item.url">
                {{ item.name }}
              </router-link>
            </a-breadcrumb-item>
          </a-breadcrumb>
        </div>
        <div :style="{ padding: '24px', background: '#fff', marginTop: '5px' }">
          <router-view></router-view>
        </div>
      </a-layout-content>
      <!-- <a-layout-footer :style="{ textAlign: 'center' }">Ant Design ©2018 Created by Ant UED</a-layout-footer> -->
      <a-modal v-model="visible" title="修改密码" onOk="handleSubmit">
        <template slot="footer">
          <a-button key="back" @click="visible=false">取消</a-button>
          <a-button key="submit" type="primary" @click="handleSubmit">提交</a-button>
        </template>
        <a-form
          :form="form"
          :label-col="{ span: 24 }"
          :wrapper-col="{ span: 24 }"
          @submit="handleSubmit"
        >
          <a-form-item label="旧密码">
            <a-input-password
              v-decorator="['oldPwd', { rules: [{ required: true, message: '请输入旧密码!' }] }]"
            />
          </a-form-item>
          <a-form-item label="新密码">
            <a-input-password
              v-decorator="['pwd', { rules: [{ required: true, message: '请输入新密码!' }] }]"
            />
          </a-form-item>
          <a-form-item label="确认新密码">
            <a-input-password
              v-decorator="['rePwd', { rules: [{ required: true, message: '请再次输入新密码!' },{
                validator: compareToFirstPassword,
              },] }]"
            />
          </a-form-item>
        </a-form>
      </a-modal>
      <a-modal v-model="visibleLogin" title="重新登录" on-ok="handleLogin" :closable="false">
        <template slot="footer">
          <a-button key="back" type="danger" @click="handleReset" :disabled="user.name === '' || user.pwd === ''">
            重置
          </a-button>
          <a-button
            key="submit"
            type="primary"
            html-type="submit"
            :loading="loading"
            @click="handleLogin"
            :disabled="user.name === '' || user.pwd === ''">
            登录
          </a-button>
        </template>
        <p>登录已超时，请重新登录!</p>
        <a-form-model
          layout="vertical"
          :model="user"
          @keyup.13="handleLogin"
          @submit="handleLogin"
          @submit.native.prevent
          @cancel="visibleLogin=false">
          <a-form-model-item>
            <a-input v-model="user.name" placeholder="用户名" @keyup.13="handleLogin">
              <a-icon slot="prefix" type="user" style="color:rgba(0,0,0,.25)" />
            </a-input>
          </a-form-model-item>
          <a-form-model-item>
            <a-input v-model="user.pwd" type="password" placeholder="密码" @keyup.13="handleLogin">
              <a-icon slot="prefix" type="lock" style="color:rgba(0,0,0,.25)" />
            </a-input>
          </a-form-model-item>
        </a-form-model>
      </a-modal>
    </a-layout>
  </a-layout>
</template>

<script>
import { Icon } from 'ant-design-vue'
const IconFont = Icon.createFromIconfontCN({
  scriptUrl: './js/iconfont.js'
})
export default {
  components: {
    IconFont
  },
  data () {
    return {
      form: this.$form.createForm(this, { name: 'coordinated' }),
      visible: false,
      // visibleLogin: false,
      collapsed: false,
      userName: '',
      loading: false,
      user: {
        name: '',
        pwd: ''
      },
      openKeys: [],
      menuData: [
        // {
        //   id: 'menu1',
        //   name: '首页',
        //   path: '/main/base',
        //   icon: 'icon-home',
        //   children: [
        //     {
        //       name: '系统参数',
        //       path: '/main/base'
        //     }
        //   ]
        // },
        // {
        //   id: 'menu2',
        //   name: '企业管理',
        //   path: '/main/company-list',
        //   icon: 'icon-company',
        //   children: [
        //     {
        //       name: '企业列表',
        //       path: '/main/company-list'
        //     },
        //     {
        //       name: '部门列表',
        //       path: '/main/department-list/0'
        //     }
        //   ]
        // },
        // {
        //   id: 'menu3',
        //   name: '商品管理',
        //   icon: 'icon-product',
        //   children: [
        //     {
        //       name: '商品列表',
        //       path: '/main/goods-list'
        //     },
        //     {
        //       name: '添加商品',
        //       path: '/main/goods-edit/0'
        //     },
        //     {
        //       name: '商品分类',
        //       path: '/main/goods-cate'
        //     }
        //   ]
        // },
        // {
        //   id: 'menu4',
        //   name: '订单管理',
        //   path: '/main/order-list',
        //   icon: 'icon-order',
        //   children: [
        //     {
        //       name: '订单列表',
        //       path: '/main/order-list'
        //     }
        //   ]
        // },
        // {
        //   id: 'menu5',
        //   name: '单页管理',
        //   path: '/main/page-list',
        //   icon: 'icon-page',
        //   children: [
        //     {
        //       name: '单页列表',
        //       path: '/main/page-list'
        //     }
        //   ]
        // },
        // {
        //   id: 'menu999',
        //   name: '系统管理',
        //   path: '/main/web-config',
        //   icon: 'icon-config',
        //   children: [
        //     {
        //       name: '后台用户',
        //       path: '/main/admin-list'
        //     },
        //     {
        //       name: '菜单管理',
        //       path: '/main/column'
        //     },
        //     {
        //       name: '角色管理',
        //       path: '/main/role'
        //     },
        //     {
        //       name: '权限管理',
        //       path: '/main/permission'
        //     },
        //     {
        //       name: '网站SEO',
        //       path: '/main/web-seo'
        //     },
        //     {
        //       name: '基本配置',
        //       path: '/main/web-config'
        //     },
        //     {
        //       name: '操作日志',
        //       path: '/main/log'
        //     }
        //   ]
        // }
      ],
      menuKey: [],
      // breadcrumbData: [],
      intervalId: null
    }
  },
  name: 'Main',
  props: {},
  computed: {
    breadcrumbData: {
      get () {
        return this.$store.state.breadcrumbData
      },
      set (value) {
        //
      }
    },
    visibleLogin: {
      get () {
        if (this.$store.state.visibleLogin && this.$store.state.isLogin) {
          return true
        } else {
          return false
        }
      },
      set (value) {
        this.$store.commit('setVisibleLogin', value)
      }
    }
    // menuKey () {
    //   return [this.$store.state.menuKey];
    // }
  },
  watch: {
    $route: function () {
      const routes = this.$route.matched.concat()
      const query = this.$route.query
      let path = this.$route.path
      Object.keys(query).forEach((item, index) => {
        if (index === 0) {
          path = path + '?' + item + '=' + query[item]
        } else {
          path = path + '&' + item + '=' + query[item]
        }
      })
      this.menuKey = [path]
      // if (routes[routes.length - 1].path === '/main/cate/:code') {
      //   const query = this.$route.query
      //   let path = this.$route.path
      //   Object.keys(query).forEach((item, index) => {
      //     if (index === 0) {
      //       path = path + '?' + item + '=' + query[item]
      //     } else {
      //       path = path + '&' + item + '=' + query[item]
      //     }
      //   })
      //   this.menuKey = [path]
      // } else if (routes[routes.length - 1].path === '/main/article-list/:code') {
      //   this.menuKey = ['/main/article-list/' + this.$route.params.code]
      // } else if (routes[routes.length - 1].path === '/main/page-edit/:code') {
      //   this.menuKey = ['/main/page-edit/' + this.$route.params.code]
      // } else {
      //   this.menuKey = [routes[routes.length - 1].path]
      // }
      this.breadcrumbData = routes
    }
  },
  mounted () {
    setTimeout(() => {
      this.$store.commit('setLogin', true)
    }, 2000)
    this.user.name = sessionStorage.getItem('userName')
  },
  created () {
    const routes = this.$route.matched.concat()
    const query = this.$route.query
        let path = this.$route.path
        Object.keys(query).forEach((item, index) => {
          if (index === 0) {
            path = path + '?' + item + '=' + query[item]
          } else {
            path = path + '&' + item + '=' + query[item]
          }
        })
      this.menuKey = [path]
    // if (routes[routes.length - 1].path === '/main/cate/:code') {
    //   this.menuKey = ['/main/cate/' + this.$route.params.code]
    // } else if (routes[routes.length - 1].path === '/main/article-list/:code') {
    //   this.menuKey = ['/main/article-list/' + this.$route.params.code]
    // } else if (routes[routes.length - 1].path === '/main/page-edit/:code') {
    //   this.menuKey = ['/main/page-edit/' + this.$route.params.code]
    // } else {
    //   this.menuKey = [routes[routes.length - 1].path]
    // }
    this.breadcrumbData = routes
    if (sessionStorage.getItem('userName')) {
      this.userName = sessionStorage.getItem('userName')
    }

    // this.$root.$on('breadcrumb', (data) => {
    //   this.breadcrumbData = data.breadcrumbData;
    //   this.menuKey = [data.menuKey];
    // })

    this.$root.$on('relogin', (data) => {
      this.visibleLogin = true
    })

    this.intervalId = setInterval(() => {
      this.refreshToken()
    }, 60000)
    this.getColumn()
  },
  methods: {
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.$http
            .post('admin/pwd', {
              oldPwd: values.oldPwd,
              pwd: values.pwd,
              rePwd: values.rePwd
            })
            .then(res => {
              if (res.data.status === 'S') {
                this.$message.success('修改成功')
                this.visible = false
                this.form.resetFields()
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
      })
    },
    compareToFirstPassword (rule, value, callback) {
      const form = this.form
      if (value && value !== form.getFieldValue('pwd')) {
        callback(new Error('新密码和确认新密码不一致!'))
      } else {
        callback()
      }
    },
    handleLogin () {
      this.$http
        .post('admin/login', this.user)
        .then(res => {
          if (res.data.status === 'S') {
            sessionStorage.setItem('userName', this.user.name)
            localStorage.setItem('token', res.data.token)
            localStorage.setItem('expired_time', res.data.expired_time)
            this.userName = this.user.name
            this.$store.commit('setVisibleLogin', false)
            this.$store.commit('setHeaders', res.data.token)
            this.$root.$emit('updateToken', res.data.token)
            this.getColumn()
          } else {
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
    handleReset () {
      this.usser = {
        name: '',
        password: ''
      }
    },
    push (path) {
      this.$router.push({ path: path })
    },
    getColumn () {
      const query = this.$route.query
      let path = this.$route.path
      Object.keys(query).forEach((item, index) => {
        if (index === 0) {
          path = path + '?' + item + '=' + query[item]
        } else {
          path = path + '&' + item + '=' + query[item]
        }
      })
      this.$http
        .post('admin/column/getColumn', {})
        .then(res => {
          if (res.data.status === 'S') {
            this.menuData = []
            this.openKeys = []
            this.menuData.push({
              id: 'menu0',
              name: '首页',
              path: '/main/base',
              icon: 'icon-home',
              column_type: 'column',
              children: [
                {
                  name: '系统参数',
                  path: '/main/base',
                  column_type: 'menu'
                }
              ]
            })
            const permission = []
            res.data.data.forEach(item => {
              if (item.children) {
                item.children.forEach(item2 => {
                  if (item2.column_type === 'button') {
                    permission.push({
                      code: item2.code,
                      isEnabled: item2.isEnabled
                    })
                  } else {
                    if (item2.children) {
                      item2.children.forEach(item3 => {
                        if (item3.column_type === 'button') {
                          permission.push({
                            code: item3.code,
                            isEnabled: item3.isEnabled
                          })
                        } else {
                          if (item3.children) {
                            item3.children.forEach(item4 => {
                              if (item4.column_type === 'button') {
                                permission.push({
                                  code: item4.code,
                                  isEnabled: item4.isEnabled
                                })
                              }
                            })
                          }
                        }
                      })
                    }
                  }
                })
              }
            })
            this.$store.commit('setPermission', permission)
            res.data.data.forEach(item => {
              if (!item.isEnabled) {
                return
              }
              this.openKeys.push('menu' + item.column_id)
              let children = []
              if (item.column_type === 'column') {
                item.children.forEach(item2 => {
                  if (!item2.isEnabled) {
                    return
                  }
                  if (item2.column_type === 'column') {
                    const children2 = []
                    if (item2.children) {
                      item2.children.forEach(item3 => {
                        if (item3.column_type === 'menu') {
                          children2.push({
                            name: item3.column_name,
                            path: item3.url,
                            column_type: item3.column_type
                          })
                        }
                      })
                    }
                    children.push({
                      name: item2.column_name,
                      column_type: item2.column_type,
                      children: children2
                    })
                  } else {
                    children.push({
                      name: item2.column_name,
                      path: item2.url,
                      column_type: item2.column_type
                    })
                  }
                })
              } else {
              children = [
                  {
                    name: '分类管理',
                    path: '/cate/' + item.code
                  },
                  {
                    name: '信息列表',
                    path: '/article/' + item.code
                  }
                ]
                if (item.column_type === 'page') {
                  children = [{
                    name: '内容编辑',
                    path: '/page-edit/' + item.code
                  }]
                }
              }

              this.menuData.push({
                id: 'menu' + item.column_id,
                name: item.column_name,
                path: '',
                icon: item.icon,
                children: children,
                column_type: item.column_type
              })
            })
            this.menuData.forEach(item => {
              item.children.forEach(item2 => {
                if (item2.path === path) {
                  this.openKeys = [item.id]
                }
              })
            })
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    refreshToken () {
      const expiredTime = parseInt(localStorage.getItem('expired_time'))
      const now = (new Date()).getTime()
      if (expiredTime) {
        if ((expiredTime - now) / 1000 < 60 * 28) {
          this.$http
            .post('admin/base/refresh_token', {})
            .then(res => {
              if (res.data.status === 'S') {
                localStorage.setItem('token', res.data.token)
                localStorage.setItem('expired_time', res.data.expired_time)
              } else if (res.data.status === 'T') {
                if (this.intervalId) {
                  clearInterval(this.intervalId)
                }
              }
            })
            .catch(error => {
              console.log(error)
            })
        }
      }
    },
    logout () {
      const self = this
      this.$confirm({
        title: '确定要退出吗?',
        content: '',
        okText: '退出',
        okType: 'danger',
        cancelText: '取消',
        onOk () {
          self.$http
            .post('admin/login/logout', {})
            .then(res => {
              if (res.data.status === 'S') {
                sessionStorage.removeItem('userName')
                localStorage.removeItem('token')
                self.$router.push({ path: '/login' })
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
        },
        onCancel () {
          console.log('Cancel')
        }
      })
    },
    clearCache () {
      this.$http
        .post('admin/clear', {})
        .then(res => {
          this.$message.success('清除成功')
        })
        .catch(error => {
          console.log(error)
        })
    }
  }
}
</script>

<style lang="less">
#components-layout-demo-fixed-sider .trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
}

#components-layout-demo-fixed-sider .trigger:hover {
  color: #1890ff;
}
#components-layout-demo-fixed-sider .logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px;
}
.right-content {
  margin-left: 200px;
  // overflow-x: unset !important;
  transition: all 0.2s;
  &.max {
    margin-left: 80px;
  }
  .ant-layout-header {
    position: sticky;
    top: 0;
    z-index: 2;
    .app-header {
      position: relative;
      display: flex;
      -webkit-box-align: center;
      align-items: center;
      height: 64px;
      padding: 0;
      background: #fff;
      box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
      .global-header-index-right {
        float: right;
        height: 64px;
        margin-left: auto;
        margin-right: 20px;
        overflow: hidden;
      }
    }
  }
  .breadcrumb-box {
    padding: 24px;
    margin: -23px -16px 16px -16px;
    background: #fff;
  }
}
.ant-menu-item > a {
  display: inline;
}
.ant-btn-danger {
  color: #fff;
  background-color: #ff4d4f;
  border-color: #ff4d4f;
  text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.12);
  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.045);
  &:hover {
    color: #fff;
    background-color: #ff7875;
    border-color: #ff7875;
  }
}
</style>
