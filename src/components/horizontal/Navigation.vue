<template>
  <div class="navigation grid-x flexbox flexbox-row "
       :style="{ 'background-color': $store.state.courseContent.global.footer._background, 'color': $store.state.courseContent.global.footer._colour }">
       <!-- ACCESIBILITY NOT TESTED - NOT USED IN BTW //-->
    <div class="navigation-prev cell large-4 medium-4 small-4"
         :class="{ 'large-6 medium-6 small-6': $store.state.courseContent.global._navigation !== 'navigation' }" >
      <button @click="checkNavigation('prev')" 
      :class="{ 'disabled': checkDisabled('prev') }" 
        role="button" tabindex="0"
        :aria-label="$store.state.courseContent.global._accessibility.prev" >
        <img class="nav-icon icon" src='~@/assets/images/icons/arrow-alt-circle-left.svg' />
      </button>
    </div>
    <div class="navigation-menu cell large-4 medium-4 small-4" v-if="$store.state.courseContent.global._navigation === 'navigation'" >
      <button @click="$emit('menu')"  
        role="button" tabindex="0"
        :aria-label="$store.state.courseContent.global._accessibility.menubtn" >
        <img class="nav-icon icon" src='~@/assets/images/icons/home.svg' />
      </button>
    </div>
    <div class="navigation-next cell large-4 medium-4 small-4"
         :class="{ 'large-6 medium-6 small-6': $store.state.courseContent.global._navigation !== 'navigation' }" >
      <button @click="checkNavigation('next')" 
      :class="{ 'disabled': checkDisabled('next') }"  
        role="button" tabindex="0"
        :aria-label="$store.state.courseContent.global._accessibility.next" >
        <img class="nav-icon icon" src='~@/assets/images/icons/arrow-alt-circle-right.svg' />
      </button>
    </div>
  </div>
</template>

<script lang="ts">

  import { Component, Prop, Vue } from 'vue-property-decorator';

  @Component({ 
    components: {
      
    }
  })

  export default class Naviagtion extends Vue {
    
    private checkDisabled(_nav: string) {
      let disable = false;
      switch (this.$store.state.courseContent.global._forceHome) {
        case true:
          if (this.$store.getters.getPagePrevNext(_nav) === false && this.$store.getters.getPageFirstLast(_nav) === true) {
            disable = true;
          }
          break;
        case false:
          if (this.$store.getters.getPageFirstLast(_nav) === true) {
            disable = true;
          }
          break;
      }
      const nextid = this.$store.getters.getNextPageID;
      if (_nav === 'next' && this.$store.getters.getContentStatus(nextid, 'locked') === true) {
         disable = true;
      }
      return disable;
    }
      
    private checkNavigation(_nav: string) {
      const nextid = this.$store.getters.getNextPageID;
      if (this.$store.getters.getPagePrevNext(_nav) === true && this.$store.getters.getPageFirstLast(_nav) === false ) {
        this.$emit(_nav);
      } else if (this.$store.state.courseContent.global._forceHome === false) {
        if ( _nav === 'next' && this.$store.getters.getContentStatus(nextid, 'locked') === false) {
          this.$emit(_nav);
        } else if (_nav === 'prev') {
          this.$emit(_nav);
        }
      }
    }
  }

</script>

<style scoped lang="scss">

  @import "../../style/global.scss";

  .navigation {
    padding: $bar-padding;
    // position: absolute;
    // bottom:0;
    width:100%;
    flex: 0 0 auto;

    .navigation-prev {
      text-align: left;
    }

    .navigation-menu {
      text-align: center;
    }

    .navigation-next {
      text-align: right;

    }

    .navigation-next, .navigation-menu, .navigation-prev  {
      opacity: 1;

      div {
        &.disabled {
          cursor: default;
          opacity: $hover-fade;
        }

        
        &:not(disabled) {
          &:hover {
            opacity: $hover-fade;
          }
        }
      }

      .nav-icon {
        cursor: pointer;
      }
    }

  }

</style>