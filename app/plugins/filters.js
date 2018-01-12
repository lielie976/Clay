import Vue from 'vue'
import * as filters from '~/utils/filters'

Object.keys(filters).forEach((name) => {
  Vue.filter(name, filters[name])
})
