<template>
  <div v-if="element" class="text-image grid-x container"
      v-observe-visibility="{ callback: visibilityChanged, throttle: 100, intersection: { threshold: 0.3 }, once: false }"
      :class="{ 'visible': true }" 
      role="region" level="1" >
      
    <div class="text-image-container component-container flexbox flexbox-row flexbox-justify-stretch flexbox-align-stretch" :class="element.content._classes">

      <div class="text-image-content flexbox flexbox-column" >

        <div class="text-image-topic-title btw-topic-title cell large-12 medium-12 small-12" role="heading" level="2">
          <h1 ref="accessibility" class="accessibility-region" tabindex="-1">{{getScreenAriaContent()}}</h1>
          <h3 v-html="getTopicTitle()" />
        </div>

        <div class="text-image-title btw-title cell large-12 medium-12 small-12">
          <h4 v-if="element.content.title" v-html="element.content.title" />
        </div>

        <div ref="bodyContent" class="text-image-text btw-text cell large-12 medium-12 small-12">
          <div v-html="element.content.body" />
        </div>
        
        <!-- <div class="text-image-characters">
          <img src="~@/assets/images/text-image-splash_people.png">
        </div> -->

      </div>

      <div class="text-image-image">
        <img :src="element.content._image" :aria-label="element.content._alt" v-if="$store.state.device !== 'phone'" >
        <img :src="element.content._imageMobile" :aria-label="element.content._alt" v-if="$store.state.device === 'phone'" >
      </div>

    </div>
    

  </div>
</template>

<script lang="ts">

  import { Component, Prop, Vue, Watch, Mixins } from 'vue-property-decorator';
  import BaseComponent from '@/components/BaseComponent';

  import ITextImage, {ITextImageContent } from "@/interfaces/BTW/ITextImage";

  @Component({
    components: {
      
    }
  })

  export default class TextImage extends Mixins(BaseComponent) implements ITextImage {
    @Prop({ required: true })
    protected element!: ITextImage;

    @Prop({ default: ""})
    public content!: ITextImageContent;

    private mounted() {
      //add instrucitons etc...
      this.unlockNext();
      this.hideContentForAnimation();
      this.focusStart();
    }

    private activated() {
      this.focusStart();
    }

    private hideContentForAnimation() {
      if (this.$store.state.device !== 'phone') {
        const bodyElement = (this.$refs.bodyContent as Element);
        let elNum = 0;
        if(bodyElement) {
          const _el = bodyElement as HTMLElement;
          const childrens = _el.children;

          if(childrens.length > 0) {
            [].forEach.call(childrens, function(_els, index) {
              const _el2 = _els as HTMLElement;
              if(index === childrens.length) {
                  _el2.classList.add('faded-out');
              }
              _el2.classList.remove('fade-in');
              const childrens2 = _el2.children;
              if(childrens2.length > 0) {
                [].forEach.call(childrens2, function(_els2) {
                  const _el3 = _els2 as HTMLElement;
                  const childrens3 = _el3.children;
                  elNum++;
                  if(_el3.tagName !== 'STRONG') {
                    _el3.classList.add('faded-out');
                  }
                  _el3.classList.remove('fade-in');
                });
              } 
            });
          }
        }
      }
    }

    @Watch('isActive')
    private reset() {

      if(this.isActive === true) {
        this.focusStart();
      }

      if(this.isActive === true && this.$store.state.device !== 'phone') { 
        const bodyElement = (this.$refs.bodyContent as Element);
        let elNum = 0;
        const animTime = 750;
        if(bodyElement) {
          const _el = bodyElement as HTMLElement;
          const childrens = _el.children;

          if(childrens.length > 0) {
            [].forEach.call(childrens, function(_els, index) {
              const _el2 = _els as HTMLElement;
              const childrens2 = _el2.children;
              
              if(childrens2.length > 0) {
                [].forEach.call(childrens2, function(_els2) {
                  const _el3 = _els2 as HTMLElement;
                  const childrens3 = _el3.children;

                  elNum++;
                  setTimeout(() => {
                    if(_el3.tagName !== 'STRONG') {
                      _el3.classList.add('fade-in');
                    }
                  }, elNum*animTime);

                });
              } 
            });
            if(childrens.length > 0) {
              [].forEach.call(childrens, function(_els, index) {
                const _el2 = _els as HTMLElement;
                if(index === childrens.length-1) {
                  elNum++;
                  setTimeout(() => {
                    _el2.classList.add('fade-in');
                  }, elNum*animTime);
                }
              });
            }
          }
        }
      } else {
        this.hideContentForAnimation();
      }
    }

  }

</script>

<style scoped lang="scss">

  @import "../../style/global.scss";

  .text-image {
    overflow-y: auto;
    position: relative;

    display: flex!important;
    align-items: center;


    &.container {
      padding: 0!important;
      //height: 100%!important;
    }

    .text-image-container {

      @media #{$media-phone} {
        flex-direction: column!important;
      }

      .text-image-content {
        display: flex;
        flex: 1 1 auto;
        max-width: 50%;

        position: relative;


        @media #{$media-phone} {
          width: 100%;
          max-width: 100%;
          order: 2;
        }

        padding: $container-padding-btw 0 $container-padding-btw $container-padding-btw; //$container-padding-btw;
        //overflow: hidden;
        // overflow-y: auto;

        @media #{$media-tablet-port}{
          padding: $container-padding-btw/2 0 $container-padding-btw/2 $container-padding-btw/2;
        }

        @media #{$media-phone}{
          //padding: $container-padding-btw/2 0 $container-padding-btw/2 $container-padding-btw/2;
        }


        background-color: $btw-grey; //$btw-main-colour;
        color: $btw-body-colour; //$btw-body-colour;

        .text-image-topic-title {
          color: $btw-topic-title-colour;

          h3 {
            border-bottom: 0.12em solid $btw-main-colour;
          }

        }

        .text-image-title {
          color: $btw-body-colour; //$btw-title-colour;
          margin-top: $btw-screen-title-margin-top;
          padding-right: $container-padding-btw;
        }

        .text-image-text {
          padding-right: $container-padding-btw;
        }

        &::after {
          position: absolute;
          width: 0; 
          height: 0; 
          left: 100%;
          transform: translate(0%,-50%);
          top: 50%;
          content: "";
          border-top: 0.8em solid transparent;
          border-bottom: 0.8em solid transparent; 
          border-left:0.8em solid $btw-grey; //$btw-main-colour; 
          z-index: 0;

          @media #{$media-phone} {
           // border-left:0.8em solid transparent; 
            //border-right: 0.8em solid transparent;
            //border-top: 0.8em solid transparent;
            //border-bottom:0.8em solid $btw-grey; //$btw-main-colour; 
            //left: 50%;
            //transform: translate(-50%,-100%);
            //top: 0%;
            display: none;
          }

        }

      }

      .text-image-image {
        display: flex;
        flex: 1 1 auto;

        @media #{$media-phone} {
          order: 1;
          max-height: 50vh;
        }

        img {
          object-fit: cover;
          object-position: center;
          @media #{$media-phone} {
            object-position: center top;
          }
          width: 100%;
          pointer-events: none;
        }
      }

    }

    .text-image-characters {
      position: relative;
      // left: 0;
      // top: 100%;
      // transform: translate(0%,-40%);

      animation: slide-up 0.35s;  
      }

    }

    .wide {
      .text-image-content {

        max-width: 63%!important;

        @media #{$media-laptop} {
          max-width: 63%!important;
        }

        @media #{$media-mobile} {
          max-width: 50%!important;
        }

        @media #{$media-phone} {
          max-width: 100%!important;
        }
        
      }
      .text-image-characters {
        display: none;
      }

    }

    .fullintro {

      background-color: $btw-text-intro-bg-colour!important;
      position: relative;

      &:after{
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top:0;
        left:0;
        opacity: 0.05;
        background-image: url('~@/assets/images/logo.png');
        background-size: 100%;
        background-repeat: no-repeat;
        background-position: center;
      }

      .text-image-content {
        background-color: transparent!important;
        color: $btw-text-intro-text-colour!important;
        padding: 4em!important;

        @media #{$media-phone} {
          padding: $container-padding-btw!important;
        }

        z-index: 1;
      }
      .text-image-topic-title, .text-image-content, .text-image-title  {
        color: $btw-text-intro-text-colour!important;
      }
      .text-image-content {
        width: 100%;
        max-width: 100%!important;
      }
      .text-image-image {
        display: none!important;
      }
      .text-image-topic-title h3 {
        border: 0!important;
      }
    }

  
</style>
