// 按需引入会报错，只能全部引入

import Vue from 'vue'
import iView from 'iview'
import '~/styles/iview-overrides.less'
// import 'iview/dist/styles/iview.css'

Vue.use(iView)
