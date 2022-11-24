<template>
  <div class="bookmark grid-x flexbox flexbox-align-center flexbox-justify-center" >
    <div class="fade" />
    <div class="bookmark-message cell large-6 medium-6 small-6" role="region" level="1">
      <h1 class="accessibility-region" v-html="$store.state.courseContent.global._accessibility.bookmarktitle" ref="bookmark" tabindex="-1" />
      <div v-html="$store.state.courseContent.global.bookmark.message" role="heading" level="2" />
      <button          
        class="button" 
        role="button" tabindex="0"
        v-text="$store.state.courseContent.global.bookmark.yes"
        :aria-label="$store.state.courseContent.global.bookmark.yes"
        @click.prevent="gotoBokmark"  />
      <button         
        class="button" 
        role="button" tabindex="0"
        v-text="$store.state.courseContent.global.bookmark.no"
        :aria-label="$store.state.courseContent.global.bookmark.no"
         @click.prevent="closeMessage"  />

    </div>
  </div>
</template>

<script lang="ts">

  import { Component, Prop, Vue } from 'vue-property-decorator';

  @Component({ 
    components: {
      
    }
  })

  export default class Bookmark extends Vue {
    
    private mounted(){
        Vue.nextTick(() => {
            //console.log('help mounted >>');
            this.$store.getters.setAccessibilityFocus(this.$refs.bookmark);
        });
    } 
    
    private activated(){ //mounted
       Vue.nextTick(() => {
            //console.log('help activated >>');
            this.$store.getters.setAccessibilityFocus(this.$refs.bookmark);
        });
    }

    private gotoBokmark() {
      this.$store.state.bookmark = this.$store.state.tempbookmark;
      this.closeMessage();
    }
    
    private closeMessage() {
      this.$store.state.tempbookmark = '';
      this.$store.getters.write;
    }

  }

</script>

<style scoped lang="scss">

  @import "../../style/global.scss";


  .bookmark {

    position: absolute;
    top:0;
    left:0;
    width: 100%;
    height: 100%;

    z-index: 1000;

    .bookmark-message {
      background: $grey;
      padding: $container-padding;
      height: auto;

      z-index: 1002;

      .button {
        margin: $bar-padding;
      }
    }
  }


</style>