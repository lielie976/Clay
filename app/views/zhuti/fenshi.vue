<template>
  <div class="XGBchart-container">
    <div @click="clickDelegate" class="chart" id="XGBchart">
      <!--明天用vue吧label重写，z-index放高，添加时间，循环位置的时候用clone对象操作-->
      <!--showAnalyseShadow 时间转图上坐标点-->
      <!-- drag的边界处理，以及后续的loadmore操作 -->
      <!-- crosshair的下方和右边的tips样式修改以及时间的处理 -->
    </div>
    <template v-if="fenshiLabel && fenshiLabel.length">
      <span @mouseenter="enterLabel(item)" @mouseleave="leaveLabel(item)" v-for="item in fenshiLabel" class="fenshi-stock-label" :symbol="item.symbol"
      :style="{'backgroundColor': item.color,'left': item.pos.left +'px', 'top': item.pos.top +'px', width: item.width +'px'}">{{item.text}}</span>
    </template>
    <template v-if="(chartMode == 'lishi' || chartMode == 'fenxi') && timeDotMap">
      <template v-for="item in data_source.filtered_data" >
        <span @mouseleave="clearDotSelected" @mouseenter="dotSelected(timeDotMap[item[0]])" :class="dotColor(timeDotMap[item[0]])" :style="{left:(item.x - dotWidth/2) + 'px',top:dotPos(item) + 'px',width:dotWidth + 'px',height:dotWidth + 'px','border-radius':dotWidth + 'px'}" v-if="timeDotMap[item[0]]" class="chart-inner-item"></span>
      </template>
    </template>
  </div>
</template>
<script>
/* eslint-disable no-debugger, camelcase, space-before-function-paren, space-before-blocks, curly, eqeqeq, no-unused-vars */
import chartUtil from '~/utils/chartUtils'
import chartCul from '~/utils/chartCul'
import {LinearIndicatorTypeFuncs, CsIndicatorTypeFuncs} from '~/utils/layer.js'
import { genDefaultEvents, bindEvents, removeEvents } from '~/utils/chartEvents.js'
import format from 'date-fns/format'
import poolHelper from '~/utils/poolHelper'
// import { fetchThemeMessage } from '~/api/theme';

export default {
  props: ['fenshiData', 'chartMode', 'hasHovered', 'startTongjiDrag', 'lishiStock', 'fenxiStock', 'id'],
  watch: {
    fenshiData() {
      this.changingData = true
      if (this.chartMode === 'fenshi') {
        this.$store.dispatch('stockTrend/getTrend', this.fenshiData.map(i => i.symbol).join(',')).then(res => {
          let source = JSON.parse(JSON.stringify(this.$store.state.stockTrend.trend))
          if (source.length > 121) {
            console.log(source[121])
            let halfLast = JSON.parse(JSON.stringify(source[120]))
            halfLast[0] = new Date().setHours(13, 0, 0, 0) / 1000
            source.splice(121, 0, halfLast)
          }
          this.trend = source.map(i => {
            i[0] *= 1000
            return i
          })
          // console.log(this.$store.state.stockTrend.trend)
          // console.log(this.$store.state.zhutiTrend.trend)
          this.preClose = this.$store.state.stockTrend.preValue
          this.initFenshi()
        })
      }
      this.changingData = false
    },
    startTongjiDrag (v) {
      if (v) {
        removeEvents.call(this, document.getElementById('XGBchart'))
        this.events = genDefaultEvents.call(this)
        bindEvents.call(this)
        this.genCtx()
      } else {
        this.events = genDefaultEvents.call(this)
        bindEvents.call(this)
        this.genCtx()
      }
      this.rerender(true)
    },
    chartMode (mode) {
      if (mode === 'fenshi') {
        this.$store.dispatch('stockTrend/getTrend', this.fenshiData.map(i => i.symbol).join(',')).then(res => {
          this.trend = JSON.parse(JSON.stringify(this.$store.state.stockTrend.trend)).map(i => {
            i[0] *= 1000
            return i
          })
          this.preClose = this.$store.state.stockTrend.preValue
          this.initFenshi()
        })
      } else if (mode === 'lishi') {
        this.removeCanvas(document.getElementById('XGBchart'))
        this.analyseTime = []
        let pre = this.$store.state.zhutiTrend.preValue
        this.kline = JSON.parse(JSON.stringify(this.$store.state.zhutiTrend.kline)).map(i => {
          i = i.map((item, index) => {
            if (index == 0) {
              item *= 1000
            } else {
              item = item / pre.pre_close_px - 1
            }
            return item
          })
          if (this.lishiStock.length < 2) {
            return i
          } else {
            return i.slice(0, 1)
          }
        })
        this.$store.dispatch('stockTrend/getKline', this.lishiStock.map(i => i.symbol)).then(res => {
          this.mainStockkline = JSON.parse(JSON.stringify(this.$store.state.stockTrend.kline))
          this.initKline(this.lishiStock, this.lishiMap)
        })
      } else if (mode === 'fenxi') {
        this.removeCanvas(document.getElementById('XGBchart'))
        let pre = this.$store.state.zhutiTrend.preValue
        this.kline = JSON.parse(JSON.stringify(this.$store.state.zhutiTrend.kline)).map(i => {
          i = i.map((item, index) => {
            if (index == 0) {
              item *= 1000
            } else {
              item = item / pre.pre_close_px - 1
            }
            return item
          })
          if (this.fenxiStock.length < 2) {
            return i
          } else {
            return i.slice(0, 1)
          }
        })
        this.$store.dispatch('stockTrend/getKline', this.fenxiStock.map(i => i.symbol)).then(res => {
          this.mainStockkline = JSON.parse(JSON.stringify(this.$store.state.stockTrend.kline))
          this.initKline(this.fenxiStock, this.fenxiMap)
        })
      }
    },
    lishiStock () {
      if (this.chartMode === 'lishi') {
        this.removeCanvas(document.getElementById('XGBchart'))
        let pre = this.$store.state.zhutiTrend.preValue
        this.kline = JSON.parse(JSON.stringify(this.$store.state.zhutiTrend.kline)).map(i => {
          i = i.map((item, index) => {
            if (index == 0) {
              item *= 1000
            } else {
              item = item / pre.pre_close_px - 1
            }
            return item
          })
          if (this.lishiStock.length < 2) {
            return i
          } else {
            return i.slice(0, 1)
          }
        })
        this.$store.dispatch('stockTrend/getKline', this.lishiStock.map(i => i.symbol)).then(res => {
          this.mainStockkline = JSON.parse(JSON.stringify(this.$store.state.stockTrend.kline))
          this.initKline(this.lishiStock, this.lishiMap)
        })
      }
    },
    fenxiStock () {
      if (this.chartMode === 'fenxi') {
        this.removeCanvas(document.getElementById('XGBchart'))
        let pre = this.$store.state.zhutiTrend.preValue
        this.kline = JSON.parse(JSON.stringify(this.$store.state.zhutiTrend.kline)).map(i => {
          i = i.map((item, index) => {
            if (index == 0) {
              item *= 1000
            } else {
              item = item / pre.pre_close_px - 1
            }
            return item
          })
          if (this.fenxiStock.length < 2) {
            return i
          } else {
            return i.slice(0, 1)
          }
        })
        this.$store.dispatch('stockTrend/getKline', this.fenxiStock.map(i => i.symbol)).then(res => {
          this.mainStockkline = JSON.parse(JSON.stringify(this.$store.state.stockTrend.kline))
          this.initKline(this.fenxiStock, this.fenxiMap)
        })
      }
    },
    hasHovered(v) {
      if (this.changingData) return
      if (v) {
        this.data_source.fields = this.data_source.fields.map((field, index) => {
          if (field.type == 'line' && field.stockIndex) {
            field.color = (field.code == v) ? `rgba(${this.lineColorList[field.stockIndex - 1]},1)` : `rgba(${this.lineColorList[field.stockIndex - 1]},0.1)`
          }
          return field
        })
      } else {
        this.data_source.fields = this.data_source.fields.map((field, index) => {
          if (field.type == 'line' && field.stockIndex) {
            field.color = `rgba(${this.lineColorList[field.stockIndex - 1]},1)`
          }
          return field
        })
      }
      console.log(this.data_source.fields)
      this.rerender(true)
    },
    timeRange (v) {
      if (v && v.length == 2) {
        this.newsEvents = this.$store.state.theme.themeGoodBad.filter(i => {
          return i.updated_at * 1000 > v[0] && i.updated_at * 1000 < v[1]
        })
        let timeDotMap = {}
        this.newsEvents.map(i => {
          // let t = format(i.updated_at * 1000, 'YYYYMMDD')
          let t = new Date(i.updated_at * 1000).setHours(0, 0, 0, 0)
          if (!timeDotMap[t]) {
            timeDotMap[t] = {
              time: t,
              impact: i.impact
            }
          } else {
            if (timeDotMap[t].impact * i.impact <= 0) {
              timeDotMap[t].impact = 0
            }
          }
        })
        if (timeDotMap == {}) {
          timeDotMap = null
        }
        this.timeDotMap = timeDotMap
      } else {
        this.newsEvents = this.$store.state.theme.themeGoodBad
      }
    }
  },
  beforeDestroy () {
    // this.clean()
    this.removeCanvas(document.getElementById('XGBchart'))
  },
  computed: {
    lishiMap () {
      let r = {}
      this.lishiStock.map(l => {
        r[l.symbol] = l
      })
      return r
    },
    fenshiMap () {
      let r = {}
      this.fenshiData.map(l => {
        r[l.symbol] = l
      })
      return r
    },
    fenxiMap () {
      let r = {}
      this.fenxiStock.map(l => {
        r[l.symbol] = l
      })
      return r
    },
    timeRange () {
      return this.$store.state.zhutiChart.timeRange
    },
    dotWidth() {
      return this.viewport.width > 16 ? 16 : this.viewport.width
    }
  },
  mounted () {
  },
  data () {
    return {
      trend: null,
      kline: null,
      mainStockkline: null, // 沪深300的kline
      mainStock: {
        code: '000300.SS'
      },
      preClose: null,
      canvas_el: null,
      ia_canvas_el: null,
      mid_canvas_el: null,
      ctx: null,
      ia_ctx: null,
      mid_ctx: null,
      origin_width: 0,
      origin_height: 0,
      state: {
        ready: 0,
        ctx_clock: 0, // clock for fps fixing
        ia_ctx_clock: 0,
        mid_ctx_interval: 0
      },
      fenshiDate: new Date().setHours(0, 0, 0, 0),
      defaults: null,
      viewport: null,
      price_precision: null,
      style: null,
      data_style: null,
      data_source: null,
      coord: null,
      defaultCsWidth: 10,
      selectedDate: new Date(),
      trendRate: null,
      lineColorList: ['255,174,0', '194,145,242', '76,165,255', '61,207,238'],
      fenshiLabel: [],
      dragTime: [],
      analyseTime: [],
      hsmap: {},
      newsEvents: null,
      timeDotMap: null
      // startDate: new Date().setHours(9, 30, 0, 0),
      // endDate: new Date().setHours(15, 30, 0, 0)
    }
  },
  methods: {
    ...chartUtil,
    initFenshi () {
      let init = this.preClose.map(i => i.pre_close_px)
      let zhutiTrend = JSON.parse(JSON.stringify(this.$store.state.zhutiTrend.trend))
      let zhutiPre = this.$store.state.zhutiTrend.preValue.pre_close_px
      let zhutiMap = {}
      zhutiTrend.map(z => {
        zhutiMap[z[0] * 1000] = z[1] / zhutiPre - 1
      })
      let lastRate = 0 // 用来记录之前的数据 ，防止数据有漏的
      this.trendRate = this.trend.map(i => {
        let timeTrend = i.map((ii, iid) => {
          return iid == 0 ? ii : (ii / init[iid - 1]) - 1
        })
        if (zhutiMap[timeTrend[0]]) {
          timeTrend.push(zhutiMap[timeTrend[0]])
          lastRate = zhutiMap[timeTrend[0]]
        } else {
          timeTrend.push(lastRate)
        }
        return timeTrend
      })
      this.selectedDate = new Date(this.trendRate[0][0])
      // let lineColorList = ['255,174,0', '194,145,242', '76,165,255', '61,207,238']
      let fields = this.preClose.map((i, index) => {
        return {name: this.fenshiMap[i.code].name, code: i.code, type: 'line', as: 'mountain', t: 0, val_index: index + 1, color: `rgba(${this.lineColorList[index]},1)`, line_width: 1, isMain: false, stockIndex: index + 1}
      })
      fields.push({name: '板块', code: this.id, type: 'line', as: 'mountain', t: 0, val_index: this.preClose.length + 1, color: `rgba(0,0,0,1)`, line_width: 1, isMain: true, stockIndex: 0})
      let pattern = {
        data_source: {
          data: this.trendRate,
          fields: fields,
          time_ranges: [[this.selectedDate.setHours(9, 30, 0, 0), this.selectedDate.setHours(11, 30, 0, 0)], [this.selectedDate.setHours(13, 0, 0, 0), this.selectedDate.setHours(15, 0, 0, 0)]]
        },
        price_precision: 4,
        style: {
          font: {family: 'Microsoft YaHei', size: 14},
          padding: {top: 1, right: 100, bottom: 28, left: 60},
          wheel_zoom_step: 1,
          linear_last_point: false,
          linear_name_label: true,
          linear_label: {
            height: 20,
            width: 60,
            left: 0,
            font_color: '#ffffff',
            font_size: 12,
            font_style: '12px Microsoft YaHei'
          },
          xgb_style: true,
          tip: {
            high_color: '#FF4040',
            low_color: '#1EB955',
            curr_price: {
              line_width: 1,
              line_color: 'rgba(0,0,0,0)',
              label_bg: 'rgba(0,0,0,0)',
              label_color: 'rgba(0,0,0,0)',
              label_height: 20
            }
          },
          crosshair: {
            snap_to_close: false,
            color: '#979797',
            label_height: 20,
            label_bg: '#EFEFEF',
            label_color: '#333',
            label_horiz_padding: 5,
            pos_offset: {
              vertical: {x: 0, y: 0, width: 0}, // 0 means auto
              horizontal: {x: 0, y: 0, width: 0}
            },
            selected_point_color: ['rgba(38,165,225,0.2)', '#fff', 'rgba(38,165,225,1)']
          },
          grid: {
            bg: '#fff',
            limit: {y: [2, 8]},
            color: {x: '#f0f0f0', y: '#f0f0f0'},
            span: {x: 120, y: 30}
          },
          axis: {
            x_axis_pos: 1, // 1 means on bottom, -1 means on top
            y_axis_pos: 1, // 1 means on right, -1 means on left
            hide_candlestick_date: false,
            hide_candlestick_time: false,
            show_rate: false,
            label_pos: {
              x_axis: {x: -35, y: 20},
              y_axis: {x: 5, y: 4}
            },
            label_color: '#555',
            pointer_length: 0,
            bg_color: 'rgba(0,0,0,0)',
            line_color: 'rgba(0,0,0,0)',
            draw_frame: false
          }
        }
      };
      [this.canvas_el, this.ia_canvas_el, this.mid_canvas_el] = this.initCanvas(document.getElementById('XGBchart'), pattern)
      this.genCtx()
      this.Prepare(pattern)
      this.genStyle()
      this.rerender(true)
      this.events = genDefaultEvents.call(this)
      bindEvents.call(this)
    },
    initKline (source, map) {
      let dt = this.kline // 主题的kline
      let tempFields = []
      if (source.length < 2) {
        tempFields.push({name: 'K线', code: this.id, type: 'candlestick', t: 0, o: 1, c: 2, h: 3, l: 4, stockIndex: 0})
      }
      source.map((stock, stockIndex) => {
        let hsmap = {}
        let stockKlineFields = this.$store.state.stockTrend.klineFields
        let mainStockPre = this.mainStockkline[stock.symbol][0][stockKlineFields.indexOf('close_px')]
        let hs = this.mainStockkline[stock.symbol].map(i => {
          let temptime = new Date(String(i[0]).substr(0, 4) + '-' + String(i[0]).substr(4, 2) + '-' + String(i[0]).substr(6, 2) + 'T00:00:00').getTime()
          i[0] = temptime
          hsmap[temptime] = i[stockKlineFields.indexOf('close_px')] / mainStockPre - 1
          return i
        }) // 沪深300的kline
        let mainStockIndex = dt[0].length
        dt = dt.map(i => {
          if (hsmap[i[0]]) {
            i.push(hsmap[i[0]])
          } else {
            i.push(0)
          }
          return i
        })
        tempFields.push({name: map[stock.symbol].name, code: stock.symbol, type: 'line', t: 0, val_index: mainStockIndex, color: `rgba(${this.lineColorList[stockIndex]},1)`, line_width: 1, stockIndex: stockIndex + 1})
      })
      let tempwidth = Math.floor((this.origin_width - this.style.padding.left - this.style.padding.right) / dt.length)
      if (tempwidth < 6) {
        tempwidth = 6
      }
      let pattern = {
        data_source: {
          data: dt,
          fields: tempFields
        },
        viewport: {offset: 0, width: tempwidth},
        price_precision: 4,
        style: {
          font: {family: 'Microsoft YaHei', size: 14},
          padding: {top: 1, right: 100, bottom: 28, left: 60},
          wheel_zoom_step: 1,
          linear_last_point: false,
          linear_name_label: true,
          linear_label: {
            height: 20,
            width: 60,
            left: 0,
            font_color: '#ffffff',
            font_size: 12,
            font_style: '12px Microsoft YaHei'
          },
          xgb_style: true,
          tip: {
            high_color: '#FF4040',
            low_color: '#1EB955',
            curr_price: {
              line_width: 1,
              line_color: 'rgba(0,0,0,0)',
              label_bg: 'rgba(0,0,0,0)',
              label_color: 'rgba(0,0,0,0)',
              label_height: 20
            }
          },
          crosshair: {
            snap_to_close: false,
            color: '#979797',
            label_height: 20,
            label_bg: '#EFEFEF',
            label_color: '#333',
            label_horiz_padding: 5,
            pos_offset: {
              vertical: {x: 0, y: 0, width: 0}, // 0 means auto
              horizontal: {x: 0, y: 0, width: 0}
            },
            selected_point_color: ['rgba(38,165,225,0.2)', '#fff', 'rgba(38,165,225,1)']
          },
          grid: {
            bg: '#fff',
            limit: {y: [2, 8]},
            color: {x: '#f0f0f0', y: '#f0f0f0'},
            span: {x: 120, y: 30}
          },
          axis: {
            x_axis_pos: 1, // 1 means on bottom, -1 means on top
            y_axis_pos: 1, // 1 means on right, -1 means on left
            hide_candlestick_date: false,
            hide_candlestick_time: true,
            show_rate: false,
            label_pos: {
              x_axis: {x: -35, y: 20},
              y_axis: {x: 5, y: 4}
            },
            label_color: '#555',
            pointer_length: 0,
            bg_color: 'rgba(0,0,0,0)',
            line_color: 'rgba(0,0,0,0)',
            draw_frame: false
          }
        }
      };
      [this.canvas_el, this.ia_canvas_el, this.mid_canvas_el] = this.initCanvas(document.getElementById('XGBchart'), pattern)
      this.genCtx()
      this.Prepare(pattern)

      this.genStyle()
      this.rerender(true)
      this.events = genDefaultEvents.call(this)
      bindEvents.call(this)
    },
    clean() {
      this.ctx.clearRect(0, 0, this.origin_width, this.origin_height);
      this.ia_ctx.clearRect(0, 0, this.origin_width, this.origin_height);
      this.mid_ctx.clearRect(0, 0, this.origin_width, this.origin_height);
      // let stockLabel = document.querySelectorAll('.fenshi-stock-label')
      // for (let i = 0; i < stockLabel.length; i++) {
      //   document.getElementById('XGBchart').removeChild(stockLabel[i])
      // }
    },
    genCtx () {
      var dpr = window.devicePixelRatio;
      this.origin_width = this.canvas_el.width;
      this.origin_height = this.canvas_el.height;
      this.ctx = this.canvas_el.getContext('2d');
      this.canvas_el.style.width = this.canvas_el.width + 'px';
      this.canvas_el.style.height = this.canvas_el.height + 'px';
      this.canvas_el.width *= dpr;
      this.canvas_el.height *= dpr;
      this.ctx.scale(dpr, dpr);

      this.ia_ctx = this.ia_canvas_el.getContext('2d');
      this.ia_canvas_el.style.width = this.ia_canvas_el.width + 'px';
      this.ia_canvas_el.style.height = this.ia_canvas_el.height + 'px';
      this.ia_canvas_el.width *= dpr;
      this.ia_canvas_el.height *= dpr;
      this.ia_ctx.scale(dpr, dpr);

      this.mid_ctx = this.mid_canvas_el.getContext('2d');
      this.mid_canvas_el.style.width = this.mid_canvas_el.width + 'px';
      this.mid_canvas_el.style.height = this.mid_canvas_el.height + 'px';
      this.mid_canvas_el.width *= dpr;
      this.mid_canvas_el.height *= dpr;
      this.mid_ctx.scale(dpr, dpr);
    },
    Prepare (pattern) {
      this.defaults = this.DEFAULTS();
      if (this.viewport && this.viewport.offset && this.viewport.width) {
        ['price_precision', 'style', 'data_style', 'data_source'].forEach((key) => {
          this[key] = pattern[key] || this.defaults[key];
        })
      } else {
        ['viewport', 'price_precision', 'style', 'data_style', 'data_source'].forEach((key) => {
          this[key] = pattern[key] || this.defaults[key];
        })
      }
    },
    genStyle () {
      this.ctx.font = this.style.font.size + 'px ' + this.style.font.family;
      this.ia_ctx.font = this.ctx.font;
      this.style.padding.right_pos = this.origin_width - this.style.padding.right;
      this.style.padding.bottom_pos = this.origin_height - this.style.padding.bottom;
    },
    rerender (force) {
      if (!force && +new Date() - this.state.ctx_clock <= 30) return;
      this.state.ready = 0;
      this.state.ctx_clock = +new Date();
      this.state.ready = 0;
      this.clean();
      if (this.data_source.time_ranges) {
        this.genLinearCoord();
        this.drawGrid()
        this.drawLinearPrice();
        this.drawIndicators();
        this.drawAxis();
        this.drawAdditionalTips();
      } else {
        this.genCsCoord()
        this.drawGrid()
        this.drawCandlestick();
        this.drawIndicators()
        this.drawAxis()
        this.drawAdditionalTips()
      }
      if (this.startTongjiDrag) {
        chartCul.Draw.Fill(this.mid_ctx, (ctx) => {
          ctx.rect(0, 0, this.origin_width, this.origin_height);
        }, 'rgba(255, 255, 255, 0.5)');
      }
      if (!this.data_source.time_ranges && this.analyseTime && this.analyseTime.length) {
        this.showAnalyseShadow()
      }
      this.state.ready = 1;
    },
    clickDelegate (e) {
      if (e.target.className == 'drag-analyse-btn' || e.target.className == 'drag-zoom-btn') {
        this.dragTime = [this.state.events.dragstart_x_val, this.state.events.mouse_x_val]

        this.removeDragEndChoice()
        this.ia_ctx.clearRect(0, 0, this.origin_width, this.origin_height);
        this.mid_ctx.clearRect(0, 0, this.origin_width, this.origin_height);
        this.$emit('drag-selected', this.dragTime)
      }
      if (e.target.className == 'drag-zoom-btn') {
        this.zoomToTimeArea()
      }
      if (e.target.className == 'drag-analyse-btn') {
        // this.showDragArea()
        this.analyseTime = [this.state.events.dragstart_x_val, this.state.events.mouse_x_val]
        console.log(this.analyseTime)
        this.$emit('switch-analyse')
      }
    },
    enterLabel (item) {
      this.data_source.fields = this.data_source.fields.map((field, index) => {
        if (!field.isMain) {
          field.color = (field.code == item.symbol) ? `rgba(${this.lineColorList[field.stockIndex - 1]},1)` : `rgba(${this.lineColorList[field.stockIndex - 1]},0.1)`
        }
        return field
      })
      this.rerender(true)
    },
    leaveLabel (e) {
      this.data_source.fields = this.data_source.fields.map((field, index) => {
        console.log()
        if (!field.isMain) {
          field.color = `rgba(${this.lineColorList[field.stockIndex - 1]},1)`
        }
        return field
      })
      this.rerender(true)
    },
    zoomToTimeArea () {
      console.log(this.state.events.selected_index, this.state.events.dragstart_index)
      let tempwidth = Math.floor((this.origin_width - this.style.padding.left - this.style.padding.right) / Math.abs(this.state.events.selected_index - this.state.events.dragstart_index + 1))
      this.viewport.width = tempwidth < 64 ? tempwidth : 63
      this.viewport.offset = this.viewport.width * ((Math.max(this.state.events.selected_index, this.state.events.dragstart_index) + 1 + 0.5) - (this.kline.length))
      // this.viewport.offset = 0
      this.rerender()
      // this.viewport.width = this.kline
    },
    showDragEndChoice () {
      // console.log(this.state.events.mouse_x_val, this.state.events.dragstart_x_val) //当前选取的时间范围
      console.log(this.state.events.mouse_x_px, this.state.events.mouse_y_px)
      console.log(this.style.padding.right_pos, this.style.padding.bottom_pos)
      let btn_left, btn_top
      if (this.state.events.mouse_x_px + 120 < this.style.padding.right_pos) {
        // 可以放在右边
        if (this.state.events.mouse_y_px + 50 < this.style.padding.bottom_pos) {
          // 放在下面
          btn_left = this.state.events.mouse_x_px + 20
          btn_top = this.state.events.mouse_y_px + 10
        } else {
          btn_left = this.state.events.mouse_x_px + 20
          btn_top = this.state.events.mouse_y_px - 10
        }
      } else if (this.state.events.drag_x_px + 120 < this.style.padding.right_pos && this.state.events.mouse_y_px + 50 < this.style.padding.bottom_pos){
        // 有机会放在下面
        btn_left = this.state.events.drag_x_px
        btn_top = this.state.events.mouse_y_px + 10
      } else {
        // 只能放在左边
        btn_left = this.state.events.drag_x_px - 180
        btn_top = this.state.events.mouse_y_px - 10
      }
      let d = document.createElement('div');
      d.setAttribute('class', 'drag-choice-div');
      d.style = `left:${btn_left}px;top:${btn_top}px;width:120px;`
      d.innerHTML = `<span class="drag-analyse-btn">区间统计</span><span class="drag-zoom-btn">放大</span>`
      document.getElementById('XGBchart').appendChild(d)
    },
    removeDragEndChoice () {
      let stockLabel = document.querySelectorAll('.drag-choice-div')
      for (let i = 0; i < stockLabel.length; i++) {
        document.getElementById('XGBchart').removeChild(stockLabel[i])
      }
    },
    genLinearCoord () {
      var self = this;
      var fields = this.data_source.fields[0];

      this.data_source.filtered_data_buckets = this.datafilterByTimeRanges(this.data_source.data,
        this.data_source.time_ranges, fields.t);
      // this.$store.commit('zhutiChart/setTimeRange', [this.data_source.time_ranges[0][0], this.data_source.time_ranges[this.data_source.time_ranges.length - 1][1]])
      var y_max = Number.MIN_VALUE;
      var y_min = Number.MAX_VALUE;
      var y_actuals = this.data_source.filtered_data_buckets.map((bucket) => {
        var result = chartCul.Coord.calcYRangeNew.line(bucket, this.data_source.fields);
        if (result[0] === result[1]) {
          result[0] -= result[0] * 0.001;
          result[1] += result[1] * 0.001;
        }
        if (result[0] < y_min) y_min = result[0];
        if (result[1] > y_max) y_max = result[1];
        return result;
      });
      // calc the vertical padding of grid
      var vertical_padding = chartCul.Coord.linearPixels2Actual(self.style.grid.span.y * 2, {
        display: [this.style.padding.bottom_pos, this.style.padding.top],
        actual: [y_min, y_max]
      });
      y_min -= vertical_padding;
      y_max += vertical_padding;

      var y_actual = [y_min, y_max];

      // enlarge the actual range of vertical coord when base value line is specified
      if (this.data_source.base_value !== undefined) {
        var base_value = this.data_source.base_value;
        var span = Math.max(Math.abs(base_value - y_max), Math.abs(base_value - y_min));
        y_actual = [base_value - span, base_value + span];
      }

      // create coord
      this.coord = {
        x: {display: [this.style.padding.left, this.style.padding.right_pos],
          actual: [this.data_source.time_ranges[0][0], this.data_source.time_ranges[this.data_source.time_ranges.length - 1][1]]},
        y: {display: [this.style.padding.bottom_pos, this.style.padding.top], actual: y_actual},
        viewport: this.viewport,
        coord_width: (this.style.padding.right_pos - this.style.padding.left) / this.data_source.time_ranges.length
      };
      // each splitted coord
      this.coords = this.data_source.time_ranges.map((range, index) => {
        var left = self.style.padding.left + self.coord.coord_width * index;
        var right = left + self.coord.coord_width;
        return {
          x: {display: [left, right], actual: [range[0], range[1]]},
          y: {display: [self.style.padding.bottom_pos, self.style.padding.top], actual: y_actuals[index]}
        };
      });

      // calc display position x of each visiable point
      this.data_source.filtered_data_buckets.forEach((bucket, index) => {
        bucket.forEach((item) => {
          item.x = ~~chartCul.Coord.linearActual2Display(item[fields.t], self.coords[index].x);
        });
      });
    },
    drawLinearPrice () {
      var self = this;
      var fields = this.data_source.fields[0];
      if (fields.type !== 'linear') return;

      var points = [];

      // points calculation
      this.data_source.filtered_data_buckets.forEach(function(bucket, index){
        var bucket_points = [];
        bucket.forEach(function(item){
          var x = item.x;
          var y = ~~chartCul.Coord.linearActual2Display(item[fields.val_index], self.coord.y);

          bucket_points.push([x, y]);
        });
        points.push(bucket_points);
      });

      // line drawing
      chartCul.Draw.Stroke(self.ctx, function(ctx){
        ctx.lineWidth = self.data_style.mountain.line_width;

        points.forEach(function(bucket_points){
          bucket_points.forEach(function(point, index){
            if (!index)
              ctx.moveTo(point[0], point[1]);

            ctx.lineTo(point[0], point[1]);
          });
        });
      }, self.data_style.mountain.line_color);

      // gradient drawing
      var gradient = self.ctx.createLinearGradient(0, 0, 0, self.style.padding.bottom_pos - self.style.padding.top);
      gradient.addColorStop(0, self.data_style.mountain.gradient_up);
      gradient.addColorStop(1, self.data_style.mountain.gradient_down);
      points.forEach((bucket_points) => {
        if (bucket_points.length)
          chartCul.Draw.Fill(self.ctx, (ctx) => {
            ctx.moveTo(bucket_points[0][0], self.style.padding.bottom_pos);
            bucket_points.forEach((point, index) => {
              ctx.lineTo(point[0], point[1]);
            });
            ctx.lineTo(bucket_points[bucket_points.length - 1][0], self.style.padding.bottom_pos);
            ctx.closePath();
          }, gradient);
      });

      // current point
      var last_bucket = points[points.length - 1];
      var last_point = last_bucket[last_bucket.length - 1];
      this.data_source.last_point = last_point;
    },
    genCsCoord () {
      var fields = this.data_source.fields[0];
      // filter data by viewport
      // var filter_result = chartCul.Coord.dataFilterByViewport(JSON.parse(JSON.stringify(this.data_source.data)), this.viewport, this);
      var filter_result = chartCul.Coord.dataFilterByViewport(this.data_source.data, this.viewport, this);
      this.data_source.filtered_data = filter_result.result;
      this.data_source.left_offset = filter_result.left_offset;
      this.data_source.right_offset = filter_result.right_offset;
      this.$store.commit('zhutiChart/setTimeRange', [this.data_source.filtered_data[0][0], this.data_source.filtered_data[this.data_source.filtered_data.length - 1][0]])
      // calculate actual range of data
      var y_actual = chartCul.Coord.calcYRangeNew[fields.type](this.data_source.filtered_data, this.data_source.fields);
      var x_actual = [
        this.data_source.filtered_data[0][fields.t],
        this.data_source.filtered_data[this.data_source.filtered_data.length - 1][fields.t]
      ];

      // calc the vertical padding of grid
      var vertical_padding = chartCul.Coord.linearPixels2Actual(this.style.grid.span.y * 2, {
        display: [this.style.padding.bottom_pos, this.style.padding.top],
        actual: y_actual
      })
      y_actual[0] -= vertical_padding;
      y_actual[1] += vertical_padding;

      // with base value line
      if (this.data_source.base_value !== undefined) {
        var base_value = this.data_source.base_value;
        var span = Math.max(Math.abs(base_value - y_actual[0]), Math.abs(base_value - y_actual[1]));
        y_actual = [base_value - span, base_value + span];
      }

      // create coord
      this.coord = {
        x: {display: [this.style.padding.left, this.style.padding.right_pos], actual: x_actual},
        y: {display: [this.style.padding.bottom_pos, this.style.padding.top], actual: y_actual},
        viewport: this.viewport
      };
    },
    drawGrid () {
      var self = this;
      // draw background
      chartCul.Draw.Fill(this.ctx, (ctx) => {
        ctx.rect(0, 0, self.origin_width, self.origin_height);
      }, this.style.grid.bg);
      // calchartCulate horizontal lines position
      var y_num = ~~((this.coord.y.display[0] - this.coord.y.display[1]) / this.style.grid.span.y);
      if (y_num > self.style.grid.limit.y[1]) y_num = self.style.grid.limit.y[1];
      if (y_num < self.style.grid.limit.y[0]) y_num = self.style.grid.limit.y[0];
      var horiz_lines = [];

      if (this.data_source.base_value === undefined) {
        // no base value line specified

        if (this.coord.y.actual[0] === this.coord.y.actual[1]) {
          this.coord.y.actual[0] -= 0.001
          this.coord.y.actual[1] += 0.001
        }
        horiz_lines = chartCul.Coord.seekNeatPoints(this.coord.y.actual, y_num + 1);
      } else {
        // with base value line
        var y_actual = this.coord.y.actual;
        var base_value = this.data_source.base_value;
        var span = (y_actual[1] - y_actual[0]) / 2;
        horiz_lines = [y_actual[0], base_value];
        while (horiz_lines.length < y_num) {
          span /= 2;
          for (var i = 0, limit = horiz_lines.length; i < limit; i++) {
            horiz_lines.push(horiz_lines[i] + span);
          }
        }
        horiz_lines.push(y_actual[1]);
      }
      horiz_lines = horiz_lines.map((val) => {
        return {actual: val, display: ~~chartCul.Coord.linearActual2Display(val, self.coord.y) + 0.5};
      });

      // draw horizontal lines
      chartCul.Draw.Stroke(this.ctx, (ctx) => {
        horiz_lines.forEach((y, index) => {
          ctx.moveTo(self.style.padding.left, y.display);
          ctx.lineTo(self.style.padding.right_pos, y.display);
        });
      }, this.style.grid.color.x);
      this.coord.horiz_lines = horiz_lines;

      // calculate vertical lines position
      var vertical_lines = [];

      if (this.data_source.time_ranges) {
        // vertical grid line drawing for linear chart
        this.data_source.time_ranges.forEach((range, index) => {
          vertical_lines.push({display: ~~(self.style.padding.left + self.coord.coord_width * index) + 0.5, actual: range[0]});
          if (index === self.data_source.time_ranges.length - 1) {
            vertical_lines.push({display: self.style.padding.right_pos + 0.5, actual: range[1]});
          }
        });
      } else {
        // vertical grid line drawing for candlestick chart
        for (var l = this.data_source.data.length - 1; l >= 0; l -= ~~(this.style.grid.span.x / this.viewport.width)) {
          if (this.data_source.data[l].x > this.style.padding.left &&
              this.data_source.data[l].x <= this.style.padding.right_pos) {
            vertical_lines.push({display: ~~this.data_source.data[l].x + 0.5, actual: this.data_source.data[l][self.data_source.fields[0].t]});
          }
        }
      }
      // draw vertical lines
      chartCul.Draw.Stroke(this.ctx, (ctx) => {
        vertical_lines.forEach((val, ind) => {
          ctx.moveTo(val.display, self.style.padding.top);
          ctx.lineTo(val.display, self.style.padding.bottom_pos);
        });
      }, this.style.grid.color.y);
      this.coord.vertical_lines = vertical_lines;
    },
    drawCandlestick () {
      var self = this;
      var fields = self.data_source.fields[0];
      var lines = {up: [], down: []};
      var boxes = {up: [], down: []};
      var peaks = [];
      if (fields.type !== 'candlestick')
        return;
      this.data_source.filtered_data.forEach(function(item){
        var h = ~~chartCul.Coord.linearActual2Display(item[fields.h], self.coord.y);
        var o = ~~chartCul.Coord.linearActual2Display(item[fields.o], self.coord.y);
        var c = ~~chartCul.Coord.linearActual2Display(item[fields.c], self.coord.y);
        var l = ~~chartCul.Coord.linearActual2Display(item[fields.l], self.coord.y);
        lines[c < o ? 'up' : 'down'].push([~~item.x, l, h]);
        var w = self.viewport.width - 2 > 30 ? 30 : self.viewport.width - 2;
        boxes[c < o ? 'up' : 'down'].push([item.x - w / 2 + 1, o > c ? c : o, w - 2, Math.abs(o - c), o, c, ~~item.x]);
        peaks.push([~~item.x, c]);
      });
      for (let direction in lines){
        if (fields.as === 'OHLC')
          chartCul.Draw.Stroke(self.ctx, (ctx) => {
            ctx.lineWidth = ~~(self.viewport.width / 10);
            if (ctx.lineWidth > 1)
              ctx.lineWidth += ctx.lineWidth % 2 ? 0 : 1;

            lines[direction].forEach((line) => {
              ctx.moveTo(line[0] + 0.5, line[1]);
              ctx.lineTo(line[0] + 0.5, line[2]);
            });
          }, this.data_style.OHLC[direction]);

        else if (fields.as === 'mountain'){
          // no high low drawing needed
        } else
          chartCul.Draw.Stroke(self.ctx, (ctx) => {
            lines[direction].forEach((line) => {
              ctx.moveTo(line[0] + 0.5, line[1] + 0.5);
              ctx.lineTo(line[0] + 0.5, line[2] + 0.5);
            });
          }, this.data_style.candlestick.wick[direction]);
      }

      for (let direction in boxes){
        if (fields.as === 'OHLC')
          chartCul.Draw.Stroke(self.ctx, (ctx) => {
            boxes[direction].forEach((box) => {
              ctx.lineWidth = ~~(self.viewport.width / 10);
              if (ctx.lineWidth > 1)
                ctx.lineWidth += ctx.lineWidth % 2 ? 0 : 1;

              ctx.moveTo(box[0] + 1, box[4] + 0.5);
              ctx.lineTo(box[6] + 1 + (ctx.lineWidth - 1) / 2, box[4] + 0.5);

              ctx.moveTo(box[0] + box[2], box[5] + 0.5);
              ctx.lineTo(box[6] - (ctx.lineWidth - 1) / 2, box[5] + 0.5);
            });
          }, this.data_style.OHLC[direction]);

        else if (fields.as === 'mountain'){
          // pass
        } else
          chartCul.Draw.FillnStroke(self.ctx, function(ctx){
            boxes[direction].forEach(function(box){
              ctx.rect(box[0] + 0.5, box[1] + 0.5, box[2], box[3] + 0.02); // + 0.02 is for IE fix
            });
          }, this.data_style.candlestick.block[direction], this.data_style.candlestick.border[direction]);
      }

      if (fields.as == 'mountain'){
        chartCul.Draw.Stroke(self.ctx, (ctx) => {
          ctx.lineWidth = self.data_style.mountain.line_width;
          peaks.forEach(function(peak, index){
            if (!index)
              ctx.moveTo(peak[0], peak[1]);

            ctx.lineTo(peak[0], peak[1]);
          });
        }, self.data_style.mountain.line_color);

        var gradient = self.ctx.createLinearGradient(0, 0, 0, self.style.padding.bottom_pos - self.style.padding.top);
        gradient.addColorStop(0, self.data_style.mountain.gradient_up);
        gradient.addColorStop(1, self.data_style.mountain.gradient_down);

        chartCul.Draw.Fill(self.ctx, (ctx) => {
          ctx.moveTo(peaks[0][0], self.style.padding.bottom_pos);
          peaks.forEach(function(peak, index){
            ctx.lineTo(peak[0], peak[1]);
          });
          ctx.lineTo(peaks[peaks.length - 1][0], self.style.padding.bottom_pos);
          ctx.closePath();
        }, gradient);
      }
    },
    showAnalyseShadow () {
      // console.log(this.data_source.filtered_data)
      let visMaxTime = this.data_source.filtered_data[this.data_source.filtered_data.length - 1][0]
      let visMinTime = this.data_source.filtered_data[0][0]
      let analyseMaxTime = Math.max(this.analyseTime[0], this.analyseTime[1])
      let analyseMinTime = Math.min(this.analyseTime[0], this.analyseTime[1])
      let shadow_x_min = 0
      let shadow_x_max = 0
      if (visMaxTime > analyseMaxTime && visMinTime < analyseMinTime) {
        // 在中间画阴影
        shadow_x_min = this.data_source.filtered_data.find(i => i[0] >= analyseMinTime).x
        shadow_x_max = this.data_source.filtered_data.find(i => i[0] >= analyseMaxTime).x
      } else if (visMaxTime <= analyseMaxTime){
        // 最大值超了
        if (visMinTime > analyseMinTime) {
        // 最小值超了
          // shadow_x_min = this.data_source.filtered_data.find(i => i[0] >= analyseMinTime).x
          shadow_x_min = this.style.padding.left - this.viewport.width / 2
          shadow_x_max = this.style.padding.right_pos + this.viewport.width / 2
        } else if (visMaxTime > analyseMinTime) {
          // 最小值没超了
          shadow_x_min = this.data_source.filtered_data.find(i => i[0] >= analyseMinTime).x
          shadow_x_max = this.style.padding.right_pos + this.viewport.width / 2
        } else {
          shadow_x_min = 0
          shadow_x_max = 0
        }
      } else {
        // 最小值超了
        if (visMinTime > analyseMaxTime) {
          shadow_x_min = 0
          shadow_x_max = 0
        } else if (visMaxTime > analyseMaxTime) {
          // 最大值没超
          shadow_x_min = this.style.padding.left - this.viewport.width / 2
          shadow_x_max = this.data_source.filtered_data.find(i => i[0] >= analyseMaxTime).x
        } else {
          shadow_x_min = this.style.padding.left - this.viewport.width / 2
          shadow_x_max = this.style.padding.right_pos + this.viewport.width / 2
        }
      }
      chartCul.Draw.Fill(this.mid_ctx, (ctx) => {
        ctx.rect(shadow_x_min, 0, shadow_x_max - shadow_x_min, this.origin_height);
      }, 'rgba(53, 58, 71, 0.05)');
      // console.log(shadow_x_min, shadow_x_max)
    },
    drawIndicators () {
      var self = this;
      if (this.data_source.time_ranges){
        if (this.chartMode === 'fenshi') {
          this.fenshiLabel = []
        }
        this.data_source.fields.forEach((item) => {
          LinearIndicatorTypeFuncs[item.type] && LinearIndicatorTypeFuncs[item.type].call(self, item);
          if (this.chartMode === 'fenshi') {
            this.fenshiLabel.push(this.drawDivLabel(this.fenshiMap, item))
          }
        });
      } else {
        if (this.chartMode === 'lishi') {
          this.fenshiLabel = []
        }
        this.data_source.fields.forEach((item) => {
          CsIndicatorTypeFuncs[item.type] && CsIndicatorTypeFuncs[item.type].call(self, item);
          if (this.chartMode === 'lishi' && item.val_index) {
            this.fenshiLabel.push(this.drawDivLabel(this.lishiMap, item))
          }
        });
      }
    },
    drawDivLabel (dataSource, params) {
      if (params.color && this.style.linear_name_label) {
        let labelData = this.data_source.filtered_data_buckets ? this.data_source.filtered_data_buckets[0][0] : this.data_source.filtered_data[0]
        let mtop = chartCul.Coord.linearActual2Display(labelData[params.val_index], this.coord.y) - 10
        let rendData
        if (params.isMain) {
          rendData = {
            symbol: params.name,
            text: params.name,
            pos: {
              left: this.style.linear_label.left,
              top: mtop
            },
            color: params.color,
            width: this.style.padding.left - 2
          }
        } else {
          rendData = {
            symbol: dataSource[params.code].symbol,
            text: dataSource[params.code].name,
            pos: {
              left: this.style.linear_label.left,
              top: mtop
            },
            color: params.color,
            width: this.style.padding.left - 2
          }
        }
        rendData = this.adjustLabelPos(rendData)
        return rendData
        // document.getElementById('XGBchart').appendChild(d)
      }
    },
    adjustLabelPos (rendData) {
      while (this.fenshiLabel.some(i => Math.abs(i.pos.top - rendData.pos.top) < 20)) {
        let temp = this.fenshiLabel.find(i => Math.abs(i.pos.top - rendData.pos.top) < 20)
        if (rendData.pos.top - 20 > 0) {
          rendData.pos.top -= 20
        } else {
          rendData.pos.top += 20
        }
      }
      return rendData
    },
    drawAxis () {
      var self = this;
      // fill padding places
      chartCul.Draw.Fill(this.ctx, function(ctx){
        ctx.rect(0, 0, self.origin_width, self.style.padding.top);
        ctx.rect(0, 0, self.style.padding.left, self.origin_height);
        ctx.rect(self.style.padding.right_pos, 0, self.style.padding.right, self.origin_height);
        ctx.rect(0, self.style.padding.bottom_pos, self.origin_width, self.style.padding.bottom);
      }, this.style.axis.bg_color);
      var x = self.style.axis.y_axis_pos === 1 ? self.style.padding.right_pos : 0;
      var x_line_pos = self.style.axis.y_axis_pos === 1 ? self.style.padding.right_pos : self.style.padding.left;
      var x_line_pos_op = self.style.axis.y_axis_pos === 1 ? self.style.padding.left : self.style.padding.right_pos;
      var y = self.style.axis.x_axis_pos === 1 ? self.style.padding.bottom_pos : self.style.padding.top;
      var y_op = self.style.axis.x_axis_pos === 1 ? self.style.padding.top : self.style.padding.bottom_pos;

      // draw axis lines
      chartCul.Draw.Stroke(this.ctx, function(ctx){
        self.coord.horiz_lines.forEach(function(y){
          ctx.moveTo(x_line_pos, y.display);
          ctx.lineTo(x_line_pos + self.style.axis.pointer_length * self.style.axis.y_axis_pos, y.display);
        });

        self.coord.vertical_lines.forEach(function(x){
          ctx.moveTo(x.display, y);
          ctx.lineTo(x.display, y + self.style.axis.pointer_length * self.style.axis.x_axis_pos);
        });

        // draw axis line
        ctx.moveTo(x_line_pos + 0.5, self.style.padding.top);
        ctx.lineTo(x_line_pos + 0.5, self.style.padding.bottom_pos);

        ctx.moveTo(self.style.padding.left, y + 0.5);
        ctx.lineTo(self.style.padding.right_pos, y + 0.5);

        if (self.style.axis.draw_frame){
          ctx.moveTo(x_line_pos_op + 0.5, self.style.padding.top);
          ctx.lineTo(x_line_pos_op + 0.5, self.style.padding.bottom_pos);

          ctx.moveTo(self.style.padding.left, y_op + 0.5);
          ctx.lineTo(self.style.padding.right_pos, y_op + 0.5);
        }

        if (self.style.axis.show_rate){
          var rate_x = self.style.axis.y_axis_pos > 0 ? self.style.padding.left : self.style.padding.right_pos;

          ctx.moveTo(rate_x + 0.5, self.style.padding.top);
          ctx.lineTo(rate_x + 0.5, self.style.padding.bottom_pos);

          self.coord.horiz_lines.forEach(function(y){
            ctx.moveTo(rate_x, y.display);
            ctx.lineTo(rate_x + self.style.axis.pointer_length * -self.style.axis.y_axis_pos, y.display);
          });
        }
      }, self.style.axis.line_color);

      // draw labels
      var rates = {up: [], down: []};
      // 这快是y轴右边的刻度
      chartCul.Draw.Text(this.ctx, (ctx) => {
        self.coord.horiz_lines.forEach((y, index) => {
          var val = y.actual.toFixed(self.price_precision);
          if (this.style.xgb_style) {
            ctx.fillStyle = poolHelper.colorStr(val)
            val = Number(val * 100).toFixed(2) + '%'
          }
          var x_offset = self.style.axis.label_pos.y_axis.x;

          var y_pos = y.display + self.style.axis.label_pos.y_axis.y;
          if (y_pos < 10)
            y_pos += 10;
          if (y_pos > self.origin_height - 10)
            y_pos -= 10;

          ctx.fillText(val,
            x + self.style.axis.pointer_length + x_offset,
            y_pos);
        });
      })
      chartCul.Draw.Text(this.ctx, (ctx) => {
        if (!self.data_source.time_ranges){
          self.coord.vertical_lines.forEach((x) => {
            ctx.fillText(chartCul.Coord.getDateStr(x.actual, self.style.axis.hide_candlestick_date, self.style.axis.hide_candlestick_time),
              x.display + self.style.axis.label_pos.x_axis.x + ((self.style.axis.hide_candlestick_date || self.style.axis.hide_candlestick_time) && 15),
              y + self.style.axis.label_pos.x_axis.y * self.style.axis.x_axis_pos);
          });
        } else {
          self.data_source.time_ranges.forEach((range, index) => {
            var width = self.style.padding.right_pos - self.style.padding.left;
            var display_range = [
              index * width / self.data_source.time_ranges.length + this.style.padding.left,
              (index + 1) * width / self.data_source.time_ranges.length + this.style.padding.left
            ];
            ctx.fillText(chartCul.Coord.getDateStr(range[0], true),
              display_range[0] + 5,
              y + self.style.axis.label_pos.x_axis.y * self.style.axis.x_axis_pos);
            var str_width = ctx.measureText(chartCul.Coord.getDateStr(range[1], true)).width;
            ctx.fillText(chartCul.Coord.getDateStr(range[1], true),
              display_range[1] - str_width - 5,
              y + self.style.axis.label_pos.x_axis.y * self.style.axis.x_axis_pos);
          })
        }
        if (self.style.axis.show_rate){
          var rate_x = self.style.axis.y_axis_pos > 0 ? 0 : self.style.padding.right_pos;

          self.coord.horiz_lines.forEach((y, index) => {
            var val = ((y.actual - self.data_source.base_value) / self.data_source.base_value);
            var x_offset = ctx.measureText(val.toFixed(2) + '%').width + self.style.axis.label_pos.y_axis.x;

            var y_pos = y.display + self.style.axis.label_pos.y_axis.y;
            if (y_pos < 10)
              y_pos += 10;
            if (y_pos > self.origin_height - 10)
              y_pos -= 10;

            if (val === 0)
              ctx.fillText(val.toFixed(2) + '%',
                rate_x + self.style.axis.pointer_length + x_offset * self.style.axis.y_axis_pos,
                y_pos);
            else {
              rates[val > 0 ? 'up' : 'down'].push([(val * 100).toFixed(2) + '%',
                rate_x + self.style.axis.pointer_length + x_offset * self.style.axis.y_axis_pos,
                y_pos])
            }
          });
        }
      }, this.style.axis.label_color);
      for (var direction in rates){
        chartCul.Draw.Text(this.ctx, function(ctx){
          rates[direction].forEach(function(item){
            ctx.fillText(item[0], item[1], item[2]);
          });
        }, self.data_style.OHLC[direction]);
      }
    },
    drawAdditionalTips () {
      var self = this;
      // draw base line
      if (this.data_source.time_ranges !== undefined &&
          this.data_source.base_value !== undefined){
        let y = ~~chartCul.Coord.linearActual2Display(this.data_source.base_value, self.coord.y);
        chartCul.Draw.Stroke(this.ctx, (ctx) => {
          ctx.lineWidth = 2;
          ctx.setLineDash([5, 5]);
          ctx.moveTo(self.style.padding.left, y);
          ctx.lineTo(self.style.padding.right_pos, y);
        }, self.data_style.base_value);
      }
      // draw current price
      if (this.data_source.data.length > 0){
        if (this.data_source.fields[0].type === 'candlestick' || this.data_source.fields[0].type === 'linear') {
          var x = this.style.axis.y_axis_pos === 1 ? self.style.padding.right_pos : 0;
          let width = this.style.axis.y_axis_pos === 1 ? self.style.padding.right : self.style.padding.left;
          var last = this.data_source.data[this.data_source.data.length - 1];
          var value = last[this.data_source.fields[0].c === undefined ? this.data_source.fields[0].val_index : this.data_source.fields[0].c];
          let y = ~~chartCul.Coord.linearActual2Display(value, self.coord.y);
          chartCul.Draw.Stroke(this.ctx, (ctx) => {
            ctx.lineWidth = self.style.tip.curr_price.line_width;
            ctx.moveTo(self.style.padding.left, y + 0.5);
            ctx.lineTo(self.style.padding.right_pos, y + 0.5);
          }, self.style.tip.curr_price.line_color);
          chartCul.Draw.Fill(this.ctx, (ctx) => {
            ctx.rect(x, y - self.style.tip.curr_price.label_height / 2, width, self.style.tip.curr_price.label_height);
          }, self.style.tip.curr_price.label_bg);
          chartCul.Draw.Text(this.ctx, (ctx) => {
            ctx.fillText(value.toFixed(self.price_precision), x + self.style.axis.pointer_length + self.style.axis.label_pos.y_axis.x, y + 5);
          }, self.style.tip.curr_price.label_color);
        }
      }

      // draw highest and lowest price
      if (this.data_source.fields[0].type === 'candlestick' && !this.style.xgb_style){
        var max = this.data_source.filtered_data[0];
        var min = this.data_source.filtered_data[0];
        var high_index = this.data_source.fields[0].h;
        var low_index = this.data_source.fields[0].l;
        if (this.data_source.fields[0].as === 'mountain'){
          high_index = this.data_source.fields[0].c;
          low_index = this.data_source.fields[0].c;
        }

        this.data_source.filtered_data.forEach(function(item){
          if (item[high_index] > max[high_index])
            max = item
          if (item[low_index] < min[low_index])
            min = item
        });
        var max_val = max[high_index].toFixed(self.price_precision);
        var max_y = ~~chartCul.Coord.linearActual2Display(max[high_index], self.coord.y) + 0.5;
        var min_val = min[low_index].toFixed(self.price_precision);
        var min_y = ~~chartCul.Coord.linearActual2Display(min[low_index], self.coord.y) + 0.5;

        chartCul.Draw.Stroke(this.ctx, (ctx) => {
          ctx.setLineDash([5, 5]);
          ctx.moveTo(self.style.padding.left, max_y);
          ctx.lineTo(self.style.padding.right_pos, max_y);
        }, self.style.tip.high_color);

        chartCul.Draw.Stroke(this.ctx, (ctx) => {
          ctx.setLineDash([5, 5]);
          ctx.moveTo(self.style.padding.left, min_y);
          ctx.lineTo(self.style.padding.right_pos, min_y);
        }, self.style.tip.low_color);

        chartCul.Draw.Text(this.ctx, (ctx) => {
          // let width = ctx.measureText(max_val).width;
          ctx.fillText(max_val, self.style.padding.right_pos + self.style.axis.pointer_length + self.style.axis.label_pos.y_axis.x, max_y + 5);
        }, self.style.tip.high_color);
        chartCul.Draw.Text(this.ctx, (ctx) => {
          // let width = ctx.measureText(min_val).width;
          ctx.fillText(min_val, self.style.padding.right_pos + self.style.axis.pointer_length + self.style.axis.label_pos.y_axis.x, min_y + 5);
        }, self.style.tip.low_color);
      }
    },
    dotPos(item) {
      var fields = this.data_source.fields[0];
      return ~~chartCul.Coord.linearActual2Display(item[fields.h], this.coord.y) - 40
    },
    dotColor(item) {
      switch (item.impact) {
        case -2:
          return 'superbad'
        case -1:
          return 'bad'
        case 0:
          return 'normal'
        case 1:
          return 'good'
        case 2:
          return 'supergood'
        default:
          break;
      }
    },
    dotSelected(t) {
      this.$emit('select-time', t.time)
    },
    clearDotSelected() {
      this.$emit('clear-event-select')
    }
  }
}
</script>
<style lang="less" scoped>
.XGBchart-container{
  width: 800px;
  height: 400px;
  position: relative;
  .fenshi-stock-label{
    position: absolute;
    display: inline-block;
    text-align: center;
  }
  .chart-inner-item{
    position: absolute;
    display: block;
    cursor: pointer;
    overflow: visible;
    background: #fff;
    z-index: 10;
    &.good{
      border: 2px solid #E6394D;
      &:hover{
        &:before{
          content:'';
          position: absolute;
          left: -6px;
          right: -6px;
          top: -6px;
          bottom:-6px;
          border-radius:40px;
          border: 5px solid rgba(230, 57, 77, 0.5)
        }
      }
    }
    &.normal{
      border: 2px solid #979797;
      &:hover{
        &:before{
          content:'';
          position: absolute;
          left: -6px;
          right: -6px;
          top: -6px;
          bottom:-6px;
          border-radius:40px;
          border: 5px solid rgba(151, 151, 151, 0.5)
        }
      }
    }
    &.bad{
      border: 2px solid #18A66B;
      &:hover{
        &:before{
          content:'';
          position: absolute;
          left: -6px;
          right: -6px;
          top: -6px;
          bottom:-6px;
          border-radius:40px;
          border: 5px solid rgba(24, 166, 107, 0.5)
        }
      }
    }
    &.supergood{
      border: 2px solid #E6394D;
      &:hover{
        &:before{
          content:'';
          position: absolute;
          left: -6px;
          right: -6px;
          top: -6px;
          bottom:-6px;
          border-radius:40px;
          border: 5px solid rgba(230, 57, 77, 0.5)
        }
      }
    }
    &.superbad{
      border: 2px solid #18A66B;
      &:hover{
        &:before{
          content:'';
          position: absolute;
          left: -6px;
          right: -6px;
          top: -6px;
          bottom:-6px;
          border-radius:40px;
          border: 5px solid rgba(24, 166, 107, 0.5)
        }
      }
    }
  }
}
.chart{
  width: 800px;
  height: 400px;
  margin-left:0px;
  user-select: none;
  position: relative;

}
</style>
<style lang="less">
.XGBchart-container{
  .fenshi-stock-label{
    position: absolute;
    display: inline-block;
    text-align: center;
    cursor:pointer;
    text-align:center;
    color:#fff;
    font-size:12px;
  }
  .drag-choice-div{
    position: absolute;
    display: flex;
    text-align: center;
    cursor:pointer;
    font-size:12px;
    background: #FFFFFF;
    border: 1px solid #EFEFEF;
    width:160px;
    height: 32px;
    font-size:12px;
    line-height:32px;
    box-shadow: 0 0 4px 0 rgba(53,58,71,0.10);
    .drag-analyse-btn{
      width:50%;
      text-align:center;
      font-size:12px;
      line-height:32px;
      color:#666;
      text-align:center;
      &:hover{
        background: #FF5A51;
        color:#fff;
      }
    }
    .drag-zoom-btn{
      width:50%;
      text-align:center;
      font-size:12px;
      line-height:32px;
      color:#666;
      text-align:center;
      &:hover{
        background: #FF5A51;
        color:#fff;
      }
    }
  }
}
</style>



