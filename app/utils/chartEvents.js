/* eslint-disable */

import Util from './chartCul'
import format from 'date-fns/format'

var basic = function(e){
  var rect = this.ia_canvas_el.getBoundingClientRect();
  if (e.touches){
    this.state.events.mouse_x_px = e.touches[0].clientX - rect.left;
    this.state.events.mouse_y_px = e.touches[0].clientY - rect.top;
  } else {
    this.state.events.mouse_x_px = e.clientX - rect.left;
    this.state.events.mouse_y_px = e.clientY - rect.top;
  }
  this.ia_ctx.clearRect(0, 0, this.origin_width, this.origin_height);
};


var dragRect = function name(e, name, force) {
  let self = this
  if(self.state.events.drag_end) return
  var rect = this.ia_canvas_el.getBoundingClientRect();
  if (e.touches){
    this.state.events.mouse_x_px = e.touches[0].clientX - rect.left;
    this.state.events.mouse_y_px = e.touches[0].clientY - rect.top;
  } else {
    this.state.events.mouse_x_px = e.clientX - rect.left;
    this.state.events.mouse_y_px = e.clientY - rect.top;
  }

  this.ia_ctx.clearRect(0, 0, this.origin_width, this.origin_height);

  if(self.state.events.drag_x_px == null) return
  if (!force &&
    (self.state.events.mouse_y_px < self.style.padding.top ||
      self.state.events.mouse_y_px > self.style.padding.bottom_pos))
  return;

  if (self.state.events.mouse_x_px < self.style.padding.left ||
      self.state.events.mouse_x_px > self.style.padding.right_pos)
    return;
    Util.Draw.FillnStroke(self.ia_ctx, function(ctx){
      ctx.setLineDash([5,5]);
      ctx.strokeRect(self.state.events.drag_x_px, self.state.events.drag_y_px,self.state.events.mouse_x_px-self.state.events.drag_x_px,
        self.state.events.mouse_y_px-self.state.events.drag_y_px,
      );
    }, 'rgba(53,58,71,0.05)');
    var vertical_pos, horiz_pos;
    vertical_pos = self.state.events.mouse_x_px;
    if (!self.data_source.time_ranges){
      //这里的if是两种图标分别计算当前鼠标位置拟合的数据的x值（时间）
      // snap to each candlestick
      var snaps = self.data_source.filtered_data.map(function(item){return item.x});
      for (var l = snaps.length; l--;){
        if (Math.abs(self.state.events.mouse_x_px - snaps[l]) <= self.viewport.width / 2){
          vertical_pos = snaps[l];
          self.state.events.mouse_x_val = self.data_source.filtered_data[l][self.data_source.fields[0].t];
          self.state.events.selected_index = l + self.data_source.left_offset;
          self.state.events.selected_item = self.data_source.data[l + self.data_source.left_offset];
          break;
        }
      }
    } else {
      // snap to linear chart
      var index = ~~((vertical_pos - self.style.padding.left) /
                            ((self.style.padding.right_pos - self.style.padding.left) /
                              self.coords.length));

      var snaps = self.data_source.filtered_data_buckets.map(function(bucket, index){
        return bucket.map(function(item){
          return [item.x, item];
        });
      });

      for (var l = snaps[index].length; l--;){
        var half_width = (snaps[index][1][0] - snaps[index][0][0]) / 2;
        half_width = half_width < 1 ? 1 : half_width;

        if (Math.abs(self.state.events.mouse_x_px - snaps[index][l][0]) <= half_width){
          vertical_pos = snaps[index][l][0];
          self.state.events.mouse_x_val = snaps[index][l][1][self.data_source.fields[0].t];
          self.state.events.selected_item = snaps[index][l][1];
          break;
        }
      }
    }
    // 在方形选框上方绘制时间
    Util.Draw.Text(self.ia_ctx, function(ctx){
      ctx.fillText(format(self.state.events.dragstart_x_val,'YYYY-MM-DD')+'至'+format(self.state.events.mouse_x_val,'YYYY-MM-DD'),self.state.events.drag_x_px, self.state.events.drag_y_px- 15 );
    }, self.style.crosshair.label_color);
    // console.log(self.state.events.mouse_x_val,self.state.events.dragstart_x_val)
}

// crosshair drawing method
// force means being called by other charts
var crosshair = function(e, name, force){
  var self = this;
  // rerender all linked charts
  // if (this.linked_charts.length() && !force){
  //   this.linked_charts.forEach(function(chart){
  //     chart.state.events = self.state.events;
  //     chart.events.mousemove.crosshair.call(chart, null, 'crosshair', true);
  //   });
  // }
  if (force)
    this.ia_ctx.clearRect(0, 0, this.origin_width, this.origin_height);

  if (!force &&
      (self.state.events.mouse_y_px < self.style.padding.top ||
        self.state.events.mouse_y_px > self.style.padding.bottom_pos))
    return;

  if (self.state.events.mouse_x_px < self.style.padding.left ||
       self.state.events.mouse_x_px > self.style.padding.right_pos)
    return;

  var vertical_pos, horiz_pos;
  Util.Draw.Stroke(self.ia_ctx, function(ctx){
    vertical_pos = self.state.events.mouse_x_px;
    ctx.setLineDash([5,5]);
    if (!self.data_source.time_ranges){
      // snap to each candlestick
      var snaps = self.data_source.filtered_data.map(function(item){return item.x});
      for (var l = snaps.length; l--;){
        if (Math.abs(self.state.events.mouse_x_px - snaps[l]) <= self.viewport.width / 2){
          vertical_pos = snaps[l];
          self.state.events.mouse_x_val = self.data_source.filtered_data[l][self.data_source.fields[0].t];
          self.state.events.selected_index = l + self.data_source.left_offset;
          self.state.events.selected_item = self.data_source.data[l + self.data_source.left_offset];
          break;
        }
      }
    } else {
      // snap to linear chart
      var index = ~~((vertical_pos - self.style.padding.left) /
                            ((self.style.padding.right_pos - self.style.padding.left) /
                              self.coords.length));

      var snaps = self.data_source.filtered_data_buckets.map(function(bucket, index){
        return bucket.map(function(item){
          return [item.x, item];
        });
      });

      for (var l = snaps[index].length; l--;){
        var half_width = (snaps[index][1][0] - snaps[index][0][0]) / 2;
        half_width = half_width < 1 ? 1 : half_width;

        if (Math.abs(self.state.events.mouse_x_px - snaps[index][l][0]) <= half_width){
          vertical_pos = snaps[index][l][0];
          self.state.events.mouse_x_val = snaps[index][l][1][self.data_source.fields[0].t];
          self.state.events.selected_item = snaps[index][l][1];
          break;
        }
      }
    }

    // draw horizontal line
    if (!force){
      horiz_pos = self.style.crosshair.snap_to_close && self.state.events.selected_index > -1 ?
                    ~~Util.Coord.linearActual2Display(self.data_source.data[self.state.events.selected_index][self.data_source.fields[0].c], self.coord.y)
                  :
                    self.state.events.mouse_y_px;

      ctx.moveTo(self.style.padding.left, horiz_pos + 0.5);
      ctx.lineTo(self.style.padding.right_pos, horiz_pos + 0.5);
    }

    // draw vertical line
    ctx.moveTo(vertical_pos + 0.5, self.style.padding.top);
    ctx.lineTo(vertical_pos + 0.5, self.style.padding.bottom_pos);
  }, self.style.crosshair.color);
  if (self.state.events.mouse_x_val === null) return;

  // find the horizontal label width
  var label_horiz_width = 0;
  Util.Draw.Text(self.ia_ctx, function(ctx){
    label_horiz_width = ctx.measureText(Util.Coord.getDateStr(self.state.events.mouse_x_val)).width +
      self.style.crosshair.label_horiz_padding * 2;
  });

  var actual_val = !force ? Util.Coord.linearDisplay2Actual(horiz_pos, self.coord.y).toFixed(self.price_precision) : 0;

  // draw x label blocks
  Util.Draw.Fill(self.ia_ctx, function(ctx){
    var block_left = self.style.crosshair.pos_offset.horizontal.x + (vertical_pos - label_horiz_width / 2);
    var block_width = self.style.crosshair.pos_offset.horizontal.width || label_horiz_width;
    ctx.rect(block_left < 0 ? 0 : (block_left + block_width > self.origin_width ? self.origin_width - block_width : block_left),
              self.style.crosshair.pos_offset.horizontal.y + (self.style.axis.x_axis_pos > 0 ? self.style.padding.bottom_pos : self.style.padding.top - self.style.crosshair.label_height),
              block_width,
              self.style.crosshair.label_height);
  }, self.style.crosshair.label_bg);

  // draw x label text
  Util.Draw.Text(self.ia_ctx, function(ctx){
    var block_left = self.style.crosshair.pos_offset.horizontal.x + (vertical_pos - label_horiz_width / 2);
    var block_width = self.style.crosshair.pos_offset.horizontal.width || label_horiz_width;
    ctx.fillText(Util.Coord.getDateStr(self.state.events.mouse_x_val),
                  block_left < 0 ? self.style.crosshair.label_horiz_padding : (block_left + block_width > self.origin_width ? self.origin_width - block_width : block_left) + self.style.crosshair.label_horiz_padding,
                  self.style.crosshair.pos_offset.horizontal.y + (self.style.axis.x_axis_pos > 0 ?
                    self.style.padding.bottom_pos + self.style.font.size + 2
                  :
                    self.style.padding.top - self.style.crosshair.label_height + self.style.font.size + 2));
  }, self.style.crosshair.label_color);

  // draw y label blocks
  Util.Draw.Fill(self.ia_ctx, function(ctx){
    if (!force)
      ctx.rect(self.style.crosshair.pos_offset.vertical.x + (self.style.axis.y_axis_pos > 0 ? self.style.padding.right_pos : 0),
              self.style.crosshair.pos_offset.vertical.y + (horiz_pos - self.style.crosshair.label_height / 2),
              self.style.crosshair.pos_offset.vertical.width || (self.style.axis.y_axis_pos > 0 ? self.style.padding.right : ctx.measureText(actual_val).width + self.style.axis.label_pos.y_axis.x * 2),
              self.style.crosshair.label_height);

  }, self.style.crosshair.label_bg);

  // draw y label text
  Util.Draw.Text(self.ia_ctx, function(ctx){
    if (!force)
      var y_val = actual_val
      if(self.style.xgb_style){
        y_val = Number(y_val*100).toFixed(2) + '%'
      }
      ctx.fillText(y_val,
                  ((self.style.axis.y_axis_pos > 0 ? self.style.padding.right_pos : 0) +
                    self.style.axis.label_pos.y_axis.x + self.style.axis.pointer_length),
                  self.style.crosshair.pos_offset.vertical.y + (horiz_pos - self.style.crosshair.label_height / 2 + self.style.font.size + 2));
  }, self.style.crosshair.label_color);

};


var dragStart = function(e){
  let self = this
  var rect = this.ia_canvas_el.getBoundingClientRect();
  if (e.touches){
    this.state.events.drag_x_px = e.touches[0].clientX - rect.left;
    this.state.events.drag_y_px = e.touches[0].clientY - rect.top;
  } else {
    this.state.events.drag_x_px = e.clientX - rect.left;
    this.state.events.drag_y_px = e.clientY - rect.top;
  }
  this.state.events.drag_offset = this.viewport.offset;
  if (this.state.events.drag_x_px < 0)
    this.state.events.drag_x_px = 0;
  if (this.startTongji) {
    this.state.events.drag_end = false
    this.removeDragEndChoice()
    var dragstart_vertical_pos, dragstart_horiz_pos;
    dragstart_vertical_pos = self.state.events.drag_x_px;
    if (!self.data_source.time_ranges){
      // snap to each candlestick
      var snaps = self.data_source.filtered_data.map(function(item){return item.x});
      for (var l = snaps.length; l--;){
        if (Math.abs(self.state.events.drag_x_px - snaps[l]) <= self.viewport.width / 2){
          dragstart_vertical_pos = snaps[l];
          self.state.events.dragstart_x_val = self.data_source.filtered_data[l][self.data_source.fields[0].t];
          self.state.events.dragstart_index = l + self.data_source.left_offset;
          self.state.events.dragstart_item = self.data_source.data[l + self.data_source.left_offset];
          break;
        }
      }
    } else {
      // snap to linear chart
      var index = ~~((vertical_pos - self.style.padding.left) /
                            ((self.style.padding.right_pos - self.style.padding.left) /
                              self.coords.length));

      var snaps = self.data_source.filtered_data_buckets.map(function(bucket, index){
        return bucket.map(function(item){
          return [item.x, item];
        });
      });

      for (var l = snaps[index].length; l--;){
        var half_width = (snaps[index][1][0] - snaps[index][0][0]) / 2;
        half_width = half_width < 1 ? 1 : half_width;

        if (Math.abs(self.state.events.drag_x_px - snaps[index][l][0]) <= half_width){
          dragstart_vertical_pos = snaps[index][l][0];
          self.state.events.dragstart_x_val = snaps[index][l][1][self.data_source.fields[0].t];
          self.state.events.dragstart_item = snaps[index][l][1];
          break;
        }
      }
    }
    console.log(self.state.events.dragstart_x_val)
  }
};

var dragMove = function(e){
  if (this.state.events.drag_offset === null) return;

  var offset = this.state.events.drag_x_px - this.state.events.mouse_x_px;
  var new_offset = this.state.events.drag_offset + offset;
  if ((offset > 0 && new_offset < this.style.padding.right_pos - this.style.padding.left - this.viewport.width * 5) ||
      (offset < 0 && new_offset > this.viewport.width * -(this.data_source.data.length - 5))){
    this.viewport.offset = new_offset;
    this.rerender();
  }
};

var dragEnd = function(e){
  this.state.events.drag_offset = null;
  this.state.events.drag_x_px = null;
  this.state.events.drag_y_px = null;
  this.state.events.pinch_distance = null;
  this.state.events.pinch_width = null;
  this.state.events.dragstart_x_val = null;
  this.state.events.dragstart_item = null;
  this.state.events.dragstart_index = null;
};

var dragRectEnd = function(e){
  this.state.events.drag_end = true
  this.showDragEndChoice()
  // this.state.events.drag_offset = null;
  // this.state.events.drag_x_px = null;
  // this.state.events.drag_y_px = null;
  // this.state.events.pinch_distance = null;
  // this.state.events.pinch_width = null;
  // this.state.events.dragstart_x_val = null;
  // this.state.events.dragstart_item = null;
  // this.state.events.dragstart_index = null;
};

var zoom = function(e){
  e.preventDefault();

  if (e.touches && e.touches.length > 1){
    this.state.events.drag_offset = null;

    var mid_index = ~~(this.data_source.filtered_data.length / 2) + this.data_source.left_offset;
    var offset_index = this.data_source.data.length - mid_index;

    var distance = Util.Math.distance(
        [e.touches[0].clientX, e.touches[0].clientY], [e.touches[1].clientX, e.touches[1].clientY]);

    if (!this.state.events.pinch_distance){
      this.state.events.pinch_distance = distance;
      this.state.events.pinch_width = this.viewport.width;
    } else {
      var scale = (distance - this.state.events.pinch_distance) / 15;
      var width_offset = this.state.events.pinch_width + (scale - scale % 2);
      var do_zooming = false;
      if (scale > 0){
        if (this.viewport.width < 64)
          do_zooming = true;
      } else {
        if (this.viewport.width > 4)
          do_zooming = true;
      }

      if (do_zooming){
        this.viewport.offset -= offset_index * (width_offset - this.viewport.width);
        this.viewport.width = width_offset;
        this.rerender();
      }
    }

  } else if (e.wheelDelta && this.state.events.selected_index > -1) {

    var offset_index = this.data_source.data.length - this.state.events.selected_index;
    if (e.wheelDelta > 0){
      if (this.viewport.width < 64){
        this.viewport.width += this.style.wheel_zoom_step;
        this.viewport.offset -= offset_index * this.style.wheel_zoom_step;
        this.rerender();
      }
    } else {
      if (this.viewport.width > 4){
        this.viewport.width -= this.style.wheel_zoom_step;
        this.viewport.offset += offset_index * this.style.wheel_zoom_step;
        this.rerender();
      }
    }

  }
};

var selected_point = function(){
  var self = this;
  if (this.state.events.selected_item){
    var radius = [10, 4, 3];
    self.style.crosshair.selected_point_color.forEach(function(color, index){
      // Util.Draw.Fill(self.ia_ctx, function(ctx){
      //   ctx.arc(self.state.events.selected_item.x + 0.5,
      //           Util.Coord.linearActual2Display(self.state.events.selected_item[self.data_source.fields[0].val_index], self.coord.y) - 1.5,
      //           radius[index], 0, 2 * Math.PI);
      // }, color);
      // console.log(self.state.events.selected_item)
      self.data_source.fields.map(i => {
         Util.Draw.Fill(self.ia_ctx, function(ctx){
          ctx.arc(self.state.events.selected_item.x + 0.5,
                  Util.Coord.linearActual2Display(self.state.events.selected_item[i.val_index], self.coord.y) - 1.5,
                  radius[index], 0, 2 * Math.PI);
        }, color);
      })
    });
  }
};

var selected_cs_point = function(){
  // if (this.data_source.fields[0].as === 'mountain') {
  //   selected_point.call(this);
  // }
  // console.log(this.data_source.fields)
  if (this.data_source.fields.some(d =>{
    return d.as === 'mountain'
  })) {
    selected_point.call(this);
  }
};

var cleanDragRect = function(e, name, force){
  console.log(e.toElement.className)
  if(e.toElement.className == 'drag-analyse-btn' || e.toElement.className == 'drag-zoom-btn' || e.toElement.className == 'drag-choice-div') {return}
  this.removeDragEndChoice()
  this.ia_ctx.clearRect(0, 0, this.origin_width, this.origin_height);

  // rerender all linked charts
  // if (this.linked_charts.length() && !force){
  //   this.linked_charts.forEach(function(chart){
  //     chart.events.mouseout.clean.call(chart, null, 'clean', true);
  //   });
  // }
};

var clean = function(e, name, force){
    this.ia_ctx.clearRect(0, 0, this.origin_width, this.origin_height);

  // rerender all linked charts
  // if (this.linked_charts.length() && !force){
  //   this.linked_charts.forEach(function(chart){
  //     chart.events.mouseout.clean.call(chart, null, 'clean', true);
  //   });
  // }
};

export function genDefaultEvents (){
  this.state.events = {
    mouse_x_px: null,
    mouse_y_px: null,
    mouse_x_val: null,
    mouse_y_val: null,
    selected_index: -1,
    selected_item: null,
    drag_x_px: null,
    drag_y_px: null,
    drag_offset: null,
    pinch_width: null,
    pinch_distance: null
  };

  // for candlestick chart
  var events4CsChart = {
    mousedown: {dragStart: dragStart},
    mousemove: {basic: basic, crosshair: crosshair, dragMove: dragMove, selected_cs_point: selected_cs_point},
    mouseout: {clean: clean},
    mouseup: {dragEnd: dragEnd},
    mousewheel: {basic: basic, zoom: zoom},
    touchstart: {dragStart: dragStart},
    touchmove: {basic: basic, dragMove: dragMove, zoom: zoom},
    touchend: {dragEnd: dragEnd}
  };

  // for linear chart
  var events4LinearChart = {
    mousemove: {basic: basic, crosshair: crosshair, selected_point: selected_point},
    mouseout: {clean: clean}
  };

  var events4Tongji = {
    mousedown: {dragStart: dragStart},
    mousemove: {dragRect: dragRect, },
    mouseout: {cleanDragRect: cleanDragRect},
    mouseup: {dragRectEnd: dragRectEnd},
    touchstart: {dragStart: dragStart},
    touchmove: { dragRect: dragRect},
    touchend: {dragRectEnd: dragRectEnd}
  };
  if(!this.startTongji){
    return this.data_source.time_ranges ? events4LinearChart : events4CsChart;
  } else {
    return events4Tongji
  }
};


// events is all stored in the `this.events` object,
// so this binding function should only be run once.
export function bindEvents (){
  var self = this;
  var event_names = [];
  for (var event_name in this.events){event_names.push(event_name);}
  event_names.forEach(function(event_name){
    self.ia_canvas_el.addEventListener(event_name, function(event){
      if (event_name === 'mousemove' ||
          event_name === 'touchmove'){
        if (+new Date - self.state.ia_ctx_clock <= 30)
          return;
        self.state.ia_ctx_clock = +new Date;
      }

      for (var func_name in self.events[event_name]){
        if (self.state.ready)
          self.events[event_name][func_name].call(self, event, func_name);
      }
    });
  });
};

export function removeEvents (div_el){
  let oldElement = this.ia_canvas_el
  let newElement = oldElement.cloneNode(true);
  newElement.style.position = 'absolute';
  newElement.style.top = 0;
  newElement.style.left = 0;
  div_el.removeChild(oldElement)
  div_el.appendChild(newElement)
  this.ia_canvas_el = newElement
};


export function addEvent (event, name, func){
  if (!this.events[event])
    this.events[event] = {};
  this.events[event][name] = func;
};

export function removeEvent (event, name){
  delete this.events[event][name];
};

// exports default {
//   genDefaultEvents: genDefaultEvents,
//   bindEvents: bindEvents,
//   addEvent: addEvent,
//   removeEvent: removeEvent
// };
