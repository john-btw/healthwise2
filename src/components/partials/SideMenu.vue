<template>
  <div class="side-menu grid-x ">
  <!-- ACCESIBILITY NOT TESTED - NOT USED IN BTW //-->
    <button class="fade" 
    @click="$emit('close')"
    role="button" tabindex="0"
    :aria-label="$store.state.courseContent.global._accessibility.close" />
    <div class="side-menu-main cell large-4 medium-6 small-12">
      <div class="side-menu-title" v-html="$store.state.courseContent.config.coursename" />
      <div class="side-menu-items">
        <button class="side-menu-item flexbox flexbox-row flexbox-align-center" 
             v-for="(topic, index) in $store.state.courseContent.topics" :key="index"
             :class="{ 'locked': $store.getters.checkTopicLocked(topic.uri), 'current': topic.uri === $store.state.route, 'complete': $store.getters.checkTopicComplete(topic.uri) }"
             :aria-label="topic.title"
             role="button" tabindex="0"
             @click="gotoPage(topic.uri)" >
          <div class="side-menu-item-title" v-html="topic.title" />
          <img class="side-menu-item-lock" src="@/assets/images/icons/lock-alt.svg" v-if="$store.getters.checkTopicLocked(topic.uri)"/>
          <div class="side-menu-item-bar" v-if="topic.uri === $store.state.route"/>
        </button>
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

  export default class SideMenu extends Vue {
    
    private gotoPage(_route: string) {
      if (!this.$store.getters.checkTopicLocked(_route) && _route !== this.$store.state.route) {
        this.$router.replace({ path: _route });
        this.$store.getters.write;
        this.$emit('close');
      }
    }

  }

</script>

<style scoped lang="scss">

  @import "../../style/global.scss";

  .side-menu {
    position: relative;
    z-index: 1000;

    .side-menu-main {
      position: absolute;
      z-index: 1002;
      background-color: $menu-background;
      top:0;
      right:0;

      animation: slide-in 0.5s;

      .side-menu-title {
        background-color: $menu-title-background;
        color: $menu-title-text;
        text-align: left;
        padding: 6em 0 1em 2.2em;
      }

      .side-menu-items {
        padding: 1em 0;

        .side-menu-item {
          text-align: left;
          padding: 1em 2.2em;
          position: relative;
          cursor: pointer;
          color: $menu-items;

          &.locked {
            cursor: default;
            opacity: 0.5;
          }

          &.current {
            color: $highlight;
            font-weight: bold;
          }

          &.complete {
            color: $correct-highlight;
          }

          .side-menu-item-bar {
            background-color: $highlight;
            position: absolute;
            right: 2.2em;
            width: 0.5em;
            height: 50%;
          }

          .side-menu-item-lock {
            width: 1em;
            height: 1em;
            position: absolute;
            right: 2.2em;
          }
        }

        
      }
    }
  }

</style>