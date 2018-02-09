<template>
  <div class="zhuti-event">
    <template v-if="events && events.length">
      <div :key="item.id" class="zhuti-event-item" v-for="item in events">
        <div class="event-timeline">
        </div>
        <div class="event-main">
          <div :class="impact(item.impact)" class="event-type"></div>
          <div class="event-time">
            <span>{{timeFormatter(item.updated_at,'YYYY-MM-DD HH:mm')}}</span>
            <span :class="impact(item.impact)" class="event-impact">{{impactText(item.impact)}}</span>
          </div>
          <div class="event-content">
            {{item.title}}
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
<script>
import shareMethodMixin from '~/mixins/shareMethodMixin'
export default {
  computed: {
    events () {
      return this.$store.state.theme.themeGoodBad
    }
  },
  methods: {
    impact (v) {
      switch (v) {
        case -2:
          return 'superbad'
        case -1:
          return 'bad'
        case 0:
          return 'normal'
        case 1:
          return 'good'
        case 2:
          return 'supergood'
        default:
          break;
      }
    },
    impactText (v) {
      switch (v) {
        case -2:
          return '超级利空'
        case -1:
          return '利空'
        case 0:
          return ''
        case 1:
          return '利好'
        case 2:
          return '超级利好'
        default:
          break;
      }
    }
  },
  mixins: [shareMethodMixin]
}
</script>
<style lang="less">
.zhuti-event{
  height: 100%;
  display: block;
  overflow-y: auto;
  &-item{
    display: flex;
    position: relative;
    .event-timeline{
      width: 16px;
      flex: 0 1 16px;
      position: relative;
    }
    .event-main{
      flex: 1 1 1;
      width: 332px;
      display: block;
      border-left:1px dashed #D6D6D6;
      padding-left: 15px;
      padding-top: 6px;
      overflow: visible;
      position: relative;
      .event-type{
        width: 8px;
        height: 8px;
        border-radius: 4px;
        display: block;
        position: absolute;
        left: -5px;
        top: 14px;
        background: #fff;
        &.superbad{
          border:2px solid #18A66B;
          &:before{
            content:'';
            position: absolute;
            left:-4px;
            top:-4px;
            width: 12px;
            height: 12px;
            width: 12px;
            border-radius:6px;
            border:2px solid rgba(24, 166, 107,0.5);
          }
        }
        &.bad{
          border:2px solid #18A66B;
          &:before{
            content:'';
            position: absolute;
            left:-4px;
            top:-4px;
            width: 12px;
            height: 12px;
            width: 12px;
            border-radius:6px;
            border:2px solid rgba(24, 166, 107,0.5);
          }
        }
        &.good{
          border:2px solid #E6394D;
          &:before{
            content:'';
            position: absolute;
            left:-4px;
            top:-4px;
            width: 12px;
            height: 12px;
            width: 12px;
            border-radius:6px;
            border:2px solid rgba(230, 57, 77,0.5);
          }
        }
        &.supergood{
          border:2px solid #E6394D;
          &:before{
            content:'';
            position: absolute;
            left:-4px;
            top:-4px;
            width: 12px;
            height: 12px;
            width: 12px;
            border-radius:6px;
            border:2px solid rgba(230, 57, 77,0.5);
          }
        }
      }
      .event-time{
        font-size: 14px;
        color: #666666;
        line-height: 24px;
        .event-impact{
          display: inline-block;
          font-size: 12px;
          padding: 2px 4px;
          line-height: 12px;
          color:#fff;
          margin-left: 4px;
          vertical-align: text-bottom;
          &.good{
            background: #E6394D;
          }
          &.bad{
            background: #18A66B;
          }
          &.supergood{
            background: #E6394D;
          }
          &.superbad{
            background: #18A66B;
          }
        }
      }
      .event-content{
        font-size: 16px;
        color: #333333;
        letter-spacing: 0;
        line-height: 24px;
        margin-bottom: 12px;
      }
    }
  }
}
</style>
