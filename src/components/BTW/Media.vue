<template>
  <div v-if="element" class="media grid-x container"
      v-observe-visibility="{ callback: visibilityChanged, throttle: 100, intersection: { threshold: 0.5 }, once: false }"
      :class="{ 'visible': true }" role="region" level="1" >
      
    <div class="component-container media-container flexbox flexbox-column flexbox-justify-stretch flexbox-align-stretch">

      <div class="media-content component-header flexbox flexbox-column" >

        <div class="media-topic-title btw-topic-title cell large-12 medium-12 small-12" role="heading" level="2" >
          <h1 ref="accessibility" class="accessibility-region" tabindex="-1">{{getScreenAriaContent()}}</h1>
          <h3 v-html="getTopicTitle()" />
        </div>

        <div class="media-title btw-title cell large-12 medium-12 small-12">
          <h4 v-if="element.content.title" v-html="element.content.title" />
          <div v-if="element.content.body" class=" btw-text cell large-12 medium-12 small-12" v-html="element.content.body" />
        </div>

      </div>

      <div class="media-main flexbox flexbox-justify-center flexbox-align-center" >

        <div class='media-overlay flexbox flexbox-justify-center flexbox-align-center' 
            v-if="(element.content._video.overlay && !mediaStarted) || (element.content._video.overlay && $store.state.device === 'phone')"
            @click="playPauseVideo" >
            <div class='media-overlay-content'>
              <div v-html='element.content._video.overlay'> </div>
              <div class='media-overlay-ins' v-html='element.content._video.overlayins' v-if="$store.state.device !== 'phone'"> </div>
              <div class='media-overlay-ins' v-html='element.content._video.overlayinsmobile' v-if="$store.state.device === 'phone'"> </div>
            </div>
        </div>
        
        <div class="media-video-controls">
          <video width="100%" height="100%" id="media" ref="video" 
            :poster="element.content._video._poster" 
            :src="videoSrc" 
            tabindex="0"
            type="media/mp4" 
            playsinline 
            fullscreen
            :class="{ 'phone': $store.state.device === 'phone', 'fullscreen': fullscreen === true  }" >
              <track kind="subtitles" :src="videoVtt" default tabindex="0" />
              Your browser does not support HTML video.
          </video>
          <button class="media-controls flexbox flexbox-justify-center flexbox-align-center" 
            ref="videoControls" 
            :class="{'phone-start': $store.state.device === 'phone' && !mediaPlaying }"
            role="button" tabindex="0"
            :aria-label="!mediaComplete ? (!mediaPlaying ? $store.state.courseContent.global._accessibility.playbtn : $store.state.courseContent.global._accessibility.pausebtn) : $store.state.courseContent.global._accessibility.rewindbtn" >
              <img class="media-play-icon icon" @click="playPauseVideo" src='~@/assets/images/icons/play-video-mobile.svg' v-if="$store.state.device === 'phone' && !mediaPlaying && !mediaComplete" />
              <div class="media-rewind-icon" @click="playPauseVideo" v-if="mediaComplete" >
                <span>{{$store.state.courseContent.global._accessibility.replaybtn}}</span>
              </div>
          </button>

          <!-- <button class="media-fullscreen-icon-fullscreen icon"
            @click="fullscreenVideo()" v-if="fullscreen === true"
            role="button" tabindex="0"
            :aria-label="$store.state.courseContent.global._accessibility.skipmediabtn" >
              <img  src='~@/assets/images/icons/fullscreen_in.svg' />
          </button>

          <button class="media-play-pause-btn-fullscreen" 
            @click="playPauseVideo()"
            role="button" tabindex="0"
            v-if="fullscreen === true"
            :aria-label="mediaPaused ? $store.state.courseContent.global._accessibility.playbtn : $store.state.courseContent.global._accessibility.pausebtn" >
              <img class="media-pause-icon icon" src='~@/assets/images/icons/pause-video.svg' v-if="mediaStarted && !mediaPaused && !mediaComplete" />
              <img class="media-play-icon icon" src='~@/assets/images/icons/play-video.svg' v-if="mediaStarted && mediaPaused && !mediaComplete" />
          </button> -->
          
        </div>

      </div>

      <div class="media-end flexbox flexbox-justify-center flexbox-align-center" ref="bodyContent" v-show="mediaComplete" />

      <div class="media-footer component-footer flexbox flexbox-justify-center flexbox-align-center" >
        <div class="media-progress"  >
        <!-- v-if="$store.state.device !== 'phone'" -->
          <div class="media-progress-bar" :style="{ 'width': ProgressPerc+'%' }"></div>
        </div>
        <div class="media-end-ins" ref="insContent" v-html="getVideoEndIns()" v-show="mediaComplete" tabindex="-1" />
        <div class="media-bottom-btns">
          <button class="media-play-pause-btn" 
            @click="playPauseVideo()"
            role="button" tabindex="0"
            :aria-label="mediaPaused ? $store.state.courseContent.global._accessibility.playbtn : $store.state.courseContent.global._accessibility.pausebtn" >
              <img class="media-pause-icon icon" src='~@/assets/images/icons/pause-video.svg' v-if="mediaStarted && !mediaPaused && !mediaComplete" />
              <img class="media-play-icon icon" src='~@/assets/images/icons/play-video.svg' v-if="mediaStarted && mediaPaused && !mediaComplete" />
          </button>
          <button class="media-step-back-icon icon" 
            @click="stepBackVideo()" v-if="mediaStarted && !mediaComplete"
            role="button" tabindex="0"
            :aria-label="$store.state.courseContent.global._accessibility.skipmediabtn" >
              <img  src='~@/assets/images/icons/history-video.svg' />
          </button>
          <!-- <button class="media-fullscreen-icon icon"
            @click="fullscreenVideo()"
            role="button" tabindex="0"
            v-if="mediaStarted && !mediaComplete"
            :aria-label="$store.state.courseContent.global._accessibility.skipmediabtn" >
              <img  src='~@/assets/images/icons/fullscreen_out.svg' />
          </button> -->
        </div>
      </div>

    </div>

  </div>
</template>

<script lang="ts">

  import { Component, Prop, Vue, Watch, Mixins } from 'vue-property-decorator';
  import BaseComponent from '@/components/BaseComponent';

  import IMedia, {IMediaContent } from "@/interfaces/BTW/Imedia";

  @Component({
    components: {
      
    }
  })

  export default class Media extends Mixins(BaseComponent) implements IMedia {
    @Prop({ required: true })
    protected element!: IMedia;

    @Prop({ default: ""})
    public content!: IMediaContent;

    private mediaStarted: boolean = false;
    private mediaPlaying: boolean = true;
    private mediaPaused: boolean = false;
    private mediaComplete: boolean = false;

    private videoSrc:string = '';
    private videoVtt:string = '';

    private hoverOver: boolean = false;

    private video!: HTMLVideoElement;

    private topicTitle: string = '';

    private ProgressPerc: number = 0;

    private fullscreen: boolean = false;

    private mounted() {
      const videoElement = (this.$refs.video as Element);
      const videoControlsElement = (this.$refs.videoControls as Element);
      this.video = videoElement as HTMLVideoElement;

      this.mediaComplete = false;

      this.videoSrc = this.element.content._video._src;
      this.videoVtt = this.element.content._video._vtt;
      this.video.load();
      
      this.video.addEventListener('ended', this.videoEnded, false);
      // this.video.addEventListener('timeupdate', this.subtitles, false);

      videoControlsElement.addEventListener('mouseover', this.mouseOver, false);
      videoControlsElement.addEventListener('mouseout', this.mouseOut, false);

      videoElement.addEventListener('timeupdate', this.setProgressWidth, false);

      this.focusStart();
    }

    private activated() {
      this.focusStart();
    }

    private getVideoEndIns() {
      let ins = this.$store.state.courseContent.global.continueVideoIns;
      if (this.$store.state.device === 'phone') {
        ins = this.$store.state.courseContent.global.continueVideoMobileIns;
      }
      if(this.$store.state.device === 'phone' && this.$store.getters.checkIfLastScreenInPage(this.element._id)) {
        ins = this.$store.state.courseContent.global.continueMobileLastIns;
      }
      return ins;
    }

    private setProgressWidth() {
      this.ProgressPerc = (100 / this.video.duration) * this.video.currentTime;
     // console.log(this.ProgressPerc);
    }


    @Watch('$store.state.showSubtitles')
    private updateSubtitles() {
        let i = 0;
        let videoElement = this.video;
        for (let track of videoElement.textTracks){
          const trackChild = (videoElement.children[i] as HTMLElement);
          if(this.$store.state.showSubtitles === true) {
            videoElement.classList.add('ccvisible');
            videoElement.classList.remove('ccinvisible');
          }else {
            videoElement.classList.remove('ccvisible');
            videoElement.classList.add('ccinvisible');
          }
          i++;
        }
    }

    @Watch('isActive')
    private reset() {
      if(this.isActive === true) { 

        this.focusStart();

        if (this.element.content._video._vtt) {
          this.$store.state.subtitles = true;
        }

        //console.log(this.mediaComplete, this.mediaPaused, this.mediaStarted, this.$store.state.device);

        if(this.mediaStarted === false || this.$store.state.device !== 'phone'){
          let i = 0;
          let videoElement = this.video;
          for (let track of videoElement.textTracks){
              videoElement.removeChild(videoElement.children[i]);
              i++;
          }

          this.video.addEventListener("loadedmetadata", () => {    
            var track = document.createElement("track"); 
              track.kind = "captions"; 
              track.label = "English"; 
              track.default = true;
              track.srclang = this.$store.state.language;
              track.src = this.videoVtt; 
              this.video.appendChild(track); 
          });

          this.videoSrc = this.element.content._video._src;
          this.videoVtt = this.element.content._video._vtt;
          this.video.load();
          this.video.currentTime = 0;
          if (this.element.content._video._vtt) {
            this.$store.state.subtitles = true;
          } else {
            this.$store.state.subtitles = false;
          }
          //this.$store.state.showSubtitles = true;
          this.$store.getters.write; 

          this.video.onloadeddata = () => {
            if (this.$store.state.device !== 'phone' && !this.element.content._video.overlay) {
              this.mediaPlaying = true;
              this.video.play();
              this.mediaStarted = true;
            } else {
              this.mediaPlaying = false;
              this.video.pause();
              this.mediaStarted = false;
            }
          }
        }

      } else {

        if(this.$store.state.device !== 'phone'){
          this.mediaPlaying = false;
          this.mediaComplete = false;
        } else {
          this.mediaPaused = true;
          this.mediaStarted = true;
          this.mediaPlaying = false;
          this.mediaComplete = false;
        }
        
        this.video.pause();

        /*this.videoSrc = '';
        this.videoVtt = '';
        this.mediaPlaying = false;

        this.$store.state.subtitles = false;
        //this.$store.state.showSubtitles = false;
        this.$store.getters.write; */
      }
      
      //this.mediaComplete = false;
      //this.mediaPaused = false;
      //this.mediaStarted = false;
    }

    private playPauseVideo() {
      if (this.mediaComplete) {
        this.mediaComplete = false;
        this.mediaPlaying = false;
        this.mediaPaused = false;
      }

      if (!this.mediaPlaying) {
        this.video.play();
        this.mediaPaused = false;
        this.mediaPlaying = true;
        this.mediaStarted = true;
      } else {
        this.video.pause();
        this.mediaPaused = true;
        this.mediaPlaying = false;
      }
    }

    private mouseOver(evt: Event){
      this.hoverOver = true;
    }

    private mouseOut(evt: Event){
      this.hoverOver = false;
    }

    private stepBackVideo() {
      this.video.pause();
      const timeNow = this.video.currentTime;
      let newTime = timeNow - 10;
      if(newTime < 0) { newTime = 0; }
      this.video.currentTime = newTime;
      this.video.play();
      this.mediaPaused = false;
      this.mediaPlaying = true;
      this.mediaComplete = false;
    }

    private fullscreenVideo() {
      this.fullscreen = !this.fullscreen;
    }

    private videoEnded() {
      this.mediaComplete = true;
      this.mediaPlaying = false;
      this.mediaPaused = false;
      this.videoVtt = '';

      const insElement = (this.$refs.insContent as Element);
      if(insElement) {
        const _el = insElement as HTMLElement;
        this.addToMenuLinks(_el);
      }

      // enable the next button
      if (this.element.content._embed) {
        this.$emit('afterVideo');
      } else {
        this.unlockNext();
      }

      //focus on the instruction
      this.$store.getters.setAccessibilityFocus(this.$refs.insContent);

    }

    // private subtitles() {
      // var cTime=this.video.currentTime;
      // console.log(cTime);
    // }

  }

</script>

<style scoped lang="scss">

  @import "../../style/global.scss";

  .media {
    overflow-y:auto;
    position: relative;

    display: flex!important;
    align-items: center;


    &.container {
      padding: 0!important;
      height: 100%!important;
    }

    .media-container {

      .media-content {
        display: flex;
        flex: 0 0 auto;
        
        padding: $container-padding-btw/2 $container-padding-btw;

        @media #{$media-iphoneX-landscape} {
            //display: none;
        }

        @media #{$media-phone} {
          display: flex;
          width: 100%;
          max-width: 100%;
          order: 1;
          //padding: $container-padding-phone/2 $container-padding-phone;
        }

        
        overflow: hidden;
        overflow-y: auto;

        .media-topic-title {
          color: $btw-topic-title-colour;
        }

        .media-title {
          color: $btw-title-colour;
          margin-top: 0rem;
        }

      }

      .media-main {
        flex: 1 1 auto;
        position: relative;
        overflow: hidden;
        height: 100%;
        width: 100%;
        max-width: 100%;

        background-color: $btw-grey;

        video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          max-width: 100%;
          max-height: 100%;
          //display: flex;
          //flex: 1 1 auto;

          max-height: -webkit-fill-available;
          //max-height: fill-available;
        }

        @media #{$media-phone} {
          order: 2;
        }

        .media-overlay {
          width: 100%;
          height: 100%;
          position: absolute;
          left: 0;
          top: 0;
          z-index: 100;

          @media #{$media-phone} {
            position: relative;
          }

          .media-overlay-content {
            width: 50%;
            margin: 0 auto;
            background-color: $btw-media-overlay-bg-colour;
            opacity: 0.9;
            color: $btw-media-overlay-text-colour;
            padding: 2.2em;

            @media #{$media-tablet} {
              width: 75%;
            }

            @media #{$media-phone} {
             width: 100%;
            }
          }
        }

        .media-video-controls {
          position: relative;
          max-height: 100vh;
          max-height: 100%;
        }

      }

      video::-webkit-media-text-track-container {
        position: relative;
      }

      video::-webkit-media-text-track-display {
        max-width: 90%;
        margin: 0 5%;
        font-size: 0.87em;
        padding-bottom: 1em;

        @media #{$media-iphoneX-landscape} {
          font-size: 1.2em;
          padding: 0em;
        }

        @media #{$media-tablet-land} {
          //font-size: 1.2em;
          padding: 0em;
        }

        @media #{$media-phone} {
          font-size: 1em;  
          padding: 0em;        
        }
      }

      video::cue {
        font-size: 0.87em;

        @media #{$media-iphoneX-landscape} {
          font-size: 1.2em;
        }

        @media #{$media-phone} {
          font-size: 1em;
        }
      }
      
      video {
        &.ccinvisible {
          &::-webkit-media-text-track-display {
            display: none;
          }
        }

        &.ccvisible {
          &::-webkit-media-text-track-display {
            display: block;
          }
        }

        &.fullscreen {
          position: fixed;
          right: 0;
          bottom: 0;
          min-width: 100%;
          min-height: 100%;
          z-index: 5025;
          background-color: $white;

          @media #{$media-iphoneX-landscape} {
            display: none;
          }
        }
      }


      .media-footer {
        flex: 1 1 auto;

        display: flex;
        flex-direction: column;
        
        position: relative;

        padding: 1em 0;

        @media #{$media-phone} {
          //display: none;
          order: 3;
          padding: 0.5rem;
        }

        .media-progress {
          height: 0.15em;
          background-color: $btw-media-progress-bg-colour;

          width: 100%;
          position: absolute;
          top: 0;
          left: 0;

          .media-progress-bar {
            background-color: $btw-media-progress-fill-colour;
            height: 100%;
          }

        }

        .media-end-ins {
         
        }
      }

      .media-controls {
        width: 100%;
        height: 100%;
        position: absolute;
        top:0;
        left:0;

        &.phone-start {
          background-color: rgba($btw-main-colour, $btw-main-alpha);
        }

        .media-play-icon, .media-rewind-icon, .media-pause-icon {
          width: 4.5em;
          height: 4.5em;
          cursor: pointer;
        }

        .media-rewind-icon {
          width: 6.5em;
          height: 8.5em;
          background-color: $btw-replay-bg-colour;
          color:$btw-replay-colour;

          position: relative;

          span {
            position: absolute;
            bottom: 1em;
            left: 0;
            width: 100%;
            text-align: center;
            font-weight: bold;
            letter-spacing: 1px;
          }

          &:after {
            content: '';
            background-image: url('~@/assets/images/replay_icon.svg');
            background-size: 55%;
            background-position: top center;
            background-repeat: no-repeat;
            width: 100%;
            height: 100%;
            position: absolute;
            top: 1.5em;
            left:0;
          }

          &:hover {
            background-color: $btw-replay-bg-colour-hover;
            color: $btw-replay-colour-hover;

            &:after {
              background-image: url('~@/assets/images/replay_icon_o.svg');
              background-size: 55%;
              background-position: top center;
              background-repeat: no-repeat;
            }
          }
        }

        button {
          @media #{$media-phone} {
            z-index: 5000;
          }
        }

      }

      .media-bottom-btns {
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .media-play-pause-btn {
          @media #{$media-iphoneX-landscape} {
              flex: 1 1 auto;
          }
      }

      .media-play-icon, .media-pause-icon { //.media-rewind-icon, 
        width: 3em;
        height: 3em;
        cursor: pointer;

        &:hover {
          opacity: 0.7;
        }

        img {
          object-fit: contain;
          max-height: 100%;
        }
      }

      .media-step-back-icon, .media-fullscreen-icon, .media-fullscreen-icon-fullscreen {
        width: 3em;
        height: 3em;
        max-height: 100%;
        cursor: pointer;

        &:hover {
          opacity: 0.7;
        }

        img {
          object-fit: contain;
          max-height: 100%;
        }
      }

      .media-fullscreen-icon-fullscreen, .media-fullscreen-icon {
        width: 2em;
        height: 2em;
        margin-left: 1em;

        @media (min-width: 768px) {
          display: none;
        }
      }
      .media-fullscreen-icon-fullscreen, .media-play-pause-btn-fullscreen {
        z-index: 5026;
        position: fixed;
        right: 5em;
        top: 1em;
        //background-color: $white;
      }

      .media-fullscreen-icon-fullscreen {
        width: 2.3em;
        height: 2.3em;
        @media (orientation: landscape) {
          display: none;
        }
      }

      .media-play-pause-btn-fullscreen {
          top: 1em;
          right: 0.25em;
      }

      .media-end {
        position: absolute;
        bottom: 5%;
        color: $btw-body-colour;
        background-color: rgba(0,0,0,0.7);
        padding: 0 1em;

        @media #{$media-phone} {
          position: relative;
        }
      }

    }

    .media-end-ins {
      background-color: rgba(0,0,0,0.7);
      color: $white;
      padding: 0 1em;
    }

  }

  
</style>
