<template>
  <div class="preloader flexbox grid-x flexbox flexbox-align-center flexbox-justify-center" ref="preloader">
    <div class="preloader-amount">
      <!-- <span class="loader loader-bars"><span></span></span> -->
      <span class="loader loader-quart"></span>
    </div>
  </div>
</template>

<script lang="ts">

  import { Component, Prop, Vue } from 'vue-property-decorator';

  @Component({ 
    components: {
      
    }
  })

  export default class Preloader extends Vue {

    private imagesArray: string[] = [];
    private imageLoaded: number = 0;

    
    private mounted(){

      //set default colour vars
        const btwWhiteColour = "#FFFFFF";
        const btwBlackColour = "#000000";
        
        ////////---- UPDATE FROM TXT FILE ----////////

        const btwMainColour = '#E25D22';
        const btwSecondaryColour = '#E25D22';
        const btwGreyColour = '#cacaca';
        const btwGrey2Colour = '#f2f2f2';

        document.documentElement.style.setProperty('--primary', `${btwMainColour}`);
        document.documentElement.style.setProperty('--secondary', `${btwSecondaryColour}`);
        document.documentElement.style.setProperty('--grey', `${btwGreyColour}`);
        document.documentElement.style.setProperty('--grey2', `${btwGrey2Colour}`);

        //preloader
        // document.documentElement.style.setProperty('--btwpreloaderbgcolour', `${btwWhiteColour}`);
        document.documentElement.style.setProperty('--btwpreloaderspincolour', `${btwMainColour}`);
        document.documentElement.style.setProperty('--btwpreloadercolour', `${btwSecondaryColour}`);

        //menu
        document.documentElement.style.setProperty('--btwmenuactivecolour', `${btwMainColour}`);
        document.documentElement.style.setProperty('--btwmenuactivetextcolour', `${btwWhiteColour}`);
        document.documentElement.style.setProperty('--btwmenuhovertile', `${btwSecondaryColour}`);
        // document.documentElement.style.setProperty('--btwsplittextmain', `${btwMainColour}`);
        document.documentElement.style.setProperty('--btwsplittext', `${btwBlackColour}`);
        // document.documentElement.style.setProperty('--highlight', `${btwBlackColour}`);
        //fonts/text
        document.documentElement.style.setProperty('--btwtopictitlecolour', `${btwMainColour}`);
        document.documentElement.style.setProperty('--btwtitlecolour', `${btwBlackColour}`);
        document.documentElement.style.setProperty('--btwbodycolour', `${btwBlackColour}`);
        document.documentElement.style.setProperty('--btwlinkcolour', `${btwMainColour}`);
        document.documentElement.style.setProperty('--btwlinkhovercolour', `${btwBlackColour}`);
        //components/screens
        document.documentElement.style.setProperty('--btwcontainerbackground', `${btwWhiteColour}`);
        document.documentElement.style.setProperty('--btwbackgroundcolour', `${btwGreyColour}`);
        document.documentElement.style.setProperty('--btwlinkbackgroundcolour', `${btwBlackColour}`);
        document.documentElement.style.setProperty('--btwlinkhoverbackgroundcolour', `${btwWhiteColour}`);
        ////left content
        document.documentElement.style.setProperty('--btwbackgroundsidecolour', `${btwMainColour}`);
        document.documentElement.style.setProperty('--btwbackgroundsidetextcolour', `${btwWhiteColour}`);
        //splash
        document.documentElement.style.setProperty('--btwsplashtitlecolour', `${btwMainColour}`);
        //resources
        // document.documentElement.style.setProperty('--btwresourcesmain', `${btwGreyColour}`);
        document.documentElement.style.setProperty('--btwresourceslinkcolour', `${btwMainColour}`);
        document.documentElement.style.setProperty('--btwresourceslinkhovercolour', `${btwWhiteColour}`);
        document.documentElement.style.setProperty('--btwresourcesimglinkcolour', `${btwWhiteColour}`);
        document.documentElement.style.setProperty('--btwresourcesimglinkhovercolour', `${btwMainColour}`);
        document.documentElement.style.setProperty('--btwresourcesimglinkbordercolour', `${btwSecondaryColour}`);
        document.documentElement.style.setProperty('--btwresourcesimglinkborderhovercolour', `${btwBlackColour}`);
        //complete
        // document.documentElement.style.setProperty('--btwcompletemain', `${btwGreyColour}`);
        //selectables
        document.documentElement.style.setProperty('--btwselectable', `${btwMainColour}`);
        document.documentElement.style.setProperty('--btwselectablevisited', `${btwBlackColour}`);
        //progress
        document.documentElement.style.setProperty('--btwprogressbar', `${btwBlackColour}`); //alpha
        document.documentElement.style.setProperty('--btwprogressdot', `${btwWhiteColour}`);
        document.documentElement.style.setProperty('--btwprogressdotvisited', `${btwSecondaryColour}`);
        //popup
        document.documentElement.style.setProperty('--popupbg', `${btwWhiteColour}`);
        //buttons
        document.documentElement.style.setProperty('--btwbtnbg', `${btwMainColour}`);
        document.documentElement.style.setProperty('--btwbtncolour', `${btwWhiteColour}`);
        document.documentElement.style.setProperty('--btwbtnhoverbg', `${btwWhiteColour}`);
        document.documentElement.style.setProperty('--btwbtnhovercolour', `${btwMainColour}`);
        //scrollbar
        // document.documentElement.style.setProperty('--scrollbarcolour', `${btwSecondaryColour}`);
        // document.documentElement.style.setProperty('--scrollbarbasecolour', `${btwMainColour}`);
        //mobile
        document.documentElement.style.setProperty('--btwmobiletopcolour', `${btwGreyColour}`);
        document.documentElement.style.setProperty('--btwmobileheadercolour', `${btwGreyColour}`);
        document.documentElement.style.setProperty('--btwmobiledividercolour', `${btwMainColour}`);
        //COMPONENTS
        //carousel
        document.documentElement.style.setProperty('--btwcourselnavbg', `${btwWhiteColour}`);
        document.documentElement.style.setProperty('--btwcourselnavhoverbg', `${btwBlackColour}`);
        //media
        document.documentElement.style.setProperty('--btwmediaoverlaybgcolour', `${btwMainColour}`); //alpha
        document.documentElement.style.setProperty('--btwmediaoverlaytextcolour', `${btwWhiteColour}`);
        document.documentElement.style.setProperty('--btwmediaprogressbgcolour', `${btwWhiteColour}`);
        document.documentElement.style.setProperty('--btwmediaprogressfillcolour', `${btwBlackColour}`);
        document.documentElement.style.setProperty('--btwreplaycolour', `${btwWhiteColour}`);
        document.documentElement.style.setProperty('--btwreplaycolourhover', `${btwSecondaryColour}`);
        document.documentElement.style.setProperty('--btwlinkmediacolour', `${btwSecondaryColour}`);
        document.documentElement.style.setProperty('--btwlinkhovermediacolour', `${btwWhiteColour}`);
        //text-image
        document.documentElement.style.setProperty('--btwtextintrobgcolour', `${btwMainColour}`);
        document.documentElement.style.setProperty('--btwtextintrotextcolour', `${btwWhiteColour}`);
        document.documentElement.style.setProperty('--btwtextintrolinkcolour', `${btwWhiteColour}`);
        document.documentElement.style.setProperty('--btwtextintrolinkhovercolour', `${btwSecondaryColour}`);
        //quiz
        // document.documentElement.style.setProperty('--btwquizmainbg', `${btwGrey2Colour}`);
        // document.documentElement.style.setProperty('--btwquizbackgroundcolour', `${btwGreyColour}`);
        document.documentElement.style.setProperty('--btwquizoptionbg', `${btwWhiteColour}`);
        document.documentElement.style.setProperty('--btwquizoptioncolour', `${btwMainColour}`);
        document.documentElement.style.setProperty('--btwquizoptionbgselected', `${btwMainColour}`);
        document.documentElement.style.setProperty('--btwquizoptioncolourselected', `${btwWhiteColour}`);

        ////////---- END UPDATE FROM TXT FILE ----////////


      //when load, check the device...
      let device = '';
      if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {//568
        device = 'phone'; 
      }
      this.$store.getters.setDevice(device);
      //console.log(this.$store.state.device);

        Vue.nextTick(() => {
            //console.log('help mounted >>');
            this.$store.getters.setAccessibilityFocus(this.$refs.preloader);
        });

        //splash images
        this.imagesArray.push(this.$store.state.courseContent.global.splash._images._small1);
        this.imagesArray.push(this.$store.state.courseContent.global.splash._images._small2);
        this.imagesArray.push(this.$store.state.courseContent.global.splash._images._small3);
        this.imagesArray.push(this.$store.state.courseContent.global.splash._images. _characters);
        //help icons
        this.$store.state.courseContent.global.help._icons.forEach((icon: any) => {
          this.imagesArray.push(icon._image);
        });
        //resources link images
        this.$store.state.courseContent.global.resources._links.forEach((link: any) => {
          this.imagesArray.push(link._image);
        });
        //menu images
        this.imagesArray.push(this.$store.state.courseContent.menu._headerImage);
        this.imagesArray.push(this.$store.state.courseContent.menu._headerImageMobile);
        this.imagesArray.push(this.$store.state.courseContent.menu._complete._image);
        this.imagesArray.push(this.$store.state.courseContent.menu._complete._link._image);
        //menu pages tiles images
        this.$store.state.courseContent.menu._pages.forEach((page: any) => {
          if(page._images) {
            page._images.forEach((images: any) => {
              this.imagesArray.push(images._image);
            });
          }
        });
        //topics pages images
        this.$store.state.courseContent.topics.forEach((topic: any) => {
          let pagesArray: any = [];
          let pagesIndex = 0;
          if(topic._image) {
            this.imagesArray.push(topic._image);
          }
          if (topic.pages) {
            topic.pages.forEach((page: any) => {
              if(page.content._image) {
                this.imagesArray.push(page.content._image);
              }
              if(page.content._imageMobile) {
                this.imagesArray.push(page.content._imageMobile);
              }
              if(page.content._video && page.content._video._poster) {
                this.imagesArray.push(page.content._video._poster);
              }
              if(page.content.slides) {
                if(page.content.slides._image) {
                  this.imagesArray.push(page.content.slides._image);
                }
                if(page.content.slides._imageMobile) {
                  this.imagesArray.push(page.content.slides._imageMobile);
                }
              }
              if(page.content.steps) {
                if(page.content.steps._image) {
                  this.imagesArray.push(page.content.steps._image);
                }
              }
              if(page.content._pinImage) {
                this.imagesArray.push(page.content._pinImage);
              }
              if(page.content._pinHoverImage) {
                this.imagesArray.push(page.content._pinHoverImage);
              }
              if(page.content._pinShadowImage) {
                this.imagesArray.push(page.content._pinShadowImage);
              }
              if(page.content.reveals) {
                if(page.content.reveals._image) {
                  this.imagesArray.push(page.content.reveals._image);
                }
                if(page.content.reveals._imageVisited) {
                  this.imagesArray.push(page.content.reveals._imageVisited);
                }
              }
            });
          }
        });

        //load all in turn
        this.imagesArray.forEach((img: any) => {
          this.loadImage(img);
        });

    } 

    private loadImage(image: any) {
        const img = new Image();
        img.src = image;
        img.addEventListener('load', function() {
          //console.log("image loaded!");
        });
        img.addEventListener('error', function() {
          //console.log("error loading image!");
        });
        this.imageLoaded++;

        //console.log(this.imageLoaded, this.imagesArray.length);
        if(this.imageLoaded === this.imagesArray.length) {
          setTimeout(() => {
            this.$store.state.imagesLoaded = true;
            this.$store.getters.write;
          }, 2000);
        }

    }
    
    private activated(){ //mounted
       Vue.nextTick(() => {
            //console.log('help activated >>');
            this.$store.getters.setAccessibilityFocus(this.$refs.preloader);
        });
    }

    

  }

</script>

<style scoped lang="scss">

  @import "../../style/global.scss";


  .preloader {

    position: absolute;
    top:0;
    left:0;
    width: 100%;
    height: 100vh;

    z-index: 5000;

    background-color: $btw-preloader-background;
    color: $btw-preloader-colour;

    .preloader-amount {

      .loader {
        position: relative;
        display: inline-block;
        width: 50px;
        height: 50px;
        vertical-align: middle;
      }
      
      .loader-quart {
        border-radius: 50px;
        border: 6px solid $btw-preloader-colour-faded;
      }

      .loader-quart:after {
        content: '';
        position: absolute;
        top: -6px; 
        left: -6px;
        bottom: -6px;
        right: -6px;
        border-radius: 50px;
        border: 6px solid transparent;
        border-top-color: $btw-main-colour;
        -webkit-animation: spin 1s linear infinite;
        animation: spin 1s linear infinite;
      }

    }

    
  }

@-webkit-keyframes spin {
  0%{ -webkit-transform: rotate(0deg); tranform: rotate(0deg);}
	100%{ -webkit-transform: rotate(360deg); tranform: rotate(360deg);}
}

@keyframes spin {
	0%{ -webkit-transform: rotate(0deg); transform: rotate(0deg);}
	100%{ -webkit-transform: rotate(360deg); transform: rotate(360deg);}
}


</style>