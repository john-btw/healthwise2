<template>
  <div v-if="element" class="click-reveal-images grid-x container"
     v-observe-visibility="{ callback: visibilityChanged, throttle: 100, intersection: { threshold: 0.8 }, once: false }"
      :class="{ 'visible': true }" 
      @scroll="reset"
      role="region" level="1" >
      
    <div class="click-reveal-images-container component-container flexbox flexbox-column flexbox-justify-stretch flexbox-align-stretch">

      <div class="click-reveal-images-content component-header background-colour-content flexbox flexbox-column" >

        <div class="click-reveal-images-topic-title btw-topic-title cell large-12 medium-12 small-12" role="heading" level="2" >
          <h1 ref="accessibility" class="accessibility-region" tabindex="-1">{{getScreenAriaContent()}}</h1>
          <h3 v-html="getTopicTitle()" />
        </div>

        <div class="click-reveal-images-title btw-title cell large-12 medium-12 small-12">
          <h4 v-if="element.content.title" v-html="element.content.title" />
        </div>

        <div class="click-reveal-images-text btw-text cell large-12 medium-12 small-12">
          <div v-html="element.content.body" />
        </div>

      </div>

      <div class="click-reveal-images-image flexbox flexbox-row flexbox-justify-stretch flexbox-align-stretch" >
        <!-- <img :src="element.content._image"> -->

        <button class="reveal-image flexbox" v-for="(reveal, index) in element.content.reveals" 
            :key="index"
            @click="showReveal(reveal, index)"
            :class="{ 'visited': revealsVisited[index] === true }" 
            role="button" tabindex="0"
            :aria-label="$store.state.courseContent.global._accessibility.itemtitle + ' ' + (index+1)" >

          <img :src="getImage(reveal, index)" :aria-label="getImageAlt(reveal)" :aria-hidden="getImageAlt(reveal) === '' ? true : false" />

          <div :key="'reveal-fade'+index" class="reveal-image-fade" v-show="revealsVisited[index] === true" />
          <div :key="'reveal'+index" class="reveal-bg" v-show="$data.revealIndex === index && $store.state.device !== 'phone'" />

          <div class="reveal-content" :class="{ 'translated' : $store.state.language !== 'en' }" v-show="$data.revealIndex === index && $store.state.device !== 'phone'" >
            <div class="carousel-body-title btw-title cell large-12 medium-12 small-12">
              <h4 :key="reveal.title" v-html="reveal.title" ref="revealcontent" tabindex="-1" />
            </div>
            <div class="carousel-body-text btw-text cell large-12 medium-12 small-12">
              <div :key="reveal.content" v-html="reveal.content" />
            </div>
          </div>
        </button>

      </div>

      <div ref="bodyContent" class="reveal-images-ins-text btw-text flexbox" >
        <div v-if="viewedAll === true" v-html="setInstructions()" />
      </div>

    </div>

  </div>
</template>

<script lang="ts">

  import { Component, Prop, Vue, Watch, Mixins } from 'vue-property-decorator';
  import BaseComponent from '@/components/BaseComponent';

  import IClickRevealImages, { IClickRevealImagesContent, IClickRevealImage } from "@/interfaces/BTW/IClickRevealImages";

  @Component({
    components: {
      
    }
  })

  export default class ClickRevealImages extends Mixins(BaseComponent) implements IClickRevealImages {
    @Prop({ required: true })
    protected element!: IClickRevealImages;

    @Prop({ default: ""})
    public content!: IClickRevealImagesContent;

    @Prop({ default: ""})
    public reveals!: IClickRevealImage[];


    private revealsVisited: boolean[] = [];
    private revealIndex: number = -1;

    private viewedAll: boolean = false;

    private getImage(reveal: any, index: number) {
      let image = reveal._image;
      return image;
    }

    private getImageAlt(reveal: any) {
      let alt = '';
      if(reveal.alt) {
         alt = reveal._alt;
       }
      return alt;
    }

    
    private showReveal(reveals: any, index: number) {
        
      this.$data.revealIndex = index;

      if (this.$store.state.device === 'phone') {
        let popupData = { title: this.element.content.reveals[this.$data.revealIndex].title, body: this.element.content.reveals[this.$data.revealIndex].content };
        this.$store.getters.showPopup(popupData);
      } else {
        //focus on the title of the new reveal
        //this.$store.getters.setAccessibilityFocus(this.$refs.revealcontent);
      }

      Vue.set(this.revealsVisited, index, true);

      this.checkAllVisited();
    }

    private setInstructions() {
      let ins = this.$store.state.courseContent.global.continueIns;
        if (this.$store.state.device === 'phone') {
          ins = this.$store.state.courseContent.global.continueMobileIns;
        }
        if(this.$store.state.device === 'phone' && this.$store.getters.checkIfLastScreenInPage(this.element._id)) {
          ins = this.$store.state.courseContent.global.continueMobileLastIns;
        }
      const bodyElement = (this.$refs.bodyContent as Element);
      if(bodyElement) {
        const collection = document.getElementsByClassName("faded-out");
        for (let i = 0; i < collection.length; i++) {
          collection[i].classList.remove('faded-out');
        }
      }

      return ins;
    }

    private mounted() {
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
      if (complete && this.viewedAll === false) {
        // enable the next button
        this.unlockNext();
        this.viewedAll = true;
      }
    }

    @Watch('isActive')
    private reset() {

      if(this.isActive === true) { 
        this.focusStart();

        if (this.$store.state.device !== 'phone') {
          this.$data.revealIndex = -1;
          //reset viewed
          this.element.content.reveals.forEach((item: any, index: number) => {
              this.revealsVisited[index] = false;
          });
          Vue.set(this.revealsVisited, this.element.content.reveals.length-1, false);
        }
      }
      
      
    }


  }

</script>

<style scoped lang="scss">

  @import "../../style/global.scss";

  .click-reveal-images {
    overflow-y:auto;
    position: relative;

    display: flex!important;
    align-items: center;


    &.container {
      padding: 0!important;
      //height: 100%!important;
    }

    .reveal-images-ins-text {
      background-color: $btw-background-colour;
      color: $btw-body-colour;
      padding: 1em 3em;
      order: 3;
    }

    .click-reveal-images-container {

      @media #{$media-phone} {
        flex-direction: column!important;
      }

      .click-reveal-images-content {
        display: flex;
        flex: 0 0 auto;

        @media #{$media-phone} {
          width: 100%;
          max-width: 100%;
          order: 1;
        }

        padding: $container-padding-btw/2 $container-padding-btw;
        overflow: hidden;
        overflow-y: auto;

        .click-reveal-images-topic-title {
          color: $btw-topic-title-colour;
        }

        .click-reveal-images-title {
          color: $btw-title-colour;
        }
      }

      .click-reveal-images-image {
        
        display: flex;
        flex: 1 1 auto;
        overflow: hidden;
        height: 100%;

         @media #{$media-phone} {
            //flex-direction: column;
         }
        
        .reveal-image {
          display: flex;
          flex: 1 1 auto;
          height: 100%;
          position: relative;
          min-height: 100%;
          
           &:first-of-type {
            border-right: 0.3em solid $btw-grey;
          }

          @media #{$media-mobile} {
            //flex: 0 0 auto;
            max-width: 50%;
            height: 100%;
          }

          @media #{$media-phone} {
            //min-height: 65vh;
            max-width: 100%;
          }

          cursor: pointer;
          
          img {
            object-fit: cover;
            object-position: center;
            min-height: 100%;
            height: 100%;
            width: 100%;

            @media #{$media-phone} {
              //height: 65vh;
            }
          }

          .reveal-bg, .reveal-content {
            position: absolute;
            top: 0;
            left:0;
            width: 90%;
            height: 75%;
            @media #{$media-laptop} {
              height: 90%;
            }

            &.translated {
              //font-size: 94%;
            }
            
            box-sizing: border-box;
            margin: 5%;
            animation: opacity-in-fade .5s;

            @media #{$media-mobile} {
              margin: 2%;
              width: 96%;
              height: 95%;
            }

            @media #{$media-phone} {
              height: 90%;
            }
          }

          .reveal-content {
            @media #{$media-mobile} {
              height: auto;
            }
            @media #{$media-phone} {
              height: auto;
            }
          }

          .reveal-image-fade {
            background-color: $btw-main-colour;
            opacity: 0.65;

            position: absolute;
            top: 0;
            left:0;
            width: 100%;
            height: 100%;

          }

          .reveal-bg {
            background-color: $btw-grey; //$btw-background-colour;
            opacity: 0.9;

            &:after {
              position: absolute;
              width: 0; 
              height: 0; 
              left: 50%;
              transform: translate(-50%,0%);
              top: 100%;
              content: "";
              border-left:0.8em solid transparent; 
              border-right: 0.8em solid transparent;
              border-bottom: 0.8em solid transparent;
              border-top:0.8em solid $btw-grey; //$btw-background-colour; 
            }
          }

          .reveal-content {
            padding: $container-padding-btw;
            color: $btw-body-colour;

            text-align: left;

            @media #{$media-mobile} {
              padding: 1.2em;
               margin: 4%;
              width: 92%;
              
            }

            h4 {
              color: $btw-body-colour;
            }
          }

        }

        @media #{$media-phone} {
          order: 2;
        }

        
      }

    }

  }

  
</style>
