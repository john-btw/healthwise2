<template>
  <div v-if="element" class="steps grid-x container flexbox flexbox-column flexbox-justify-stretch flexbox-align-stretch"
     v-observe-visibility="{ callback: visibilityChanged, throttle: 100, intersection: { threshold: 0.3 }, once: false }"
        :class="{ 'visible': true }" 
        @scroll="reset"
        role="region" level="1" >

      <div class="steps-container-main component-container flexbox flexbox-column flexbox-justify-stretch flexbox-align-stretch">
      
     <div class="steps-container flexbox flexbox-column flexbox-justify-stretch flexbox-align-stretch">

        <h1 ref="accessibility" class="accessibility-region" tabindex="-1">{{getScreenAriaContent()}}</h1>
        
        <div class="steps-image" v-for="(step, index) in element.content._steps" :key="index+'img'">
         <!-- <transition name="fade"> -->
            <img :src="element.content._image" :aria-label="getImageAlt()" :aria-hidden="getImageAlt() === '' ? true : false" v-show="$data._stepIndex === -1"> 
          <!-- </transition> -->
          <!-- <transition name="fade"> -->
            <img :src="getImage()" :aria-label="getImageAlt()" :aria-hidden="getImageAlt() === '' ? true : false" v-show="index === $data._stepIndex"> 
          <!-- </transition> -->
        </div>

        <div class="steps-main flexbox flexbox-column flexbox-justify-center flexbox-align-center" v-if="element.content._images === false">
          <div class="steps-noimg-container flexbox flexbox-row flexbox-justify-center flexbox-align-center" >
            <div class="steps-noimg-left" >
              <h4 v-if="element.content.title" v-html="element.content.title" />
              <div ref="bodyContent" v-html="element.content.body" />
              <transition name="fade">
                <button :key="$data._stepIndex" class="arrow-icon steps-icon" 
                @click="nextStep" v-show="$data._stepIndex < element.content._steps.length-1" 
                role="button" tabindex="0"
                :aria-label="$store.state.courseContent.global._accessibility.next" />
              </transition>
            </div>
            <div class="steps-noimg-right">
              <transition name="fade">
                <h4 :key="getStepTitle()" class="steps-noimg-title btw-title" v-if="getStepTitle() !== ''" v-html='getStepTitle()' ref="stepcontent" tabindex="-1" />
              </transition>
              <transition name="fade">
                <div :key="getStepText()" class="steps-noimg-text btw-text" v-if="getStepText() !== ''" v-html='getStepText()' />
              </transition>
            </div>
          </div>
        </div>

    </div>

    <div class="steps-title flexbox flexbox-column">
        <div class="steps-topic-title btw-topic-title cell large-12 medium-12 small-12" role="heading" level="2" ref="stepstopictitle">
            <h3 v-html="getTopicTitle()" />
        </div>

        <div class="steps-content-multiple flexbox flexbox-column" v-if="element.content._multiple === true" >
            <div class="text-image-title btw-title cell large-12 medium-12 small-12">
              <h4 v-if="element.content.title" v-html="element.content.title" />
            </div>
            <div ref="bodyContent" class="text-image-text btw-text cell large-12 medium-12 small-12">
              <div v-html="element.content.body" />
            </div>
            <div class="" v-html="element.content.ins" v-if="element.content.ins && $data._stepIndex < 0 && $store.state.device !== 'phone'" />
        </div>

    </div>

    <div class="steps-content flexbox flexbox-column" 
          :style="{ 'width': element.content._props ? element.content._props[0] : '', 'height': element.content._props ? element.content._props[1] : '', 'left': element.content._props ? element.content._props[2] : '', 'top': element.content._props ? element.content._props[3]: '' }"
          v-if="element.content._images === true && element.content._multiple === false" >
        
        <div class="steps-img-title btw-title cell large-12 medium-12 small-12">
          <transition name="fade">
            <h4 :key="getStepImagesTitle()" v-if="getStepImagesTitle() !== ''" v-html="getStepImagesTitle()" ref="stepcontent" tabindex="-1" />
          </transition>
        </div>
        <div class="steps-img-text background-colour-content btw-text cell large-12 medium-12 small-12">
          <transition name="fade">
            <div :key="getStepImagesText()" ref="bodyContent" v-html="getStepImagesText()" />
          </transition>
        </div>
    </div>

    <div class="steps-multiple-content" v-if="element.content._images === true && element.content._multiple === true">
        <div class="step-content-multiple"
          :style="{ 'width': step._props ? step._props[2] : '', 'left': step._props ? step._props[0] : '', 'top': step._props ? step._props[1]: '' }"
          v-for="(step, index) in element.content._steps" 
          :key="index" v-show="(index <= $data._stepIndex) || $store.state.device === 'phone'">
              <div class="steps-img-title btw-title cell large-12 medium-12 small-12">
                <transition name="fade">
                  <h4 :key="step.title" v-if="step.title" v-html="step.title" :ref="'stepcontent'+index" tabindex="-1" />
                </transition>
              </div>
              <div class="steps-img-text btw-text cell large-12 medium-12 small-12" >
                <transition name="fade">
                  <div :key="step.content" v-html="step.content" :ref="'stepbody'+index" />
                </transition>
              </div>
        </div>
    </div>

    <div class="steps-ins flexbox flexbox-column" 
          :style="{ 'width': element.content._extraProps ? element.content._extraProps[0] : '', 'left': element.content._extraProps ? element.content._extraProps[1] : '', 'bottom': element.content._extraProps ? element.content._extraProps[2] : '' }"
          :class="{ 'visible': $data.showExtra === true}"
          v-if="(element.content._images === true && element.content.extra && $data._stepIndex === element.content._steps.length-1) || (element.content._images === true && element.content.extra && $store.state.device === 'phone')" >
        <div ref="bodyContent" class="steps-text btw-text flexbox flexbox-column">
          <div class="flexbox flexbox-row">
            <img class="info-icon" src='~@/assets/images/icons/info-circle-solid.svg' />
            <div class="steps-extra" v-html="element.content.extra" />
          </div>
        </div>
    </div>

    <transition name="fade">
      <button v-if="element.content._images === true && (($store.state.device === 'phone' && element.content._multiple === false) || ($store.state.device !== 'phone'))" 
          class="arrow-icon arrow-icon-images steps-icon" 
          :class="{ 'visible': ($data._stepIndex === -1 || $data.showNext === true), 'not-visible': $data.showNext === false }"
          :key="$data._stepIndex" 
          :style="{ 'left': element.content._arrowProps ? element.content._arrowProps[0] : '', 'top': element.content._arrowProps ? element.content._arrowProps[1] : '' }"
          @click="nextStep" v-show="$data._stepIndex < element.content._steps.length-1" 
          role="button" tabindex="0"
          :aria-label="$store.state.courseContent.global._accessibility.next" />
    </transition>

  </div>

  </div>
</template>

<script lang="ts">

  import { Component, Prop, Vue, Watch, Mixins } from 'vue-property-decorator';
  import BaseComponent from '@/components/BaseComponent';

  import ISteps, {IStepsContent } from "@/interfaces/BTW/ISteps";

  @Component({
    components: {
      
    }
  })

  export default class Steps extends Mixins(BaseComponent) implements ISteps {
    @Prop({ required: true })
    protected element!: ISteps;

    @Prop({ default: ""})
    public content!: IStepsContent;

    private _stepIndex: number = -1;

    private showExtra: boolean = false;
    private totalAnimTime: number = 0;

    private showNext: boolean = true;

    private mounted() {
      if (this.element.content._multiple === true && this.$store.state.device === 'phone') {
        Vue.nextTick(() => {
          this.unlockNext();
          // console.log('mounted >> unlockNext');
          this.focusStart();
        });
      }
      this.hideContentForAnimation(this.$refs.stepbody0);
      this.hideContentForAnimation(this.$refs.stepbody1);

    }

    private activated() {
      this.focusStart();
    }

    private getImage() {
      let img = this.element.content._image;
      if (this.element.content._images === true) {
        if (this.$data._stepIndex >= 0) {
          img = this.element.content._steps[this.$data._stepIndex]._image;
        }
      }
      //mobile
      // if (this.$store.state.device === 'phone') {
      //   const str = img.split(".");
      //   img = str[0] + '_mobile.' + str[1];
      // }
      return img;
    }

    private getImageAlt() {
      let alt = '';
      if(this.element.content._image && this.element.content._alt) {
        alt = this.element.content._alt;
      }
      if (this.element.content._images) {
        if(this.element.content._steps) {
          if (this.element.content._steps[this.$data._stepIndex] && this.element.content._steps[this.$data._stepIndex]._alt) {
            alt = this.element.content._steps[this.$data._stepIndex]._alt;
          }
        }
      }
      return alt;
    }

    private getStepTitle() {
      let title = '';      
      if (this.$data._stepIndex >= 0) {
        title = this.element.content._steps[this.$data._stepIndex].title;
      }
      return title;
    }

    private getStepText() {
      let text = '';
      if (this.$data._stepIndex >= 0) {
        text = this.element.content._steps[this.$data._stepIndex].content;
      }
      return text;
    }

    private getStepImagesTitle() {
      let title = this.element.content.title ? this.element.content.title : '';     
      if (this.$data._stepIndex >= 0) {
        title = this.element.content._steps[this.$data._stepIndex].title;
      }
      return title;
    }

    private getStepImagesText() {
      let text = this.element.content.body ? this.element.content.body : '';     
      if (this.$data._stepIndex >= 0) {
        text = this.element.content._steps[this.$data._stepIndex].content;
      }
      return text;
    }

    private nextStep() {

      this.$data.showNext = false;
      this.$data.showExtra = false;

      this.$data._stepIndex++;
      
      if (this.$data._stepIndex === this.element.content._steps.length-1) {
        // enable the next button
        Vue.nextTick(() => {
          //this.unlockNext();
        });
      }

      if(this.element.content._multiple === true) {
        //focus on the title of the new step content
        switch(this.$data._stepIndex) {
          case 0:
            this.$store.getters.setAccessibilityFocus(this.$refs.stepcontent0);
            break;
          case 1:
            this.$store.getters.setAccessibilityFocus(this.$refs.stepcontent1);
            break;
        }   
        
      } else {
        //focus on the title of the step content
        this.$store.getters.setAccessibilityFocus(this.$refs.stepcontent);
      }
        
    }

    private hideContentForAnimation(refVar: any) {
      if (this.$store.state.device !== 'phone') {
        const stepElement = (refVar as Element);
        let elNum = 0;
        if(stepElement) {
          const _el = stepElement as HTMLElement;
          const childrens = (refVar).children ? (refVar).children : _el;
         // console.log(stepElement, _el, _el.children, _el[0].children, _el.childNodes);

          if(childrens && childrens.length > 0) {
              [].forEach.call(childrens, function(_els, index) {
              const _el2 = _els as HTMLElement;
              _el2.classList.add('faded-out');
              _el2.classList.remove('fade-in');
              const childrens2 = _el2.children ? _el2.children : null;

              if(childrens2 && childrens2.length > 0) {
                [].forEach.call(childrens2, function(_els2) {
                  const _el3 = _els2 as HTMLElement;
                  _el3.classList.add('faded-out');
                  _el3.classList.remove('fade-in');
                  const childrens3 = _el3.children;
                  
                  if(childrens3 && childrens3.length > 0) {
                    [].forEach.call(childrens3, function(_els3) {
                      const _el4 = _els3 as HTMLElement;
                      _el4.classList.add('faded-out');
                      _el4.classList.remove('fade-in');
                      const childrens4 = _el4.children;
                      
                      if(childrens4 && childrens4.length > 0) {
                        [].forEach.call(childrens4, function(_els4) {
                          const _el5 = _els4 as HTMLElement;
                          _el5.classList.add('faded-out');
                          _el5.classList.remove('fade-in');
                        });
                      }

                    });
                  }
                    
                });
              } 

            });
          }
        }
      }
    }


    private animateIn(refVar: any, first: boolean, animTime: number) {
      //this.hideContentForAnimation(refVar);
      //animate in text/elements
        if(this.$store.state.device !== 'phone') { 
          const stepElement = (refVar as Element);
          let elNum = 0;
          //const animTime = 500;
          if(stepElement) {
            const _el = stepElement as HTMLElement;
            const childrens = (refVar).children ? (refVar).children : _el;

            if(childrens && childrens.length > 0) {
              [].forEach.call(childrens, (_els, index) => {
                const _el2 = _els as HTMLElement;
                elNum++;
                setTimeout(() => {
                  _el2.classList.add('fade-in');
                }, this.setAnimTime(elNum, animTime));
                const childrens2 = _el2.children ? _el2.children : null;
                
                if(childrens2 && childrens2.length > 0) {
                  [].forEach.call(childrens2, (_els2) => {
                    const _el3 = _els2 as HTMLElement;
                    elNum++;
                    setTimeout(() => {
                      _el3.classList.add('fade-in');
                    }, this.setAnimTime(elNum, animTime));
                    const childrens3 = _el3.children ? _el3.children : null;

                    if(childrens3 && childrens3.length > 0) {
                      [].forEach.call(childrens3, (_els3) => {
                        const _el4 = _els3 as HTMLElement;
                        elNum++;
                        setTimeout(() => {
                          _el4.classList.add('fade-in');
                        }, this.setAnimTime(elNum, animTime));
                        const childrens4 = _el4.children ? _el4.children : null;

                        if(childrens4 && childrens4.length > 0) {
                          [].forEach.call(childrens4, (_els4) => {
                            const _el5 = _els4 as HTMLElement;
                            elNum++;
                            setTimeout(() => {
                              _el5.classList.add('fade-in');
                            }, this.setAnimTime(elNum, animTime));
                            const childrens5 = _el5.children ? _el5.children : null;

                          });

                        }
                        
                      });
                    }

                  });
                } 
              });
            }
          }     
        }
    }

    private setAnimTime(_elNum: number, _animTime: number) {
      let time = 0;
      time = _elNum *_animTime;
      this.totalAnimTime = time;
      return time;
    }


    @Watch('$data._stepIndex')
    private animateContent() {
      if(this.$data._stepIndex !== -1){
        this.$data.showNext = false;
      }
      if(this.element.content._multiple === true) {
        const animTime = 100;
        //focus on the title of the new step content
        switch(this.$data._stepIndex) {
          case 0:
            setTimeout(() => {
              this.animateIn(this.$refs.stepbody0, true, 500);

              setTimeout(() => {
                  this.$data.showNext = true;
              }, this.totalAnimTime);

            }, animTime);
            break;
          case 1:
            setTimeout(() => {
              this.animateIn(this.$refs.stepbody1, false, 350);

              setTimeout(() => {
                  if(this.element.content.extra) {
                    this.$data.showExtra = true;
                    Vue.nextTick(() => {
                      this.unlockNext();
                    });
                  }
              }, this.totalAnimTime);

            }, animTime);
            break;
        }   
      }
    }

    @Watch('isActive')
    private reset() {
      if(this.isActive === true) { 
        this.focusStart();

        if (this.$store.state.device !== 'phone') {
          this.$data._stepIndex = -1;
          this.$data.showNext = true;
          this.$data.showExtra = false;

          this.hideContentForAnimation(this.$refs.stepbody0);
          this.hideContentForAnimation(this.$refs.stepbody1);
        }

        // console.log(this.isActive);

        // if (this.element.content._multiple === true && this.$store.state.device === 'phone') {
        //   Vue.nextTick(() => {
        //     this.unlockNext();
        //     console.log('unlockNext');
        //   });
        // }
      }
    }



  }

</script>

<style scoped lang="scss">

  @import "../../style/global.scss";

  .steps {
    overflow: hidden;
    position: relative!important;

    display: flex!important;
    align-items: center;
    justify-content: center;

    @media #{$media-phone} {
        height: auto!important;
        display: flex!important;
      }


    &.container {
      padding: 0!important;
      height: 100%!important;
    }

    .steps-container-main {

      //aspect-ratio: 4/3;
      height: 100%;

      width: 100%;
      max-width: 1024px;
      position: relative;
      max-height: 100%;

      @media #{$media-phone} {
        height: auto;
        max-height: none;
        aspect-ratio: unset;
      }
    }

    .steps-container {

      height: 100%;

      @media #{$media-mobile} {
        //max-height: $mobile-height;
       // height: $mobile-height;
        max-height: 100%;
      }
      @media #{$media-phone} {
        height: 100%;
        //height: calc(var(--vh, 1vh) * 100);
      }
      
      width: 100%;
      position: relative;

      @media #{$media-phone} {
        // flex-direction: column;
        height: auto!important;
        order: 2;
      }

      .steps-image {
        display: flex;
        flex: 1 1 auto;
        height: 100%;
        width: 100%;

        animation: opacity-in 1s;
        opacity: 1;

        @media #{$media-phone} {
          order: 1;
        }


        img {
          object-fit: cover;
          object-position: center;
          height: 100%;
          width: 100%;

          position: absolute;
          top:0;
          left:0;
        }
      }

    }

    .steps-main {
      position: absolute;
      top:0;
      left:0;
      width: 100%;
      height: 100%;

      @media #{$media-phone} {
        position: relative;
        order: 2;
      }

      .steps-noimg-container {

        padding: $container-padding-btw;
        width: 100%;
        min-height: 60%;
        height: auto;

        @media #{$media-phone} {
          flex-direction: column;
          padding: 0!important;
        }

        .steps-noimg-left, .steps-noimg-right {
            flex: 1 1 auto;
            height: 100%;

            @media #{$media-phone} {
              width: 100%!important;
              padding: $container-padding-btw!important;
            }
        }
        
        .steps-noimg-left {
          width: 30%;
          background-color: rgba(0,0,0,0.7);
          color: $btw-body-colour;
          position: relative;

          padding: $container-padding-btw/2;

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
          border-left:0.8em solid rgba(0,0,0,0.7);

          @media #{$media-phone} {
            border-left:0.8em solid transparent; 
            border-right: 0.8em solid transparent;
            border-bottom: 0.8em solid transparent;
            border-top:0.8em solid rgba(0,0,0,0.7);; 
            left: 50%;
            transform: translate(-50%,0%);
            top: 100%;
          }

        }

          .arrow-icon {
            position: absolute;
            bottom: $container-padding-btw/2;
            right: $container-padding-btw/2;
            cursor: pointer;

            background-image: url('~@/assets/images/icons/fwd_btn_n.svg');
            background-size: contain;
            background-repeat: no-repeat;

            &:hover {
              background-image: url('~@/assets/images/icons/fwd_btn_o.svg');
              background-size: contain;
              background-repeat: no-repeat;
            }
            
          }

        }

        .steps-noimg-right {
          width: 70%;
          background-color: $btw-background-colour;

          padding: $container-padding-btw/2 $container-padding-btw/2 $container-padding-btw/2 $container-padding-btw;

          @media #{$media-phone} {
            margin-bottom: $container-padding-btw/2;
          }

        }

        .steps-noimg-title, .steps-noimg-text {
          color: $btw-body-colour;
        }

      }
    }

    .steps-title, .steps-content, .steps-ins {
        position: absolute;
        padding: $container-padding-btw/2 $container-padding-btw;
    }

    .steps-ins {
      padding: $container-padding-btw/2;

      @media #{$media-phone} {
        position: relative;
        width: 100%!important;
        left: 0!important;
        order: 4;
        padding: $container-padding-btw/2 $container-padding-btw;
      }
    }

    .steps-icon {
      width: 6em;
      height: 6em;
    }

    .steps-title {
        top:0;
        left:0;
        width: 100%;

        @media #{$media-phone} {
          background-color: $btw-mobiletop-colour;
          order: 1;
          position: relative;
        }
    }

    .steps-topic-title {
      color: $btw-topic-title-colour!important;
    }

    .steps-content {
        background-color: rgba(0,0,0,0.7);
        color: $btw-body-colour;
        animation: opacity-in 1s;

        @media #{$media-phone} {
          position: relative!important;
          top:0!important;
          left: 0!important;
          width: 100%!important;
          height: auto!important;
          min-height: 35vh!important;
          //margin-bottom: $container-padding-btw/2;
          transform: none;
          order: 3;
          padding: 1rem 1.5rem 3rem 1.5rem;
        }
       
      
    }

    .steps-ins {
        background-color: rgba(255,255,255,1);

        opacity: 0;
        &.visible {
          animation: opacity-in 2s;
          opacity: 1;
        }

        @media #{$media-phone} {
          opacity: 1;
        }
        
    }

    .steps-extra {
        color: $btw-main-colour;
        // margin-bottom: $container-padding-btw/2;
    }

    .arrow-icon-images {
      position: absolute;
      transform: translate(-50%, -50%);
      bottom: auto;
      cursor: pointer;

      opacity: 0;

      background-image: url('~@/assets/images/icons/fwd_btn_n.svg');
      background-size: contain;
      background-repeat: no-repeat;

      &:hover {
        background-image: url('~@/assets/images/icons/fwd_btn_o.svg');
        background-size: contain;
        background-repeat: no-repeat;
      }

      &.visible {
        opacity: 1;
        animation: opacity-in 0.5s;
      }

      &.not-visible {
        opacity: 0;
        animation: none;
      }

      @media #{$media-phone} {
          bottom: -$container-padding-btw!important;
          top: auto!important;
          right: -$container-padding-btw!important;
          left: auto!important;
         
        }
    }

    .steps-content-multiple {
      width: 25%;

      @media #{$media-phone} {
        width: 100%!important;
      }
    }

    .steps-multiple-content {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      //min-height: 768px;

      @media #{$media-phone} {
        width: 100%!important;
        position: relative!important;
        order: 3;
        padding: $container-padding-btw/2 $container-padding-btw;
      }

      .step-content-multiple {
        position: absolute;

        font-size: 0.9em;

        transform: translate(0%,-50%);

        @media #{$media-mobile} {
          .steps-img-text {
            font-size: 0.7em;
            line-height: 0.7;
          }
        }

        @media #{$media-phone} {
          position: relative!important;
          top:0!important;
          left: 0!important;
          width: 100%!important;
          height: auto!important;
          min-height: 35vh!important;
          margin-bottom: $container-padding-btw/2;
          .steps-img-text {
            font-size: 1.1em;
            line-height: 1;
          }
          transform: none;
        }
      }
    }

  }

  
  // transitions //

    // fade
    .fade-enter-active {
      transition: opacity 1s;
      animation: opacity-in.5s;
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
