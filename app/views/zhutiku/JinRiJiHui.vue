<template>
  <section class="jinri-container">
    <widget-box title="今日机会">
      <section class="jinri">
        <div class="jinri-content" v-for="(item, index) in data" :key="item.SubjId">
          <div class="jinri-meta">
            <bkj-meta :index="index" :item="item" />
          </div>
          <div class="jinri-msg">
            <div class="jinri-msg-title">
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
            <div class="jinri-msg-rate">
              <div class="jinri-msg-rate-importance">
                重要性：
                <i v-for="(i, index) in new Array(item.Importance)" :key="index" class="iconfont icon-zhongyaodengji">{{i}}</i>
              </div>
              <div class="jinri-msg-rate-certainty">
                持续性：
                <i v-for="(i, index) in new Array(item.ConfidenceLv)" :key="index" class="iconfont icon-zhongyaodengji">{{i}}</i>
              </div>
            </div>
            <div class="jinri-msg-stocks">
              <Stocks :stocks="item.Subj.FeaturedMsgStocks" />
            </div>
          </div>
          <div class="jinri-time">
            {{item.Subj.FeaturedMsgAt * 1000 |formatDate('YYYY/MM/DD')}}
          </div>
        </div>
      </section>
    </widget-box>
  </section>
</template>

<script>
import WidgetBox from '~/components/WidgetBox'
import Stocks from '~/components/Stocks'
import BkjMeta from './BkjMeta'

export default {
  components: {
    WidgetBox,
    Stocks,
    BkjMeta
  },
  computed: {
    data () {
      return this.$store.state.settings.settings.JinRiJiHuiQianZhan
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../styles/variables.less';

.jinri {
  width: 832px;
  margin-top: 8px;
}

.jinri-content {
  display: flex;
  height: 144px;
  background: #fff;
  padding: 16px 0;
  &:not(:last-child) {
    border-bottom: 1px solid #efefef;
  }
}

.jinri-meta {
  flex-basis: 166px;
}

.jinri-msg {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 0 32px;
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
  &-rate {
    flex: 1;
    font-size: 12px;
    line-height: 12px;
    color: @subFontColor;
    .iconfont {
      font-size: 16px;
      color: #F3564D;
    }
    &-importance {
      display: inline-block;
      margin-right: 16px;
    }
    &-certainty {
      display: inline-block;

    }
  }
}

.jinri-time {
  font-size: 12px;
  line-height: 18px;
  color: #999999;
  padding: 0 24px;
}
</style>

