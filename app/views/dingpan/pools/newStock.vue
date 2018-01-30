<template>
<div class="table-container">
  <table v-if="topFixed" class="table hit-pool__table fixed">
    <colgroup>
     <col style="width: 4%">
      <col style="width: 12%">
      <col style="width: 9%">
      <col style="width: 9%">
      <col style="width: 9%">
      <col style="width: 9%">
      <col style="width: 8%">
      <col style="width: 8%">
      <col style="width: 8%">
      <col style="width: 8%">
      <col style="width: 8%">
      <col style="width: 8%">
    </colgroup>
    <thead class="hit-pool__table-head">
      <tr>
        <th ><abbr title="序号">序号</abbr></th>
        <th ><abbr title="股票名称">股票名称</abbr></th>
        <th :class="{'sort_target':'cur_price' == sortTarget}"  @click="startSort('cur_price')" target="cur_price" class="stock-sort"><abbr title="最新价">最新价</abbr><span class="icon"><i :class="getSortStatus('cur_price')" class="iconfont icon-paixumorenzhuangtai" ></i></span></th>
        <th :class="{'sort_target':'px_change_rate' == sortTarget}" @click="startSort('px_change_rate')"   target="px_change_rate" class="stock-sort"><abbr title="涨跌幅">涨跌幅</abbr><span class="icon"><i :class="getSortStatus('px_change_rate')" class="iconfont icon-paixumorenzhuangtai" ></i></span></th>
        <th :class="{'sort_target':'turnover_ratio' == sortTarget}" @click="startSort('turnover_ratio')" target="turnover_ratio" class="stock-sort"><abbr title="换手率">换手率</abbr><span class="icon"><i :class="getSortStatus('turnover_ratio')"  class="iconfont icon-paixumorenzhuangtai" ></i></span></th>
        <th :class="{'sort_target':'circulation_value' == sortTarget}" target="circulation_value" @click="startSort('circulation_value')" class="stock-sort"><abbr title="流通市值">流通市值</abbr><span class="icon"><i :class="getSortStatus('circulation_value')" class="iconfont icon-paixumorenzhuangtai" ></i></span></th>
        <th :class="{'sort_target':'total_value' == sortTarget}" @click="startSort('total_value')"  target="total_value" class="stock-sort"><abbr title="总市值">总市值</abbr><span class="icon"><i :class="getSortStatus('total_value')"  class="iconfont icon-paixumorenzhuangtai" ></i></span></th>
        <th :class="{'sort_target':'first_open_time' == sortTarget}" @click="startSort('first_open_time')"  target="first_open_time" class="stock-sort"><abbr title="首次开板">首次开板</abbr><span class="icon"><i :class="getSortStatus('first_open_time')"  class="iconfont icon-paixumorenzhuangtai" ></i></span></th>
        <th :class="{'sort_target':'before_open_count' == sortTarget}" @click="startSort('before_open_count')"  target="before_open_count" class="stock-sort stock-sort__big"><abbr title="开板前连板数">开板前</br>连板数</abbr><span class="icon"><i :class="getSortStatus('before_open_count')"  class="iconfont icon-paixumorenzhuangtai" ></i></span></th>
        <th :class="{'sort_target':'accumulated_pcp' == sortTarget}" @click="startSort('accumulated_pcp')"  target="accumulated_pcp" class="stock-sort"><abbr title="累计涨幅">累计涨幅</abbr><span class="icon"><i :class="getSortStatus('accumulated_pcp')"  class="iconfont icon-paixumorenzhuangtai" ></i></span></th>
        <th :class="{'sort_target':'time_on_market' == sortTarget}" @click="startSort('time_on_market')"  target="time_on_market" class="stock-sort"><abbr title="上市日期">上市日期</abbr><span class="icon"><i :class="getSortStatus('time_on_market')"  class="iconfont icon-paixumorenzhuangtai" ></i></span></th>
        <th :class="{'sort_target':'bool_open_board' == sortTarget}"  target="bool_open_board" class="stock-sort"><abbr title="所属行业">所属行业</abbr><span class="icon"><i :class="getSortStatus('bool_open_board')"  class="iconfont icon-paixumorenzhuangtai" ></i></span></th>
      </tr>
    </thead>
  </table>
  <table class="table hit-pool__table">
    <colgroup>
      <col style="width: 4%">
      <col style="width: 12%">
      <col style="width: 9%">
      <col style="width: 9%">
      <col style="width: 9%">
      <col style="width: 9%">
      <col style="width: 8%">
      <col style="width: 8%">
      <col style="width: 8%">
      <col style="width: 8%">
      <col style="width: 8%">
      <col style="width: 8%">
    </colgroup>
    <thead class="hit-pool__table-head">
      <tr>
        <th ><abbr title="序号">序号</abbr></th>
        <th ><abbr title="股票名称">股票名称</abbr></th>
        <th :class="{'sort_target':'cur_price' == sortTarget}" @click="startSort('cur_price')" target="cur_price" class="stock-sort"><abbr title="最新价">最新价</abbr><span class="icon"><i :class="getSortStatus('cur_price')" class="iconfont icon-paixumorenzhuangtai" ></i></span></th>
        <th :class="{'sort_target':'px_change_rate' == sortTarget}" @click="startSort('px_change_rate')"   target="px_change_rate" class="stock-sort"><abbr title="涨跌幅">涨跌幅</abbr><span class="icon"><i :class="getSortStatus('px_change_rate')" class="iconfont icon-paixumorenzhuangtai" ></i></span></th>
        <th :class="{'sort_target':'turnover_ratio' == sortTarget}" @click="startSort('turnover_ratio')" target="turnover_ratio" class="stock-sort"><abbr title="换手率">换手率</abbr><span class="icon"><i :class="getSortStatus('turnover_ratio')"  class="iconfont icon-paixumorenzhuangtai" ></i></span></th>
        <th :class="{'sort_target':'circulation_value' == sortTarget}" target="circulation_value" @click="startSort('circulation_value')" class="stock-sort"><abbr title="流通市值">流通市值</abbr><span class="icon"><i :class="getSortStatus('circulation_value')" class="iconfont icon-paixumorenzhuangtai" ></i></span></th>
        <th :class="{'sort_target':'total_value' == sortTarget}"  @click="startSort('total_value')"  target="total_value" class="stock-sort"><abbr title="总市值">总市值</abbr><span class="icon"><i :class="getSortStatus('total_value')"  class="iconfont icon-paixumorenzhuangtai" ></i></span></th>
        <th :class="{'sort_target':'first_open_time' == sortTarget}" @click="startSort('first_open_time')"  target="first_open_time" class="stock-sort"><abbr title="首次开板">首次开板</abbr><span class="icon"><i :class="getSortStatus('first_open_time')"  class="iconfont icon-paixumorenzhuangtai" ></i></span></th>
        <th :class="{'sort_target':'before_open_count' == sortTarget}" @click="startSort('before_open_count')"  target="before_open_count" class="stock-sort stock-sort__big"><abbr title="开板前连板数">开板前</br>连板数</abbr><span class="icon"><i :class="getSortStatus('before_open_count')"  class="iconfont icon-paixumorenzhuangtai" ></i></span></th>
        <th :class="{'sort_target':'accumulated_pcp' == sortTarget}" @click="startSort('accumulated_pcp')"  target="accumulated_pcp" class="stock-sort"><abbr title="累计涨幅">累计涨幅</abbr><span class="icon"><i :class="getSortStatus('accumulated_pcp')"  class="iconfont icon-paixumorenzhuangtai" ></i></span></th>
        <th :class="{'sort_target':'time_on_market' == sortTarget}" @click="startSort('time_on_market')"  target="time_on_market" class="stock-sort"><abbr title="上市日期">上市日期</abbr><span class="icon"><i :class="getSortStatus('time_on_market')"  class="iconfont icon-paixumorenzhuangtai" ></i></span></th>
        <th :class="{'sort_target':'bool_open_board' == sortTarget}"   target="bool_open_board" class="stock-sort"><abbr title="所属行业">所属行业</abbr><span class="icon"><i :class="getSortStatus('bool_open_board')"  class="iconfont icon-paixumorenzhuangtai" ></i></span></th>
      </tr>
    </thead>
    <tbody class="table hit-pool__table-body">
      <tr :key="item.symbol" v-for="item in stockList">
          <td  class="stock-index">{{item.index}}</td>
          <td @mouseleave="leaveTitle" @mouseover="hoverTitle(item, $event)" :target="item.symbol"  :class="newStockClass(item)" class="stock-title new-stock-title"><a target="_blank" :href="'/stock/'+item.symbol"><span class="stock-title-name">{{item.title}}</span><br/>{{symbolFilter(item.symbol)}}</a></td>
          <td :class="{'sort_target':'cur_price' == sortTarget}"  target="cur_price"><span :class="color(item.px_change_rate)">{{price(item.cur_price)}}</span></td>
          <td :class="{'sort_target':'px_change_rate' == sortTarget}" target="px_change_rate" ><span :class="color(item.px_change_rate)">{{changeRate(item.px_change_rate)}}</span></td>
          <td :class="{'sort_target':'turnover_ratio' == sortTarget}" target="turnover_ratio">{{percentage(item.turnover_ratio)}}</td>
          <td :class="{'sort_target':'circulation_value' == sortTarget}" target="circulation_value" >{{approxNumber(item.circulation_value)}}</td>
          <td :class="{'sort_target':'total_value' == sortTarget}" target="total_value">{{approxNumber(item.total_value)}}</td>
          <td :class="{'sort_target':'first_open_time' == sortTarget}" target="first_open_time"  >{{timeFormatter(item.first_open_time)}}</td>
          <td :class="{'sort_target':'before_open_count' == sortTarget}" target="before_open_count" >{{(item.before_open_count)}}</td>
          <td :class="{'sort_target':'accumulated_pcp' == sortTarget}"   target="before_open_count"><span :class="color(item.accumulated_pcp)">{{changeRate(item.accumulated_pcp)}}</span></td>
          <td :class="{'sort_target':'time_on_market' == sortTarget}" target="time_on_market">{{timeFormatter(item.time_on_market,'YYYY/MM/DD')}}</td>
          <td :class="{'sort_target':'continue_board_count' == sortTarget}" target="continue_board_count">——</td>
        </tr>
    </tbody>
  </table>
    <div v-if="gifname && targetItem && showGif" :style="{'top':top+'px','left':left+'px'}"  class="img-div"><img :src="`http://image.sinajs.cn/newchart/min/n/${gifname}.gif`"/>
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
