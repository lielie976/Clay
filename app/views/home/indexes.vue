<template>
  <div id="home-stockIndex-container">
    <div class="home-stockindex">
      <div class="home-stockindex-index">
        <a class="home-stockindex-index-item" target="_blank" :href="`/stock/${index.Symbol}`" v-for="index in indexes" :key="index.Symbol">
          <div class="home-stockindex-index-item-title">
            {{index.Name}}
          </div>
          <div class="home-stockindex-index-item-info">
            <span 
              :class="{
                'home-stockindex-index-item-info-value': true,
                [renderMarketColor(index.px_change)]: true
              }"
            >{{ index.last_px }}</span>
            <span 
              :class="{
                'home-stockindex-index-item-info-change-value': true,
                [renderMarketColor(index.px_change)]: true
              }"
            >{{ index.px_change | toFixed(2) }}</span>
            <span 
              :class="{
                'home-stockindex-index-item-info-change-ratio': true,
                [renderMarketColor(index.px_change)]: true
              }"
            >({{ index.px_change_rate | toFixed(2) }}%)</span>
          </div>
        </a>
      </div>
      <div class="home-stockindex-ratio">
        <div class="home-stockindex-ratio-item">
          <span class="-market-color--rise home-stockindex-ratio-item-label">涨</span>
          <span class="-market-color--rise home-stockindex-ratio-item-count">{{ quoteChange.surged_num_count }}</span>
        </div>
        <div class="home-stockindex-ratio-item">
          <span class="-market-color--decline home-stockindex-ratio-item-label">跌</span>
          <span class="-market-color--decline home-stockindex-ratio-item-count">{{ quoteChange.decline_num_count }}</span>
        </div>
        <div class="home-stockindex-ratio-item">
          <span class="-market-color--balance home-stockindex-ratio-item-label">平</span>
          <span class="-market-color--balance home-stockindex-ratio-item-count">{{ quoteChange.stable_stocks_count }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { renderMarketColor } from '~/utils/helpers'

export default {
  data () {
    return {}
  },
  methods: {
    renderMarketColor
  },
  computed: {
    indexes () {
      return this.$store.state.market.indexes
    },
    quoteChange () {
      return this.$store.state.market.quoteChange
    }
  }
}
</script>

<style lang="less" scoped>
#home-stockIndex-container {
  background: #353A47;
}

.home-stockindex{
  background: #353A47;
  height: 32px;
  width: 1200px;
  display: flex;
  margin: 0 auto;
  color: #e6e6e6;
  font-size: 14px;
  line-height: 32px;
  &-index{
    display:flex;
    &-item{
      position: relative;
      width: 290px;
      &:after{
        content: '';
        height: 60px;
        display: block;
        width:1px;
        position: absolute;
        right: 0;
        top: 10px;
      }
    }
  }
  &-ratio{
    &-item{
      display: inline-block;
      margin-right: 20px;
      &-label{
        text-align:center;
      }
      &-count{
        text-align:center;
      }
    }
  }
}
.home-stockindex-index-item{
  color: #fff;
  &:hover {
    color: #fff;
  }
  &-title{
    display: inline-block;
    margin-right: 5px;
  }
  &-info{
    display: inline-block;
    &-value{
      line-height: 32px;
      text-align: right;
    }
  }
}


</style>

