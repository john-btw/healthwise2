
<template>
    <div v-if="element" class="container grid-x pins flexbox"
      v-observe-visibility="{ callback: visibilityChanged, throttle: 100, intersection: { threshold: 0.8 }, once: false }"
      :class="{ 'visible': true }" 
      @scroll="reset"
      role="region" level="1" >

      <div class="pins-container component-container ">

        <div class="pins-topic-title btw-topic-title cell large-12 medium-12 small-12" role="heading" level="2">
          <h1 ref="accessibility" class="accessibility-region" tabindex="-1" >{{getScreenAriaContent()}}</h1>
          <h3 v-html="getTopicTitle()" />
        </div>

        <div class="pins-info pins-info-mobile" v-if="$store.state.device === 'phone'">
          <div class="pins-title btw-title cell large-12 medium-12 small-12">
              <h4 v-if="element.content.title" v-html="element.content.title" />
            </div>
            <div ref="bodyContent" class="pins-text btw-text cell large-12 medium-12 small-12">
              <div v-html="element.content.body" />
            </div>
        </div>

        <div class="pins-image" >
          <img class="pins-image-img" :src="element.content._image" :aria-label="element.content._alt ? element.content._alt : ''" />
          <button class="pins-item" v-for="(pin, index) in element.content.pins" 
              :key="index"
              :style="{ top: pin._position[0] + '%', left: pin._position[1] + '%' }"
              @click="showPopup(pin, index)"
              role="button" tabindex="0"
              :aria-label="$store.state.courseContent.global._accessibility.pinbtn + ' ' + (index+1)"
              @mouseover="hover = index"
              @mouseleave="hover = -1"
              :class="{ 'visited': pinsVisited[index] === true }" >
              <img :src="getPinImage(index, false)" aria-hidden="true" >
              <div class="pins-item-number" v-html="index+1" aria-hidden="true" />
          </button>
        </div>

        <div class="pins-content flexbox flexbox-row flexbox-justify-stretch flexbox-align-stretch" v-if="$store.state.device !== 'phone'">
          <div class="pins-info">
            <div class="pins-title btw-title cell large-12 medium-12 small-12">
                <h4 v-if="element.content.title" v-html="element.content.title" />
              </div>
              <div ref="bodyContent" class="pins-text btw-text cell large-12 medium-12 small-12">
                <div v-html="element.content.body" />
              </div>
              <div ref="bodyIns" class="pins-ins btw-text cell large-12 medium-12 small-12" v-if="!checkComplete()">
                <div v-html="element.content.ins" />
              </div>
          </div>

          <transition name="fade">
          <div :key="getPinContent()" ref="popup" class="pins-popup flexbox flexbox-row flexbox-justify-stretch flexbox-align-stretch" v-show="pinIndex > -1 && $store.state.device !== 'phone'">
            <div class="pins-item" aria-hidden="true" >
              <img :src="element.content._pinShadowImage">
              <div class="pins-item-number" v-html="pinIndex+1" />
            </div>
            <div class="pins-text btw-text">
              <div v-html="getPinContent()" ref="pincontent" tabindex="-1" />
            </div>
          </div>
          </transition>
        </div>

      </div>
    </div>

</template>

<script lang="ts">

  import { Component, Prop, Vue, Watch, Mixins } from 'vue-property-decorator';
  import BaseComponent from '@/components/BaseComponent';

  import IPins, {IPinContent, IPinItem } from "@/interfaces/BTW/IPins";

  @Component({
    components: {
      
    }
  })

  export default class Pins extends Mixins(BaseComponent) implements IPins{
    @Prop({ required: true })
    protected element!: IPins;

    @Prop({ default: "" })
    public content!: IPinContent;

    @Prop({ default: "" })
    public pins!: IPinItem[];

    private pinsVisited: boolean[] = [];

    private pinIndex: number = -1;

    private hover:number = -1;

    @Watch('this.pinsVisited')
    private getPinImage(_index: number, _pinindex: boolean) {
      let pinImg = '';
      if (_pinindex === true) {
        if (this.pinIndex >= 0) {
          pinImg = this.element.content._pinImage;
        }
      } else {
        pinImg = this.element.content._pinImage;
        if (this.pinsVisited[_index] === true || this.hover === _index) {
         pinImg = this.element.content._pinHoverImage;
        }
      }
      return pinImg; 
    }
      
    private getPinContent() {
      if(this.pinIndex > -1) {
        return this.element.content.pins[this.pinIndex].content;
      }
      return '';
    }

    private showPopup(pins: any, index: number) {
        
      this.pinIndex = index;

      if (this.$store.state.device === 'phone') {
        let popupData = { body: this.element.content.pins[this.pinIndex].content };
        this.$store.getters.showPopup(popupData);
        this.$store.getters.write;
      } else {
        //focus on the title of the new slide
        this.$store.getters.setAccessibilityFocus(this.$refs.pincontent);
      }

      Vue.set(this.pinsVisited, index, true);

      this.checkAllVisited();
    }

    private mounted() {
      this.element.content.pins.forEach((item: any, index: number) => {
          this.pinsVisited.push(false);
      });
      this.focusStart();
    }

    private activated() {
      this.focusStart();
    }

    private checkAllVisited() {
      const complete = this.checkComplete();
      if (complete) {
        // enable the next button
        this.unlockNext();
      }
    }

    private checkComplete() {
      let complete = true;
      this.pinsVisited.forEach((item: any, index: number) => {
          if(item === false) {
            complete = false;
          }
      });
      return complete;
    }

    @Watch('isActive')
    private reset() {

      if(this.isActive === true) { 
        this.focusStart();

        if (this.$store.state.device !== 'phone') {
          this.pinIndex = -1;
          //reset viewed
          // this.element.content.pins.forEach((item: any, index: number) => {
          //     this.pinsVisited[index] = false;
          // });
          // Vue.set(this.pinsVisited, this.element.content.pins.length-1, false);
        }
      }
      
      
    }
    
  }

  </script>

<style scoped lang="scss">

  @import "../../style/global.scss";

  .pins {
    overflow: hidden;
    position: relative!important;

    display: flex!important;
    align-items: center;
    justify-content: center;

    padding: 0!important;
  }

  .pins-container {
    @media #{$media-laptop} {
      overflow: hidden;
    }

    position: relative;

  }

  .pins-topic-title {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    padding: $container-padding-btw/2 $container-padding-btw;
    z-index: 1;

    @media #{$media-phone} {
      background-color: $btw-background-colour;
      order: 1;
      position: relative;
    }
  }

  .pins-content {
    position: absolute;
    bottom: $container-padding-btw;
    top: auto;
    width: 92%;
    //height: 25vh;
    //min-height: 25vh;
    left: $container-padding-btw;
    flex: 1 1 auto;
  }

  .pins-info, .pins-popup {
    padding: $container-padding-btw/2;
    height: auto;
    width: 48%;
    flex: 0 0 auto;
  }

  .pins-info-mobile, .pins-popup-mobile {
    width: 100%;
  }

  .pins-popup {
    @media #{$media-phone} {
      background-color: $btw-grey!important;
    }
  }

  .pins-info-mobile {

  }

  .pins-info {
    background-color: rgba(255,255,255,0.9);
    margin-right: $container-padding-btw;

    @media #{$media-phone} {
      order: 2;
      position: relative;
    }

    .pins-title {
      color: $btw-main-colour;
    }
  }

  .pins-item-number {
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    text-align: center;
    color: #fff;
    transform: translate(0%,-67.5%);
    font-size: 2em;

    @media #{$media-phone} {
      font-size: 1.5em;
      font-weight: bold;
    }

  }

  .pins-popup {
      
    background-color: rgba(255,255,255,0.9);
    box-sizing: border-box;

    @media #{$media-phone} {
      order: 4;
      position: relative;
    }

    .pins-item {
      flex: 0 0 auto;
     
      width: 6.5em;
      height: 8em;

      position: relative;

      .pins-item-number {
        transform: translate(0%,-80%);
      }

    }
    .pins-text {
      flex: 1 1 auto;
      padding-left: 1.2em;

      overflow: hidden;
      //overflow-y: auto;
    }

  }

  .pins-image {
    flex: 1 1 auto;
    height:100%;
    width: 100%;
    position: relative;
    object-fit: cover;

    @media #{$media-phone} {
      order: 3;
      position: relative;
      flex: 0 0 auto;
      height: auto;
    }

    .pins-image-img {
      object-fit: cover;
      max-height: 100%;
      width: 100%;
      min-height: 100%;
      object-position: top;

      @media #{$media-phone} {    
        height: auto;
        min-height: 0;
      }
    }

    .pins-item {
      cursor: pointer;
      position: absolute;
      width: 6.5em;
      height: 8em;
      z-index: 1001;

      transform: translate(-50%,-50%);


      @media #{$media-phone} {
        width: 4rem;
        height: 5.5rem;

        transform: translate(-50%,-75%);

      }

      &.visited {
        // opacity: 0.5;
        animation: bounce-in .5s;
      }
    }
  }

    // transitions //

    // fade
    .fade-enter-active {
      transition: opacity 1s;
    }
    .fade-enter { // , .fade-leave-to {
      opacity: 0;
    }

    // slide-fade
    .slide-fade-enter-active {
      opacity: 1;
      transition: all 0.5s cubic-bezier(1.0, 0.5, 0.9, 1.0);
    }
    .slide-fade-enter {
      transform: translateX(-2rem);
      opacity: 0;
    }

</style>
