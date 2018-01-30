const dataCenter = {
  data: {
    container: null,
    ctx: null,
    val: 0
  },
  init: function (opts) {
    if (typeof window === 'undefined') return
    this.data.container = opts.container || null;
    this.data.val = opts.value || 0;
    this.draw();
  },
  draw (value) {
    let canvas = document.querySelector(this.data.container);
    if (!canvas) return
    if (!canvas.getContext) {
      window.alert('抱歉！浏览器不支持。');
      return;
    }
    if (!this.data.ctx) {
      this.data.ctx = canvas.getContext('2d');
      this.data.ctx.translate(100, 100);
      this.data.ctx.save();
    }
    this.data.ctx.clearRect(-100, -100, canvas.width, canvas.height);
    this.drawbg(this.data.ctx);
  },
  drawbg (ctx) {
    ctx.beginPath();
    ctx.arc(0, 0, 80, 0, Math.PI, true);
    var myGradient = ctx.createLinearGradient(-100, 0, 100, 0);
    myGradient.addColorStop(0, '#18A66B');
    myGradient.addColorStop(0.4, '#18A66B');
    myGradient.addColorStop(0.6, '#E52222');
    myGradient.addColorStop(1, '#E52222');
    ctx.fillStyle = myGradient;
    ctx.fill();
    ctx.restore();
    //  白色前景色
    ctx.save();

    ctx.beginPath();

    ctx.arc(0, 0, 73, 0, Math.PI, true);
    ctx.fillStyle = '#FFF';
    ctx.fill();
    ctx.restore();
    //  四条刻度线
    this.drawScale(
      ctx,
      100,
      100,
      80,
      0.8 * Math.PI,
      '#18A66B',
      2,
      0.2,
      -25,
      -5,
      '20%'
    );
    this.drawScale(
      ctx,
      100,
      100,
      80,
      0.6 * Math.PI,
      '#18A66B',
      2,
      0.2,
      -30,
      -5,
      '40%'
    );
    this.drawScale(
      ctx,
      100,
      100,
      80,
      0.4 * Math.PI,
      '#E52222',
      2,
      0.2,
      0,
      -5,
      '60%'
    );
    this.drawScale(
      ctx,
      100,
      100,
      80,
      0.2 * Math.PI,
      '#E52222',
      2,
      0.2,
      0,
      -5,
      '80%'
    );
    this.setTick(this.data.val / 100);
  },
  drawScale (
    ctx,
    x,
    y,
    radius,
    anchor,
    color,
    width,
    percent,
    xAjust,
    yAajust,
    text
  ) {
    //  绘制刻度
    let yValue = radius * Math.sin(anchor);
    let xValue = radius * Math.cos(anchor);
    ctx.beginPath();
    ctx.moveTo(xValue, 0 - yValue);
    ctx.lineTo((1 - percent) * xValue, 0 - (1 - percent) * yValue);
    ctx.lineWidth = width;
    ctx.strokeStyle = color;
    ctx.stroke();
    //  绘制刻度标签
    ctx.fillStyle = '#999999';
    ctx.fillText(text, xValue + xAjust, yAajust - yValue);
    ctx.restore();
  },
  setTick (percent) {
    if (!this.data.ctx) {
      return;
    }
    let ctx = this.data.ctx;
    let yEnd = 75 * Math.sin((1 - percent) * Math.PI);
    let xEnd = 75 * Math.cos((1 - percent) * Math.PI);
    let xSub = 0.1 * xEnd;
    let ySub = 0.1 * yEnd;
    let x1 = xSub + 3 * Math.cos((1 - percent - 0.5) * Math.PI);
    let y1 = ySub + 3 * Math.sin((1 - percent - 0.5) * Math.PI);
    let x2 = xSub - 3 * Math.cos((1 - percent - 0.5) * Math.PI);
    let y2 = ySub - 3 * Math.sin((1 - percent - 0.5) * Math.PI);

    ctx.moveTo(xEnd, 0 - yEnd);
    ctx.lineTo(x1, 0 - y1);
    ctx.lineTo(x2, 0 - y2);
    ctx.closePath();
    ctx.fillStyle = percent > 0.5 ? '#E52222' : '#18A66B';
    ctx.fill();
    ctx.restore();
  }
};

export default dataCenter;
