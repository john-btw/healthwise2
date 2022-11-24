<template>
  <div id="splash" class="splash grid-x flexbox flexbox-align-center flexbox-justify-center" role="region" level="1">
    <button class="splash-container main-container flexbox flexbox-align-stretch flexbox-justify-stretch" @click.prevent="hideSplash" :aria-label="$store.getters.removeCharStr($store.state.courseContent.global.splash.ins)" role="button" tabindex="0">
       
       <div class="splash-header flexbox flexbox-justify-center flexbox-align-start" aria-hidden="true" >
            <div class="splash-bar" :style="{ 'background-color': $store.state.courseContent.menu._barColour }" />
        </div>

        <div class="splash-top">

            <!-- <div class="splash-top-background" aria-hidden="true" /> -->
            <img class="splash-top-characters" :src="$store.state.courseContent.global.splash._images._characters" aria-hidden="true" />

            <div class="splash-top-content flexbox flexbox-align-stretch flexbox-justify-stretch">
                <div class="main-title flexbox flexbox-align-start flexbox-justify-start" aria-hidden="true" >
                    <img class='main-title-logo' src="~@/assets/images/logo.png" />
                    <!-- <img class="langselect-icon" src='~@/assets/images/icons/globe.svg' @click="$store.state.showLangSelect = true;" /> -->
                </div>
                <h4 class="main-ins flexbox flexbox-align-start flexbox-justify-center" v-html="getMainIns()"/>

                <div class="main-titles flexbox flexbox-column flexbox-align-start flexbox-justify-center" >
                    <h1 class="main-titles-coursesuite" v-html="$store.state.courseContent.config.coursesuite" />
                    <h4 class="main-titles-coursetitle" v-html="$store.state.courseContent.global.splash.title" />
                </div>
            </div>

        </div>

        <div class="splash-bottom flexbox flexbox-row" aria-hidden="true">
            <div class="splash-bottom-image-container">
                <img class="splash-bottom-image" :src="$store.state.courseContent.global.splash._images._small1" />
            </div>
            <div class="splash-bottom-image-container">
                <img class="splash-bottom-image" :src="$store.state.courseContent.global.splash._images._small2" />
            </div>
            <div class="splash-bottom-image-container">
                <img class="splash-bottom-image" :src="$store.state.courseContent.global.splash._images._small3" />
            </div>
        </div>

        <div class="splash-footer flexbox flexbox-justify-center flexbox-align-start" aria-hidden="true" >
            <div class="splash-bar" :style="{ 'background-color': $store.state.courseContent.menu._barColour }" />
        </div>

    </button>
  </div>

</template>

<script lang="ts">

  import { Component, Prop, Vue } from 'vue-property-decorator';

  @Component({ 
    components: {
      
    }
  })

  export default class Splash extends Vue {

    private getAriaContent() {
        //this.$store.state.courseContent.config.coursename + ", " + 
        let str = this.$store.state.courseContent.global._accessibility.splashtitle + ", " + this.$store.state.courseContent.config.coursesuite + ", " + this.$store.state.courseContent.global.splash.title + "";
        return str;
    }
        
    private getMainTitle() {
        let str = this.$store.getters.changeColour(this.$store.state.courseContent.config.coursename, 0, 'btw-main');
        return str;
    }

    private getMainIns() {
        let str = this.$store.getters.changeColour(this.$store.state.courseContent.global.splash.ins, 1, 'btw-black');
        return str;
    }

    private hideSplash() {
        setTimeout(() => {
            this.$store.state.showSplash = false;
            this.$store.getters.write;
        }, 250);
    }


  }

</script>

<style scoped lang="scss">

  @import "../../../style/global.scss";


  .splash {

    background-color: $white;
    height: 100%;

    @media #{$media-tablet-land} {
      height: 100%;
      max-height: 100vh;
      max-height: 100%;
      min-height: -webkit-fill-available;
      max-height: -webkit-fill-available;
    }/**/

    @media #{$media-phone} {
      height: 100%;
      max-height: 100vh;
      max-height: 100%;
      min-height: -webkit-fill-available;
      max-height: -webkit-fill-available;
    }

    z-index: 1001;

    animation: opacity-in 0.5s;

    .splash-container {

        background-color: $white;

        overflow: hidden;

        cursor: pointer;

        .splash-top {
            flex: 1 1 auto;
            max-height: 70%;
            //height: 70%;
            margin: 0 auto;
            margin-bottom: 1%;
            position: relative;
            width: 100%;
            background-color: $btw-grey;

            @media #{$media-phone} {
                max-height: 80%;
                width: 100%;
            }

            .splash-top-background {
                background-color: $btw-grey;
                flex: 1 1 auto;
                width: 100%;
                height: 100%;
            }

            .splash-top-characters {
                position: absolute;
                bottom: 0;
                right: 2em;

                max-width: 26%;
                max-height: 55%;

                animation: slide-up 0.35s;      

                 @media #{$media-phone} {
                     max-width: 45%;
                 }          
            }

            .splash-top-content {
                //position: absolute;
                //top:0;
                //left:0;
                width: 100%;
                height: 100%;
                color: $btw-body-colour;

                .main-title, .main-ins, .main-titles {
                    flex: 1 1 auto;
                    padding: 1.3em 2.1em;

                    @media #{$media-phone} {
                        flex: 0 0 auto;
                        padding: 1rem;
                    }
                }

                .main-title {
                    flex-direction: row;
                    width: 100%;
                    justify-content: space-between;
                }

                .main-title-logo {
                    //height: 5em;
                }

                .main-titles {

                    padding: 1.3em 2.7em;

                    @media #{$media-phone} {
                        padding: 1.3em 1.5em;
                    }

                    .main-titles-coursesuite {
                        color: $btw-splash-title-colour;
                        text-align: left;
                    }

                    .main-titles-coursetitle {
                        text-align: left;
                        max-width: 55%;
                    }
                }

            }
        }

        .splash-bottom {
            
            animation: opacity-in 0.5s;

            margin: 0 auto;
            width: 100%;
            
            flex: 0 0 auto;
            
            @media #{$media-phone} {
                width: 100%;
            }
            
            max-height: 30%;

            @media #{$media-phone} {
                max-height: 20%;
            }

            justify-content: stretch;
            align-items: stretch;

            .splash-bottom-image-container {
                flex: 1 1 auto;
                @media #{$media-mobile} {
                   margin: 0.2em;
                }

                &:first-child {
                    margin-right: 0.5em;
                }

                &:last-child {
                    margin-left: 0.5em;
                }
            }

            .splash-bottom-image {
                object-fit: cover;
                object-position: center;
                width: 100%;
                height: 100%;
                max-width: 334px;
                max-height: 100%;
            }
        }
    }

    .splash-footer, .splash-header {
      height: auto;
      flex: 0 0 auto;
      padding: 1em 0em;

      .splash-bar {
        height: 0.2em;
        width: 100%;
      }
    }

  }

  


</style>