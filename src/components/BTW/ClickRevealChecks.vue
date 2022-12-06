<template>
  <div v-if="element" class="click-reveal-checks grid-x container"
      v-observe-visibility="{ callback: visibilityChanged, throttle: 100, intersection: { threshold: 0.8 }, once: false }"
      :class="{ 'visible': true }" 
      @scroll="reset" 
      role="region" level="1" >
      
    <div class="click-reveal-checks-container component-container flexbox flexbox-row flexbox-justify-stretch flexbox-align-stretch">

      <div class="click-reveal-checks-header background-colour-content flexbox flexbox-column flexbox-wrap" >

        <div class="click-reveal-checks-topic-title btw-topic-title cell large-12 medium-12 small-12" role="heading" level="2" >
          <h1 ref="accessibility" class="accessibility-region" tabindex="-1">{{getScreenAriaContent()}}</h1>
          <h3 v-html="getTopicTitle()" />
        </div>

        <div class="click-reveal-checks-title btw-title cell large-12 medium-12 small-12">
          <h4 v-if="element.content.title" v-html="element.content.title" />
          <div v-if="element.content.body" class=" btw-text cell large-12 medium-12 small-12" v-html="element.content.body" />
        </div>

        <div class="click-reveal-checks-items flexbox flexbox-row">

          <button class="reveal-item flexbox flexbox-justify-center flexbox-align-center" v-for="(reveal, index) in element.content.reveals" 
            :key="index"
            @click="showReveal(index)" 
            role="button" tabindex="0"
            :aria-label="$store.state.courseContent.global._accessibility.checktitle + ' ' + (index+1)" >
              <h3 v-html="reveal.checkTitle" />
              <div>
                <img class="reveal-tick" src="~@/assets/images/icons/check-solid.svg" v-show="revealsVisited[index] === true"/>
              </div>
          </button>

        </div>

      </div>


      <div class="click-reveal-checks-image flexbox flexbox-column flexbox-justify-stretch flexbox-align-stretch" >

        <transition name="fade">
          <img :key="getImage()" :src="getImage()"  :aria-label="getImageAlt()" :aria-hidden="getImageAlt() === '' ? true : false" :class="{ 'reveal-image': $data._revealIndex > -1 }">
        </transition>

        <div class="click-reveal-checks-content-body " v-show="$data._revealIndex > -1">

          <div class="click-reveal-checks-body-title btw-title cell large-12 medium-12 small-12">
            <transition name="fade">
              <h4 :key="'title'+$data._revealIndex" v-if="contentTitle !== ''" v-html="contentTitle" ref="revealcontent" tabindex="-1" />
            </transition>
          </div>
          <div class="click-reveal-checks-body-text btw-text cell large-12 medium-12 small-12">
            <transition name="fade">
              <div :key="'body'+$data._revealIndex" v-html="contentBody" />
            </transition>
          </div>
          <transition name="fade">
          <div :key="$data._revealIndex" ref="bodyContent" v-show="viewedAll === true" class="carousel-body-text btw-text cell large-12 medium-12 small-12" v-html="setInstructions()" />
          </transition>

        </div>

      </div>

    </div>

  </div>
</template>

<script lang="ts">

  import { Component, Prop, Vue, Watch, Mixins } from 'vue-property-decorator';
  import BaseComponent from '@/components/BaseComponent';

  import IClickRevealChecks, { IClickRevealCheckContent, IClickRevealCheckItems } from "@/interfaces/BTW/IClickRevealChecks";

  @Component({
    components: {
     
    }
  })

  export default class ClickRevealChecks extends Mixins(BaseComponent) implements IClickRevealChecks {
    @Prop({ required: true })
    protected element!: IClickRevealChecks;

    @Prop({ default: ""})
    public content!: IClickRevealCheckContent;

    @Prop({ default: ""})
    public reveals!: IClickRevealCheckItems[];

    private _revealIndex: number = -1;

    private contentTitle: string = '';
    private contentBody: string = '';

    private viewedAll: boolean = false;

    private revealsVisited: boolean[] = [];


    private getImage() {
      let img = this.element.content._image;
      if (this.$data._revealIndex > -1) {
        if (this.$store.state.device === 'phone') {
          img = this.element.content.reveals[this.$data._revealIndex]._imageMobile;
        } else {
          img = this.element.content.reveals[this.$data._revealIndex]._image;
        }
      }
      return img;
    }

    private getImageAlt() {
      let alt = '';
      if(this.element.content._alt) {
         alt = this.element.content._alt;
      }
      if (this.$data._revealIndex > -1) {
        if(this.element.content.reveals[this.$data._revealIndex]._alt) {
          alt = this.element.content.reveals[this.$data._revealIndex]._alt;
        }
      }
      return alt;
    }

    private getContent() {
      this.contentTitle = this.element.content.reveals[this.$data._revealIndex].title;
      this.contentBody = this.element.content.reveals[this.$data._revealIndex].content;
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
    }

    private showReveal(_index: number) {
      this.$data._revealIndex = _index;
      this.getContent();

      //focus on the title of the new reveal
      this.$store.getters.setAccessibilityFocus(this.$refs.revealcontent);

      Vue.set(this.revealsVisited, _index, true);

      this.checkAllVisited();
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
      if (complete) {
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
          this.$data._revealIndex = -1;
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

  .click-reveal-checks {
    overflow: hidden;
    overflow-y:auto;
    position: relative;

    display: flex!important;
    align-items: center;


    &.container {
      padding: 0!important;
      height: 100%!important;
    }

    .click-reveal-checks-container {

      @media #{$media-phone} {
        flex-direction: column;
      }

      .click-reveal-checks-image {
        display: flex;
        flex: 1 1 auto;

        position: relative;

        img {
          object-fit: cover;
          object-position: center;
          flex: 1 1 auto;

          &.reveal-image {
            height: 50%;
            flex: 0 0 auto;

            @media #{$media-phone} {
              height: 100%;
              flex: 1 1 auto;
              order: 2;
            }
          }
        }

      }

      
      .click-reveal-checks-header {
        background-color: $btw-background-colour;
        padding: $container-padding-btw;

        width: 30%;
        flex: 0 0 auto;
        z-index: 1;

        @media #{$media-phone} {
          width: 100%;
        }

        h3 {
           color: $btw-topic-title-colour;
        }

        div {
          color: $btw-body-colour;
        }

        .click-reveal-checks-items {
          
          margin-top: $container-padding-btw;

           @media #{$media-phone} {
            margin-top: $container-padding-btw/2;
           }

          flex-wrap: wrap;
          
          .reveal-item {
            width: 50%;
            flex: 0 0 auto;
            margin-bottom: $container-padding-btw/2;

            cursor: pointer;

            h3 {
              color: $btw-body-colour;
            }

            div {
              border: 1px solid $btw-topic-title-colour;
              width: 6em;
              height: 4.5em;

              .reveal-tick {
                object-fit: contain;
                width: 100%;
                height: 100%;

                animation: opacity-in 0.5s;
              }
            }
          }
        }

        &::after {
          position: absolute;
          width: 0; 
          height: 0; 
          left: 30%;
          transform: translate(0%,-50%);
          top: 75%;
          content: "";
          border-top: 0.6em solid transparent;
          border-bottom: 0.8em solid transparent; 
          border-left:0.8em solid $btw-background-colour; 

          @media #{$media-phone} {
            display: none;
          }

        }
      }

      .click-reveal-checks-content-main, .click-reveal-checks-content-body {
        padding: $container-padding-btw;

        @media #{$media-phone} {
          width: 100%!important;
        }
        
      }

      .click-reveal-checks-content-main {
        width: 35%;

        @media #{$media-phone} {
          width: 100%;
        }
        
        position: relative;

        z-index: 1;
      }

      .click-reveal-checks-content-body {
        width: 100%;
        background-color: $btw-grey;
        height: 50%;
        bottom: 0%;
        left:0;
        position: absolute;

        @media #{$media-phone} {
          height: 100%;
          flex: 1 1 auto;
          position: relative;
        }
      }

      .click-reveal-checks-body-title {
        color: $btw-main-colour;
      }

      .click-reveal-checks-body-text {
        color: $btw-body-colour;
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
