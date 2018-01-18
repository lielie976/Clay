// 按需引入iview会报错，只能全部引入

import Vue from 'vue'
import iView from 'iview'
import '~/styles/iview-overrides.less'
// import 'iview/dist/styles/iview.css'
import 'hint.css/hint.min.css'
import '~/styles/global.less'

Vue.use(iView)
