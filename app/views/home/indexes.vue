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
              :class="{'home-stockindex-index-item-info-value': true, [renderMarketColor(value[index.Symbol].px_change)]: true}"
            >{{ value[index.Symbol].last_px }}</span>
            <span 
              :class="{'home-stockindex-index-item-info-change-value': true, [renderMarketColor(value[index.Symbol].px_change)]: true}"
            >{{ value[index.Symbol].px_change.toFixed(2) }}</span>
            <span 
              :class="{'home-stockindex-index-item-info-change-ratio': true, [renderMarketColor(value[index.Symbol].px_change)]: true}"
            >({{ value[index.Symbol].px_change_rate.toFixed(2) }})</span>
          </div>
        </a>
      </div>
      <div class="home-stockindex-ratio">
        <div class="home-stockindex-ratio-item">
          <span class="-market-color--red home-stockindex-ratio-item-label">涨</span>
          <span class="-market-color--red home-stockindex-ratio-item-count">{{1}}</span>
        </div>
        <div class="home-stockindex-ratio-item">
          <span class="-market-color--green home-stockindex-ratio-item-label">跌</span>
          <span class="-market-color--green home-stockindex-ratio-item-count">{{1}}</span>
        </div>
        <div class="home-stockindex-ratio-item">
          <span class="-market-color--gray home-stockindex-ratio-item-label">平</span>
          <span class="-market-color--gray home-stockindex-ratio-item-count">{{1}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Object
    }
  },
  data () {
    return {
      indexes: [{
        Name: '上证指数',
        Symbol: '000001.SS'
      }, {
        Name: '深证成指',
        Symbol: '399001.SZ'
      }, {
        Name: '创业板指',
        Symbol: '399006.SZ'
      }]
    }
  },
  methods: {
    renderMarketColor (val) {
      if (val >= 0) {
        return '-market-color--red'
      } else {
        return '-market-color--green'
      }
    }
  }
}
</script>

<style lang="less" scoped>
#home-stockIndex-container {
  background: #353A47;
}

.home-stockindex{
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

