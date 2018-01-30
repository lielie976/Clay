<template>
<div class="ban-chart-out">
  <div class="ban-chart-date">
    <DatePicker :open="dateOpen" :value="selectDate" :options="dateOption" type="date" @on-change="handleChange" @on-clear="handleClear" @on-ok="handleOk">
      <div @click="handleClick" class="ban-chart-date-container">
        <p class="ban-chart-date-month-week">
          {{dateFormatter(selectDate,'M月')+isoWeekDay(getIosDayCount(selectDate))}}
        </p>
        <p class="ban-chart-date-day">
          {{dateFormatter(selectDate,'DD')}}
        </p>
      </div>
    </DatePicker>
  </div>
  <div class="ban-chart">
    <temperature v-if="temperatureVal" :temprature="temperatureVal"/>
    <fluctuation-contrast-chart  :raiseList="fcRender.raiseList" :downList="fcRender.downList" :timestampList="fcRender.timestampList"/>
    <limit-contrast-chart  :raiseList="limitRender.raiseList" :downList="limitRender.downList" :timestampList="limitRender.timestampList"/>
    <behavior-kline-chart  :valueList="behaviorRender.valueList" :timestampList="behaviorRender.timestampList"/>
    <raise-incompleted-kline-chart :valueList="riseicRender.valueList" :boomRate="riseicRender.boomRate" :timestampList="riseicRender.timestampList"/>
  </div>
</div>
</template>

<script>
import getISODay from 'date-fns/get_iso_day';
import shareMethodMixin from '~/mixins/shareMethodMixin'
import temperature from './summary/temperature.vue'
import fluctuationContrastChart from './summary/fluctuationContrastChart.vue'
import limitContrastChart from './summary/limitContrastChart.vue'
import behaviorKlineChart from './summary/behaviorKlineChart.vue'
import raiseIncompletedKlineChart from './summary/raiseIncompletedKlineChart'
export default {
  props: ['selectDate'],
  data () {
    return {
      dateOpen: false,
      dateOption: {
        disabledDate: function (d) {
          return (
            getISODay(d) === 6 ||
            getISODay(d) === 7 ||
            d > new Date() ||
            d.getMonth() < new Date().getMonth() - 1
          );
        }
      }
    }
  },
  computed: {
    temperatureVal () {
      return this.$store.state.stockSummary.temperatureVal
    },
    fcRender () {
      if (this.$store.state.stockSummary.fluctuationContrastData) {
        let raiseList = [];
        let downList = [];
        let timestampList = [];
        this.$store.state.stockSummary.fluctuationContrastData.map(item => {
          raiseList.push(item.raise);
          downList.push(item.down);
          timestampList.push(item.time_stamp);
        })
        return {
          raiseList,
          downList,
          timestampList
        }
      } else {
        return {
          raiseList: [],
          downList: [],
          timestampList: []
        }
      }
    },
    limitRender () {
      if (this.$store.state.stockSummary.limitContrastData) {
        let raiseList = [];
        let downList = [];
        let timestampList = [];
        this.$store.state.stockSummary.limitContrastData.map(item => {
          raiseList.push(item.raise_except_newstocks);
          downList.push(item.down);
          timestampList.push(item.time_stamp);
        });
        return {
          raiseList,
          downList,
          timestampList
        }
      } else {
        return {
          raiseList: [],
          downList: [],
          timestampList: []
        }
      }
    },
    behaviorRender () {
      if (this.$store.state.stockSummary.behaviorKlineData) {
        let valueList = [];
        let timestampList = [];
        this.$store.state.stockSummary.behaviorKlineData.map(item => {
          valueList.push(item.filter_value);
          timestampList.push(item.time_stamp);
        });
        return {
          valueList,
          timestampList
        }
      } else {
        return {
          valueList: [],
          timestampList: []
        }
      }
    },

    riseicRender () {
      if (this.$store.state.stockSummary.raiseIncompletedKlineData && this.$store.state.stockSummary.limitContrastData) {
        let valueList = [];
        let timestampList = [];
        this.$store.state.stockSummary.raiseIncompletedKlineData.map(item => {
          valueList.push(item.value);
          timestampList.push(item.time_stamp);
        });
        let boardCount = this.limitRender.raiseList[this.limitRender.raiseList.length - 1];
        let boomCount =
          valueList && valueList.length ? valueList[valueList.length - 1] : 0;
        let boomRate = boomCount && boardCount ? boomCount / (boomCount + boardCount) : 0;
        return {
          valueList,
          timestampList,
          boomRate
        }
      } else {
        return {
          valueList: [],
          timestampList: [],
          boomRate: 0
        }
      }
    }
  },
  methods: {
    handleClick () {
      this.dateOpen = !this.dateOpen;
    },
    handleChange (date) {
      if (
        new Date(date).getMonth() > new Date().getMonth() ||
        new Date(date).getMonth() < new Date().getMonth() - 1
      ) {
        return;
      }
      this.dateOpen = false;
      this.$emit('change-date', date)
    },
    handleClear () {
      this.dateOpen = false;
    },
    handleOk () {
      this.dateOpen = false;
    },
    closeOption () {
      this.optionVisible = false;
    }
  },
  components: {
    temperature,
    fluctuationContrastChart,
    limitContrastChart,
    behaviorKlineChart,
    raiseIncompletedKlineChart
  },
  mixins: [shareMethodMixin]
}
</script>

<style lang="less" scoped>
@import '../../styles/variables.less';
.ban-chart {
  display: flex;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  height: 96px;
  justify-content: space-around;
  padding-left: 80px;
}
.ban-chart-date {
  width: 64px;
  height: 82px;
  margin-top: 12px;
  background-color: #3f4352;
  position: absolute;
  left: 15px;
  display: block;
  z-index: 2;
  cursor: pointer;
  .ivu-date-picker {
    position: relative;
    width: 100%;
    .ivu-select-dropdown {
      border-radius: 0;
    }
  }
  &:before {
    content: "";
    display: block;
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    height: 2px;
    background: #f2564e;
  }
  &:after {
    content: "";
    display: block;
    position: absolute;
    bottom: 0;
    right: 0;
    left: 0;
    height: 10px;
    background: @dingDarkMain;
  }
  &-container {
    padding-bottom: 15px;
  }
  &-month-week {
    color: #bcbcbc;
    font-size: 12px;
    padding-top: 6px;
    text-align: center;
  }
  &-day {
    color: #fff;
    font-size: 36px;
    line-height: 36px;
    text-align: center;
    display: block;
    position: relative;
    &:before {
      content: "";
      display: block;
      position: absolute;
      bottom: -5px;
      left: 27px;
      width: 0;
      height: 0;
      border-left: 6px solid transparent;
      border-right: 6px solid transparent;
      border-bottom: 6px solid #636a7f;
    }
  }
}
</style>

<style lang="less">
@import '../../styles/variables.less';
.ban-chart-date {
  font-family: Helvetica Neue, Helvetica, Arial, PingFang SC, Hiragino Sans GB,
    Heiti SC, Microsoft YaHei, WenQuanYi Micro Hei, sans-serif;
  .ivu-date-picker {
    .ivu-select-dropdown {
      border-radius: 0;
    }
    .ivu-date-picker-header {
      // display: none;
      background: #3e4352;
      border: none;
      color: #fff;
      .ivu-date-picker-next-btn-arrow-double {
        display: none;
      }
      .ivu-date-picker-prev-btn-arrow-double {
        display: none;
      }
    }
    .ivu-picker-panel-body {
      &:before {
        content: "";
        display: block;
        position: absolute;
        top: -6px;
        left: 27px;
        width: 0;
        height: 0;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-bottom: 6px solid #636a7f;
      }
    }
    .ivu-picker-panel-content {
      background: #3e4352;
      padding: 5px;
      position: relative;
      &:before {
        content: "";
        display: block;
        top: 0;
        left: 0;
        right: 0;
        height: 39px;
        position: absolute;
        background: @dingDarkSec;
      }
      .ivu-date-picker-cells {
        margin: 0;
        &-header {
          background: @dingDarkSec;
          padding: 3px 0;
          font-size: 14px;
          position: relative;
          span {
            color: #e6e6e6;
          }
        }
        &-cell {
          font-size: 14px; // -webkit-tap-highlight-color:red;
          em {
            color: #e6e6e6;
            border-radius: 0;
          }
          &-next-month {
            display: none;
          }
          &-prev-month {
            // display: none;
            em {
              color: #3e4352;
            }
          }

          &-selected {
            em {
              color: #e6e6e6;
              position: relative;
              background: transparent;
              &:before {
                content: "";
                display: block;
                bottom: 0;
                left: 3px;
                right: 3px;
                height: 2px;
                position: absolute;
                background: #f2564e;
              }
            }
          }
          &-today {
            em {
              color: #e6e6e6;
              position: relative;
              background: transparent;
              &:after {
                content: "";
                display: none;
              }
            }
          }
          &:hover {
            em {
              background: transparent;
              position: relative;
              &:before {
                content: "";
                display: block;
                bottom: 0;
                left: 3px;
                right: 3px;
                height: 2px;
                position: absolute;
                background: #bcbcbc;
              }
            }
          }
          &-disabled {
            background: #3e4352;
            em {
              color: #666;
            }
            &:hover {
              em:after {
                display: none;
              }
            }
          }
        }
      }
    }
  }
}
</style>
