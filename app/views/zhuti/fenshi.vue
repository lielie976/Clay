<template>
  <div class="chart" id="XGBchart">
  </div>
</template>
<script>
/* eslint-disable no-debugger, camelcase, space-before-function-paren, space-before-blocks, curly, eqeqeq */
import chartUtil from '~/utils/chartUtils'
import chartCul from '~/utils/chartCul'
import {LinearIndicatorTypeFuncs, CsIndicatorTypeFuncs} from '~/utils/layer.js'
import { genDefaultEvents, bindEvents } from '~/utils/chartEvents.js'
// import { fetchThemeMessage } from '~/api/theme';

export default {
  props: ['fenshiData', 'chartMode'],
  watch: {
    fenshiData() {
      if (this.chartMode === 'fenshi') {
        this.$store.dispatch('stockTrend/getTrend', this.fenshiData.join(',')).then(res => {
          this.trend = this.$store.state.stockTrend.trend.map(i => {
            i[0] *= 1000
            return i
          })
          this.preClose = this.$store.state.stockTrend.preValue
          this.initFenshi()
        })
      }
    },
    chartMode (mode) {
      if (mode === 'fenshi') {
        this.$store.dispatch('stockTrend/getTrend', this.fenshiData.join(',')).then(res => {
          this.trend = this.$store.state.stockTrend.trend.map(i => {
            i[0] *= 1000
            return i
          })
          this.preClose = this.$store.state.stockTrend.preValue
          this.initFenshi()
        })
      } else if (mode === 'lishi') {
        this.removeCanvas(document.getElementById('XGBchart'))
        this.$store.dispatch('stockTrend/getKline', this.fenshiData[0]).then(res => {
          this.kline = this.$store.state.stockTrend.kline
          this.initKline()
        })
      }
    }
  },
  beforeDestroy () {
    this.clean()
    this.removeCanvas(document.getElementById('XGBchart'))
  },
  computed: {
  },
  mounted () {
  },
  data () {
    return {
      trend: null,
      kline: null,
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
      defaults: null,
      viewport: null,
      price_precision: null,
      style: null,
      data_style: null,
      data_source: null,
      coord: null,
      selectedDate: new Date(),
      trendRate: null
      // startDate: new Date().setHours(9, 30, 0, 0),
      // endDate: new Date().setHours(15, 30, 0, 0)
    }
  },
  methods: {
    ...chartUtil,
    initFenshi () {
      let init = this.preClose.map(i => i.pre_close_px)
      this.trendRate = this.trend.map(i => {
        return i.map((ii, iid) => {
          return iid == 0 ? ii : (ii / init[iid - 1]) - 1
        })
      })
      this.selectedDate = new Date(this.trendRate[0][0])
      let lineColorList = ['#000', '#FFAE00', '#C291F2', '#4CA5FF', '#3DCFEE']
      let fields = this.preClose.map((i, index) => {
        return {name: i.symbol, type: 'line', as: 'mountain', t: 0, val_index: index + 1, color: lineColorList[index], line_width: 1}
      })
      let pattern = {
        data_source: {
          data: this.trendRate,
          fields: fields,
          time_ranges: [[this.selectedDate.setHours(9, 30, 0, 0), this.selectedDate.setHours(11, 30, 0, 0)], [this.selectedDate.setHours(13, 1, 0, 0), this.selectedDate.setHours(15, 0, 0, 0)]]
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
      this.rerender()
      this.events = genDefaultEvents.call(this)
      bindEvents.call(this)
    },
    initKline () {
      let dt = this.kline['000300.SS'].map(i => {
        i[0] = new Date(String(i[0]).substr(0, 4), String(i[0]).substr(4, 2), String(i[0]).substr(6, 2)).getTime()
        return i
      })

      let pattern = {
        data_source: {
          data: dt,
          fields: [{name: 'K线', type: 'candlestick', t: 0, o: 1, c: 2, h: 3, l: 4}]
        },
        price_precision: 1,
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
          // xgb_style: true,
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
      this.rerender()
      this.events = genDefaultEvents.call(this)
      bindEvents.call(this)
    },
    clean() {
      this.ctx.clearRect(0, 0, this.origin_width, this.origin_height);
      this.ia_ctx.clearRect(0, 0, this.origin_width, this.origin_height);
      this.mid_ctx.clearRect(0, 0, this.origin_width, this.origin_height);
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
      ['viewport', 'price_precision', 'style', 'data_style', 'data_source'].forEach((key) => {
        this[key] = pattern[key] || this.defaults[key];
      })
    },
    genStyle () {
      this.ctx.font = this.style.font.size + 'px ' + this.style.font.family;
      this.ia_ctx.font = this.ctx.font;
      this.style.padding.right_pos = this.origin_width - this.style.padding.right;
      this.style.padding.bottom_pos = this.origin_height - this.style.padding.bottom;
    },
    rerender (force) {
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
      this.state.ready = 1;
    },
    genLinearCoord () {
      var self = this;
      var fields = this.data_source.fields[0];

      this.data_source.filtered_data_buckets = this.datafilterByTimeRanges(this.data_source.data,
        this.data_source.time_ranges, fields.t);
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
      console.log(filter_result)
      this.data_source.filtered_data = filter_result.result;
      this.data_source.left_offset = filter_result.left_offset;
      this.data_source.right_offset = filter_result.right_offset;
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
      });
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
              this.data_source.data[l].x < this.style.padding.right_pos) {
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

        var w = self.viewport.width - 2;
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
    drawIndicators () {
      var self = this;
      if (this.data_source.time_ranges){
        this.data_source.fields.forEach((item) => {
          LinearIndicatorTypeFuncs[item.type] && LinearIndicatorTypeFuncs[item.type].call(self, item);
        });
      } else {
        this.data_source.fields.forEach((item) => {
          debugger
          CsIndicatorTypeFuncs[item.type] && CsIndicatorTypeFuncs[item.type].call(self, item);
        });
      }
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
      chartCul.Draw.Text(this.ctx, (ctx) => {
        // 这快是y轴右边的刻度
        self.coord.horiz_lines.forEach((y, index) => {
          var val = y.actual.toFixed(self.price_precision);
          if (this.style.xgb_style) {
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
      if (this.data_source.fields[0].type === 'candlestick'){
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
    }
  }
}
</script>
<style lang="less" scoped>
.chart{
  width: 800px;
  height: 400px;
  margin-left:0px;
  user-select: none;
}
</style>

