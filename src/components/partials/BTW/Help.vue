<template>
  <div class="help grid-x flexbox flexbox-align-center flexbox-justify-center" v-if="$store.state.showHelp" role="region" level="1" >

    <div class="help-fade" />

    <div class="component-container help-container flexbox flexbox-align-stretch flexbox-justify-stretch">
       
        <div class="help-top">

            <div class="help-top-content flexbox flexbox-align-stretch flexbox-justify-stretch">
                <div class="help-main-content flexbox flexbox-column flexbox-align-start flexbox-justify-start" >
                    
                    <div class="help-main-content-title flexbox flexbox-row flexbox-align-center flexbox-justify-center" >
                        <h1 ref="help" class="accessibility-region">{{$store.state.courseContent.global._accessibility.helptitle}}</h1>
                        <img class="help-icon" src='~@/assets/images/icons/question-circle-solid.svg' />
                        <h3 class="help-main-content-coursesuite" v-html="$store.state.courseContent.global.help.title" tabindex="-1" />
                    </div>
                    <div class="help-main-content-body" v-html="$store.state.courseContent.global.help.body" />
                </div>
            </div>

        </div>
        
        <div class="help-content flexbox flexbox-align-start flexbox-justify-end" v-if="$store.state.device !== 'phone'">
            <div class="help-speech"  v-if="showContent" ref="helpspeech" tabindex="0" :aria-label="contentText" aria-hidden="false"
                :class="getPosiiton()" :style="{ 'left': contentPosition }" >{{contentText}}
            </div>
        </div>

        <div class="help-bottom flexbox flexbox-row">
            <div class="help-click-icons flexbox flexbox-row">
                <button class="help-click-icon" v-for="(icon, index) in $store.state.courseContent.global.help._icons" :key="index" 
                        @click="showHelpContent(index, icon.content)"
                        :class="{ 'active': contentIndex === index }"   
                        :aria-label="$store.state.courseContent.global._accessibility.iconitle + ': ' + $store.state.courseContent.global._accessibility[icon._title]" 
                        role="button" tabindex="0">
                    <img class="help-icon" :src='icon._image'  />
                </button>
            </div>
            <div class="help-speech" v-if="showContent &&  $store.state.device === 'phone'" ref="helpspeechphone" tabindex="0" :aria-label="contentText" aria-hidden="false"
                    :class="getPosiiton()" :style="{ 'left': contentPosition }" >{{contentText}}
                </div>
        </div>
        
        <div class="home-btn-container flexbox flexbox-row" @click="hideHelp" >
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

  export default class Help extends Vue {

    private showContent: boolean = false;
    private contentIndex: number = -1;
    private contentText: string = '';
    private contentPosition: string = '';

    private mounted(){
        Vue.nextTick(() => {
            //console.log('help mounted >>');
            this.$store.getters.setAccessibilityFocus(this.$refs.help);
        });
    } 
    
    private activated(){ //mounted
       Vue.nextTick(() => {
            //console.log('help activated >>');
            this.$store.getters.setAccessibilityFocus(this.$refs.help);
        });
    }

    private getPosiiton() {
        let pos = '';
        if (this.contentIndex > -1) {
            const percent = (90/this.$store.state.courseContent.global.help._icons.length-1) * this.contentIndex;
            
            if (this.$store.state.device !== 'phone') {
                if (percent < 42) {
                    this.contentPosition = Math.round(percent) + '%';
                } else {
                    this.contentPosition = (Math.round(percent) - 20) + '%';
                }
                if (percent < 42) {
                    pos += 'left';
                } else {
                    pos += 'right';
                }
            } else {
                this.contentPosition = '0%';
            }
            
        }
        
        return pos;
    }

    private showHelpContent(_index: number, _content: string) {
        this.contentIndex = _index;
        this.showContent = false;

        Vue.nextTick(() => {
            this.contentText = _content;
            this.showContent = true;
            setTimeout(() => {
                if (this.$store.state.device !== 'phone') {
                    this.$store.getters.setAccessibilityFocus(this.$refs.helpspeech);
                } else {
                    this.$store.getters.setAccessibilityFocus(this.$refs.helpspeechphone);
                }
                //console.log('helpspeech >>');
            }, 100);
        });
    }

    private hideHelp() {
        this.$store.state.showHelp = false;
        //this.$store.getters.setAccessibilityFocus(this.$refs.menuhelpbtn);
        this.$store.getters.write;
    }

  }

</script>

<style scoped lang="scss">

  @import "../../../style/global.scss";


  .help {

    position: absolute;
    top:0;
    left:0;
    width: 100%;
    height: 100%;
    max-height: 100%;
    @media #{$media-phone} {
        max-height: none;
    }

    z-index: 1000;

    animation: opacity-in 0.5s;

    .help-fade {
        position: absolute;
        top:0;
        left:0;
        width: 100%;
        height: 100%;
        background-color: $black;
        opacity: 0.7;
    }

    .help-container {

        width: 75%;
        max-width: 924px;
        max-height: 668px;
        height: auto;
        @media #{$media-phone} {
            max-height: none;
            height: 100vh;
            overflow: auto;
            width: 100%;
        }
        background-color: $btw-help-main; //$btw-grey;

        border: 0.5em solid $white;
        box-shadow: inset 0 0 0.8em $grey;
        z-index: 2;

        overflow: hidden;

        position: relative;

        .help-top {
            flex: 1 1 auto;
            margin-bottom: 1%;
            position: relative;
            
            @media #{$media-phone} {
                //overflow: auto;
                height: auto;
                width: 100%;
            }

            .help-top-content {
                //position: absolute;
                //top:0;
                //left:0;
               // width: 100%;
                //height: 100%;
                color: $btw-body-colour;

                @media #{$media-phone} {
                    position: relative;
                }

                .help-main-content {
                    flex: 1 1 auto;
                    padding: 2.2em 2.2em 0 2.2em;
                }

            }

            
            .help-icon {
                width: 3em;
                height: 3em;
                position: relative;
                top: -1em;
                margin-right:1em;
                margin-top: 1em;
            }

            .help-main-content-body {
                text-align: left;width: 100%;
                flex: 1 1 auto;
                overflow: hidden;
                overflow-y: auto;
            }
        }

        .help-content {
            flex: 1 1 auto;
            width: 90%;
            margin-left: 5%;

            @media #{$media-mobile} {
                justify-content: flex-end;
            }

            @media #{$media-phone} {
                width: 95%;
                margin-left: 2.5%;
            }

            .help-speech {
                
                animation: opacity-in 0.5s;
                
                padding: $container-padding-btw;
                background-color: $white;
                position: relative;

                max-width: 50%;

                @media #{$media-phone} {
                    width: 50%;
                }

                 &::after {
                    position: absolute;
                    width: 0; 
                    height: 0; 
                    left: 50%;
                    transform: translate(-50%,0%);
                    top: 100%;
                    content: "";
                    border-left:0.8em solid transparent; 
                    border-right: 0.8em solid transparent;
                    border-bottom: 0.8em solid transparent;
                    border-top:0.8em solid rgba(255,255,255,0.7);
                 }

                 &.left {
                     &::after {
                         left: 20%;
                     }
                 }

                 &.right {
                     &::after {
                         left: 80%;
                     }
                 }
            }

        }

        .help-bottom {
            
            flex: 0 0 auto;
            //margin-top: 1rem;
            animation: opacity-in 0.5s;
            
            .help-icon {
                width: 100%;
                height: 100%;
                padding-top: 100%;
                position: relative;
                padding: $container-padding-btw;
                object-fit: contain;

                @media #{$media-phone} {
                    padding-top: 0;
                    padding: $container-padding-btw/2;
                }

                cursor: pointer;
                
            }

            .help-click-icons {
                flex: 1 1 auto;

                @media #{$media-phone} {
                    flex-direction: column;
                    max-width: 25%;
                }

                .help-click-icon {
                    flex: 1 1 auto;
                    
                    &:hover, &.active {
                        //opacity: 0.5;
                        filter: invert(100%);
                    }
                }

            }

            .help-speech {
                flex: 1 1 auto;

                animation: opacity-in 0.5s;
                
                padding: $container-padding-btw;
                background-color: $white;
                position: relative;

                text-align: left;

                max-width: 70%;

                @media #{$media-phone} {
                    padding: $container-padding-btw/2;
                    margin: 1em;
                }

                &::after {
                    position: absolute;
                    width: 0; 
                    height: 0; 
                    right: 100%;
                    transform: translate(0%,-50%);
                    top: 47%;
                    content: "";
                    border-top: 0.8em solid transparent;
                    border-bottom: 0.8em solid transparent; 
                    border-right:0.8em solid rgba(255,255,255,0.7);
                }

            }
            
        }

        
    }

  }

  


</style>