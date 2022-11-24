<template>
  <div class="menu grid-x flexbox flexbox-justify-stretch flexbox-align-stretch">
    <header-bar v-if="$store.state.courseContent.global.header._display === true"  
                direction="" />
     <!-- ACCESIBILITY NOT TESTED - NOT USED IN BTW //-->
    <div class="menu-main flexbox flexbox-justify-stretch flexbox-align-stretch">
      
        <div class="menu-items grid-x flexbox flexbox-row flexbox-justify-center flexbox-align-center" >

          <button class="menu-tile flexbox flexbox-row flexbox-justify-center flexbox-align-center" 
               v-for="(topic, index) in $store.state.courseContent.topics" :key="index" 
               @click="navigateTopic(topic.uri)"
               role="button" tabindex="0"
               :aria-label="topic.title"
               :style="{ 'height': getTileHeight, 'background-color': element._colours[index] }"
               :class="getClasses(topic.uri)">
            <img class="menu-tile-lock" src="@/assets/images/icons/lock-alt.svg" v-if="$store.getters.checkTopicLocked(topic.uri)"/>
            <img class="menu-tile-complete" src="@/assets/images/icons/correct.svg" v-if="$store.getters.checkTopicComplete(topic.uri)"/>
            <div class="menu-tile-title" >
              {{ topic.title }}
            </div>
            <div class="menu-tile-progress" >
              <div class="menu-tile-progress-fill" :style="{ 'width': getTileProgress(topic.uri) }"/>
            </div>
          </button>
        </div>
      
    </div>
  </div>
</template>

<script lang="ts">

  import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

  import Components from '@/components/Components'

  @Component({ 
    components: {
      ...Components
    }
  })

  export default class Menu extends Vue {
    private element: any;

    get device() {
      return this.$store.state.device;
    }

    beforeMount() {
      this.element = this.$store.state.courseContent.menu ? this.$store.state.courseContent.menu : '';

      /*if (this.element === '' || this.$store.state.device === 'phone') {  
        this.$router.replace({ path: '/' });
        this.$store.getters.write;
      }*/
    }

    private getClasses(_uri: string) {
      let classes = '';
      if(this.element._classes) {
        classes += this.element._classes;
      }
      if (this.$store.getters.checkTopicLocked(_uri)) {
        classes += 'locked';
      }
      return classes; 
    }

    get getTileHeight() {
      const percent = (100/this.element._rows) - 7;
      return percent + '%';
    }

    private getTileProgress(_uri: string) {
      let totalPages = 0;
      let pagesComplete = 0;
      this.$store.state.topics.forEach((topic: any) => {
        if (topic.uri === _uri) {
          totalPages = topic.pages.length;
          topic.pages.forEach((page: any) => {
            if (page.complete) {
              pagesComplete++;
            }
          });
        }
      });
      const progress = Math.round((100/totalPages) * pagesComplete);
      return progress + '%';
    }

    private navigateTopic(_uri: string) {
      if (!this.$store.getters.checkTopicLocked(_uri)) {
        this.$router.replace({ path: _uri });
        this.$store.getters.write;
      }
    }

  }


</script>

<style scoped lang="scss">
  
  @import "../style/global.scss";

  .menu {

    aspect-ratio: 4/3;
    height: auto;

    width:100%;
    max-width: 1024px;

    background-color: $white;

     @media #{$media-phone} {
      aspect-ratio: unset;
    }

    .menu-main {
      flex: 1 1 auto;
      height: 0;
      overflow: hidden;
      overflow-y: auto;

      .menu-items {
        height: 100%;
        flex-wrap: wrap;

        .menu-tile {
          box-sizing: border-box;
          margin: 2%;
          cursor: pointer;
          position: relative;

          &.locked {
            cursor: default;
            opacity: 0.5;
          }

          .menu-tile-lock,, .menu-tile-complete {
            width: 1.5em;
            height: 1.5em;
            position: absolute;
            right: 2.2em;
            top: 2.2em;
          }
          
          .menu-tile-title {

          }

          .menu-tile-progress {
            position: absolute;
            bottom: 0;
            width: 100%;
            height: 1em;
            background-color: $menu-tile-progress;

             .menu-tile-progress-fill {
              width: 100%;
              height: 100%;
              background-color: $menu-tile-progress-fill;
            }
          }

        }
      }
    }

  }

  

</style>
