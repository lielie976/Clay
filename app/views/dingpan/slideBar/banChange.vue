<template>
<div :class="{'dark':isDark}" class="ban-change">
  <div class="ban-change-title">
    <span>异动提醒</span>
    <div class="ban-change-option">
      <poptip v-model="optionVisible" placement="bottom-end" >
        <div><i  class="ban-change-option-btn iconfont">&#xe6c4;</i>
        <span class="ban-change-option-label">设置</span>
        </div>
        <div class="option-container" slot="content">
          <div class="option-item option-item-big">
            <span class="option-item-name">板块异动提醒</span>
            <div class="inline-div">
              <input v-model="bankuai" type="checkbox" id="alert-option-switch-bankuai" name="alert-option-switch-bankuai" class="option-switch" />
              <label for="alert-option-switch-bankuai"></label>
            </div>
          </div>
          <div class="option-item option-item-big no-bottom-line">
            <span class="option-item-name">个股异动提醒</span>
            <div class="inline-div">
              <input v-model="gegu" type="checkbox" id="alert-option-switch-gegu" name="alert-option-switch-gegu" class="option-switch" />
              <label for="alert-option-switch-gegu"></label>
            </div>
          </div>
          <div class="option-gegu">
            <div @click="changeGegu(item)" :class="{'disable':!gegu}" v-for="item in geguItem" class="option-gegu-item">
              <!-- <input type="checkbox" :id="`filter-${item.label}`" v-model="item.checked"  :name="`filter-${item.label}`" class="ban-news-titlebar-filter-checkbox" />
              <label :for="`filter-${item.label}`">{{item.label}}</label> -->
              <!-- <i v-if="item.checked" class="iconfont iconfont-red" >&#xe6c5;</i>
              <i v-else class="iconfont">&#xe6c6;</i> -->
              <img src="/ding_checked.png"  class="option-gegu-item-checkbox" v-if="item.checked && gegu" alt="">
              <i v-if="item.checked && !gegu" class="iconfont" >&#xe6c5;</i>
              <img src="/ding_unchecked.png"  class="option-gegu-item-checkbox" v-if="!item.checked " alt="">
              <span class="option-gegu-label" :class="{'selected':item.checked}" >{{item.label}}</span>
            </div>
          </span>
          </div>
          <div class="option-item-title">筛选</div>
          <div class="option-item-group">
          <div class="option-item">
            <span class="option-item-name">桌面提醒</span>
            <div class="inline-div">
              <input v-model="alertInfo.zhuomian" type="checkbox" id="alert-option-switch-1" name="alert-option-switch-1" class="option-switch" />
              <label for="alert-option-switch-1"></label>
            </div>
            </div>
            <div class="option-item">
              <span class="option-item-name">声音提醒</span>
            <div class="inline-div">
              <input v-model="alertInfo.shenyin" type="checkbox" id="alert-option-switch-2" name="alert-option-switch-2" class="option-switch" />
              <label for="alert-option-switch-2"></label>
            </div>
            </div>
          </div><div class="option-item-group">
            <div class="option-item">
              <span class="option-item-name">语音播报</span>
            <div class="inline-div">
              <input v-model="alertInfo.voice" type="checkbox" id="alert-option-switch-3" name="alert-option-switch-3" class="option-switch" />
              <label for="alert-option-switch-3"></label>
            </div>
            </div>
          </div>
        </div>
      </poptip>
    </div>
  </div>
  <div id="ban-change-main" v-if="stockEvent && stockEvent.length" class="ban-change-main">
    <ban-change-item :item="item" :key="item.object_id +item.timestamp+item.type" v-for="item in stockEvent" />
    <infinite-scroll :load="loadmore" :element="`ban-change-main`" />
  </div>
</div>
</template>
<script>
/* eslint-disable */
import shareMethodMixin from '~/mixins/shareMethodMixin'
import { fetchEvent } from "~/api/theme";
import banChangeItem from "./banChangeItem.vue";
import InfiniteScroll from "./InfiniteScroll.vue";
import readFromBaidu from '~/services/baiduTTS'
export default {
  data() {
    return {
      head: null,
      tail: null,
      gegu: true,
      bankuai: true,
      stockEvent: [],
      msgInterval: null,
      changeAlert: false,
      audio: null,
      Mytip: null,
      optionVisible: false,
      alertInfo: {
        zhuomian: false,
        shenyin: false,
        voice: false
      },
      geguItem: [
        {
          code: 1,
          label: "封涨停板",
          checked: true
        },
        {
          code: 2,
          label: "逼近涨停",
          checked: true
        },
        {
          code: 3,
          label: "打开涨停板",
          checked: true
        },
        {
          code: 4,
          label: "即将打开涨停",
          checked: true
        },
        {
          code: 5,
          label: "封跌停板",
          checked: true
        },
        {
          code: 6,
          label: "逼近跌停",
          checked: true
        },
        {
          code: 7,
          label: "打开跌停板",
          checked: true
        },
        {
          code: 8,
          label: "即将打开跌停板",
          checked: true
        },
        {
          code: 9,
          label: "新股开板",
          checked: true
        },
        {
          code: 10,
          label: "新股开板回封",
          checked: true
        },
        {
          code: 11,
          label: "大幅拉升",
          checked: true
        },
        {
          code: 12,
          label: "快速跳水",
          checked: true
        }
      ]
    };
  },
  props: ["isDark"],
  mixins: [shareMethodMixin],
  mounted() {
    this.changeAlert =
      localStorage.getItem("banChange") == "false" ? false : true;
    let alertInfo = localStorage.getItem("banChangeAlert");
    this.alertInfo = alertInfo
      ? JSON.parse(alertInfo)
      : {
          zhuomian: false,
          shenyin: false,
          voice: false
        };
    let banChangeFilter = localStorage.getItem("banChangeFilter");
    this.bankuai = banChangeFilter ? JSON.parse(banChangeFilter).bankuai : true;
    this.gegu = banChangeFilter ? JSON.parse(banChangeFilter).gegu : true;
    this.geguItem = banChangeFilter
      ? JSON.parse(banChangeFilter).geguItem
      : [
          {
            code: 1,
            label: "封涨停板",
            checked: true
          },
          {
            code: 2,
            label: "逼近涨停",
            checked: true
          },
          {
            code: 3,
            label: "打开涨停板",
            checked: true
          },
          {
            code: 4,
            label: "即将打开涨停",
            checked: true
          },
          {
            code: 5,
            label: "封跌停板",
            checked: true
          },
          {
            code: 6,
            label: "逼近跌停",
            checked: true
          },
          {
            code: 7,
            label: "打开跌停板",
            checked: true
          },
          {
            code: 8,
            label: "即将打开跌停板",
            checked: true
          },
          {
            code: 9,
            label: "新股开板",
            checked: true
          },
          {
            code: 10,
            label: "新股开板回封",
            checked: true
          },
          {
            code: 11,
            label: "大幅拉升",
            checked: true
          },
          {
            code: 12,
            label: "快速跳水",
            checked: true
          }
        ];
    if (this.alertInfo.zhuomian) {
      this.activeNotification();
    }
    this.audio = new Audio("/alert.mp3");
    this.loadData();
  },
  watch: {
    gegu() {
      this.setFilterLS()
      this.fetchMsg();
    },
    bankuai() {
      this.setFilterLS()
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
        localStorage.setItem("banChangeAlert", JSON.stringify(this.alertInfo));
      }
    },
  },
  methods: {
    loadData() {
      this.fetchMsg().then(
        res => {
          this.msgInterval = setInterval(this.refreshMsg, 5000);
        },
        reject => {
          setTimeout(() => {
            this.loadData();
          }, 10000);
        }
      );
    },
    setFilterLS () {
      localStorage.setItem("banChangeFilter", JSON.stringify({
        'bankuai':this.bankuai,
        'gegu': this.gegu,
        'geguItem': this.geguItem
      }));
    },
    changeGegu(item) {
      if (this.gegu) {
        item.checked = !item.checked;
        this.setFilterLS()
      }
    },
    fetchMsg() {
      return fetchEvent({
        limit: 20,
        types: this.setEventType()
      }).then(json => {
        let eventList = this.dataBeautify(json.data, "fields", "items");
        if (eventList && eventList.length) {
          this.head = eventList[0].timestamp;
          this.tail = eventList[eventList.length - 1].timestamp;
        }
        if (eventList) {
          this.stockEvent = [...eventList];
        }
        // console.log(eventList,this.head)
      });
    },
    refreshMsg() {
      if (!this.head) {
        return new Promise(function(resolve, reject) {
          resolve(0);
        });
      }
      return fetchEvent({ head: this.head, types: this.setEventType() })
        .then(res => {
          let eventList = this.dataBeautify(res.data, "fields", "items");
          this.head =
            eventList && eventList.length ? eventList[0].timestamp : this.head;
          // console.log(eventList,this.head)
          if (eventList && eventList.length) {
            let boardList = [];
            eventList.reverse().map(i => {
              if (
                !this.stockEvent.some(
                  item =>
                    item.timestamp == i.timestamp &&
                    item.type == i.type &&
                    item.object_id == i.object_id
                )
              ) {
                this.stockEvent.unshift(i);
                const hour = new Date(i.timestamp * 1000).getHours();
                const minute = new Date(i.timestamp * 1000).getMinutes();
                if (i.type < 100) {
                  boardList.push(
                    `${hour}点${minute}分 ${i.object_name}${i.content}`
                  );
                } else {
                  let zsstr =
                    i.detail && i.detail.cores && i.detail.cores.length
                      ? i.detail.cores
                          .map(stock => {
                            return `${stock.symbol}`;
                          })
                          .join(" ") + "领涨"
                      : "";
                  boardList.push(
                    `${hour}点${minute}分${i.object_name}${i.content}${zsstr}`
                  );
                }
              }
            });
            if (boardList.length) {
              if (this.alertInfo.shenyin) {
                this.audio.play();
              }
              if (this.alertInfo.zhuomian) {
                this.Mytip.duration = 10000;
                this.Mytip.showTip(boardList.join("|"));
              }
              if (this.alertInfo.voice) {
                readFromBaidu(boardList.join(""), this.$store.state.external.baiduTTSToken.Token);
              }
            }
          }
          // console.log(this.msgs.length,this.msgs)
        })
        .catch(e => {});
    },
    loadmore() {
      // console.log("load");
      if (!this.tail) {
        return new Promise(function(resolve, reject) {
          resolve(1);
        });
      }
      return fetchEvent({
        tail: this.tail,
        types: this.setEventType()
      })
        .then(res => {
          let eventList = this.dataBeautify(res.data.data, "fields", "items");
          this.stockEvent.push(...eventList);
          this.tail =
            eventList && eventList.length
              ? eventList[eventList.length - 1].timestamp
              : this.head;
          //  console.log(this.msgs.length,[...this.msgs])
          if (!eventList || !eventList.length) {
            return Promise.resolve("ended");
          }
        })
        .catch(e => {});
    },
    setEventType() {
      let subjList = [];
      if (this.gegu) {
        subjList.push(
          this.geguItem
            .filter(i => i.checked)
            .map(j => j.code)
            .join(",")
        );
      }
      if (this.bankuai) {
        subjList.push("100,101,102,103");
      }
      return subjList.length ? subjList.join(",") : null;
    },
    swapAlert() {
      this.changeAlert = !this.changeAlert;
      localStorage.setItem("banChange", this.changeAlert);
      if (this.changeAlert) {
        this.activeNotification();
      }
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
    banChangeItem,
    InfiniteScroll
  }
};
</script>
<style lang="less" scoped>
@import '../../../styles/variables.less';
.ban-change {
  // flex: 0 0 50%;
  // overflow: auto;
  display: flex;
  flex-direction: column;
  &-title {
    flex: 0 0 30px;
    // height: 40px;
    line-height: 20px;
    display: flex;
    padding: 0 16px;
    background: #efefef;
    justify-content: space-between;
    & > span {
      display: inline-block;
      font-size: 14px;
      color: #333;
    }
    .iconfont {
      font-size: 20px;
      display: inline-block;
      color: #626980;
      padding: 0;
      line-height: 20px;
      // vertical-align:text-bottom;
      cursor: pointer;
      &.checked {
        color: #e6394d;
      }
    }
    .ban-change-option-label {
      // vertical-align:text-bottom;
      font-size: 13px;
      line-height: 20px;
      height: 20px;
      display: inline-block;
      color: #626980;
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
      // background: #fafafa;
      padding: 0 16px;
      text-align: right;
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
        .filter-gegu {
          color: #fff;
        }
      }
      // 自定义checkbox样式
      &-checkbox {
        color: #999;
        display: inline-block;
        // & ~ label{
        //   &:before{
        //     font-family:'iconfont';
        //     content:'\e60d';
        //   }
        // }
        &:checked ~ label {
          // &:before{
          //   font-family:'iconfont';
          //   content:'\e60c';
          // }
          color: #999;
        }
      }
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
    background: #fafafa;
  }
  &-main {
    display: block;
    // flex-direction: column;
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
    line-height: 28px;
    font-size: 12px;
    color: #999999;
    letter-spacing: 0.75px;
    user-select: none;
    cursor: pointer;
    padding: 0;
    .option-container {
      // width: 136px;
      margin: 0;
      padding: 1px 0 16px 0;
      width: 260px;
      background: #353a47;
      .option-item {
        height: 32px;
        // width: 136px;
        display: flex;
        background: #353a47;
        width: 45%;
        line-height: 32px;
        font-size: 14px;
        padding: 0 16px;
        color: #ffffff;
        letter-spacing: 0;
        justify-content: space-between;
        display: flex;
        &-title{
          display: block;
          height: 24px;
          background-color: #3d4352;
          color: #b8b8b8;
          font-size: 13px;
          line-height: 24px;
          padding-left: 16px;
        }
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
          font-size: 13px;
          line-height: 22px;
        }
        &-big {
          width: 100%;
          border-bottom: 1px solid #3d4352;
          margin-top: 10px;
          &.no-bottom-line{
            border-bottom:none;
          }
        }
        &-group {
          display: flex;
          justify-content: space-between;
          padding-top: 5px;
        }
      }
      .option-gegu {
        display: flex;
        width: 100%;
        flex-wrap: wrap;
        padding:0 16px;
        border-bottom: 1px solid #3d4352;
        &-item {
          width: 50%;
          display: block;
          padding: 6px 0;
          color: #b8b8b8;
          font-size: 13px;
          .iconfont {
            font-size: 12px;
            width: 12px;
            height: 12px;
            margin-right: 4px;
            color: #424759;
            display: inline-block;
            &.iconfont-red {
              color: #e6394d;
              position: relative;
              line-height: 12px;
              background: #fff;
            }
          }
          &-checkbox {
            position: relative;
            top: 1px;
          }
          .option-gegu-label {
            color: #b8b8b8;
            &.selected {
              color: #fff;
            }
          }
          &.disable {
            color: #666;
            cursor: not-allowed;
            color: fff;
            .iconfont {
              color: #424759;
              &.iconfont-red {
                color: #2d303b;
              }
            }
            .option-gegu-label {
              color: #666;
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
  .ban-change-title {
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
  // .ban-change-titlebar-filter {
  //   background: @dingDarkThird;
  // }
  // .ban-change-titlebar-filter-checkbox:checked ~ label {
  //   color: #fff;
  // }
}

// .ban-change-main::-webkit-scrollbar {
//   width: 10px;
// }

// .ban-change-main::-webkit-scrollbar-track {
//   background: #fff;
// }

// .ban-change-main::-webkit-scrollbar-thumb {
//   background-color: darkgrey;
//   border-radius: 5px;
//   outline: 1px solid #4a4a4a;
// }
.ban-change.dark .ban-change-main::-webkit-scrollbar {
  width: 14px;
}
.ban-change.dark .ban-change-main::-webkit-scrollbar-track {
  background: @dingDarkThird;
}
.ban-change.dark .ban-change-main::-webkit-scrollbar-thumb {
  background-color: transparent;
  border-radius: 20px;
  border: 4px solid @dingDarkThird;
  /*outline: 1px solid #2f2f31;*/
}
.ban-change.dark .ban-change-main:hover::-webkit-scrollbar-thumb {
  background-color: darkgrey;
  border-radius: 20px;
  border: 4px solid @dingDarkThird;
}

.ban-change.dark .ban-change-main::-webkit-scrollbar-corner {
  background: @dingDarkThird;
}
</style>
<style lang="less">
@import '../../../styles/variables.less';
.ban-change-option {
  position: relative;
  .ivu-poptip-popper[x-placement^="bottom"] {
    padding: 0;
    min-width: 120px;
    .ivu-poptip-arrow {
      display: none;
    }
    .ivu-poptip-body {
      padding: 0;
    }
  }
}
</style>
