<template>
  <div v-if="element" class="click-reveal-hotspots grid-x container"
      v-observe-visibility="{ callback: visibilityChanged, throttle: 100, intersection: { threshold: 0.8 }, once: false }"
      :class="{ 'visible': true }" 
      @scroll="reset"
      role="region" level="1" >
      
    <div class="component-container click-reveal-hotspots-container flexbox flexbox-column flexbox-justify-stretch flexbox-align-stretch"
          v-show="!showVideo">

      <div class="click-reveal-hotspots-topic-title btw-topic-title cell large-12 medium-12 small-12" role="heading" level="2" >
        <h1 ref="accessibility" class="accessibility-region" tabindex="-1">{{getScreenAriaContent()}}</h1>
        <h3 v-html="getTopicTitle()" />
      </div>

      <div class="click-reveal-hotspots-image" >

        <img :src="element.content._image" :aria-label="getImageAlt()" :aria-hidden="getImageAlt() === '' ? true : false" >

        <div class="click-reveal-hotspots-main" >

          <button class="reveal-item flexbox flexbox-justify-center flexbox-align-center" v-for="(reveal, index) in element.content.reveals" 
            :key="index"
            :style="{ top: reveal._position[0] + '%', left: reveal._position[1] + '%', width: reveal._position[2] + '%' }"
            @click="showReveal(index)" 
            role="button" tabindex="0"
            :aria-label="$store.state.courseContent.global._accessibility.hotspottitle + ' ' + (index+1)" >
            <img v-if="reveal._image" :src="reveal._image" :class="{ 
              'invisible': $data._revealIndex !== index && revealsVisited[index] === false,
              'faded': $data._revealIndex !== index && revealsVisited[index] === true  
            }" />
            <div class="reveal-item-number" v-else :class="{ 'visited': revealsVisited[index] === true }"> 
              <span>{{index + 1}}</span>
            </div>
          </button>

        </div>

      </div>

      <div class="click-reveal-hotspots-content background-colour-content flexbox flexbox-row flexbox-justify-stretch flexbox-align-stretch" >
        
        <div class="click-reveal-hotspots-content-main component-side">
          <div class="click-reveal-hotspots-title btw-title cell large-12 medium-12 small-12">
            <h4 v-if="element.content.title" v-html="element.content.title" />
          </div>

          <div ref="bodyContent" class="click-reveal-hotspots-text btw-text cell large-12 medium-12 small-12" v-if="$store.state.device !== 'phone'">
            <div v-html="element.content.body" />
            <!-- <div v-html="element.content.instructions" v-if="revealsComplete === false" /> -->
          </div>
          <div class="click-reveal-hotspots-text btw-text cell large-12 medium-12 small-12" v-if="$store.state.device === 'phone'">
            <div v-html="element.content.body" />
            <div v-html="element.content.instructions" v-if="revealsComplete === false" />
          </div>
        </div>

        <div class="click-reveal-hotspots-content-body" ref="hotspotContent" v-if="$store.state.device !== 'phone'">
          <div class="click-reveal-hotspots-body-title btw-title cell large-12 medium-12 small-12">
            <!-- <transition name="fade"> -->
              <h4 :key="contentTitle" v-if="contentTitle !== ''" v-html="contentTitle" ref="revealcontent" tabindex="-1" />
            <!-- </transition> -->
          </div>
          <div class="click-reveal-hotspots-body-text btw-text cell large-12 medium-12 small-12">
            <!-- <transition name="fade"> -->
              <div :key="contentBody" v-html="contentBody" />
            <!-- </transition> -->
          </div>
          <div class="click-reveal-hotspots-content-ins" v-html="element.content.instructions" v-if="$data._revealIndex === -1" :class="{ 'is-visible': animateIns === true }" />
          
        </div>

      </div>

      <div ref="bodyContent" class="click-reveal-hotspots-ins btw-text cell large-12 medium-12 small-12" v-if="$store.state.device === 'phone'" >
        <div />
      </div>

    </div>
    
    <transition name="fade">
      <media key="video" class="click-reveal-hotspots-video flexbox" v-if="element.content._video && showVideo" :element="element.content._video" @afterVideo="hideVideo"  
    :aria-label="$store.state.courseContent.global._accessibility.containsmedia" tabindex="0" />
    </transition>

  </div>
</template>

<script lang="ts">

  import { Component, Prop, Vue, Watch, Mixins } from 'vue-property-decorator';
  import BaseComponent from '@/components/BaseComponent';

  import Media from "@/components/BTW/Media.vue";

  import IClickRevealHotspots, { IClickRevealHotspotContent, IClickRevealHotspotItems } from "@/interfaces/BTW/IClickRevealHotspots";

  @Component({
    components: {
      Media
    }
  })

  export default class ClickRevealHotspots extends Mixins(BaseComponent) implements IClickRevealHotspots {
    @Prop({ required: true })
    protected element!: IClickRevealHotspots;

    @Prop({ default: ""})
    public content!: IClickRevealHotspotContent;

    @Prop({ default: ""})
    public reveals!: IClickRevealHotspotItems[];

    private _revealIndex: number = -1;

    private contentTitle: string = '';
    private contentBody: string = '';

    private revealsVisited: boolean[] = [];

    private showVideo: boolean = false;

    private revealsComplete: boolean = false;

    private animateIns: boolean = false;

    private hideVideo() {
      this.showVideo = false;

      this.$store.state.subtitles = false;
      //this.$store.state.showSubtitles = false;
      this.$store.getters.write; 
    }

    private getImageAlt() {
      let alt = '';
      if(this.element.content._alt) {
         alt = this.element.content._alt;
       }
      return alt;
    }

    private getContent() {
      this.contentTitle = this.element.content.reveals[this.$data._revealIndex].title;
      this.contentBody = this.element.content.reveals[this.$data._revealIndex].content;
    }

    private showReveal(_index: number) {
      this.$data._revealIndex = _index;

      //remove animation from content
      if (this.$store.state.device !== 'phone') {
        const hotspotElement = (this.$refs.hotspotContent as HTMLElement);
        hotspotElement.classList.remove('active');
        hotspotElement.classList.add('not-active');
        this.getContent();
        
        setTimeout(() => {
            hotspotElement.classList.remove('not-active');
            hotspotElement.classList.add('active');
        }, 100);
      }

      if (this.$store.state.device === 'phone') {
        let popupData = { title: this.element.content.reveals[_index].title, body: this.element.content.reveals[_index].content };
        this.$store.getters.showPopup(popupData);
      } else {
        //focus on the title of the new reveal
        this.$store.getters.setAccessibilityFocus(this.$refs.revealcontent);
      }

      Vue.set(this.revealsVisited, _index, true);

      this.checkAllVisited();
    }

    private mounted() {
      this.revealsComplete = false;
      if (this.element.content._video) {
        this.showVideo = true;
      }
      this.element.content.reveals.forEach((item: any, index: number) => {
          this.revealsVisited.push(false);
      });

      this.animateIns = false;

      this.contentBody = '';//this.element.content.instructions ? this.element.content.instructions : '';
      this.focusStart();
    }

    private activated() {
      this.focusStart();
    }

    private checkAllVisited() {
      let complete = true;
      this.revealsVisited.forEach((item: any, index: number) => {
          if(item === false) {
            complete = false;
          }
      });
      if (complete) {
        // enable the next button
        this.unlockNext();
        this.revealsComplete = true;
      }
    }

    @Watch('isActive')
    private reset() {

      if(this.isActive === true) { 
        this.focusStart();

        this.animateIns = false;

        if (this.$store.state.device !== 'phone') {
          this.$data._revealIndex = -1;
          //this.revealsComplete = false;
          //clear on-screen content
          this.contentTitle = '';
          this.contentBody = '';//this.element.content.instructions ? this.element.content.instructions : '';
          //reset viewed
          /*this.element.content.reveals.forEach((item: any, index: number) => {
              this.revealsVisited[index] = false;
          });
          Vue.set(this.revealsVisited, this.element.content.reveals.length-1, false);*/
          //animate ins
          setTimeout(() => {
            this.animateIns = true;
          }, 2000);
          //video?
          this.showVideo = false;
          if (this.element.content._video) {
            this.showVideo = true;
          }
        }
      }
      
      
    }

  }

</script>

<style scoped lang="scss">

  @import "../../style/global.scss";

  .click-reveal-hotspots {
    overflow: hidden;
    overflow-y:auto;
    position: relative;

    display: flex!important;
    align-items: center;


    &.container {
      padding: 0!important;
      height: 100%!important;
    }

    .click-reveal-hotspots-container {
      @media #{$media-tablet} {
        max-height: 100%;
      }

      @media #{$media-phone} {
        //height: calc(var(--vh, 1vh) * 100);
      }

      .click-reveal-hotspots-content-ins {
        opacity: 0;
        margin-top: 2.2em;
        
        &.is-visible {
          animation: opacity-in-fade 0.5s;
          opacity: 1;
        }
      }

      .click-reveal-hotspots-content {
        display: flex;
        flex: 1 1 auto;
        overflow: hidden;

        min-height: 31%;

        bottom: 0;
        position: absolute;

        @media #{$media-tablet} {
          min-height: 40%;
          height: 40%;
        }

        @media #{$media-mobile} {
          min-height: 40%;
          height: 40%;
        }

        @media #{$media-phone} {
          flex-direction: column;
          flex: 0 0 auto;
          overflow: visible;
          height: auto;
          position: relative;

          order: 1;
        }

        background-color: $btw-background-colour;
        color: $btw-body-colour;

        .click-reveal-hotspots-content-main {
          //overflow: hidden;
          //overflow-y: auto;

          @media #{$media-phone} {
            overflow: visible;
            padding: $container-padding-btw/2 $container-padding-btw;
          }
        }

        .text-image-title {
          color: $btw-title-colour;
          margin-top: 2.2em;
        }

      }

      .click-reveal-hotspots-image {
        display: flex;
        flex: 0 0 auto;

        position: relative;
        height: auto; //calc(var(--vh, 1vh) * 100); 


        @media #{$media-tablet} {
            width: 100%;
            flex: 0 0 auto;
            position: absolute;
            top: 0;
            left: 0;
        }
        @media #{$media-mobile} {
            width: 100%;
            flex: 0 0 auto;
            position: absolute;
            top: 0;
            left: 0;
        }

        img {
          object-fit: contain;
          object-position: top;
          width: 100%;

          @media #{$media-tablet} {
            object-position: center;
            height: 100%;
          }
          @media #{$media-mobile} {
            object-position: center;
            height: 100%;
          }
        }

        .click-reveal-hotspots-main {
          position: absolute;
          top:0;
          left:0;
          width: 100%;
          height: 100%;

          .reveal-item {
            flex: 1 1 auto;
            cursor: pointer;
            position: absolute;
            z-index: 1001;

            img {
              opacity: 1;

              &.invisible {
                opacity: 0;
              }

              &.faded {
                opacity: 0.5;
              }
            }

            .reveal-item-number {
              display: flex;
              align-items: center;
              span {
                background-color: $btw-selectable;
                color: $white;
                border-radius: 100%;
                padding: 0.5em 0.8em;
                border: 0.5em solid $white;
                font-weight: bold;
                font-size: 1.2em;
                height: 100%;

                @media #{$media-phone} {
                  padding: 0.25rem 0.35rem;
                  font-size: 0.8em;
                  line-height: 0.8;
                  border: 4px solid $white;
                }
              }

              &.visited {
                span {
                  background-color: $btw-selectable-visited;
                }
              }
            }
            
          }
        }

        @media #{$media-phone} {
          order: 2;
          position: relative;
        }

      }

      .click-reveal-hotspots-topic-title {
          color: $btw-topic-title-colour;
          position: absolute;
          padding: $container-padding-btw/2 $container-padding-btw;
          top:0;
          left:0;
          z-index: 1;

          @media #{$media-phone} {
            background-color: $btw-mobiletop-colour;
            order: 1;
            position: relative;
          }
        }
      
      .click-reveal-hotspots-content {
        @media #{$media-phone} {
         flex-direction: column;
        }
      } 

      .click-reveal-hotspots-content-main, .click-reveal-hotspots-content-body {
        padding: $container-padding-btw/2 $container-padding-btw 0 $container-padding-btw;

        @media #{$media-phone} {
          width: 100%!important;
          padding: $container-padding-btw/2 $container-padding-btw;
        }
        
      }

      .click-reveal-hotspots-content-main {
        width: 40%;
        position: relative;

        z-index: 1;

      }

      .click-reveal-hotspots-content-body {
        width: 61%;
        background-color: $btw-grey;

        &.not-active {
          animation: none;
          opacity: 0;
        }

        &.active {
          animation: opacity-in 0.5s;
          opacity: 1;
        }

        overflow: hidden;
        overflow-y: auto;
      }

      .click-reveal-hotspots-body-title {
        color: $btw-main-colour;
      }

      .click-reveal-hotspots-body-text {
        color: $btw-body-colour;
      }

      .click-reveal-hotspots-ins {
        background-color: $btw-background-colour;
        color: $btw-body-colour;
        padding: 1em 2.2em;
        order: 3;
      }

      .click-reveal-hotspots-video {
        position: absolute;
        width: 100%; 
        height: 100%;
        top:0;
        left:0;
        z-index: 3; 
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
      transition: all 0.5s cubic-bezier(1.0, 0.5, 0.8, 1.0);
    }
    .slide-fade-enter {
      transform: translateX(-2rem);
      opacity: 0;
    }
  
</style>
