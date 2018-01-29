<template>
  <div v-if="modal" class="modal" id="theme-modal">
  <div class="modal-background"></div>
  <div class="modal-content">
    <div class="theme-detail">
      <div class="theme-detail-main">
        <div class="theme-detail-title">
          <!-- <h1>{{themeTitle}}</h1> -->
        </div>
        <div class="theme-detail-text-container">
          <div :class="{show:item.selected,hide:!item.selected}"  v-for="item in intro" class="theme-detail-text">
            <span  class="theme-detail-text-title">{{item.Question}}</span>
            <span v-html="item.HtmlAnswer"></span>
          </div>
        </div>
      </div>
      <div class="theme-detail-slidebar">
        <div class="theme-detail-label">
          <div @click="modalClick(item)" v-for="item in intro" class="theme-detail-label-item">
            <input :checked="item.selected"  class="theme-detail-label-item-radio-input" type="radio" name="question_detail">
            <label class="theme-detail-label-item-label"><span>{{item.Question}}</span></label>
          </div>
        </div>
      </div>
    </div>
  </div>
  <button @click="hideModal" class="modal-close"></button>
</div>

</template>
<script>
import shareMethodMixin from '~/mixins/shareMethodMixin'
import WidgetBox from '~/components/WidgetBox'

export default {
  data () {
    return {
      msgNews: []
    }
  },
  props: ['intro', 'modal'],
  components: {
    WidgetBox
  },
  mounted () {
    this.msgNews = this.$store.state.theme.themeMsg
    console.log(this.msgNews)
  },
  computed: {
  },
  methods: {
    modalClick (item) {
      this.$emit('mutate-intro', item)
    },
    hideModal () {
      this.$emit('hide-modal')
    }
  },
  mixins: [shareMethodMixin]
}
</script>

<style lang="less" scoped>
@import "../../styles/variables.less";
.theme-info{
  display: flex;
  width: 1200px;
  margin: 24px auto 0;
  justify-content: space-between;
  transition: none !important;
  .theme-intro{
    width: 832px;
    display: block;
    &-container{
      width:832px;
      height: 273px;
      background: #fff;
      display: flex;
      margin-top: 8px;
      padding: 24px 4px 24px 0;
      .theme-intro-text-container{
        width:685px;
        font-size:14px;
        line-height: 28px;
        display: block;
        position: relative;
        color: #333;
        padding-left:24px;
        transition: none !important;
        &-empty{
          display: block;
          margin-top: 60px;
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
        .theme-intro-text{
          position: absolute;
          word-wrap: break-word;
          &>p{
            max-width: 640px;
            // padding-bottom: 8px;
            text-indent: 26px;
            &>img{
              max-width: 640px;
            }
          }
          &>div{
            max-width: 640px;
            padding-bottom: 8px;
            &>img{
              max-width: 640px;
            }
          }
          &.show{
            opacity:1;
            // transition: all 1s;
          }
          &.line-clamp {
            max-height: 196px;
            -webkit-line-clamp: 7;
            -webkit-box-orient: vertical;
            overflow: hidden;
            line-height: 28px;
            padding: 0 0px 0 0;
            top: 3px;
            border: none;
          }
          &.hide{
            opacity: 0;
            // transition: all 1s;
          }
        }
        .theme-intro-more{
          margin-top: 20px;
          font-size: 14px;
          color:#666;
          letter-spacing: 0;
          line-height: 14px;
          display: block;
          left: 50%;
          bottom: 0;
          position: absolute;
          transform: translateX(-50%);
          cursor: pointer;
          padding-left: 20px;
          &:before{
            content:'\e614';
            font-family:'iconfont';
            font-size: 14px;
            position: absolute;
            font-weight: bold;
            left: 0;
            cursor: pointer;
            top: 0;
            display: block;
          }
          &:hover{
            color: #E6394D;
          }
        }
      }
      .theme-intro-label{
        display: block;
        width:143px;
        border-left:1px solid @borderColor;
        overflow-y: auto;
        &::-webkit-scrollbar {
          width: 4px;
        }
        &::-webkit-scrollbar-track {
          background: #fff;
          border-radius: 2px;
        }
        &::-webkit-scrollbar-thumb {
          border-radius: 4px;
          background: #efefef;
        }
        &-item{
          padding-left:28px;
          padding-right: 10px;
          min-height: 20px;
          margin-bottom: 15px;
          vertical-align: bottom;
          .theme-intro-label-item-radio-input{
            display: none;
            &:empty ~ label:before{
              content:'';
              font-family:'iconfont';
              font-size: 24px;
              position: absolute;
              left: 0;
              top: 0;
              display: block;
            }
            &:checked ~ label:before{
              content:'\e638';
              font-family:'iconfont';
              font-size: 12px;
              position: absolute;
              left: -15px;
              color: #E6394D;
              font-weight: bold;
              top: 0;
              display: block;
            }
            &:checked ~ label>span{
              color: #333;
            }
          }
          &-label{
            position: relative;
            font-size: 14px;
            line-height: 20px;
            cursor: pointer;
            display: block;
            color:@fc-primary;
            &>span{
              display: block;
              color:#666;
              line-height: 20px;
              &:hover{
                color:#E6394D;
              }
            }
          }
        }
      }
    }
  }
  .theme-news{
    width: 344px;
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
}
.theme-stock{
  width:1200px;
  margin: 0 auto;
}
#theme-modal{
  display: block;
  .modal-content{
    width: 1100px;
    overflow: initial;
    position: absolute;
    display: block;
    left: 50%;
    transform: translateX(-50%);
    top: 50px;
    bottom: 50px;
  }
  .modal-background{
    background-color: rgba(10, 10, 10, .4);
    bottom: 0;
    left: 0;
    position: fixed;
    right: 0;
    top: 0;
  }
  .modal-close{
  }
}
.theme-detail{
  display: flex;
  width: 1100px;
  height: 100%;
  justify-content: space-between;
  &-main{
    width:832px;
    min-height: 200px;
    background: #fff;
    position: relative;
    padding: 0 32px;
    .theme-detail-title{
      display: block;
      height: 76px;
      width: 100%;
      padding-top: 32px;
      border-bottom: 1px solid @borderColor;
      h1{
        display: block;
        font-size: 28px;
        color: @fc-primary;
        letter-spacing: 0;
        line-height: 28px;
        position: relative;
        &:before{
          display: block;
          content: '';
          width: 4px;
          height: 28px;
          position:absolute;
          left: -32px;
          background: @mainColorRed;
        }
      }
      &-desc{
        display: flex;
        justify-content: space-between;
        &-count{
          width: 500px;
          padding-top: 12px;
          &-item{
            font-size:14px;
            margin-right: 10px;
            &-value{
              margin: 0 4px;
            }
          }
        }
        &-rate{
          width: 200px;
          text-align: right;
          padding-right: 28px;
          font-size: 36px;
          color: @mainColorRed;
          letter-spacing: 0;
          line-height: 36px;
        }
      }
    }
    .theme-detail-text-container{
      position: absolute;
      top: 100px;
      bottom:15px;
      left: 32px;
      right: 32px;
      display: block;
      overflow: auto;
      padding: 0px 0 0 0;
    }
    .theme-detail-text{
      display: block;
      border-bottom: 1px dashed #d8d8d8;
      margin-bottom: 32px;
      width: 740px;
      &:last-child{
        border-bottom: none;
      }
      &-title{
        font-weight: bold;
        font-size: 20px;
        margin-bottom: 16px;
        position: relative;
        left: 16px;
        display: block;
        &:before{
          content: '';
          display: block;
          position: absolute;
          left: -16px;
          width:8px;
          height: 8px;
          border-radius: 4px;
          top: 10px;
          background: #E6394D;
        }
      }
      >p{
        padding-bottom: 12px;
        font-size: 16px;
        text-indent:26px;
        color: #333;
      }
      &.show{
        display: block;
        // transition: all 1s;
      }
      &.line-clamp {
        max-height: 196px;
        -webkit-line-clamp: 7;
        -webkit-box-orient: vertical;
        overflow: hidden;
        line-height: 28px;
        padding: 0 24px 0 0;
        top: 3px;
        border: none;
      }
      &.hide{
        display: none;
        // transition: all 1s;
      }
    }
  }
  &-slidebar{
    width:250px;
    // border-left:1px solid @borderColor;
    padding-top: 120px;
    .theme-detail-label{
      position: relative;
      &:before{
        display: block;
        position: absolute;
        content: '';
        width: 1px;
        top: -5px;
        bottom: -30px;
        background: #fff;
      }
      &-item{
        padding-left:28px;
        height: 34px;
        position: relative;
        &:before{
          display: block;
          position: absolute;
          width: 1px;
          top: -10px;
          bottom: 50px;
          background: #fff;
          left: 0;
        }
        .theme-detail-label-item-radio-input{
          display: none;
          &:empty ~ label:before{
            content:'';
            font-family:'iconfont';
            font-size: 24px;
            position: absolute;
            left: 0;
            top: 0;
            display: block;
          }
          &:checked ~ label:before{
            content:'\e638';
            font-family:'iconfont';
            font-size: 12px;
            position: absolute;
            left: -15px;
            color: #E6394D;
            font-weight: bold;
            top: 0;
            display: block;
          }
        }
        &-label{
          position: relative;
          font-size: 14px;
          cursor: pointer;
          color:#fff;
        }
      }
    }
  }
}

</style>
