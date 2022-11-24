<template>
  <div id="app" :class="{ 'no-transitions': $store.state.courseContent._css === true }" :lang="$store.state.language" >
  <preloader v-if="$store.state.imagesLoaded === false"  />
  <dev-panel v-if="$store.state.courseContent._dev === true" />
    <div class="course-container">
      <!-- <bookmarking v-if="$store.state.tempbookmark !== ''" /> -->
      <btw-splash v-if="$store.state.showSplash === true && $store.state.courseContent.global.splash._type === 'btw'" />
      <!-- <btw-complete v-if="$store.state.showComplete === true && !$store.state.showSplash && !$store.state.userCloseComplete" /> -->
      <btw-help v-if="$store.state.showHelp === true" />
      <btw-lang-select v-if="$store.state.showLangSelect === true" />
      <btw-resources v-if="$store.state.showResources === true" />
      <div class="course flexbox flexbox-justify-center flexbox-align-center" :aria-hidden="isHidden()" v-if="$store.state.showSplash === false" >
        <keep-alive>
          <router-view :key="$route.path" default="/menu"/>
        </keep-alive>
      </div>
    </div>
    <css-panel v-if="$store.state.courseContent._css === true" />
   <btw-rotate v-if="$store.state.device === 'phone' && $store.state.orientation === 'landscape'" />
  </div>
</template>

<script lang="ts" >

  import store from './store'
  import Bookmarking from '@/components/partials/Bookmark.vue'

  import Preloader from '@/components/partials/Preloader.vue'

  import BtwComplete from '@/components/partials/BTW/Complete.vue'
  import BtwHelp from '@/components/partials/BTW/Help.vue'
  import BtwLangSelect from '@/components/partials/BTW/LanguageSelection.vue'
  import BtwResources from '@/components/partials/BTW/Resources.vue'
  import BtwSplash from '@/components/partials/BTW/Splash.vue'

  import DevPanel from '@/components/tools/Dev.vue'
  import CssPanel from '@/components/tools/CSS.vue'

  import BtwRotate from '@/components/partials/BTW/Rotate.vue'

  export default {
    components: {
      // Bookmarking,
      // BtwComplete,
      BtwHelp,
      BtwLangSelect,
      BtwResources,
      BtwSplash,
      DevPanel,
      CssPanel,
      Preloader,
      BtwRotate
    },
    watch: {
      '$route': function(route: any) {
        //if(store.state.tempbookmark === '') {
          if(route.path === '/menu') {
            store.getters.setSCORMBookmark('menu');
          }
          if (store.state.courseContent.global._navigation === 'navigation' && store.state.courseContent.menu._type === 'pages' && store.state.started) {
            store.getters.setRouteScreen(route.path); 
            if(route.path === '/menu') {
              store.getters.checkShowCourseComplete;
            }
          } else {
            store.getters.setRoute(route.path); 
          }
          if(store.state.courseContent.global._navigation === 'navigation' && store.state.courseContent.menu._type === 'pages' && !store.state.started) {
            if (route.path === '/menu') {
                store.state.started = true;
            }
          }
          store.getters.write;
        //}

      }
    },
    mounted: function() {
      // First we get the viewport height and we multiple it by 1% to get a value for a vh unit
      let vh = window.innerHeight * 0.01;

      // Then we set the value in the --vh custom property to the root of the document
      document.documentElement.style.setProperty('--vh', `${vh}px`);

      //calc font size
      var elemSM = document.getElementById('splash') ? document.getElementById('splash') : document.getElementById('pagemenu');
      let ratio = (1024 * 1/1024) * 14;
      if(elemSM) {
        const h = elemSM!.getBoundingClientRect().height;
        const w = elemSM!.getBoundingClientRect().width;
        ratio = (w * 1/1024) * 14;
      }
      document.documentElement.style.setProperty('--font-ratio', `${ratio}px`);
      //console.log('MOUNTED >>> ',  `${ratio}px`);

      let backToPortrait = false;

      // window.addEventListener('scroll', store.getters.handleScroll);
      window.addEventListener( 'beforeunload', store.getters.saveSCORM );
      window.addEventListener( 'resize', function() {
        let device = '';
        if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {//568
          device = 'phone'; 
        }

        store.getters.setDevice(device);

        vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);

        //calc font size
        setTimeout(() => {
          let elem: any;
          if(store.state.bookmark !== 'menu') {
            elem = document.getElementById(store.state.bookmark);
          } else {
            elem = document.getElementById('splash') ? document.getElementById('splash') : document.getElementById('pagemenu');
          }
          console.log(store.state.bookmark);
          let ratio;
          if(elem) {
            const h = elem!.getBoundingClientRect().height;
            const w = elem!.getBoundingClientRect().width;
            ratio = (w * 1/1024) * 14;
          } else {
            ratio = (1024 * 1/1024) * 14;
          }
          document.documentElement.style.setProperty('--font-ratio', `${ratio}px`);
          //console.log('RESIZE >>> ', `${ratio}px`);
        }, 100);

      } );
      window.addEventListener( 'orientationchange', (event) => {
        //console.log(screen.orientation);

        switch(window.orientation) {  
          case -90: case 90:
            store.getters.setOrientation('landscape');
            backToPortrait = true;
            break; 
          case 0:
            store.getters.setOrientation('portrait'); 
            if(backToPortrait === true) {
              setTimeout(() => {
              var elem = document.getElementById('page');
              var elemBM = document.getElementById(store.state.bookmark);
              if (elem && !elemBM) {
                  elem!.scrollTop = (elem!.scrollHeight + elem!.offsetHeight);
              }
              if (elemBM) {
                elemBM!.scrollIntoView();
                //store.getters.scrollToElement(elemBM, true);
              }
                backToPortrait = false;
              }, 100);
            }
            break; 
        }

      });

      //  window.addEventListener("scroll", () => {
      //   if(store.state.device === 'phone' && store.state.bookmark !== 'menu') {
      //     var pages = document.getElementById('page')!.querySelectorAll(".phone");

      //     for (var i = 0; i < pages.length-1; i++) {

      //       var windowHeight = window.innerHeight;
      //       var elementVisible = 140;
      //       if(pages[i]) {
      //         var elementTop = pages[i]!.getBoundingClientRect().top;

      //         const viewOffset = windowHeight - elementVisible;
      //         if (elementTop < viewOffset) { 
      //           var elTop = pages[i].getBoundingClientRect().top; 
      //           var elHeight = pages[i].getBoundingClientRect().height; 
      //           //console.log(i, elTop, windowHeight-elementVisible, windowHeight - elHeight, windowHeight/1);
      //           if (elTop < windowHeight/2) { //elTop > windowHeight-elementVisible || 
      //             if(pages[i].querySelectorAll('.fade-not-bookmark')[0]) {
      //               pages[i].querySelectorAll('.fade')[0].classList.remove("fade-not-bookmark");
      //               console.log("Remove");
      //             }
      //           } 
      //           if(elTop > windowHeight || elTop < 0) {
      //             if(pages[i].querySelectorAll('.fade')[0]) {
      //               pages[i].querySelectorAll('.fade')[0].classList.add("fade-not-bookmark");
      //             }
      //           }
      //         }
      //       }
            
      //     }

      //   }

      // }, true);

      //show splash?
      store.state.showSplash = store.state.courseContent.global.splash._display;

        //set device and orientation
        let device = '';
        if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {//568
          device = 'phone'; 
        }

        store.getters.setDevice(device);

        switch(window.orientation) {  
          case -90: case 90:
            store.getters.setOrientation('landscape');
            break; 
          case 0:
            store.getters.setOrientation('portrait'); 
            break; 
        }

    },
    methods: {
      isHidden: function() {
        let hidden = false;
        if(store.state.tempbookmark !== '' || (store.state.showSplash === true && store.state.courseContent.global.splash._type === 'btw') || 
        (store.state.showComplete === true && !store.state.showSplash && !store.state.userCloseComplete) || store.state.showHelp === true ||
        store.state.showLangSelect === true || store.state.showResources === true) {
          hidden = true;
        }
        return hidden;
      }
    }
    
  }
</script>

<style lang="scss">

  @import "style/global.scss";

  #app {
    
    position: relative;
    text-align: center;
    color: $btw-body-colour;
    background-color: $app-background;

    width: 100%;
    max-width: $max-width;
    height: 100vh;
    max-height: 100vh;
    //max-height: calc(var(--vh, 1vh) * 100);

    display: flex;
    align-items: center;
    justify-content: center;

    overflow: hidden;

    @media #{$media-tablet-land}{
        height: 100vh;
        max-height: 100vh;
        width: 100%;
        max-width: 100%;
        display: block;
    }

    @media #{$media-phone} {
      height: calc(var(--vh, 1vh) * 100);
      //margin-top: 4rem;
      width: 100%;
      overflow-y: auto;
    }

    //max-height: 768px;
    min-height: -webkit-fill-available;
    max-height: -webkit-fill-available;

    &.no-transitions {
      animation: none!important;
    }

    .course-container {
      height: auto;
      width: 100%;
      aspect-ratio: 4/3;
      max-width: 100%;
      max-height: 768px;

      @media(max-height: 768px) {
        width: auto;
        height: 100vh;
      }

      @media #{$media-iphoneX-landscape} {
        height: 100vh;
        max-width: 100%;
      }
      
      @media #{$media-tablet-land}{
        height: 100vh;
        max-height: 100%;
        width: 100%;
        max-width: 100%;
      }

      @media #{$media-tablet-port}{
        height: 576px;
        max-height: 576px;
        width: 100%;
        max-width: 100%;
      }

      @media #{$media-phone}{
        width: 100%;
        height: 100%;
      }

      .course {
        height: 100%;
        max-height: 100%;
        width: 100%;
        max-width: 100%;

        @media #{$media-tablet-land}{
          height: 100vh;
          min-height: -webkit-fill-available;
          max-height: -webkit-fill-available;
        }
        @media #{$media-tablet-port}{
          height: 100vh;
          min-height: -webkit-fill-available;
          max-height: -webkit-fill-available;
        }
        @media #{$media-phone}{
          height: 100vh;
          width: 100%;
          min-height: -webkit-fill-available;
          max-height: -webkit-fill-available;
        }
      }
    }

    @media (max-width: 760px) {

      #app, .course, .course-container {
        max-height: -webkit-fill-available;
        min-height: -webkit-fill-available;
        height:100%;
        height: -webkit-fill-available;
        max-height: 100%;
      }

      
        
    }
    

  }

  

</style>
