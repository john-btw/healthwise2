<template>
  <div id="pagemenu" class="page-menu main-container grid-x flexbox flexbox-justify-stretch flexbox-align-stretch" role="region" level="1" >

    <header-bar v-if="$store.state.courseContent.global.header._display === true" direction="" />

    <div class="page-menu-header flexbox flexbox-justify-center flexbox-align-end">
      <img :src="$store.state.device !== 'phone' ? $store.state.courseContent.menu._headerImage : $store.state.courseContent.menu._headerImageMobile" />
      <div class="page-menu-header-title">
        <h1 ref="menuaccessibility" class="accessibility-region" tabindex="-1">{{$store.state.courseContent.global._accessibility.menutitle}}</h1>
        <img class="page-menu-header-logo" src="~@/assets/images/logo.png" aria-hidden="true" />
      </div>
    </div>

    <div class="page-menu-main flexbox flexbox-row flexbox-justify-stretch flexbox-align-stretch">

        <div class="page-menu-headings grid-x flexbox flexbox-column flexbox-justify-start flexbox-align-start" role="navigation">

          <button class="page-menu-heading topic flexbox flexbox-row flexbox-justify-start flexbox-align-center" 
               v-for="(topic, index) in $store.state.courseContent.topics" :key="index" 
               @click="navigateTopic(topic._uri, index)"
               @mouseenter="lockedHover = true; lockedIndex = index;"
               @mouseleave="lockedHover = false"
               :style="{ 'background-color': element._colours[index] }"
               :class="getClasses(topic._uri, index)"
               :aria-label="getMenuItemAriaContent(topic._uri, topic.title, index)" role="button" tabindex="0" >
            <img class="tile-img-mobile" v-if="$store.state.device === 'phone' && topic._image" :src="topic._image" />
            <img class="page-menu-tile-lock" src="@/assets/images/icons/lock-alt.svg" v-if="$store.getters.checkTopicLocked(topic._uri)" />
            <img class="page-menu-tile-complete" src="@/assets/images/icons/menu_tick.svg" v-if="$store.getters.checkTopicComplete(topic._uri) && $store.state.topics[index].optional === false" /> 
            <div class="page-menu-tile-count" v-if="!$store.getters.checkTopicComplete(topic._uri) && device === 'phone' && $store.state.topics[index].optional === false" v-html="getTopicCompleteCount(index)" />
            <div class="page-menu-tile-title" v-html="getTopicHeaderTitle(topic.title, index)" />
            <div class="page-menu-tile-lock-message" v-html="$store.state.courseContent.menu._pages[index]._lockedInfo" v-if="$store.getters.checkTopicLocked(topic._uri) && $store.state.courseContent.menu._pages[index]._lockedInfo" v-show="lockedHover === true && lockedIndex === index"/>
          </button>

          <div class="page-menu-heading page-menu-heading-extras flexbox flexbox-row flexbox-justify-stretch flexbox-align-stretch" >
            <button class="flexbox flexbox-justify-center flexbox-align-center"
                  :style="{ 'background-color': element._colours[$store.state.topics.length] }"
                  :aria-label="$store.state.courseContent.global._accessibility.helptitle" role="button" tabindex="0" ref="menuhelpbtn"
                  @click="showHelp" >
              <img class="page-menu-help-icon" src='~@/assets/images/icons/question-circle-solid.svg' />
            </button>
            <button class="flexbox flexbox-justify-center flexbox-align-center"
                  :style="{ 'background-color': element._colours[$store.state.topics.length] }"
                  :aria-label="$store.state.courseContent.global._accessibility.resourcetitle" role="button" tabindex="0" ref="menuresourcesbtn"
                  @click="showResources" >
              <img class="page-menu-info-icon" src='~@/assets/images/icons/info-circle-solid.svg' />
            </button>
          </div>

        </div>
        
        <div class="page-menu-items grid-x flexbox"  >
        <!-- v-if="$store.state.device !== 'phone'" -->
          <div class="page-menu-topic-main-title flexbox flexbox-row">
            <h4 v-html="getTopicTitle($store.state.topic)" ref="menutopicheader" tabindex="-1" /> 
            <div class="page-menu-topic-main-title-text" v-html="getTopicText($store.state.topic)" />
          </div>
          <div class="page-menu-topic-tiles-container flexbox flexbox-justify-stretch flexbox-align-stretch">
            <div class="page-menu-topic-tiles flexbox" v-for="(topic, tIndex) in $store.state.courseContent.topics" :key="tIndex" >
              <div class="page-menu-tiles flexbox flexbox-row flexbox-justify-stretch flexbox-align-stretch" 
                    v-if="$data._currentTopic === tIndex" :aria-label="getTopicAriaContent($store.state.topic)" role="navigation">
                <div class="page-menu-tile flexbox flexbox-row flexbox-justify-stretch flexbox-align-stretch" 
                    v-for="(tile, index) in $store.state.courseContent.menu._pages[tIndex]._images" :key="index" >
                      <button class="page-menu-click" :class="{ 'page-menu-click-cursor': tile._imageComplete, 'placeholder': !tile._id }" 
                      @click="navigateToScreen(topic._uri, tile._id)" 
                      :aria-label="getPageAriaContent(tIndex, tile)" 
                      :role="getPageTitle(tIndex, tile._id) !== '' ? 'button' : '' " 
                      :aria-hidden="getPageTitle(tIndex, tile._id) !== '' ? false : true" 
                      :tabindex="checkPageTabIndex(tIndex, tile)" >
                        <img class="tile-img" v-if="tile._image" :src="tile._image" />
                        <div v-if="tile._id" class="tile-title">{{getPageTitle(tIndex, tile._id)}}</div>
                        <div class="tile-icons flexbox flexbox-row flexbox-justify-end flexbox-align-start" v-if="tile._id">
                          <div class="tile-icon-container">
                            <img v-if="showAudioIcon(tIndex, tile._id) || tile._audio === true" class="page-menu-audio-icon tile-icon" src='~@/assets/images/icons/audio_icon.svg' />
                            <img v-if="showVideoIcon(tIndex, tile._id)" class="page-menu-video-icon tile-icon" src='~@/assets/images/icons/video_icon.svg' />
                          </div>
                          <img class="page-menu-tile-chevron " src="@/assets/images/icons/chevron.svg" v-if="!$store.getters.getContentStatus(tile._id, 'complete') || $store.state.topics[tIndex].optional === true" />
                          <img class="page-menu-tile-complete screen" src="@/assets/images/icons/menu_tick.svg" v-if="$store.getters.getContentStatus(tile._id, 'complete') && $store.state.topics[tIndex].optional === false" />
                        </div>
                      </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      
    </div>

    <div class="page-menu-footer flexbox flexbox-justify-center flexbox-align-start" >
      <div class="page-menu-footer-bar" :style="{ 'background-color': $store.state.courseContent.menu._barColour }" />
    </div>

  </div>
</template>

<script lang="ts">

  import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

  import Components from '@/components/Components'

  @Component({ 
    components: {
      ...Components
    }
  })

  export default class Menu extends Vue {
    private element: any;

    public _currentTopic: number = -1;

    public lockedHover: boolean = false;
    public lockedIndex: number = -1;

    get device() {
      return this.$store.state.device;
    }

    beforeMount() {
      this.element = this.$store.state.courseContent.menu ? this.$store.state.courseContent.menu : '';

      if (this.element === '') { // || this.$store.state.device === 'phone'
        this.$router.replace({ path: '/' });
        this.$store.getters.write;
      }

      if(this.$data._currentTopic === -1) {
        this.setTopicNumber(0);
      }

      Vue.nextTick(() => {
        //console.log('menu beforeMount >>');
        this.$store.getters.setAccessibilityFocus(this.$refs.menuaccessibility);
      });
    }

    activated() {
      //focus on the title of the new slide
      Vue.nextTick(() => {
        //console.log('menu activated >>');
        this.$store.getters.setAccessibilityFocus(this.$refs.menuaccessibility);
      });
    }

    private getAriaContent() {
      return this.$store.state.courseContent.global._accessibility.menutitle;
    }

    private getMenuItemAriaContent(_uri: string, _title: string, _index: number) {
      let str = '';
      str += this.$store.getters.removeCharStr(_title) + ", " + this.$store.state.courseContent.global._accessibility.menuprogress;
      if (this.$store.getters.checkTopicLocked(_uri) && this.$store.state.courseContent.menu._pages[_index]._lockedInfo) {
        str += this.$store.state.courseContent.global._accessibility.locked + ", " + this.$store.state.courseContent.menu._pages[_index]._lockedInfo;
      } else if (this.$store.getters.checkTopicLocked(_uri)) {
        str += this.$store.state.courseContent.global._accessibility.locked;
      } else if(this.$store.getters.checkTopicComplete(_uri)) {
        str += this.$store.state.courseContent.global._accessibility.complete;
      } else {
        str += this.$store.state.courseContent.global._accessibility.incomplete;
      }
      return str;
    }

    private getTopicAriaContent(_topic: number) {
      let str = this.$store.getters.removeCharStr(this.$store.state.courseContent.topics[_topic].title);
      const currentData = this.$store.state.courseContent.menu._pages[this.$data._currentTopic]._images;
      if(currentData) {
        currentData.forEach((item: any, index: number) => {
          if(item.text) {
            str += " : " + this.$store.getters.removeCharStr(item.text);
          }
        });
      }
      return str;
    }

    private getPageAriaContent(_topic: number, _page: any) {
      let str = '';
      let mediaStr = '';
      ///// if an aimge i.e. main tile /////
      if(_page._image) {
        // page title
        if (this.getPageTitle(_topic, _page._id) !== '') {
          str += this.getPageTitle(_topic, _page._id);
        }
        // has media?
        if(this.showVideoIcon(_topic, _page._id)) {
          mediaStr += this.$store.state.courseContent.global._accessibility.videotitle;
        }
        if (this.showAudioIcon(_topic, _page._id) || _page._audio === true) {
          if (mediaStr !== '') {
            mediaStr += ' and ';
          }
          mediaStr += this.$store.state.courseContent.global._accessibility.audiotitle;
        }
        // if media, add to the aria-label
        if (mediaStr !== '') {
          str += ', ' + this.$store.state.courseContent.global._accessibility.containsmedia + mediaStr;
        } 
        // add completion status - if a page title!
        if (this.getPageTitle(_topic, _page._id) !== '') {
          str += ", " + this.$store.state.courseContent.global._accessibility.menuprogress;
          if (this.$store.getters.getContentStatus(_page._id, 'complete') ) {
            str += this.$store.state.courseContent.global._accessibility.complete;
          } else {
            str += this.$store.state.courseContent.global._accessibility.incomplete;
          }
        }
      }
      return str;
    }

    private checkPageTabIndex(_topic: number, _page: any) {
      let str = '-1';
      // page title and has an image
      if (this.getPageTitle(_topic, _page._id) !== '' && _page._image) {
        str = '0'
      }
      return str;
    }

    private getClasses(_uri: string, _index: number) {
      let classes = '';
      if(this.element._classes) {
        classes += this.element._classes;
      }
      if (this.$store.getters.checkTopicLocked(_uri)) {
        classes += 'locked ';
      }
      if (this.$store.getters.checkTopicComplete(_uri)) {
        classes += 'complete ';
      }
      if (_index === this.$data._currentTopic) {
        classes += 'active';
      }
      return classes; 
    }

    private getTopicHeaderTitle(_str: string, _index: number) {
      let str = this.changeColour(_str, _index);
      return str;
    }

    private getTopicTitle(_topic: number) {
      //remove <br/> if is one
      let titleStr = this.$store.state.courseContent.topics[_topic].title;
      titleStr = titleStr.replace("<br/>", " - ");

      //return the new colouring
      return this.changeColour(titleStr, null);
    }

    private getTopicText(_topic: number) {
      return this.$store.state.courseContent.topics[_topic].text;
    }

    private getMainTitle() {
        let str = this.changeColour(this.$store.state.courseContent.config.coursename, null);
        return str;
    }

    private getTopicCompleteCount(_topic: number) {
      let tCount = 0;
      const tTotal = this.$store.state.topics[_topic].pages.length;
      this.$store.state.topics[_topic].pages.forEach((page: any, index: number) => {
        //console.log(_topic, page, page.complete, index);
        if (page.complete === true) {
          tCount++;
        }
      })
      return tCount + '/' + tTotal;
    }


    private changeColour(_str: string, _index: any) {
        var res = _str.split("|");
        var newStr = '<div>';
        if (res.length > 1) {
          res.forEach((part: any, index: number) => {
              var res2 = part.split("<br/>");
              if(res2.length > 1) {
                res2.forEach((part2: any, index2: number) => {
                  if (_index === null || _index !== this.$data._currentTopic) {
                    if (index2 === 1) {
                        newStr += '<span class="btw-main">' + res2[index2] + "</span>";
                    } else {
                        newStr += res2[index2];
                        if(index2 === 0) {
                          newStr += "<br/>";
                        }
                    }
                  } else {
                    if (index2 === 1) {
                        newStr += '<span class="btw-secondary">' + res2[index2] + "</span>";
                    } else {
                        newStr += res2[index2];
                        if(index2 === 0) {
                          newStr += "<br/>";
                        }
                    }
                  }
                });
              } else {
                if (_index === null || _index !== this.$data._currentTopic) {
                  if (index === 0) {
                      newStr += '<span class="btw-main">' + res[index] + "</span>";
                  } else {
                      newStr += res[index];
                  }
                } else {
                  if (index === 0) {
                      newStr += '<span class="btw-secondary">' + res[index] + "</span>";
                  } else {
                      newStr += res[index];
                  }
                }
              }
              
          });
        }else {
          newStr += res;
        }
        newStr += '</div>';
        return newStr;
    }


    private getPageTitle(_topic: number, _page: string) {
      let title = '';
      if (this.$store.state.courseContent.topics[_topic].pages) {
        this.$store.state.courseContent.topics[_topic].pages.forEach((page: any) => {
          if (page._id === _page) {
            title = page.content.title;
          }
        });
      }
      return title;
    }

    private showVideoIcon(_tIndex: number, _id: string) {
      let icon = false;
      if (this.$store.state.courseContent.topics[_tIndex].pages) {
        this.$store.state.courseContent.topics[_tIndex].pages.forEach((page: any, index: number) => {
          if (page._id === _id) {
            if (page._component === 'media') {
              icon = true;
            }
          }
        });
      }
      return icon;
    }

    private showAudioIcon(_tIndex: number, _id: string) {
      let icon = false;
      if (this.$store.state.courseContent.topics[_tIndex].pages) {
        this.$store.state.courseContent.topics[_tIndex].pages.forEach((page: any, index: number) => {
          if (page._id === _id) {
            if (page._component === 'media') {
              icon = true;
            }
            if(page._component === 'carousel') {
               
               if(page.content.slides) {
                 let audioFound = false;
                 page.content.slides.forEach((slide: any) => {
                  if(slide._audio) {
                      audioFound = true;
                  }
                });
                if(audioFound) {
                  icon = true;
                }
               }
            }
          }
        });
      }
      return icon;
    }

    private setTopicNumber(_index: number) {
      this.$store.state.topic = _index;
      this.$data._currentTopic = _index;
      this.$store.getters.write;
    }

    private navigateTopic(_uri: string, _index: number) {
      this.setTopicNumber(_index);
      if(_uri === '/quiz') {
        this.$store.state.topic = 0;
        this.$data._currentTopic = 0;
      }
      const pagesLength = this.$store.state.courseContent.topics[_index].pages.length;
      if (!this.$store.getters.checkTopicLocked(_uri)) {
        if (this.$store.state.device !== 'phone') {
          if( pagesLength > 1) {
            //this.setTopicNumber(_index);
          }else {
            this.navigateToScreen(_uri, this.$store.state.courseContent.topics[_index].pages[0]._slideIndex);
          }
          //focus on the topic sub menu
          Vue.nextTick(() => {
            this.$store.getters.setAccessibilityFocus(this.$refs.menutopicheader);
          });
        } else {
          //this.$router.replace({ path: _uri });
          this.navigateToScreen(_uri, this.$store.state.courseContent.topics[_index].pages[0]._id);
        }
      }
    }

    private navigateToScreen(_uri: string, _pageURI: string) {
      if(_pageURI || _uri === '/quiz') {
        this.$store.state.bookmark = _pageURI;
        this.$store.getters.setSCORMBookmark(_pageURI);

        Vue.nextTick(() => {
          this.$router.replace({ path: _uri });
        });
      }
      this.$store.getters.write;
    }



    private showHelp() {
      this.$store.state.showHelp = true;
      this.$store.getters.write;
    }

    private showResources() {
      this.$store.state.showResources = true;
      this.$store.getters.write;
    }

    private showLangSelect() {
      this.$store.state.showLangSelect = true;
      this.$store.getters.write;
    }

    private exitCourse() {
      
    }

  }


</script>

<style scoped lang="scss">
  
  @import "../style/global.scss";

  .page-menu {
    position: relative;
    
    background-color: $white;
    //height: 100%;

    .page-menu-header {
      height: auto;
      flex: 0 0 auto;
      padding: 0 0.5em;
      position: relative;
      max-height: $btw-topbar-height-mobile;
      border-bottom: 0.2em solid $btw-main-colour;
      margin-bottom: 0.5em;

      img {
        object-fit: contain;
        width: auto;
        height: 100%;
        object-position: center;
        max-height: $btw-topbar-height-mobile;
      }

      .page-menu-header-title {
        position: absolute;
        left: 3em;
        font-weight: bold;

        @media #{$media-phone} {
          left: 1rem;
          max-width: 50%;
        }

        img {
            border: 0;
            object-position: left center;
        }
      }

      .page-menu-header-logo {
        //height: 5em;
      }

      .langselect-icon {
        width: 2.25em;
        height: 2.25em;
        position: absolute;
        right: 20%;
        top: 1.5em;
        cursor: pointer;
        border: 0;

        &:hover {
          opacity: 0.7;
        }

        @media #{$media-phone} {
          right: 42%;
        }
      }

    }

    .page-menu-tile-complete {
      width: 1.5em!important;
      height: 1.5em;
      position: absolute;
      right: 0.2em;
      bottom: 0.2em;

      @media #{$media-phone} {
        right: 40%;
        top: 75%;
        transform: translate(-50%, -50%);
      }

      &.screen {
        width: 1.5em!important;
        height: 1.5em;
        right: 0.6em;
        bottom: 0.75em;
      }
    }

    .page-menu-tile-count {
      width: auto!important;
      height: auto;
      position: absolute;
      text-align: right;
      right: 40%;
      top: 80%;
      transform: translate(-50%, -50%);
      font-weight: normal;
      font-style: italic;
    }

    .page-menu-tile-chevron {
      width: 1.7em!important;
      height: 1.7em;
      position: absolute;
      right: 0.5em;
      bottom: 0.75em;
      object-fit: contain!important;
    }

    .page-menu-tile-lock {
      width: 1em!important;
      height: 1em;
      position: absolute;
      right: 0.5em;
      bottom: 0.5em;
    }

    .page-menu-main {
      flex: 1 1 auto;
      height: 0;
      overflow: hidden;
      overflow-y: auto;

      padding: 0 0.5em;

      @media #{$media-small} {
        flex-direction: column;
      }
      @media (min-width: $largest-medium-device) and (orientation: portrait) {
        flex-direction: column;
      }

      .page-menu-headings {
        height: 100%;
        flex-wrap: wrap;
        flex: 1 1 auto;
        width: 20%;

        @media #{$media-small} {
          width: 100%;
          height: 40%;
        }
        @media (min-width: $largest-medium-device) and (orientation: portrait) {
          width: 100%;
          height: 40%;
        }

        .page-menu-heading {
          box-sizing: border-box;
          margin: 0.25em 0;
          cursor: pointer;
          position: relative;
          width: 100%;

          font-weight: bold;

          flex: 1 1 auto;

          color: $btw-body-colour!important;

          &.topic {
            @media (hover: hover) and (pointer: fine) {
              &:hover {
                background-color: $btw-main-colour!important;
                opacity: $btw-main-alpha!important;
                color: $btw-menu-active-text-colour!important;
              }
            }
          }

          .page-menu-tile-lock-message {
            position: absolute;
            top:0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: $btw-main-colour;
            color:  $btw-menu-active-text-colour; //$btw-body-colour;
            padding: $container-padding-btw/2;
            display: flex;
            align-items: center;
          }

          .page-menu-tile-count {
            color: $btw-body-colour; //$btw-main-colour;
          }

          &.locked {
            cursor: default;
            opacity: 0.5;
          }

          &.complete {
            // background-color: $correct-highlight!important;
            // color: $btw-body-colour!important;
          }
          
          &.active {
            background-color: $btw-menu-active-colour!important;
            color: $btw-menu-active-text-colour!important;

            .page-menu-tile-count {
              color: $btw-menu-active-text-colour;
            }

          }

          .page-menu-tile-title {
            flex-wrap: wrap;
            flex: 1 1 auto;
            text-align: left;
            padding: 0 1em 0 2em;
            display: flex;
            align-items: center;
            height: 10.28px;
            min-height: -webkit-fill-available;
            @media #{$media-mobile} {
              padding: 0 0.5em 0 1em;
            }

            @media #{$media-phone} {
              width: calc(100% - 48% ); //$mobile-menu-img-width
              flex: 0 0 auto;
            }
          }

        }

        .page-menu-heading-extras {

          button {
            display: flex;
            flex: 1 1 auto;
            margin: 0 0.25em;
            cursor: pointer;

            background-color: $btw-grey;

            &:hover {
              opacity: 0.5;
            }

            &:first-child {
              margin-left: 0;
            }

            &:last-child {
              margin-right: 0;
            }
          }
        }

      }

      .page-menu-topic-main-title {

        flex-direction: row;
        display: flex;
        flex: 0 0 auto;
        width: 100%;
        align-items: center;
        min-height: 4.2em;

        h4 { 
          // margin-right: 2rem;
          //width: 55%;
        }

        .page-menu-topic-main-title-text {
          color: $btw-main-colour;
          font-weight: bold;
          margin-left: 1rem; //
        }
      }

      .page-menu-topic-tiles-container {
        flex: 1 1 auto;
        position: relative;
      }

      .page-menu-topic-tiles {
        height: 100%;
        position: absolute;
        top:0;
        left:0;
        flex: 1 1 auto;
      }

      .page-menu-items {

        margin-left: 1%;
        flex: 1 1 auto;
        width: 80%;
        position: relative;

        @media #{$media-phone} {
          display: none;
        }

        @media #{$media-small} {
          width: 100%;
          height: 60%;
        }

        @media (min-width: $largest-medium-device) and (orientation: portrait) {
          width: 100%;
          height: 60%;
        }
        
      }

      .tile-img-mobile {
        height: 100%;
        width: 40%; //$mobile-menu-img-width
        object-fit: cover;
        object-position: top;
        position: absolute;
        top:0;
        right:0;
      }

      .page-menu-tiles {

        flex: 1 1 auto;
        width: 100%;
        height: 100%;
        flex-wrap: wrap;
        box-sizing: border-box;
        justify-content: space-between;

        .page-menu-tile {
          width: 32.3%;
          height: 31.5%;
          max-width: 32.3%;
          max-height: 31.5%;
          margin: 0;
          box-sizing: border-box;
          align-self: center;
          overflow: hidden;

          .tile-img {
            object-position: top center;
            height: 100%;
            object-fit: cover;
          }

          img {
            width: 100%;
            object-fit: cover;
          }

        }

        .page-menu-click-cursor {
          cursor: pointer;
        }
        
        .page-menu-click {
          display: flex;
          position: relative;
          width: 100%;
          cursor: pointer;

          &.placeholder {
            cursor: default;
            
            &:after {
              content: '';
              position: absolute;
              top:0;
              left:0;
              width: 100%;
              height: 100%;
              background-color: $btw-main-colour;
              opacity: $btw-main-alpha;
            }
          }

          &:hover {
            .tile-title {
              &:after {
                content: "";
                width: 2.8em;
                background-color: $btw-menu-hover-tile;
                position: absolute;
                right:0;
                top:0;
                height: 100%;
                z-index: 1;
              }
            }
          }
          
          .tile-title {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            text-align: left;
            color: $white;
            background-color: $black;
            padding: 0 5em 0 1.25em;
            max-height: 3.5em;
            height: 3.5em;
            align-items: center;
            display: flex;
            line-height: 1.2;
          }

          .tile-icons {
            position: absolute;
            bottom: 0;
            right: 0;
            width: 100%;
            height: 100%;
            z-index: 2;

            .tile-icon {
              width: 2em;
              height: 1.2em;
              margin: 0.1em;
              right: 2.5em;
              object-fit: contain;
            }

            .tile-icon-container {
              position: absolute;
              flex-direction: column;
              justify-content: center;
              display: flex;
              bottom: 0;
              right: 3em;
              height: 3.5em;
            }
           
          }
        }

      }

    }

    .page-menu-exit-icon, .page-menu-help-icon, .page-menu-info-icon, .page-menu-lang-icon {
        width: 1.8em;
        height: 1.8em;
        object-fit: contain;
    }

    .page-menu-tile {
      color: $btw-main-colour;
    }

    h5 {
      color: $btw-body-colour;
    }

    .page-menu-footer {
      height: auto;
      flex: 0 0 auto;
      padding: 1em 0.5em;

      .page-menu-footer-bar {
        height: 0.2em;
        width: 100%;
      }
    }

    .page-menu-click {
      //&:hover {
        &::after {
          position: absolute;
          top:0;
          left:0;
          width: 100%;
          height: 100%;
          background-color: $btw-main-colour;
          opacity: 0.5;
        }
      // }
    }

  }

  

</style>
