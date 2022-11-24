<template>
  <div class="header grid-x flexbox flexbox-row flexbox-align-center"
       :style="{ 'background-color': $store.state.courseContent.global.header._background, 'color': $store.state.courseContent.global.header._colour }">
       <!-- NO ACCESSSIBILITY ADDED - NOT USED IN BTW //-->
    <div v-if="$store.state.courseContent.global.header._logo === true"
         class="header-logo cell large-2 medium-6 show-for-medium flexbox-justify-start" >
      <img src="https://via.placeholder.com/100x50" />
    </div>
    <div v-if="$store.state.courseContent.global._navigation === 'side' || direction === 'vertical' || $store.state.device === 'phone'" 
         class="header-menu cell large-10 medium-6 small-12" >
      <img class="header-icon icon" src='~@/assets/images/icons/bars.svg' 
          @click="$emit('showMenu')" />
    </div>
  </div>
</template>

<script lang="ts">

  import { Component, Prop, Vue } from 'vue-property-decorator';


  @Component({ 
    components: {
      
    }
  })

  export default class Header extends Vue {
    @Prop({ required: true })
    protected direction!: string;
    
  }

</script>

<style scoped lang="scss">

  @import "../style/global.scss";
  
  .header {
    width: 100%;
    padding: $bar-padding;
    flex: 0 0 auto;

    .header-logo {
      text-align: left;
      img {
        // width: 100px;
        // height: 50px;
        width: auto;
        height: 100%;
        object-fit: cover;
      }
    }

    .header-menu {
      text-align: right;

      :hover {
        opacity: $hover-fade;
      }

      .header-icon {
        cursor: pointer;
      }
    }

  }

  

</style>