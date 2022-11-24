<template>
  <div class="lang-select grid-x flexbox flexbox-align-center flexbox-justify-center" v-if="$store.state.showLangSelect" role="region" level="1" >

    <div class="lang-select-fade" />

    <div class="component-container lang-select-container flexbox flexbox-align-stretch flexbox-justify-stretch">
       
        <div class="lang-select-main flexbox flexbox-align-stretch flexbox-justify-stretch">
        
            <div class="lang-select-top">

                <div class="lang-select-top-content flexbox flexbox-align-stretch flexbox-justify-stretch">
                    <div class="lang-select-main-content flexbox flexbox-column flexbox-align-start flexbox-justify-start" >

                        <div class="lang-select-main-content-title flexbox flexbox-row flexbox-align-center flexbox-justify-center" >
                            <img class="lang-select-icon" src='~@/assets/images/icons/globe.svg' />
                            <!-- <h1 ref="langselect" class="accessibility-region">{{$store.state.courseContent.global._accessibility.langselecttitle}}</h1>-->
                            <h1 class="lang-select-main-content-coursesuite" v-html="$store.state.courseContent.global.langselect.title" ref="langselect" tabindex="-1" /> 
                        </div>
                        <div class="lang-select-main-content-body" v-html="$store.state.courseContent.global.langselect.body" />
                    </div>
                </div>

                <div class="lang-select-bottom flexbox flexbox-row flexbox-align-center flexbox-justify-center">
                    <button class="lang-select-btn" v-for="(lang, index) in $store.state.languages" :key="index" 
                        @click="updateLangSelection(index)" 
                        :aria-label="$store.getters.getLangLabel(index)"
                        role="button" tabindex="0">
                        {{$store.getters.getLangLabel(index)}}
                    </button>
                </div>

            </div>
            
            

            <!-- <div class="lang-select-icons flexbox flexbox-row flexbox-align-center flexbox-justify-center">
                <img class="lang-select-icon" src='~@/assets/images/icons/lang/globe-europe.svg' />
                <img class="lang-select-icon" src='~@/assets/images/icons/lang/comments.svg' />
                <img class="lang-select-icon" src='~@/assets/images/icons/lang/flag-solid.svg' />
                <img class="lang-select-icon" src='~@/assets/images/icons/lang/headphones-solid.svg' />
                <img class="lang-select-icon" src='~@/assets/images/icons/lang/users.svg' />
            </div> -->

        </div>

        <!-- <div class="home-btn-container flexbox flexbox-row" @click="hideLangSelect" >
            <button class="home-btn-icon icon" :aria-label="$store.state.courseContent.global._accessibility.menubtn" role="button" tabindex="0"></button>
            <span class="home-btn-label" aria-hidden="true" >
            {{$store.state.courseContent.global._accessibility.menubtn}}
            </span>
        </div> -->

        
    </div>
  </div>

</template>

<script lang="ts">

  import { Component, Prop, Vue } from 'vue-property-decorator';

  @Component({ 
    components: {
      
    }
  })

  export default class LanguageSelection extends Vue {

    private showContent: boolean = false;
    private contentText: string = '';

    private mounted(){
        Vue.nextTick(() => {
            //console.log('help mounted >>');
            this.$store.getters.setAccessibilityFocus(this.$refs.langselect);
        });
    } 
    
    private activated(){ //mounted
       Vue.nextTick(() => {
            //console.log('help activated >>');
            this.$store.getters.setAccessibilityFocus(this.$refs.langselect);
        });
    }

    private updateLangSelection(_index: number) {
        this.$store.state.language = this.$store.state.languages[_index];
       // this.$store.getters.write;
        this.$store.getters.updateLang;
        //this.$store.state.showLangSelect = false;
        this.hideLangSelect();
    }

    private hideLangSelect() {
        this.$store.state.showLangSelect = false;
        //this.$store.getters.setAccessibilityFocus(this.$refs.menuaccessibility);
        this.$store.getters.write;
    }

  }

</script>

<style scoped lang="scss">

  @import "../../../style/global.scss";


  .lang-select {

    position: absolute;
    top:0;
    left:0;
    width: 100%;
    height: 100%;
    max-height: 100%;

    z-index: 1000;

    animation: opacity-in 0.5s;

    .lang-select-fade {
        position: absolute;
        top:0;
        left:0;
        width: 100%;
        height: 100%;
        background-color: $black;
        opacity: 0.7;
    }

    .lang-select-btn {

        &:first-of-type {
            display: none;
        }
        
        background-color: $btw-main-colour;
        color: $white;
        padding: 1em;
        font-weight: bold;

        cursor: pointer;
        margin: 0.5em;

        &:hover {
            background-color: $white;
            color: $btw-main-colour;
        }
    }

    .lang-select-container {

        width: 75%;
        max-width: 768px;
        max-height: 500px;
        height: auto;

        @media #{$media-tablet} {
            width: 90%;
        }

        @media #{$media-phone} {
            //min-height: 75vh;
            max-height: none;

            width: 90%;
        }

        background-color: $btw-grey;

        border: 0.5em solid $white;
        box-shadow: inset 0 0 0.8em $grey;
        z-index: 2;

        overflow: hidden;

        position: relative;

        .lang-select-main {
            height: 100%;
            width: 100%;
        }

        .lang-select-top {
            //flex: 1 1 auto;
            margin-bottom: 1%;
            position: relative;

            .lang-select-top-content {
                //position: absolute;
                //top:0;
                //left:0;
                //width: 100%;
                //height: 100%;
                color: $btw-body-colour;

                .lang-select-main-content {
                    flex: 1 1 auto;
                    padding: 2.2em 2.2em 0 2.2em;

                    @media #{$media-phone} {
                        padding: 2rem 1rem 0 1rem;
                    }
                }

                .lang-select-main-content-body {
                    text-align: center;
                    width: 100%;
                }

            }

            .lang-select-icon {
                width: 4em;
                height: 4em;
                position: relative;
                top: -0.5em;
                margin-right:1em;

                @media #{$media-phone} {
                    width: 3rem;
                    height: 3rem;
                }
            }
        }

        .lang-select-bottom { 
            flex: 1 1 auto;
            margin: 1rem 0;
            animation: opacity-in 0.5s;

            //flex-wrap: wrap;

            //padding: 2rem;
        }

        .lang-select-icons {
            flex: 0 0 auto;

            .lang-select-icon {
                width: 5em;
                height: 5em;
                margin: 1.5em 1em;
                opacity: 0.4;

                @media #{$media-phone} {
                    width: 3rem;
                    height: 3rem;  
                    margin: 1rem 1rem; 
                }
            }
        }
    }

  }

  


</style>