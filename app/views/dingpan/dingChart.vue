<template>
  <div  @mouseup="svgMouseUp" class="chart-container">
  <div class="chart">
    <div class="chart-title">
      <div class="chart-title-text"><span>异动分布</span>
      <poptip v-model="showScale" placement="bottom-start" >
        <div class="chart-title-text-sub">
          <div class="chart-title-text-round">
          </div>
          <span>图示说明</span>
        </div>
        <div class="option-container" slot="content">
          <div class="chart-scale">
            <div class="chart-scale-h">圆圈大小表示涨跌速度，圆越大，涨跌速越大</div>
            <div class="chart-scale-g">
              <div class="chart-scale-g-item">
                <div class="chart-scale-g-item-round-container">
                  <div class="chart-scale-100">
                  </div>
                </div>
                <div class="chart-scale-g-item-text">
                  涨跌速≥3%
                </div>
              </div>
              <div class="chart-scale-g-item">
                <div class="chart-scale-g-item-round-container">
                  <div class="chart-scale-64">
                  </div>
                </div>
                <div class="chart-scale-g-item-text">
                  2%≤涨跌速＜3%
                </div>
              </div>
              <div class="chart-scale-g-item">
                <div class="chart-scale-g-item-round-container">
                  <div class="chart-scale-32">
                  </div>
                </div>
                <div class="chart-scale-g-item-text">
                  1.5%≤涨跌速＜2%
                </div>
              </div>
              <div class="chart-scale-g-item">
                <div class="chart-scale-g-item-round-container">
                  <div class="chart-scale-16">
                  </div>
                </div>
                <div class="chart-scale-g-item-text">
                  1%≤涨跌速＜1.5%
                </div>
              </div>
            </div>
          </div>
        </div>
      </poptip>
      <div @click="showGuide" class="chart-title-text-sub"><i  class="iconfont chart-title-text-guide">&#xe668;</i><span >使用说明</span>
      </div>
      </div>
      <div class="chart-title-scale"><span class="chart-title-scale-text">涨速范围</span><span class="chart-title-scale-detail" v-if="selectScale[0] == -4 && selectScale[1]==4">{{chartScale}}</span>
      <span class="chart-title-scale-detail" v-if="selectScale[0] != -4 || selectScale[1]!=4"><span :class="color(selectScale[0])" class="chart-title-scale-detail-v1">{{selectScale[0]==-4?'跌停':(selectScale[0]+'%')}}</span>~<span :class="color(selectScale[1])" class="chart-title-scale-detail-v2">{{selectScale[1]==4?'涨停':(selectScale[1]+'%')}}</span></span>
      <div class="chart-title-scale-slider"><Slider :max="4" :min="-4" @on-input="changeSlider" v-model="selectScale" :step="1" show-stops show-tip="never" range/></div>
      </div>
    </div>
    <div class="svg-container" :style="{width:vWidth+'px',height:vHeight+'px'}" >
    <svg :class="{'zoomed':svgScale>1}" @mousedown="svgDragStart" @mousemove="svgMouseMove" @mouseup="svgMouseUp" @mouseleave="svgMouseUp" :style="{left:svgTransLeft+'px',top:svgTransTop+'px'}" @mousewheel="svgMouseWheel" xmlns="http://www.w3.org/2000/svg" class="chart-svg" ref='chartSvg' viewBox="0 0 10000 6000" :width="vWidth*svgScale" :height="vHeight*svgScale">
      <!-- <defs>
          <linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="MyGradient">-g
            <stop offset="0%" stop-color="rgb(20,120,240)" stop-opacity="0.2" />
            <stop offset="100%" stop-color="rgb(20,120,240)" stop-opacity="0.01"/>
        </linearGradient>
      </defs> -->
      <template v-if="yAxisLine && yAxisLine.length && xAxisLine && xAxisLine.length">
        <line :key="item.code" v-for="item in yAxisLine"
         :stroke-width="10/svgScale" :stroke="item.value==0?crossColorMain:crossColor" :x1="xPadding" :y1="item.yValue" :x2="xMax" :y2="item.yValue" />
        <line stroke-width="1" :stroke="crossColor" :x1="xPadding" :y1="yPadding" :x2="xPadding" :y2="yMax" />
        <line :key="item.code" v-for="item in xAxisLine" :stroke-width="10/svgScale" :stroke="item.label==1?crossColorMain:crossColor" :x1="item.xValue" :y1="yPadding" :x2="item.xValue" :y2="yMax" />
        <!-- <text :key="item.code" :fill="isDark?'#efefef':'#333'" v-for="item in xAxisLine" text-anchor="middle" :x="item.xValue" :y="yMax+100"  font-size="100">{{item.label}}</text> -->
        <polygon :opacity="item.opacity" v-for="item in xAxisLine" fill="#525566" :points="lbpoly(item)" />
        <text  fill="#999" text-anchor="end" :x="xMax-xDefinition*xDef.normal*1.2" :y="yMax+yPadding*.75"  font-size="100">量比</text>
        <text :key="item.code" :fill="item.value>0?colorRed:item.value<0?colorGreen:colorGray" v-for="item in yAxisLine" text-anchor="end" :x="xPadding" :y="item.yValue+45"  font-size="100">{{item.label}}</text>
        <!-- 坐标轴 -->
      </template>
      <template v-if="extraDegree && extraDegree.length">
        <text :key="item.value" :fill="item.value>0?colorRed:item.value<0?colorGreen:colorGray" v-for="item in extraDegree" text-anchor="start" :x="item.x" :y="item.yValue"  :font-size="100/svgScale*svgCircleScale">{{item.label}}</text>
        <!-- <polygon points="60,20 100,40 100,80 60,100 20,80 20,40"/> -->
      </template>
      <template v-if="points">
        <template  v-for="(item,key) in points">
          <g  v-if="Math.abs(item.pcr)<1.5 &&(!hoverStockList || !hoverStockList.length || hoverStockList.indexOf(key)==-1)" :id="item.code" class="stock-item" @mouseenter="enterCircle(item)" @mouseleave="leaveCircle(item)"  >
            <circle  class="stock-circle" :key="'circle'+item.code.split('.')[0]" :cx="item.x" :cy="item.y" :r="item.size/svgScale*svgCircleScale" :fill="stockFillColor(item)" :fill-opacity="item.hovered?1:item.opacity" />
            <text class="stock-text" v-if="!stockTextVisible(item)?false:(!hoverTheme  && !hoverRelatedThemeInfo.symbol)?(item.pcrIndex <20||item.size*svgCircleScale>150):stockTextVisible(item) " text-anchor="middle"  :key="'text'+item.code.split('.')[0]" fill="#fff" :x="item.x" :y="item.y+item.size/svgScale*svgCircleScale/6" :font-size="item.size*svgCircleScale>150?(item.size-5)/2/svgScale*svgCircleScale:100000/vWidth/svgScale">{{item.prod_name}}</text>
          </g>
        </template>
        <template  v-for="(item,key) in points">
          <g  v-if="Math.abs(item.pcr)<2 &&Math.abs(item.pcr)>=1.5 &&(!hoverStockList || !hoverStockList.length || hoverStockList.indexOf(key)==-1)" :id="item.code" class="stock-item" @mouseenter="enterCircle(item)" @mouseleave="leaveCircle(item)"  >
            <circle  class="stock-circle" :key="'circle'+item.code.split('.')[0]" :cx="item.x" :cy="item.y" :r="item.size/svgScale*svgCircleScale" :fill="stockFillColor(item)" :fill-opacity="item.hovered?1:item.opacity" />
            <text class="stock-text" v-if="!stockTextVisible(item)?false:(!hoverTheme  && !hoverRelatedThemeInfo.symbol)?(item.pcrIndex <20||item.size*svgCircleScale>150):stockTextVisible(item)" text-anchor="middle"  :key="'text'+item.code.split('.')[0]" fill="#fff" :x="item.x" :y="item.y+item.size/svgScale*svgCircleScale/6" :font-size="item.size*svgCircleScale>150?(item.size-5)/2/svgScale*svgCircleScale:100000/vWidth/svgScale">{{item.prod_name}}</text>
          </g>
        </template>
        <template  v-for="(item,key) in points">
          <g  v-if="Math.abs(item.pcr)>=2 &&Math.abs(item.pcr)<3 &&(!hoverStockList || !hoverStockList.length || hoverStockList.indexOf(key)==-1)" :id="item.code" class="stock-item" @mouseenter="enterCircle(item)" @mouseleave="leaveCircle(item)"  >
            <circle  class="stock-circle" :key="'circle'+item.code.split('.')[0]" :cx="item.x" :cy="item.y" :r="item.size/svgScale*svgCircleScale" :fill="stockFillColor(item)" :fill-opacity="item.hovered?1:item.opacity" />
            <text class="stock-text"  text-anchor="middle"  :key="'text'+item.code.split('.')[0]" fill="#fff" :x="item.x" v-if="stockTextVisible(item)" :y="item.y+item.size/svgScale*svgCircleScale /6" :font-size="item.fontsize/svgScale*svgCircleScale">{{item.prod_name}}</text>
          </g>
        </template>
        <template  v-for="(item,key) in points">
          <g  v-if="Math.abs(item.pcr)>=3&&(!hoverStockList || !hoverStockList.length || hoverStockList.indexOf(key)==-1)" :id="item.code" class="stock-item" @mouseenter="enterCircle(item)" @mouseleave="leaveCircle(item)"  >
            <circle  class="stock-circle" :key="'circle'+item.code.split('.')[0]" :cx="item.x" :cy="item.y" :r="item.size/svgScale*svgCircleScale" :fill="stockFillColor(item)" :fill-opacity="item.hovered?1:item.opacity" />
            <text class="stock-text" v-if="stockTextVisible(item) &&  item.size>200" text-anchor="middle"  :key="'text'+item.code.split('.')[0]" fill="#fff"  :x="item.x" :y="item.y+item.size/svgScale*svgCircleScale/6" :font-size="item.fontsize/svgScale*svgCircleScale">{{item.prod_name}}</text>
          </g>
        </template>
        <template  v-for="(item,key) in points">
          <g v-if="hoverStockList && hoverStockList.length && hoverStockList.indexOf(key)!=-1" class="stock-item">
          <circle  class="stock-circle" :key="'hcircle'+item.code.split('.')[0]" :cx="item.x" :cy="item.y" :r="item.size/svgScale*svgCircleScale" :fill="item.color" :fill-opacity="item.opacity" />
          <text class="stock-text" text-anchor="middle"  :key="'text'+item.code.split('.')[0]" fill="#fff" :x="item.x" :y="item.y+item.size/svgScale*svgCircleScale/6" :font-size="item.size*svgCircleScale>150?item.fontsize/svgScale*svgCircleScale:100000/vWidth/svgScale">{{item.prod_name}}</text>
        </g>
        </template>
      </template>
      <template v-if="stockCountList">
        <g :key="index" v-for="(item,index) in stockCountList">
          <polygon opacity="0.5" :fill="item.index<12?colorRed:item.index==12?colorGray:colorGreen" :points="item.polyStr" />
          <text text-anchor="start" opacity="0.5" :fill="item.index<12?colorRed:item.index==12?colorGray:colorGreen" :x="item.textOrigin.x" :y="item.textOrigin.y" font-size="100">
            <tspan v-if="index == 0">涨停 </tspan>
            <tspan v-if="index == 1">ST涨停 </tspan>
            <tspan v-if="index == 23">ST跌停 </tspan>
            <tspan v-if="index == 24">跌停 </tspan>{{item.value}}家</text>
        </g>
      </template>
      <g v-if="selectedStock">
        <polygon :fill="isDark?'#3F4352':'#fff'" :points="tipPos(selectedStock)" />
        <text class="stock-text"  text-anchor="start" :fill="isDark?'#ffffff':'#333'" :x="(tipOrigin(selectedStock).x +100/svgScale)" :y="(tipOrigin(selectedStock).y +(180+100)/svgScale)" :font-size="160/svgScale">{{selectedStock.prod_name}}</text>
        <text class="stock-text"  text-anchor="start" :fill="isDark?'#999999':'#666'" :x="tipOrigin(selectedStock).x +(100)/svgScale" :y="tipOrigin(selectedStock).y +(180+100 +160)/svgScale" :font-size="120/svgScale">{{selectedStock.code |codeFilter}}</text>
        <text class="stock-text"  text-anchor="start" :fill="isDark?'#999999':'#666'" :x="tipOrigin(selectedStock).x +(100)/svgScale" :y="tipOrigin(selectedStock).y +(180+100 +160+160)/svgScale" :font-size="120/svgScale">涨速 <tspan :fill="colorStr(selectedStock.pcr)">{{changeRate(selectedStock.pcr)}}</tspan></text>
        <text class="stock-text"  text-anchor="end" fill="#666" :x="tipOrigin(selectedStock).x +(2*xDefinition*xDef.normal -100)/svgScale" :y="tipOrigin(selectedStock).y +(180+100)/svgScale" :font-size="160/svgScale"><tspan :fill="colorStr(selectedStock.pcp)">{{price(selectedStock.last_px)}}</tspan></text>
        <text class="stock-text"  text-anchor="end" fill="#666" :x="tipOrigin(selectedStock).x +(2*xDefinition*xDef.normal -100)/svgScale" :y="tipOrigin(selectedStock).y +(180+100 +160)/svgScale" :font-size="120/svgScale"><tspan :fill="colorStr(selectedStock.pcp)">{{changeRate(selectedStock.pcp)}}</tspan></text>
        <template v-if="selectedStock && stockLine && stockLine.length && shadowPolygon&& shadowPolygon.length && lastStockDot && lastStockDot.length == 2">
          <polyline  class="path" fill="none" stroke=" #1478F0" :stroke-width="10/svgScale" :points="stockLine" />
          <!-- <polygon  class="polyline-shadow" fill="url(#MyGradient)" :points="shadowPolygon" /> -->
          <circle  :cx="lastStockDot[0]" :cy="lastStockDot[1]" :r="100/svgScale" fill="#1B6ED3" fill-opacity="0.2" />
          <circle  :cx="lastStockDot[0]" :cy="lastStockDot[1]" :r="50/svgScale" fill="#1B6ED3" fill-opacity="1" />
        </template>
      </g>
      <template v-if="hoverStockList && hoverStockList.length">
        <g :key="code" v-for="(code,index) in hoverStockList.slice(0,5)">
          <template v-if="points[code]">
          <polygon :fill="isDark?'#3F4352':'#fff'" :points="themeTipPos(index)" />
          <text class="stock-text"  text-anchor="start" :fill="isDark?'#ffffff':'#333'" :x="themeTipOrigin(index).x +(100)/svgScale" :y="themeTipOrigin(index).y +(180+100)/svgScale" :font-size="160/svgScale">{{points[code].prod_name}}</text>
          <text class="stock-text"  text-anchor="start" :fill="isDark?'#999999':'#666'" :x="themeTipOrigin(index).x +(100)/svgScale" :y="themeTipOrigin(index).y +(180+100 +160)/svgScale" :font-size="120/svgScale">{{points[code].code |codeFilter}}</text>
          <text class="stock-text"  text-anchor="start" :fill="isDark?'#999999':'#666'" :x="themeTipOrigin(index).x +(100)/svgScale" :y="themeTipOrigin(index).y +(180+100 +160+160)/svgScale" :font-size="120/svgScale">涨速 <tspan :fill="colorStr(points[code].pcr)">{{changeRate(points[code].pcr)}}</tspan></text>
          <text class="stock-text"  text-anchor="end" fill="#666" :x="themeTipOrigin(index).x +(2*xDefinition*xDef.normal -100)/svgScale" :y="themeTipOrigin(index).y +(180+100)/svgScale" :font-size="160/svgScale"><tspan :fill="colorStr(points[code].pcp)">{{price(points[code].last_px)}}</tspan></text>
          <text class="stock-text"  text-anchor="end" fill="#666" :x="themeTipOrigin(index).x +(2*xDefinition*xDef.normal -100)/svgScale" :y="themeTipOrigin(index).y +(180+100 +160)/svgScale" :font-size="120/svgScale"><tspan :fill="colorStr(points[code].pcp)">{{changeRate(points[code].pcp)}}</tspan></text>
          <template v-if="points[code] &&  stockTrendList &&  stockTrendList[code] && stockTrendList[code].stockLine && stockTrendList[code].shadowPolygon&& stockTrendList[code].shadowPolygon.length && stockTrendList[code].lastStockDot && stockTrendList[code].lastStockDot.length == 2">
            <polyline  class="path" fill="none" stroke=" #1478F0" :stroke-width="10/svgScale" :points="stockTrendList[code].stockLine" />
            <!-- <polygon  class="polyline-shadow" fill="url(#MyGradient)" :points="stockTrendList[code].shadowPolygon" /> -->
            <circle  :cx="stockTrendList[code].lastStockDot[0]" :cy="stockTrendList[code].lastStockDot[1]" :r="100/svgScale" fill="#1B6ED3" fill-opacity="0.2" />
            <circle  :cx="stockTrendList[code].lastStockDot[0]" :cy="stockTrendList[code].lastStockDot[1]" :r="50/svgScale" fill="#1B6ED3" fill-opacity="1" />
          </template>
          </template>
        </g>
      </template>
    </svg>
    </div>
  </div>

  <div v-if="selectedStock && hoverRelatedThemeInfo.symbol == lastEnter" class="related-theme">
    <div  class="related-theme-title">相关板块<template v-if="hoverRelatedThemeInfo.list && hoverRelatedThemeInfo.list.length">({{hoverRelatedThemeInfo.list.length}})</template></div>
      <dot-spinner  v-if="hoverRelatedThemeInfo.list && hoverRelatedThemeInfo.list.length == 0"/>
      <p class="related-theme-zero" v-if="!hoverRelatedThemeInfo.list">暂无</p>
      <template v-if="hoverRelatedThemeInfo.list && hoverRelatedThemeInfo.list.length">
        <div v-for="item in hoverRelatedThemeInfo.list" >
          <div v-if="!inrelatedTheme(item)" :class="color(item.pcp_core)" class="related-theme-item">
            <p  class="related-theme-item-name">{{item.plate_name}}</p>
            <p  class="related-theme-item-rate">{{changeRate(item.pcp_core)}}</p>
          </div>
          <div v-if="inrelatedTheme(item)" :class="color(item.pcp_core)" class="related-theme-item related" >
            <p  class="related-theme-item-name">{{item.plate_name}}</p>
            <p  class="related-theme-item-rate">{{changeRate(item.pcp_core)}}</p>
          </div>
        </div>
    </template>
    </div>
  <div v-else :class="{'dark':isDark}" :style="{'height':vHeight+'px'}" class="chart-theme">
    <div class="chart-theme-title uptheme">涨速板块({{relatedTheme.up.length}})</div>
    <template v-if="relatedTheme && relatedTheme.up && relatedTheme.up.length">
      <div @mouseenter="themeEnter(item,true)" @mouseleave="themeLeave"  :class="color(item.pcp_core)" class="chart-theme-item" v-for="item in relatedTheme.up" >
        <p class="chart-theme-item-name">{{item.plate_name}}</p>
        <div  class="chart-theme-item-stocks-container" v-if="item && item.stocks && item.stocks.length">
          <div :class="color(stock.pcr)" :key="stock.code" v-for="stock in item.stocks.slice(0,2)" class="chart-theme-item-stocks">
            <p class="chart-theme-item-stocks-name" v-if="stock">{{stock.symbol}}</p><p class="chart-theme-item-stocks-rate">{{changeRate(stock.pcr)}}</p>
            <img class="chart-theme-item-stocks-img" src="/img/rise.png" v-if="stock.pcr>0 && (!hoverTheme ||hoverTheme.plate_id!=item.plate_id)"/>
            <img class="chart-theme-item-stocks-img" src="/img/down.png" v-if="stock.pcr<0 && (!hoverTheme || hoverTheme.plate_id!=item.plate_id)"/>
            <img class="chart-theme-item-stocks-img" src="/img/rise_hover.png" v-if="stock.pcr>0 && hoverTheme && hoverTheme.plate_id==item.plate_id"/>
            <img class="chart-theme-item-stocks-img" src="/img/down_hover.png" v-if="stock.pcr<0 && hoverTheme && hoverTheme.plate_id==item.plate_id"/>
          </div>
        </div>

      </div>
    </template>
    <div class="chart-theme-title downtheme">跌速板块({{relatedTheme.down.length}})</div>
    <template v-if="relatedTheme && relatedTheme.down && relatedTheme.down.length">
      <div @mouseenter="themeEnter(item,false)" @mouseleave="themeLeave"  :class="color(item.pcp_core)" class="chart-theme-item" v-for="item in relatedTheme.down" >
        <p class="chart-theme-item-name">{{item.plate_name}}</p>
        <div class="chart-theme-item-stocks-container" v-if="item && item.stocks && item.stocks.length">
          <div :class="color(stock.pcr)" :key="stock.code" v-for="stock in item.stocks.slice(0,2)" class="chart-theme-item-stocks">
            <p class="chart-theme-item-stocks-name" v-if="stock">{{stock.symbol}}</p><p class="chart-theme-item-stocks-rate">{{changeRate(stock.pcr)}}</p>
            <img class="chart-theme-item-stocks-img" src="/img/rise.png" v-if="stock.pcr>0 && (!hoverTheme ||hoverTheme.plate_id!=item.plate_id)"/>
            <img class="chart-theme-item-stocks-img" src="/img/down.png" v-if="stock.pcr<0 && (!hoverTheme || hoverTheme.plate_id!=item.plate_id)"/>
            <img class="chart-theme-item-stocks-img" src="/img/rise_hover.png" v-if="stock.pcr>0 && hoverTheme && hoverTheme.plate_id==item.plate_id"/>
            <img class="chart-theme-item-stocks-img" src="/img/down_hover.png" v-if="stock.pcr<0 && hoverTheme && hoverTheme.plate_id==item.plate_id"/>
          </div>
        </div>
      </div>
    </template>

  </div>
  </div>
</template>

<script>
/* eslint-disable */
import shareMethodMixin from '~/mixins/shareMethodMixin'
import { transit } from "~/utils/transit";
import { fetchStockTrend, fetchThemeInfo, fetchRelatedTheme } from "~/api/theme";
import dotSpinner from "./dotSpinner.vue";
// import Split from "split.js";
export default {
  mounted() {
    this.init();
  },
  props: {
    vWidth: {
      type: Number,
      default: 1000
    },
    vHeight: {
      type: Number,
      default: 600
    },
    dataList: {
      type: Array,
      default: []
    },
    fluctuation: {
      type: Array,
      default: []
    },
    isDark: {
      type: Boolean,
      default: false
    },
    themePcr: {
      type: Array
    },
    themeMap: {
      type: Object
    }
  },
  data() {
    return {
      width: 10000,
      height: 6000,
      svgScale: 1,
      svgWheelStop: 1.5,
      svgTransTop: 0,
      svgTransLeft: 0,
      dragStarted: false,
      dragState: {
        x: 0,
        y: 0
      },
      selectScale: [-4, 4],
      lastScale: null,
      transitDuration: 700,
      xPadding: 300,
      yPadding: 250,
      colorRed: "#F2564E",
      colorGreen: "#18A66B",
      colorGray: "rgba(153, 153, 153, 1)",
      crossColor: "#303340",
      crossColorMain: "#353a47",
      yDef: {
        big: 5,
        normal: 4,
        small: 3
      },
      xDef: {
        big: 2,
        normal: 1
      },
      yAxisLabel: [
        {
          label: "10%",
          type: "big",
          value: 0.1
        },
        {
          label: "8%",
          type: "normal",
          value: 0.08
        },
        {
          label: "6%",
          type: "normal",
          value: 0.06
        },
        {
          label: "4%",
          type: "normal",
          value: 0.04
        },
        // {
        //   label: '2%',
        //   type: 'normal',
        // },
        {
          label: "2%",
          type: "normal",
          value: 0.02
        },
        {
          label: "0%",
          type: "normal",
          value: 0
        },
        {
          label: "-2%",
          type: "normal",
          value: -0.02
        },
        {
          label: "-4%",
          type: "normal",
          value: -0.04
        },
        {
          label: "-6%",
          type: "normal",
          value: -0.06
        },
        {
          label: "-8%",
          type: "normal",
          value: -0.08
        },
        // {
        //   label: '-9%',
        //   type: 'normal',
        // },
        {
          label: "-10%",
          type: "normal",
          value: -0.1
        }
      ],
      xAxisLabel: [
        {
          label: 0.25,
          height: 1,
          opacity: 0.5,
          type: "big"
        },
        {
          label: 0.5,
          height: 2,
          opacity: 0.5,
          type: "normal"
        },
        {
          label: 0.75,
          opacity: 0.5,
          height: 3,
          type: "normal"
        },
        {
          label: 1,
          opacity: 0.5,
          height: 4,
          type: "normal"
        },
        {
          label: 1.33,
          height: 5,
          opacity: 0.8,
          type: "normal"
        },
        {
          label: 2,
          opacity: 0.8,
          height: 6,
          type: "normal"
        },
        {
          label: 4,
          height: 7,
          opacity: 1,
          type: "normal"
        }
      ],
      yAxisLine: null,
      extraDegree: [],
      xAxisLine: null,
      xsep: null,
      ySep: null,
      xDefinition: null,
      YDefinition: null,
      // pointList: [],
      points: {},
      newDataList: [],
      stockCountList: [],
      stockCountMax: 1000,
      stockCountHeightDef: 0.2,
      selectedStock: null,
      filterDataList: [],
      visiDataCode: [],
      lastEnter: null,
      stockTrend: [],
      stockTrendList: {},
      stockLine: null,
      themeStockLine: null,
      shadowPolygon: null,
      lastStockDot: null,
      relatedTheme: {
        up: [],
        down: []
      },
      hoverTheme: null,
      hoverStockList: null,
      hoverRelatedThemeInfo: {
        symbol: null,
        list: [],
        stockList: []
      },
      showScale: false
    };
  },
  mixins: [shareMethodMixin],
  computed: {
    chartScale() {
      if (this.selectScale[0] == -4 && this.selectScale[1] == 4) {
        return "全部";
      } else {
        return (
          (this.selectScale[0] == -4 ? "跌停" : this.selectScale[0] + "%") +
          "~" +
          (this.selectScale[1] == 4 ? "涨停" : this.selectScale[1] + "%")
        );
      }
    },
    svgCircleScale() {
      return (this.svgScale - 1) / 3 + 1;
    }
    // yAxisLine(){
    // }
  },
  watch: {
    dataList(val, oldValue) {
      // this.pointList = []
      if (!this.xDefinition) {
        this.getAxisLine().then(res => {
          if (this.hoverTheme || this.selectedStock) {
            return;
          }
          if (this.dataList && this.dataList.length) {
            this.filterDataList = this.filt(this.dataList);
          }
        });
      } else {
        if (this.hoverTheme || this.selectedStock) {
          return;
        }
        if (this.dataList && this.dataList.length) {
          this.filterDataList = this.filt(this.dataList);
        }
      }
    },
    filterDataList(val, oldValue) {
      this.visiDataCode = val.map(i => i.code.split(".")[0]);
      if (this.themePcr && this.themePcr.length) {
        let upThemeList = this.themePcr.filter(i => {
          return i.stocks && i.stocks.length && i.stocks[0].pcr > 0;
        });
        let downThemeList = this.themePcr.filter(i => {
          return i.stocks && i.stocks.length && i.stocks[0].pcr < 0;
        });
        this.getThemeSummary(upThemeList, downThemeList);
      } else {
        let upThemeList = [];
        let downThemeList = [];
        this.getThemeSummary(upThemeList, downThemeList);
      }
      this.newDataList = [];
      let updateList = val.filter(item => {
        let code = item.code.split(".")[0];
        this.newDataList.push(code);
        return this.points[code];
      });
      let newList = val.filter(item => {
        let code = item.code.split(".")[0];
        return !this.points[code];
      });
      let removeList = [];
      oldValue.map(item => {
        let code = item.code.split(".")[0];
        if (this.newDataList.indexOf(code) == -1) {
          removeList.push(this.points[code]);
        }
      });
      // console.log({
      //   old: oldValue,
      //   new: val,
      //   update: updateList,
      //   newlist: newList,
      //   remove: removeList
      // });
      transit(
        t => {
          this.drawCircle(newList, t);
          this.updateCircle(updateList, t);
          this.removeCircle(removeList, t);
        },
        this.transitDuration
      );
    },
    fluctuation(val, oldValue) {
      //值是从负到正
      this.stockCountList = val.map((v, index) => {
        let width =
          v /
          this.stockCountMax *
          (this.xDef.big - this.xDef.normal) *
          this.xDefinition;
        let originPointy = Math.floor(
          this.yPadding +
            this.yDefinition * (this.yDef.big - this.yDef.normal) +
            index * this.yDefinition * this.yDef.normal / 2
        );
        let polyStr = `${this.xPadding} ${originPointy -
          Math.floor(
            this.stockCountHeightDef * this.yDef.normal * this.yDefinition / 2
          )},${this.xPadding + width} ${originPointy -
          Math.floor(
            this.stockCountHeightDef * this.yDef.normal * this.yDefinition / 2
          )},${this.xPadding + width} ${originPointy +
          Math.floor(
            this.stockCountHeightDef * this.yDef.normal * this.yDefinition / 2
          )},${this.xPadding} ${originPointy +
          Math.floor(
            this.stockCountHeightDef * this.yDef.normal * this.yDefinition / 2
          )}`;
        let textOrigin = {
          x: this.xPadding + width + 100,
          y: originPointy + 40
        };
        return {
          value: v,
          index: index,
          width: width,
          origin: originPointy,
          polyStr: polyStr,
          textOrigin: textOrigin
        };
      });
      // console.log(this.stockCountList)
    }
  },

  methods: {
    resize() {
      this.getAxisLine();
    },
    svgMouseWheel(e) {
      e.stopPropagation();
      e.preventDefault();

      // console.log(e.offsetY);
      if (e.wheelDelta > 0) {
        if (this.svgScale < 12) {
          let oldScale = this.svgScale;
          let oldTransTop = this.svgTransTop;
          let oldTransLeft = this.svgTransLeft;
          this.svgScale =
            this.svgScale * this.svgWheelStop < 12
              ? this.svgScale * this.svgWheelStop
              : 12;

          //offsetY是膨胀后的值 像素值

          e.offsetY;

          this.svgTransTop =
            e.offsetY + oldTransTop - e.offsetY / oldScale * this.svgScale;
          this.svgTransLeft =
            e.offsetX + oldTransLeft - e.offsetX / oldScale * this.svgScale;
        }
      } else {
        if (this.svgScale > 1) {
          let oldScale = this.svgScale;
          let oldTransTop = this.svgTransTop;
          let oldTransLeft = this.svgTransLeft;
          this.svgScale =
            this.svgScale / this.svgWheelStop > 1
              ? this.svgScale / this.svgWheelStop
              : 1;
          this.svgTransTop =
            e.offsetY + oldTransTop - e.offsetY / oldScale * this.svgScale;
          if (this.svgTransTop > 0) {
            this.svgTransTop = 0;
          }
          if (this.svgTransTop < this.vHeight - this.vHeight * this.svgScale) {
            this.svgTransTop = this.vHeight - this.vHeight * this.svgScale;
          }
          this.svgTransLeft =
            e.offsetX + oldTransLeft - e.offsetX / oldScale * this.svgScale;
          if (this.svgTransLeft > 0) {
            this.svgTransLeft = 0;
          }
          if (this.svgTransLeft < this.vWidth - this.vWidth * this.svgScale) {
            this.svgTransLeft = this.vWidth - this.vWidth * this.svgScale;
          }
        }
      }
      this.renderExtraDegree();
    },
    svgDragStart(e) {
      this.dragStarted = true;
      if (e.touches) {
        this.dragState.x = e.touches[0].clientX;
        this.dragState.y = e.touches[0].clientY;
      } else {
        this.dragState.x = e.clientX;
        this.dragState.y = e.clientY;
      }
    },
    lbpoly(item) {
      return `${item.xValue - 30} ${this.yMax + this.yPadding},${item.xValue +
        30} ${this.yMax + this.yPadding},${item.xValue + 30} ${this.yMax +
        this.yPadding -
        0.1 * item.height * this.yPadding},${item.xValue - 30} ${this.yMax +
        this.yPadding -
        0.1 * item.height * this.yPadding}`;
    },
    inrelatedTheme(theme) {
      if (this.relatedTheme.up.length || this.relatedTheme.down.length) {
        if (this.relatedTheme.up.length) {
          if (
            this.relatedTheme.up.some(i => {
              return i.plate_id == theme.plate_id;
            })
          ) {
            return true;
          }
        }
        if (this.relatedTheme.down.length) {
          if (
            this.relatedTheme.down.some(i => {
              return i.plate_id == theme.plate_id;
            })
          ) {
            return true;
          }
        }
        return false;
      } else {
        return false;
      }
    },
    svgMouseMove(e) {
      if (!this.dragStarted) return;
      let targetY, targetX;
      if (e.touches) {
        targetX = e.touches[0].clientX - this.dragState.x;
        targetY = e.touches[0].clientY - this.dragState.y;
        this.dragState.x = e.touches[0].clientX;
        this.dragState.y = e.touches[0].clientY;
      } else {
        targetX = e.clientX - this.dragState.x;
        targetY = e.clientY - this.dragState.y;
        this.dragState.x = e.clientX;
        this.dragState.y = e.clientY;
      }
      this.svgTransLeft =
        this.svgTransLeft + targetX < 0
          ? -this.svgTransLeft - targetX + this.vWidth >
            this.vWidth * this.svgScale
            ? this.vWidth - this.vWidth * this.svgScale
            : this.svgTransLeft + targetX
          : 0;
      this.svgTransTop =
        this.svgTransTop + targetY < 0
          ? -this.svgTransTop - targetY + this.vHeight >
            this.vHeight * this.svgScale
            ? this.vHeight - this.vHeight * this.svgScale
            : this.svgTransTop + targetY
          : 0;
      this.renderExtraDegree();
      // console.log(targetX, targetY);
    },
    svgMouseUp() {
      this.dragStarted = false;
    },
    init() {
      this.filterDataList = this.filt(this.dataList);
      this.getAxisLine().then(res => {
        // this.pointList = []
        // this.dataList.map(item => {
        transit(
          t => {
            this.drawCircle(this.filt(this.dataList), t);
          },
          this.transitDuration
        );
        // })
        // console.log($)
        this.$nextTick(() => {
          let stops = document.getElementsByClassName("ivu-slider-stop");
          let slideBtn = document.getElementsByClassName("ivu-slider-button");
          this.setStopColor(stops, slideBtn);
        });
      });
      if (this.fluctuation) {
        this.stockCountList = [];
        this.stockCountList = this.fluctuation.map((v, index) => {
          let width =
            v /
            this.stockCountMax *
            (this.xDef.big - this.xDef.normal) *
            this.xDefinition;
          let originPointy = Math.floor(
            this.yPadding +
              this.yDefinition * (this.yDef.big - this.yDef.normal) +
              index * this.yDefinition * this.yDef.normal / 2
          );
          let polyStr = `${this.xPadding} ${originPointy -
            Math.floor(
              this.stockCountHeightDef * this.yDef.normal * this.yDefinition / 2
            )},${this.xPadding + width} ${originPointy -
            Math.floor(
              this.stockCountHeightDef * this.yDef.normal * this.yDefinition / 2
            )},${this.xPadding + width} ${originPointy +
            Math.floor(
              this.stockCountHeightDef * this.yDef.normal * this.yDefinition / 2
            )},${this.xPadding} ${originPointy +
            Math.floor(
              this.stockCountHeightDef * this.yDef.normal * this.yDefinition / 2
            )}`;
          let textOrigin = {
            x: this.xPadding + width + 100,
            y: originPointy + 40
          };
          return {
            value: v,
            index: index,
            width: width,
            origin: originPointy,
            polyStr: polyStr,
            textOrigin: textOrigin
          };
        });

        if (this.themePcr && this.themePcr.length) {
          let upThemeList = this.themePcr.filter(i => {
            return i.stocks && i.stocks.length && i.stocks[0].pcr > 0;
          });
          let downThemeList = this.themePcr.filter(i => {
            return i.stocks && i.stocks.length && i.stocks[0].pcr < 0;
          });
          this.getThemeSummary(upThemeList, downThemeList);
        } else {
          let upThemeList = [];
          let downThemeList = [];
          upThemeList = [
            {
              plate_id: 18926110,
              plate_name: "天然气",
              pcp_normal: 2.668484004629329,
              pcp_core: 2.668484004629329,
              stocks: [
                {
                  code: "600333.SS",
                  symbol: "长春燃气",
                  pcr: 1.5978695073235683,
                  last_px: 7.63,
                  pcp: 7.313642756680725
                },
                {
                  code: "000669.SZ",
                  symbol: "金鸿控股",
                  pcr: 1.2337217272104128,
                  last_px: 14.77,
                  pcp: 5.12455516014234
                },
                {
                  code: "600635.SS",
                  symbol: "大众公用",
                  pcr: 1.217038539553772,
                  last_px: 4.99,
                  pcp: 4.175365344467645
                }
              ]
            }
          ];
          this.getThemeSummary(upThemeList, downThemeList);
        }
      }
    },
    filt(dataList) {
      return dataList
        .filter(i => {
          let min = this.selectScale[0] == -4 ? -11 : this.selectScale[0];
          let max = this.selectScale[1] == 4 ? 11 : this.selectScale[1];
          return i.pcr >= min && i.pcr <= max;
        })
        .sort((a, b) => {
          return Math.abs(b.pcr) - Math.abs(a.pcr);
        })
        .map((item, index) => {
          item.pcrIndex = index;
          return item;
        });
    },
    getThemeSummary(up, down) {
      this.relatedTheme.up = up.sort((a, b) => {
        return b.stocks[0].pcr - a.stocks[0].pcr;
      });
      this.relatedTheme.down = down.sort((a, b) => {
        return a.stocks[0].pcr - b.stocks[0].pcr;
      });
      // let upId = up.sort((a, b) => b.pcp_core - a.pcp_core).map(i => i.plate_id);
      // let downId = down
      //   .sort((a, b) => b.pcp_core - a.pcp_core)
      //   .map(i => i.plate_id);
      // // console.log(upId,downId)

      // fetchThemeInfo(upId.concat(downId).join(",")).then(res => {
      //   debugger
      //   let bkjs = extractBkjsDetail(res.data.data);
      //   // console.log(bkjs);
      //   let themeList = [];
      //   for (let prop in bkjs) {
      //     if (bkjs.hasOwnProperty(prop)) {
      //       themeList.push(Object.assign({ id: prop }, bkjs[prop]));
      //     }
      //   }
      //   this.relatedTheme.up = [];
      //   this.relatedTheme.down = [];
      //   up.map(item => {
      //     if (bkjs.hasOwnProperty(item.plate_id)) {
      //       this.relatedTheme.up.push(
      //         Object.assign({ id: item.plate_id }, bkjs[item.id])
      //       );
      //     }
      //   });
      //   down.map(item => {
      //     if (bkjs.hasOwnProperty(item.plate_id)) {
      //       this.relatedTheme.down.push(
      //         Object.assign({ id: item.plate_id}, bkjs[item.id])
      //       );
      //     }
      //   });
      // });
    },
    tipPos(item) {
      //规则 暂定tip大小：宽度2*xDefinition*xDef.normal 高度 2.5*yDefinition*yDef.normal
      //下面4个值是当前可视区域的范围
      let xMin, xMax, yMin, yMax;

      xMin = -this.svgTransLeft / this.svgScale * this.width / this.vWidth;
      yMin = -this.svgTransTop / this.svgScale * this.height / this.vHeight;
      xMax =
        -this.svgTransLeft / this.svgScale * this.width / this.vWidth +
        this.width / this.svgScale;
      yMax =
        -this.svgTransTop / this.svgScale * this.height / this.vHeight +
        this.height / this.svgScale;

      let tipWidth = 2 * this.xDefinition * this.xDef.normal / this.svgScale;
      let tipHeight = 2.5 * this.yDefinition * this.yDef.normal / this.svgScale;
      let dotR = item.size / this.svgScale * this.svgCircleScale;
      let tipMargin = 100 / this.svgScale;
      //点的半径 item.size/this.svgScale*this.svgCircleScale
      if (item.y + dotR + tipMargin + tipHeight < yMax) {
        //在下面显示

        if (item.x - dotR - tipWidth / 2 - tipMargin < xMin) {
          //如果贴着左边边缘 在右下方
          return `${item.x + dotR + tipMargin} ${item.y +
            dotR +
            tipMargin},${item.x + dotR + tipWidth + tipMargin} ${item.y +
            dotR +
            tipMargin},${item.x + dotR + tipWidth + tipMargin} ${item.y +
            dotR +
            tipMargin +
            tipHeight},${item.x + dotR + tipMargin} ${item.y +
            dotR +
            tipMargin +
            tipHeight}`;
        } else if (item.x + dotR + tipWidth / 2 + tipMargin > xMax) {
          //如果贴着右边边缘 在左下方
          return `${item.x - dotR - tipWidth - tipMargin} ${item.y +
            dotR +
            tipMargin},${item.x - dotR - tipMargin} ${item.y +
            dotR +
            tipMargin},${item.x - dotR - tipMargin} ${item.y +
            dotR +
            tipMargin +
            tipHeight},${item.x - dotR - tipWidth - tipMargin} ${item.y +
            dotR +
            tipMargin +
            tipHeight}`;
        } else {
          //正常显示在正下方
          return `${item.x - tipWidth / 2} ${item.y +
            dotR +
            tipMargin},${item.x + tipWidth / 2} ${item.y +
            dotR +
            tipMargin},${item.x + tipWidth / 2} ${item.y +
            dotR +
            tipMargin +
            tipHeight},${item.x - tipWidth / 2} ${item.y +
            dotR +
            tipMargin +
            tipHeight}`;
        }
      } else {
        //在上方显示
        if (item.x - dotR - tipWidth / 2 - tipMargin < xMin) {
          //如果贴着左边边缘 在右上方
          return `${item.x + dotR + tipMargin} ${item.y -
            dotR -
            tipMargin -
            tipHeight},${item.x + dotR + tipWidth + tipMargin} ${item.y -
            dotR -
            tipMargin -
            tipHeight},${item.x + dotR + tipWidth + tipMargin} ${item.y -
            dotR -
            tipMargin},${item.x + dotR + tipMargin} ${item.y -
            dotR -
            tipMargin}`;
        } else if (item.x + dotR + tipWidth / 2 + tipMargin > xMax) {
          //如果贴着右边边缘 在左上方
          `${item.x - dotR - tipWidth - tipMargin} ${item.y -
            dotR -
            tipMargin -
            tipHeight},${item.x - dotR - tipMargin} ${item.y -
            dotR -
            tipMargin -
            tipHeight},${item.x - dotR - tipMargin} ${item.y -
            dotR -
            tipMargin},${item.x - dotR - tipWidth - tipMargin} ${item.y -
            dotR -
            tipMargin}`;
        } else {
          //正常显示在正上方
          return `${item.x - tipWidth / 2} ${item.y -
            dotR -
            tipMargin -
            tipHeight},${item.x + tipWidth / 2}  ${item.y -
            dotR -
            tipMargin -
            tipHeight},${item.x + tipWidth / 2}  ${item.y -
            dotR -
            tipMargin},${item.x - tipWidth / 2}  ${item.y - dotR - tipMargin}`;
        }
      }
      // yMin =
    },
    tipOrigin(item) {
      if (!item) return;
      //下面4个值是当前可视区域的范围
      let xMin, xMax, yMin, yMax;

      xMin = -this.svgTransLeft / this.svgScale * this.width / this.vWidth;
      yMin = -this.svgTransTop / this.svgScale * this.height / this.vHeight;
      xMax =
        -this.svgTransLeft / this.svgScale * this.width / this.vWidth +
        this.width / this.svgScale;
      yMax =
        -this.svgTransTop / this.svgScale * this.height / this.vHeight +
        this.height / this.svgScale;

      let tipWidth = 2 * this.xDefinition * this.xDef.normal / this.svgScale;
      let tipHeight = 2.5 * this.yDefinition * this.yDef.normal / this.svgScale;
      let dotR = item.size / this.svgScale * this.svgCircleScale;
      let tipMargin = 100 / this.svgScale;
      //点的半径 item.size/this.svgScale*this.svgCircleScale
      if (item.y + dotR + tipMargin + tipHeight < yMax) {
        //在下面显示

        if (item.x - dotR - tipWidth / 2 - tipMargin < xMin) {
          //如果贴着左边边缘 在右下方
          return {
            x: item.x + dotR + tipMargin,
            y: item.y + dotR + tipMargin
          };
        } else if (item.x + dotR + tipWidth / 2 + tipMargin > xMax) {
          //如果贴着右边边缘 在左下方
          return {
            x: item.x - dotR - tipWidth - tipMargin,
            y: item.y + dotR + tipMargin
          };
        } else {
          //正常显示在正下方
          return {
            x: item.x - tipWidth / 2,
            y: item.y + dotR + tipMargin
          };
        }
      } else {
        //在上方显示
        if (item.x - dotR - tipWidth / 2 - tipMargin < xMin) {
          //如果贴着左边边缘 在右上方
          return {
            x: item.x + dotR + tipMargin,
            y: item.y - dotR - tipMargin - tipHeight
          };
        } else if (item.x + dotR + tipWidth / 2 + tipMargin > xMax) {
          //如果贴着右边边缘 在左上方
          return {
            x: item.x - dotR - tipWidth - tipMargin,
            y: item.y - dotR - tipMargin - tipHeight
          };
        } else {
          //正常显示在正上方
          return {
            x: item.x - tipWidth / 2,
            y: item.y - dotR - tipMargin - tipHeight
          };
        }
      }
    },
    themeTipPos(index) {
      //规则 暂定tip大小：宽度2*xDefinition*xDef.normal 高度 2.5*yDefinition*yDef.normal
      let xMin, xMax, yMin, yMax;
      xMin = -this.svgTransLeft / this.svgScale * this.width / this.vWidth;
      yMin = -this.svgTransTop / this.svgScale * this.height / this.vHeight;
      xMax =
        -this.svgTransLeft / this.svgScale * this.width / this.vWidth +
        this.width / this.svgScale;
      yMax =
        -this.svgTransTop / this.svgScale * this.height / this.vHeight +
        this.height / this.svgScale;
      let tipWidth = 2 * this.xDefinition * this.xDef.normal / this.svgScale;
      let tipHeight = 2.5 * this.yDefinition * this.yDef.normal / this.svgScale;
      let tipMargin = 100 / this.svgScale;

      return `${xMin + tipWidth / 2} ${yMin + index * 2.8 * tipHeight / 2.5},
          ${xMin + tipWidth * 3 / 2} ${yMin + index * 2.8 * tipHeight / 2.5},
          ${xMin + tipWidth * 3 / 2} ${yMin +
        index * 2.8 * tipHeight / 2.5 +
        tipHeight},
          ${xMin + tipWidth / 2} ${yMin +
        index * 2.8 * tipHeight / 2.5 +
        tipHeight}`;
    },
    themeTipOrigin(index) {
      //下面4个值是当前可视区域的范围
      let xMin, xMax, yMin, yMax;
      xMin = -this.svgTransLeft / this.svgScale * this.width / this.vWidth;
      yMin = -this.svgTransTop / this.svgScale * this.height / this.vHeight;
      xMax =
        -this.svgTransLeft / this.svgScale * this.width / this.vWidth +
        this.width / this.svgScale;
      yMax =
        -this.svgTransTop / this.svgScale * this.height / this.vHeight +
        this.height / this.svgScale;
      let tipWidth = 2 * this.xDefinition * this.xDef.normal / this.svgScale;
      let tipHeight = 2.5 * this.yDefinition * this.yDef.normal / this.svgScale;
      let tipMargin = 100 / this.svgScale;
      return {
        x: xMin + tipWidth / 2,
        y: yMin + index * 2.8 * tipHeight / 2.5
      };
    },
    renderExtraDegree() {
      let xMin, xMax, yMin, yMax;
      xMin = -this.svgTransLeft / this.svgScale * this.width / this.vWidth;
      yMin = -this.svgTransTop / this.svgScale * this.height / this.vHeight;
      xMax =
        -this.svgTransLeft / this.svgScale * this.width / this.vWidth +
        this.width / this.svgScale;
      yMax =
        -this.svgTransTop / this.svgScale * this.height / this.vHeight +
        this.height / this.svgScale;
      this.extraDegree =
        xMin > 500
          ? this.yAxisLine
              .filter(item => item.yValue > yMin && item.yValue < yMax)
              .map(i => {
                i.x = xMin + 100 / this.svgScale;
                return i;
              })
          : [];
      // console.log(this.extraDegree)
    },
    enterCircle(item) {
      // item.opacity = 1;
      item.hovered = true;
      this.lastEnter = item.code;
      this.stockTrend = [];
      this.stockLine = null;
      this.lastStockDot = null;
      this.shadowPolygon = null;
      this.selectedStock = item;
      this.hoverRelatedThemeInfo.stockList = [];
      this.hoverRelatedThemeInfo.symbol = item.code;
      setTimeout(() => {
        if (this.lastEnter == item.code) {
          fetchStockTrend(item.code).then(res => {
            let d = this.dataBeautifySpecial(res.data.trend);
            if (this.lastEnter == item.code) {
              this.stockTrend = d[item.code];
              this.drawStockTrend();
            }
          });
          fetchRelatedTheme(item.code).then(res => {
            if (res.data.items && res.data.items.length) {
              this.hoverRelatedThemeInfo.list = this
                .dataBeautify(res.data, "fields", "items")
                .sort((a, b) => {
                  return b.pcp_core - a.pcp_core;
                });

              if (
                this.hoverRelatedThemeInfo.list &&
                this.hoverRelatedThemeInfo.list.length == 0
              ) {
                this.hoverRelatedThemeInfo.list = null;
              }
            } else {
              this.hoverRelatedThemeInfo.list = null;
            }
            // console.log(this.hoverRelatedThemeInfo.list);
            if (
              this.hoverRelatedThemeInfo &&
              this.hoverRelatedThemeInfo.list &&
              this.hoverRelatedThemeInfo.list.length
            ) {
              console.log(this.hoverRelatedThemeInfo.list);
              this.hoverRelatedThemeInfo.list.map(t => {
                if (
                  this.themeMap &&
                  this.themeMap[t.plate_id] &&
                  this.themePcr &&
                  this.themePcr.some(tp => {
                    return tp.plate_id == t.plate_id;
                  })
                ) {
                  this.hoverRelatedThemeInfo.stockList = this.hoverRelatedThemeInfo.stockList.concat(
                    this.themeMap[t.plate_id].stockList
                  );
                }
              });
              console.log(this.hoverRelatedThemeInfo.stockList);
            }
          });
        }
      }, 300);
    },
    drawStockTrend() {
      let maxPrice = 0,
        minPrice = 1000,
        maxTime = 0,
        minTime = 0;

      if (!this.stockTrend || !this.stockTrend.length) return;
      this.stockTrend.map(item => {
        maxPrice = item.last_px > maxPrice ? item.last_px : maxPrice;
        minPrice = item.last_px < minPrice ? item.last_px : minPrice;
        maxTime = item.timestamp > maxTime ? item.timestamp : maxTime;
        minTime = item.timestamp < minTime ? item.timestamp : minTime;
      });
      let origin = this.tipOrigin(this.selectedStock);
      if (!origin) return;
      let minY = origin.y + 640 / this.svgScale;
      let maxY =
        origin.y +
        (2.5 * this.yDefinition * this.yDef.normal - 100) / this.svgScale;
      let minX = origin.x;
      let maxX =
        origin.x +
        (2 * this.xDefinition * this.xDef.normal - 400) / this.svgScale;
      let factorX = (maxX - minX) / this.stockTrend.length;
      let factorY =
        (maxY - minY) / (maxPrice - minPrice ? maxPrice - minPrice : maxPrice);
      let modX = Math.floor(this.stockTrend.length / (maxX - minX)) + 1; //对X轴进行优化 防止数据过多时对于一个x值进行多个y的绘制显得线很粗
      let pointList = this.stockTrend
        .map((v, i) => [
          factorX * i + minX,
          minY + factorY * (maxPrice - v.last_px)
        ])
        .filter((v, i) => !(i % modX));
      this.lastStockDot = pointList[pointList.length - 1];
      this.stockLine = pointList.map(i => i.join(",")).join(" ");
      // console.log(this.stockLine);
      this.shadowPolygon = [[minX, maxY]]
        .concat(pointList)
        .concat([[maxX, maxY]])
        .map(i => i.join(","))
        .join(" ");
    },
    drawThemeStockTrend(code) {
      let maxPrice = 0,
        minPrice = 1000,
        maxTime = 0,
        minTime = 0;
      //  if (!this.stockTrendList || !this.stockTrendList[code]) return;
      this.stockTrendList[code].trend.map(item => {
        maxPrice = item.last_px > maxPrice ? item.last_px : maxPrice;
        minPrice = item.last_px < minPrice ? item.last_px : minPrice;
        maxTime = item.timestamp > maxTime ? item.timestamp : maxTime;
        minTime = item.timestamp < minTime ? item.timestamp : minTime;
      });
      let index = this.hoverStockList.indexOf(code);
      let origin = this.themeTipOrigin(index);
      if (!origin) return;
      let minY = origin.y + 640 / this.svgScale;
      let maxY =
        origin.y +
        (2.5 * this.yDefinition * this.yDef.normal - 100) / this.svgScale;
      let minX = origin.x;
      let maxX =
        origin.x +
        (2 * this.xDefinition * this.xDef.normal - 400) / this.svgScale;
      let factorX = (maxX - minX) / this.stockTrendList[code].trend.length;
      let factorY =
        (maxY - minY) / (maxPrice - minPrice ? maxPrice - minPrice : maxPrice);
      let modX =
        Math.floor(this.stockTrendList[code].trend.length / (maxX - minX)) + 1; //对X轴进行优化 防止数据过多时对于一个x值进行多个y的绘制显得线很粗
      let pointList = this.stockTrendList[code].trend
        .map((v, i) => [
          factorX * i + minX,
          minY + factorY * (maxPrice - v.last_px)
        ])
        .filter((v, i) => !(i % modX));
      this.stockTrendList[code].lastStockDot = pointList[pointList.length - 1];
      this.stockTrendList[code].stockLine = pointList
        .map(i => i.join(","))
        .join(" ");
      // console.log(this.stockLine);
      this.stockTrendList[code].shadowPolygon = [[minX, maxY]]
        .concat(pointList)
        .concat([[maxX, maxY]])
        .map(i => i.join(","))
        .join(" ");
      this.$forceUpdate();
    },

    stockTrendBorder() {
      let origin = this.tipOrigin(this.selectedStock);
      //规则 暂定tip大小：宽度2*xDefinition*xDef.normal 高度 2.5*yDefinition*yDef.normal
      return `${origin.x} ${origin.y +
        2.5 * this.yDefinition * this.yDef.normal},
          ${origin.x + 2 * this.xDefinition * this.xDef.normal} ${origin.y +
        2.5 * this.yDefinition * this.yDef.normal},
          ${origin.x + 2 * this.xDefinition * this.xDef.normal} ${origin.y +
        640},
          ${origin.x} ${origin.y + 640}`;
    },
    leaveCircle(item) {
      this.selectedStock = null;
      item.hovered = false;
      this.points[item.code.split(".")[0]].hovered = false;
      this.hoverRelatedThemeInfo.symbol = null;
      this.hoverRelatedThemeInfo.list = [];
      this.hoverRelatedThemeInfo.stockList = [];
    },
    getAxisLine() {
      //计算y轴线
      let Yweight = 0;
      this.yAxisLabel.map(item => {
        switch (item.type) {
          case "big":
            Yweight = Yweight + this.yDef["big"];
            break;
          case "normal":
            Yweight = Yweight + this.yDef["normal"];
            break;
          case "small":
            Yweight = Yweight + this.yDef["small"];
            break;
          default:
            break;
        }
      });
      Yweight = Yweight + this.yDef["big"];
      this.ySep = Yweight;
      this.yDefinition = Math.floor(
        (this.height - 2 * this.yPadding) / Yweight
      );
      this.yMax = this.yDefinition * Yweight + this.yPadding;
      let cuLculateY = this.yPadding;
      this.yAxisLine = this.yAxisLabel.map(item => {
        switch (item.type) {
          case "big":
            cuLculateY = cuLculateY + this.yDefinition * this.yDef["big"];
            return { ...item, yValue: cuLculateY };
            break;
          case "normal":
            cuLculateY = cuLculateY + this.yDefinition * this.yDef["normal"];
            return { ...item, yValue: cuLculateY };
            break;
          case "small":
            cuLculateY = cuLculateY + this.yDefinition * this.yDef["small"];
            return { ...item, yValue: cuLculateY };
            break;
          default:
            break;
        }
      });
      // console.log(this.yAxisLine)
      //计算x轴线
      let Xweight = 0;
      this.xAxisLabel.map(item => {
        switch (item.type) {
          case "big":
            Xweight = Xweight + this.xDef["big"];
            break;
          case "normal":
            Xweight = Xweight + this.xDef["normal"];
            break;
          default:
            break;
        }
      });
      Xweight = Xweight + this.xDef["big"];
      this.xSep = Xweight;
      this.xDefinition = Math.floor((this.width - 2 * this.xPadding) / Xweight);
      let cuLculateX = this.xPadding;
      this.xMax = this.xDefinition * Xweight + this.xPadding;
      this.xAxisLine = this.xAxisLabel.map(item => {
        switch (item.type) {
          case "big":
            cuLculateX = cuLculateX + this.xDefinition * this.xDef["big"];
            return { ...item, xValue: cuLculateX };
            break;
          case "normal":
            cuLculateX = cuLculateX + this.xDefinition * this.xDef["normal"];
            return { ...item, xValue: cuLculateX };
            break;
          default:
            break;
        }
      });
      return Promise.resolve(1);
    },
    drawCircle(itemList, t) {
      itemList.map(item => {

        let pos = this.getPos(item.trade_volume_ratio, item.pcp);
        let size =
          Math.abs(item.pcr) > 3
            ? 350
            : Math.abs(item.pcr) > 2
              ? 250
              : Math.abs(item.pcr) > 1.5 ? 150 : 50;
        let color =
          item.pcr > 3
            ? "#F24E4E"
            : item.pcr > 0 ? "#F24E4E" : item.pcr > -3 ? "#4BB689" : "#4BB689";
        let fontsize =
          Math.abs(item.pcr) > 3
            ? 150
            : Math.abs(item.pcr) > 2
              ? 130
              : Math.abs(item.pcr) > 1.5 ? 100 : 25;
        let opacity =
          Math.abs(item.pcr) > 3
            ? 0.4
            : Math.abs(item.pcr) > 2
              ? 0.55
              : Math.abs(item.pcr) > 1.5 ? 0.7 : 0.8;

        let code = item.code.split(".")[0];

        this.$set(this.points, code, {
          ...item,
          ...pos,
          size: size * t,
          color: color,
          scale: t,
          pcrIndex: item.pcrIndex,
          fontsize: fontsize * t,
          opacity: opacity
        });
        if (!this.points[code].x) {
          // console.log('create', this.points[code])
        }
      });
    },
    updateCircle(itemList, t) {
      itemList.map(item => {
        let pos = this.getPos(item.trade_volume_ratio, item.pcp);
        let size =
          Math.abs(item.pcr) > 3
            ? 350
            : Math.abs(item.pcr) > 2
              ? 250
              : Math.abs(item.pcr) > 1.5 ? 150 : 50;
        let color =
          item.pcr > 3
            ? "#F24E4E"
            : item.pcr > 0 ? "#F24E4E" : item.pcr > -3 ? "#4BB689" : "#4BB689";
        let code = item.code.split(".")[0];
        if (this.points[code]) {
          let oldpos = {
            x: this.points[code].x,
            y: this.points[code].y
          };
          let oldsize = this.points[code].size;
          let oldopacity, opacity;
          if (
            (this.selectedStock && this.selectedStock.code == item.code) ||
            (this.hoverStockList &&
              this.hoverStockList.length &&
              this.hoverStockList.indexOf(code) != -1)
          ) {
            oldopacity = this.points[code].opacity;
            opacity = this.points[code].opacity;
          } else {
            oldopacity = this.points[code].opacity;
            opacity =
              Math.abs(item.pcr) > 3
                ? 0.4
                : Math.abs(item.pcr) > 2
                  ? 0.55
                  : Math.abs(item.pcr) > 1.5 ? 0.7 : 0.8;
          }
          let oldFontsize = this.points[code].fontsize;
          let fontsize =
            Math.abs(item.pcr) > 3
              ? 150
              : Math.abs(item.pcr) > 2
                ? 130
                : Math.abs(item.pcr) > 1.5 ? 100 : 25;

          this.$set(this.points, code, {
            ...item,
            ...{
              x: oldpos.x + (pos.x - oldpos.x) * t,
              y: oldpos.y + (pos.y - oldpos.y) * t
            },
            size: oldsize + (size - oldsize) * t,
            color: color,
            scale: t,
            pcrIndex: item.pcrIndex,
            fontsize: oldFontsize + (fontsize - oldFontsize) * t,
            opacity: oldopacity + (opacity - oldopacity) * t,
            hovered: this.points[code].hovered
          });
        }
      });
    },
    removeCircle(itemList, t) {
      itemList.map(item => {
        let code = item.code.split(".")[0];
        let fontsize =
          Math.abs(item.pcr) > 3
            ? 150
            : Math.abs(item.pcr) > 2
              ? 130
              : Math.abs(item.pcr) > 1.5 ? 100 : 25;
        let oldopacity = this.points[code].opacity;
        let opacity = 0;
        if (t < 1) {
          this.$set(this.points, code, {
            ...item,
            ...{ x: item.x, y: item.y },
            size: item.size - item.size * t,
            color: item.color,
            scale: t,
            pcrIndex: item.pcrIndex,
            fontsize: item.fontsize,
            opacity: oldopacity - oldopacity * t
          });
        } else {
          if (this.visiDataCode.indexOf(code) == -1) {
            this.$delete(this.points, code);
          }
        }
      });
    },
    getPos(x, y) {
      let tempX, tempY;
      if (x >= 0 && x <= 1) {
        tempX =
          this.xPadding +
          this.xDefinition * (this.xDef.big - this.xDef.normal) +
          x / 0.25 * this.xDefinition * this.xDef.normal;
      } else {
        tempX =
          this.xPadding +
          this.xDefinition * (this.xDef.big + 3 * this.xDef.normal) +
          (2 - 1 / x - 1) / 0.25 * this.xDefinition * this.xDef.normal;
      }
      tempY =
        this.yPadding +
        this.yDefinition * this.yDef.big +
        (10 - y) / 2 * this.yDefinition * this.yDef.normal;
      return {
        x: tempX,
        y: tempY
      };
    },
    changeSlider(v) {
      if (JSON.stringify(v) == JSON.stringify(this.lastScale)) {
        return;
      } else {
        this.lastScale = v;
        // console.log(v);
        this.filterDataList = this.filt(this.dataList);
        let slideBtn = document.getElementsByClassName("ivu-slider-button");
        $(slideBtn[0]).css(
          "background",
          v[0] > 0 ? "#F2564E" : v[0] < 0 ? "#18A66B" : "#BCBCBC"
        );
        $(slideBtn[1]).css(
          "background",
          v[1] > 0 ? "#F2564E" : v[1] < 0 ? "#18A66B" : "#BCBCBC"
        );
        $(".ivu-dirty-div").remove();
        $(".ivu-slider-wrap").append(
          `<div class="ivu-dirty-div" style="left:0 ;width:${12.5 *
            (v[0] + 4)}%" ></div>`
        );
        $(".ivu-slider-wrap").append(
          `<div class="ivu-dirty-div" style="right:0 ;width:${12.5 *
            (4 - v[1])}%" ></div>`
        );
      }
    },
    setStopColor(stop, btn) {
      this.addClass(stop[0], 'border-style-1')
      this.addClass(stop[1], 'border-style-1')
      this.addClass(stop[2], 'border-style-1')
      this.addClass(stop[3], 'border-style-2')
      this.addClass(stop[4], 'border-style-3')
      this.addClass(stop[5], 'border-style-3')
      this.addClass(stop[6], 'border-style-3')
      // $(stop[0]).css("border", "1px solid #18A66B");
      // $(stop[1]).css("border", "1px solid #18A66B");
      // $(stop[2]).css("border", "1px solid #18A66B");
      // $(stop[3]).css("border", "1px solid #BCBCBC");
      // $(stop[4]).css("border", "1px solid #F2564E");
      // $(stop[5]).css("border", "1px solid #F2564E");
      // $(stop[6]).css("border", "1px solid #F2564E");
      for (let i = -3; i <= 3; i++) {
        document.querySelector(".ivu-slider-wrap").insertAdjacentHTML('beforeend',
          `<div class="ivu-dirty-scale" style="left:${12.5 *
            (i + 4)}%;bottom:-18px;color:${
            i > 0 ? "#F2564E" : i < 0 ? "#18A66B" : "#BCBCBC"
          };" >${i}%</div>`
        );
      }
      this.addClass(btn[0], 'btn-style-1')
      this.addClass(btn[1], 'btn-style-2')

      // $(btn[0]).css("background", "#18A66B");
      // $(btn[1]).css("background", "#F2564E");
    },
    themeEnter(item, flag) {
      //flag为true 代表涨速板块 false是跌
      // console.log(item)
      this.lastTheme = item;
      this.hoverTheme = item;
      this.hoverStockList = [];
      let codeList = [];
      if (item.stocks && item.stocks.length) {
        let themeCodeList = item.stocks.map(i => i.code);
        this.filterDataList.map(stock => {
          let id = stock.code.split(".")[0];
          if (this.points[id] && themeCodeList.indexOf(stock.code) > -1) {
            this.hoverStockList.push(id);
            codeList.push(this.points[id].code);
          }
        });
        this.stockTrendList = {};
        setTimeout(() => {
          if (this.lastTheme && this.lastTheme.id == item.id) {
            fetchStockTrend(codeList.join(",")).then(res => {
              let d = this.dataBeautifySpecial(res.data.trend);
              for (let code in d) {
                let c = code.split(".")[0];
                if (this.lastTheme && this.lastTheme.id == item.id) {
                  this.stockTrendList[c] = {};
                  this.stockTrendList[c].trend = d[code];
                  this.drawThemeStockTrend(c);
                }
              }
            });
          }
        }, 300);
      } else {
        this.hoverTheme = null;
        this.lastTheme = null;
        this.hoverStockList = [];
        this.stockTrendList = {};
      }
    },
    themeLeave() {
      this.hoverTheme = null;
      this.lastTheme = null;
      this.hoverStockList = [];
      this.stockTrendList = {};
    },
    stockFillColor(item) {
      if (!this.hoverTheme && !this.hoverRelatedThemeInfo.symbol) {
        return item.color;
      } else {
        if (this.hoverTheme) {
          let c = item.code.split(".")[0];
          if (
            this.hoverStockList &&
            this.hoverStockList.length &&
            this.hoverStockList.indexOf(c) != -1
          ) {
            return item.color;
          } else {
            return "rgba(230,230,230,0.6)";
          }
        } else if (this.hoverRelatedThemeInfo.symbol) {
          if (
            this.hoverRelatedThemeInfo.symbol == item.code ||
            (this.hoverRelatedThemeInfo.list &&
              this.hoverRelatedThemeInfo.list.length &&
              this.hoverRelatedThemeInfo.stockList &&
              this.hoverRelatedThemeInfo.stockList.length &&
              this.hoverRelatedThemeInfo.stockList.some(s => {
                return s.code == item.code;
              }))
          ) {
            return item.color;
          } else {
            return "rgba(230,230,230,0.6)";
          }
        }
      }
    },
    stockTextVisible(item) {
      if (!this.hoverTheme && !this.hoverRelatedThemeInfo.symbol) {
        return true;
      } else {
        if (this.hoverTheme) {
          let c = item.code.split(".")[0];
          if (
            this.hoverStockList &&
            this.hoverStockList.length &&
            this.hoverStockList.indexOf(c) != -1
          ) {
            return true;
          } else {
            return false;
          }
        } else if (this.hoverRelatedThemeInfo.symbol) {
          if (
            this.hoverRelatedThemeInfo.symbol == item.code ||
            (this.hoverRelatedThemeInfo.list &&
              this.hoverRelatedThemeInfo.list.length &&
              this.hoverRelatedThemeInfo.stockList &&
              this.hoverRelatedThemeInfo.stockList.length &&
              this.hoverRelatedThemeInfo.stockList.some(s => {
                return s.code == item.code;
              }))
          ) {
            return true;
          } else {
            return false;
          }
        }
      }
    },
    showGuide() {
      this.$emit("guide");
    }
  },
  components: {
    dotSpinner
  },
  filters: {
    dateFilter(t) {
      return format(new Date(t), "MM-DD");
    },
    codeFilter(code) {
      return code.split(".")[0];
    }
  }
};
</script>


<style lang='less' scoped>
@import '../../styles/variables.less';
.chart-container {
  display: flex;
  width: 100%;
  .svg-container {
    overflow: hidden;
    display: block;
    position: relative;
    z-index: 5;
    .chart-svg {
      position: absolute;
      left: 0;
      top: 0;
      user-select: none;
      font-family: Helvetica Neue, Helvetica, Microsoft YaHei, Arial,
        PingFang SC, Hiragino Sans GB, Heiti SC, WenQuanYi Micro Hei, sans-serif;
      &.zoomed {
        cursor: grab;
      }
    }
  }
  .chart {
    flex: 0 0 85%;
  }
  .related-theme {
    flex: 0 0 15%;
    overflow-y: auto;
    .dot-spinner {
      margin-top: 25px;
    }
    &-zero {
      text-align: center;
      color: #fff;
    }
    &-title {
      padding: 17px 0 12px 10px;
      font-size: 14px;
      color: #666666;
      letter-spacing: 0.88px;
      line-height: 14px;
      position: relative;
      text-align: left;
      position: relative;
      overflow: visible;
      &.uptheme:before {
        content: "";
        position: absolute;
        left: 0;
        width: 4px;
        top: 17px;
        bottom: 12px;
        background: @dingRise;
      }
      &.downtheme:before {
        content: "";
        position: absolute;
        left: 0;
        width: 4px;
        top: 17px;
        bottom: 12px;
        background: @dingDown;
      }
    }
    &-item {
      max-width: 150px;
      padding: 10px 0 12px 0;
      margin: 4px 20px 4px 0;
      text-align: center;
      background: #fff;
      box-shadow: 0 0 8px 0 rgba(53, 58, 71, 0.05);
      cursor: pointer;
      &.-market-color--green {
        &.related {
          background: @dingDown;
          color: #fff;
          .related-theme-item-name {
            color: #fff;
          }
          .related-theme-item-rate {
            color: #fff;
          }
        }
      }
      &.-market-color--red {
        &.related {
          background: @dingRise;
          color: #fff;
          .related-theme-item-name {
            color: #fff;
          }
          .related-theme-item-rate {
            color: #fff;
          }
        }
      }
      &-name {
        font-size: 14px;
        // color: #333333;
        letter-spacing: 0.88px;
      }
      &-rate {
        font-size: 20px;
      }
    }
  }
  .chart-theme {
    flex: 0 0 15%;
    overflow-y: auto;
    &-title {
      padding: 17px 0 12px 10px;
      font-size: 14px;
      color: #666666;
      letter-spacing: 0.88px;
      line-height: 14px;
      position: relative;
      text-align: left;
      &.uptheme:before {
        content: "";
        position: absolute;
        left: 0;
        width: 4px;
        top: 17px;
        bottom: 12px;
        background: @dingRise;
      }
      &.downtheme:before {
        content: "";
        position: absolute;
        left: 0;
        width: 4px;
        top: 17px;
        bottom: 12px;
        background: @dingDown;
      }
    }
    &-item {
      max-width: 150px;
      padding: 10px 0 12px 0;
      margin: 4px 20px 4px 0;
      text-align: center;
      background: #fff;
      font-size: 12px;
      box-shadow: 0 0 8px 0 rgba(53, 58, 71, 0.05);
      cursor: pointer;
      &-stocks {
        display: flex;
        font-size: 12px;
        padding: 1px 14px;
        &-container {
          min-height: 40px;
          font-size: 12px;
          padding-top: 7px;
          &.-market-color--green {
            .chart-theme-item-stocks {
              color: @dingDown;
            }
          }
          &.-market-color--red {
            .chart-theme-item-stocks {
              color: @dingRise;
            }
          }
        }
        &-name {
          width: 50%;
          font-size: 12px;
          text-align: left;
        }
        &-rate {
          width: 40%;
          font-size: 12px;
        }
        &-img {
          width: 8px;
          height: 14px;
          margin-left: 4px;
          line-height: 20px;
          display: inline-block;
          position: relative;
          top: 3px;
        }
      }
      &.-market-color--green {
        &:hover {
          background: @dingDown;
          .chart-theme-item-stocks {
            color: #fff;
            &-container {
              color: #fff;
              .chart-theme-item-stocks {
                color: #fff !important;
                &.-market-color--red {
                  color: #fff !important;
                }
                &.-market-color--green {
                  color: #fff !important;
                }
              }
            }
          }
          .chart-theme-item-rate {
            color: #fff;
          }
          .chart-theme-item-stocks {
            color: #fff;
          }
        }
      }
      &.-market-color--red {
        &:hover {
          background: @dingRise;
          .chart-theme-item-stocks {
            color: #fff;
            &-container {
              color: #fff;
              .chart-theme-item-stocks {
                color: #fff !important;
                &.-market-color--red {
                  color: #fff !important;
                }
                &.-market-color--green {
                  color: #fff !important;
                }
              }
            }
          }
          .chart-theme-item-rate {
            color: #fff;
          }
        }
      }
      &-name {
        font-size: 14px;
        color: #333333;
        letter-spacing: 0.88px;
      }
      &-rate {
        font-size: 20px;
      }
    }
  }
}
.stock-item {
  cursor: pointer;
}
.-market-color--gray {
  color: #919599 !important;
}
.-market-color--red {
  color: @dingRise !important;
}

.-market-color--green {
  color: @dingDown !important;
}
.chart-title {
  height: 40px;
  display: flex;
  padding: 0 0 0 20px;
  justify-content: space-between;
  line-height: 40px;
  z-index: 10;
  .chart-scale {
    // position: absolute;
    // top: 40px;
    // left: 20px;
    width: 600px;
    height: 250px;
    background: #3f4352;
    z-index: 100;
    &-h {
      font-size: 14px;
      color: #ffffff;
      letter-spacing: 0;
      line-height: 14px;
      padding: 18px;
    }
    &-g {
      display: flex;
      &-item {
        width: 25%;
        &-text {
          font-size: 14px;
          color: #ffffff;
          letter-spacing: 0;
          line-height: 14px;
          text-align: center;
        }
        &-round-container {
          width: 150px;
          height: 150px;
          margin: 0 auto;
        }
      }
      .chart-scale-100 {
        width: 100px;
        height: 100px;
        margin: 0 auto;
        top: 25px;
        left: 8px;
        position: relative;
        border-radius: 50px;
        opacity: 0.4;
        background: #18a66b;
        &:before {
          content: "";
          display: block;
          position: absolute;
          width: 100px;
          height: 100px;
          left: -16px;
          border-radius: 50px;
          opacity: 0.4;
          background: #f24e4e;
        }
      }
      .chart-scale-64 {
        width: 64px;
        height: 64px;
        margin: 0 auto;
        top: 43px;
        left: 8px;
        position: relative;
        border-radius: 32px;
        opacity: 0.55;
        background: #18a66b;
        &:before {
          content: "";
          display: block;
          position: absolute;
          width: 64px;
          height: 64px;
          left: -16px;
          border-radius: 32px;
          opacity: 0.55;
          background: #f24e4e;
        }
      }
      .chart-scale-32 {
        width: 32px;
        height: 32px;
        margin: 0 auto;
        top: 59px;
        left: 8px;
        position: relative;
        border-radius: 16px;
        opacity: 0.7;
        background: #18a66b;
        &:before {
          content: "";
          display: block;
          position: absolute;
          width: 32px;
          height: 32px;
          left: -16px;
          border-radius: 16px;
          opacity: 0.7;
          background: #f24e4e;
        }
      }
      .chart-scale-16 {
        width: 16px;
        height: 16px;
        margin: 0 auto;
        top: 67px;
        left: 4px;
        position: relative;
        border-radius: 8px;
        opacity: 0.8;
        background: #18a66b;
        &:before {
          content: "";
          display: block;
          position: absolute;
          width: 16px;
          height: 16px;
          left: -8px;
          border-radius: 8px;
          opacity: 0.8;
          background: #f24e4e;
        }
      }
    }
  }
  &-text {
    font-size: 16px;
    color: #333333;
    letter-spacing: 0;
    line-height: 40px;
    position: relative;
    &::before {
      content: "";
      position: absolute;
      top: 13px;
      left: -10px;
      bottom: 13px;
      width: 4px;
      display: block;
      background: #f2564e;
    }
    &-sub {
      font-size: 12px;
      color: #999999;
      letter-spacing: 0.75px;
      line-height: 40px;
      display: inline-block;
      vertical-align: top;
      cursor: pointer;
    }
    &-round {
      height: 12px;
      width: 12px;
      border-radius: 6px;
      opacity: 0.8;
      display: inline-block;
      background: #18a66b;
      margin-left: 5px;
      top: 1px;
      position: relative;
      &:before {
        content: "";
        position: absolute;
        height: 12px;
        width: 12px;
        border-radius: 6px;
        opacity: 0.8;
        background: #f2564e;
        left: -3px;
        top: 0;
      }
    }
    &-guide {
      color: #fff;
      opacity: 0.6;
      font-size: 14px;
      margin-right: 3px;
      line-height: 40px;
    }
  }
  &-scale {
    font-size: 12px;
    color: #666666;
    letter-spacing: 0.75px;
    line-height: 40px;
    padding-right: 20px;
    &-detail {
      font-size: 16px;
      color: #fff;
      letter-spacing: 0;
      line-height: 40px;
      margin-left: 5px;
    }
    &-text {
      font-size: 12px;
      color: #666666;
      letter-spacing: 0.75px;
      line-height: 40px;
    }
    &-slider {
      width: 300px;
      margin-left: 10px;
      vertical-align: middle;
      display: inline-block;
    }
  }
}

// .chart-theme::-webkit-scrollbar {
//   width: 10px;
// }

// .chart-theme::-webkit-scrollbar-track {
//   background: #fff;
// }

// .chart-theme::-webkit-scrollbar-thumb {
//   background-color: darkgrey;
//   border-radius: 5px;
//   outline: 1px solid #4a4a4a;
// }

// .chart-theme.dark::-webkit-scrollbar {
//   width: 10px;
// }

// .chart-theme.dark::-webkit-scrollbar-track {
//   background: @dingDarkThird;
// }

// .chart-theme.dark::-webkit-scrollbar-thumb {
//   background-color: darkgrey;
//   outline: 1px solid slategrey;
// }

.chart-theme.dark::-webkit-scrollbar {
  width: 14px;
}
.chart-theme.dark::-webkit-scrollbar-track {
  background: @dingDarkThird;
}
.chart-theme.dark::-webkit-scrollbar-thumb {
  background-color: transparent;
  border-radius: 20px;
  border: 4px solid @dingDarkThird;
  /*outline: 1px solid #2f2f31;*/
}
.chart-theme.dark:hover::-webkit-scrollbar-thumb {
  background-color: darkgrey;
  border-radius: 20px;
  border: 4px solid @dingDarkThird;
}

// .polyline-shadow{
//   opacity: 0.12;
//   background-image: linear-gradient(-180deg, rgba(20,120,240,0.70) 0%, rgba(20,120,240,0.01) 100%);
// }
.dark {
  .chart-container .chart-theme-item {
    background: @dingDarkThird;
    box-shadow: 0 0 8px 0 rgba(53, 58, 71, 0.05);
  }
  .chart-container .related-theme-item {
    background: @dingDarkThird;
    box-shadow: 0 0 8px 0 rgba(53, 58, 71, 0.05);
  }
  .chart-container .chart-theme-item-name {
    color: #fff;
  }
  .chart-title-text {
    color: #fff;
  }
}
</style>
<style lang='less'>
@import '../../styles/variables.less';
.ivu-slider-wrap {
  background-image: linear-gradient(
    90deg,
    rgba(24, 166, 107, 1) 0%,
    rgba(242, 86, 78, 1) 100%
  );
}
.ivu-slider-bar {
  background: transparent !important;
}
.ivu-dirty-div {
  height: 4px;
  position: absolute;
  background: #bcbcbc;
}
.ivu-dirty-scale {
  position: absolute;
  transform: translateX(-10px);
}
.ivu-slider-stop {
  width: 8px;
  height: 8px;
  border: 1px solid gray;
  z-index: 5;
  transform: translate(-50%, -25%);
  background: #fff;
}
.ivu-slider-button-wrap {
  z-index: 10;
  .ivu-slider-button {
    background: rgba(24, 166, 107, 1);
    border: none;
    &:hover {
      border: none;
      transform: scale(1.2);
    }
  }
}
.chart-title {
  .ivu-poptip-body {
    padding: 0;
  }
  .ivu-poptip-popper[x-placement^="bottom"] .ivu-poptip-arrow {
    border-bottom-color: #3f4352;
    &:after {
      border-bottom-color: #3f4352;
    }
  }
}
.border-style-1{
  border: 1px solid #18A66B;
}
.border-style-2{
  border: 1px solid #BCBCBC;
}
.border-style-3{
  border: 1px solid #F2564E;
}
.btn-style-1{
  background: #18A66B;
}
.btn-style-2{
  background: #F2564E;
}
</style>

