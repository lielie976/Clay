<template>
  <widget-box href="/dingpan" title="智能盯盘">
    <div class="datacenter-body">
      <div class="datacenter-temperature">
        <div class="datacenter-temperature-title">
          <temperature :data="thermometer" />
        </div>
        <div class="datacenter-temperature-chart">
          <canvas class="datacenter-temperature-canvas" width="200" height="120">抱歉！浏览器不支持。</canvas>
        </div>
      </div>
      <detail :data="thermometer" />
    </div>
  </widget-box>
</template>

<script>
import dataCenter from './canvas'
import WidgetBox from '../WidgetBox'
import temperature from './temperature.vue'
import detail from './detail.vue'

export default {
  components: {
    WidgetBox,
    temperature,
    detail
  },
  computed: {
    thermometer () {
      const thermometer = this.$store.state.market.thermometer
      dataCenter.init({
        container: '.datacenter-temperature-canvas',
        value: thermometer.temperatureCeil
      })
      return thermometer
    }
  }
}
</script>

<style lang="less">
@import '../../styles/variables.less';

.datacenter-body{
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  border:1px solid @border-color-light;
  background: #fff;
  .datacenter-temperature{
    width : 52%;
    &-title{
      height: 50px;
      display: flex;
      padding: 10px;
      &-label{
        width: 60%;
        font-size: 14px;
        line-height: 28px;
      }
      &-ratio{
        width: 40%;
        font-size: 28px;
        line-height: 28px;
        text-align: right;
      }
    }
  }
  .datacenter-detail{
    width: 40%;
    padding-top:30px;
    padding-bottom: 20px;
    &>div{
      display: flex;
      width:100%;
      padding: 5px;
    }
    .datacenter-detail-label{
      width: 60%;
      font-size: 12px;
    }
    .datacenter-detail-count{
      width:40%;
      text-align: right;
      padding-right: 24px;
      font-size: 14px;
    }
  }
}

</style>
