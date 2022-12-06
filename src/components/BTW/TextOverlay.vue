<template>
  <div v-if="element" class="text-overlay grid-x container"
      v-observe-visibility="{ callback: visibilityChanged, throttle: 100, intersection: { threshold: 0.8 }, once: false }"
         :class="{ 'visible': true }" role="region" level="1" >
         <!-- NO ACCESSSIBILITY ADDED - NOT USED IN BTW //-->
      
    <div class="text-overlay-container component-container flexbox flexbox-column flexbox-justify-stretch flexbox-align-stretch">

        <div class="text-overlay-image" >
            <img :src="element.content._image">
        </div>

    </div>

    <div class="text-overlay-title flexbox flexbox-column" >
        <div class="text-overlay-topic-title btw-topic-title cell large-12 medium-12 small-12">
            <!-- <h3 v-html="getTopicTitle()" /> -->
            <h4 v-if="element.content.title" v-html="element.content.title" />
        </div>
    </div>

    <div class="text-overlay-content flexbox flexbox-column" :style="{ 'width': element.content._props[0], 'left': element.content._props[1], 'top': element.content._props[2] }" >
        <div class="text-overlay-text btw-text cell large-12 medium-12 small-12">
          <div v-html="element.content.body" />
        </div>
    </div>

    <div class="text-overlay-ins flexbox flexbox-column" :style="{ 'width': element.content._extraProps[0], 'left': element.content._extraProps[1], 'bottom': element.content._extraProps[2] }">
        <div ref="bodyContent" class="text-overlay-text btw-text flexbox flexbox-column">
          <div class="flexbox flexbox-row">
            <img class="info-icon" src='~@/assets/images/icons/info-circle-solid.svg' />
            <div v-if="element.content.extra" class="text-overlay-extra" v-html="element.content.extra" />
          </div>
        </div>
    </div>

  </div>
</template>

<script lang="ts">

  import { Component, Prop, Vue, Watch, Mixins } from 'vue-property-decorator';
  import BaseComponent from '@/components/BaseComponent';

  import ITextOverlay, {ITextOverlayContent } from "@/interfaces/BTW/ITextOverlay";

  @Component({
    components: {
      
    }
  })

  export default class TextOverlay extends Mixins(BaseComponent) implements ITextOverlay {
    @Prop({ required: true })
    protected element!: ITextOverlay;

    @Prop({ default: ""})
    public content!: ITextOverlayContent;

    private mounted() {
      //add instrucitons etc...
      this.unlockNext();
    }

  }

</script>

<style scoped lang="scss">

  @import "../../style/global.scss";

  .text-overlay {
    overflow-y:auto;
    position: relative;

    display: flex!important;
    align-items: center;


    &.container {
      padding: 0!important;
      height: 100%!important;
    }

    .text-overlay-container {
      @media #{$media-phone} {
        flex-direction: column;
        max-height: 50%;
      }

      .text-overlay-image {
        display: flex;
        flex: 1 1 auto;
        height: 100%;
        width: 100%;

        @media #{$media-phone} {
          order: 1;
          height: auto;
          flex: 0 0 auto;
        }

        img {
          object-fit: cover;
          object-position: center;
          height: 100%;
          width: 100%;

          
        }
      }

    }

    .text-overlay-title, .text-overlay-content, .text-overlay-ins {
        position: absolute;
        padding: $container-padding-btw;

        @media #{$media-phone} {
          position: relative!important;
          width: 100%!important;
          left: 0!important;
          top: 0!important;
          height: auto!important;
        }
    }

    .text-overlay-title {
        top:0;
        left:0;

        @media #{$media-phone} {
          padding: $container-padding-btw $container-padding-btw $container-padding-btw/2  $container-padding-btw;
        }
    }

    .text-overlay-content {
        background-color: rgba(255,255,255,0.7);
        animation: opacity-in 1s;
        
        @media #{$media-phone} {
          padding: $container-padding-btw/2  $container-padding-btw;
        }
    }

    .text-overlay-ins {
        background-color: rgba(255,255,255,1);
        animation: opacity-in 2s;
    }

    .text-overlay-extra {
        color: $btw-main-colour;
        margin-bottom: $container-padding-btw/2;
    }

  }

  
</style>
