<template>
  <div class="colours flexbox flexbox-row flexbox-align-stretch flexbox-justify-stretch" aria-hidden="true">
  <!-- NO ACCESIBILITY  - DEV ONLY //-->

    <div class="colour primary" :style="{ 'background-color': primaryColour }" :class="{ 'selected': selectedColour === 'primaryColour' }" @click="setColour('primaryColour')" ></div>
    <div class="colour secondary" :style="{'background-color': secondaryColour }" :class="{ 'selected': selectedColour === 'secondaryColour' }" @click="setColour('secondaryColour')"  ></div>
    <div class="colour grey" :style="{'background-color': greyColour }" :class="{ 'selected': selectedColour === 'greyColour' }" @click="setColour('greyColour')"  ></div>
    <div class="colour grey2" :style="{'background-color': grey2Colour }" :class="{ 'selected': selectedColour === 'grey2Colour' }" @click="setColour('grey2Colour')"  ></div>
    <div class="colour black" :style="{'background-color': 'black' }" :class="{ 'selected': selectedColour === 'blackColour' }" @click="setColour('blackColour')"  ></div>
    <div class="colour white" :style="{'background-color': 'white' }" :class="{ 'selected': selectedColour === 'whiteColour' }" @click="setColour('whiteColour')"  ></div>

    <input class="colourProp" :v-model="primary" :value="primary" @change="setColour('primaryColour')" />
    <input class="colourProp" :v-model="secondary" :value="secondary" />
    <input class="colourProp" :v-model="grey" :value="grey" />
    <input class="colourProp" :v-model="grey2" :value="grey2" />

  </div>
</template>

<script lang="ts">

  import { Component, Prop, Vue, Mixins, Watch } from 'vue-property-decorator';

  @Component({ 
    components: {
      
    }
  })

  export default class colours extends Vue {
    @Prop({ default: "" })
    private name!: string;
    
    @Prop({ default: "" })
    private defaultColour!: string;
    
    @Prop({ default: "" })
    private primaryColour!: string;

    @Prop({ default: "" })
    private secondaryColour!: string;

    @Prop({ default: "" })
    private greyColour!: string;

    @Prop({ default: "" })
    private grey2Colour!: string;

    private selectedColour: string = "";

    private primary: string = "";
    private secondary: string = "";
    private grey: string = "";
    private grey2: string = "";

    private beforeMount() {
      this.selectedColour = this.defaultColour;
      this.primary = "#000000";
      this.secondary = "#000000";
      this.grey = "#000000";
      this.grey2 = "#000000";
    }

    @Watch('defaultColour')
    private updateDefault() {
      this.selectedColour = this.defaultColour;
      console.log(this.defaultColour, this.name);
    }

    private mounted(){
      Vue.nextTick(() => {
        this.primary = this.primaryColour;
        this.secondary = this.secondaryColour;
        this.grey = this.greyColour;
        this.grey2 = this.grey2Colour;
      });
    }

    private updateColours(){
      this.primary = this.primaryColour;
        this.secondary = this.secondaryColour;
        this.grey = this.greyColour;
        this.grey2 = this.grey2Colour;
    }

    @Watch('primaryColour')
    private updatePrimary() {
      //console.log(this.selectedColour + ' : ' +  this.name);
      if(this.selectedColour === 'primaryColour') {
        this.setColour (this.selectedColour);
      }
    }

    @Watch('secondaryColour')
    private updateSecondary() {
      if(this.selectedColour === 'secondaryColour') {
        this.setColour (this.selectedColour);
      }
    }

    @Watch('greyColour')
    private updateGrey() {
      if(this.selectedColour === 'greyColour') {
        this.setColour (this.selectedColour);
      }
    }

    @Watch('grey2Colour')
    private updateGrey2() {
      if(this.selectedColour === 'grey2') {
        this.setColour (this.selectedColour);
      }
    }

    private setColour (_selectedColour: string) {
      //console.log(this.name, _selectedColour);
      this.selectedColour = _selectedColour;
      switch(_selectedColour) {
        case 'primaryColour':
          this.$emit('setColour', { _name: this.name, _hex: this.primaryColour });
          break;
        case 'secondaryColour':
          this.$emit('setColour', { _name: this.name, _hex: this.secondaryColour });
          break;
        case 'greyColour':
          this.$emit('setColour', { _name: this.name, _hex: this.greyColour });
          break;
        case 'whiteColour':
          this.$emit('setColour', { _name: this.name, _hex: '#ffffff' });
          break;
        case 'blackColour':
          this.$emit('setColour', { _name: this.name, _hex: '#000000' });
          break;
        case 'grey2Colour':
          this.$emit('setColour', { _name: this.name, _hex: this.grey2Colour });
          break;
      }
    }
  }

</script>

<style scoped lang="scss">
  
  @import "../../style/global.scss";

.colours {

  border: 1px solid #666;
  width: auto;

  .colour {
    //width: 2rem;
    height: 2rem;
    flex: 1 1 auto;
    cursor: pointer;

    &.selected {
      border: 4px solid #666;
      box-sizing: border-box;
      cursor: default;
    }

    //&.black {
      //&.selected {
       // border: 4px solid #666;
      //}
    //}
  }

  .colourProp {
    width: 1px;
    height: 1px;
    position: absolute;
    top: 0;
    left: 0;
  }

}


</style>