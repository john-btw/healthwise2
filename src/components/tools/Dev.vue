<template>
  <div class="dev" aria-hidden="true">
  <!-- NO ACCESIBILITY  - DEV ONLY //-->

    <div class="dev-screen-id">
      <div class="screen-id" v-html="getScreenID()" />
    </div>

    <div class="dev-edit-container" v-if="$store.state.courseContent._edit === true" >
      <button 
        class="dev-edit-button button" 
        v-text="'Edit'" 
        @click.stop="editContent" />
    </div>

  </div>
</template>

<script lang="ts">

  import { Component, Prop, Vue, Mixins, Watch } from 'vue-property-decorator';

  @Component({ 
    components: {
      
    }
  })

  export default class Dev extends Vue {

    @Watch('$store.state.bookmark')
    private getScreenID() {
      return this.$store.state.bookmark;
    }

    private editContent() {
      this.$router.replace({ path: '/edit' });
    }

  }

</script>

<style scoped lang="scss">
  
  @import "../../style/global.scss";

.dev {
  width: 100%;
  height: auto;
  position: fixed;
  top:0;
  left:0;
  z-index:5000;


  .dev-screen-id {
    position: absolute;
    top: 0;
    right: 0;
    //transform: translate(0,-50%);
    max-width: 5em;

    background-color: #000;
    color: #fff;
    padding: 0.5em;
    font-size: 0.8em;

    @media #{$media-mobile} {
      font-size: 2em;
      max-width: 10em;
    }

    @media #{$media-phone} {
      font-size: 1.2em;
    }

    z-index: 1000;
  }

  .dev-edit-container {

    position: absolute;
    right: 0;
    top: 0;
    z-index: 2000;

    .dev-edit-button {
      cursor: pointer;
      
    }
  }
}


</style>