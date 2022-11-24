<template>
  <div v-if="element" class="carousel grid-x container"
      v-observe-visibility="{ callback: visibilityChanged, throttle: 100, intersection: { threshold: 0.5 }, once: false }"
      :class="{ 'visible': true }" 
      @scroll="reset"
      role="region" level="1" >
      
    <div class="carousel-container component-container flexbox flexbox-column flexbox-justify-stretch flexbox-align-stretch" ref="container">

      <div class="carousel-topic-title btw-topic-title cell large-12 medium-12 small-12" role="heading" level="2" >
        <h1 ref="accessibility" class="accessibility-region" tabindex="-1">{{getScreenAriaContent()}}</h1>
        <h3 v-html="getTopicTitle()" />
      </div>


      <div class="carousel-content background-colour-content flexbox flexbox-row flexbox-justify-stretch flexbox-align-stretch" v-if="$store.state.device === 'phone'">
        
        <div class="carousel-content-main component-side">
          <div class="carousel-title btw-title cell large-12 medium-12 small-12">
            <h4 v-if="element.content.title" v-html="element.content.title" />
          </div>

          <div class="carousel-text btw-text cell large-12 medium-12 small-12">
            <div v-html="element.content.body" />
          </div>
          <div class="ins" v-html="getContentIns()" v-if="$data._slideIndex !== element.content.slides.length-1"/>
        </div>
      </div>

      <div class="carousel-image" :class="{ 'es': $store.state.language === 'es'}" :ref="'image'+element._id">

        <!-- <transition name="fade"> -->
          <img class="background-image" :key="getImage()" :src="getImage()" :aria-label="getImageAlt()" :aria-hidden="getImageAlt() === '' ? true : false">
        <!-- </transition> -->

        <!-- <transition name="fade"> -->
          <div class="background-image-gradient"></div>
        <!-- </transition> -->

        <video width="1024" height="768" id="audio" ref="audio"
          :src="audioSrc" 
          :v-if="audioSrc !== ''"
          :class="{  'hide' : audioSrc === '' }"
          type="media/mp3" 
          tabindex="0"
          :autoplay="getAutoPlay()" 
          playsinline >
          <track id="audio-track" kind="subtitles" :src="audioVtt" default v-if="$store.state.showSubtitles" tbindex="0" />
          Your browser does not support HTML video.
        </video>

        <button class="carousel-audio-controls flexbox flexbox-justify-center flexbox-align-center" 
          role="button" tabindex="0"
          :aria-label="$store.state.courseContent.global._accessibility.playbtn"
           ref="audioControls" >
           <!-- @click="playPauseAudio" -->
          <!-- <img class="carousel-audio-play-icon icon" src='~@/assets/images/icons/play-video.svg'  -->
          <!-- v-if="($store.state.device === 'phone' || ($data._slideIndex === 0 && backwards === false)) && !audioPlaying && !audioComplete && audioFile === true" /> -->
        </button>

        <div class="carousel-nav btw-topic-title flexbox flexbox-row flexbox-justify-stretch flexbox-align-stretch">
          <button class="carousel-prev-icon carousel-icon" 
              :class="{ 'disabled': $data._slideIndex === 0 }" @click="prevSlide" 
              role="button" tabindex="0"
              :aria-label="$store.state.courseContent.global._accessibility.prev" >
              <img src="~@/assets/images/icons/back_n.svg" />
          </button>
          <button class="carousel-next-icon carousel-icon"
              :class="{ 'disabled': $data._slideIndex === element.content.slides.length-1 || (locked === true && backwards === false) }" @click="nextSlide" 
              role="button" tabindex="0"
              :aria-label="$store.state.courseContent.global._accessibility.next" >
              <img src="~@/assets/images/icons/next_n.svg" />
          </button>
        </div>
      </div>

      <div class="carousel-progress btw-progress-dots flexbox flexbox-row flexbox-justify-center flexbox-align-center" aria-hidden="true">
        <div class="btw-progress-bg" />
        <div class="btw-progress-dot" v-for="(dot, index) in element.content.slides" 
          :key="index" :class="{ 'visited': $data._slideIndex >= index }" />
      </div>

      <div class="carousel-content background-colour-content flexbox flexbox-row flexbox-justify-stretch flexbox-align-stretch" v-if="$store.state.device !== 'phone'">
        
        <div class="carousel-content-main component-side">
          <div class="carousel-title btw-title cell large-12 medium-12 small-12">
            <h4 v-if="element.content.title" v-html="element.content.title" />
          </div>

          <div class="carousel-text btw-text cell large-12 medium-12 small-12">
            <div v-html="element.content.body" />
          </div>
          <div ref="bodyContent" class="ins" :class="{ 'ins-padding': $data._slideIndex !== element.content.slides.length-1 }" v-html="getContentIns()"  /> 
          <!-- v-if="($data._slideIndex === 0 || $data._slideIndex === element.content.slides.length-1)" -->
        </div>

        <div class="carousel-content-body" :class=" {'audio': audioFile === true, 'flexbox flexbox-justify-center': !audioComplete && audioFile === true } " :ref="'content'+element._id" >

          <button class="carousel-audio-controls-btn flexbox flexbox-justify-center flexbox-align-center" 
            v-if="audioPaused && !audioPlaying && !audioComplete && audioFile === true"
            role="button" tabindex="0"
            :aria-label="$store.state.courseContent.global._accessibility.playbtn"
            @click="playPauseAudio" ref="audioControls" >
            <img class="carousel-audio-play-icon icon" src='~@/assets/images/icons/play-video.svg' />
          </button>

          <button class="carousel-audio-controls-btn flexbox flexbox-justify-center flexbox-align-center" 
            v-if="(audioPlaying && !audioComplete) && audioFile === true"
            role="button" tabindex="0"
            :aria-label="$store.state.courseContent.global._accessibility.playbtn"
            @click="playPauseAudio" ref="audioControls" >
            <img class="carousel-audio-pause-icon icon" src='~@/assets/images/icons/pause-video.svg' />
          </button>

          <div class="carousel-body-title btw-title cell large-12 medium-12 small-12">
            <transition name="fade">
              <h4 :key="contentTitle" v-if="contentTitle !== ''" v-html="contentTitle" ref="slidecontent" tabindex="-1" />
            </transition>
          </div>
          <div class="carousel-body-text btw-text cell large-12 medium-12 small-12">
            <transition name="fade">
              <div :key="contentBody" v-html="contentBody" />
            </transition>
          </div>

          <!-- <div ref="bodyContent" class="ins" v-html="element.content.ins" v-if="$store.state.device !== 'phone' && ($data._slideIndex === 0 || $data._slideIndex === element.content.slides.length-1)" />  -->
          
        </div>

      </div>

      <div class="carousel-text-mobile btw-text cell large-12 medium-12 small-12" v-if="$store.state.device === 'phone'">
        <div class="carousel-content-body" :class=" {'audio': audioFile === true, 'flexbox flexbox-justify-center': !audioComplete && audioFile === true } " :ref="'content'+element._id" >
          
          <button class="carousel-audio-controls-btn flexbox flexbox-justify-center flexbox-align-center" 
            v-if="audioPaused && !audioPlaying && !audioComplete && audioFile === true"
            role="button" tabindex="0"
            :aria-label="$store.state.courseContent.global._accessibility.playbtn"
            @click="playPauseAudio" ref="audioControls" >
            <img class="carousel-audio-play-icon icon" src='~@/assets/images/icons/play-video.svg' />
          </button>

          <button class="carousel-audio-controls-btn flexbox flexbox-justify-center flexbox-align-center" 
            v-if="(audioPlaying && !audioComplete) && audioFile === true"
            role="button" tabindex="0"
            :aria-label="$store.state.courseContent.global._accessibility.playbtn"
            @click="playPauseAudio" ref="audioControls" >
            <img class="carousel-audio-pause-icon icon" src='~@/assets/images/icons/pause-video.svg' />
          </button>
          
          <div class="carousel-body-title btw-title cell large-12 medium-12 small-12">
            <transition name="fade">
              <h4 :key="contentTitle" v-if="contentTitle !== ''" v-html="contentTitle" ref="slidecontent" tabindex="-1" />
            </transition>
          </div>
          <div class="carousel-body-text btw-text cell large-12 medium-12 small-12">
            <transition name="fade">
              <div :key="contentBody" v-html="contentBody" />
            </transition>
          </div>
          
        </div>
        <div ref="bodyContent" class="ins" v-html="getContentIns()" v-if="$store.state.device === 'phone'" />
      </div>


    </div>

  </div>
</template>

<script lang="ts">

  import { Component, Prop, Vue, Watch, Mixins } from 'vue-property-decorator';
  import BaseComponent from '@/components/BaseComponent';

  import ICarousel, { ICarouselContent, ICarouselSlides } from "@/interfaces/BTW/ICarousel";

  @Component({
    components: {
      
    }
  })

  export default class Carousel extends Mixins(BaseComponent) implements ICarousel {
    @Prop({ default: "" })
    public _id!: string;
    
    @Prop({ required: true })
    protected element!: ICarousel;

    @Prop({ default: ""})
    public content!: ICarouselContent;

    @Prop({ default: ""})
    public slides!: ICarouselSlides[];

    private _slideIndex: number = 0;

    private audioFile: boolean = false;

    private audioPlaying: boolean = true;
    private audioPaused: boolean = false;
    private audioComplete: boolean = false;

    private contentTitle: string = '';
    private contentBody: string = '';
    private contentIns: string = ' ';
    private audioSrc: string = '';
    private audioVtt: string = '';

    private audio!: HTMLVideoElement;

    private locked: boolean = false;

    private backwards: boolean = false;

    private audioVtts: boolean = false;


    private mounted() {
      if (this.$store.state.device === 'phone') {
        this.getContent();
      }


      //this.stopAudio();
      this.focusStart();
    }

    private activated() {
      this.focusStart();
    }

    private getImage() {
      let image = this.element.content.slides[this.$data._slideIndex]._image;
      if (this.$store.state.device === 'phone') {
        image = this.element.content.slides[this.$data._slideIndex]._imageMobile;
      }
      return image;
    }

    private getImageAlt() {
      let alt = '';
      if (this.element.content.slides[this.$data._slideIndex]._alt) {
        alt = this.element.content.slides[this.$data._slideIndex]._alt;
      }
      return alt;
    }

    private getAutoPlay() {
      let autoPlay = true;
      //this.audioPaused = false;
      if (this.$data._slideIndex === 0) { //this.$store.state.device === 'phone' && ////  && this.backwards === false 
        autoPlay = false;
        //this.audioPaused = true;
      }
      return autoPlay;
    }

    @Watch('contentIns')
    private getContentIns() {
      return this.contentIns;
    }

    @Watch("$store.state.showSubtitles")
    private toggleCC() {
      let audioElement = this.audio;
      if(audioElement) {
        if(this.$store.state.showSubtitles === true) {
          audioElement.textTracks[0].mode = "showing";
        } else {
          audioElement.textTracks[0].mode = "hidden";
        }
      }
    }

    @Watch('$data._slideIndex')
    private changeVtt() {

        let audioElement = this.audio;
        let i = 0;
        
        if(audioElement) {
          for (let track of audioElement.textTracks){
            audioElement.removeChild(audioElement.children[i]);
            i++;
            
            // const trackEl = (audioElement.children[i] as HTMLAudioElement);
            // trackEl.src = this.audioVtt; 
          }

          var track = document.createElement("track"); 
          track.kind = "subtitles"; 
          track.label = "English"; 
          track.default = true;
          track.srclang = this.$store.state.language; 
          track.src = this.audioVtt; 
          this.audio.appendChild(track); 
        }
           
    }

    private getContent() {

      const audioElement = (this.$refs.audio as Element);
      this.audio = audioElement as HTMLVideoElement;

      this.audio.removeEventListener('ended', this.removeEvents);

      this.contentTitle = this.element.content.slides[this.$data._slideIndex].title;
      this.contentBody = this.element.content.slides[this.$data._slideIndex].body;
      if (this.$data._slideIndex === this.element.content.slides.length-1) {
        this.contentIns = ' ';
      } else {
         this.contentIns = this.element.content.ins ? this.element.content.ins : ' ';
      }

      if (this.element.content.slides[this.$data._slideIndex]._audio) {
        this.audioSrc = this.element.content.slides[this.$data._slideIndex]._audio;
        this.audioVtt = this.element.content.slides[this.$data._slideIndex]._vtt;
        this.audio.addEventListener('ended', this.showAudioContent, false);

        this.audioFile = true;

      } else {
        this.audioSrc = '';
        this.audioVtt = '';
        this.audioFile = false;

        if(this.contentBody === '' || this.contentBody === undefined) {
          this.showAudioContent();
        }
      }

      if (this.element.content.slides[this.$data._slideIndex]._audio && this.$store.state.device !== 'phone' && this.audioSrc !== '') {
        this.audio.currentTime = 0;
        this.audio.play();
        this.audioPlaying = true;
        this.audioPaused = false;
        this.locked = true;
      }
      if (this.$data._slideIndex === 0 && this.audioFile === true) {
        this.audio.pause();
        this.audioPlaying = false;
        this.audioPaused = true;
        this.locked = true;
      }
      if (this.$store.state.device === 'phone' && this.audioFile === false) {
        this.locked = false;
      }
       if (this.element.content.slides[this.$data._slideIndex]._vtt) {
        this.$store.state.subtitles = true;
      } else {
        this.$store.state.subtitles = false;
      }
      //this.$store.state.showSubtitles = false;
      this.$store.getters.write; 
      this.audioComplete = false;

      //focus on the title of the new slide
      this.$store.getters.setAccessibilityFocus(this.$refs.slidecontent);

    }

    private removeEvents() {
      //console.log("carousel >> remove event listener");
    }

    private getVTT() {
      return this.element.content.slides[this.$data._slideIndex]._vtt;
    }

    private prevSlide() {
      if(this.$data._slideIndex > 0) {
        this.$data._slideIndex--;

        this.backwards = true;

        this.getContent();
        if (!this.element.content.slides[this.$data._slideIndex]._audio) {
          this.stopAudio();

          //scroll to top of image
          Vue.nextTick(() => {
            this.scrollToImage();
          });
        } else {
          //scroll to top of image
          Vue.nextTick(() => {
            this.scrollToImage();//this.scrollToContent();
          });
        }
      }
    }

    private nextSlide() {
      if(this.$data._slideIndex < this.element.content.slides.length-1 && (!this.locked || this.backwards === true)) {
        this.$data._slideIndex++;

        
        
        this.getContent();
        
        if (this.element.content.slides[this.$data._slideIndex]._audio) {
          // if audio - handled in getContent
          //scroll to top of image
          Vue.nextTick(() => {
            this.scrollToImage();
          });
        } else {
          this.locked = false;
          this.stopAudio();

          //scroll to top of image
          Vue.nextTick(() => {
            this.scrollToImage(); //this.scrollToContent();
          });

          if (this.$data._slideIndex === this.element.content.slides.length-1) {
            // enable the next button
            Vue.nextTick(() => {
              this.unlockNext();
            });
          }
        }

      }
    }

    private scrollToImage() {
      if (this.$store.state.device === 'phone') {
        const scrollToEl = (this.$refs['image'+this.element._id] as HTMLElement);
        var elemChild = scrollToEl;
        this.$store.getters.scrollToElement(elemChild, true);
      }
    }

    private scrollToContent() {
      //console.log('content'+this.element._id);
      if (this.$store.state.device === 'phone') {
        const scrollToEl = (this.$refs['content'+this.element._id] as HTMLElement);
        var elemChild = scrollToEl;
        console.log(elemChild);
        this.$store.getters.scrollToElement(elemChild, false);
      }
    }

    // private scrollTo() {
    //   var elemChild = this.scrollToEl;
    //   this.$store.getters.scrollToElement(elemChild);
    //   var elem = document.getElementById('app');
    //   if (elem && elemChild) {
    //     setTimeout(() => {
    //       elem!.scrollTop = elemChild.offsetTop + elemChild.clientHeight + 50;
    //     }, 100);
    //   }
    // }
      

    @Watch('isActive')
    private reset() {
      
       if(this.isActive === true) { 
         
         this.focusStart();

         if (this.element.content.slides[this.$data._slideIndex]._vtt) {
          this.$store.state.subtitles = true;
        }

         this.backwards = false;

          if (this.$store.state.device !== 'phone') {
            
            this.$data._slideIndex = 0;
            this.audioSrc = '';
            this.audioVtt = '';
            this.getContent();
            this.changeVtt();
          }
       } else {
         if(this.audioSrc !== '') {
          this.stopAudio();
            if (this.$store.state.device !== 'phone') {
              if(this.$data._slideIndex !== 0) {
                this.$data._slideIndex = 0;
              } else {
                this.$data._slideIndex = 1;
              }
              this.audioSrc = '';
              this.audioVtt = '';
              this.changeVtt();
            }
         }
       }
      
    }

    private playPauseAudio() {
      if (this.audioComplete) {
        this.audioComplete = false;
        this.audioPlaying = false;
        this.audioPaused = false;
      }

      if (!this.audioPlaying) {
        this.audio.play();
        this.audioPaused = false;
        this.audioPlaying = true;
      } else {
        this.audio.pause();
        this.audioPaused = true;
        this.audioPlaying = false;
      }
    }


    private stopAudio() {
      this.audio.pause();
      this.audio.removeEventListener('ended', this.removed);

      this.$store.state.subtitles = false;
     // this.$store.state.showSubtitles = false;
      this.$store.getters.write; 
    }

    private showAudioContent() {
      
      this.audioVtt = '';
      this.contentTitle = this.element.content.slides[this.$data._slideIndex].audioTitle;
      this.contentBody = this.element.content.slides[this.$data._slideIndex].audioBody;
      this.contentIns = this.element.content.ins ? this.element.content.ins : ' ';
      this.stopAudio();
      this.locked = false;
      
      this.audioComplete = true;

      if (this.$data._slideIndex === this.element.content.slides.length-1) {
        // enable the next button
        this.unlockNext();

        this.contentIns = ' ';
      }

      //scroll to top of content
      Vue.nextTick(() => {
        this.scrollToImage(); //this.scrollToContent();
      });

    }


    private removed() {}

    

  }

</script>

<style scoped lang="scss">

  @import "../../style/global.scss";

  .carousel {
    overflow: hidden;
    overflow-y:auto;
    position: relative;

    display: flex!important;
    align-items: center;


    &.container {
      padding: 0!important;
      height: 100%!important;
    }

    video {
       position: relative;
    }

    video::-webkit-media-text-track-container {
      
    }

    video::-webkit-media-text-track-display {
      max-width: 90%;
      margin: 0 5%;

      font-size: 1em;      

      @media #{$media-phone} {
        font-size: 1em;
      }
    }

    video::cue {
      font-size: 1.2em;
      

      @media #{$media-mobile} {
        font-size: 1em;
      }

      @media #{$media-phone} {
        font-size: 1em;
        
      }
    }

    .carousel-text-mobile {
      .ins {
        padding: 1em 2.2em;
      }
    }

    .carousel-container {

      .carousel-content {
        display: flex;
        flex: 1 1 auto;
        overflow: hidden;
        overflow-y: auto;

        background-color: $btw-background-colour;
        color: $btw-body-colour;

        .text-image-title {
          color: $btw-title-colour;
          margin-top: 2.2em;
        }

      }

      .carousel-topic-title {
          color: $white!important; //$btw-title-colour!important;
          position: absolute;
          padding: $container-padding-btw/2 $container-padding-btw;
          top:0; 
          left:0;
          z-index: 1;

          @media #{$media-phone} {
            color: $btw-topic-title-colour!important;
            background-color: $btw-mobiletop-colour;
            order: 1;
            position: relative;
          }
        }

        .carousel-progress {
          @media #{$media-phone} {
            order: 3;
          }
        }

        .carousel-text-mobile {
          order: 4;

          .carousel-content-body {
            min-height: 40vh;
          }
          
        }

      .carousel-image {
        display: flex;
        flex: 0 0 auto;

        background-color: $btw-main-colour;

        @media #{$media-phone} {
          order: 2;
        }

        max-height: 57%;
        height: 57%;
        
        &.es {
          max-height: 50%;
          height: 50%;
        }

        position: relative;

        img {
          object-fit: cover;
          object-position: center;
        }

        .background-image {
          width: 100%;
          height: 100%;
          animation: opacity-in 1s;
          opacity: 1;
        }

        .background-image-gradient {
          position: absolute;
          width: 100%;
          height: 100%;
          top:0;
          left:0;
          background: linear-gradient(180deg, rgba($black,0.6) 0%, rgba($black,0.3) 10%, rgba($black,0.2) 12%, rgba($black,0) 20%, rgba($black,0) 100% );
        }

        video {
          width: 100%;
          height: 75%;
          min-height: 345px;
          position: absolute;
          bottom: 1%;
          left:0;

          &.hide {
            display: none;
            z-index:-1;
          }
        }

      }
      
      .carousel-content {

        overflow: hidden;
        
        @media #{$media-phone} {
         flex-direction: column;
         order: 1;
        }
      } 

      .carousel-content-main, .carousel-content-body {
        padding: $container-padding-btw/2 $container-padding-btw 0 $container-padding-btw;
        @media #{$media-mobile} {
          padding: $container-padding-btw/2 $container-padding-btw/2 0 $container-padding-btw/2 ;
        }

        &.audio {
          padding: $container-padding-btw/2 $container-padding-btw;
          @media #{$media-mobile} {
            padding: $container-padding-btw/2;
          }
        }

        //overflow: hidden;
        //overflow-y: auto;

        @media #{$media-phone} {
          width: 100%!important;
          overflow: visible;
          padding: $container-padding-btw/2 $container-padding-btw;
        }

      }

      .carousel-content-main {
        width: 45%;
        position: relative;

        z-index: 1000;

        .ins-padding {
          padding-top: 1.5em;
        }

      }

      .carousel-content-body {
        width: 61%;
        background-color: $btw-grey;

         //@media #{$media-phone} {
           // min-height: 30vh;
         //}
      }

      .carousel-body-title {
        color: $btw-main-colour;
      }

      .carousel-body-text {
        color: $btw-body-colour;
      }

    }

    .carousel-nav {
      position: absolute;
      left:0;
      width:100%;
      z-index: 2;

      transform: translate(0%, -50%);
      top: 50%;

      @media #{$media-phone} {
        transform: translate(0%, -50%);
        top: 50%;
      }

      .carousel-prev-icon, .carousel-next-icon {
        position: absolute;
        cursor: pointer;

        &.disabled {
          //opacity: 0.5;
          //cursor: default;
          display: none;
        }
      }
      .carousel-prev-icon {
         left: 1.2em;
      }
      .carousel-next-icon {
        right: 1.2em;
      }

      img {
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
        border-radius: 100%;
        background-color: $btw-coursel-nav-bg;
        
        &:hover {
          background-color: $btw-coursel-nav-hover-bg;
        }

      }
    }

    .carousel-icon {
      width: 4em;
      height: 4em;
    }


    .carousel-audio-controls {
      width: 100%;
      height: 100%;
      position: absolute;
      top:0;
      left:0;
      z-index: 1;
    }

    .carousel-audio-controls-btn {
      width: 100%;
      height: 100%;
      //position: absolute;
      //top:0;
      //left:0;
      z-index: 1;

      .carousel-audio-play-icon, .carousel-audio-pause-icon {
        width: 4em;
        height: 4em;
        cursor: pointer;
      }
    }

  }

    // transitions //

    // fade
    .fade-enter-active {
      transition: opacity 1s;
    }
    .fade-enter { // , .fade-leave-to {
      opacity: 0.5;
    }

    
    // slide-fade
    .slide-fade-enter-active {
      opacity: 1;
      transition: all 0.5s cubic-bezier(1.0, 0.5, 0.8, 1.0);
    }
    .slide-fade-enter {
      transform: translateX(-2rem);
      opacity: 0.5;
    }
  
</style>
