<template>
  <div class="vertical" id="vertical">
    <side-menu v-if="showSideMenu === true" @close="showSideMenu = false" />
    <header-bar v-if="$store.state.courseContent.global.header._display === true" 
                direction="vertical" 
                @showMenu="showSideMenu = true" />
    
    <home-button v-if="$store.state.courseContent.global.homeBtn._display === true"
                 @menu="navigateMenu" />
    <div class="section" 
        v-for="(page, index) in screens" 
        :key="index">
      <component
        :is="page._component" 
        :element="page" 
        :class="page._classes"
        v-if="getVisibility(page._id, index)" />
    </div>
    <footer-nav v-if="$store.state.courseContent.global.footer._display === true && $store.getters.topicComplete === true" :element="$store.getters.getTopicFooter" />
  </div>
</template>

<script>

import Components from '@/components/Components'

export default {
  name: 'Vertical',
  components: {
    ...Components
  },
  data: function() {
    return {
      screens: this.$store.getters.getPages,
      showSideMenu: false
    }
  },
  methods: {
    navigateMenu: function() {
      this.$router.replace({ path: '/menu' });
    },
    getVisibility: function(_id, _index) {
      let visible = !this.$store.getters.getContentStatus(_id, 'locked'); 
      if (this.$store.state.courseContent.menu._type === 'pages' && this.$store.state.device === 'phone' && _index > 0) {
        const prevId = this.$store.getters.getPrevPageID(_id);
        const prevComplete = this.$store.getters.getContentStatus(prevId, 'complete');
        if (prevComplete) {
          visible = true;
        } else {
          visible = false;
        }
      }
      return visible;
    }
  }
}
</script>

<style scoped lang="scss">
  .vertical {
    position: absolute;
    // min-height: 100%;
    height: auto;
    width: 100%;
    top:0;
  }

  .homeBtn {
    position: sticky;
    top:0;
    left: 0;
    z-index: 1002;

  }

</style>