<template>
  <div class="popup grid-x flexbox flexbox-align-center flexbox-justify-center" >
    <div class="popup-fade" @click.prevent="$store.getters.closePopup(true)" />
    <div class="popup-content cell large-8 medium-10 small-12 flexbox flexbox-align-center flexbox-justify-start">
      <h3 class="popup-title" v-html="$store.state.popup.title" ref="popup" tabindex="-1" />
      <div class="popup-content-body" v-html="$store.state.popup.body" />
      <button         
        class="button" 
        v-text="$store.state.courseContent.global.buttons.close"
        role="button" tabindex="0"
        :aria-label="$store.state.courseContent.global._accessibility.close"
        @click.prevent="$store.getters.closePopup(true)"  />

    </div>
  </div>
</template>

<script lang="ts">

  import { Component, Prop, Vue } from 'vue-property-decorator';

  //  import IPopup from "@/interfaces/partials/IPopup";

  @Component({ 
    components: {
      
    }
  })

  export default class Popup extends Vue {
    private mounted(){
        Vue.nextTick(() => {
            //console.log('help mounted >>');
            this.$store.getters.setAccessibilityFocus(this.$refs.popup);
        });
    } 
    
    private activated(){ //mounted
       Vue.nextTick(() => {
            //console.log('help activated >>');
            this.$store.getters.setAccessibilityFocus(this.$refs.popup);
        });
    }
  }

</script>

<style scoped lang="scss">

  @import "../../style/global.scss";


  .popup {
    width: 100%;
    height: 100%;
    max-height: 100%;
    z-index: 1002;
    position: absolute!important;
    top: 0;
    left:0;

    .popup-fade {
      background: $fade-colour;
      opacity: $fade-opacity;
      width: 100%;
      height: 100%;
      z-index: 1003;
      animation: opacity-in-fade 0.5s;
    }

    .popup-title {
      color: $btw-main-colour;
      margin-top: 1em;
    }

    .popup-content {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
      background: $popup-bg;

      max-height: 100%;
      max-width: 768px;

      animation: opacity-in 0.5s;
      
      padding: 2.2em;
      @media #{$media-phone} {
        padding: 1rem;
        overflow: hidden;
        overflow-y: auto;
        max-width: 90%;
      }

      border-radius: 1em;

      z-index: 1004;

      .popup-content-body {
        height: auto;
      }

      .button {
        margin: $bar-padding;

        background-color: $btw-btn-bg;
        color: $btw-btn-colour;
        border-radius: 1em;
        padding: 0.5em 2.2em;
        font-weight: bold;

        @media (hover: hover) and (pointer: fine) {
          &:hover {
            background-color: $btw-btn-hover-bg;
            color: $btw-btn-hover-colour;
          }
        }
      }
    }
  }


</style>