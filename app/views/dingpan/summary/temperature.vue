<template>
  <div class="ban-chart-temperature">
    <div class="ban-chart-temperature-title">
      <span class="ban-chart-temperature-title-text">市场真实热度</span>

      <span :class="temperatureColor(temprature)" class="ban-chart-temperature-title-value">{{temprature}}%</span>
    </div>
    <div class="ban-chart-temperature-chart">
      <canvas ref="tempratureChart" class="ban-chart-temperature-canvas" width="140" height="66">抱歉！浏览器不支持。</canvas>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import shareMethodMixin from '~/mixins/shareMethodMixin'
export default {
  props:{
    temprature:{
      type:Number
    }
  },
  data() {
    return {
      ctx:null
    }
  },
  watch:{
    temprature(v,oldv){
      this.draw()
    }
  },
  mounted(){
    this.draw()
  },
  methods:{
    draw(value) {
    let canvas = this.$refs['tempratureChart']
      if (!canvas.getContext) {
        window.alert('抱歉！浏览器不支持。')
        return;
      }
    if(!this.ctx){
      this.ctx = canvas.getContext('2d')
      this.ctx.clearRect(0, 0, canvas.width, canvas.height);
      this.ctx.translate(70, 66);
      this.ctx.save();
    }
    this.ctx.clearRect( -50, -50, canvas.width, canvas.height );
    this.drawbg(this.ctx)

  },
  drawbg(ctx) {
    ctx.beginPath();
    ctx.arc(0, 0, 50, 0, Math.PI, true);
    var myGradient = ctx.createLinearGradient(-60, 0, 60, 0);
    myGradient.addColorStop(0, "#18A66B");
    myGradient.addColorStop(0.4, "#18A66B");
    myGradient.addColorStop(0.6, "#E52222");
    myGradient.addColorStop(1, "#E52222");
    ctx.fillStyle = myGradient;
    ctx.fill();
    ctx.restore();
    //白色前景色
    ctx.save();

    ctx.beginPath();

    ctx.arc(0, 0, 45, 0, Math.PI, true);
    ctx.fillStyle = '#292C33';
    ctx.fill();
    ctx.restore();
    //四条刻度线
    this.drawScale(ctx, 70, 66, 45, 0.8 * Math.PI, '#18A66B', 2, 0.2, -26, -5, '20%')
    this.drawScale(ctx, 70, 66, 45, 0.6 * Math.PI, '#18A66B', 2, 0.2, -25, -10, '40%')
    this.drawScale(ctx, 70, 66, 45, 0.4 * Math.PI, '#E52222', 2, 0.2, 5, -10, '60%')
    this.drawScale(ctx, 70, 66, 45, 0.2 * Math.PI, '#E52222', 2, 0.2, 5, -5, '80%')
    this.setTick(this.temprature/100)

  },
  drawScale(ctx, x, y, radius, anchor, color, width, percent, xAjust, yAajust, text) {
    //绘制刻度
    let yValue = radius * Math.sin(anchor)
    let xValue = radius * Math.cos(anchor)
    ctx.beginPath()
    ctx.moveTo(xValue, 0 - yValue)
    ctx.lineTo((1 - percent) * xValue, 0 - (1 - percent) * yValue)
    ctx.lineWidth = width
    ctx.strokeStyle = color
    ctx.stroke()
    //绘制刻度标签
    ctx.fillStyle = '#999999';
    ctx.fillText(text, xValue + xAjust, yAajust - yValue)
    ctx.restore();
  },
  setTick(percent) {
      if (!this.ctx) {
        return
      }
      let ctx = this.ctx
      let yEnd = 50* Math.sin((1 - percent) * Math.PI)
      let xEnd =  50 * Math.cos((1 - percent) * Math.PI)
      let xSub = .1 * xEnd
      let ySub = .1 * yEnd
      let x1 = xSub + 3 * Math.cos((1 - percent - 0.5) * Math.PI)
      let y1 = ySub + 3 * Math.sin((1 - percent - 0.5) * Math.PI)
      let x2 = xSub - 3 * Math.cos((1 - percent - 0.5) * Math.PI)
      let y2 = ySub - 3 * Math.sin((1 - percent - 0.5) * Math.PI)

      ctx.moveTo(xEnd,0-yEnd)
      ctx.lineTo(x1,0-y1)
      ctx.lineTo(x2,0-y2)
      ctx.closePath()
      ctx.fillStyle = percent>.5?'#E52222':'#18A66B'
      ctx.fill()
      ctx.restore();
    }
  },
  mixins: [shareMethodMixin]
}
</script>
<style lang="less" scoped>
@import '../../../styles/variables.less';
.ban-chart-temperature {
  width: 17%;
  max-width: 160px;
  &-title {
    display: block;
    height: 30px;
    vertical-align: top;
    line-height: 0;
    &-text {
      display: inline-block;
      height: 24px;
      font-size: 12px;
      color: #FFFFFF;
      letter-spacing: 0;
      vertical-align: middle;
      line-height: 28px;
    }
    &-value {
      display: inline-block;
      height: 24px;
      vertical-align: middle;
      font-size: 24px;
      line-height: 24px;
    }
  }
  &-chart{

  }
}
</style>
