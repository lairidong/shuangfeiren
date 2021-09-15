<template>
  <div class="login-wrapper">
    <div class="form-wrapper">
      <div class="form-box">
        <a-form
          id="components-form-demo-normal-login"
          :form="form"
          class="login-form"
          @submit="handleSubmit"
        >
          <a-form-item>
            <a-input
              @change="onChange"
              v-decorator="[
                'userName',
                { rules: [{ required: true, message: '请输入用户名!' }] },
              ]"
              placeholder="用户名"
            >
              <a-icon slot="prefix" type="user" style="color: rgba(0,0,0,.25)" />
            </a-input>
          </a-form-item>
          <a-form-item>
            <a-input
              v-decorator="[
                'password',
                { rules: [{ required: true, message: '请输入密码!' }] },
              ]"
              type="password"
              placeholder="密码"
            >
              <a-icon slot="prefix" type="lock" style="color: rgba(0,0,0,.25)" />
            </a-input>
          </a-form-item>
          <a-form-item :style="{ textAlign: 'right' }">
            <a-button type="primary" icon="login" html-type="submit" class="login-form-button">登录</a-button>
          </a-form-item>
        </a-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  name: 'Login',
  props: {},
  beforeCreate () {
    this.form = this.$form.createForm(this, { name: 'normal_login' })
  },
  methods: {
    onChange (e) {
      console.log(e)
    },
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          // console.log("Received values of form: ", values);
          this.$http
            .post('admin/login', {
              name: values.userName,
              pwd: values.password
              })
            .then(res => {
              if (res.data.status === 'S') {
                sessionStorage.setItem('userName', values.userName)
                localStorage.setItem('token', res.data.token)
                localStorage.setItem('expired_time', res.data.expired_time)
                this.$store.commit('setVisibleLogin', false)
                this.$store.commit('setLogin', false)
                this.$store.commit('setHeaders', res.data.token)
                this.$router.push({ path: '/main' })
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
        }
      })
    }
  }
}
</script>

<style lang="less">
.login-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  background: #e7e0de;
  .form-wrapper {
    width: 1100px;
    height: 400px;
    overflow: hidden;
    padding: 30px;
    background: url("../assets/img/bg_index.gif") no-repeat;
    position: absolute;
    left: 50%;
    top: 40%;
    transform: translate(-50%, -50%);
    .form-box{
      width: 290px;
      height: 150px;
      margin-left: 372px;
      margin-top: 120px;
      .ant-input{
        border-radius: 0;
        border-left: 2px solid #ef3125;
      }
    }
    .row-input {
      margin: 15px 0;
    }
    .login-form-button {
      background: #d84a38;
      border-color: #d84a38;
      border-radius: 0;
      position: relative;
      top: -10px;
    }
  }
}
</style>
