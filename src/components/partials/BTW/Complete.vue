<template>
  <div class="complete grid-x flexbox flexbox-align-center flexbox-justify-center" v-if="$store.state.showComplete" role="region" level="1" >

    <div class="complete-fade" />

    <div class="component-container complete-container flexbox flexbox-align-stretch flexbox-justify-stretch">
       
        <div class="complete-top">

            <div class="complete-top-background" />
            <img class="complete-top-characters" :src="$store.state.courseContent.global.splash._images._characters" aria-hidden="true" />

            <div class="complete-top-content flexbox flexbox-align-stretch flexbox-justify-stretch">
                <div class="complete-main-content flexbox flexbox-column flexbox-align-start flexbox-justify-start" >
                    <h1 class="complete-main-content-coursesuite" v-html="$store.state.courseContent.config.coursesuite" ref="complete" tabindex="-1" />
                    <h4 class="complete-main-content-coursetitle" v-html="$store.state.courseContent.global.splash.title"  />

                    <div class="complete-main-content-body" v-html="$store.state.courseContent.global.complete.body" />
                </div>
            </div>
            
        </div>

        <div class="complete-bottom flexbox flexbox-row" aria-hidden="true" >
            <div clas="complete-bottom-image-container">
                <img class="complete-bottom-image" :src="$store.state.courseContent.global.splash._images._small1" />
            </div>
            <div clas="complete-bottom-image-container">
                <img class="complete-bottom-image" :src="$store.state.courseContent.global.splash._images._small2" />
            </div>
            <div clas="complete-bottom-image-container">
                <img class="complete-bottom-image" :src="$store.state.courseContent.global.splash._images._small3" />
            </div>
        </div>
        
        <div class="home-btn-container flexbox flexbox-row" @click="hideComplete" >
            <button class="home-btn-icon icon" :aria-label="$store.state.courseContent.global._accessibility.menubtn" role="button" tabindex="0"></button>
            <span class="home-btn-label" aria-hidden="true" >
            {{$store.state.courseContent.global._accessibility.menubtn}}
            </span>
        </div>

    </div>
  </div>

</template>

<script lang="ts">

  import { Component, Prop, Vue } from 'vue-property-decorator';

  @Component({ 
    components: {
      
    }
  })

  export default class Complete extends Vue {

    private mounted(){
        Vue.nextTick(() => {
            //console.log('help mounted >>');
            this.$store.getters.setAccessibilityFocus(this.$refs.complete);
        });
    } 
    
    private activated(){ //mounted
       Vue.nextTick(() => {
            //console.log('help activated >>');
            this.$store.getters.setAccessibilityFocus(this.$refs.complete);
        });
    }

    private hideComplete() {
        this.$store.state.showComplete = false;
        this.$store.state.userCloseComplete = true;
        //this.$store.getters.setAccessibilityFocus(this.$refs.menuaccessibility);
        this.$store.getters.write;
    }

  }

</script>

<style scoped lang="scss">

  @import "../../../style/global.scss";


  .complete {

    position: absolute;
    top:0;
    left:0;
    width: 100%;
    height: 100%;
    max-height: 100%;

    z-index: 1001;

    animation: opacity-in 0.5s;

    .complete-fade {
        position: absolute;
        top:0;
        left:0;
        width: 100%;
        height: 100%;
        background-color: $black;
        opacity: 0.7;
    }

    .complete-container {

        max-width: 924px;
        max-height: 668px;
        background-color: $white;

        border: 0.5em solid $white;
        box-shadow: inset 0 0 0.8em $grey;
        z-index: 2;

        overflow: hidden;

        @media #{$media-phone} {
            height: 100vh;
            max-height: 100vh;
        }

        .complete-top {
            flex: 1 1 auto;
            max-height: 60%;
            margin-bottom: 1%;
            position: relative;

            @media #{$media-phone} {
                max-height: 80%;
            }

            .complete-top-background {
                background-color: $btw-complete-top;
                width: 100%;
                height: 100%;
            }

            .complete-top-characters {
                position: absolute;
                bottom: 0;
                right: 2.2em;

                animation: slide-up 0.35s;

                @media #{$media-phone} {
                     max-width: 45%;
                 } 
            }

            .complete-top-content {
                position: absolute;
                top:0;
                left:0;
                width: 100%;
                height: 100%;
                color: $btw-body-colour;

                .complete-main-content-body {
                    text-align: left;
                    margin-top: 1em;
                }

                .complete-main-content {
                    flex: 1 1 auto;
                    padding: 2.2em;

                    @media #{$media-phone} {
                        flex: 0 0 auto;
                        padding: 1em;
                        padding-top: 2.2em;
                    }

                    .complete-main-content-coursesuite {
                        color: $btw-body-colour;
                    }
                }

            }
        }

        .complete-bottom {
            
            animation: opacity-in 0.5s;
            
            flex: 1 1 auto;
            max-height: 39%;

            @media #{$media-phone} {
                max-height: 20%;
            }

            justify-content: space-between;

            .complete-bottom-image-container {
               
            }

            .complete-bottom-image {
                object-fit: cover;
                object-position: center;
                width: 100%;
                height: 100%;
                max-width: 298px;
                max-height: 100%;
            }
        }

    }

  }

  


</style>