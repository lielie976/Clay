<template>
<div class="hit-pool-container">
   <div id="behavior_kline" class="hit-pool-chart" style="width: 180px;height:96px;" ref="chart">

  </div>
  <div id="behavior_kline-title">昨日涨停今日表现<span id="behavior_kline-title-number" >{{valueList.length?rate(valueList[valueList.length - 1],2):'0%'}}</span></div>
  <div id="behavior_kline-label"><p>{{rate(maxValue,2)}}</p><p>{{rate((maxValue-midValue),2)}}</p><p>{{rate(minValue,2)}}</p></div>
</div>

</template>

<script>
/* eslint-disable */
import shareMethodMixin from '~/mixins/shareMethodMixin'
import format from "date-fns/format";
import echarts from "echarts/lib/echarts";
import "echarts/lib/chart/line";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/title";
export default {
  props: {
    valueList: {
      type: Array
    },
    timestampList: {
      type: Array
    }
  },
  data() {
    return {
      chart: null,
      maxValue: 0,
      minValue: 0,
      midValue: 0,
      firstTime: true
    };
  },
  watch: {
    valueList() {
      this.maxValue = this.valueList && this.valueList.length
        ? Math.max.apply(null, this.valueList.map(i => Math.abs(i)))
        : 0.01;
      this.minValue = -this.maxValue;
      this.midValue = this.maxValue;
      let pageIndex =isNaN(location.href.split('/')[location.href.split('/').length - 1])?0:location.href.split('/')[location.href.split('/').length - 1]==""?0:location.href.split('/')[location.href.split('/').length - 1]
      if (pageIndex == 0 && this.firstTime) {
        setTimeout(() => {
          this.draw();
        }, 700);
      } else {
        this.draw();
      }
    }
  },
  mounted() {
    this.maxValue = this.valueList && this.valueList.length
      ? Math.max.apply(null, this.valueList.map(i => Math.abs(i)))
      : 0.01;
    this.minValue = -this.maxValue;
    this.midValue = this.maxValue;
    let pageIndex = location.href.split("/")[
      location.href.split("/").length - 1
    ];
    if (pageIndex == 0 && this.firstTime) {
      setTimeout(() => {
        this.draw();
      }, 700);
    } else {
      this.draw();
    }
  },
  methods: {
    changeColor(n) {
      return "-market-color--" + (n === 0 ? "gray" : n > 0 ? "red" : "green");
    },
    draw: function() {
      let self = this;
      if (!this.timestampList || !this.valueList) {
        return;
      }
      if (!this.chart) {
        this.chart = echarts.init(this.$refs.chart);
      }
      this.chart.setOption({
        // 网格的上下左右距离
        title: {
          text: "",
          textStyle: {
            color: "#fff",
            fontSize: 14
          },
          left: "20px",
          top: "5px"
        },
        grid: {
          left: "0px",
          right: "60px",
          top: "35px",
          bottom: "15px"
        },
        tooltip: {
          trigger: "axis",
          // formatter: '{a0}: {c0}家<br />{a1}: {c1}家'
          formatter: function(value) {
            let time = format(
              new Date(value[0].axisValue * 1000),
              "YYYY-MM-DD HH:mm"
            );
            return `<div class="chart-tooltip-title">${time}</div><div>${value[0]
              .seriesName}:<span class="${self.changeColor(
              value[0].value
            )}">${self.rate(value[0].value, 2)}</span></div>`;
          }
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          // X轴的字体样式
          axisLabel: {
            show: false,
            formatter: function(value) {
              return format(new Date(value * 1000), "YYYY-MM-DD HH:mm");
            }
          },
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          data: this.timestampList
        },
        yAxis: {
          type: "value",
          max: this.maxValue,
          min: this.minValue,
          interval: this.midValue,
          axisLabel: {
            show: false,
            margin: -210,
            formatter: function(value, index) {
              return rate(value);
            },
            textStyle: {
              fontFamily: "-apple-system, BlinkMacSystemFont",
              fontSize: "10px",
              color: "#999999",
              fontWeight: "400"
            }
          },
          axisLine: {
            show: true
          },
          axisTick: {
            show: false,
            length: 24.5,
            lineStyle: {
              type: "dashed",
              color: "#88BBFF"
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              type: "dashed",
              color: "#565E73",
              opacity: 1
            }
          }
        },
        series: {
          name: "今日表现",
          type: "line",
          symbol: "circle",
          symbolSize: 2,
          itemStyle: {
            normal: {
              opacity: 0
            },
            emphasis: {
              opacity: 1,
              color: "#82A6D9"
            }
          },
          lineStyle: {
            normal: {
              width: 1,
              color: "#82A6D9"
            }
          },
          silent: true,
          animationDuration: 800,
          data: this.valueList
        },
        // 动画
        animationDurationUpdate: 1000,
        animationEasingUpdate: "linear"
      });
    }
  },
  mixins: [shareMethodMixin]
};
</script>
<style lang="less" scoped>
.hit-pool-container {
  position: relative;
  .hit-pool-title {
    position: absolute;
    left: 0;
    top: 0;
  }
  #behavior_kline-label {
    position: absolute;
    right: 8px;
    top: 22px;
    color: #fff;
    font-size: 10px;
    & > p {
      -webkit-text-size-adjust: none;
      text-align: right;
      font-size: 10px;
      line-height: 25px;
    }
  }
  #behavior_kline-title {
    position: absolute;
    top: 5px;
    left: 0;
    color: #fff;
    font-size: 14px;
    &-number {
      margin-left: 5px;
      font-size: 12px;
    }
  }
}
</style>
