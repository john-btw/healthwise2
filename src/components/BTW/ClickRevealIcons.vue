<template>
  <div v-if="element" class="click-reveal-icons grid-x container"
      v-observe-visibility="{ callback: visibilityChanged, throttle: 100, intersection: { threshold: 0.8 }, once: false }"
      :class="{ 'visible': true }" 
      @scroll="reset"
      role="region" level="1" >
      
    <div class="click-reveal-icons-container component-container flexbox flexbox-column flexbox-justify-stretch flexbox-align-stretch"
          v-show="!showVideo">

      <div class="click-reveal-icons-header component-header flexbox flexbox-column" >

        <div class="media-topic-title btw-topic-title cell large-12 medium-12 small-12" role="heading" level="2" >
          <h1 ref="accessibility" class="accessibility-region" tabindex="-1">{{getScreenAriaContent()}}</h1>
          <h3 v-html="getTopicTitle()" />
        </div>

        <div class="media-title btw-title cell large-12 medium-12 small-12">
          <!-- <h4 v-if="element.content.title" v-html="element.content.title" /> -->
          <div v-if="element.content.body" class=" btw-text cell large-12 medium-12 small-12" v-html="element.content.body" />
        </div>

      </div>


      <div class="click-reveal-icons-image" >

        <img class="background-image" :src="getImage()" :aria-label="getImageAlt()" :aria-hidden="getImageAlt() === '' ? true : false" >

        <div class="click-reveal-icons-main flexbox flexbox-row flexbox-justify-center flexbox-align-stretch" :class="{ 'rows': element.content._rows > 1 }" >

          <button class="reveal-item flexbox flexbox-justify-center flexbox-align-center" v-for="(reveal, index) in element.content.reveals" 
            :key="index"
            :style="{ 'width': ((100/element.content.reveals.length)*1)+'%' }"
            @click="showReveal(index)" 
            role="button" tabindex="0"
            :aria-label="$store.state.courseContent.global._accessibility.icontitle + ' ' + (index+1)">
            <img :src="reveal._image" v-if="revealsVisited[index] === false"/>
            <img :src="reveal._imageVisited" v-if="revealsVisited[index] === true"/>
          </button>

        </div>

      </div>

      <div class="click-reveal-icons-content background-colour-content flexbox flexbox-row flexbox-justify-stretch flexbox-align-stretch" >
        
        <div class="click-reveal-icons-content-main component-side">
          <div class="click-reveal-icons-title btw-title cell large-12 medium-12 small-12">
            <h4 v-if="element.content.title" v-html="element.content.title" />
          </div>

          <div class="click-reveal-icons-text btw-text cell large-12 medium-12 small-12">
            <div ref="bodyContent" v-html="element.content.content" />
          </div>

          <div v-html="element.content.ins" :class="{ 'ins-padding': $store.getters.getContentStatus(element._id, 'complete') === false, 'de': $store.state.language === 'de' }" v-if="allViewed === false" />
        </div>

        <div class="click-reveal-icons-content-body" v-if="$store.state.device !== 'phone'">
          <div class="click-reveal-icons-body-title btw-title cell large-12 medium-12 small-12">
            <transition name="fade">
              <h4 :key="contentTitle" v-if="contentTitle !== ''" v-html="contentTitle" ref="revealcontent" tabindex="-1" />
            </transition>
          </div>
          <div class="click-reveal-icons-body-text btw-text cell large-12 medium-12 small-12">
            <transition name="fade">
              <div :key="contentBody" v-html="contentBody" />
            </transition>
          </div>
          
        </div>

      </div>

    </div>

    <div ref="bodyContent" class="click-reveal-icons-ins btw-text cell large-12 medium-12 small-12" v-if="$store.state.device === 'phone'" >
        <div />
      </div>
    
    <transition name="fade">
    <media key="video" class="click-reveal-icons-video flexbox" v-if="element.content._video && showVideo" :element="element.content._video" @afterVideo="hideVideo" 
    :aria-label="$store.state.courseContent.global._accessibility.containsmedia" tabindex="0" />
    </transition>


  </div>
</template>

<script lang="ts">

  import { Component, Prop, Vue, Watch, Mixins } from 'vue-property-decorator';
  import BaseComponent from '@/components/BaseComponent';

  import Media from "@/components/BTW/Media.vue";

  import IClickRevealIcons, { IClickRevealIconContent, IClickRevealIconsItems } from "@/interfaces/BTW/IClickRevealIcons";

  @Component({
    components: {
      Media
    }
  })

  export default class ClickRevealIcons extends Mixins(BaseComponent) implements IClickRevealIcons {
    @Prop({ required: true })
    protected element!: IClickRevealIcons;

    @Prop({ default: ""})
    public content!: IClickRevealIconContent;

    @Prop({ default: ""})
    public reveals!: IClickRevealIconsItems[];

    private _revealIndex: number = -1;

    private contentTitle: string = '';
    private contentBody: string = '';

    private revealsVisited: boolean[] = [];

    private showVideo = false;

    private allViewed: boolean = false;

    private hideVideo() {
      this.showVideo = false;

      this.$store.state.subtitles = false;
      //this.$store.state.showSubtitles = false;
      this.$store.getters.write; 
    }

    private getImage() {
      let img = this.element.content._image;
      if(this.$store.state.device === 'phone') {
        img = this.element.content._imageMobile;
      }
      return img;
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
      this.getContent();

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
      if (this.element.content._video) {
        this.showVideo = true;
      }
      this.element.content.reveals.forEach((item: any, index: number) => {
          this.revealsVisited.push(false);
      });
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

        this.allViewed = true;
      }
    }

    @Watch('isActive')
    private reset() {

      if(this.isActive === true) { 
        this.focusStart();

        if (this.$store.state.device !== 'phone') {
          this.$data._revealIndex = -1;
          //reset visible text
          this.contentTitle = '';
          this.contentBody = '';
          //reset viewed
          //this.allViewed = false;
          // this.element.content.reveals.forEach((item: any, index: number) => {
          //     this.revealsVisited[index] = false;
          // });
          // Vue.set(this.revealsVisited, this.element.content.reveals.length-1, false);
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

  .click-reveal-icons {
    overflow: hidden;
    overflow-y:auto;
    position: relative;

    display: flex!important;
    align-items: center;

    overflow: hidden;


    &.container {
      padding: 0!important;
      height: 100%!important;
    }

    
    .background-image {
      width: 100%;
    }

    .click-reveal-icons-container {

      .click-reveal-icons-content {
        display: flex;
        flex: 1 1 auto;
        overflow: hidden;
        // overflow-y: auto;

         @media #{$media-phone} {
          flex-direction: column;
          flex: 0 0 auto;
          overflow: visible;
          height: auto;

          order: 1;
        }

        background-color: $btw-background-colour;
        color: $btw-body-colour;

        .text-image-title {
          color: $btw-title-colour;
          margin-top: 2.2em;
        }

      }

      .click-reveal-icons-image {
        display: flex;
        flex: 1 1 auto;

        max-height: 50%;
        height: 50%;

        @media #{$media-mobile} {
          height: 40%;
          max-height: 40%;
        }
        @media #{$media-phone} {
          order: 2;
        }

        position: relative;

        img {
          object-fit: cover;
          object-position: center;
        }

        .click-reveal-icons-main {
          position: absolute;
          top:0;
          left:0;
          width: 100%;
          height: 100%;

          //@media #{$media-phone} {
            padding: 0 $container-padding-btw;
          //}
          
          &.rows {

            padding: 0 15%;
            flex-wrap: wrap;

            .reveal-item {
              flex: 0 0 auto;
            }
          }

          .reveal-item {
            flex: 1 1 auto;
            cursor: pointer;
            animation: grow-in 1s;
          }
        }

      }

      
      .click-reveal-icons-header {
        padding: $container-padding-btw $container-padding-btw $container-padding-btw/2 $container-padding-btw;

        h3 {
           color: $btw-topic-title-colour;
        }

        div {
          color: $btw-body-colour;
        }

        @media #{$media-phone} {
          
        }

      }

      .click-reveal-icons-content-main, .click-reveal-icons-content-body {
        padding: $container-padding-btw/2 $container-padding-btw 0 $container-padding-btw;

        //overflow: hidden;
        //overflow-y: auto;

        .ins-padding {
          padding-top: 2.5em;

          &.de {
            padding-top: 1em;
          }
        }

        @media #{$media-phone} {
          width: 100%!important;

          overflow: visible;
          padding: $container-padding-btw/2 $container-padding-btw;
        }
        
      }

      .click-reveal-icons-content-main {
        width: 40%;
        position: relative;

        z-index: 1;
      }

      .click-reveal-icons-content-body {
        width: 61%;
        background-color: $btw-grey;
      }

      .click-reveal-icons-body-title {
        color: $btw-main-colour;
      }

      .click-reveal-icons-body-text {
        color: $btw-body-colour;
      }

    }

    .click-reveal-icons-video {

        //aspect-ratio: 4/3;
        height: 100%;

        width: 100%!important;
        max-width: 1024px!important;

        @media #{$media-phone} {
          height: auto!important;
          max-height: none!important;
          aspect-ratio: unset;
        }

        z-index: 3; 
      }

    .click-reveal-icons-ins {
      background-color: $btw-background-colour;
      color: $btw-body-colour;
      padding: 1em 2.2em;
      order: 3;
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
