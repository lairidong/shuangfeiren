<template>
  <div>
    <div class="title">
      网站基本信息
      <span>欢迎进入派点互动后台管理系统</span>
    </div>

    <div class="sub-title">
      <a-icon type="setting" />系统参数
    </div>

    <div class="params-box">
      <a-descriptions bordered :column="2">
        <a-descriptions-item label="操作系统">{{ data.info1 }}</a-descriptions-item>
        <a-descriptions-item label="运行环境">{{ data.info2 }}</a-descriptions-item>
        <a-descriptions-item label="PHP运行方式">{{ data.info3 }}</a-descriptions-item>
        <a-descriptions-item label="PHP版本">{{ data.info4 }}</a-descriptions-item>
        <a-descriptions-item label="上传附件限制">{{ data.info5 }}</a-descriptions-item>
        <a-descriptions-item label="执行时间限制">{{ data.info6 }}</a-descriptions-item>
        <a-descriptions-item label="服务器时间">{{ data.info7 }}</a-descriptions-item>
        <a-descriptions-item label="北京时间">{{ data.info8 }}</a-descriptions-item>
        <a-descriptions-item label="服务器域名/IP">{{ data.info9 }}</a-descriptions-item>
        <a-descriptions-item label="剩余空间">{{ data.info10 }}</a-descriptions-item>
        <a-descriptions-item label="register_globals">{{ data.info11 }}</a-descriptions-item>
        <a-descriptions-item label="magic_quotes_gpc">{{ data.info12 }}</a-descriptions-item>
        <a-descriptions-item label="magic_quotes_runtime">{{ data.info13 }}</a-descriptions-item>
        <a-descriptions-item label="浏览器型号">{{ data.info14[0] }}{{ data.info14[1] }}</a-descriptions-item>
      </a-descriptions>
    </div>
  </div>
</template>

<script>
// import VeHistogram from 'v-charts/lib/histogram.common';
// import VePie from 'v-charts/lib/pie.common'
export default {
  components: {
    // VeHistogram,
    // VePie
  },
  data () {
    return {
      data: {
        info1: '',
        info2: '',
        info3: '',
        info4: '',
        info5: '',
        info6: '',
        info7: '',
        info8: '',
        info9: '',
        info10: '',
        info11: '',
        info12: '',
        info13: '',
        info14: ['', '']
      }
    }
  },
  name: 'Base',
  props: {},
  beforeCreate () {},
  created () {
    this.info()
  },
  methods: {
    info () {
      this.$http
        .post('admin/system', {})
        .then(res => {
          if (res.data.status === 'S') {
            this.data = res.data.data
          }
        })
        .catch(error => {
          console.log(error)
        })
    }
  }
}
</script>

<style scoped lang="less">
.title {
  font-size: 30px;
  font-weight: 300;
  font-family: "Open Sans";
  span {
    font-size: 14px;
    letter-spacing: 0px;
    font-weight: 300;
    color: #888;
  }
}
.sub-title {
  font-size: 18px;
  font-weight: 400;
  margin-top: 20px;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #ddd;
  i {
    font-size: 14px;
    color: #999;
    margin-right: 5px;
  }
}
</style>
