<template>
  <svg v-if="chartList" viewBox="0 0 56 40" width="56" height="40">
    <line x1="0" :y1="20" :x2="56" :y2="20" stroke-width="1" stroke="#efefef"/>
    <polygon :fill="polygonColor(item)" v-for="(item,index) in chartList" :points="generatePolygon(item,index)"/>
  </svg>
</template>

<script>
import shareMethodMixin from '~/mixins/shareMethodMixin'
export default {
  data () {
    return {
      chartList: [],
      chartHeight: 40
    }
  },
  props: ['flowInfo'],
  watch: {
    flowInfo: {
      handler: function (val, oldVal) {
        if (this.flowInfo && this.flowInfo.length === 5) {
          let max = Math.abs(Math.max.apply(null, this.flowInfo.map(i => Math.abs(i))))
          this.chartList = this.flowInfo.map(item => {
            return max === 0 ? max : Math.ceil(item / max * this.chartHeight / 2)
          })
        } else {
          this.chartList = [0, 0, 0, 0, 0]
        }
      },
      deep: true
    }
  },
  mounted () {
    if (this.flowInfo && this.flowInfo.length === 5) {
      let max = Math.abs(Math.max.apply(null, this.flowInfo.map(i => Math.abs(i))))
      this.chartList = this.flowInfo.map(item => {
        return max === 0 ? max : Math.ceil(item / max * this.chartHeight / 2)
      })
    } else {
      this.chartList = [0, 0, 0, 0, 0]
    }
  },
  computed: {
  },
  mixins: [shareMethodMixin],
  methods: {
    generatePolygon (item, index) {
      let start = index * 10 + 5
      let end = (index) * 10 + 6 + 5
      let yCor = this.chartHeight / 2 - item
      return `${start} ${this.chartHeight / 2},${start} ${yCor},${end} ${yCor},${end} ${this.chartHeight / 2}`
    },
    polygonColor (item) {
      return item > 0 ? '#EB4651' : '#1CBF7B'
    }
  }
}
</script>

<style lang="less" scoped>
</style>
