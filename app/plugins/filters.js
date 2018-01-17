import Vue from 'vue'
import * as filters from '~/utils/helpers'

Object.keys(filters).forEach((name) => {
  Vue.filter(name, filters[name])
})
