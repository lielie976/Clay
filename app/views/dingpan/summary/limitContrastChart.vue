<template>
<div class="hit-pool-container">
   <div id="limit" class="hit-pool-chart" style="width: 180px;height:96px;" ref="chart"></div>
   <div class="hit-pool-title" id="limit-title">涨跌停对比<span id="fluctuation-title-number">{{raiseList.length?raiseList[raiseList.length - 1]:0}} : {{downList.length?downList[downList.length - 1]:0}}</span></div>
   <div id="limit-label"><p>{{maxValue}}</p><p>{{maxValue -
            midValue}}</p><p>{{minValue}}</p></div>
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
    raiseList: {
      type: Array
    },
    downList: {
      type: Array
    },
    timestampList: {
      type: Array
    }
  },
  data() {
    return {
      chart: null,
      maxValue: null,
      minValue: null,
      midValue: null,
      firstTime: true
    };
  },
  watch: {
    timestampList() {
      this.maxValue =
        this.raiseList && this.raiseList.length && this.downList && this.downList.length
          ? Math.max.apply(null, this.raiseList.concat(this.downList))
          : 2;
      this.minValue = 0;
      this.midValue = Math.ceil((this.maxValue - this.minValue) / 2);
      this.maxValue = this.minValue + this.midValue * 2;
      if (this.maxValue < 2) {
        this.maxValue = 2;
        this.midValue = 1;
      }
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
    this.maxValue =
      this.raiseList && this.raiseList.length && this.downList && this.downList.length
        ? Math.max.apply(null, this.raiseList.concat(this.downList))
        : 2;
    this.minValue = 0;
    this.midValue = Math.ceil((this.maxValue - this.minValue) / 2);
    this.maxValue = this.minValue + this.midValue * 2;
    if (this.maxValue < 2) {
      this.maxValue = 2;
      this.midValue = 1;
    }
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
    draw: function() {
      if (!this.timestampList || !this.raiseList || !this.downList) {
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
          left: "0",
          top: "5px"
        },
        grid: {
          left: "0px",
          right: "50px",
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
            return `<div class="chart-tooltip-title">${time}</div><div><span class="chart-tooltip-dot" style="background:${value[0]
              .color}"></span>${value[0].seriesName}:${value[0]
              .value}家</div><div><span class="chart-tooltip-dot" style="background:${value[1]
              .color}"></span>${value[1].seriesName}:${value[1].value}家</div>`;
          }
        },
        // X轴设置
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
            margin: -200,
            formatter: function(value, index) {
              return Math.ceil(value);
            },
            textStyle: {
              fontFamily: "-apple-system, BlinkMacSystemFont",
              fontSize: "10",
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
        series: [
          {
            name: "涨停",
            type: "line",
            symbolSize: 1,
            itemStyle: {
              normal: {
                opacity: 0,
                borderWidth: 0
              },
              emphasis: {
                opacity: 1,
                borderWidth: 0,
                color: "#F34646"
              }
            },
            lineStyle: {
              normal: {
                width: 1,
                color: "#F34646 "
              }
            },
            silent: true,
            animationDuration: 800,
            data: this.raiseList
          },
          {
            name: "跌停",
            type: "line",
            symbolSize: 1,
            itemStyle: {
              normal: {
                opacity: 0,
                borderWidth: 0
              },
              emphasis: {
                opacity: 1,
                borderWidth: 0,
                color: "#26CFB8"
              }
            },
            lineStyle: {
              normal: {
                width: 1,
                color: "#26CFB8"
              }
            },
            silent: true,
            animationDuration: 800,
            data: this.downList
          }
        ],
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
  #limit-title {
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
  #limit-label {
    position: absolute;
    right: 20px;
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
}
</style>
