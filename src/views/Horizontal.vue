<template>
  <div class="main-container horizontal flexbox flexbox-justify-stretch flexbox-align-stretch" id="horizontal" 
       :class="{ 'phone': device === 'phone' }" >
     <side-menu v-if="showSideMenu === true" @close="showSideMenu = false" />
     <header-bar v-if="$store.state.courseContent.global.header._display === true"  
                 direction="horizontal" 
                 @showMenu="showSideMenu = true" />
     
     <div id="page" class="page component-container flexbox flexbox-justify-stretch flexbox-align-stretch"
          :class="{ 'phone': device === 'phone' }" >
          <div class="">

            <div class="page-container" v-for="(page, index) in screens" :key="index" :class="{ 'phone': device === 'phone', 'hide': !getVisibility(page._id, index) && device !== 'phone' }" >
              <div :id="page._id" v-show="getVisibility(page._id, index)" >
                <component
                :is="page._component" 
                :element="page" 
                :class="page._classes" />
                <div class="section-break-phone" v-if="device === 'phone' && index < screens.length-1"></div> <!--  && index < screens.length-1 && $store.getters.getContentStatus(page._id, 'complete') -->
                <!-- <div class="fade fade-not-bookmark" v-show="page._id !== $store.state.bookmark" ></div> -->
                <!--  -->
              </div>

              <div class="locked-section" 
                  v-show="!getVisibility(page._id, index) && device === 'phone'">
                <div class="locked-titles flexbox flexbox-row justify-content-center">
                  <h1 v-html="page.content.title" v-if="page.content.title" />
                </div>
                <div class="locked-content flexbox flexbox-row" :class="{ 'last': index === screens.length-1 }">
                  <img class="icon" src="@/assets/images/icons/lock-alt.svg" />
                  <div v-html="$store.state.courseContent.global.unlock" />
                </div>
                <div class="section-break-phone" v-if="index < screens.length-1"></div>
              </div>

            </div>

            <popup v-if="$store.state.popup.show" />

          </div>
        </div>
    <home-button class="homeBtn" v-if="$store.state.courseContent.global.homeBtn._display === true"
                 @menu="navigateMenu" />
    <navigation v-if="$store.state.courseContent.global.footer._display === true && device !== 'phone'"
                @prev="navigatePrev" 
                @next="navigateNext"
                @menu="navigateMenu" />
    <footer-nav v-if="($store.getters.topicComplete === true || $store.getters.topicOptional === true) && device === 'phone'" 
                :element="$store.getters.getTopicFooter" />
  </div>
</template>

<script>

import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

import Components from '@/components/Components'
import Popup from '@/components/partials/Popup.vue'

export default {
  name: 'Horizontal',
  components: {
    ...Components, 
    Popup
  },
  data: function() {
    return {
      screens: this.$store.getters.getPagesHorizontal,
      indexCount: 0,
      showSideMenu: false
    }
  },
  computed: {
    device() {
      return this.$store.state.device;
    }
  },
  methods: {
    navigatePrev: function() {
      const uri = this.$store.getters.getNewPageID('prev');
      if ( uri !== '') {
        this.$router.replace({ path: uri });
      }
    },
    navigateNext: function() {
      const uri = this.$store.getters.getNewPageID('next');
      if ( uri !== '') {
        this.$router.replace({ path: uri });
      }
    },
    navigateMenu: function() {
      this.$router.replace({ path: '/menu' });
    },
    getVisibility: function(_id, _index) {
      let visible = false;
      const prevId = this.$store.getters.getPrevPageID(_id);
      let uri = this.$store.state.route;
      //console.log(this.$store.state.bookmark, this.$store.state.device);
      if (((this.$store.state.bookmark === _id || this.$store.state.device === 'phone') && !this.$store.getters.getContentStatus(_id, 'locked')) || (this.$store.getters.getContentStatus(_id, 'optional') && this.$store.state.device === 'phone') || uri === '/quiz') {
        visible = true;
      } 
      if (this.$store.state.courseContent.menu._type === 'pages' && this.$store.state.device === 'phone' && _index > 0) {
        const prevComplete = this.$store.getters.getContentStatus(prevId, 'complete');
        const prevOptional = this.$store.getters.getContentStatus(prevId, 'optional');
        if (prevComplete || prevOptional || (this.$store.getters.getContentStatus(_id, 'optional') && this.$store.state.device === 'phone')) {
          visible = true;
        } else {
          visible = false;
        }
      }
      return visible;
    }
  }
 
}

</script>

<style scoped lang="scss">
  
  @import "../style/global.scss";
  
  .horizontal {
    position: relative;

    aspect-ratio: 4/3;
    height: auto;

    @media #{$media-tablet-port} {
      height: calc(var(--vh, 1vh) * 100);
      aspect-ratio: unset;
    }
    @media #{$media-tablet-land} {
      height: calc(var(--vh, 1vh) * 100);
      aspect-ratio: unset;
    }

     @media #{$media-phone} {
      height: 100%;
      height: calc(var(--vh, 1vh) * 100);
      max-height: 100%;
      aspect-ratio: unset;
    }
    
    width:100%;
    max-width: 1024px;

    .page {
      flex: 1 1 auto;
      height: 0;
      overflow: hidden;
      //overflow-y: auto;

      //max-height: 100vh;

      .page-container {
        display: block;
        &.hide {
          display: none;
        }
      }
      
      .section-break-phone {
        height: 4px;
        border-radius: 4px;
        width: 80%;
        left: 10%;
        top: 0; //-4rem;
        transform: translate(0%,-50%);
        position: relative;
        background-color: $btw-mobiledivider-colour;
        margin: 2rem 0;

      }

      .fade-not-bookmark {
        opacity: 0.75;
        position: absolute;
        top:0;
        left:0;
        height: 100%;
        width: 100%;
        background-color: $white;
        z-index: 1001;
      }

      &.phone {
        // position: relative;
        overflow: visible;
        height: auto;
        flex: 0 0 auto;
        justify-content: start;
        align-items: start;
        margin-top: $btw-topbar-height;

        @media #{$media-phone} {
          margin-top: $btw-topbar-height-mobile;
        }
        max-height: none;
      }

      div {
        max-height: 100%;
        height: 100%;
        width: 100%;
        position: relative;
        overflow: hidden;

        &.phone {
          min-height: 0;
          height: auto;
          /*height:100%;
          height: -webkit-fill-available;*/
          
        }
      }

      .locked-section {
        height: auto;

        .locked-titles, .locked-content {
          padding: 1rem 0;
          max-width: 90%;
          margin: 0 auto;
        }

        .locked-content {
          .icon {
            width: 1.7em;
            height: 1.7em;
          }

          &.last {
            padding-bottom: 4.5em;
          }
        }

      }
    }

    &.phone {
      position: relative;
      min-height: 100%;
      height: auto;

      height:100%;
      height: -webkit-fill-available;
      
    }

    .homeBtn {
      position: absolute;
      top:0;
      left: 0;
      z-index: 1002;

    }
  }
</style>
