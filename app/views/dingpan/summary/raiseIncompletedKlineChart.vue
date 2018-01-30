<template>
<div class="hit-pool-container">
   <div id="raise_incompleted_kline" class="hit-pool-chart" style="width: 180px;height:96px;" ref="chart">

  </div>
  <div id="raise_incompleted_kline-title">封板未遂（炸板率：<span id="behavior_kline-title-number" >{{valueList.length?rate(boomRate):'0%'}}</span>）</div>
  <div id="raise_incompleted_kline-label"><p>{{maxValue}}</p><p>{{(maxValue-midValue)}}</p><p>{{minValue}}</p></div>
</div>

</template>

<script>
/* eslint-disable */
import shareMethodMixin from '~/mixins/shareMethodMixin'
import format from "date-fns/format";
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
export default {
  props: {
    valueList: {
      type: Array
    },
    timestampList: {
      type: Array
    },
    boomRate:{
      type:Number
    }
  },
  data() {
    return {
      chart: null,
      maxValue: 0,
      minValue: 0,
      midValue: 0,
      firstTime:true
    };
  },
  watch: {
    timestampList() {
      this.maxValue = (this.valueList && this.valueList.length)? Math.max.apply(null, this.valueList):2;
      this.minValue = 0;
      this.midValue = Math.ceil((this.maxValue - this.minValue) / 2);
      this.maxValue = this.minValue + this.midValue * 2;
      let pageIndex = isNaN(location.href.split('/')[location.href.split('/').length - 1])?0:location.href.split('/')[location.href.split('/').length - 1]==""?0:location.href.split('/')[location.href.split('/').length - 1]
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
    this.maxValue = (this.valueList && this.valueList.length)? Math.max.apply(null, this.valueList):2;
    this.minValue = 0;
    this.midValue = Math.ceil((this.maxValue - this.minValue) / 2);
    this.maxValue = this.minValue + this.midValue * 2;
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
    //echarts渲染不知原因的会阻塞盯盘图标的动画效果  选择让其稍稍延迟加载
  },
  methods: {
    changeColor(n) {
      return "-market-color--" + (n === 0 ? "gray" : n > 0 ? "red" : "green");
    },
    draw: function() {
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
          right: "50px",
          top: "40px",
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
              .seriesName}:<span >${value[0].value}家</span></div>`;
          }
        },
        // visualMap: {
        //   pieces: [
        //     {
        //       max:888,
        //       min: 8,
        //       color: '#F34646' //红色
        //     }, // 不指定 max，表示 max 为无限大（Infinity）。
        //     {
        //       value: 8,
        //       color: '#919599'
        //     },
        //     {
        //       max: 8,
        //       min:0,
        //       color: '#26CFB8' //蓝色
        //     } // 不指定 min，表示 min 为无限大（-Infinity）。
        //   ],
        //   outOfRange: {
        //     color: '#26CFB8'
        //   },
        //   show: false
        // },
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
              color: "rgba(153,153,153,1)",
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
          name: "数量",
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
  #raise_incompleted_kline-title {
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
  #raise_incompleted_kline-label {
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
