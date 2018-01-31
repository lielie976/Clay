<template>
  <div class="chart" id="XGBchart">
  </div>
</template>
<script>
/* eslint-disable no-debugger, camelcase */
import chartUtil from '~/utils/chartUtils'
export default {
  async asyncData ({ store }) {
    await store.dispatch('stockTrend/getTrend', '603799.SS')
  },
  computed: {
    trend () {
      return this.$store.state.stockTrend.trend.map(i => {
        i[0] *= 1000
        return i
      })
    }
  },
  mounted () {
    this.init()
  },
  data () {
    return {
      canvas: {
        mainCanvas: null,
        iaCanvas: null, // interactive canvas
        midCanvas: null
      },
      ctx: null,
      iaCtx: null,
      midCtx: null,
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
      data_source: null
    }
  },
  methods: {
    ...chartUtil,
    init () {
      let container = document.getElementById('XGBchart')
      let pattern = {
        data_source: {
          data: this.trend,
          fields: [
            {name: '均线', type: 'line', t: 0, val_index: 2, color: 'teal', line_width: 1}
          ]
        }
      };
      [this.canvas.mainCanvas, this.canvas.iaCanvas, this.canvas.midCanvas] = this.initCanvas(container, pattern)
      this.genCtx()
      this.Prepare(pattern)
      this.genStyle()
      this.rendData()
    },
    genCtx () {
      var dpr = window.devicePixelRatio;
      this.origin_width = this.canvas.mainCanvas.width;
      this.origin_height = this.canvas.mainCanvas.height;
      this.ctx = this.canvas.mainCanvas.getContext('2d');
      this.canvas.mainCanvas.style.width = this.canvas.mainCanvas.width + 'px';
      this.canvas.mainCanvas.style.height = this.canvas.mainCanvas.height + 'px';
      this.canvas.mainCanvas.width *= dpr;
      this.canvas.mainCanvas.height *= dpr;
      this.ctx.scale(dpr, dpr);

      this.iaCtx = this.canvas.iaCanvas.getContext('2d');
      this.canvas.iaCanvas.style.width = this.canvas.iaCanvas.width + 'px';
      this.canvas.iaCanvas.style.height = this.canvas.iaCanvas.height + 'px';
      this.canvas.iaCanvas.width *= dpr;
      this.canvas.iaCanvas.height *= dpr;
      this.iaCtx.scale(dpr, dpr);

      this.midCtx = this.canvas.midCanvas.getContext('2d');
      this.canvas.midCanvas.style.width = this.canvas.midCanvas.width + 'px';
      this.canvas.midCanvas.style.height = this.canvas.midCanvas.height + 'px';
      this.canvas.midCanvas.width *= dpr;
      this.canvas.midCanvas.height *= dpr;
      this.midCtx.scale(dpr, dpr);
    },
    Prepare (pattern) {
      this.defaults = this.DEFAULTS();
      ['viewport', 'price_precision', 'style', 'data_style', 'data_source'].forEach((key) => {
        this[key] = pattern[key] || this.defaults[key];
      })
    },
    genStyle () {
      this.ctx.font = this.style.font.size + 'px ' + this.style.font.family;
      this.iaCtx.font = this.ctx.font;
      this.style.padding.right_pos = this.origin_width - this.style.padding.right;
      this.style.padding.bottom_pos = this.origin_height - this.style.padding.bottom;
    },
    rendData () {
      this.genLinearCoord();
    },
    genLinearCoord () {
      var self = this;
      var fields = this.data_source.fields[0];

      this.data_source.filtered_data_buckets = this.datafilterByTimeRanges(this.data_source.data,
        this.data_source.time_ranges, fields.t);

      var y_max = Number.MIN_VALUE;
      var y_min = Number.MAX_VALUE;
      var y_actuals = this.data_source.filtered_data_buckets.map(function(bucket){
        var result = Util.Coord.calcYRange.line(bucket, fields);
        if (result[0] === result[1]) {
          result[0] -= result[0] * 0.001;
          result[1] += result[1] * 0.001;
        }

        if (result[0] < y_min) y_min = result[0];
        if (result[1] > y_max) y_max = result[1];
        return result;
      });

      // calc the vertical padding of grid
      var vertical_padding = Util.Coord.linearPixels2Actual(self.style.grid.span.y * 2, {
        display: [this.style.padding.bottom_pos, this.style.padding.top],
        actual: [y_min, y_max]
      });
      y_min -= vertical_padding;
      y_max += vertical_padding;

      var y_actual = [y_min, y_max];

      // enlarge the actual range of vertical coord when base value line is specified
      if (this.data_source.base_value !== undefined){
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
      this.coords = this.data_source.time_ranges.map(function(range, index){
        var left = self.style.padding.left + self.coord.coord_width * index;
        var right = left + self.coord.coord_width;
        return {
          x: {display: [left, right], actual: [range[0], range[1]]},
          y: {display: [self.style.padding.bottom_pos, self.style.padding.top], actual: y_actuals[index]}
        };
      });

      // calc display position x of each visiable point
      this.data_source.filtered_data_buckets.forEach(function(bucket, index){
        bucket.forEach(function(item){
          item.x = ~~Util.Coord.linearActual2Display(item[fields.t], self.coords[index].x);
        });
      });
    }
  }
}
</script>
<style lang="less" scoped>
.chart{
  width: 1000px;
  height: 600px;
}
</style>

