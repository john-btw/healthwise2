<template>
  <div class="resources grid-x flexbox flexbox-align-center flexbox-justify-center" v-if="$store.state.showResources" role="region" level="1" >

    <div class="resources-fade" />

    <div class="component-container resources-container flexbox flexbox-align-stretch flexbox-justify-stretch">
       
        <div class="resources-top">

            <div class="resources-top-content flexbox flexbox-align-stretch flexbox-justify-stretch">
                <div class="resources-main-content flexbox flexbox-column flexbox-align-start flexbox-justify-start" >
                    <h1 class="accessibility-region" ref="resources" >{{$store.state.courseContent.global._accessibility.resourcetitle}}</h1>
                    <div class="resources-main-content-title flexbox flexbox-row flexbox-align-center flexbox-justify-center" >
                        <img class="resources-icon" src='~@/assets/images/icons/info-circle-solid.svg' />
                        <h3 class="resources-main-content-title" v-html="$store.state.courseContent.global.resources.title" tabindex="-1" />
                    </div> 
                    <div class="resources-main-content-body" v-html="$store.state.courseContent.global.resources.body"  />
                </div>
            </div>
            
        </div>

        <div class="resources-main flexbox flexbox-justify-center">
            <div class="resources-main-links flexbox flexbox-column flexbox-align-start flexbox-justify-start" role="navigation">
                 <div class="resources-link" v-for="(link, index) in $store.state.courseContent.global.resources._links" :key="index" 
                        :style="{ 'top': getLinkPos(link, 0), 'left': getLinkPos(link, 1), 'width': getLinkPos(link, 2) }"
                        :class="{ 'image': link._type === 'image-link' }" >
                    <div v-if="link._type === 'title'" class="header" v-html="link.title" />
                    <div v-if="link._type === 'link'" class="link flexbox flexbox-row flexbox-align-center" >
                        <a :aria-label="link.title" tabindex="0" :href='link._href' target='_blank' >{{ link.title }}</a>
                    </div>
                    <div v-if="link._type === 'image-link'" class="image-link" >
                     <a class="flexbox flexbox-column flexbox-align-center" :href='link._href' target='_blank' :aria-label="link.title" tabindex="0" >
                        <img class="resources-checklist-icon" :src="link._image" />
                        <span v-html="link.title" />
                     </a>
                    </div>
                 </div>
            </div>
        </div>
        
        <div class="home-btn-container flexbox flexbox-row" @click="hideResources" >
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

  export default class Resources extends Vue {

    private mounted(){
        Vue.nextTick(() => {
            //console.log('help mounted >>');
            this.$store.getters.setAccessibilityFocus(this.$refs.resources);
        });
    } 
    
    private activated(){ //mounted
       Vue.nextTick(() => {
            //console.log('help activated >>');
            this.$store.getters.setAccessibilityFocus(this.$refs.resources);
        });
    }
    
    private getLinkPos(_link: any, _index: number){
        let pos = '';
        if (_link._pos) {
            if (this.$store.state.device !== 'phone') {
                pos = _link._pos[_index];
            } else {
                // console.log(_link._mobilepos, _index);
                // pos = _link._mobilepos[_index];
            }
        }
        return pos;
    }

    private getImage() {
        let img = this.$store.state.courseContent.global.resources._image;
        if (this.$store.state.device === 'phone') {
            img = this.$store.state.courseContent.global.resources._mobileimage;
        }
        return img;
    }
        
    private getMainTitle() {
        let str = this.$store.getters.changeColour(this.$store.state.courseContent.config.coursename, 1, 'btw-black');
        return str;
    }

    
    private hideResources() {
        this.$store.state.showResources = false;
        //this.$store.getters.setAccessibilityFocus(this.$refs.menuresourcesbtn);
        this.$store.getters.write;
    }

  }

</script>

<style scoped lang="scss">

  @import "../../../style/global.scss";


  .resources {

    position: absolute;
    top:0;
    left:0;
    width: 100%;
    height: 100%;
    max-height: 100%;

    z-index: 1000;

    animation: opacity-in 0.5s;

    .resources-fade {
        position: absolute;
        top:0;
        left:0;
        width: 100%;
        height: 100%;
        background-color: $black;
        opacity: 0.7;
    }

    .resources-container {
        
        width: 75%;
        height: auto;

        aspect-ratio: unset;

        @media #{$media-phone} {
            max-height: none;
            height: 100vh;
            overflow: auto;
            width: 100%;
        }

        border: 0.5em solid $white;
        box-shadow: inset 0 0 0.8em $grey;
        z-index: 2;

        overflow: hidden;

        background-color: $btw-grey;

        .resources-top {
            flex: 0 0 auto; //
            position: relative;

            @media #{$media-phone} {
                flex: 0 0 auto;
                height: auto;
            }

            .resources-top-characters {
                position: absolute;
                bottom: 0;
                right: 2rem;

                animation: slide-up 0.35s;
            }

            .resources-top-content {
                //position: absolute;
               // top:0;
                //left:0;
                //width: 100%;
               // height: 100%;

                @media #{$media-phone} {
                    position: relative;
                }

                .resources-main-content {
                    flex: 1 1 auto;
                    padding: 1em 2em;

                    @media #{$media-phone} {
                        padding: 1rem; 
                        //font-size: 0.8em;
                        height: auto; 
                    }

                    .resources-icon {
                        width: 3em;
                        height: 3em;
                        position: relative;
                        top: -1em;
                        margin-right:1em;
                        margin-top: 1em;
                    }

                    .resources-main-content-title {
                        font-weight: bold;

                        @media #{$media-phone} {
                            max-width: 75%;
                        }
                    }

                    .resources-main-content-body {
                        font-weight: normal;
                        text-align: left;

                        @media #{$media-phone} {
                            margin-top: 1em;
                        }
                    }
                }

            }
        }

        .resources-main {
            flex: 1 1 auto;
            height: 50%;

            position: relative;

            @media #{$media-phone} {
                flex: 0 0 auto;
                height: auto;
            }

            .resourcces-main-image {
                position: absolute;
                top:0;
                left:0;
                width: 100%;
                height: 100%;

                object-fit: cover;
                object-position: center;

                @media #{$media-phone} {
                    display: none;
                }
            }

            .resources-main-links {
                height: auto;
                width: 100%;
                padding: 0 $container-padding-btw $container-padding-btw $container-padding-btw;

                overflow: hidden;
                overflow-y: auto;
                
                @media #{$media-mobile} {
                    //padding: 2.5rem 10rem 3rem 7rem;
                    //font-size: 0.85em;
                }

                 @media #{$media-phone} {
                     padding: 0 $container-padding-btw/2;
                 }

                position: relative;

                .resources-checklist-icon {
                    max-width: 6em;
                }

                .resources-link {

                    line-height: 2;
                    max-width: 100%;
                    width:100%;

                    &.image {
                        
                       img {
                            margin: 0;//$container-padding-btw/2 $container-padding-btw/2 0 $container-padding-btw/2;
                             @media #{$media-phone} {
                                max-width: 6rem;
                            }
                        }

                        span {
                            padding: $container-padding-btw/2;
                            font-weight: bold;
                        }
                        position: absolute;
                        transform: translate(-50%,-50%);
                        background-color: $btw-resources-imglink-colour;
                        
                        a {
                            color: $btw-resources-link-colour;
                        }
                        a:hover {
                            color: $btw-resources-link-hover-colour;
                            background-color: $btw-resources-imglink-hover-colour;
                        }

                        @media #{$media-phone} {
                            position: relative;
                            left: 0;
                            top: 0;
                            transform: none;
                            margin-top: 1rem;
                        }

                    }

                    .header {
                        font-weight: bold;
                        color: $btw-body-colour;
                        margin-top: 1em;
                        text-align: left;
                        line-height: 1.5;
                    }

                    .link {
                       position: relative;
                        margin-left: 1em;
                        &::before {
                            content: ' ';
                            position: absolute;
                            top: 0.6em;
                            left: -1em;
                            width: 3px;
                            height: 3px;
                            display: inline-block;
                            border-radius: 100%;
                            background-color: $btw-body-colour;
                        }

                        a {
                            color: $btw-body-colour;
                            text-align: left;
                            line-height: 1.5;
                        }
                        a:hover {
                            color: $btw-link-hover-colour;
                        }

                    }
                    .image-link {
                        img {
                            padding: 1rem 0 0 0;
                            //@media #{$media-phone} {
                                padding: 0;
                            //}
                        }
                        //@media #{$media-phone} {
                            a{
                                flex-direction: row;
                            }
                        //}

                        a {
                            border: 3px solid $btw-resources-imglink-border-colour;
                        }
                        a:hover {
                            border: 3px solid $btw-resources-imglink-border-hover-colour;
                        }
                    }
                    z-index: 1001;
                }
            }
        }
    }

  }

  


</style>