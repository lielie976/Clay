/* eslint-disable */
export default {
  initCanvas (div_el, pattern, no_render) {
    var canvas_main = document.createElement('canvas');
    var canvas_ia = document.createElement('canvas');
    var canvas_mid = document.createElement('canvas');

    canvas_main.width = canvas_ia.width = canvas_mid.width = div_el.clientWidth;
    canvas_main.height = canvas_ia.height = canvas_mid.height = div_el.clientHeight;

    canvas_main.style.position = canvas_ia.style.position = canvas_mid.style.position = 'absolute';
    canvas_main.style.top = canvas_ia.style.top = canvas_mid.style.top = 0;
    canvas_main.style.left = canvas_ia.style.left = canvas_mid.style.left = 0;

    if (!div_el.style.position || div_el.style.position === 'static')
      div_el.style.position = 'relative';

    div_el.innerHTML = '';
    div_el.appendChild(canvas_main);
    div_el.appendChild(canvas_mid);
    div_el.appendChild(canvas_ia);
    return [canvas_main, canvas_ia, canvas_mid]
    // pattern.data_source.data = JSON.parse(JSON.stringify(pattern.data_source.data));
    // CHART.Util.Safe.dataCheck(pattern.data_source);

    // var chart = new CHART(canvas_main, canvas_ia, canvas_mid, pattern);

    // if (!no_render)
    //   chart.rerender();

    // return chart;
  },
  DEFAULTS(){
    return {
      viewport: {offset: 0, width: 10},
      price_precision: 5,
      style: {
        font: {family: 'Microsoft YaHei', size: 14},
        padding: {top: 1, right: 70, bottom: 28, left: 1},
        wheel_zoom_step: 1,
        linear_last_point: false,
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
          label_bg: 'rgba(0,0,0,0)',
          label_color: 'rgba(0,0,0,0)',
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
      },
      data_style: {
        base_value: '#2DB0F9',
        candlestick: {
          block: {up: '#f8f8f8', down: '#1EB955'},
          border: {up: '#FF4040', down: '#1EB955'},
          wick: {up: '#FF4040', down: '#1EB955'}
        },
        OHLC: {
          up: '#FF4040', down: '#1EB955'
        },
        mountain: {
          line_width: 1,
          line_color: '#2DB0F9',
          gradient_up: 'rgba(45,176,249,0.15)',
          gradient_down: 'rgba(19,119,240,0.02)'
        }
      }
    };
  },
  datafilterByTimeRanges (data, ranges, t_index){
    var buckets = ranges.map(() => {return []});
    var bucket_index = 0;
    for (var i = 0; i < data.length; i++){
      var item = data[i];
      var time = item[t_index];

      if (time >= ranges[bucket_index][0] &&
          time <= ranges[bucket_index][1]){
        buckets[bucket_index].push(item);
      } else {
        if (ranges[bucket_index + 1] && time >= ranges[bucket_index + 1][0]){
          bucket_index += 1;
          i--;
        }
      }
    }
    return buckets;
  }
}
