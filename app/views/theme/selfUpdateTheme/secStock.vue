<template>
  <table :style="{marginTop:poolFixed?'86px':0}" v-if="!loading && stockList && stockList.length" class="stocklist-pool-table">
    <colgroup>
      <col style="width:40px;">
      <col style="width:100px;">
       <col style="width:240px;">
      <col style="width:120px;">
      <col style="width:120px;">
      <col style="width:120px;">
      <col style="width:120px;">
      <col style="width:120px;">
      <!-- <col style="width:120px;">
      <col style="width:120px;"> -->
      <col style="width:120px;">
      <col style="width:100px;">
    </colgroup>
    <thead :class="{'fixed':poolFixed}" class="stocklist-pool-thead">
      <tr>
        <th style="width:40px;" class="stocklist-pool-th stocklist-pool-th-index">序号</th>
        <th style="width:100px;" class="stocklist-pool-th stocklist-pool-th-name-threeline">股票名称</th>
        <th style="width:240px;" class="stocklist-pool-th stocklist-pool-th-name-threeline">个股介绍</th>
        <sort-th style="width:120px;" label="最新价" @sort="startSort" :sort-rule="sortRule" target-prop="cur_price" />
        <sort-th style="width:120px;" label="涨跌幅" @sort="startSort" :sort-rule="sortRule" target-prop="px_change_rate" />
        <sort-th style="width:120px;" label="换手率" @sort="startSort" :sort-rule="sortRule" target-prop="turnover_ratio" />
        <sort-th style="width:120px;" label="流通市值" @sort="startSort" :sort-rule="sortRule" target-prop="circulation_value" />
        <!-- <sort-th style="width:120px;" label="总股本" @sort="startSort" :sort-rule="sortRule" target-prop="total_value" /> -->
        <sort-th style="width:120px;" label="开板天数" @sort="startSort" :sort-rule="sortRule" target-prop="open_board_day" />
        <!-- <sort-th style="width:120px;" label="开板前连板数" @sort="startSort" :sort-rule="sortRule" target-prop="before_open_count" /> -->
        <sort-th style="width:120px;" :two-line="true" label="开板后<br/>累计涨幅" @sort="startSort" :sort-rule="sortRule" target-prop="accumulated_pcp" />
        <sort-th style="width:100px;" :two-line="false" label="上市日期" @sort="startSort" :sort-rule="sortRule" target-prop="time_on_market" />
      </tr>
    </thead>

    <tbody>
      <template v-for="(item,index) in stockList">
        <tr :ref="'tr_'+item.symbol" :key="item.symbol" class="stockitem-tbody-tr">
          <td class="td-center">{{index+1}}</td>
          <td @mouseover="symbolOver(item)" @mouseleave="symbolLeave(item)" :target="item.symbol" class="stockitem-name">
            <a :href="/stock/+item.symbol" target="_blank" class="stockitem-name-container">
              <div class="stockitem-name-name">
                <!-- <span class="stockitem-icon-weak">
                    <i class="iconfont icon-ruoguanliangupiao"></i>
                  </span> -->
                {{item.title}}
              </div>
              <div class="stockitem-name-symbol">
                {{symbolFilter(item.symbol)}}
              </div>
            </a>
            <div class="stockitem-icon-container">
              <span :class="{active:item.JinRiLongTou}" class="stockitem-icon-item stockitem-icon-item-jinri">
                <template v-if="item.JinRiLongTou">
                  <i v-if="item.JinRiLongTou == 1" class="iconfont">&#xe698;</i>
                  <i v-if="item.JinRiLongTou == 2" class="iconfont">&#xe699;</i>
                  <i v-if="item.JinRiLongTou == 3" class="iconfont">&#xe69a;</i>
                </template>
                <i v-else class="iconfont icon-jinrilongtou-xuanzhong"></i>
              </span>
              <span :class="{active:item.RenQiLongTou}" class="stockitem-icon-item stockitem-icon-item-renqi">
                <template v-if="item.RenQiLongTou">
                  <i v-if="item.RenQiLongTou == 1" class="iconfont">&#xe69b;</i>
                  <i v-if="item.RenQiLongTou == 2" class="iconfont">&#xe69c;</i>
                  <i v-if="item.RenQiLongTou == 3" class="iconfont">&#xe69d;</i>
                </template>
                <i v-else class="iconfont icon-renqilongtou-xuanzhong"></i>
              </span>
              <span :class="{active:item.HangYeLongTou}" class="stockitem-icon-item stockitem-icon-item-hangye">
                <template v-if="item.HangYeLongTou">
                  <i v-if="item.HangYeLongTou == 1" class="iconfont">&#xe69e;</i>
                  <i v-if="item.HangYeLongTou == 2" class="iconfont">&#xe69f;</i>
                  <i v-if="item.HangYeLongTou == 3" class="iconfont">&#xe6a0;</i>
                </template>
                <i v-else class="iconfont icon-hangyelongtou-xuanzhong"></i>
              </span>
            </div>
          </td>
          <!-- <td class="desc-td">
              <span class="desc-image-container" :class="{'blocked':block_span}" v-if="isLogin">
                <img @click="changeBlock" :src="imageUrl">
              </span>

              <span class="locked" v-else>
                <i class="iconfont">&#xe66b;</i>
                <p class="stock-reason-login">请登录后查看</p>
              </span>
            </td> -->
          <td  class="td-center left">{{item.description}}</td>
          <td :class="{'sort-target':isSortTarget('last_px',sortRule)}" class="td-center">
            <span :class="color(item.px_change_rate)">{{item.cur_price.toFixed(2)}}</span>
          </td>
          <td class="td-center" :class="{'sort-target':isSortTarget('px_change_rate',sortRule)}">
            <span :class="color(item.px_change_rate)">{{changeRate(item.px_change_rate)}}</span>
          </td>
          <td :class="{'sort-target':isSortTarget('turnover_ratio',sortRule)}" class="td-center">{{changeNegative(item.turnover_ratio)}}</td>
          <td :class="{'sort-target':isSortTarget('circulation_value',sortRule)}" class="td-center">
            <span>{{approxNumber(item.circulation_value)}}</span>
          </td>
          <!-- <td :class="{'sort-target':isSortTarget('total_value',sortRule)}" class="td-center">
            <span>{{approxNumber(item.total_value)}}</span>
          </td> -->
          <td :class="{'sort-target':isSortTarget('open_board_day',sortRule)}" class="td-center">
            <span>{{(item.open_board_day)}}</span>
          </td>
          <!-- <td :class="{'sort-target':isSortTarget('before_open_count',sortRule)}" class="td-center">{{item.before_open_count}}</td> -->
          <td :class="{'sort-target':isSortTarget('accumulated_pcp',sortRule)}" class="td-center">
            <span :class="color(item.accumulated_pcp)">{{changeRate(item.accumulated_pcp)}}</span>
          </td>
          <td :class="{'sort-target':isSortTarget('time_on_market',sortRule)}" class="td-center">{{timeFormatter(item.time_on_market,'YYYY/MM/DD')}}</td>
          <!-- <td class="td-center td-flow">
              <stock-flow v-if="item.stockFlow" :flow-info="item.stockFlow" />
            </td> -->
        </tr>
      </template>
    </tbody>

  </table>
</template>
<script>
/* eslint-disable */
import SortThead from '../sortThead.vue'
import shareMethodMixin from '~/mixins/shareMethodMixin'
export default {
  props: {
    poolFixed: {
      type: Boolean,
      default: false
    },
    stockList: {
      type: Array
    },
    loading: {
      type: Boolean,
      default: true
    },
    sortRule: {
      type: Object,
    }
  },
  data() {
    return {
    }
  },
  mixins: [shareMethodMixin],
  methods: {
    startSort(prop) {
      this.$emit('specialSort', prop)
    },
    getRateColor(val) {
      if (val > 0) {
        return '#D93641';
      } else if (val < 0) {
        return '#3aa643'

      } else {
        return '#919599'
      }
    },
    isSortTarget(prop, rule) {
      return rule.mode != 'default' && rule.targetProp == prop
    },
    symbolOver(item) {
      this.$emit('symbolOver', item.symbol, this.$refs['tr_' + item.symbol])
    },
    symbolLeave(item) {
      this.$emit('symbolLeave', item.symbol)
    }
  },
  components: {
    'sort-th': SortThead
  }
}
</script>
<style lang="less" scoped>
.stocklist-pool {
  position: relative;
  background: #fff;
  &-table {
    background-image: url('/water-mark.png');
    background-repeat: repeat;
    .stocklist-pool-thead {
      border-bottom: 1px solid #efefef;
      background: #fff;
      width: 1200px;
      z-index: 1;
      &.fixed {
        position: fixed;
        top: 50px;
        left: 50%;
        margin-left: -600px;
      }
    }
    .stocklist-pool-thead-chain {
      border-bottom: 1px solid #efefef;
      background: #fff;
      width: 1046px;
      z-index: 1;
      &.fixed {
        position: fixed;
        top: 40px;
        left: 50%;
        margin-left: -600px;
      }
    }
    .stocklist-pool-th {
      font-size: 12px;
      color: #666666;
      letter-spacing: 0;
      background: #fff;
      line-height: 36px;
      &-index {
        width: 50px;
        text-align: center;
      }
      &-name {
        width: 150px;
        text-align: left;
        &-threeline {
          width: 90px;
          text-align: center;
        }
      }
      &-reason {
        text-align: center;
        width: 240px;
      }
    }
  }
  &-icon {
    height: 50px;
    padding: 14px;
    color: #d8d8d8;
    background: #F6F7FB;
    .stocklist-chain-all-title-filter {
      padding-top: 0;
    }
    &.fixed {
      display: block;
      position: fixed;
      top: 0;
      width: 1200px;
      margin: 0 auto;
      background: #F6F7FB;
      z-index: 1;
    }
    &-item {
      font-size: 14px;
      line-height: 18px;
      display: inline-block;
      vertical-align: bottom;
      margin-right: 24px;
      cursor: pointer;
      color: #666;
      vertical-align: middle;
      &>i {
        vertical-align: bottom;
        font-size: 18px;
        line-height: 18px;
        margin-right: 5px;
        color: #d8d8d8;
      }
      &>input {
        opacity: 0;
        margin-left: 6px;
      }
      &.active {
        &>input {
          opacity: 1;
          margin-left: 6px;
        }
        &>i {
          vertical-align: bottom;
          color: #d8d8d8;
          &.icon-jinrilongtou-xuanzhong {
            color: #FFA387;
          }
          &.icon-renqilongtou-xuanzhong {
            color: #FFAA00;
          }
          &.icon-hangyelongtou-xuanzhong {
            color: #FF6D00;
          }
          &.icon-quanbuyixuanzhong {
            color: #e6394d;
          }
        }
      }

      &:hover {
        color: #E6394D;
        &>i {
          color: #E6394D;
        }
      }
    }
  }
  .no-stock {
    text-align: center;
    color: #999999;
    &-image {
      background: #fff;
      width: 1200px;
      height: 400px;
      position: relative;
      &-img {
        margin-top: 140px;
        position: relative;
        margin-left: 50%;
        left: -30px;
      }
      &-text {
        font-size: 14px;
        color: #999;
        text-align: center;
      }
    }
  }
}

.stockitem-tbody-tr {
  border-bottom: 1px solid #efefef;
  height: 88px;
  &>td {
    padding: 14px 0;
    font-size: 14px;
    line-height: 19px;
    vertical-align: middle;
    color: #666666;
    &.desc-td {
      position: relative;
      padding-left: 5px;
      padding-right: 1px;
      .locked {
        text-align: center;
        display: block;
        cursor: pointer;
        .iconfont {
          text-align: center;
        }
        .stock-reason-login {
          font-size: 12px;
          letter-spacing: 0;
          line-height: 12px;
        }
        &:hover {
          color: #E6394D;
        }
      }
      >.desc-image-container {
        padding: 0; // max-height: 60px;
        overflow: hidden;
        display: block;
        &.blocked {
          display: block;
        }
        >img {
          cursor: pointer;
        }
      }
      &:before {
        content: '';
        position: absolute;
        display: block;
        width: 1px;
        background: #e6e6e6;
        left: 0;
        top: 24px;
        bottom: 24px;
      }
      &:after {
        content: '';
        position: absolute;
        display: block;
        width: 1px;
        background: #e6e6e6;
        right: 0;
        top: 24px;
        bottom: 24px;
      }
    }
    &.td-flow {
      padding: 0;
    }
    &.sort-target {
      background: rgba(230, 57, 77, 0.06);
    }
    .line-clamp {
      max-height: 60px;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
      line-height: 20px;
      font-size: 12px;
      padding: 0;
      position: relative;
      top: 0;
      border: none;
    }
    &.td-center {
      text-align: center;
      &.left {
        font-size: 12px;
        text-align: left;
      }
    }
    &.stockitem-name {
      position: relative;
    }

    &.stockitem-name>.stockitem-name-container {
      display: block;
      .stockitem-name-name {
        font-size: 14px;
        color: #333333;
        letter-spacing: 0;
        line-height: 19px;
        text-align: center;
        position: relative;
        .stockitem-icon-weak {
          color: #d8d8d8;
          position: absolute;
          height: 14px;
          width: 14px;
          display: block;
          left: 0;
          top: 0;
        }
      }
      .stockitem-name-symbol {
        font-size: 14px;
        color: #333333;
        letter-spacing: -0.5px;
        text-align: center;
        line-height: 19px;
      }
    }
    &>.stockitem-icon-container {
      display: block;
      vertical-align: top;
      position: relative;
      text-align: center;
      .stockitem-icon-item {
        font-size: 14px;
        line-height: 18px;
        display: inline-block;
        vertical-align: text-top;
        cursor: pointer;
        &-jinri {
          &.active {
            .iconfont {
              color: #FFA387;
            }
          }
        }
        &-renqi {
          &.active {
            .iconfont {
              color: #FFAA00;
            }
          }
        }
        &-hangye {
          &.active {
            .iconfont {
              color: #FF6D00;
            }
          }
        }
        &>i {
          vertical-align: text-top;
          font-size: 18px;
          line-height: 18px;
          margin-right: 0px;
          color: #d8d8d8;
          &.icon-jinrilongtou-xuanzhong {
            // padding: 0 1px;
            font-size: 18px;
            line-height: 18px;
            margin-right: 0px;
            position: relative;
            top: 1px;
          }
          &.icon-renqilongtou-xuanzhong {
            font-size: 18px;
            line-height: 18px;
            margin-right: 0px; // padding: 1px;
            top: 1px;
            position: relative;
          }
          &.icon-hangyelongtou-xuanzhong {
            // padding: 1px;
            font-size: 18px;
            line-height: 18px;
            margin-right: 0px;
            top: 1px;
            position: relative;
          }
          &.icon-quanbuyixuanzhong {
            padding: 1px;
            font-size: 18px;
            line-height: 18px;
            margin-right: 0px;
            top: 1px;
            position: relative;
          }
        }
        &.active {
          color: #333333;
          &>i {
            color: #FFA387;
            &.icon-jinrilongtou-xuanzhong {
              color: #FFA387;
              padding: 0 1px;
              font-size: 18px;
              line-height: 18px;
              margin-right: 0px;
            }
            &.icon-renqilongtou-xuanzhong {
              color: #FFAA00;
              font-size: 18px;
              line-height: 18px;
              margin-right: 0px;
              padding: 1px;
            }
            &.icon-hangyelongtou-xuanzhong {
              color: #FF6D00;
              padding: 1px;
              font-size: 18px;
              line-height: 18px;
              margin-right: 0px;
            }
            &.icon-quanbuyixuanzhong {
              color: #e6394d;
              padding: 1px;
              font-size: 18px;
              line-height: 18px;
              margin-right: 0px;
            }
          }
        }
      }
    }
  }
}
</style>

