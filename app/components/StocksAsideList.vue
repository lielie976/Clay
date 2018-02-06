<template>
  <section class="stock-list">
		<widget-box title="相关股票">
			<div class="stock-list-container">
				<div class="stock-list-head">
					<span>股票名称</span>
					<span>最新价</span>
					<span>涨跌幅</span>
				</div>
				<ul class="stock-list-content">
          <li class="stock-list-body" v-for="stock in stocks" :key="stock.Symbol">
            <a
              :class="{
                'stock-list-body-link': true,
                [renderMarketColor(currentStock(stock.Symbol).px_change_rate)]: true
              }"
              :href="`/stock/${stock.Symbol}`"
              target="_blank"
            >
              <span>
                <span class="stock-list-body-name">{{ stock.Name }}</span>
                <span class="stock-list-body-symbol">{{ stock.Symbol }}</span>
              </span>
              <span class="stock-list-body-price">{{ currentStock(stock.Symbol).last_px }}</span>
              <span class="stock-list-body-rate">{{ currentStock(stock.Symbol).px_change_rate | numToRate }}</span>
            </a>
          </li>
				</ul>
			</div>
		</widget-box>
	</section>
</template>

<script>
import WidgetBox from './WidgetBox'
import { renderMarketColor } from '~/utils/helpers'

export default {
  components: {
    WidgetBox
  },
  props: {
    stocks: {
      type: Array
    }
  },
  mounted () {
    const stocks = this.stocks
    if (stocks && stocks.length) {
      this.$store.dispatch('stock/getReal', { symbols: stocks.map(i => i.Symbol) })
    }
  },
  methods: {
    renderMarketColor,
    currentStock (symbol) {
      return this.$store.state.stock.real[symbol] || {}
    },
    renderStatus (id) {
      if (!this.val[id]) return {}
      const currentItem = this.val[id]
      const corePcp = currentItem ? currentItem.core_pcp.toFixed(2) : 0
      const pcp = corePcp > 0 ? `+${corePcp}%` : `${corePcp}%`
      let color
      if (corePcp > 0) {
        color = '-market-bg--rise'
      } else if (corePcp < 0) {
        color = '-market-bg--decline'
      } else {
        color = '-market-bg--balance'
      }
      return {
        pcp,
        color
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import '../styles/variables.less';

.stock-list-container {
	margin-top: 8px;
}

.stock-list-head {
	display: flex;
	align-items: center;
	background: #efefef;
	height: 32px;
	text-align: center;
	font-size: 14px;
	color: @subFontColor;
	span {
		display: inline-block;
		flex: 1 1 0%;
	}
}
.stock-list-content {
	border: 1px solid @borderColor;
	.stock-list-body {
		background: #fff;
		height: 64px;
		text-align: center;
		font-size: 14px;
		&:hover {
			background-color: #fafafa;
		}
		span {
			display: inline-block;
			flex: 1 1 0%;
		}
		&-link {
			display: flex;
			align-items: center;
			height: 100%;
		}
		.stock-list-body-name {
			display: block;
			color: @mainFontColor;
		}
		.stock-list-body-symbol {
			display: block;
			font-size: 12px;
			color: #999999;
		}
		.stock-list-body-price {
			color: @subFontColor;
		}
		.stock-list-body-rate {

		}
		&:not(:last-child) {
			border-bottom: 1px solid @borderColor;
		}
	}
}

</style>

