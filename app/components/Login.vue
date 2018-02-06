<template>
  <modal :show="loginState.show" :loginSpecialCss="true">
    <button @click="loginClose" class="modal-close modal-inner-close"></button>
    <div v-if="!success && loginState.mode !==2" class="register">
      <div class="register-title">
        <div class="register-title-tab">
          <label @click="showLogin" :class="{'selecetd':loginState.mode == 0}" class="register-title-tab-radio"><span>登录</span></label>
          <label @click="showReg" :class="{'selecetd':loginState.mode == 1}" class="register-title-tab-radio"><span>注册</span></label>
        </div>
      </div>
      <div class="register-body">
        <div v-if="loginState.mode ==0" class="register-body-log">
          <div class="login-item login-phone">
            <i class="iconfont">&#xe669;</i>
            <input v-model="loginPhone" class="login-item-input login-phone-input" placeholder="手机号" type="text"/>
            <i class="iconfont icon-pass">&#xe612;</i>
          </div>
          <div v-if="loginErr.state && loginErrorMap[loginErr.code].target == 'phone'" class="login-phone-input-err">
            <i class="iconfont">&#xe67d;</i>
            <span class="login-phone-input-err-text">
              {{loginErrorMap[loginErr.code].text}}
            </span>
          </div>
          <div v-else class="login-phone-input-err">
          </div>
          <div class="login-item login-setpwd">
            <i class="iconfont">&#xe66b;</i>
            <input v-model="loginPwd" class="login-item-input login-setpwd-input" placeholder="密码" :type="loginPwdShow?'text':'password'"/>
            <div class="login-setpwd-forget">
              <input v-model="loginPwdShow" type="checkbox" id="pwd-switch-login" name="pwd-switch-login" class="login-pwd-switch" />
              <label class="login-pwd-switch-label" for="pwd-switch-login"><i class="iconfont">&#xe60d;</i></label>
              <span @click="forget" class="forget-pwd">忘记密码</span>
            </div>
          </div>
          <div  v-if="loginErr.state && loginErrorMap[loginErr.code].target == 'pwd'" class="login-pwd-err"><i class="iconfont">&#xe67d;</i>
            <span class="login-pwd-err-text">
              {{loginErrorMap[loginErr.code].text}}
            </span>
          </div>
          <div v-else class="login-pwd-err">
          </div>
          <div class="login-rememberme">
            <input v-model="loginRmb" type="checkbox" id="rememberme-switch" name="rememberme-switch" class="login-rememberme-switch" />
            <label class="login-rememberme-switch-label" for="rememberme-switch">记住我</label>
          </div>
          <div @click="startLogin" class="login-btn">
            登录
          </div>
          <div class="login-to-register">
            还没有选股宝账号？<span @click="showReg" class="login-to-register-link">立即注册</span>
          </div>
        </div>
        <div v-if="loginState.mode ==1" class="register-body-reg">
          <div class="register-item register-phone">
            <i class="iconfont">&#xe669;</i>
            <input v-model="regPhone" class="register-item-input register-phone-input" placeholder="输入手机号"  type="text"/>
            <i class="iconfont icon-pass">&#xe612;</i>
          </div>
          <div v-if="regErr.state && regErrorMap[regErr.code].target == 'phone'" class="register-phone-input-err">
            <i class="iconfont">&#xe67d;</i>
            <span class="register-phone-input-err-text">
              {{regErrorMap[regErr.code].text}}
            </span>
          </div>
          <div v-else class="register-phone-input-err"></div>
          <div class="register-item register-vcode">
            <i class="iconfont">&#xe66a;</i>
            <input v-model="regVcode" class="register-item-input register-vcode-input" placeholder="输入验证码" type="text"/>
            <div :disabled="regVcodeDisabled" @click="getRegVcode" class="register-vcode-get">{{regVcodeCounting}}</div>
            <i class="iconfont icon-pass">&#xe612;</i>
            <div v-if="vcodeImageId" class="register-vcode-image">
              <input :class="{'warning':vcodeImageInputWarning}" v-model="vcodeImageInput" @keyup="vcodeKeyUp" class="register-item-input register-vcode-image-input" placeholder="" type="text"/>
              <img class="register-vcode-image-image" :src="`data:image/png;base64,${vcodeImageSrc}`" alt="">
            </div>
          </div>
          <div v-if="regErr.state && regErrorMap[regErr.code].target == 'vcode'" class="register-vcode-err">
            <i class="iconfont">&#xe67d;</i><span class="register-vcode-err-text"></span>
          </div>
          <div v-else class="register-vcode-err"></div>
          <div class="register-item register-setpwd">
            <i class="iconfont">&#xe66b;</i>
            <input v-model="regPwd" class="register-item-input register-setpwd-input" placeholder="设置密码" :type="regPwdShow?'text':'password'"/>
            <div class="register-setpwd-forget">
              <input v-model="regPwdShow" type="checkbox" id="pwd-switch-register" name="pwd-switch-register" class="register-pwd-switch" />
              <label class="register-pwd-switch-label" for="pwd-switch-register"><i class="iconfont">&#xe60d;</i></label>
            </div>
          </div>
          <div v-if="regErr.state && regErrorMap[regErr.code].target == 'pwd'" class="register-pwd-err">
            <i class="iconfont">&#xe67d;</i><span class="register-pwd-err-text"></span>
          </div>
          <div v-else class="register-pwd-err">
          </div>
          <div @click="startReg" class="register-btn">
            注册
          </div>
          <div class="register-to-login">
            已有选股宝账号？<span @click="showLogin" class="register-to-login-link">立即登录</span>
          </div>
        </div>
      </div>
    </div>
    <div v-if="!success && loginState.mode ==2" class="reset">
      <div class="reset-title">
        <div class="reset-back">
          <i class="iconfont">&#xe66f;</i>
        </div>
      </div>
      <div class="reset-body">
        <div class="reset-item reset-phone">
          <i class="iconfont">&#xe669;</i>
          <input v-model="resetPhone" class="reset-item-input reset-phone-input"  placeholder="输入手机号" type="text"/>
          <i class="iconfont icon-pass">&#xe612;</i>
        </div>
        <div v-if="resetErr.state && resetErrorMap[resetErr.code].target == 'phone'" class="reset-phone-input-err">
            <i class="iconfont">&#xe67d;</i><span class="reset-phone-input-err-text">
              {{resetErrorMap[resetErr.code].text}}
            </span>
        </div>
        <div v-else class="reset-phone-input-err">
        </div>
        <div class="reset-item reset-vcode">
          <i class="iconfont">&#xe66a;</i>
          <input v-model="resetVcode" class="reset-item-input reset-vcode-input" placeholder="输入验证码" type="text"/>
          <div @click="getResetVcode" class="reset-vcode-get">{{resetVcodeCounting}}</div>
          <i class="iconfont icon-pass">&#xe612;</i>
            <div v-if="vcodeImageId" class="reset-vcode-image">
              <input :class="{'warning':resetVcodeImageInputWarning}" v-model="resetVcodeImageInput" @keyup="resetVcodeKeyUp"  class="reset-item-input reset-vcode-image-input" placeholder="" type="text"/>
              <img :src="`data:image/png;base64,${vcodeImageSrc}`" class="reset-vcode-image-image"  alt="">
          </div>
        </div>
        <div v-if="resetErr.state && resetErrorMap[resetErr.code].target == 'vcode'" class="reset-vcode-err">
            <i class="iconfont">&#xe67d;</i><span class="reset-vcode-err-text">{{resetErrorMap[resetErr.code].text}}</span>
        </div>
        <div v-else class="reset-vcode-err">
        </div>
        <div class="reset-item reset-setpwd">
          <i class="iconfont">&#xe66b;</i>
          <input v-model="resetPwd" class="reset-item-input reset-setpwd-input" placeholder="设置新密码" type="password"/>
          <div class="reset-setpwd-forget">
            <input  type="checkbox" id="pwd-switch-reset" name="pwd-switch-reset" class="reset-pwd-switch" />
            <label class="reset-pwd-switch-label" for="pwd-switch-reset"><i class="iconfont">&#xe60d;</i></label>
          </div>
        </div>
         <div v-if="resetErr.state && resetErrorMap[resetErr.code].target == 'pwd'" class="reset-pwd-err">
            <i class="iconfont">&#xe67d;</i><span class="reset-pwd-err-text">{{resetErrorMap[resetErr.code].text}}</span>
        </div>
        <div v-else class="reset-pwd-err">
        </div>
        <div @click="reset" class="reset-btn">
          重设密码
        </div>
      </div>
    </div>
    <div v-if="success"  class="success-body">
        <div v-if="loginState.mode ==2" class="success-reset">
          <i class="iconfont">&#xe67e;</i>
          <p class="success-reset-text success-text"></p>
          <p class="success-reset-timer success-timer">{{closeCounting}}返回登录页<span class="success-reset-timer-count success-timer-count"></span>
          </p>
          <div class="success-reset-go-login">立即登录</div>
        </div>
        <div v-if="loginState.mode ==0" class="success-login">
          <i class="iconfont">&#xe612;</i>
        <p class="success-login-text success-text">
          登录成功
        </p>
        <p class="success-login-timer success-timer">{{closeCounting}}自动关闭<span class="success-login-timer-count success-timer-count"></span></p>
        </div>
        <div v-if="loginState.mode ==1" class="success-register">
          <i class="iconfont">&#xe612;</i>
        <p class="success-register-text success-text">注册成功</p>
        <p class="success-register-timer success-timer">{{closeCounting}}自动登录<span class="success-register-timer-count success-timer-count"></span></p>
        </div>
      </div>
  </div>
</modal>
</template>

<script>
/* eslint-disable no-debugger, eqeqeq */
import Modal from './Modal'
import { userLogin, fetchVcodeImage, fetchMobileCode, verifyMobileCode, registerUser, fetchForgetMobileCode, verifyForgetMobileCode } from '~/api/login'
import * as Cookies from 'js-cookie'
import shareMethodMixin from '~/mixins/shareMethodMixin'
export default {
  data () {
    return {
      // 0 登陆 1 注册 2找回
      loginPwdShow: false,
      regPwdShow: true,
      loginRmb: true,
      loginPwd: '',
      loginPhone: '',
      regPwd: '',
      regPhone: '',
      regVcode: '',
      regVcodeDisabled: false,
      resetPwd: '',
      resetPhone: '',
      resetVcode: '',
      resetVcodeDisabled: false,
      loginErrorMap: {
        '60101': {
          text: '该账号不存在',
          target: 'phone'
        },
        '60003': {
          text: '密码错误',
          target: 'pwd'
        },
        '60004': {
          text: '当前用户尚未设置密码，请重置',
          target: 'pwd'
        },
        '50000': {
          text: '请设置密码',
          target: 'pwd'
        },
        'ud': {
          text: '未知错误，请与管理员联系',
          target: 'phone'
        },
        'f001': {
          text: '手机号不符合规范',
          target: 'phone'
        },
        'f002': {
          text: '密码不能为空',
          target: 'pwd'
        }
      },
      regErrorMap: {
        'f001': {
          text: '验证码尚未准备就绪',
          target: 'vcode'
        },
        'f002': {
          text: '手机号不符合规范',
          target: 'phone'
        },
        'f003': {
          text: '密码不能为空',
          target: 'pwd'
        },
        'f004': {
          text: '验证码至少为4位',
          target: 'vcode'
        },
        '50000': {
          text: '验证码错误',
          target: 'vcode'
        },
        'ud': {
          text: '未知错误，请与管理员联系',
          target: 'phone'
        },
        '60104': {
          text: '该用户已经存在',
          target: 'phone'
        }
      },
      resetErrorMap: {
        'f001': {
          text: '验证码尚未准备就绪',
          target: 'vcode'
        },
        'f002': {
          text: '手机号不符合规范',
          target: 'phone'
        },
        'f003': {
          text: '密码不能为空',
          target: 'pwd'
        },
        'f004': {
          text: '验证码至少为4位',
          target: 'vcode'
        },
        '50000': {
          text: '验证码错误',
          target: 'vcode'
        },
        'ud': {
          text: '未知错误，请与管理员联系',
          target: 'phone'
        },
        '60101': {
          text: '该账号不存在，请先注册',
          target: 'phone'
        },
        '60102': {
          text: '验证码错误',
          target: 'vcode'
        },
        '40000': {
          text: '验证码错误',
          target: 'vcode'
        },
        '60106': {
          text: '该账号不存在',
          target: 'phone'
        }
      },
      loginErr: {
        state: false,
        code: ''
      },
      regErr: {
        state: false,
        code: ''
      },
      resetErr: {
        state: false,
        code: ''
      },
      loading: false,
      success: false,
      closeCounting: '',
      vcodeImageId: '',
      vcodeImageSrc: '',
      vcodeWait: 0,
      vcodeImageInputWarning: false,
      vcodeImageInput: '',
      regVcodeCounting: '获取验证码',
      resetVcodeCounting: '获取验证码',
      resetVcodeImageInput: '',
      resetVcodeImageInputWarning: false
    }
  },
  computed: {
    loginState () {
      return this.$store.state.login.login
    }
  },
  methods: {
    showLogin () {
      this.vcodeImageId = ''
      this.vcodeImageSrc = ''
      this.$store.dispatch('login/showLogin')
    },
    showReg () {
      this.vcodeImageId = ''
      this.vcodeImageSrc = ''
      this.$store.dispatch('login/showReg')
    },
    loginClose () {
      this.success = false
      this.$store.dispatch('login/close')
    },
    noEmptyCheck (s) {
      return s.trim().length !== 0
    },
    isPhoneNumber (s) {
      return new RegExp(/^(\+?0?86-?)?1[345789]\d{9}$/).test(s)
    },
    startLogin () {
      if (this.loading) {
        return
      }
      this.loginErr.state = false
      this.loginErr.code = ''
      if (!this.isPhoneNumber(this.loginPhone)) {
        this.loginErr.state = true
        this.loginErr.code = 'f001'
        return
      }
      if (!this.noEmptyCheck(this.loginPwd)) {
        this.loginErr.state = true
        this.loginErr.code = 'f002'
        return
      }
      this.userLogin()
    },
    userLogin () {
      userLogin({
        Mobile: this.loginPhone,
        Password: this.loginPwd
      }).then(json => {
        console.log(json)
        if (json.errcode) {
          // 有错误code
          if (this.loginErrorMap[json.errcode]) {
            // 有错误码
            this.loginErr.state = true
            this.loginErr.code = json.errcode
          } else {
            // 错误码未记录
            this.loginErr.state = true
            this.loginErr.code = 'ud'
            this.loginErrorMap['ud'].text = '未知错误，请与管理员联系' + json.errcode
          }
        } else {
          this.setCookie(json)
          this.setLS('close-timestamp', new Date())
          this.success = true
          this.closeTimer(3, '.success-login-timer-count', this.loginCb)
        }
      }).catch(e => {
        if (e.data.errcode) {
          // 有错误code
          if (this.loginErrorMap[e.data.errcode]) {
            // 有错误码
            this.loginErr.state = true
            this.loginErr.code = e.data.errcode
          } else {
            // 错误码未记录
            this.loginErr.state = true
            this.loginErr.code = 'ud'
            this.loginErrorMap['ud'].text = '未知错误，请与管理员联系' + e.data.errcode
          }
        }
      })
    },
    startReg () {
      this.regErr.state = false
      this.regErr.code = ''
      if (this.loading) {
        return
      }
      // if (!$('#rule-switch')[0].checked) {
      //   $alert('请同意使用条款')
      //   return
      // }
      if (!this.regPwd) {
        this.regErr.state = true
        this.regErr.code = 'f003'
        return
      }
      if (!this.isPhoneNumber(this.regPhone)) {
        this.regErr.state = true
        this.regErr.code = 'f002'
        return
      }

      this.loading = true
      if (this.regVcode.length < 4) {
        this.regErr.state = true
        this.regErr.code = 'f004'
        return
      }
      this.registerPhone()
    },
    forget () {
      this.vcodeImageId = ''
      this.vcodeImageSrc = ''
      this.$store.dispatch('login/showForget')
    },
    registerPhone () {
      verifyMobileCode({
        'Mobile': this.regPhone,
        'Code': this.regVcode
      }).then(json => {
        registerUser({
          'Mobile': this.regPhone,
          'Password': this.regPwd,
          'Token': json.RegisterToken
        }).then(json => {
          this.loading = false
          if (json.Token) {
            // alert('注册成功')
            this.setCookie(json)
            this.success = true
            this.setLS('close-timestamp', new Date())
            this.closeTimer(3, '.success-register-timer-count', this.loginCb)
          }
        })
      }).catch(e => {
        console.log(e)
        if (e.data.errcode && this.regErrorMap[e.data.errcode]) {
          this.regErr.state = true
          this.regErr.code = e.data.errcode
        } else if (e.data.errcode && !this.regErrorMap[e.data.errcode]) {
          this.regErr.state = true
          this.regErrorMap['ud'].text = '未知错误，请与管理员联系' + e.data.errcode
          this.regErr.code = 'ud'
        }
        this.loading = false
      })
    },
    getRegVcode () {
      this.regErr.state = false
      this.regErr.code = ''
      if (this.regVcodeDisabled || this.check_Vcode_status()) {
        return
      }
      if (this.loading) {
        return
      }
      if (this.isPhoneNumber(this.regPhone)) {
        this.getVcodeImage().then(json => {
          this.vcodeImageId = json.Id
          this.vcodeImageSrc = json.Image
        }, rej => {})
      } else {
        this.regErr.state = true
        this.regErr.code = 'f002'
      }
    },
    getResetVcode () {
      this.resetErr.state = false
      this.resetErr.code = ''
      debugger
      if (this.regVcodeDisabled || this.check_Vcode_status()) {
        return
      }
      if (this.loading) {
        return
      }
      if (this.isPhoneNumber(this.resetPhone)) {
        this.getVcodeImage().then(json => {
          debugger
          this.vcodeImageId = json.Id
          this.vcodeImageSrc = json.Image
        }, rej => {})
      } else {
        this.resetErr.state = true
        this.resetErr.code = 'f002'
      }
    },
    getVcodeImage () {
      return new Promise((resolve, reject) => {
        if (this.vcodeWait) {
          reject(new Error('something bad happened'));
        }
        this.vcodeWait = true
        setTimeout(() => {
          this.vcodeWait = false
        }, 500);
        fetchVcodeImage().then(json => {
          if (json.Image) {
            resolve(json)
          } else {
            reject(json)
          }
        }).catch(e => {
          reject(e)
        })
      })
    },
    vcodeKeyUp () {
      this.vcodeImageInputWarning = false
      if (this.vcodeImageInput.length < 4) {
        this.vcodeImageInputWarning = true
        return
      }
      if (this.vcodeImageInput.length === 4) {
        this.checkVcodeImage(this.regPhone, this.vcodeImageInput).then(res => {
          // $('.register-vcode-image').hide()
          // $('.register-vcode-image-input').val('')
          this.setLS('vcode-timestamp', new Date())
          this.startTimer(60, this.regVcodeCounting)
          this.vcodeImageId = ''
          this.vcodeImageSrc = ''
        }, rej => {
          if (rej.data.errcode == 60106) {
            this.vcodeImageInputWarning = true
            this.getVcodeImage().then(j => {
              this.vcodeImageId = j.Id
              this.vcodeImageSrc = j.Image
            }, reject => {
              console.log(reject)
            })
          }
          this.loading = false
        })
      }
      if (this.vcodeImageInput.length > 4) {
        this.vcodeImageInputWarning = true
      }
    },
    resetVcodeKeyUp () {
      this.resetVcodeImageInputWarning = false
      if (this.resetVcodeImageInput.length < 4) {
        this.resetVcodeImageInputWarning = true
        return
      }
      if (this.resetVcodeImageInput.length === 4) {
        this.checkResetVcodeImage(this.resetPhone, this.resetVcodeImageInput).then(res => {
          // $('.register-vcode-image').hide()
          // $('.register-vcode-image-input').val('')
          this.setLS('vcode-timestamp', new Date())
          this.startTimer(60, this.resetVcodeCounting)
          this.vcodeImageId = ''
          this.vcodeImageSrc = ''
        }, rej => {
          if (rej && rej.data.errcode == 60106) {
            this.resetVcodeImageInputWarning = true
            this.getVcodeImage().then(j => {
              this.vcodeImageId = j.Id
              this.vcodeImageSrc = j.Image
            }, reject => {
              console.log(reject)
            })
          }
          if (rej.data.errcode == 60104) {
            this.resetErr.state = true
            this.resetErr.code = '60104'
          }
          this.loading = false
        })
      }
      if (this.resetVcodeImageInput.length > 4) {
        this.resetVcodeImageInputWarning = true
      }
    },
    reset () {
      this.resetErr.state = false
      this.resetErr.code = ''
      if (this.loading) {
        return
      }
      if (!this.resetPwd) {
        this.resetErr.state = true
        this.resetErr.code = 'f003'
        return
      }
      if (this.resetVcode.length < 4) {
        this.resetErr.state = true
        this.resetErr.code = 'f004'
        return
      }
      this.loading = true
      if (!this.isPhoneNumber(this.resetPhone)) {
        this.resetErr.state = true
        this.resetErr.code = 'f002'
        return
      }
      verifyForgetMobileCode({
        'Mobile': this.resetPhone,
        'Code': this.resetVcode,
        'Password': this.resetPwd
      }).then(json => {
        this.loading = false
        // $alert('重置成功')
        this.success = true
        this.setLS('close-timestamp', new Date())
        this.closeTimer(3, '.success-reset-timer-count', this.closeReset)
      }).catch(e => {
        console.log(e)
        if (e.data.errcode && this.regErrorMap[e.data.errcode]) {
          this.resetErr.state = true
          this.resetErr.code = e.data.errcode
        } else if (e.data.errcode && !this.resetErrorMap[e.data.errcode]) {
          this.resetErr.state = true
          this.resetErrorMap['ud'].text = '未知错误，请与管理员联系' + e.data.errcode
          this.resetErr.code = 'ud'
        }
        this.loading = false
      })
    },
    closeReset () {
      this.success = false
      this.showLogin()
    },
    checkVcodeImage (phone, val) {
      return new Promise((resolve, reject) => {
        this.loading = true
        fetchMobileCode({
          'Mobile': phone,
          'CaptchaId': this.vcodeImageId,
          'CaptchaSolution': val
        }).then(json => {
          resolve(json)
        }).catch(e => {
          this.loading = false
          reject(e)
        })
      })
    },
    checkResetVcodeImage (phone, val) {
      return new Promise((resolve, reject) => {
        this.loading = true
        fetchForgetMobileCode({
          'Mobile': this.resetPhone,
          'CaptchaId': this.vcodeImageId,
          'CaptchaSolution': val
        }).then(json => {
          this.loading = false
          resolve(json)
        }).catch(e => {
          if (e.data.errcode && this.regErrorMap[e.data.errcode]) {
            this.resetErr.state = true
            this.resetErr.code = e.data.errcode
          } else if (e.data.errcode && !this.resetErrorMap[e.data.errcode]) {
            this.resetErr.state = true
            this.resetErrorMap['ud'].text = '未知错误，请与管理员联系' + e.data.errcode
            this.resetErr.code = 'ud'
          }
          this.loading = false
          reject(e)
        })
      })
    },
    startTimer (n, disableProp) {
      if (n > 0) {
        var tim = new Date()
        var t = Math.ceil(((Date.parse(this.getLS('vcode-timestamp')) - tim.getTime()) / 1000) + 60)
        this.regVcodeCounting = t + 's'
        setTimeout(() => {
          this.startTimer(t, disableProp);
        }, 50)
      } else {
        this.regVcodeCounting = '获取验证码'
      }
    },
    setCookie (json) {
      localStorage.setItem('_xgb_userinfo', JSON.stringify(json.UserInfo))
      if (process.env.ENV === 'production') {
        Cookies.set('token', json.Token, {
          domain: '.xuangubao.cn',
          path: '/',
          expires: 365
        });
        Cookies.set('nickname', json.UserInfo.Nickname, {
          domain: '.xuangubao.cn',
          path: '/',
          expires: 365
        });
        Cookies.set('portrait', json.UserInfo.Portrait, {
          domain: '.xuangubao.cn',
          path: '/',
          expires: 365
        });
      } else {
        Cookies.set('token', json.Token, {
          path: '/',
          expires: 365
        });
        Cookies.set('nickname', json.UserInfo.Nickname, {
          path: '/',
          expires: 365
        });
        Cookies.set('portrait', json.UserInfo.Portrait, {
          path: '/',
          expires: 365
        });
      }
    },
    refreshToken () {
      // console.log('refresh', Cookies.get('token'))
      if (process.env.ENV === 'sit') {
        if (Cookies.get('token') === '') {
          Cookies.remove('token', {domain: '.xuangubao.cn'})
        }
        if (Cookies.get('nickname') === '') {
          Cookies.remove('nickname', {domain: '.xuangubao.cn'})
        }
        if (Cookies.get('portrait') === '') {
          Cookies.remove('portrait', {domain: '.xuangubao.cn'})
        }
      }
      this.$store.dispatch('user/saveAuth', {
        Token: Cookies.get('token'),
        nickname: Cookies.get('nickname')
      })
      this.$store.commit('auth/saveToken', Cookies.get('token'))
    },
    loginCb () {
      this.refreshToken()
      // this.success = false
      setTimeout(() => {
        location.replace(location.href)
      }, 4)
    },
    check_Vcode_status () {
      let t = new Date();
      if (!this.getLS('vcode-timestamp')) {
        return false
      } else if (this.getLS('vcode-timestamp') && ((((Date.parse(this.getLS('vcode-timestamp')) - t.getTime()) / 1000) + 60) > 0)) {
        return Math.ceil(((Date.parse(this.getLS('vcode-timestamp')) - t.getTime()) / 1000) + 60)
      } else {
        return false
      }
    },
    closeTimer (n, target, cb) {
      if (n > 0) {
        var tim = new Date()
        var t = Math.ceil(((Date.parse(this.getLS('close-timestamp')) - tim.getTime()) / 1000) + 3)
        this.closeCounting = t + 's'
        setTimeout(() => {
          this.closeTimer(t, target, cb);
        }, 50)
      } else {
        cb()
      }
    }
  },
  components: {
    Modal
  },
  mixins: [shareMethodMixin]
}
</script>

<style lang="less" scoped>
@import "../styles/variables.less";
.go-login{
  color:#fff;
  cursor: pointer;
}
.log-out{
  color: #fff;
  cursor: pointer;
}
.nickname{
  color: #fff;
}
.login-modal{
  z-index: 200;
}
.success-modal{
  z-index: 200;
}
.reset-modal{
  z-index: 200;
}
.modal-background{
  background-color: rgba(10, 10, 10, .4);
}

.success-modal  .modal-content{
  width: 440px;
  margin: 0 20px;
  overflow: hidden;
  .success-close{
    position: absolute;
    z-index: 100;
    top: 10px;
    right: 10px;
    &:before{
      background: #D8D8D8;
      width: 80%
    }
    &:after{
      background: #D8D8D8;
      height: 80%
    }
    &:focus,&:hover{
      background-color: #fff;
       &:before{
        background: #E6394D;
        width: 80%
      }
      &:after{
        background: #E6394D;
        height: 80%
      }
    }
  }
}
.alert-modal{
  .modal-card-head{
    text-align: center;
    padding: 15px 20px;
    .modal-card-title{
      font-size: 16px;
      position: relative;
      left: 8px;
    }
  }
  .alert-modal-info{
    text-align: center;
    font-size: 20px;
  }
  .modal-card{
    width: 300px;
  }
}
.register{
  display: block;
  width: 440px;
  position: relative;
  left: 0;
  height: 608px;
  background: #fff;
  &-title{
    display: block;
    height: 168px;
    position: relative;
    background: url('/img/login-bg.png');
    background-size: cover;
    &-tab{
      display: flex;
      height: 34px;
      width:440px;
      position: absolute;
      left: 0;
      bottom:0;
      label {
        height: 34px;
        width: 50%;
        display: block;
        color: #D8D8D8;
        cursor: pointer;
        text-align: center;
        font-size: 18px;
        letter-spacing: 0.82px;
        line-height: 18px;
        &>span{
          display: inline-block;
          height: 100%;
          border:none;
        }
        &.selecetd{
          height: 34px;
          width: 50%;
          cursor: pointer;
          color: #fff;
          text-align: center;
          &>span{
            display: inline-block;
            height: 100%;
            border-bottom:3px solid #E6394D;
          }
        }
      }
    }
  }
  &-body{
    width: 880px;
    display: flex;
    .register-body-reg{
      display: inline-block;
      width: 440px;
      padding-top: 40px;
      height: 440px;
    }
    .register-body-log{
      display: inline-block;
      width: 440px;
      padding-top: 40px;
      height: 440px;
    }
    .register-phone-input-err{
      display: block;
      padding-left:70px;
      height: 30px;
      line-height: 30px;
      font-size: 12px;
      position: relative;
      color:#E6394D;
      &>.iconfont{
        margin-right: 4px;
        position: relative;
        top: 2px;
      }
      &.show{
        opacity: 1;
      }
    }
    .register-vcode-err{
      display: block;
      padding-left:70px;
      height: 30px;
      line-height: 30px;
      font-size: 12px;
      position: relative;
      color:#E6394D;
      width: 1px;
      &>.iconfont{
        margin-right: 4px;
        position: relative;
        top: 2px;
      }
      &.show{
        opacity: 1;
        width:auto;
      }
    }
    .register-pwd-err{
      display: block;
      padding-left:70px;
      height: 30px;
      line-height: 30px;
      font-size: 12px;
      position: relative;
      color:#E6394D;
      &>.iconfont{
        margin-right: 4px;
        position: relative;
        top: 2px;
      }
      &.show{
        opacity: 1;
      }
    }
    .register-item{
      display: block;
      padding-left:40px;
      position: relative;

      .iconfont{
        font-size:24px;
        position: relative;
        top: 4px;
        left: -5px;
        &.icon-pass{
          color:green;
          display: none;
        }
      }
      &>input{
        font-size: 16px;
        line-height: 24px;
        border: none;
        outline:none;
        border-bottom: 1px solid @border-color-light;
        width: 328px;
        position: relative;
        &:focus{
          border-bottom: 1px solid @fc-primary;
        }
      }
      &.on-error>input{
        border-bottom: 1px solid #E6394D;
      }
      &.validate-pass{
        .icon-pass{
          display: inline-block;
        }
      }
      &.register-vcode{
        margin-top: 20px;
        z-index: 2;
        .register-vcode-input{
          padding-right: 100px;
        }
        .register-setpwd-input{
          padding-right: 50px;
        }
        .register-vcode-get{
          display: block;
          position: absolute;
          right: 50px;
          top: 8px;
          font-size: 14px;
          line-height: 18px;
          padding-left: 10px;
          border-left: 1px solid @border-color-light;
          cursor: pointer;
          &[disabled = true]{
            color:@fc-gray;
          }
        }
        .register-vcode-image{
          display: block;
          margin: 5px 0 5px 160px;
          border: 1px solid #d8d8d8;
          padding: 8px 100px 10px 10px;
          position: absolute;
          bottom: -55px;
          left: 0;
          transition: all .3s;
          &>img{
            display: block;
            width: 96px;
            position: absolute;
            right:0;
            top: 0;
            cursor: pointer;
          }
          &:before{
            content: '';
            position: absolute;
            top: -5px;
            right: 10%;
            display: block;
            width: 8px;
            height: 8px;
            border-width: 1px 1px 0 0;
            border-color: #999999 #999999 transparent transparent;
            border-style: solid;
            -webkit-transform: rotate(-45deg);
            transform: rotate(-45deg);
            background: #fff;
            z-index: 1;
          }
          &-input{
            font-size: 16px;
            line-height: 24px;
            border: none;
            border: 1px solid #d8d8d8;
            outline: none;
            width: 120px;
            position: relative;
            padding-right: 0;
            &:focus{
              border: 1px solid #353A47;
            }
            &.warning{
              border: 1px solid #E6394D;
            }
          }
          &-confirm{
            display: inline-block;
            position: absolute;
            height: 26px;
            border-radius: 10px;
            text-align: center;
            font-size: 14px;
            line-height: 26px;
            width: 60px;
            top: 8px;
            color: #fff;
            right: 10px;
            cursor: pointer;
            background: gray;
            .active{
              background: #E6394D;
            }
          }
        }
      }
      &.register-setpwd{
        margin-top: 20px;
        .register-setpwd-forget{
          display: block;
          position: absolute;
          right: 50px;
          top: 8px;
          font-size: 14px;
          line-height: 18px;
          padding-left: 10px;
          cursor: pointer;
          .register-pwd-switch{
            display: none;
            &:empty ~ label{
              display: inline-block;
              position: relative;
              &>i{
                opacity: 0;
                cursor: pointer;
              }
              &:before{
                content:'\e60d';
                font-size: 24px;
                font-family:'iconfont';
                position: absolute;
                left: 0;
                top: 0;
                display: block;
              }
            }
            &:checked ~ label{
              display: inline-block;
              position: relative;
              &>i{
                opacity: 0;
                cursor: pointer;
              }
              &:before{
                content:'\e60c';
                font-family:'iconfont';
                font-size: 24px;
                position: absolute;
                left: 0;
                top: 0;
                display: block;
              }
            }

          }
        }
      }
    }
    .login-phone-input-err{
      display: block;
      padding-left:70px;
      height: 30px;
      line-height: 30px;
      font-size: 12px;
      position: relative;
      color:#E6394D;
      &>.iconfont{
        margin-right: 4px;
        position: relative;
        top: 2px;
      }
      &.show{
        opacity: 1;
      }
    }
    .login-pwd-err{
      display: block;
      padding-left:70px;
      height: 30px;
      line-height: 30px;
      font-size: 12px;
      position: relative;
      color:#E6394D;
      &>.iconfont{
        margin-right: 4px;
        position: relative;
        top: 2px;
      }
      &.show{
        opacity: 1;
      }
    }
    .login-item{
      display: block;
      padding-left:40px;
      position: relative;
      .login-setpwd-input{
        padding-right: 120px;
      }
      .iconfont{
        font-size:24px;
        position: relative;
        top: 4px;
        left: -5px;
        &.icon-pass{
          color:green;
          display: none;
        }
      }
      &>input{
        font-size: 16px;
        line-height: 24px;
        border: none;
        outline:none;
        border-bottom: 1px solid @border-color-light;
        width: 328px;
        position: relative;
        &:focus{
          border-bottom: 1px solid @fc-primary;
        }
      }
      &.on-error>input{
        border-bottom: 1px solid #E6394D;
      }
      &.validate-pass{
        .icon-pass{
          display: inline-block;
        }
      }

      &.login-setpwd{
        margin-top: 20px;
        .login-setpwd-forget{
          display: block;
          position: absolute;
          right: 50px;
          top: 8px;
          font-size: 14px;
          line-height: 18px;
          padding-left: 10px;
          cursor: pointer;
          .login-pwd-switch{
            display: none;
            & ~ label{
              display: inline-block;
              position: relative;
              line-height: 24px;
              &>i{
                opacity: 0;
                cursor: pointer;
                margin-right: 10px;
                vertical-align: top;
              }
              &>span{
                position: relative;

              }
            }
            &:empty ~ label:before{
                content:'\e60d';
                font-family:'iconfont';
                font-size: 24px;
                position: absolute;
                left: 0;
                top: 0;
                display: block;
            }
            &:checked ~ label:before{
                content:'\e60c';
                font-family:'iconfont';
                font-size: 24px;
                position: absolute;
                left: 0;
                top: 0;
                display: block;
            }
          }
        }
      }
    }

    .login-rememberme{
      margin-top: 30px;
      padding-left: 40px;
      font-size: 12px;
    }
    .login-btn{
      margin: 20px 40px;
      width:360px;
      height: 48px;
      background-color: #E6394D ;
      cursor: pointer;
      text-align: center;
      color: #fff;
      line-height: 48px;
      font-size: 16px;
      letter-spacing:12px;
    }
    .login-to-register{
      text-align: center;
      color: @fc-gray;
      font-size: 14px;
      &>span{
        color: #E6394D;
        cursor: pointer;
      }
    }
    .register-user-rule{
      margin-top: 30px;
      padding-left: 40px;
      font-size: 12px;
    }
    .register-btn{
      margin: 20px 40px;
      width:360px;
      height: 48px;
      background-color: #E6394D ;
      cursor: pointer;
      text-align: center;
      color: #fff;
      line-height: 48px;
      font-size: 16px;
      letter-spacing:12px;
    }
    .register-to-login{
      text-align: center;
      color: @fc-gray;
      font-size: 14px;
      &>span{
        color: #E6394D;
        cursor: pointer;
      }
    }
  }
}

.reset{
  display: block;
  width: 440px;
  position: relative;
  left: 0;
  height: 608px;
  background: #fff;
  &-title{
    display: block;
    height: 168px;
    position: relative;
    background: url('/img/reset-bg.png');
    background-size: cover;
    .reset-back{
      height: 30px;
      width:30px;
      position: relative;
      top: 5px;
      left: 5px;
      cursor: pointer;
      &>i{
        font-size: 24px;
        color:#fff;
        line-height: 30px;
      }
    }
  }
  &-body{
    width: 440px;
    display: block;
    padding-top: 40px;
    .reset-phone-input-err{
      display: block;
      padding-left:70px;
      height: 30px;
      line-height: 30px;
      font-size: 12px;
      position: relative;
      color:#E6394D;
      &>.iconfont{
        margin-right: 4px;
        position: relative;
        top: 2px;
      }
      &.show{
        opacity: 1;
      }
    }
    .reset-vcode-err{
      display: block;
      padding-left:70px;
      height: 30px;
      line-height: 30px;
      font-size: 12px;
      position: relative;
      color:#E6394D;
      &>.iconfont{
        margin-right: 4px;
        position: relative;
        top: 2px;
      }
      &.show{
        opacity: 1;
      }
    }
    .reset-pwd-err{
      display: block;
      padding-left:70px;
      height: 30px;
      line-height: 30px;
      font-size: 12px;
      position: relative;
      color:#E6394D;
      &>.iconfont{
        margin-right: 4px;
        position: relative;
        top: 2px;
      }
      &.show{
        opacity: 1;
      }
    }
    .reset-item{
      display: block;
      padding-left:40px;
      position: relative;
      .iconfont{
        font-size:24px;
        position: relative;
        top: 4px;
        left: -5px;
        &.icon-pass{
          color:green;
          display: none;
        }
      }
      &>input{
        font-size: 16px;
        line-height: 24px;
        border: none;
        outline:none;
        border-bottom: 1px solid @border-color-light;
        width: 328px;
        position: relative;
        &:focus{
          border-bottom: 1px solid @fc-primary;
        }

      }
      &.on-error>input{
          border-bottom: 1px solid #E6394D;
      }
      &.validate-pass{
        .icon-pass{
          display: inline-block;
        }
      }
      &.reset-vcode{
        margin-top: 20px;
        z-index: 2;
        .reset-vcode-input{
          padding-right: 100px;
        }
        .reset-setpwd-input{
          padding-right: 50px;
        }
        .reset-vcode-get{
          display: block;
          position: absolute;
          right: 50px;
          top: 8px;
          font-size: 14px;
          line-height: 18px;
          padding-left: 10px;
          border-left: 1px solid @border-color-light;
          cursor: pointer;
        }
        .reset-vcode-image{
          display: block;
          margin: 5px 0 5px 160px;
          border: 1px solid #d8d8d8;
          padding: 8px 100px 10px 10px;
          position: absolute;
          bottom: -55px;
          left: 0;
          transition: all .3s;
          &>img{
            display: block;
            width: 96px;
            position: absolute;
            right:0;
            top: 0;
            cursor: pointer;
          }
          &:before{
            content: '';
            position: absolute;
            top: -5px;
            right: 10%;
            display: block;
            width: 8px;
            height: 8px;
            border-width: 1px 1px 0 0;
            border-color: #999999 #999999 transparent transparent;
            border-style: solid;
            -webkit-transform: rotate(-45deg);
            transform: rotate(-45deg);
            background: #fff;
            z-index: 1;
          }
          &-input{
            font-size: 16px;
            line-height: 24px;
            border: none;
            border: 1px solid #d8d8d8;
            outline: none;
            width: 120px;
            position: relative;
            padding-right: 0;
            &:focus{
              border: 1px solid #353A47;
            }
            &.warning{
               border: 1px solid #E6394D;
            }
          }
          &-confirm{
            display: inline-block;
            position: absolute;
            height: 26px;
            border-radius: 10px;
            text-align: center;
            font-size: 14px;
            line-height: 26px;
            width: 60px;
            top: 8px;
            color: #fff;
            right: 10px;
            cursor: pointer;
            background: gray;
            .active{
              background: #E6394D;
            }
          }
        }
      }
      &.reset-setpwd{
        margin-top: 20px;
        .reset-setpwd-forget{
          display: block;
          position: absolute;
          right: 50px;
          top: 8px;
          font-size: 14px;
          line-height: 18px;
          padding-left: 10px;
          cursor: pointer;
          .reset-pwd-switch{
            display: none;
            &:empty ~ label{
              display: inline-block;
              position: relative;
              &>i{
                opacity: 0;
                cursor: pointer;
              }
              &:before{
                content:'\e60d';
                font-size: 24px;
                font-family:'iconfont';
                position: absolute;
                left: 0;
                top: 0;
                display: block;
              }
            }
            &:checked ~ label{
              display: inline-block;
              position: relative;
              &>i{
                opacity: 0;
                cursor: pointer;
              }
              &:before{
                content:'\e60c';
                font-family:'iconfont';
                font-size: 24px;
                position: absolute;
                left: 0;
                top: 0;
                display: block;
              }
            }

          }
        }
      }
    }

    .reset-btn{
      margin: 20px 40px;
      width:360px;
      height: 48px;
      background-color: #E6394D ;
      cursor: pointer;
      text-align: center;
      color: #fff;
      line-height: 48px;
      font-size: 16px;
      letter-spacing:12px;
    }
  }
}
.success{
  display: block;
  width: 440px;
  position: relative;
  left: 0;
  height: 608px;
  background: #fff;
  &-body{
    display: block;
    height: 608px;
    position: relative;
    background: #fff;
    background-size: cover;
    .success-reset,.success-login,.success-register{
      padding-top: 180px;
      .iconfont{
        font-size: 80px;
        color:#E6394D;
        text-align: center;
        display: block;
      }
      .success-text{
        color:#E6394D;
        font-size: 18px;
        text-align: center;
      }
      .success-timer{
        color:#999;
        font-size: 14px;
        text-align: center;
      }
    }
    .success-reset-go-login{
      margin: 20px 40px;
      margin-top: 100px;
      width:360px;
      height: 48px;
      background-color: #E6394D ;
      cursor: pointer;
      text-align: center;
      color: #fff;
      line-height: 48px;
      font-size: 16px;
      letter-spacing:12px;
    }

  }
}

</style>
