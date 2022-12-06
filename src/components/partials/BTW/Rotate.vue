<template>
  <div class="rotate grid-x flexbox flexbox-align-center flexbox-justify-center" role="region" level="1">
     <div class="rotate flexbox" >
      <img class="rotate-icon" src='~@/assets/images/icons/sync-alt-solid.svg'/>
      <h3 class="rotate-ins" v-html="$store.state.courseContent.global.rotation" />
    </div>
  </div>

</template>

<script lang="ts">

  import { Component, Prop, Vue } from 'vue-property-decorator';

  @Component({ 
    components: {
      
    }
  })

  export default class Rotate extends Vue {

  }

</script>

<style scoped lang="scss">

  @import "../../../style/global.scss";


 .rotate {
      display: flex;
      width: 100%;
      height: 100vh;
      background-color: $btw-main-colour;
      position: fixed;
      top:0;
      left:0;
      z-index:5001;

      flex: 1 1 auto;

      align-items: center;
      justify-content: center;

      opacity:1;

      animation: opacity-in 0.5s;

      .rotate-icon {
        width: 40%;
        height: 40%;
        animation: opacity-in 2s;
        position: relative;
      }
      .rotate-icon {
        animation: scale-rotate-in 2s;
        transform: rotate(90deg);
      }

      .rotate-ins {
        color: var(--btwtextintrotextcolour); 
        padding: 2rem 0 0 0;
        margin: 0;
        font-size: 2vw;
      }
    }


</style>