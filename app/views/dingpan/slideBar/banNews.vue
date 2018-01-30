<template>
<div :class="{'dark':isDark}" class="ban-news">
  <div class="ban-news-title">
    <span>7X24小时直播<i v-if="alertInfo.zhuomian ||alertInfo.voice || alertInfo.shenyin" class="ban-news-alert iconfont">&#xe6bc;</i><i class="ban-news-alert-disable iconfont" v-else>&#xe6c1;</i></span>
    <div class="ban-news-option">
      <poptip v-model="optionVisible" placement="bottom-end" >
        <div><i  class="ban-news-option-btn iconfont">&#xe6c4;</i>
        <span class="ban-news-option-label">设置</span>
        </div>
        <div class="option-container" slot="content">
          <div class="option-check-title">筛选</div>
          <div @click="newsFilter.gg=!newsFilter.gg"  class="option-check-item">
            <img src="/ding_checked.png"  class="option-check-item-checkbox" v-if="newsFilter.gg" alt="">
            <img src="/ding_unchecked.png"  class="option-check-item-checkbox" v-else alt="">
            <span class="option-check-label" :class="{'selected':newsFilter.gg}" >公告</span>
          </div>
          <div @click="newsFilter.dxw=!newsFilter.dxw"  class="option-check-item">
            <img src="/ding_checked.png"  class="option-check-item-checkbox" v-if="newsFilter.dxw" alt="">
            <img src="/ding_unchecked.png"  class="option-check-item-checkbox" v-else alt="">
            <span class="option-check-label" :class="{'selected':newsFilter.dxw}" >大新闻</span>
          </div>
          <div @click="newsFilter.pzyd=!newsFilter.pzyd"  class="option-check-item">
            <img src="/ding_checked.png"  class="option-check-item-checkbox" v-if="newsFilter.pzyd" alt="">
            <img src="/ding_unchecked.png"  class="option-check-item-checkbox" v-else alt="">
            <span class="option-check-label" :class="{'selected':newsFilter.pzyd}" >盘中异动</span>
          </div>
          <div @click="newsFilter.scjh=!newsFilter.scjh"  class="option-check-item">
            <img src="/ding_checked.png"  class="option-check-item-checkbox" v-if="newsFilter.scjh" alt="">
            <img src="/ding_unchecked.png"  class="option-check-item-checkbox" v-else alt="">
            <span class="option-check-label" :class="{'selected':newsFilter.scjh}" >市场机会</span>
          </div>
          <div class="option-check-title">通知设置</div>
          <div class="option-item">
            <span class="option-item-name">桌面提醒</span>
            <div class="inline-div">
              <input v-model="alertInfo.zhuomian" type="checkbox" id="alert-option-switch-11" name="alert-option-switch-11" class="option-switch" />
              <label for="alert-option-switch-11"></label>
            </div>
            </div>
            <div class="option-item">
              <span class="option-item-name">声音提醒</span>
            <div class="inline-div">
              <input v-model="alertInfo.shenyin" type="checkbox" id="alert-option-switch-12" name="alert-option-switch-12" class="option-switch" />
              <label for="alert-option-switch-12"></label>
            </div>
            </div>
            <div class="option-item">
              <span class="option-item-name">语音播报</span>
            <div class="inline-div">
              <input v-model="alertInfo.voice" type="checkbox" id="alert-option-switch-13" name="alert-option-switch-13" class="option-switch" />
              <label for="alert-option-switch-13"></label>
            </div>
            </div>
        </div>
      </poptip>
    </div>
  </div>
  <div id="ban-news-main" v-if="msgs && msgs.length" class="ban-news-main">
    <ban-news-item :item="item" :key="item.Id" v-for="item in msgs" />
    <infinite-scroll :load="loadmore" :element="`ban-news-main`" />
  </div>
</div>
</template>
<script>
/* eslint-disable */
import banNewsItem from "./banNewsItem.vue";
import { getPcMsgs } from "~/api/message";
import InfiniteScroll from "./InfiniteScroll.vue";
import readFromBaidu from '~/services/baiduTTS'

// import { readFromBaidu } from "../../../utils";
export default {
  data() {
    return {
      headmark: null,
      tailmark: null,
      newsFilter:{
        gg: true,
        dxw: true,
        pzyd: true,
        scjh: true,
      },
      msgs: [],
      msgInterval: null,
      newsAlert: false,
      audio: null,
      Mytip: null,
      optionVisible: false,
      alertVisible: false,
      alertInfo: {
        zhuomian: false,
        shenyin: false,
        voice: false
      }
    };
  },
  props: ["isDark"],
  mounted() {
    this.newsAlert = localStorage.getItem("banNews") == "false" ? false : true;
    this.newsFilter = localStorage.getItem("banNewsFiter")?JSON.parse(localStorage.getItem("banNewsFiter")):{
        gg: true,
        dxw: true,
        pzyd: true,
        scjh: true,
      }
    let alertInfo = JSON.parse(localStorage.getItem("banAlert"));
    this.alertInfo = alertInfo
      ? alertInfo
      : {
          zhuomian: false,
          shenyin: false,
          voice: false
        };
    if (this.alertInfo.zhuomian) {
      this.activeNotification();
    }
    this.audio = new Audio("/alert.mp3");
    this.loadData().then(res => {
    this.$nextTick(() => {
        // $(".ban-news-main").on("copy", function(e) {
        //   debugger;
        //   const selection = window.getSelection();
        //   const appendText = `<br>(选股宝7×24直播 不止是快) <a href="https://xuangubao.cn">https://xuangubao.cn</a>`;
        //   const text = selection + appendText;
        //   const newDiv = document.createElement("div");
        //   document.body.appendChild(newDiv);
        //   newDiv.style.position = "absolute";
        //   newDiv.style.left = "-99999px";
        //   newDiv.innerHTML = text;
        //   selection.selectAllChildren(newDiv);
        //   setTimeout(function() {
        //     document.body.removeChild(newDiv);
        //   }, 100);
        // });
      });
    });
  },
  watch: {
    'newsFilter.gg'() {
      localStorage.setItem("banNewsFiter", JSON.stringify(this.newsFilter))
      this.fetchMsg();
    },
    'newsFilter.dxw'() {
      localStorage.setItem("banNewsFiter", JSON.stringify(this.newsFilter))
      this.fetchMsg();
    },
    'newsFilter.pzyd'() {
      localStorage.setItem("banNewsFiter", JSON.stringify(this.newsFilter))
      this.fetchMsg();
    },
    'newsFilter.scjh'() {
      localStorage.setItem("banNewsFiter", JSON.stringify(this.newsFilter))
      this.fetchMsg();
    },
    "alertInfo.zhuomian"(v) {
      if (v) {
        this.activeNotification();
      }
    },
    alertInfo: {
      deep: true,
      handler: function(v) {
        localStorage.setItem("banAlert", JSON.stringify(this.alertInfo));
        if (v.zhuomian) {
          this.activeNotification();
        }
      }
    }
  },
  methods: {
    loadData() {
      return this.fetchMsg().then(
        res => {
          this.msgInterval = setInterval(this.refreshMsg, 20000);
        },
        reject => {
          setTimeout(() => {
            this.loadData();
          }, 10000);
        }
      );
    },
    fetchMsg() {
      return getPcMsgs({
        limit: 30,
        subjids: this.setNewsFilter()
      }).then(json => {
        this.headmark = json.HeadMark;
        this.tailmark = json.TailMark;
        if (json.NewMsgs.length) {
          this.msgs = [...json.NewMsgs];
        }
      });
      this.$nextTick(() => {
        stockStore.getStocksReal();
      }).catch(e => {
        console.log("发生错误！", e);
      });
    },
    refreshMsg() {
      let self = this;
      if (!this.headmark) {
        return new Promise(function(resolve, reject) {
          resolve(0);
        });
      }
      return getPcMsgs({
        headmark: this.headmark,
        limit: 30,
        subjids: this.setNewsFilter()
      })
        .then(res => {
          this.lastTime = new Date();
          this.headmark =
            res.HeadMark && res.HeadMark != "0"
              ? res.HeadMark
              : this.headmark;
          if (res.UpdatedMsgs && res.UpdatedMsgs.length) {
            res.UpdatedMsgs.map(updateitem => {
              this.msgs = this.msgs.map(item => {
                if (item.Id == updateitem.Id) {
                  return updateitem;
                } else {
                  return item;
                }
              });
            });
          }
          if (res.NewMsgs && res.NewMsgs.length) {
            let d = res.NewMsgs.reverse();
            this.msgs.unshift(...d);
            if (this.alertInfo.shenyin) {
              this.audio.play();
            }
            if (this.alertInfo.zhuomian && this.Mytip) {
              this.Mytip.duration = 10000;
              this.Mytip.showTip(res.NewMsgs[0].Title);
            }
            if (this.alertInfo.voice) {
              const newMsgsTitle = res.NewMsgs.map(i => {
                const hour = new Date(i.CreatedAtInSec * 1000).getHours();
                const minute = new Date(i.CreatedAtInSec * 1000).getMinutes();
                return `${hour}点${minute}分 ${i.Title} `;
              }).join(" ");
              readFromBaidu(newMsgsTitle, this.$store.state.external.baiduTTSToken.Token);
            }
          }
          if (res.DeletedMsgs && res.DeletedMsgs.length) {
            for (let i = this.msgs.length - 1; i >= 0; i--) {
              res.DeletedMsgs.map(deleteitem => {
                if (deleteitem.Id == this.msgs[i].Id) {
                  this.msgs.splice(i, 1);
                  return deleteitem;
                }
              });
            }
          }

          // console.log(this.msgs.length,this.msgs)
        })
        .catch(e => {});
    },
    loadmore() {
      console.log("load");
      if (!this.tailmark ||this.tailmark == '0') {
        return new Promise(function(resolve, reject) {
          resolve(1);
        });
      }
      return getPcMsgs({
        tailmark: this.tailmark,
        limit: 30,
        subjids: this.setNewsFilter(),
        msgIdMark:this.msgs[this.msgs.length-1].Id
      })
        .then(res => {
          this.lastTime = new Date();
          // this.msgs = [...this.msgs, ...res.NewMsgs]
          if(res.NewMsgs){
            this.msgs.push(...res.NewMsgs);
            this.tailmark = res.TailMark;
          }else{
            return Promise.resolve('ended')
          }
          //  console.log(this.msgs.length,[...this.msgs])
        })
        .catch(e => {});
    },
    setNewsFilter() {
      let subjList = [];
      if (this.newsFilter.gg) {
        subjList.push("723");
      }
      if (this.newsFilter.dxw) {
        subjList.push("10");
      }
      if (this.newsFilter.pzyd) {
        subjList.push("35");
      }
      if (this.newsFilter.scjh) {
        subjList.push("469");
      }
      return subjList.length && subjList.length < 4
        ? subjList.join(",")
        : "9,723,10,35,469";
    },
    activeNotification() {
      let Mytip = {
          icon: "http://image.bao.wallstreetcn.com/baoer_logo/120x120.png",
          title: "",
          duration: 5000,
          msg: "I'm a default message",
          onclick: null,
          onclose: null
        },
        N;
      if (!("Notification" in window)) {
        Mytip.showTip = function() {
          if (console)
            console.log("your browser is not support HTML5 notification");
        };
      } else {
        N =
          window.Notification ||
          window.mozNotification ||
          window.webkitNotification;
        N.requestPermission(function(permission) {});
        Mytip.showTip = function(t, m) {
          if (N.permission === "granted") granted(t, m);
          else if (N.permission !== "denied") {
            N.requestPermission(function(permission) {
              if (permission === "granted") granted(t, m);
            });
          }
        };

        function granted(t, m) {
          var n = new N(t, {
            body: m,
            icon: Mytip.icon
          });
          n.onclick = Mytip.onclick;
          n.onclose = Mytip.onclose;
          n.onerror = function() {
            console.log("Notification is error");
          };
          n.onshow = function() {
            if (Mytip.duration)
              setTimeout(function() {
                n.close();
              }, Mytip.duration);
          };
        }
      }
      this.Mytip = Mytip;
    }
  },
  components: {
    banNewsItem,
    InfiniteScroll
  }
};
</script>
<style lang="less" scoped>
@import '../../../styles/variables.less';
.ban-news {
  // flex: 0 0 50%;
  // overflow: auto;
  display: flex;
  flex-direction: column;
  background: @dingDarkThird;
  &-title {
    flex: 0 0 40px;
    // height: 40px;
    line-height: 40px;
    display: flex;
    padding: 0 16px;
    background: #efefef;
    justify-content: space-between;
    & > span {
      display: inline-block;
      font-size: 14px;
      color: #333;
      line-height: 40px;
      line-height: 40px;
      vertical-align: text-top;
    }
    .iconfont.ban-news-alert {
      font-size: 20px;
      line-height: 40px;
      display: inline-block;
      color: #e6394d;
      vertical-align: bottom;
      padding: 0 10px;
    }
    .iconfont.ban-news-alert-disable {
      font-size: 20px;
      line-height: 40px;
      display: inline-block;
      color: #fff;
      vertical-align: bottom;
      padding: 0 10px;
    }
    .iconfont.ban-news-option-btn{
      font-size: 20px;
      display: inline-block;
      color: #626980;;
      padding: 0;
      line-height: 20px;
      // vertical-align:text-bottom;
      cursor: pointer;
    }
    .ban-news-option-label{
      // vertical-align:text-bottom;
      font-size: 13px;
      line-height: 20px;
      height: 20px;
      display: inline-block;
      color: #626980;;
    }
  }
  &-titlebar {
    height: 30px;
    padding: 0;
    background: #fafafa;
    border-bottom: 1px solid @border-color-dark;
    position: relative;
    &-filter {
      display: block;
      background: #fafafa;
      padding: 0 16px;
      label {
        margin: auto 10px auto 5px;
        font-size: 12px;
        color: #999;
        cursor: pointer;
        &:hover {
          color: #333;
        }
      }
      &-item {
        display: block;
        background: #3f4352;
        padding: 5px 12px;
      }
      // 自定义checkbox样式
      &-checkbox {
        color: #999;
        display: inline-block;
        &:checked ~ label {
          color: #999;
        }
      }
    }
    &-split {
      display: block;
      height: 1px;
      width: 90%;
      margin: 0 auto;
      border-top: 1px solid #414452;
    }
    &-remind {
      float: right;
      font-size: 12px;
      color: @fc-gray;
      position: relative;
      top: -5px;
      cursor: pointer;
      i {
        font-size: 20px;
        margin-left: 3px;
        position: relative;
        top: 3px;
        color: #666;
      }
      &.checked {
        i {
          color: @mainColorRed;
        }
      }
    }
  }
  &-container {
    padding-top: 20px;
    margin-top: 10px;
    background: #fff;
  }
  &-main {
    display: block;
    flex: 1 0 0;
    overflow-y: auto;
  }
  &-loadmore {
    display: block;
    margin-top: 16px;
    background: #fff;
    height: 45px;
    text-align: center;
    cursor: pointer;
    &-text {
      line-height: 45px;
      font-size: 16px;
      position: relative;
      &:before {
        content: "\e639";
        font-family: "iconfont";
        position: absolute;
        left: -25px;
      }
    }
  }
  &-option {
    color: #fff;
    line-height: 44px;
    font-size: 12px;
    letter-spacing: 0.75px;
    user-select: none;
    cursor: pointer;
    padding: 0;
    .option-container {
      // width: 136px;

      margin: 0;
      .option-item {
        height: 32px;
        // width: 136px;
        display: block;
        background: #353a47;
        line-height: 32px;
        font-size: 14px;
        color: #ffffff;
        letter-spacing: 0;
        padding-left: 16px;
        .option-switch {
          &:empty {
            display: none;
            ~ label {
              position: relative;
              display: inline-block;
              height: 16px;
              width: 32px;
              top: 3px;
              float: left;
              line-height: 16px;
              text-indent: 32px;
              cursor: pointer;
              &:before {
                position: absolute;
                display: block;
                top: 0;
                bottom: 0;
                left: 0;
                content: "";
                width: 32px;
                background-color: #292c33;
                border-radius: 8px;
                transition: all 100ms ease-in;
              }
              &:after {
                position: absolute;
                display: block;
                content: "";
                width: 14px;
                top: 1px;
                margin-left: 1px;
                height: 14px;
                background-color: #b7b7b7;
                border-radius: 8px;
                transition: all 100ms ease-in;
              }
            }
          }
          &:checked ~ label {
            &:before {
              background-color: #e6394d;
            }
            &:after {
              margin-left: 16px;
            }
          }
        }
        &-name {
          font-size: 12px;
          line-height: 12px;
        }
      }
      .option-check {
        display: flex;
        flex-wrap: wrap;
        &-title{
          display: block;
          height: 24px;
          background-color: #3d4352;
          color: #b8b8b8;
          font-size: 13px;
          line-height: 24px;
          padding-left: 16px;
        }
        &-item {
          display: block;
          padding: 4px 16px;
          color: #b8b8b8;
          background: @dingDarkSec;
          font-size: 13px;
          .iconfont {
            font-size: 12px;
            width: 12px;
            height: 12px;
            margin-right: 4px;
            color: #424759;
            &.iconfont-red {
              color: #e6394d;
            }
          }
          &-checkbox{
            position: relative;
            top: 1px;
          }
          .option-check-label {
            color: #b8b8b8;
            &.selected {
              color: #fff;
            }
          }
        }
      }
    }
    &-btn {
      padding: 0 10px;
    }
  }
}
.dark {
  .ban-news-title {
    background: @dingDarkSec;
    & > span {
      color: #ffffff;
    }
    & > .iconfont {
      color: #ffffff;
      &.checked {
        color: #e6394d;
      }
    }
  }
  .ban-news-titlebar-filter {
    background: @dingDarkThird;
  }
  .ban-news-titlebar-filter-checkbox:checked ~ label {
    color: #fff;
  }
}

// .ban-news-main::-webkit-scrollbar {
//   width: 10px;
// }

// .ban-news-main::-webkit-scrollbar-track {
//   background: #fff;
// }

// .ban-news-main::-webkit-scrollbar-thumb {
//   background-color: darkgrey;
//   outline: 1px solid slategrey;
// }
// .ban-news .ban-news-main::-webkit-scrollbar {
//   width: 10px;
// }

// .ban-news .ban-news-main::-webkit-scrollbar-track {
//   background: #fff;
// }

// .ban-news .ban-news-main::-webkit-scrollbar-thumb {
//   background-color: darkgrey;
//   border-radius: 5px;
//   outline: 1px solid slategrey;
// }

.ban-news.dark .ban-news-main::-webkit-scrollbar {
  width: 14px;
}
.ban-news.dark .ban-news-main::-webkit-scrollbar-track {
  background: @dingDarkThird;
}
.ban-news.dark .ban-news-main::-webkit-scrollbar-thumb {
  background-color: transparent;
  border-radius: 20px;
  border: 4px solid @dingDarkThird;
  /*outline: 1px solid #2f2f31;*/
}
.ban-news.dark .ban-news-main:hover::-webkit-scrollbar-thumb {
  background-color: darkgrey;
  border-radius: 20px;
  border: 4px solid @dingDarkThird;
}
.ban-news.dark .ban-news-main::-webkit-scrollbar-corner {
  background: @dingDarkThird;
}

// .ban-news.dark .ban-change-main::-webkit-scrollbar-thumb:hover {
//   background-color: darkgrey;
//   border-radius:20px;
//   border: 4px solid @dingDarkThird;
//   /*outline: 1px solid #3b3b3d;*/
// }
</style>

<style lang="less">
@import '../../../styles/variables.less';
.ban-news-option,
.ban-alert-option {
  position: relative;
  .ivu-poptip-inner {
    background-color: @dingDarkThird;
  }
  .ivu-poptip-popper[x-placement^="bottom"] {
    padding: 0;
    min-width: 120px;
    .ivu-poptip-arrow {
      display: none;
    }
    .ivu-poptip-body {
      padding: 0;
    }
    .option-container {
      padding: 8px 0;
    }
  }
}
</style>
