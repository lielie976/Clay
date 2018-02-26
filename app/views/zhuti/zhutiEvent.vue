<template>
  <div class="zhuti-event">
    <div class="zhuti-event-tab-list">
      <template v-for="item in tabItems">
        <span @click="swapEventTab(item)" :class="{active:item.selected}" class="zhuti-event-tab-list-item">{{item.text}}</span>
      </template>
    </div>
    <div ref="eventContainer" class="zhuti-event-list" v-if="tabItems[0].selected && events && events.length">
      <div :id="`event`+ item.id" :class="{selected:item.selected}" :key="item.id" class="zhuti-event-item" v-for="item in events">
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
    </div>
    <div class="theme-news-container" v-if="tabItems[1].selected">
      <div v-if="msgNews && msgNews.length">
        <a v-for="n in msgNews"  target="_blank" :href="`/article/${n.Id}`" class="theme-news-item">
          <div class="theme-news-item-title">{{n.Title}}</div>
          <div class="theme-news-item-time">{{timeFormatter(n.CreatedAt,'YYYY/MM/DD    HH:mm')}}</div>
        </a>
      </div>
      <div v-else class="theme-news-container-empty">
        <img src="/img/no_theme_info.png"/>
        <span>暂无更多动态</span>
      </div>
    </div>
  </div>
</template>
<script>
/* eslint-disable */
import shareMethodMixin from '~/mixins/shareMethodMixin'
export default {
  computed: {
    msgNews () {
      return this.$store.state.theme.themeMsg
    },
    timeRange () {
      return this.$store.state.zhutiChart.timeRange
    }
  },
  mounted () {
    this.events = this.$store.state.theme.themeGoodBad
  },
  watch: {
    timeRange (v) {
      if(v && v.length == 2){
        this.events = this.$store.state.theme.themeGoodBad.filter(i => {
          return i.updated_at * 1000 > v[0] && i.updated_at * 1000 < v[1]
        })
      } else {
        this.events = this.$store.state.theme.themeGoodBad
      }
    }
  },
  data () {
    return {
      tabItems: [{
        text: '事件',
        target: 'sj',
        selected: true
      }, {
        text: '深度',
        target: 'sd',
        selected: false
      }],
      events: null
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
    },
    swapEventTab (item) {
      this.tabItems = this.tabItems.map(i => {
        i.selected = (i.target === item.target)
        return i
      })
    },
    scrollToEvent(t){
      let scrollTarget = null
      this.events = this.events.map(i => {
        if(new Date(i.updated_at * 1000).setHours(0, 0, 0, 0) == t){
          i.selected = true
          if(!scrollTarget) {
            scrollTarget = i.id
          }
        } else {
          i.selected = false
        }
        return i
      })
      if (this.tabItems[0].selected && this.events && this.events.length) {
        this.$refs.eventContainer.scrollTo(0, document.getElementById(`event` + scrollTarget).offsetTop)
      }
    },
    clearEventSelect () {
      this.events = this.events.map(i => {
        i.selected = false
        return i
      })
    }
  },
  mixins: [shareMethodMixin]
}
</script>
<style lang="less">
@import "../../styles/variables.less";
.zhuti-event{
  height: 100%;
  display: block;
  width: 360px;
  position: relative;
  padding-top: 40px;
  &-tab{
    &-list{
      height: 40px;
      width: 100%;
      border-bottom: 1px solid #F0F0F0;
      position: absolute;
      top: 0;
      display: flex;
      justify-content: space-around;
      &-item{
        line-height: 40px;
        font-size: 16px;
        display: inline-block;
        height: 40px;
        width: 40px;
        color: #999999;
        text-align: center;
        margin: 0 5px;
        cursor: pointer;
        &.active{
          color: #333333;
          border-bottom: 2px solid #E6394D;
        }
        &:hover{
          color: #333333;
          border-bottom: 2px solid #E6394D;
        }
      }
    }
  }
  &-list{
    overflow-y: auto;
    position: absolute;
    top: 40px;
    bottom: 0;
    left: 0;
    right: 0;
    .zhuti-event-item{
      display: flex;
      position: relative;
      &.selected{
        background: #999;
      }
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
}
.theme-news{
  display: block;
  &-container{
    height: 273px;
    background: #fff;
    padding: 0 0 0 0;
    margin-top: 8px;
    transition: none !important;
    &-empty{
      display: block;
      padding-top: 84px;
      padding-right: 24px;
      text-align: center;
      flex: 1;
      color:#999;
      &>img{
        display: block;
        margin: 0 auto;
        margin-bottom: 10px;
        text-align: center;
      }
    }
    .theme-news-item{
      display: block;
      height: 90px;
      padding: 10px 24px 16px 24px;
      border-bottom: 1px solid @borderColor;
      transition: none !important;
      &:hover{
        background: #fafafa;
      }
      &-title{
        font-size:14px;
        line-height: 21px;
        height: 42px;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        position: relative;
        overflow: hidden;
        color: @fc-primary;
        top: 3px;
        border: none;
      }
      &-time{
        color:@fc-gray;
        font-size: 12px;
        margin-top: 12px;
        position: relative;
        padding-left: 15px;
        &:before{
          content:'\e63c';
          font-family:'iconfont';
          font-size: 12px;
          position: absolute;
          left: 0;
          top: 0;
          display: block;
        }
      }
      &:last-child{
        border: none;
      }
    }
  }
}
</style>
