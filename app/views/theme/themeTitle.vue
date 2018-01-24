<template>
  <div class="theme-main-title-bg">
    <div class="theme-main-title">
      <div class="theme-main-title-desc">
        <h1>{{themeInfo.Name}}
          <div :class="color(plateSetInfo.core_pcp)" class="theme-main-title-rate">{{changeRate(plateSetInfo.core_pcp)}}</div>
        </h1>
        <div class="theme-main-title-desc-count">
          <span class="theme-main-title-desc-count-item">上涨
            <span class="theme-raise-count -market-color--rise theme-main-title-desc-count-item-value">
              {{themeCount.raise}}</span>家</span>
          <span class="theme-main-title-desc-count-item">下跌
            <span class="theme-decline-count -market-color--decline theme-main-title-desc-count-item-value">{{themeCount.down}}</span>家</span>
          <span class="theme-main-title-desc-count-item">平盘
            <span class="theme-stable-count -market-color--balance theme-main-title-desc-count-item-value">{{themeCount.stable}}</span>家</span>
        </div>
      </div>
      <div v-if="swiperSets.length>0" class="theme-main-title-swiper">
        <div class="swiper-container">
          <div class="swiper-wrapper">
            <div v-for="slide in swiperSets" class="swiper-slide">
              <a :href="'/theme/'+item.plate_id" v-for="item in slide" :class="bgcolor(item.core_pcp)" class="related-subject-item">
                <div class="related-subject-item-name">{{item.plate_name}}</div>
                <div class="related-subject-item-rate">{{percentage(item.core_pcp)}}</div>
              </a>
            </div>
          </div>
        </div>
        <div class="swiper-button-next">
          <i class="iconfont">&#xe674;</i>
        </div>
        <div class="swiper-button-prev">
          <i class="iconfont">&#xe673;</i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import shareMethodMixin from '~/mixins/shareMethodMixin'
/* eslint-disable */
// import 'swiper'

export default {
  data () {
    return {
      swiperSets: []
    }
  },

  mounted () {
    this.init()
  },
  computed: {
    themeInfo () {
      return this.$store.state.theme.themeInfo
    },
    plateSetInfo () {
      return this.$store.state.theme.plateSetInfo
    },
    themeCount () {
      return this.$store.state.theme.themeCount
    },
    themeSets () {
      return this.$store.state.theme.themeSets
    }
  },
  methods: {
    init () {
      console.log(this.$store.state.theme.themeSets)
      if (this.themeSets && this.themeSets.length) {
        for (let index = 0; index < this.themeSets.length; index++) {
          let swiperIndex = Math.ceil((index + 1) / 4) - 1
          if (this.swiperSets.length < swiperIndex + 1) {
            this.swiperSets.push([])
          }
          this.swiperSets[swiperIndex].push(this.themeSets[index])
        }
      }
      this.$nextTick(() => {
        const Swiper = require('swiper');
        var swiper = new Swiper('.swiper-container', {
          nextButton: '.swiper-button-next',
          prevButton: '.swiper-button-prev',
          slidesPerView: 1,
          centeredSlides: false,
          spaceBetween: 100
        })
      })
    }
  },

  mixins: [shareMethodMixin]

}
</script>

<style lang="less" scoped>
.theme-main-title-bg {
  min-width: 1200px;
  height: 120px;
  background: #353A47;
  .theme-main-title {
    display: flex;
    height: 120px;
    width: 1200px;
    margin: 0 auto;
    &-rate {
      display: block;
      float: right;
      position: relative;
      left: 10px;
      margin-right: 30px;
    }
    &-desc {
      display: block;
      justify-content: space-between;
      color: #999;
      width: 490px;;
      padding-left: 30px;
      padding-top: 30px;
      &-count {
        width: 500px;
        padding-top: 12px;
        &-item {
          font-size: 14px;
          margin-right: 10px;
          &-value {
            margin: 0 4px;
          }
        }
      }
      &-rate {
        width: 200px;
        text-align: right;
        padding-right: 28px;
        font-size: 36px;
        color: #E6394D;
        letter-spacing: 0;
        line-height: 36px;
      }
      &>h1 {
        display: inline-block;
        font-size: 28px;
        color: #fff;
        min-width: 300px;
        letter-spacing: 0;
        line-height: 28px;
        height: 40px;
        position: relative;
        &:before {
          display: block;
          content: '';
          width: 4px;
          height: 28px;
          position: absolute;
          left: -32px;
          background: #E6394D;
        }
      }
    }
    &-swiper {
      width: 700px;
      position: relative;
      padding-top: 15px;
      .swiper-container {
        width: 84%;
        margin: 0 8%;
        position: relative;
        .related-subject-item {
          display: inline-block;
          height: 88px;
          width: 24%;
          margin-right: 1%;
          text-align: center;
          color: #fff;
          &.-market-color--red {
            color: #fff!important;
            background: $stockRiseColor;
            cursor: pointer;
            &:hover{
              background: $stockRiseHoverColor;
            }
          }
          &.-market-color--green {
            color: #fff!important;
            background: $stockFallColor;
            cursor: pointer;
            &:hover{
              background: $stockFallHoverColor;
            }
          }
          &.-market-color--gray {
            color: #fff!important;
            background: $stockFairColor;
            cursor: pointer;
            &:hover{
              background: $stockFairHoverColor;
            }
          }
          &-name {
            font-size: 16px;
            line-height: 16px;
            margin-top: 18px;
          }
          &-rate {
            font-size: 24px;
            line-height: 24px;
            margin-top: 12px;
          }
        }
        .swiper-slide {
          display: flex;
        }
      }
      .swiper-button-next {
        background-image: none;
        ;
        width: 32px;
        height: 32px;
        margin-top: -16px;
        top: 50%;
        right: 10px;
        color: #fff;
        position: absolute;
        .iconfont {
          font-size: 32px;
          line-height: 32px;
        }
      }
      .swiper-button-prev {
        background-image: none;
        width: 32px;
        height: 32px;
        margin-top: -16px;
        top: 50%;
        color: #fff;
        position: absolute;
        .iconfont {
          font-size: 32px;
          line-height: 32px;
        }
      }
      .swiper-button-disabled {
        display: none;
      }
      .swiper-pagination {
        left: 50%;
        transform: translateX(-50%);
        .swiper-pagination-bullet {
          margin-right: 4px;
          background: #fff;
          opacity: 1;
          &.swiper-pagination-bullet-active {
            background: #fff;
            opacity: 1;
          }
        }
      }
    }
  }
}
</style>
