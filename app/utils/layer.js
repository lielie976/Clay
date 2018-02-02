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
