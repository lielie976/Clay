<template>
  <tr :ref="'tr_'+item.Symbol" class="stockitem-tbody-tr">
    <!-- <td @mouseover="symbolOver" @mouseleave="symbolLeave" :target="item.Symbol" class="stockitem-name">
      <a :href="/stock/+item.Symbol" target="_blank" class="stockitem-name-container">
        <div class="stockitem-name-name">
          <span v-if="!item.IsImportant && !ignoreImportant" class="stockitem-icon-weak">
            <i class="iconfont icon-ruoguanliangupiao"></i>
          </span>
          {{item.Name}}
        </div>
        <div class="stockitem-name-symbol">
          {{symbolFilter(item.Symbol)}}
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
    </td> -->
    <td class="desc-td">
      <div class="desc-icon">
          <!-- <i class="iconfont">&#xe6d0;</i>
          <i class="iconfont">&#xe6d1;</i>
          <i class="iconfont">&#xe6d2;</i> -->
          <i v-if="item.JinRiLongTou == 1" class="iconfont">&#xe6cf;</i>
          <i v-if="item.JinRiLongTou == 2" class="iconfont">&#xe6d0;</i>
          <i v-if="item.JinRiLongTou == 3" class="iconfont">&#xe6d1;</i>
          <i v-if="item.RenQiLongTou == 1" class="iconfont">&#xe6d2;</i>
          <i v-if="item.RenQiLongTou == 2" class="iconfont">&#xe6d5;</i>
          <i v-if="item.RenQiLongTou == 3" class="iconfont">&#xe6d6;</i>
          <i v-if="item.HangYeLongTou == 1" class="iconfont">&#xe6d8;</i>
          <i v-if="item.HangYeLongTou == 2" class="iconfont">&#xe6d9;</i>
          <i v-if="item.HangYeLongTou == 3" class="iconfont">&#xe6da;</i>
      </div>
      <div class="desc-main">
        <span class="desc-name">{{item.Name}}</span>
        <span class="desc-symbol">{{symbolFilter(item.Symbol)}}</span>
      </div>
      <div class="desc-image-container" :class="{'blocked':block_span}" v-if="isLogin">
        <img @click="changeBlock" :src="imageUrl">
      </div>
      <span class="locked" v-else>
        <i class="iconfont">&#xe66b;</i>
        <p class="stock-reason-login">请登录后查看</p>
      </span>
    </td>
    <td :class="{'sort-target':isSortTarget('last_px',sortRule)}" class="td-center">
      <span :class="color(item.px_change_rate)">{{item.last_px.toFixed(2)}}</span>
    </td>
    <td class="td-center" :class="{'sort-target':isSortTarget('px_change_rate',sortRule)}">
      <span :class="color(item.px_change_rate)">{{changeRate(item.px_change_rate)}}</span>
    </td>
    <td :class="{'sort-target':isSortTarget('turnover_ratio',sortRule)}" class="td-center">{{percentage(item.turnover_ratio)}}</td>
    <td :class="{'sort-target':isSortTarget('circulation_value',sortRule)}" class="td-center">{{approxNumber(item.circulation_value)}}</td>
    <td :class="{'sort-target':isSortTarget('market_value',sortRule)}" class="td-center">{{approxNumber(item.market_value)}}</td>
    <td :class="{'sort-target':isSortTarget('pe_rate',sortRule)}" class="td-center">
      {{item.pe_rate.toFixed(2)}}
      </td>
    <td class="td-center td-flow">
      <stock-flow v-if="item.stockFlow" :flow-info="item.stockFlow"/>
    </td>
    <td></td>
  </tr>
</template>

<script>
import stockFlow from './stockFlow.vue'
import shareMethodMixin from '~/mixins/shareMethodMixin'
export default {
  props: ['item', 'sortRule', 'iconFlag', 'index', 'ignoreImportant', 'scrollVal', 'isLogin', 'symbol', 'sortTime'],
  data () {
    return {
      imageUrl: '',
      imggg: '',
      block_span: true,
      loading: false
    }
  },
  beforeMount () {
  },
  mounted () {
    let box = this.$refs['tr_' + this.item.Symbol]
    if (box) {
      let bound = box.getBoundingClientRect()
      if (bound.top > 0 && bound.top < window.innerHeight + 4000 && this.loading === false) {
        this.loading = true
        this.$store.dispatch('stockImage/setItem', { id: this.item.Id, path: this.item.DescPath }).then(res => {
          this.loading = false
          this.imageUrl = res
        })
      }
    }
  },
  mixins: [shareMethodMixin],
  components: {
    stockFlow
  },
  watch: {
    scrollVal: function (val) {
      let box = this.$refs['tr_' + this.item.Symbol]
      if (box) {
        let bound = box.getBoundingClientRect()

        if (bound.top > 0 && bound.top < window.innerHeight + 4000 && this.loading === false) {
          this.loading = true
          this.$store.dispatch('stockImage/setItem', { id: this.item.Id, path: this.item.DescPath }).then(res => {
            this.loading = false
            this.imageUrl = res
          })
        }
      }
    },
    sortTime () {
      this.$nextTick(() => {
        let box = this.$refs['tr_' + this.item.Symbol]
        if (box) {
          let bound = box.getBoundingClientRect()
          if (bound.top > 0 && bound.top < window.innerHeight + 4000 && this.loading === false) {
            this.loading = true
            this.$store.dispatch('stockImage/setItem', { id: this.item.Id, path: this.item.DescPath }).then(res => {
              this.loading = false
              this.imageUrl = res
            })
          }
        }
      })
    },
    symbol: function (val) {
      this.loading = false
      this.$nextTick(() => {
        let box = this.$refs['tr_' + this.item.Symbol]
        if (box) {
          let bound = box.getBoundingClientRect()
          if (bound.top > 0 && bound.top < window.innerHeight + 4000 && this.loading === false) {
            this.loading = true
            this.$store.dispatch('stockImage/setItem', { id: this.item.Id, path: this.item.DescPath }).then(res => {
              this.loading = false
              this.imageUrl = res
            })
          }
        }
      })
    }
  },
  methods: {
    changeBlock () {
      this.block_span = !this.block_span
    },
    getRateColor (val) {
      if (val > 0) {
        return '#D93641';
      } else if (val < 0) {
        return '#3aa643'
      } else {
        return '#919599'
      }
    },
    isSortTarget (prop, rule) {
      return rule.mode !== 'default' && rule.targetProp === prop
    },
    symbolOver () {
      this.$emit('symbolOver', this.item.Symbol, this.$refs['tr_' + this.item.Symbol])
    },
    symbolLeave () {
      this.$emit('symbolLeave', this.item.Symbol)
    }
  }
}
</script>

<style lang="less" scoped>
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
      padding: 10px 0 0 15px;
      overflow: visible;
      .desc-icon{
        position: absolute;
        top: 10px;
        left:-12px;
        background: #fff;
        padding:2px 2px 2px 8px;
        border-radius:20px;
        .iconfont{
          display: block;
          font-size: 20px;
          width: 20px;
          height: 20px;
          color: #F2564E;
        }
      }
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
      .desc-main{
        padding-left: 10px;
        .desc-name{
          font-size: 17px;
          color: #333333;
          letter-spacing: 0;
          line-height: 24px;
        }
        .desc-symbol{
          font-size: 12px;
          padding-left: 8px;
          color: #666666;
          letter-spacing: 0;
          line-height: 24px;
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
      // &:before {
      //   content: '';
      //   position: absolute;
      //   display: block;
      //   width: 1px;
      //   background: #e6e6e6;
      //   left: 0;
      //   top: 24px;
      //   bottom: 24px;
      // }
      // &:after {
      //   content: '';
      //   position: absolute;
      //   display: block;
      //   width: 1px;
      //   background: #e6e6e6;
      //   right: 0;
      //   top: 24px;
      //   bottom: 24px;
      // }
    }
    &.td-flow{
      padding: 0;
    }
    &.sort-target {
      background:rgba(230, 57, 77,0.06);
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
        &-jinri{
          &.active{
            .iconfont{
              color: #FFA387;
            }
          }
        }
        &-renqi{
          &.active{
            .iconfont{
              color: #FFAA00;
            }
          }
        }
        &-hangye{
          &.active{
            .iconfont{
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
            position:relative;
            top: 1px;
          }
          &.icon-renqilongtou-xuanzhong {
            font-size: 18px;
            line-height: 18px;
            margin-right: 0px;
            // padding: 1px;
            top: 1px;
            position:relative;
          }
          &.icon-hangyelongtou-xuanzhong {
            // padding: 1px;
            font-size: 18px;
            line-height: 18px;
            margin-right: 0px;
            top: 1px;
            position:relative;
          }
          &.icon-quanbuyixuanzhong {
            padding: 1px;
            font-size: 18px;
            line-height: 18px;
            margin-right: 0px;
            top: 1px;
            position:relative;
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
