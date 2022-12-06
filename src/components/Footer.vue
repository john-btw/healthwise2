<template>
  <div v-if="element && ($store.getters.topicComplete === true  || $store.getters.topicOptional === true)" 
       class="footer grid-x"
       :style="{ 'background-color': $store.state.courseContent.global.footer._background, 'color': $store.state.courseContent.global.footer._colour }" >
    <div class="footer-prev cell large-6 medium-6 small-6 flexbox flexbox-row flexbox-align-center flexbox-justify-start">
      <button v-if="element.prev" 
          class=""
          @click="navigateToScreen(element.prev._uri, $store.state.topic-1)" 
          :aria-label="$store.state.courseContent.global._accessibility.prev + '. ' + element.prev.title" 
          role="button" tabindex="0" >
        <img class="footer-icon icon back" src='~@/assets/images/icons/fwd_btn_o.svg' />
        <div v-if="$store.state.device !== 'phone'" v-html="element.prev.title" />
      </button>
    </div>
    <div class="footer-next cell large-6 medium-6 small-6 flexbox flexbox-row flexbox-align-center flexbox-justify-end">
      <button v-if="element.next" 
          class="flexbox flexbox-row flexbox-align-center"
          @click="navigateToScreen(element.next._uri, $store.state.topic+1)" 
          :aria-label="$store.state.courseContent.global._accessibility.next + '. ' + element.next.title" 
          role="button" tabindex="0" >
        <div v-if="$store.state.device !== 'phone'" v-html="element.next.title" />
        <div v-if="$store.state.device === 'phone'" v-html="$store.state.courseContent.global.buttons.continue" />
        <img class="footer-icon icon" src='~@/assets/images/icons/fwd_btn_o.svg' />
      </button>
    </div>
  </div>
</template>

<script lang="ts">

  import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

  import IFooter from "@/interfaces/IFooter";

  @Component({ 
    components: {
      
    }
  })

  export default class Footer extends Vue implements IFooter {
    @Prop({ required: true })
    protected element!: IFooter;

    @Prop({ default: "" })
    public _id!: string;

    private mounted() {
      this.$store.getters.setContentStatus(this.element._id, 'complete', true);
    }

    private navigateToScreen(_uri: string, _newTopicNum: number) { 
      const _pageURI = this.$store.state.courseContent.topics[_newTopicNum].pages[0]._id;
      this.setTopicNumber(_newTopicNum);
      if(_pageURI || _uri === '/quiz') {
        this.$store.state.bookmark = _pageURI;
        this.$store.getters.setSCORMBookmark(_pageURI);

        Vue.nextTick(() => {
          this.$router.replace({ path: _uri });
        });
      }
      this.$store.getters.write;
    }

    private setTopicNumber(_index: number) {
      this.$store.state.topic = _index;
      this.$data._currentTopic = _index;
      this.$store.getters.write;
    }

  }

</script>

<style scoped lang="scss">

  @import "../style/global.scss";

  .footer {
    padding: 0 $bar-padding;

    .footer-prev {
      text-align: left;
      cursor: pointer;

      :hover {
        opacity: $hover-fade;
      }
    }

    .footer-next {
      text-align: right;
      cursor: pointer;
      
      div {
        font-weight: bold;
      }

      :hover {
        opacity: $hover-fade;
      }
    }

    .footer-icon {
      
      width: 3rem;
      height: 3rem;
      margin: 0;

      &.back {
        transform: scaleX(-1);
      }
    }
  }

</style>