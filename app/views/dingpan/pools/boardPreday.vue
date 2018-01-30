<template>
<div class="table-container">
   <table v-if ="topFixed" class="table hit-pool__table fixed">
    <colgroup>
      <col style="width: 4%;">
      <col style="width: 7%;">
      <col style="width: 19%;">
      <col style="width: 7%;">
      <col style="width: 7%;">
      <!-- <col style="width: 7%;"> -->
      <col style="width: 7%;">
      <col style="width: 7%;">
      <col style="width: 7%;">
      <col style="width:10%;">
      <col style="width:10%;">
      <col style="width:7%;">
      <col style="width:7%;">
    </colgroup>
    <thead  class="hit-pool__table-head fixed">
      <tr >
        <th ><abbr title="序号">序号</abbr></th>
        <th ><abbr title="股票名称">股票名称</abbr></th>
        <th  class="stock-reason-head"><abbr title="理由分析">理由分析</abbr></th>
        <th @click="startSort('cur_price')" :class="{'sort_target':'cur_price' == sortTarget}"  target="cur_price" class="stock-sort"><abbr title="最新价">最新价</abbr><span class="icon"><i :class="getSortStatus('cur_price')" class="iconfont " ></i></span></th>
        <th :class="{'sort_target':'px_change_rate' == sortTarget}"   @click="startSort('px_change_rate')" target="px_change_rate" class="stock-sort"><abbr title="涨跌幅">涨跌幅</abbr><span class="icon"><i :class="getSortStatus('px_change_rate')" class="iconfont " ></i></span></th>
        <!-- <th :class="{'sort_target':'blockade_ratio' == sortTarget}"  @click="startSort('blockade_ratio')" target="blockade_ratio" class="stock-sort"><abbr title="封单比">封单比</abbr><span class="icon"><i :class="getSortStatus('blockade_ratio')" class="iconfont " ></i></span></th> -->
        <th :class="{'sort_target':'turnover_ratio' == sortTarget}"  @click="startSort('turnover_ratio')" target="turnover_ratio" class="stock-sort"><abbr title="换手率">换手率</abbr><span class="icon"><i :class="getSortStatus('turnover_ratio')" class="iconfont " ></i></span></th>
        <th :class="{'sort_target':'circulation_value' == sortTarget}"  @click="startSort('circulation_value')" target="circulation_value" class="stock-sort"><abbr title="流通市值">流通市值</abbr><span class="icon"><i :class="getSortStatus('circulation_value')" class="iconfont " ></i></span></th>
        <th :class="{'sort_target':'total_value' == sortTarget}" @click="startSort('total_value')" target="total_value" class="stock-sort"><abbr title="总市值">总市值</abbr><span class="icon"><i :class="getSortStatus('total_value')" class="iconfont " ></i></span></th>
        <th :class="{'sort_target':'first_raise_time' == sortTarget}" @click="startSort('first_raise_time')"  target="first_raise_time" class="stock-sort"><abbr title="首次封板">首次封板</abbr><span class="icon"><i :class="getSortStatus('first_raise_time')" class="iconfont " ></i></span></th>
        <th :class="{'sort_target':'last_raise_time' == sortTarget}"  @click="startSort('last_raise_time')"  target="last_raise_time" class="stock-sort"><abbr title="最后封板">最后封板</abbr><span class="icon"><i :class="getSortStatus('last_raise_time')" class="iconfont " ></i></span></th>
        <th :class="{'sort_target':'open_count' == sortTarget}" @click="startSort('open_count')" target="open_count" class="stock-sort"><abbr title="开板数">开板数</abbr><span class="icon"><i :class="getSortStatus('open_count')" class="iconfont " ></i></span></th>
        <th :class="{'sort_target':'continue_board_count' == sortTarget}" @click="startSort('continue_board_count')"  target="continue_board_count" class="stock-sort"><abbr title="连板数">连板数</abbr><span class="icon"><i :class="getSortStatus('continue_board_count')" class="iconfont " ></i></span></th>
      </tr>
    </thead>
   </table>
  <table class="table hit-pool__table">
    <colgroup>
      <col style="width: 4%;">
      <col style="width: 7%;">
      <col style="width: 19%;">
      <col style="width: 7%;">
      <col style="width: 7%;">
      <!-- <col style="width: 7%;"> -->
      <col style="width: 7%;">
      <col style="width: 7%;">
      <col style="width: 7%;">
      <col style="width:10%;">
      <col style="width:10%;">
      <col style="width:7%;">
      <col style="width:7%;">
    </colgroup>
    <thead  class="hit-pool__table-head">
      <tr >
        <th ><abbr title="序号">序号</abbr></th>
        <th ><abbr title="股票名称">股票名称</abbr></th>
        <th  class="stock-reason-head"><abbr title="理由分析">理由分析</abbr></th>
        <th :class="{'sort_target':'cur_price' == sortTarget}" @click="startSort('cur_price')" target="cur_price" class="stock-sort"><abbr title="最新价">最新价</abbr><span class="icon"><i :class="getSortStatus('cur_price')" class="iconfont " ></i></span></th>
        <th  :class="{'sort_target':'px_change_rate' == sortTarget}" @click="startSort('px_change_rate')" target="px_change_rate" class="stock-sort"><abbr title="涨跌幅">涨跌幅</abbr><span class="icon"><i :class="getSortStatus('px_change_rate')" class="iconfont " ></i></span></th>
        <!-- <th  :class="{'sort_target':'blockade_ratio' == sortTarget}" @click="startSort('blockade_ratio')" target="blockade_ratio" class="stock-sort"><abbr title="封单比">封单比</abbr><span class="icon"><i :class="getSortStatus('blockade_ratio')" class="iconfont " ></i></span></th> -->
        <th :class="{'sort_target':'turnover_ratio' == sortTarget}" @click="startSort('turnover_ratio')" target="turnover_ratio" class="stock-sort"><abbr title="换手率">换手率</abbr><span class="icon"><i :class="getSortStatus('turnover_ratio')" class="iconfont " ></i></span></th>
        <th  :class="{'sort_target':'circulation_value' == sortTarget}" @click="startSort('circulation_value')" target="circulation_value" class="stock-sort"><abbr title="流通市值">流通市值</abbr><span class="icon"><i :class="getSortStatus('circulation_value')" class="iconfont " ></i></span></th>
        <th :class="{'sort_target':'total_value' == sortTarget}" @click="startSort('total_value')" target="total_value" class="stock-sort"><abbr title="总市值">总市值</abbr><span class="icon"><i :class="getSortStatus('total_value')" class="iconfont " ></i></span></th>
        <th :class="{'sort_target':'first_raise_time' == sortTarget}" @click="startSort('first_raise_time')"  target="first_raise_time" class="stock-sort"><abbr title="首次封板">昨日</br>首次封板</abbr><span class="icon"><i :class="getSortStatus('first_raise_time')" class="iconfont " ></i></span></th>
        <th :class="{'sort_target':'last_raise_time' == sortTarget}"  @click="startSort('last_raise_time')"  target="last_raise_time" class="stock-sort"><abbr title="最后封板">昨日</br>最后封板</abbr><span class="icon"><i :class="getSortStatus('last_raise_time')" class="iconfont " ></i></span></th>
        <th :class="{'sort_target':'open_count' == sortTarget}" @click="startSort('open_count')" target="open_count" class="stock-sort"><abbr title="开板数">昨日</br>开板数</abbr><span class="icon"><i :class="getSortStatus('open_count')" class="iconfont " ></i></span></th>
        <th :class="{'sort_target':'continue_board_count' == sortTarget}" @click="startSort('continue_board_count')"  target="continue_board_count" class="stock-sort"><abbr title="连板数">昨日</br>连板数</abbr><span class="icon"><i :class="getSortStatus('continue_board_count')" class="iconfont " ></i></span></th>
      </tr>
    </thead>
    <tbody class="table hit-pool__table-body">
      <tr :key="item.symbol" v-for="item in stockList">
          <td class="stock-index">{{item.index}}</td>
          <td @mouseleave="leaveTitle" @mouseover="hoverTitle(item, $event)" :target="item.symbol"  class="stock-title"><a target="_blank" :href="`/stock/`+item.symbol"><span class="stock-title-name">{{item.title}}</span><br/>{{symbolFilter(item.symbol)}}</a></td>

          <td v-if="item.reason == '__lock'" @click="login"  class="stock-reason locked"><span class="line-clamp">
          <i class="iconfont">&#xe66b;</i>
          <p class="stock-reason-login">请登录后查看</p>
          </span></td>
          <td v-else  class="stock-reason ">
            <span :aria-label="reasonFilter(item.reason)" class=" hint--bottom hint--large">
              <span  class="line-clamp">
                <template v-for="(p,index) in item.plates_reason"  v-if="item.plates_reason && item.plates_reason.length">
                <a v-if="p.plate_id != 0" target="_blank" class="stock-reason-plate" :key="p.plate_id" :href="`/theme/`+p.plate_id" >
                  <span v-if="index !=0">+</span>
                  <span class="stock-reason-plate-name">{{p.plate_name}}</span>
                  <span v-if="index == item.plates_reason.length-1 && reasonFilter(item.reason)"> |</span>
                </a>
                <div v-if="p.plate_id == 0"  class="stock-reason-plate" :key="p.plate_id" >
                  <span v-if="index !=0">+</span>
                  <span class="stock-reason-plate-name">{{p.plate_name}}</span>
                  <span v-if="index == item.plates_reason.length-1 && reasonFilter(item.reason)"> |</span>
                </div>
              </template>
              {{reasonFilter(item.reason)}}</span>
            </span>
          </td>
          <td :class="{'sort_target':'cur_price' == sortTarget}" target="cur_price"><span :class="color(item.px_change_rate)" >{{price(item.cur_price)}}</span></td>
          <td :class="{'sort_target':'px_change_rate' == sortTarget}"  target="px_change_rate" ><span :class="color(item.px_change_rate)">{{changeRate(item.px_change_rate)}}</span></td>
          <!-- <td :class="{'sort_target':'blockade_ratio' == sortTarget}" target="blockade_ratio">{{rate(item.blockade_ratio,1)}}</td> -->
          <td :class="{'sort_target':'turnover_ratio' == sortTarget}" target="turnover_ratio">{{percentage(item.turnover_ratio)}}</td>
          <td :class="{'sort_target':'circulation_value' == sortTarget}" target="circulation_value" >{{approxNumber(item.circulation_value)}}</td>
          <td :class="{'sort_target':'total_value' == sortTarget}" target="total_value">{{approxNumber(item.total_value)}}</td>
          <td :class="{'sort_target':'first_raise_time' == sortTarget}" target="first_raise_time" >{{timeFormatter(item.first_raise_time)}}</td>
          <td :class="{'sort_target':'last_raise_time' == sortTarget}" target="last_raise_time" >{{timeFormatter(item.last_raise_time)}}</td>
          <td :class="{'sort_target':'open_count' == sortTarget}" target="open_count">{{item.open_count}}</td>
          <td :class="{'sort_target':'continue_board_count' == sortTarget}" target="continue_board_count">{{item.continue_board_count}}</td>
        </tr>
    </tbody>
  </table>
  <div v-if="gifname && targetItem && showGif" :style="{'top':top+'px','left':left+'px'}"  class="img-div">
    <img :src="`http://image.sinajs.cn/newchart/min/n/${gifname}.gif`"/>
  </div>
</div>

</template>
<script>
/* eslint-disable */
import shareMethodMixin from '~/mixins/shareMethodMixin'
export default {
  props: ["stockList", "sortRule", "sortTarget","topFixed",'y','small'],
  mounted() {
    // console.log(this.stockList);
  },
  data(){
    return {
      top:0,
      left:0,
      gifname:null,
      targetItem:null,
      showGif:false
    }
  },
  methods: {
    startSort(targetProp) {
      let emitData = {
        sortRule: "",
        sortTarget: ""
      };
      if (this.sortTarget == targetProp) {
        if (this.sortRule == "desc") {
          emitData = {
            sortRule: "asc",
            sortTarget: targetProp
          };
        } else if (this.sortRule == "asc") {
          emitData = {
            sortRule: "default",
            sortTarget: targetProp
          };
        } else {
          emitData = {
            sortRule: "desc",
            sortTarget: targetProp
          };
        }
      } else {
        emitData = {
          sortRule: "desc",
          sortTarget: targetProp
        };
      }
      this.$emit("sort", emitData);
    },
    login(){
      //  $('.login-modal').addClass('is-active')
      // $('#register-radio-login').trigger('click')
    },
    hoverTitle(item,event){
      if(this.showGif && this.targetItem == item){
        return
      }else{
      this.top = this.getElementTop(event.target) - this.getPageScroll().y;
      this.left = this.getElementLeft(event.target) + 130
      // debugger
      this.targetItem = item
      this.gifname = this.hsCodeToWscn(item.symbol).toLowerCase()
      this.showGif = true
      }
    },
    leaveTitle(){
      this.targetItem = null
      this.gifname = null
      this.showGif = false
    },
    getSortStatus(t) {
      if (t == this.sortTarget) {
        return "icon-" + this.sortRule;
      } else {
        return "icon-default";
      }
    },
    reasonFilter(r){
      return (r.split('丨').length>1 || r.split('|').length>1)?(r.split('丨')[1]||r.split('|')[1]):r
    }
  },
  mixins: [shareMethodMixin]
};
</script>
<style lang="less" scoped>
@import "./pools.less";
</style>
<style lang="less">
@import "./poolDark.less";
</style>
