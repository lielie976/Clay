<template>
  <section class="jinri-container">
    <widget-box title="中长线机会">
      <section class="midLongTerm">
        <div class="midLongTerm-content" v-for="(item, index) in data" :key="item.FeaturedMsgId">
          <div class="midLongTerm-meta">
            <bkj-meta :index="index" :item="item" />
          </div>
          <div class="midLongTerm-msg">
            <div class="midLongTerm-msg-title">
              <a
                :href="`/article/${item.Subj.FeaturedMsgId}`"
                target="_blank"
                v-if="item.Subj.FeaturedMsgStyle !== '1'"
              >
                {{item.Subj.FeaturedMsgTitle}}
              </a>
              <span v-else>
                {{item.Subj.FeaturedMsgTitle}}
              </span>
            </div>
            <div class="midLongTerm-msg-rate"></div>
            <div class="midLongTerm-msg-stocks">
              <span class="midLongTerm-msg-stocks-tracktime">{{item.TrackedAt * 1000 | formatDate('MM/DD')}} 追踪至今 </span>
              <zhong-chang-xian-stocks :stocks="[item.TrackStock]" :real="real" />
            </div>
          </div>
          <div class="midLongTerm-time">
            {{formatZhutikuMetaDate(item.Subj.FeaturedMsgAt * 1000)}}
          </div>
        </div>
      </section>
    </widget-box>
  </section>
</template>

<script>
import { isToday, format } from 'date-fns'
import { getmidLongTermStocks } from '~/api/settings'
import WidgetBox from '~/components/WidgetBox'
import ZhongChangXianStocks from './ZhongChangXianStocks'
import BkjMeta from './BkjMeta'

export default {
  components: {
    WidgetBox,
    ZhongChangXianStocks,
    BkjMeta
  },
  computed: {
    data () {
      return this.$store.state.settings.settings.ZhongChangXianJiHui
    }
  },
  data () {
    return {
      real: {}
    }
  },
  methods: {
    formatZhutikuMetaDate (date) {
      return isToday(date) ? `今天 ${format(date, 'HH:mm')}` : format(date, 'YYYY/MM/DD')
    },
    getStocksReal () {
      getmidLongTermStocks().then((historyReal) => {
        this.$store.dispatch('stock/getReal', this.data.map(i => i.TrackStock ? i.TrackStock.Symbol : null)).then((data) => {
          const real = {}
          Object.keys(data).forEach((symbol) => {
            real[symbol] = data[symbol]
            let rate = real[symbol].last_px
            const historyPx = historyReal[symbol].ClosePrice
            rate = ((rate - historyPx) / historyPx * 100)
            real[symbol].px_change_rate = rate
          })
          this.real = real
        })
      })
    }
  },
  mounted () {
    this.getStocksReal()
    this.timer = setInterval(() => {
      this.getStocksReal()
    }, 30 * 1000)
  },
  destroyed () {
    clearInterval(this.timer)
  }
}
</script>

<style lang="less" scoped>
@import '../../styles/variables.less';

.midLongTerm-container {
  margin-top: 24px;
}

.midLongTerm {
  width: 832px;
  margin-top: 8px;
}

.midLongTerm-content {
  display: flex;
  height: 144px;
  background: #fff;
  padding: 16px 0;
  &:not(:last-child) {
    border-bottom: 1px solid #efefef;
  }
}

.midLongTerm-meta {
  flex-basis: 166px;
}

.midLongTerm-msg {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 0 32px;
  &-rate {
    flex: 1;
  }
  &-title {
    color: @mainFontColor;
    font-size: 16px;
    margin-bottom: 12px;
    a {
      color: @mainFontColor;
    }
    a:visited {
      color: @subFontColor;
    }
    &:hover {
      color: @mainFontColorHover;
      a {
        color: @mainFontColorHover;
      }
    }
  }
  .midLongTerm-msg-stocks-tracktime {
    font-size: 14px;
    color: #666;
    margin-right: 16px;
  }
}

.midLongTerm-time {
  font-size: 12px;
  line-height: 18px;
  color: #999999;
  padding: 0 24px;
}
</style>
