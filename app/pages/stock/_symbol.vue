<template>
  <div class="stock">
    <div :id="stockInfo.code" class="stock-info">
      <div class="stock-info-title">
        <span class="stock-info-title-name">{{stockInfo.prod_name}}({{symbol}})</span>
        <span class="stock-info-title-time"><i class="iconfont icon-shijianicon"></i>{{ stockInfo.update_time * 1000 | formatDate('YYYY/MM/DD HH:mm')}}</span>
        <span class="stock-info-title-status">{{ stockInfo.trade_status | getStockTradeStatus }}</span>
      </div>
      <div class="stock-info-main">
        <div class="stock-info-price">
          <div
            :class="{
              'stock-info-price-value': true,
              [getMarketTextColor(stockInfo.px_change)]: true
            }">
              {{ stockInfo.last_px | toFixed(2) }}
            </div>
          <div class="stock-info-price-change">
            <div
              :class="{
                'stock-info-price-change-value': true,
                [getMarketTextColor(stockInfo.px_change)]: true
              }">
                {{ stockInfo.px_change | numToRate }}
              </div>
            <div
              :class="{
                'stock-info-price-change-rate': true,
                [getMarketTextColor(stockInfo.px_change)]: true
              }">
                {{ stockInfo.px_change_rate | numToRate }}
              </div>
          </div>
        </div>
        <div class="stock-info-detail" v-if="stockInfo.securities_type === 'stock'">
          <div class="stock-info-detail-container">
            <span class="stock-info-detail-item">
              <span class="stock-info-detail-item-label">昨收</span>
              <span class="stock-info-detail-item-text">{{ stockInfo.preclose_px | toFixed(2) }}</span>
            </span>
            <span class="stock-info-detail-item">
              <span class="stock-info-detail-item-label">最高</span>
              <span :class="['stock-info-detail-item-text', renderRateStatusColor(stockInfo.high_px, stockInfo.preclose_px)]">{{ stockInfo.high_px | toFixed(2) }}</span>
            </span>
            <span class="stock-info-detail-item">
              <span class="stock-info-detail-item-label">振幅</span>
              <span class="stock-info-detail-item-text">{{ stockInfo.amplitude | numToRate(true) }}</span>
            </span>
            <span class="stock-info-detail-item">
              <span class="stock-info-detail-item-label">市盈率</span>
              <span class="stock-info-detail-item-text">{{ stockInfo.pe_rate | toFixed(2) }}</span>
            </span>
            <span class="stock-info-detail-item">
              <span class="stock-info-detail-item-label">总市值</span>
              <span class="stock-info-detail-item-text">{{ stockInfo.market_value | getCNPriceNum }}</span>
            </span>
            <span class="stock-info-detail-item">
              <span class="stock-info-detail-item-label">成交量</span>
              <span class="stock-info-detail-item-text">{{ stockInfo.business_amount | getCNPriceNum }}</span>
            </span>
            <span class="stock-info-detail-item">
              <span class="stock-info-detail-item-label">今开</span>
              <span :class="['stock-info-detail-item-text', renderRateStatusColor(stockInfo.open_px, stockInfo.preclose_px)]">{{ stockInfo.open_px | toFixed(2) }}</span>
            </span>
            <span class="stock-info-detail-item">
              <span class="stock-info-detail-item-label">最低</span>
              <span :class="['stock-info-detail-item-text', renderRateStatusColor(stockInfo.low_px, stockInfo.preclose_px)]">{{ stockInfo.low_px | toFixed(2) }}</span>
            </span>
            <span class="stock-info-detail-item">
              <span class="stock-info-detail-item-label">换手率</span>
              <span class="stock-info-detail-item-text">{{ stockInfo.turnover_ratio | numToRate(true) }}</span>
            </span>
            <span class="stock-info-detail-item">
              <span class="stock-info-detail-item-label">市净率</span>
              <span class="stock-info-detail-item-text">{{ stockInfo.dyn_pb_rate | toFixed(2) }}</span>
            </span>
            <span class="stock-info-detail-item">
              <span class="stock-info-detail-item-label">流通市值</span>
              <span class="stock-info-detail-item-text">{{ stockInfo.circulation_value | getCNPriceNum }}</span>
            </span>
            <span class="stock-info-detail-item">
              <span class="stock-info-detail-item-label">成交额</span>
              <span class="stock-info-detail-item-text">{{ stockInfo.business_balance | getCNPriceNum }}</span>
            </span>
          </div>
        </div>
        <div class="stock-info-detail" v-if="stockInfo.securities_type === 'index'">
          <div class="stock-info-detail-container">
            <span class="stock-info-detail-item">
              <span class="stock-info-detail-item-label">昨收</span>
              <span class="stock-info-detail-item-text">{{ stockInfo.preclose_px | toFixed(2) }}</span>
            </span>
            <span class="stock-info-detail-item">
              <span class="stock-info-detail-item-label">最高</span>
              <span class="stock-info-detail-item-text">{{ stockInfo.high_px | toFixed(2) }}</span>
            </span>
            <span class="stock-info-detail-item">
              <span class="stock-info-detail-item-label">成交量</span>
              <span class="stock-info-detail-item-text">{{ stockInfo.business_amount | getCNPriceNum }}</span>
            </span>
            <span class="stock-info-detail-item">
              <span class="stock-info-detail-item-label">今开</span>
              <span class="stock-info-detail-item-text">{{ stockInfo.open_px | toFixed(2) }}</span>
            </span>
            <span class="stock-info-detail-item">
              <span class="stock-info-detail-item-label">最低</span>
              <span class="stock-info-detail-item-text">{{ stockInfo.low_px | toFixed(2) }}</span>
            </span>
            <span class="stock-info-detail-item">
              <span class="stock-info-detail-item-label">成交额</span>
              <span class="stock-info-detail-item-text">{{ stockInfo.business_balance | getCNPriceNum }}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="stock-main">
      <div class="stock-main-body">
        <div class="stock-main-body-iframe" v-if="symbol">
          <iframe :src="`https://wallstreetcn.com/markets/widget/ashares/${symbol}`"></iframe>
        </div>
        <!-- {{> relatedSubject/relatedSubject data=subjectList}} -->
      </div>
      <div class="stock-main-slidebar"></div>
    </div>
  </div>

</template>

<script>
import { getStocksReal } from '~/api/wows'
import { extractFieldsToObj, getMarketTextColor } from '~/utils/helpers'

const fields = 'prod_name,trade_status,update_time,last_px,px_change,px_change_rate,preclose_px,open_px,high_px,low_px,amplitude,turnover_ratio,pe_rate,dyn_pb_rate,market_value,circulation_value,business_amount,business_balance,hq_type_code,securities_type'

export default {
  async asyncData ({ store, params }) {
    const { symbol } = params
    const res = await getStocksReal({
      stocks: symbol,
      fields
    })
    return {
      symbol: params.symbol,
      stockInfo: extractFieldsToObj(res.data.snapshot)[symbol]
    }
  },
  methods: {
    getMarketTextColor,
    renderRateStatusColor (later, before) {
      return (
        '-market-color--' +
        (later === before ? 'balance' : later > before ? 'rise' : 'decline')
      )
    }
  },
  mounted () {
    this.timer = setInterval(() => {
      getStocksReal({
        stocks: this.symbol,
        fields
      }).then((res) => {
        this.stockInfo = extractFieldsToObj(res.data.snapshot)[this.symbol]
      })
    }, 5000)
  },
  destroyed () {
    clearInterval(this.timer)
  }
}
</script>

<style lang="less" scoped>
@border-color : #ECECEC;
@border-color-light : #EFEFEF;
@border-color-dark : #D8D8D8;
@fc-primary : #333333;
@fc-gray : #666666;
// @import '../../partials/home/stockIndexItem.scss';
// @import '../../partials/relatedSubject/relatedSubject.scss';
.stock {
  background: #f6f7fb;
  &-info {
    display: block;
    background: #fff;
    width: 1200px;
    height: 180px;
    margin: 40px auto 0;
    padding: 32px;
    &-title {
      height: 24px;
      display: block;
      &-name {
        font-size: 24px;
        color: @fc-primary;
        line-height: 24px;
        display: inline-block;
      }
      &-time {
        font-size: 12px;
        line-height: 12px;
        display: inline-block;
        margin-left: 20px;
        color: @fc-gray;
        position: relative;
        .iconfont {
          font-size: 12px;
          margin-right: 10px;
        }
      }
      &-status {
        font-size: 12px;
        line-height: 12px;
        display: inline-block;
        margin-left: 6px;
        color: @fc-gray;
      }
    }
    &-main {
      display: flex;
      height: 90px;
      .stock-info-price {
        width: 240px;
        height: 100%;
        flex-grow: 0;
        flex-shrink: 0;
        &-value {
          font-size: 48px;
          line-height: 48px;
          letter-spacing: 0;
          margin-top: 16px;
        }
        &-change {
          display: block;
          margin-top: 10px;
          &-value {
            display: inline-block;
            font-size: 18px;
            letter-spacing: 0;
            line-height: 18px;
          }
          &-rate {
            margin-left: 16px;
            display: inline-block;
            font-size: 18px;
            letter-spacing: 0;
            line-height: 18px;
          }
        }
      }
      .stock-info-detail {
        flex: 1 1 0%;
        height: 100%;
        padding-top: 25px;
        font-size: 14px;
        line-height: 14px;
        &-container {
          display: flex;
          flex-wrap: wrap;
          height: 100%;
        }
        &-item {
          width: 16%;
          &-label {
            display: inline-block;
          }
          &-text {
            margin-left: 16px;
          }
        }
      }
    }
  }
  &-main {
    display: flex;
    width: 1200px;
    margin: 26px auto 0;
    padding: 0;
    justify-content: space-between;
    &-body {
      width: 832px;
      &-iframe {
        display: block;
        padding: 16px 10px;
        margin-bottom: 26px;
        width: 842px;
        height: 512px;
        background: #fff;
        & > iframe {
          width: 832px;
          height: 480px;
        }
      }
    }
    &-slidebar {
      width: 344px;
    }
  }
}
</style>
