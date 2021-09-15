import Vue from 'vue'

import VueRouter from 'vue-router'
import { Layout, Menu, Icon, Input, Button, Form, Dropdown, Avatar, Modal, Message, Table, Breadcrumb, Upload, Row, Col, Drawer, Radio, Tooltip, Notification, DatePicker, Select, Card, Switch, Tag, List, Checkbox, Divider, Cascader, Tabs, InputNumber, Descriptions, Tree, FormModel, Affix, Popconfirm } from 'ant-design-vue'
import store from './store'
import App from './App.vue'
import axios from 'axios'
import qs from 'qs'
import '@babel/polyfill'
import 'core-js/stable'
import 'regenerator-runtime/runtime'
import './assets/css/global.less'
import './directives/action'

import httpConst from '@/http_const'

import BaiduMap from 'vue-baidu-map'
Vue.use(BaiduMap, {
  ak: '3IptthNMe8vFRi0cB3O3l65VAoTn5L6T'
})

Vue.use(VueRouter)
Vue.use(Layout)
Vue.use(Menu)
Vue.use(Icon)
Vue.use(Input)
Vue.use(Button)
Vue.use(Form)
Vue.use(Dropdown)
Vue.use(Avatar)
Vue.use(Modal)
Vue.use(Message)
Vue.use(Table)
Vue.use(Breadcrumb)
Vue.use(Upload)
Vue.use(Row)
Vue.use(Col)
Vue.use(Drawer)
Vue.use(Radio)
Vue.use(Dropdown)
Vue.use(Tooltip)
Vue.use(Notification)
Vue.use(DatePicker)
Vue.use(Select)
Vue.use(Card)
Vue.use(Switch)
Vue.use(Tag)
Vue.use(List)
Vue.use(Checkbox)
Vue.use(Divider)
Vue.use(Cascader)
Vue.use(Tabs)
Vue.use(InputNumber)
Vue.use(Descriptions)
Vue.use(Tree)
Vue.use(FormModel)
Vue.use(Affix)
Vue.use(Popconfirm)

Vue.prototype.$confirm = Modal.confirm
Vue.prototype.$error = Modal.error
Vue.prototype.$info = Modal.info
Vue.prototype.$warning = Modal.warning
Vue.prototype.$message = Message
Vue.prototype.$notification = Notification

Vue.config.productionTip = false

Vue.prototype.$baseUrl = httpConst.baseUrl

// 给Vue实例添加一个属性，这样在每个实例中就可以使用this.$http来访问axios实例了
Vue.prototype.$http = axios

// 一些默认的参数
axios.defaults.baseURL = httpConst.baseUrl

// 实例对象
axios.create({
  timeout: 6000,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})

// 请求拦截器：在发送请求前拦截
axios.interceptors.request.use(config => {
  // console.log('请求发送前拦截')
  if (localStorage.getItem('token')) {
    config.headers.common['AccessToken'] = localStorage.getItem('token')
  }
  if (process.env.NODE_ENV === 'development') {
    config.url = config.url + '?voucher=token'
  } else {
    config.url = config.url + '?voucher=session'
  }
  config.data = qs.stringify(config.data) // 转为formdata数据格式
  return config
}, error => {
  return Promise.reject(error)
})

let hasShowModal = false

// 响应拦截器：在请求响应之后拦截
axios.interceptors.response.use(response => {
  // console.log('请求响应后处理');
  // console.log(response.data);
  if (response.data) {
    if (typeof (response.data.status) !== 'undefined') {
      if (response.data.status === 'T') {
        if (!hasShowModal) {
          hasShowModal = true
          store.commit('setVisibleLogin', true)
          setTimeout(() => {
            hasShowModal = false
          }, 3000)
          // Modal.error({
          //   title: '提示',
          //   // content: response.data.msg,
          // content: h => <div style="color: red;">{ response.data.msg }</div>,
          //   onOk () {
          //     hasShowModal = false
          //     window.location.hash = '/login'
          //   }
          // })
        }
        return response
      } else {
        return response
      }
    } else {
      return response
    }
  }
}, error => {
  return Promise.reject(error)
})

// 定义路由
const routes = [
  {
    path: '/login',
    component: () => import('./components/Login')
  },
  {
    path: '/main',
    component: () => import('./components/Main'),
    meta: { title: '首页' },
    children: [
      {
        path: 'base',
        component: () => import('./components/Base'),
        meta: { title: '欢迎页' }
      }
    ],
    redirect: '/main/base'
  }//,
  // {
  //   path: '*',
  //   redirect: '/login'
  // }
]

const dynamicRoutes = {
  column: {
    path: 'column',
    name: 'column',
    component: () => import('./components/ColumnList'),
    meta: { title: '企业管理' }
  },
  cate: {
    path: 'cate/:code',
    name: 'cate',
    component: () => import('./components/Cate'),
    meta: { title: '分类管理' }
  },
  article: {
    path: 'article/:cate/:code',
    component: () => import('./components/ArticleList'),
    meta: { title: '信息列表' }
  },
  link: {
    path: 'link',
    component: () => import('./components/Link'),
    meta: { title: '信息编辑' }
  },
  banners: {
    path: 'banners',
    component: () => import('./components/Banner'),
    meta: { title: '信息编辑' }
  },
  img: {
    path: 'img/:code',
    component: () => import('./components/Img'),
    meta: { title: '信息编辑' }
  },
  file: {
    path: 'file/:code',
    component: () => import('./components/File'),
    meta: { title: '信息编辑' }
  },
  singlePage: {
    path: 'single-page/:code',
    component: () => import('./components/SinglePage'),
    meta: { title: '信息编辑' }
  },
  services: {
    path: 'services',
    component: () => import('./components/Services'),
    meta: { title: '信息编辑' }
  },
  scheme: {
    path: 'scheme',
    component: () => import('./components/Scheme'),
    meta: { title: '信息编辑' }
  },
  team: {
    path: 'team',
    component: () => import('./components/Team'),
    meta: { title: '信息编辑' }
  },
  history: {
    path: 'history',
    component: () => import('./components/History'),
    meta: { title: '信息编辑' }
  },
  about: {
    path: 'about',
    component: () => import('./components/About'),
    meta: { title: '信息编辑' }
  },
  contact: {
    path: 'contact',
    component: () => import('./components/Contact'),
    meta: { title: '信息编辑' }
  },
  qualityPolicy: {
    path: 'quality-policy',
    component: () => import('./components/QualityPolicy'),
    meta: { title: '信息编辑' }
  },
  webSeo: {
    path: 'web-seo',
    component: () => import('./components/Seo'),
    meta: { title: '信息编辑' }
  },
  adminList: {
    path: 'admin-list',
    component: () => import('./components/AdminList'),
    meta: { title: '管理员' }
  },
  webConfig: {
    path: 'web-config',
    component: () => import('./components/WebConfig'),
    meta: { title: '网站配置' }
  },
  database: {
    path: 'database',
    component: () => import('./components/Database'),
    meta: { title: '网站配置' }
  },
  log: {
    path: 'log',
    component: () => import('./components/Log'),
    meta: { title: '操作日志' }
  },
  ad: {
    path: 'ad',
    component: () => import('./components/Ad'),
    meta: { title: '广告图' }
  },
  product: {
    path: 'product',
    component: () => import('./components/Product'),
    meta: { title: '核心产品' }
  },
  solution: {
    path: 'solution',
    component: () => import('./components/Solution'),
    meta: { title: '解决方案' }
  },
  chip: {
    path: 'chip',
    component: () => import('./components/Chip'),
    meta: { title: '5G芯片' }
  },
  intelligentLamppost: {
    path: 'intelligent-lamppost',
    component: () => import('./components/IntelligentLamppost'),
    meta: { title: '智慧灯杆' }
  },
  newInfrastructure: {
    path: 'new-infrastructure',
    component: () => import('./components/NewInfrastructure'),
    meta: { title: '智慧灯杆' }
  },
  company: {
    path: 'company',
    component: () => import('./components/Company'),
    meta: { title: '旗下公司' }
  },
  corporateCulture: {
    path: 'corporate-culture',
    component: () => import('./components/CorporateCulture'),
    meta: { title: '企业文化' }
  },
  dynamics: {
    path: 'dynamics',
    component: () => import('./components/Dynamics'),
    meta: { title: '聚焦动态' }
  },
  honors: {
    path: 'honors',
    component: () => import('./components/Honors'),
    meta: { title: '荣誉资质' }
  },
  job: {
    path: 'job',
    component: () => import('./components/Job'),
    meta: { title: '人才招聘' }
  },
  equipment: {
    path: 'equipment',
    component: () => import('./components/Equipment'),
    meta: { title: '生产设备' }
  },
  strength: {
    path: 'strength',
    component: () => import('./components/Strength'),
    meta: { title: '研发实力' }
  },
  consultation: {
    path: 'consultation',
    component: () => import('./components/Consultation'),
    meta: { title: '投资者咨询' }
  },
  governance: {
    path: 'governance',
    component: () => import('./components/Governance'),
    meta: { title: '公司治理' }
  },
  announcements: {
    path: 'announcements',
    component: () => import('./components/Announcements'),
    meta: { title: '公司公告' }
  },
  case: {
    path: 'case',
    component: () => import('./components/Case'),
    meta: { title: '案例中心' }
  },
  sellingNetwork: {
    path: 'selling-network',
    component: () => import('./components/SellingNetwork'),
    meta: { title: '销售网络' }
  },
  service: {
    path: 'service',
    component: () => import('./components/Service'),
    meta: { title: '售后服务' }
  },
  corporatePhilosophy: {
    path: 'corporate-philosophy',
    component: () => import('./components/CorporatePhilosophy'),
    meta: { title: '企业理念' }
  },
  subsidiary: {
    path: 'subsidiary',
    component: () => import('./components/Subsidiary'),
    meta: { title: '旗下子公司' }
  },
  feedback: {
    path: 'feedback',
    component: () => import('./components/Feedback'),
    meta: { title: '留言管理' }
  },
  design: {
    path: 'design',
    component: () => import('./components/Design'),
    meta: { title: '设计' }
  },
  engineeringHome: {
    path: 'engineering-home',
    component: () => import('./components/EngineeringHome'),
    meta: { title: '工程管理' }
  },
  designIntroduction: {
    path: 'design-introduction',
    component: () => import('./components/DesignIntroduction'),
    meta: { title: '设计' }
  },
  game: {
    path: 'game',
    component: () => import('./components/Game'),
    meta: { title: '设计' }
  },
  brand: {
    path: 'brand-support',
    component: () => import('./components/Brand'),
    meta: { title: '品牌支持' }
  },
  jointVenture: {
    path: 'joint-venture',
    component: () => import('./components/JointVenture'),
    meta: { title: '联营合作' }
  },
  join: {
    path: 'join',
    component: () => import('./components/Join'),
    meta: { title: '项目介绍' }
  },
  footerMenu: {
    path: 'footer-menu',
    component: () => import('./components/FooterMenu'),
    meta: { title: '底部菜单' }
  },
  map: {
    path: 'map',
    component: () => import('./components/Map'),
    meta: { title: '美丽地图' }
  },
  share: {
    path: 'share/:cate/:code',
    component: () => import('./components/Share'),
    meta: { title: '分享' }
  },
  member: {
    path: 'member',
    component: () => import('./components/Member'),
    meta: { title: '会员' }
  },
  development: {
    path: 'development',
    component: () => import('./components/Development'),
    meta: { title: '可持续发展' }
  },
  productDevelopment: {
    path: 'product-development',
    component: () => import('./components/ProductDevelopment'),
    meta: { title: '产品研发' }
  },
  testDetection: {
    path: 'test-detection',
    component: () => import('./components/TestDetection'),
    meta: { title: '试验检测' }
  },
  integratedSupply: {
    path: 'integrated-supply',
    component: () => import('./components/IntegratedSupply'),
    meta: { title: '首页内容' }
  },
  partner: {
    path: 'partner',
    component: () => import('./components/Partner'),
    meta: { title: '业务覆盖提醒' }
  },
  exhibitionCenter: {
    path: 'exhibition-center',
    component: () => import('./components/ExhibitionCenter'),
    meta: { title: '展示中心' }
  },
  productIntroduction: {
    path: 'product-introduction',
    component: () => import('./components/ProductIntroduction'),
    meta: { title: '产品介绍' }
  },
  home: {
    path: 'home',
    component: () => import('./components/Home'),
    meta: { title: '首页内容' }
  },
  guidePageHome: {
    path: 'guide-page-home',
    component: () => import('./components/GuidePageHome'),
    meta: { title: '引导页首页内容' }
  },
  guidePageAbout: {
    path: 'guide-page-about',
    component: () => import('./components/GuidePageAbout'),
    meta: { title: '引导页关于我们内容' }
  },
  talentConcept: {
    path: 'talent-concept',
    component: () => import('./components/TalentConcept'),
    meta: { title: '人才理念' }
  },
  supplyChainSolution: {
    path: 'supply-chain-solution',
    component: () => import('./components/SupplyChainSolution'),
    meta: { title: '人才理念' }
  },
  chairman: {
    path: 'chairman',
    component: () => import('./components/Chairman'),
    meta: { title: '董事长致辞' }
  },
  toLogin: {
    path: '*',
    redirect: '/login'
  }
}

const routesKey = []

Vue.filter('number2time', function (value) {
  if (!value) return '00:00:00'
  let hour = 0; let minute = 0; let second = 0
  hour = Math.floor(value / 3600)
  value = value - hour * 3600
  minute = Math.floor(value / 60)
  second = Math.floor(value - Math.floor(value / 60) * 60)
  return `${hour > 0 ? hour + '小时' : ''}${minute > 0 ? minute + '分' : ''}${second}秒`
  // return (hour < 10 ? '0' + hour : hour) + ":" + (minute < 10 ? '0' + minute : minute) + ":" + (second < 10 ? '0' + second : second)
})

Vue.filter('br2html', function (value) {
  if (!value) return ''
  value = value.replace('\n', '<br>')
  return value
})

const originalPush = VueRouter.prototype.push

VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

// 实例化
const router = new VueRouter({
  routes: routes
})

router.beforeEach(async (to, from, next) => {
  if (to.path === '/login') {
    next()
  } else {
    if (!store.state.hasSetRoutes) {
      try {
        await axios
          .post('admin/column/getColumn', {})
          .then(res => {
            if (res.data.status === 'S') {
              res.data.data.forEach(item => {
                if (item.column_type === 'menu') {
                  addRoutes(item)
                } else if (item.column_type === 'column') {
                  if (item.children) {
                    item.children.forEach(item2 => {
                      if (item2.column_type === 'menu') {
                        addRoutes(item2)
                      } else if (item.column_type === 'column') {
                        if (item.children) {
                          item2.children.forEach(item3 => {
                            if (item3.column_type === 'menu') {
                              addRoutes(item3)
                            }
                          })
                        }
                      }
                    })
                  }
                }
              })
              router.addRoutes([router.options.routes[1]])
              router.options.routes.push(dynamicRoutes.toLogin)
              router.addRoutes([dynamicRoutes.toLogin])
              store.commit('setRoutes', true)
              next({ path: to.fullPath })
            } else {
              next(`/login`)
            }
          })
          .catch(error => {
            console.log(error)
          })
        // next({ path: to.path || '/' })
      } catch (error) {
          next(`/login`)
      }
    } else {
      next()
    }
  }
})

const addRoutes = (item) => {
  if (item.url.indexOf('main/column') > -1) {
    pushRoutes('column')
  } else if (item.url.indexOf('main/cate') > -1) {
    pushRoutes('cate')
  } else if (item.url.indexOf('main/article') > -1) {
    pushRoutes('article')
  } else if (item.url.indexOf('main/link') > -1) {
    pushRoutes('link')
  } else if (item.url.indexOf('main/banners') > -1) {
    pushRoutes('banners')
  } else if (item.url.indexOf('main/img') > -1) {
    pushRoutes('img')
  } else if (item.url.indexOf('main/file') > -1) {
    pushRoutes('file')
  } else if (item.url.indexOf('main/single-page') > -1) {
    pushRoutes('singlePage')
  } else if (item.url.indexOf('main/services') > -1) {
    pushRoutes('services')
  } else if (item.url.indexOf('main/scheme') > -1) {
    pushRoutes('scheme')
  } else if (item.url.indexOf('main/team') > -1) {
    pushRoutes('team')
  } else if (item.url.indexOf('main/history') > -1) {
    pushRoutes('history')
  } else if (item.url.indexOf('main/about') > -1) {
    pushRoutes('about')
  } else if (item.url.indexOf('main/contact') > -1) {
    pushRoutes('contact')
  } else if (item.url.indexOf('main/quality-policy') > -1) {
    pushRoutes('qualityPolicy')
  } else if (item.url.indexOf('main/web-seo') > -1) {
    pushRoutes('webSeo')
  } else if (item.url.indexOf('main/admin-list') > -1) {
    pushRoutes('adminList')
  } else if (item.url.indexOf('main/web-config') > -1) {
    pushRoutes('webConfig')
  } else if (item.url.indexOf('main/database') > -1) {
    pushRoutes('database')
  } else if (item.url.indexOf('main/log') > -1) {
    pushRoutes('log')
  } else if (item.url.indexOf('main/solution') > -1) {
    pushRoutes('solution')
  } else if (item.url.indexOf('main/chip') > -1) {
    pushRoutes('chip')
  } else if (item.url.indexOf('main/intelligent-lamppost') > -1) {
    pushRoutes('intelligentLamppost')
  } else if (item.url.indexOf('main/new-infrastructure') > -1) {
    pushRoutes('newInfrastructure')
  } else if (item.url.indexOf('main/company') > -1) {
    pushRoutes('company')
  } else if (item.url.indexOf('main/corporate-culture') > -1) {
    pushRoutes('corporateCulture')
  } else if (item.url.indexOf('main/honors') > -1) {
    pushRoutes('honors')
  } else if (item.url.indexOf('main/dynamics') > -1) {
    pushRoutes('dynamics')
  } else if (item.url.indexOf('main/ad') > -1) {
    pushRoutes('ad')
  } else if (item.url.indexOf('main/job') > -1) {
    pushRoutes('job')
  } else if (item.url.indexOf('main/equipment') > -1) {
    pushRoutes('equipment')
  } else if (item.url.indexOf('main/strength') > -1) {
    pushRoutes('strength')
  } else if (item.url.indexOf('main/consultation') > -1) {
    pushRoutes('consultation')
  } else if (item.url.indexOf('main/governance') > -1) {
    pushRoutes('governance')
  } else if (item.url.indexOf('main/announcements') > -1) {
    pushRoutes('announcements')
  } else if (item.url.indexOf('main/case') > -1) {
    pushRoutes('case')
  } else if (item.url.indexOf('main/selling-network') > -1) {
    pushRoutes('sellingNetwork')
  } else if (item.url.indexOf('main/service') > -1) {
    pushRoutes('service')
  } else if (item.url.indexOf('main/corporate-philosophy') > -1) {
    pushRoutes('corporatePhilosophy')
  } else if (item.url.indexOf('main/subsidiary') > -1) {
    pushRoutes('subsidiary')
  } else if (item.url.indexOf('main/feedback') > -1) {
    pushRoutes('feedback')
  } else if (item.url.indexOf('main/engineering-home') > -1) {
    pushRoutes('engineeringHome')
  } else if (item.url.indexOf('main/design-introduction') > -1) {
    pushRoutes('designIntroduction')
  } else if (item.url.indexOf('main/design') > -1) {
    pushRoutes('design')
  } else if (item.url.indexOf('main/game') > -1) {
    pushRoutes('game')
  } else if (item.url.indexOf('main/brand-support') > -1) {
    pushRoutes('brand')
  } else if (item.url.indexOf('main/joint-venture') > -1) {
    pushRoutes('jointVenture')
  } else if (item.url.indexOf('main/join') > -1) {
    pushRoutes('join')
  } else if (item.url.indexOf('main/footer-menu') > -1) {
    pushRoutes('footerMenu')
  } else if (item.url.indexOf('main/map') > -1) {
    pushRoutes('map')
  } else if (item.url.indexOf('main/share') > -1) {
    pushRoutes('share')
  } else if (item.url.indexOf('main/member') > -1) {
    pushRoutes('member')
  } else if (item.url.indexOf('main/development') > -1) {
    pushRoutes('development')
  } else if (item.url.indexOf('main/product-development') > -1) {
    pushRoutes('productDevelopment')
  } else if (item.url.indexOf('main/test-detection') > -1) {
    pushRoutes('testDetection')
  } else if (item.url.indexOf('main/integrated-supply') > -1) {
    pushRoutes('integratedSupply')
  } else if (item.url.indexOf('main/partner') > -1) {
    pushRoutes('partner')
  } else if (item.url.indexOf('main/exhibition-center') > -1) {
    pushRoutes('exhibitionCenter')
  } else if (item.url.indexOf('main/product-introduction') > -1) {
    pushRoutes('productIntroduction')
  } else if (item.url.indexOf('main/product') > -1) {
    pushRoutes('product')
  } else if (item.url.indexOf('main/home') > -1) {
    pushRoutes('home')
  } else if (item.url.indexOf('main/guide-page-home') > -1) {
    pushRoutes('guidePageHome')
  } else if (item.url.indexOf('main/guide-page-about') > -1) {
    pushRoutes('guidePageAbout')
  } else if (item.url.indexOf('main/talent-concept') > -1) {
    pushRoutes('talentConcept')
  } else if (item.url.indexOf('main/supply-chain-solution') > -1) {
    pushRoutes('supplyChainSolution')
  } else if (item.url.indexOf('main/chairman') > -1) {
    pushRoutes('chairman')
  }
}

const pushRoutes = (key) => {
  if (!routesKey.includes(key)) {
    routesKey.push(key)
    router.options.routes[1].children.push(dynamicRoutes[key])
  }
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
