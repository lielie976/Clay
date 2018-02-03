/* eslint-disable */

import Util from './chartCul'
export const CsIndicatorTypeFuncs = {
  line: function(params){
    var self = this;
    Util.Draw.Stroke(self.ctx, function(ctx){
      ctx.lineWidth = params.line_width || 1;

      var started = false;
      self.data_source.filtered_data.forEach(function(item, index){
        var val = item[params.val_index];
        if (val === null)
          return;

        if (!started) {
          ctx.moveTo(item.x, Util.Coord.linearActual2Display(val, self.coord.y));
          started = true;
        }

        ctx.lineTo(item.x, Util.Coord.linearActual2Display(val, self.coord.y));
      });

    }, params.color);
  },

  column: function(params){
    var self = this;
    var columns = {up: [], down: [], eq: []};

    self.data_source.filtered_data.forEach(function(item, index){
      var val = item[params.val_index];
      var base_val = params.base_val !== undefined ?
                        params.base_val
                      :
                        (params.base_index !== undefined ?
                          item[params.base_index]
                        :
                          null);

      if (base_val !== null)
        columns[val >= base_val ? 'up' : 'down'].push(item);

      if (params.color.detect)
        columns[params.color.detect(item, index, self.data_source.filtered_data)].push(item);
    });

    for (var direction in columns){
      Util.Draw.Stroke(self.ctx, function(ctx){
        ctx.lineWidth = self.viewport.width - 3;

        columns[direction].forEach(function(item){
          if (params.mode === 'bidirection'){
            ctx.moveTo(~~item.x + 0.5, Util.Coord.linearActual2Display(params.base_val, self.coord.y));
            ctx.lineTo(~~item.x + 0.5, Util.Coord.linearActual2Display(item[params.val_index], self.coord.y));
          } else {
            ctx.moveTo(~~item.x + 0.5, self.style.padding.bottom_pos);
            ctx.lineTo(~~item.x + 0.5, Util.Coord.linearActual2Display(item[params.val_index], self.coord.y));
          }
        });

      }, params.color[direction]);
    }
  }

};

export const LinearIndicatorTypeFuncs = {
  line: function(params){
    var self = this;
    Util.Draw.Stroke(self.ctx, function(ctx){
      ctx.lineWidth = params.line_width || 1;

      self.data_source.filtered_data_buckets.forEach(function(bucket, index){

          bucket.forEach(function(item, b_index){
            console.log(item)


              // // draw x label text
              // Util.Draw.Text(self.ia_ctx, function(ctx){
              //   var block_left = self.style.crosshair.pos_offset.horizontal.x + (vertical_pos - label_horiz_width / 2);
              //   var block_width = self.style.crosshair.pos_offset.horizontal.width || label_horiz_width;

              //   ctx.fillText(Util.Coord.getDateStr(self.state.events.mouse_x_val),
              //                 block_left < 0 ? self.style.crosshair.label_horiz_padding : (block_left + block_width > self.origin_width ? self.origin_width - block_width : block_left) + self.style.crosshair.label_horiz_padding,
              //                 self.style.crosshair.pos_offset.horizontal.y + (self.style.axis.x_axis_pos > 0 ?
              //                   self.style.padding.bottom_pos + self.style.font.size + 2
              //                 :
              //                   self.style.padding.top - self.style.crosshair.label_height + self.style.font.size + 2));
              // }, self.style.crosshair.label_color);
            }
            if (!b_index)
              ctx.moveTo(Util.Coord.linearActual2Display(item[params.t], self.coords[index].x),
                         Util.Coord.linearActual2Display(item[params.val_index], self.coord.y));

            ctx.lineTo(Util.Coord.linearActual2Display(item[params.t], self.coords[index].x),
                       Util.Coord.linearActual2Display(item[params.val_index], self.coord.y));
          });
      });
    }, params.color);
  },

  column: function(params){
    var self = this;
    var columns = {up: [], down: [], eq: []};

    self.data_source.filtered_data_buckets.forEach(function(bucket, index){
      bucket.forEach(function(item, b_index){
        var val = item[params.val_index];

        var base_val = params.base_val !== undefined ?
                          params.base_val
                        :
                          (params.base_index !== undefined ?
                            item[params.base_index]
                          :
                            null);

        if (base_val !== null)
          columns[val >= base_val ? 'up' : 'down'].push(item);

        if (params.color.detect)
          columns[params.color.detect(item, b_index, bucket, index, self.data_source.filtered_data_buckets)].push(item);
      });
    });

    for (var direction in columns){
      Util.Draw.Stroke(self.ctx, function(ctx){
        ctx.lineWidth = params.line_width || 1;

        columns[direction].forEach(function(item){
          if (params.mode === 'bidirection'){
            ctx.moveTo(~~item.x + 0.5, Util.Coord.linearActual2Display(params.base_val, self.coord.y));
            ctx.lineTo(~~item.x + 0.5, Util.Coord.linearActual2Display(item[params.val_index], self.coord.y));
          } else {
            ctx.moveTo(~~item.x + 0.5, self.style.padding.bottom_pos);
            ctx.lineTo(~~item.x + 0.5, Util.Coord.linearActual2Display(item[params.val_index], self.coord.y));
          }
        });

      }, params.color[direction]);
    }
  }
};
