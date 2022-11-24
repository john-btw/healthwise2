<template>
  <div class="homeBtn grid-x flexbox flexbox-row flexbox-align-center" >
    <div class="home-btn" >

        <button class="home-btn-icon icon" 
        :class="{ 'disabled': checkDisabled(), 'scale': $store.state.animMenuIcon === true }" 
        @click="reset" 
        :aria-label="$store.state.courseContent.global._accessibility.menubtn" 
        role="button" tabindex="0" > 
        </button>

        <span class="home-btn-label" @click="reset" aria-hidden="true" >
          {{$store.state.courseContent.global._accessibility.menubtn}}
        </span>

        <button class="media-subtitle-icon icon" v-if="$store.state.subtitles === true"
        :class="{ 'on': $store.state.showSubtitles === true, 'de': $store.state.language === 'de' }" 
        @click="toggleSubtitles" 
        :aria-label="$store.state.courseContent.global._accessibility.subtitlebtn" 
        role="button" tabindex="0"></button>

      </div>
  </div>
</template>

<script lang="ts">

  import { Component, Prop, Vue, Watch } from 'vue-property-decorator';


  @Component({ 
    components: {
      
    }
  })

  export default class Header extends Vue {

    private checkDisabled() {
      let disable = false;
      
      const id = this.$store.state.bookmark;
      if (this.$store.getters.getContentStatus(id, 'complete') === false) {
         disable = true;
      }
      return disable;
    }

    private toggleSubtitles() {
      this.$store.state.showSubtitles = !this.$store.state.showSubtitles;
      console.log(this.$store.state.showSubtitles);
      this.$store.getters.write;
    }

    private reset() {
      this.$store.state.subtitles = false;
      //this.$store.state.showSubtitles = true;
      this.$store.getters.write;

      this.$emit('menu');
    }

    // @Watch("$store.state.showSubtitles")
    // private toggleSubtitleIcon()
    // {
    //   this.showSubtitles = this.$store.state.showSubtitles;
    // }

  }

</script>

<style scoped lang="scss">

  @import "../style/global.scss";
  
  .homeBtn {
    width: 100%;
    height: $btw-topbar-height;
    position: relative;

     @media #{$media-phone} {
        height: $btw-topbar-height-mobile;
        background-color: $btw-mobileheader-colour;
        position: fixed!important;
      }

      .home-btn {
        display: flex;
        cursor: pointer;
        position: absolute;
        top: $bar-padding;
        right: $bar-padding;
        width: 8vmax;
        height: 3vmax;

        
        @media #{$media-tablet-land}{
          width: 8vmax;
        }


        @media #{$media-phone} {
          top: $bar-padding/2;
          right: $bar-padding;
          width: 16vmax;
        }
        left: auto;

        &:hover, &.active {
          .home-btn-icon {
            background-image: url('~@/assets/images/icons/return_btn_o.svg');
            background-size: contain;
            background-repeat: no-repeat;
          }
        }
      }

    .home-btn-label {
      color: $white;
      position: absolute;
      left: 50%;
      top: 50%;
       width: 4vmax;
       line-height: 1;
      transform: translate(0%,-50%);

      @media #{$media-phone} {
        width: 8vmax;
        font-size: 0.8em;
        transform: none;
      }
    }

    .home-btn-icon {
      
      cursor: pointer;
      left: 0;
      position: absolute;

      &.scale {
        animation: scale-in 1s;

        @media #{$media-phone} {
          animation: none;
        }
      }

      background-image: url('~@/assets/images/icons/return_btn_n.svg');
      background-size: contain;
      background-repeat: no-repeat;

      width: 3vmax;
      height: 3vmax; 

      @media #{$media-phone} {
        width: 6vmax;
        height: 6vmax; 
      }
    }

    .media-subtitle-icon {
      width: 3vmax;
      height: 3vmax;

      @media #{$media-phone} {
        width: 6vmax;
        height: 6vmax; 
      }
    }

    .media-subtitle-icon {
      position: absolute;
      top: 0.1em;
      right: 8vmax;

      @media #{$media-phone} {
        top: 0.35em;
        right: 16vmax;
      }

      left: auto;
      cursor: pointer;

      background-image: url('~@/assets/images/icons/transcript_off_en.svg');
      background-size: contain;
      background-repeat: no-repeat;

      &.on {
        // opacity: 0.5;

        background-image: url('~@/assets/images/icons/transcript_on_en.svg');
        background-size: contain;
        background-repeat: no-repeat;
      }

      &.de {
        background-image: url('~@/assets/images/icons/transcript_off_de.svg');
        background-size: contain;
        background-repeat: no-repeat;

        &.on {
          // opacity: 0.5;

          background-image: url('~@/assets/images/icons/transcript_on_de.svg');
          background-size: contain;
          background-repeat: no-repeat;
        }
      }
    }

  }

  

</style>