<template>
  <div v-if="element && (element.content.title || element.content.body)" :ref="element._id" class="container grid-x plain-text" 
       v-observe-visibility="{ callback: visibilityChanged, throttle: 100, intersection: { threshold: 0.8 }, once: false }"
       :class="{ 'visible': true }" >

    <h1 class="cell large-12 medium-12 small-12" 
        v-if="element.content.title" 
        v-html="element.content.title"/>

    <div class="cell large-12 medium-12 small-12" 
        v-if="element.content.body" 
        v-html="element.content.body"/>

    <button 
          v-if="element.content.button"          
          class="button" 
          aria-label="element.content.button.title"
          role="button" tabindex="0" 
          @click.prevent="unlockNext" 
          :disabled="$store.getters.getContentStatus(element._id, 'complete') === true">
            {{element.content.button.title}}
          </button>
  </div>
</template>

<script lang="ts">

  import { Component, Prop, Vue, Mixins } from 'vue-property-decorator';
  import BaseComponent from '@/components/BaseComponent';

  import IPlainText from '@/interfaces/IPlainText'

  @Component({ 
    components: {
      
    }
  })

  export default class PlainText extends Mixins(BaseComponent) implements IPlainText {
    @Prop({ required: true })
    protected element!: IPlainText;

    @Prop({ default: "" })
    public _id!: string;

  }

</script>

<style scoped lang="scss">
  
  @import "../style/global.scss";

.plain-text {
  
}
  

</style>