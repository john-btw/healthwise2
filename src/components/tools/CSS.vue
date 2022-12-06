<template>
  <div class="css" aria-hidden="true" v-if="$store.state.device === ''">
  <!-- NO ACCESIBILITY  - DEV ONLY //-->

    <div class="css-container" >

      <label>Primary colour</label>
      <div class="values flexbox flexbox-row">
        <input class='colour' type="color" ref="primaryColour"  @change="saveCSS()" /><input class='hex' type="text" ref="priColourHex" readonly disabled />
      </div>

      <label>Secondary colour</label>
      <div class="values flexbox flexbox-row">
        <input class='colour' type="color" ref="secondaryColour" @change="saveCSS()"/><input class='hex' type="text" ref="secColourHex" readonly disabled />
      </div>

      <label>Grey colour</label>
      <div class="values flexbox flexbox-row">
        <input class='colour' type="color" ref="greyColour" @change="saveCSS()" /><input class='hex' type="text" ref="grColourHex" readonly disabled />
      </div>

      <label>Grey 2 colour</label>
      <div class="values flexbox flexbox-row">
        <input class='colour' type="color" ref="grey2Colour" @change="saveCSS()" /><input class='hex' type="text" ref="gr2ColourHex" readonly disabled /> 
        <!-- :onfocusout="updateColours()"  -->
      </div>

      <!-- <button @click="saveCSS()">Save Colours</button> -->
      <button @click="resetCSS()">Reset</button>

      <hr/>

      <div class="css-section-title" :class="{ 'active': sectionShowing === 'preloader' }">Preloader</div>
      <div class="css-section-colour" >
        <!-- <label>Preloader full background</label> -->
        <!-- <img class="info-icon" src='~@/assets/images/icons/info-circle-solid.svg' /> -->
        <!-- <css-colours :name="'preloader-bg-colour'" :defaultColour="'white'" :primaryColour.sync="primaryColour" :secondaryColour.sync="secondaryColour" :greyColour.sync="greyColour" :grey2Colour.sync="grey2Colour" @setColour="setColour" /> -->
        <label>Preloader spin colour</label>
        <css-colours :name="'preloader-spin-colour'" :defaultColour="'primaryColour'" :primaryColour.sync="primaryColour" :secondaryColour.sync="secondaryColour" :greyColour.sync="greyColour" :grey2Colour.sync="grey2Colour" @setColour="setColour" />
        <label>Preloader bg colour</label>
        <css-colours :name="'preloader-colour'" :defaultColour="'secondaryColour'" :primaryColour.sync="primaryColour" :secondaryColour.sync="secondaryColour" :greyColour.sync="greyColour" :grey2Colour.sync="grey2Colour" @setColour="setColour" />
      </div>

      <div class="css-section-title" :class="{ 'active': sectionShowing === 'splash' }">Splash</div>
      <div class="css-section-colour" >
        <label>Splash title</label>
        <css-colours :name="'splash-title'" :defaultColour="'primaryColour'" :primaryColour.sync="primaryColour" :secondaryColour.sync="secondaryColour" :greyColour.sync="greyColour" :grey2Colour.sync="grey2Colour" @setColour="setColour" />
      </div>
      
      <div class="css-section-title" :class="{ 'active': sectionShowing === 'fonts' }">Fonts</div>
      <div class="css-section-colour" >
        <label>Topic title</label>
        <css-colours :name="'topic-title'" :defaultColour="'primaryColour'" :primaryColour.sync="primaryColour" :secondaryColour.sync="secondaryColour" :greyColour.sync="greyColour" :grey2Colour.sync="grey2Colour" @setColour="setColour" />
        <label>Screen title</label>
        <css-colours :name="'title-colour'" :defaultColour="'primaryColour'" :primaryColour.sync="primaryColour" :secondaryColour.sync="secondaryColour" :greyColour.sync="greyColour" :grey2Colour.sync="grey2Colour" @setColour="setColour" />
        <label>Body text</label>
        <css-colours :name="'body-colour'" :defaultColour="'primaryColour'" :primaryColour.sync="primaryColour" :secondaryColour.sync="secondaryColour" :greyColour.sync="greyColour" :grey2Colour.sync="grey2Colour" @setColour="setColour" />
        <label>Body link</label>
        <css-colours :name="'body-link'" :defaultColour="'primaryColour'" :primaryColour.sync="primaryColour" :secondaryColour.sync="secondaryColour" :greyColour.sync="greyColour" :grey2Colour.sync="grey2Colour" @setColour="setColour" />
        <label>Body link hover</label>
        <css-colours :name="'body-link-hover'" :defaultColour="'whiteColour'" :primaryColour.sync="primaryColour" :secondaryColour.sync="secondaryColour" :greyColour.sync="greyColour" :grey2Colour.sync="grey2Colour" @setColour="setColour" />
      </div>

      <div class="css-section-title" :class="{ 'active': sectionShowing === 'menu' }">Menu</div>
      <div class="css-section-colour" >
        <label>Section active background</label>
        <css-colours :name="'menu-active'" :defaultColour="'primaryColour'" :primaryColour.sync="primaryColour" :secondaryColour.sync="secondaryColour" :greyColour.sync="greyColour" :grey2Colour.sync="grey2Colour" @setColour="setColour" />
        <label>Section active title</label>
        <css-colours :name="'menu-active-text'" :defaultColour="'whiteColour'" :primaryColour.sync="primaryColour" :secondaryColour.sync="secondaryColour" :greyColour.sync="greyColour" :grey2Colour.sync="grey2Colour" @setColour="setColour" />
        <label>Section title split colour (hover)</label>
        <css-colours :name="'split-text'" :defaultColour="'secondaryColour'" :primaryColour.sync="primaryColour" :secondaryColour.sync="secondaryColour" :greyColour.sync="greyColour" :grey2Colour.sync="grey2Colour" @setColour="setColour" />
        <label>Menu tile hover</label>
        <css-colours :name="'menu-hover'" :defaultColour="'secondaryColour'" :primaryColour.sync="primaryColour" :secondaryColour.sync="secondaryColour" :greyColour.sync="greyColour" :grey2Colour.sync="grey2Colour" @setColour="setColour" />
      </div>

      Overlays

      <!-- <div class="css-section-title" :class="{ 'active': sectionShowing === 'help' }">Help</div>
      <div class="css-section-colour" >
        <label>Help background</label>
        <css-colours :name="'help-bg'" :defaultColour="'greyColour'" :primaryColour.sync="primaryColour" :secondaryColour.sync="secondaryColour" :greyColour.sync="greyColour" :grey2Colour.sync="grey2Colour" @setColour="setColour" />
      </div> -->

      <div class="css-section-title" :class="{ 'active': sectionShowing === 'resources' }">Resources</div>
      <div class="css-section-colour" >
        <!-- <label>Resources background</label>
        <css-colours :name="'resource-bg'" :defaultColour="'greyColour'" :primaryColour.sync="primaryColour" :secondaryColour.sync="secondaryColour" :greyColour.sync="greyColour" :grey2Colour.sync="grey2Colour" @setColour="setColour" /> -->
        <label>Image link text</label>
        <css-colours :name="'resource-link'" :defaultColour="'primaryColour'" :primaryColour.sync="primaryColour" :secondaryColour.sync="secondaryColour" :greyColour.sync="greyColour" :grey2Colour.sync="grey2Colour" @setColour="setColour" />
        <label>Image link text hover</label>
        <css-colours :name="'resource-link-hover'" :defaultColour="'whiteColour'" :primaryColour.sync="primaryColour" :secondaryColour.sync="secondaryColour" :greyColour.sync="greyColour" :grey2Colour.sync="grey2Colour" @setColour="setColour" />
        <label>Image background link</label>
        <css-colours :name="'resource-img-link'" :defaultColour="'whiteColour'" :primaryColour.sync="primaryColour" :secondaryColour.sync="secondaryColour" :greyColour.sync="greyColour" :grey2Colour.sync="grey2Colour" @setColour="setColour" />
        <label>Image background link hover</label>
        <css-colours :name="'resource-img-link-hover'" :defaultColour="'primaryColour'" :primaryColour.sync="primaryColour" :secondaryColour.sync="secondaryColour" :greyColour.sync="greyColour" :grey2Colour.sync="grey2Colour" @setColour="setColour" />
        <label>Image border</label>
        <css-colours :name="'resource-img-border'" :defaultColour="'secondaryColour'" :primaryColour.sync="primaryColour" :secondaryColour.sync="secondaryColour" :greyColour.sync="greyColour" :grey2Colour.sync="grey2Colour" @setColour="setColour" />
        <label>Image border hover</label>
        <css-colours :name="'resource-img-border-hover'" :defaultColour="'blackColour'" :primaryColour.sync="primaryColour" :secondaryColour.sync="secondaryColour" :greyColour.sync="greyColour" :grey2Colour.sync="grey2Colour" @setColour="setColour" />
      </div>
      
      <!-- <div class="css-section-title" :class="{ 'active': sectionShowing === 'complete' }">Complete</div>
      <div class="css-section-colour" >
        <label>Complete background</label>
        <css-colours :name="'complete-bg'" :defaultColour="'greyColour'" :primaryColour.sync="primaryColour" :secondaryColour.sync="secondaryColour" :greyColour.sync="greyColour" :grey2Colour.sync="grey2Colour" @setColour="setColour" />
      </div> -->

      <div class="css-section-title" :class="{ 'active': sectionShowing === 'btn' }">Buttons (quiz, mobile popup)</div>
      <div class="css-section-colour" >
        <label>Background</label>
        <css-colours :name="'btn-bg'" :defaultColour="'primaryColour'" :primaryColour.sync="primaryColour" :secondaryColour.sync="secondaryColour" :greyColour.sync="greyColour" :grey2Colour.sync="grey2Colour" @setColour="setColour" />
        <label>Title</label>
        <css-colours :name="'btn-title'" :defaultColour="'whiteColour'" :primaryColour.sync="primaryColour" :secondaryColour.sync="secondaryColour" :greyColour.sync="greyColour" :grey2Colour.sync="grey2Colour" @setColour="setColour" />
        <label>Background hover</label>
        <css-colours :name="'btn-hover-bg'" :defaultColour="'secondaryColour'" :primaryColour.sync="primaryColour" :secondaryColour.sync="secondaryColour" :greyColour.sync="greyColour" :grey2Colour.sync="grey2Colour" @setColour="setColour" />
        <label>Title hover</label>
        <css-colours :name="'btn-hover-title'" :defaultColour="'primaryColour'" :primaryColour.sync="primaryColour" :secondaryColour.sync="secondaryColour" :greyColour.sync="greyColour" :grey2Colour.sync="grey2Colour" @setColour="setColour" />
      </div>

      <div class="css-section-title" :class="{ 'active': sectionShowing === 'mobile' }">Mobile</div>
      <div class="css-section-colour" >
        <label>Screen top background</label>
        <css-colours :name="'component-top-background'" :defaultColour="'greyColour'" :primaryColour.sync="primaryColour" :secondaryColour.sync="secondaryColour" :greyColour.sync="greyColour" :grey2Colour.sync="grey2Colour" @setColour="setColour" />
        <label>Nav topbar background</label>
        <css-colours :name="'top-nav'" :defaultColour="'greyColour'" :primaryColour.sync="primaryColour" :secondaryColour.sync="secondaryColour" :greyColour.sync="greyColour" :grey2Colour.sync="grey2Colour" @setColour="setColour" />
        <label>Popup background</label>
        <css-colours :name="'popup-bg'" :defaultColour="'whiteColour'" :primaryColour.sync="primaryColour" :secondaryColour.sync="secondaryColour" :greyColour.sync="greyColour" :grey2Colour.sync="grey2Colour" @setColour="setColour" />
        <label>Divider (mobile, quiz)</label>
        <css-colours :name="'divider'" :defaultColour="'primaryColour'" :primaryColour.sync="primaryColour" :secondaryColour.sync="secondaryColour" :greyColour.sync="greyColour" :grey2Colour.sync="grey2Colour" @setColour="setColour" />
      </div>

      Screens

      <div class="css-section-title" :class="{ 'active': sectionShowing === 'screens' }">Screens</div>
      <div class="css-section-colour" >
        <label>Main screen background</label>
        <css-colours :name="'component-container'" :defaultColour="'whiteColour'" :primaryColour.sync="primaryColour" :secondaryColour.sync="secondaryColour" :greyColour.sync="greyColour" :grey2Colour.sync="grey2Colour" @setColour="setColour" />
        <label>Content background</label>
        <css-colours :name="'content-container'" :defaultColour="'greyColour'" :primaryColour.sync="primaryColour" :secondaryColour.sync="secondaryColour" :greyColour.sync="greyColour" :grey2Colour.sync="grey2Colour" @setColour="setColour" />
        <label>Content background link</label>
        <css-colours :name="'content-container-a'" :defaultColour="'whiteColour'" :primaryColour.sync="primaryColour" :secondaryColour.sync="secondaryColour" :greyColour.sync="greyColour" :grey2Colour.sync="grey2Colour" @setColour="setColour" />
        <label>Content background link hover</label>
        <css-colours :name="'content-container-a-hover'" :defaultColour="'secondaryColour'" :primaryColour.sync="primaryColour" :secondaryColour.sync="secondaryColour" :greyColour.sync="greyColour" :grey2Colour.sync="grey2Colour" @setColour="setColour" />
        <label>Left content background</label>
        <css-colours :name="'content-left-colour'" :defaultColour="'primaryColour'" :primaryColour.sync="primaryColour" :secondaryColour.sync="secondaryColour" :greyColour.sync="greyColour" :grey2Colour.sync="grey2Colour" @setColour="setColour" />
        <label>Left content text</label>
        <css-colours :name="'content-left-text-colour'" :defaultColour="'whiteColour'" :primaryColour.sync="primaryColour" :secondaryColour.sync="secondaryColour" :greyColour.sync="greyColour" :grey2Colour.sync="grey2Colour" @setColour="setColour" />
      </div>

      <div class="css-section-title" :class="{ 'active': sectionShowing === 'selectable' }">Selectables (i.e. intinerary numbers)</div>
      <div class="css-section-colour" >
        <label>Colour</label>
        <css-colours :name="'selectable-colour'" :defaultColour="'primaryColour'" :primaryColour.sync="primaryColour" :secondaryColour.sync="secondaryColour" :greyColour.sync="greyColour" :grey2Colour.sync="grey2Colour" @setColour="setColour" />
        <label>Visited Colour</label>
        <css-colours :name="'selectable-visited'" :defaultColour="'secondaryColour'" :primaryColour.sync="primaryColour" :secondaryColour.sync="secondaryColour" :greyColour.sync="greyColour" :grey2Colour.sync="grey2Colour" @setColour="setColour" />
      </div>

      <div class="css-section-title" :class="{ 'active': sectionShowing === 'progress' }">Progress (carousel, quiz)</div>
      <div class="css-section-colour" >
        <label>Main bar</label>
        <css-colours :name="'progress-bar'" :defaultColour="'primaryColour'" :primaryColour.sync="primaryColour" :secondaryColour.sync="secondaryColour" :greyColour.sync="greyColour" :grey2Colour.sync="grey2Colour" @setColour="setColour" />
        <label>Dot</label>
        <css-colours :name="'progress-dot'" :defaultColour="'whiteColour'" :primaryColour.sync="primaryColour" :secondaryColour.sync="secondaryColour" :greyColour.sync="greyColour" :grey2Colour.sync="grey2Colour" @setColour="setColour" />
        <label>Dot visited</label>
        <css-colours :name="'progress-dot-visited'" :defaultColour="'secondaryColour'" :primaryColour.sync="primaryColour" :secondaryColour.sync="secondaryColour" :greyColour.sync="greyColour" :grey2Colour.sync="grey2Colour" @setColour="setColour" />
      </div>

      <div class="css-section-title" :class="{ 'active': sectionShowing === 'carousel' }">Carousel</div>
      <div class="css-section-colour" >
        <label>Carousel nav</label>
        <css-colours :name="'carousel-nav-bg'" :defaultColour="'secondaryColour'" :primaryColour.sync="primaryColour" :secondaryColour.sync="secondaryColour" :greyColour.sync="greyColour" :grey2Colour.sync="grey2Colour" @setColour="setColour" />
        <label>Carousel nav hover</label>
        <css-colours :name="'carousel-nav-bg-hover'" :defaultColour="'whiteColour'" :primaryColour.sync="primaryColour" :secondaryColour.sync="secondaryColour" :greyColour.sync="greyColour" :grey2Colour.sync="grey2Colour" @setColour="setColour" />
      </div>

      <div class="css-section-title" :class="{ 'active': sectionShowing === 'media' }">Media</div>
      <div class="css-section-colour" >
        <label>Overlay background</label>
        <css-colours :name="'media-overlay-bg'" :defaultColour="'primary'" :primaryColour.sync="primaryColour" :secondaryColour.sync="secondaryColour" :greyColour.sync="greyColour" :grey2Colour.sync="grey2Colour" @setColour="setColour" />
        <label>Overlay text</label>
        <css-colours :name="'media-overlay-body'" :defaultColour="'whiteColour'" :primaryColour.sync="primaryColour" :secondaryColour.sync="secondaryColour" :greyColour.sync="greyColour" :grey2Colour.sync="grey2Colour" @setColour="setColour" />
        <label>Progress background</label>
        <css-colours :name="'media-progress-bg'" :defaultColour="'whiteColour'" :primaryColour.sync="primaryColour" :secondaryColour.sync="secondaryColour" :greyColour.sync="greyColour" :grey2Colour.sync="grey2Colour" @setColour="setColour" />
        <label>Progress fill</label>
        <css-colours :name="'media-progress-fill'" :defaultColour="'secondaryColour'" :primaryColour.sync="primaryColour" :secondaryColour.sync="secondaryColour" :greyColour.sync="greyColour" :grey2Colour.sync="grey2Colour" @setColour="setColour" />
        <!-- <label>Replay title</label>
        <css-colours :name="'media-replay-icon'" :defaultColour="'whiteColour'" :primaryColour.sync="primaryColour" :secondaryColour.sync="secondaryColour" :greyColour.sync="greyColour" :grey2Colour.sync="grey2Colour" @setColour="setColour" /> -->
        <label>Replay title hover</label>
        <css-colours :name="'media-replay-icon-hover'" :defaultColour="'secondaryColour'" :primaryColour.sync="primaryColour" :secondaryColour.sync="secondaryColour" :greyColour.sync="greyColour" :grey2Colour.sync="grey2Colour" @setColour="setColour" />
        <label>Instruction link</label>
        <css-colours :name="'media-a'" :defaultColour="'secondaryColour'" :primaryColour.sync="primaryColour" :secondaryColour.sync="secondaryColour" :greyColour.sync="greyColour" :grey2Colour.sync="grey2Colour" @setColour="setColour" />
        <label>Instruction link hover</label>
        <css-colours :name="'media-a-hover'" :defaultColour="'whiteColour'" :primaryColour.sync="primaryColour" :secondaryColour.sync="secondaryColour" :greyColour.sync="greyColour" :grey2Colour.sync="grey2Colour" @setColour="setColour" />
      </div>

      <div class="css-section-title" :class="{ 'active': sectionShowing === 'textimage' }">Text-Image</div>
      <div class="css-section-colour" >
        <label>Text-only background</label>
        <css-colours :name="'text-only-bg'" :defaultColour="'primaryColour'" :primaryColour.sync="primaryColour" :secondaryColour.sync="secondaryColour" :greyColour.sync="greyColour" :grey2Colour.sync="grey2Colour" @setColour="setColour" />
        <label>Text-only text</label>
        <css-colours :name="'text-only-bg-body'" :defaultColour="'whiteColour'" :primaryColour.sync="primaryColour" :secondaryColour.sync="secondaryColour" :greyColour.sync="greyColour" :grey2Colour.sync="grey2Colour" @setColour="setColour" />
        <label>Text-only link</label>
        <css-colours :name="'text-only-link'" :defaultColour="'whiteColour'" :primaryColour.sync="primaryColour" :secondaryColour.sync="secondaryColour" :greyColour.sync="greyColour" :grey2Colour.sync="grey2Colour" @setColour="setColour" />
        <label>Text-only link hover</label>
        <css-colours :name="'text-only-link-hover'" :defaultColour="'secondaryColour'" :primaryColour.sync="primaryColour" :secondaryColour.sync="secondaryColour" :greyColour.sync="greyColour" :grey2Colour.sync="grey2Colour" @setColour="setColour" />
      </div>

      <div class="css-section-title" :class="{ 'active': sectionShowing === 'quiz' }">Quiz</div>
      <div class="css-section-colour" >
        <!-- <label>Quiz background</label>
        <css-colours :name="'quiz-bg'" :defaultColour="'grey2Colour'" :primaryColour.sync="primaryColour" :secondaryColour.sync="secondaryColour" :greyColour.sync="greyColour" :grey2Colour.sync="grey2Colour" @setColour="setColour" />
        <label>Quiz question background</label>
        <css-colours :name="'quiz-ques-bg'" :defaultColour="'greyColour'" :primaryColour.sync="primaryColour" :secondaryColour.sync="secondaryColour" :greyColour.sync="greyColour" :grey2Colour.sync="grey2Colour" @setColour="setColour" /> -->
        <label>Quiz option background</label>
        <css-colours :name="'quiz-option-bg'" :defaultColour="'whiteColour'" :primaryColour.sync="primaryColour" :secondaryColour.sync="secondaryColour" :greyColour.sync="greyColour" :grey2Colour.sync="grey2Colour" @setColour="setColour" />
        <label>Quiz option text</label>
        <css-colours :name="'quiz-option-body'" :defaultColour="'primaryColour'" :primaryColour.sync="primaryColour" :secondaryColour.sync="secondaryColour" :greyColour.sync="greyColour" :grey2Colour.sync="grey2Colour" @setColour="setColour" />
        <label>Quiz option background selected</label>
        <css-colours :name="'quiz-option-bg-selected'" :defaultColour="'primaryColour'" :primaryColour.sync="primaryColour" :secondaryColour.sync="secondaryColour" :greyColour.sync="greyColour" :grey2Colour.sync="grey2Colour" @setColour="setColour" />
        <label>Quiz option text selected</label>
        <css-colours :name="'quiz-option-body-selected'" :defaultColour="'whiteColour'" :primaryColour.sync="primaryColour" :secondaryColour.sync="secondaryColour" :greyColour.sync="greyColour" :grey2Colour.sync="grey2Colour" @setColour="setColour" />
      </div> 

      <hr/>

      SVGs<br/><i>* for DEV to implement</i>

      <div style='background: #e7e7e7;'>
        <label>Menu: section tick</label>
        <img class="icon" src="~@/assets/images/icons/menu_tick.svg" />
        <css-colours :name="'menu-section-tick'" :defaultColour="'secondaryColour'" :primaryColour.sync="primaryColour" :secondaryColour.sync="secondaryColour" :greyColour.sync="greyColour" :grey2Colour.sync="grey2Colour" @setColour="setColour" />
        
        <label>Tick icon (i.e. checklist)</label>
        <img class="icon" src="~@/assets/images/tick.svg" />
        <css-colours :name="'icon-tick'" :defaultColour="'secondaryColour'" :primaryColour.sync="primaryColour" :secondaryColour.sync="secondaryColour" :greyColour.sync="greyColour" :grey2Colour.sync="grey2Colour" @setColour="setColour" />

        <label>Carousel: next, back icons (main colour)</label>
        <img class="icon" src="~@/assets/images/icons/back_n.svg" /> <img class="icon" src="~@/assets/images/icons/next_n.svg" />
        <css-colours :name="'carousel-btns'" :defaultColour="'primaryColour'" :primaryColour.sync="primaryColour" :secondaryColour.sync="secondaryColour" :greyColour.sync="greyColour" :grey2Colour.sync="grey2Colour" @setColour="setColour" />
      
        <label>Media: replay icon hover</label>
        <img class="icon" src="~@/assets/images/replay_icon_o.svg" /><br/>
        <i>See 'Replay title hover' above</i>
      </div>

      <hr/>
      <button class='print-btn' @click="saveScreenImage()">Save Image <img class="icon" src="~@/assets/images/icons/images-css-btn.svg" /><br/>(current screen)</button>

      <hr/>
      <button class='export-btn' @click="saveColours()">Export Colours <img class="icon" src="~@/assets/images/icons/download-css-btn.svg" /></button>

    </div>

  </div>
</template>

<script lang="ts">

  import { Component, Prop, Vue, Mixins, Watch } from 'vue-property-decorator';

  import CssColours from '@/components/tools/colours.vue';

  import IColours from '@/interfaces/IColours';

  var FileSaver = require('file-saver');
  var HTML2Canvas = require('html2canvas');


  @Component({ 
    components: {
      CssColours
    }
  })

  export default class CSS extends Vue {

    private primaryColourEl: any = null;
    private primaryColourHexEl: any = null;
    private secondaryColourEl: any = null;
    private secondaryColourHexEl: any = null;
    private greyColourEl: any = null;
    private greyColourHexEl: any = null;
    private grey2ColourEl: any = null;
    private grey2ColourHexEl: any = null;
    
    private primaryColour: string = "";
    private secondaryColour: string = "";
    private greyColour: string = "";
    private grey2Colour: string = "";

    private btwMainColour: string = "#E25D22";
    private btwSecondaryColour: string = "#E25D22";
    private btwGreyColour: string = "#cacaca";
    private btwWhiteColour: string = "#ffffff";
    private btwBlackColour: string = "#000000";
    private btwGrey2Colour = "#f2f2f2";

    private sectionShowing: string = "";

    //PRELOADER
    // private btwpreloaderbgcolour: string = this.btwMainColour;
    private btwpreloaderspincolour: string = this.btwMainColour;
    private btwpreloadercolour: string = this.btwSecondaryColour;
    //MENU
    private btwmenuactivecolour: string = this.btwMainColour;
    private btwmenuactivetextcolour: string = this.btwWhiteColour;
    private btwsplittext: string = this.btwSecondaryColour;
    private btwmenuhovertile: string = this.btwSecondaryColour;
    //FONTS / TEXT
    private btwtopictitlecolour: string = this.btwMainColour;
    private btwtitlecolour: string = this.btwBlackColour;
    private btwbodycolour: string = this.btwMainColour;
    private btwlinkcolour: string = this.btwMainColour;
    private btwlinkhovercolour: string = this.btwSecondaryColour;
    //COMPONENTS / SCREENS
    private btwcontainerbackground:string = this.btwWhiteColour;
    private btwbackgroundcolour:string = this.btwGreyColour;
    private btwlinkbackgroundcolour:string = this.btwWhiteColour;
    private btwlinkhoverbackgroundcolour:string = this.btwSecondaryColour;
    ////LEFT CONTENT
    private btwbackgroundsidecolour:string = this.btwMainColour;
    private btwbackgroundsidetextcolour:string = this.btwWhiteColour;
    //SPLASH
    private btwsplashtitlecolour:string = this.btwMainColour;
    //HELP
    // private btwhelpmain: string = this.btwGreyColour;
    //RESOURCES
    // private btwresourcesmain: string = this.btwGreyColour;
    private btwresourceslinkcolour: string = this.btwMainColour;
    private btwresourceslinkhovercolour: string = this.btwWhiteColour;
    private btwresourcesimglinkcolour:string = this.btwWhiteColour;
    private btwresourcesimglinkhovercolour:string = this.btwMainColour;
    private btwresourcesimglinkbordercolour: string = this.btwSecondaryColour;
    private btwresourcesimglinkborderhovercolour: string = this.btwBlackColour;
    //COMPLETE
    // private btwcompletemain: string = this.btwGreyColour;
    //SELECTABLES
    private btwselectable:string = this.btwMainColour;
    private btwselectablevisited: string = this.btwSecondaryColour;
    //PROGRESS
    private btwprogressbar:string = this.btwBlackColour;
    private btwprogressdot:string = this.btwWhiteColour;
    private btwprogressdotvisited: string = this.btwSecondaryColour;
    //POPUP
    private popupbg:string = this.btwWhiteColour;
    //BUTTONS
    private btwbtnbg:string = this.btwMainColour;
    private btwbtncolour:string = this.btwWhiteColour;
    private btwbtnhoverbg: string = this.btwSecondaryColour;
    private btwbtnhovercolour:string = this.btwMainColour;
    //SCROLLBAR
    private scrollbarcolour: string = this.btwSecondaryColour;
    private scrollbarbasecolour:string = this.btwMainColour;
    //MOBILE
    private btwmobiletopcolour:string = this.btwGreyColour;
    private btwmobileheadercolour:string = this.btwGreyColour;
    private btwmobiledividercolour:string = this.btwMainColour;
    //COMPONENTS
    //CAROUSEL
    private btwcourselnavbg: string = this.btwWhiteColour;
    private btwcourselnavhoverbg:string = this.btwBlackColour;
    //MEDIA
    private btwmediaoverlaybgcolour:string = this.btwMainColour;
    private btwmediaoverlaytextcolour:string = this.btwWhiteColour;
    private btwmediaprogressbgcolour:string = this.btwWhiteColour;
    private btwmediaprogressfillcolour:string = this.btwSecondaryColour;
    private btwreplaycolour:string = this.btwWhiteColour;
    private btwreplaycolourhover:string = this.btwSecondaryColour;
    private btwlinkmediacolour:string = this.btwSecondaryColour;
    private btwlinkhovermediacolour:string = this.btwWhiteColour;
    //TEXT-IMAGE
    private btwtextintrobgcolour: string = this.btwMainColour;
    private btwtextintrotextcolour: string = this.btwWhiteColour;
    private btwtextintrolinkcolour: string = this.btwWhiteColour;
    private btwtextintrolinkhovercolour: string = this.btwSecondaryColour;
    //QUIZ
    private btwquizmainbg: string = this.btwGrey2Colour;
    private btwquizbackgroundcolour: string = this.btwGreyColour;
    private btwquizoptionbg: string = this.btwWhiteColour;
    private btwquizoptioncolour: string = this.btwMainColour;
    private btwquizoptionbgselected: string = this.btwMainColour;
    private btwquizoptioncolourselected: string = this.btwWhiteColour;
    //SVGS
    private menusectiontick: string = this.btwSecondaryColour;
    private icontick: string = this.btwSecondaryColour;
    private carouselbtns: string = this.btwMainColour;

    //save images
    private screensavednumber: number = 1;
    //save colours
    private colours: IColours[] = [
        {style: "btwMainColour", var: "primaryColour"}, 
        {style: "btwSecondaryColour", var: "secondaryColour"}, 
        {style: "btwGreyColour", var: "greyColour"}, 
        {style: "btwGrey2Colour", var: "grey2Colour"}, 
        {style: "btwWhiteColour", var: "btwWhiteColour"}, 
        {style: "btwBlackColour", var: "btwBlackColour" }
    ];

    private mounted() {
      this.primaryColourEl = (this.$refs["primaryColour"] as HTMLInputElement);
      this.primaryColourHexEl = (this.$refs["priColourHex"] as HTMLInputElement);
      this.secondaryColourEl = (this.$refs["secondaryColour"] as HTMLInputElement);
      this.secondaryColourHexEl = (this.$refs["secColourHex"] as HTMLInputElement);
      this.greyColourEl = (this.$refs["greyColour"] as HTMLInputElement);
      this.greyColourHexEl = (this.$refs["grColourHex"] as HTMLInputElement);
      this.grey2ColourEl = (this.$refs["grey2Colour"] as HTMLInputElement);
      this.grey2ColourHexEl = (this.$refs["gr2ColourHex"] as HTMLInputElement);

      Vue.nextTick(() => {
        
        this.primaryColourHexEl.defaultValue = this.btwMainColour;
        this.secondaryColourHexEl.defaultValue = this.btwSecondaryColour;
        this.greyColourHexEl.defaultValue = this.btwGreyColour;
        this.grey2ColourHexEl.defaultValue = this.btwGrey2Colour;

        this.primaryColourEl.value = this.btwMainColour;
        this.secondaryColourEl.value = this.btwSecondaryColour;
        this.greyColourEl.value = this.btwGreyColour;
        this.grey2ColourEl.value = this.btwGrey2Colour;

        this.saveCSS();

      });
    }

    private setColour(_values: any) {
      switch(_values._name) {
        //preloader
        // case 'preloader-bg-colour':
        //   this.btwpreloaderbgcolour = _values._hex;
        //   break;
        case 'preloader-spin-colour':
          this.btwpreloaderspincolour = _values._hex;
          break;
        case 'preloader-colour':
          this.btwpreloadercolour = _values._hex;
          break;
        //menu
        case 'menu-active':
          this.btwmenuactivecolour = _values._hex;
          break;
        case 'menu-active-text':
          this.btwmenuactivetextcolour = _values._hex;
          break;
        case 'split-text':
          this.btwsplittext = _values._hex;
          break;
        case 'menu-hover':
          this.btwmenuhovertile = _values._hex;
          break;
        //fonts/text
        case 'topic-title':
          this.btwtopictitlecolour = _values._hex;
          break;
        case 'title-colour':
          this.btwtitlecolour = _values._hex;
          break;
        case 'body-colour':
          this.btwbodycolour = _values._hex;
          break;
        case 'body-link':
          this.btwlinkcolour = _values._hex;
          break;
        case 'body-link-hover':
          this.btwlinkhovercolour = _values._hex;
          break;
        //components/screens
        case 'component-container':
          this.btwcontainerbackground = _values._hex;
          break;
        case 'content-container':
          this.btwbackgroundcolour = _values._hex;
          break;
        case 'content-container-a':
          this.btwlinkbackgroundcolour = _values._hex;
          break;
        case 'content-container-a-hover':
          this.btwlinkhoverbackgroundcolour = _values._hex;
          break;
        ////left content
        case 'content-left-colour':
          this.btwbackgroundsidecolour = _values._hex;
          break;
        case 'content-left-text-colour':
          this.btwbackgroundsidetextcolour = _values._hex;
          break;
        //splash
        case 'splash-title':
          this.btwsplashtitlecolour = _values._hex;
          break;
        //help
        // case 'help-bg':
        //   this.btwhelpmain = _values._hex;
        //   break;
        //resources
        // case 'resource-bg':
        //   this.btwresourcesmain = _values._hex;
        //   break;
        case 'resource-link':
          this.btwresourceslinkcolour = _values._hex;
          break;
        case 'resource-link-hover':
          this.btwresourceslinkhovercolour = _values._hex;
          break;
        case 'resource-img-link':
          this.btwresourcesimglinkcolour = _values._hex;
          break;
        case 'resource-img-link-hover':
          this.btwresourcesimglinkhovercolour = _values._hex;
          break;
        case 'resource-img-border':
          this.btwresourcesimglinkbordercolour = _values._hex;
          break;
        case 'resource-img-border-hover':
          this.btwresourcesimglinkborderhovercolour = _values._hex;
          break;
        //complete
        // case 'complete-bg':
        //   this.btwcompletemain = _values._hex;
        //   break;
        //selectables
        case 'selectable-colour':
          this.btwselectable = _values._hex;
          break;
        case 'selectable-visited':
          this.btwselectablevisited = _values._hex;
          break;
        //progress
        case 'progress-bar':
          this.btwprogressbar = _values._hex;
          break;
        case 'progress-dot':
          this.btwprogressdot = _values._hex;
          break;
        case 'progress-dot-visited':
          this.btwprogressdotvisited = _values._hex;
          break;
        //popup
        case 'popup-bg':
          this.popupbg = _values._hex;
          break;
        //buttons
        case 'btn-bg':
          this.btwbtnbg = _values._hex;
          break;
        case 'btn-title':
          this.btwbtncolour = _values._hex;
          break;
        case 'btn-hover-bg':
          this.btwbtnhoverbg = _values._hex;
          break;
        case 'btn-hover-title':
          this.btwbtnhovercolour = _values._hex;
          break;
        //mobile
        case 'component-top-background':
          this.btwmobiletopcolour = _values._hex;
          break;
        case 'top-nav':
          this.btwmobileheadercolour = _values._hex;
          break;
        case 'divider':
          this.btwmobiledividercolour = _values._hex;
          break;
        //COMPONENTS
        //carousel
        case 'carousel-nav-bg':
          this.btwcourselnavbg = _values._hex;
          break;
        case 'carousel-nav-bg-hover':
          this.btwcourselnavhoverbg = _values._hex;
          break;
        //media
        case 'media-overlay-bg':
          this.btwmediaoverlaybgcolour = _values._hex;
          break;
        case 'media-overlay-body':
          this.btwmediaoverlaytextcolour = _values._hex;
          break;
        case 'media-progress-bg':
          this.btwmediaprogressbgcolour = _values._hex;
          break;
        case 'media-progress-fill':
          this.btwmediaprogressfillcolour = _values._hex;
          break;
        case 'media-replay-icon':
          this.btwreplaycolour = _values._hex;
          break;
        case 'media-replay-icon-hover':
          this.btwreplaycolourhover = _values._hex;
          break;
        case 'media-a':
          this.btwlinkmediacolour = _values._hex;
          break;
        case 'media-a-hover':
          this.btwlinkhovermediacolour = _values._hex;
          break;
        //text-image
        case 'text-only-bg':
          this.btwtextintrobgcolour = _values._hex;
          break;
        case 'text-only-bg-body':
          this.btwtextintrotextcolour = _values._hex;
          break;
        case 'text-only-link':
          this.btwtextintrolinkcolour = _values._hex;
          break;
        case 'text-only-link-hover':
          this.btwtextintrolinkhovercolour = _values._hex;
          break;
        //quiz
        // case 'quiz-bg':
        //   this.btwquizmainbg = _values._hex;
        //   break;
        // case 'quiz-ques-bg':
        //   this.btwquizbackgroundcolour = _values._hex;
        //   break;
        case 'quiz-option-bg':
          this.btwquizoptionbg = _values._hex;
          break;
        case 'quiz-option-body':
          this.btwquizoptioncolour = _values._hex;
          break;
        case 'quiz-option-bg-selected':
          this.btwquizoptionbgselected = _values._hex;
          break;
        case 'quiz-option-body-selected':
          this.btwquizoptioncolourselected = _values._hex;
          break;
        //SVGS
        case 'menu-section-tick':
          this.menusectiontick = _values._hex;
          break;
        case 'icon-tick':
          this.icontick = _values._hex;
          break;
        case 'carousel-btns':
          this.carouselbtns = _values._hex;
          break;

      }
      this.saveCSS();
    }

    private updateColours() {
        //console.log(this.primaryColourEl.value);
        // this.primaryColourHexEl.value = this.primaryColourEl.value;
        // this.secondaryColourHexEl.value = this.secondaryColourEl.value;
        // this.greyColourHexEl.value = this.greyColourEl.value;
        
        //this.saveCSS();
    }

    private getColourVar (_hex: string) {
      let styleName = '';
      this.colours.forEach((col: IColours, index: number) => {
        //console.log(_hex, this.$data[col.var]);
        if(_hex === this.$data[col.var]) {
          styleName = col.style;
        }
      });
      return styleName;
    }

    private saveColours() {

        let $colStr = "\\\\\\---- Preloader.vue ----\\\\\\\n\n";
        $colStr += "const btwMainColour = '" + this.primaryColour + "';\n";
        $colStr += "const btwSecondaryColour = '" + this.secondaryColour + "';\n";
        $colStr += "const btwGreyColour = '" + this.greyColour + "';\n";
        $colStr += "const btwGrey2Colour = '" + this.grey2Colour + "';\n";

        $colStr += "\ndocument.documentElement.style.setProperty('--primary', `${btwMainColour}`);\n";
        $colStr += "document.documentElement.style.setProperty('--secondary', `${btwSecondaryColour}`);\n";
        $colStr += "document.documentElement.style.setProperty('--grey', `${btwGreyColour}`);\n";
        $colStr += "document.documentElement.style.setProperty('--grey2', `${btwGrey2Colour}`);\n";

        $colStr += "\n//preloader\n";
        $colStr += "// document.documentElement.style.setProperty('--btwpreloaderbgcolour', `${btwWhiteColour}`);\n";
        $colStr += "document.documentElement.style.setProperty('--btwpreloaderspincolour', `${" + this.getColourVar(this.btwpreloaderspincolour) + "}`);\n";
        $colStr += "document.documentElement.style.setProperty('--btwpreloadercolour', `${" + this.getColourVar(this.btwpreloadercolour) + "}`);\n";
        $colStr += "\n//menu\n";
        $colStr += "document.documentElement.style.setProperty('--btwmenuactivecolour', `${" + this.getColourVar(this.btwmenuactivecolour) + "}`);\n";
        $colStr += "document.documentElement.style.setProperty('--btwmenuactivetextcolour', `${" + this.getColourVar(this.btwmenuactivetextcolour) + "}`);\n";
        $colStr += "document.documentElement.style.setProperty('--btwmenuhovertile', `${" + this.getColourVar(this.btwmenuhovertile) + "}`);\n";
        $colStr += "// document.documentElement.style.setProperty('--btwsplittextmain', `${btwMainColour}`);\n";
        $colStr += "document.documentElement.style.setProperty('--btwsplittext', `${" + this.getColourVar(this.btwsplittext) + "}`);\n";
        $colStr += "// document.documentElement.style.setProperty('--highlight', `${btwBlackColour}`);\n";
        $colStr += "//fonts/text\n";
        $colStr += "document.documentElement.style.setProperty('--btwtopictitlecolour', `${" + this.getColourVar(this.btwtopictitlecolour) + "}`);\n";
        $colStr += "document.documentElement.style.setProperty('--btwtitlecolour', `${" + this.getColourVar(this.btwtitlecolour) + "}`);\n";
        $colStr += "document.documentElement.style.setProperty('--btwbodycolour', `${" + this.getColourVar(this.btwbodycolour) + "}`);\n";
        $colStr += "document.documentElement.style.setProperty('--btwlinkcolour', `${" + this.getColourVar(this.btwlinkcolour) + "}`);\n";
        $colStr += "document.documentElement.style.setProperty('--btwlinkhovercolour', `${" + this.getColourVar(this.btwlinkhovercolour) + "}`);\n";
        $colStr += "//components/screens\n";
        $colStr += "document.documentElement.style.setProperty('--btwcontainerbackground', `${" + this.getColourVar(this.btwcontainerbackground) + "}`);\n";
        $colStr += "document.documentElement.style.setProperty('--btwbackgroundcolour', `${" + this.getColourVar(this.btwbackgroundcolour) + "}`);\n";
        $colStr += "document.documentElement.style.setProperty('--btwlinkbackgroundcolour', `${" + this.getColourVar(this.btwlinkbackgroundcolour) + "}`);\n";
        $colStr += "document.documentElement.style.setProperty('--btwlinkhoverbackgroundcolour', `${" + this.getColourVar(this.btwlinkhoverbackgroundcolour) + "}`);\n";
        $colStr += "////left content\n";
        $colStr += "document.documentElement.style.setProperty('--btwbackgroundsidecolour', `${" + this.getColourVar(this.btwbackgroundsidecolour) + "}`);\n";
        $colStr += "document.documentElement.style.setProperty('--btwbackgroundsidetextcolour', `${" + this.getColourVar(this.btwbackgroundsidetextcolour) + "}`);\n";
        $colStr += "//splash\n";
        $colStr += "document.documentElement.style.setProperty('--btwsplashtitlecolour', `${" + this.getColourVar(this.btwsplashtitlecolour) + "}`);\n";
        $colStr += "//resources\n";
        $colStr += "// document.documentElement.style.setProperty('--btwresourcesmain', `${btwGreyColour}`);\n";
        $colStr += "document.documentElement.style.setProperty('--btwresourceslinkcolour', `${" + this.getColourVar(this.btwresourceslinkcolour) + "}`);\n";
        $colStr += "document.documentElement.style.setProperty('--btwresourceslinkhovercolour', `${" + this.getColourVar(this.btwresourceslinkhovercolour) + "}`);\n";
        $colStr += "document.documentElement.style.setProperty('--btwresourcesimglinkcolour', `${" + this.getColourVar(this.btwresourcesimglinkcolour) + "}`);\n";
        $colStr += "document.documentElement.style.setProperty('--btwresourcesimglinkhovercolour', `${" + this.getColourVar(this.btwresourcesimglinkhovercolour) + "}`);\n";
        $colStr += "document.documentElement.style.setProperty('--btwresourcesimglinkbordercolour', `${" + this.getColourVar(this.btwresourcesimglinkbordercolour) + "}`);\n";
        $colStr += "document.documentElement.style.setProperty('--btwresourcesimglinkborderhovercolour', `${" + this.getColourVar(this.btwresourcesimglinkborderhovercolour) + "}`);\n";
        $colStr += "//complete\n";
        $colStr += "// document.documentElement.style.setProperty('--btwcompletemain', `${btwGreyColour}`);\n";
        $colStr += "//selectables\n";
        $colStr += "document.documentElement.style.setProperty('--btwselectable', `${" + this.getColourVar(this.btwselectable) + "}`);\n";
        $colStr += "document.documentElement.style.setProperty('--btwselectablevisited', `${" + this.getColourVar(this.btwselectablevisited) + "}`);\n";
        $colStr += "//progress\n";
        $colStr += "document.documentElement.style.setProperty('--btwprogressbar', `${" + this.getColourVar(this.btwprogressbar) + "}`); //alpha\n";
        $colStr += "document.documentElement.style.setProperty('--btwprogressdot', `${" + this.getColourVar(this.btwprogressdot) + "}`);\n";
        $colStr += "document.documentElement.style.setProperty('--btwprogressdotvisited', `${" + this.getColourVar(this.btwprogressdotvisited) + "}`);\n";
        $colStr += "//popup\n";
        $colStr += "document.documentElement.style.setProperty('--popupbg', `${" + this.getColourVar(this.popupbg) + "}`);\n";
        $colStr += "//buttons\n";
        $colStr += "document.documentElement.style.setProperty('--btwbtnbg', `${" + this.getColourVar(this.btwbtnbg) + "}`);\n";
        $colStr += "document.documentElement.style.setProperty('--btwbtncolour', `${" + this.getColourVar(this.btwbtncolour) + "}`);\n";
        $colStr += "document.documentElement.style.setProperty('--btwbtnhoverbg', `${" + this.getColourVar(this.btwbtnhoverbg) + "}`);\n";
        $colStr += "document.documentElement.style.setProperty('--btwbtnhovercolour', `${" + this.getColourVar(this.btwbtnhovercolour) + "}`);\n";
        $colStr += "//scrollbar\n";
        $colStr += "// document.documentElement.style.setProperty('--scrollbarcolour', `${btwSecondaryColour}`);\n";
        $colStr += "// document.documentElement.style.setProperty('--scrollbarbasecolour', `${btwMainColour}`);\n";
        $colStr += "//mobile\n";
        $colStr += "document.documentElement.style.setProperty('--btwmobiletopcolour', `${" + this.getColourVar(this.btwmobiletopcolour) + "}`);\n";
        $colStr += "document.documentElement.style.setProperty('--btwmobileheadercolour', `${" + this.getColourVar(this.btwmobileheadercolour) + "}`);\n";
        $colStr += "document.documentElement.style.setProperty('--btwmobiledividercolour', `${" + this.getColourVar(this.btwmobiledividercolour) + "}`);\n";
        $colStr += "//COMPONENTS\n";
        $colStr += "//carousel\n";
        $colStr += "document.documentElement.style.setProperty('--btwcourselnavbg', `${" + this.getColourVar(this.btwcourselnavbg) + "}`);\n";
        $colStr += "document.documentElement.style.setProperty('--btwcourselnavhoverbg', `${" + this.getColourVar(this.btwcourselnavhoverbg) + "}`);\n";
        $colStr += "//media\n";
        $colStr += "document.documentElement.style.setProperty('--btwmediaoverlaybgcolour', `${" + this.getColourVar(this.btwmediaoverlaybgcolour) + "}`); //alpha\n";
        $colStr += "document.documentElement.style.setProperty('--btwmediaoverlaytextcolour', `${" + this.getColourVar(this.btwmediaoverlaytextcolour) + "}`);\n";
        $colStr += "document.documentElement.style.setProperty('--btwmediaprogressbgcolour', `${" + this.getColourVar(this.btwmediaprogressbgcolour) + "}`);\n";
        $colStr += "document.documentElement.style.setProperty('--btwmediaprogressfillcolour', `${" + this.getColourVar(this.btwmediaprogressfillcolour) + "}`);\n";
        $colStr += "document.documentElement.style.setProperty('--btwreplaycolour', `${" + this.getColourVar(this.btwreplaycolour) + "}`);\n";
        $colStr += "document.documentElement.style.setProperty('--btwreplaycolourhover', `${" + this.getColourVar(this.btwreplaycolourhover) + "}`);\n";
        $colStr += "document.documentElement.style.setProperty('--btwlinkmediacolour', `${" + this.getColourVar(this.btwlinkmediacolour) + "}`);\n";
        $colStr += "document.documentElement.style.setProperty('--btwlinkhovermediacolour', `${" + this.getColourVar(this.btwlinkhovermediacolour) + "}`);\n";
        $colStr += "//text-image\n";
        $colStr += "document.documentElement.style.setProperty('--btwtextintrobgcolour', `${" + this.getColourVar(this.btwtextintrobgcolour) + "}`);\n";
        $colStr += "document.documentElement.style.setProperty('--btwtextintrotextcolour', `${" + this.getColourVar(this.btwtextintrotextcolour) + "}`);\n";
        $colStr += "document.documentElement.style.setProperty('--btwtextintrolinkcolour', `${" + this.getColourVar(this.btwtextintrolinkcolour) + "}`);\n";
        $colStr += "document.documentElement.style.setProperty('--btwtextintrolinkhovercolour', `${" + this.getColourVar(this.btwtextintrolinkhovercolour) + "}`);\n";
        $colStr += "//quiz\n";
        $colStr += "// document.documentElement.style.setProperty('--btwquizmainbg', `${btwGrey2Colour}`);\n";
        $colStr += "// document.documentElement.style.setProperty('--btwquizbackgroundcolour', `${btwGreyColour}`);\n";
        $colStr += "document.documentElement.style.setProperty('--btwquizoptionbg', `${" + this.getColourVar(this.btwquizoptionbg) + "}`);\n";
        $colStr += "document.documentElement.style.setProperty('--btwquizoptioncolour', `${" + this.getColourVar(this.btwquizoptioncolour) + "}`);\n";
        $colStr += "document.documentElement.style.setProperty('--btwquizoptionbgselected', `${" + this.getColourVar(this.btwquizoptionbgselected) + "}`);\n";
        $colStr += "document.documentElement.style.setProperty('--btwquizoptioncolourselected', `${" + this.getColourVar(this.btwquizoptioncolourselected) + "}`);\n";

        $colStr += "\n\n\\\\\\---- colours.css ----\\\\\\\n\n";
        $colStr += "$btw-secondary-colour-forRGBA: " + this.secondaryColour + ";\n";

        $colStr += "\n\n\\\\\\---- SVGS ----\\\\\\\n\n";
        $colStr += "Menu: section tick \nassets/images/icons/menu_tick.svg \n" + this.menusectiontick + "\n";
        $colStr += "\nTick icon (i.e. checklist) \nassets/images/tick.svg \n" + this.icontick + "\n";
        $colStr += "\nCarousel: next, back icons (main colour) \nassets/images/icons/back_n.svg, assets/images/icons/next_n.svg \n" + this.carouselbtns + "\n";
        $colStr += "\nMedia: replay icon hover \nassets/images/replay_icon_o.svg \n" + this.btwreplaycolourhover + "\n";

        var blob = new Blob([$colStr], {type: "text/plain;charset=utf-8"});
        FileSaver.saveAs(blob, "btw-colours.txt");
    }

    private saveScreenImage() {
      let $el = ".main-container"; //"#horizontal";

      //remove transitions from elements
      var divs = document.getElementsByTagName('div'); 
      for(var i = 0; i < divs.length; i++) {
        divs[i].style.animation = 'none';
      }
      var paras = document.getElementsByTagName('p'); 
      for(var j = 0; j < paras.length; j++) {
        paras[j].style.opacity = '1';
        paras[j].style.animation = 'none';
      }
      var lists = document.getElementsByTagName('ul'); 
      for(var k = 0; k < lists.length; k++) {
        lists[k].style.opacity = '1';
        lists[k].style.animation = 'none';
      }
      var listitems = document.getElementsByTagName('li'); 
      for(var l = 0; l < listitems.length; l++) {
        listitems[l].style.opacity = '1';
        listitems[l].style.animation = 'none';
      }

      //reset images (esp svgs!)
      var svgElements = document.body.querySelectorAll('img');
      svgElements.forEach(function(item) {
          item.setAttribute("width", "auto");
          item.setAttribute("height","" + item.getBoundingClientRect().height + "px");
      });

      //save to an image
      HTML2Canvas(document.querySelector($el), {scale:1, allowTaint: true}).then((canvas: any) => {
        canvas.toBlob((blob: any) => {
          FileSaver.saveAs(blob, 'screen' + this.screensavednumber + '.jpg');
          this.screensavednumber++;
        });
      }).finally(() => {
        //
      });

    }

    private resetCSS() {
      this.primaryColourHexEl.defaultValue = this.btwMainColour;
      this.secondaryColourHexEl.defaultValue = this.btwSecondaryColour;
      this.greyColourHexEl.defaultValue = this.btwGreyColour;
      this.grey2ColourHexEl.defaultValue = this.btwGrey2Colour;

      this.primaryColourEl.value = this.btwMainColour;
      this.secondaryColourEl.value = this.btwSecondaryColour;
      this.greyColourEl.value = this.btwGreyColour;
      this.grey2ColourEl.value = this.btwGrey2Colour;

      this.saveCSS();
    }

    private saveCSS() {
      this.primaryColour = this.primaryColourEl.value;
      this.secondaryColour = this.secondaryColourEl.value;
      this.greyColour = this.greyColourEl.value;
      this.grey2Colour = this.grey2ColourEl.value;

      this.primaryColourHexEl.value = this.primaryColourEl.value;
      this.secondaryColourHexEl.value = this.secondaryColourEl.value;
      this.greyColourHexEl.value = this.greyColourEl.value;
      this.grey2ColourHexEl.value = this.grey2ColourEl.value;

      document.documentElement.style.setProperty('--primary', `${this.primaryColour}`);
      document.documentElement.style.setProperty('--secondary', `${this.secondaryColour}`);
      document.documentElement.style.setProperty('--grey', `${this.greyColour}`);
      document.documentElement.style.setProperty('--grey2', `${this.grey2Colour}`);

      //preloader
      // document.documentElement.style.setProperty('--btwpreloaderbgcolour', `${this.btwpreloaderbgcolour}`);
      document.documentElement.style.setProperty('--btwpreloaderspincolour', `${this.btwpreloaderspincolour}`);
      document.documentElement.style.setProperty('--btwpreloadercolour', `${this.btwpreloadercolour}`);
      //menu
      document.documentElement.style.setProperty('--btwmenuactivecolour', `${this.btwmenuactivecolour}`);
      document.documentElement.style.setProperty('--btwmenuactivetextcolour', `${this.btwmenuactivetextcolour}`);
      document.documentElement.style.setProperty('--btwmenuhovertile', `${this.btwmenuhovertile}`);
        // document.documentElement.style.setProperty('--btwsplittextmain', `${btwMainColour}`);
      document.documentElement.style.setProperty('--btwsplittext', `${this.btwsplittext}`);
        // document.documentElement.style.setProperty('--highlight', `${btwBlackColour}`);
      //fonts/text
      document.documentElement.style.setProperty('--btwtopictitlecolour', `${this.btwtopictitlecolour}`);
      document.documentElement.style.setProperty('--btwtitlecolour', `${this.btwtitlecolour}`);
      document.documentElement.style.setProperty('--btwbodycolour', `${this.btwbodycolour}`);
      document.documentElement.style.setProperty('--btwlinkcolour', `${this.btwlinkcolour}`);
      document.documentElement.style.setProperty('--btwlinkhovercolour', `${this.btwlinkhovercolour}`);
      //components/screens
      document.documentElement.style.setProperty('--btwcontainerbackground', `${this.btwcontainerbackground}`);
      document.documentElement.style.setProperty('--btwbackgroundcolour', `${this.btwbackgroundcolour}`);
      document.documentElement.style.setProperty('--btwlinkbackgroundcolour', `${this.btwlinkbackgroundcolour}`);
      document.documentElement.style.setProperty('--btwlinkhoverbackgroundcolour', `${this.btwlinkhoverbackgroundcolour}`); 
      ////left content
      document.documentElement.style.setProperty('--btwbackgroundsidecolour', `${this.btwbackgroundsidecolour}`);
      document.documentElement.style.setProperty('--btwbackgroundsidetextcolour', `${this.btwbackgroundsidetextcolour}`);
      //splash
      document.documentElement.style.setProperty('--btwsplashtitlecolour', `${this.btwsplashtitlecolour}`);
      //help
      // document.documentElement.style.setProperty('--btwhelpmain', `${this.btwhelpmain}`);
      //resources
      // document.documentElement.style.setProperty('--btwresourcesmain', `${this.btwresourcesmain}`);
      document.documentElement.style.setProperty('--btwresourceslinkcolour', `${this.btwresourceslinkcolour}`);
      document.documentElement.style.setProperty('--btwresourceslinkhovercolour', `${this.btwresourceslinkhovercolour}`);
      document.documentElement.style.setProperty('--btwresourcesimglinkcolour', `${this.btwresourcesimglinkcolour}`);
      document.documentElement.style.setProperty('--btwresourcesimglinkhovercolour', `${this.btwresourcesimglinkhovercolour}`);
      document.documentElement.style.setProperty('--btwresourcesimglinkbordercolour', `${this.btwresourcesimglinkbordercolour}`);
      document.documentElement.style.setProperty('--btwresourcesimglinkborderhovercolour', `${this.btwresourcesimglinkborderhovercolour}`);
      //complete
      // document.documentElement.style.setProperty('--btwcompletemain', `${this.btwcompletemain}`);
      //selectables
      document.documentElement.style.setProperty('--btwselectable', `${this.btwselectable}`);
      document.documentElement.style.setProperty('--btwselectablevisited', `${this.btwselectablevisited}`);
      //progress
      document.documentElement.style.setProperty('--btwprogressbar', `${this.btwprogressbar}`); //alpha
      document.documentElement.style.setProperty('--btwprogressdot', `${this.btwprogressdot}`);
      document.documentElement.style.setProperty('--btwprogressdotvisited', `${this.btwprogressdotvisited}`);
      //popup
      document.documentElement.style.setProperty('--popupbg', `${this.popupbg}`);
      //buttons
      document.documentElement.style.setProperty('--btwbtnbg', `${this.btwbtnbg}`);
      document.documentElement.style.setProperty('--btwbtncolour', `${this.btwbtncolour}`);
      document.documentElement.style.setProperty('--btwbtnhoverbg', `${this.btwbtnhoverbg}`);
      document.documentElement.style.setProperty('--btwbtnhovercolour', `${this.btwbtnhovercolour}`);
      //scrollbar
        // document.documentElement.style.setProperty('--scrollbarcolour', `${scrollbarcolour}`);
        // document.documentElement.style.setProperty('--scrollbarbasecolour', `${scrollbarbasecolour}`);
      //mobile
      document.documentElement.style.setProperty('--btwmobiletopcolour', `${this.btwmobiletopcolour}`);
      document.documentElement.style.setProperty('--btwmobileheadercolour', `${this.btwmobileheadercolour}`);
      document.documentElement.style.setProperty('--btwmobiledividercolour', `${this.btwmobiledividercolour}`);
      //COMPONENTS
      //carousel
      document.documentElement.style.setProperty('--btwcourselnavbg', `${this.btwcourselnavbg}`);
      document.documentElement.style.setProperty('--btwcourselnavhoverbg', `${this.btwcourselnavhoverbg}`);
      //media
      document.documentElement.style.setProperty('--btwmediaoverlaybgcolour', `${this.btwmediaoverlaybgcolour}`); //alpha
      document.documentElement.style.setProperty('--btwmediaoverlaytextcolour', `${this.btwmediaoverlaytextcolour}`);
      document.documentElement.style.setProperty('--btwmediaprogressbgcolour', `${this.btwmediaprogressbgcolour}`);
      document.documentElement.style.setProperty('--btwmediaprogressfillcolour', `${this.btwmediaprogressfillcolour}`);
      document.documentElement.style.setProperty('--btwreplaycolour', `${this.btwreplaycolour}`);
      document.documentElement.style.setProperty('--btwreplaycolourhover', `${this.btwreplaycolourhover}`);
      document.documentElement.style.setProperty('--btwlinkmediacolour', `${this.btwlinkmediacolour}`);
      document.documentElement.style.setProperty('--btwlinkhovermediacolour', `${this.btwlinkhovermediacolour}`);
      //text-image
      document.documentElement.style.setProperty('--btwtextintrobgcolour', `${this.btwtextintrobgcolour}`);
      document.documentElement.style.setProperty('--btwtextintrotextcolour', `${this.btwtextintrotextcolour}`);
      document.documentElement.style.setProperty('--btwtextintrolinkcolour', `${this.btwtextintrolinkcolour}`);
      document.documentElement.style.setProperty('--btwtextintrolinkhovercolour', `${this.btwtextintrolinkhovercolour}`);
      //quiz
      // document.documentElement.style.setProperty('--btwquizmainbg', `${this.btwquizmainbg}`);
      // document.documentElement.style.setProperty('--btwquizbackgroundcolour', `${this.btwquizbackgroundcolour}`);
      document.documentElement.style.setProperty('--btwquizoptionbg', `${this.btwquizoptionbg}`);
      document.documentElement.style.setProperty('--btwquizoptioncolour', `${this.btwquizoptioncolour}`);
      document.documentElement.style.setProperty('--btwquizoptionbgselected', `${this.btwquizoptionbgselected}`);
      document.documentElement.style.setProperty('--btwquizoptioncolourselected', `${this.btwquizoptioncolourselected}`);
      
    }

  }

</script>

<style scoped lang="scss">
  
  @import "../../style/global.scss";

.css {
  width: 16rem;
  max-width: 16rem;
  height: 100vh;
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  
  border-left: 1px solid $black;
  background: $white;

  z-index: 0;

  overflow: hidden;
  overflow-y: auto;

  hr {
    margin: 0.5rem auto!important;
  }
  
  input {
    margin-bottom: 0rem;
  }

  .css-container {
    position: absolute;
    bottom:0;
    right:0;
    width: auto;
    height: auto;
    z-index: 5000;
    max-width: 100%;
    max-height: 95vh;
    overflow: hidden;
    overflow-y: auto;

    z-index: 5000;
  }

  .values {
    padding: 0 1rem;
    justify-content: flex-end;
  }

  .colour {
    width: 3rem;
    padding: 0;
    margin-right: 1rem;
  }

  .hex {
    width: 6rem;
  }

  button {
    background-color: $black;
    color: $white;
    padding: 1rem;
    margin: 0.5rem 0.25rem;
    text-align: left;

    cursor: pointer;

    &:hover {
      background-color: #333;
    }
  }

  .export-btn, .print-btn {
    background-color: purple;
    color: $white;

    &:hover {
      background-color: $black;
    }

    .icon {
      width: 1.25rem;
      height: 1.25rem;
    }
  }



  /*sections */

  .css-section-title {
    background-color: $black;
    color: $white;
    position: relative;
    cursor: pointer;
    padding: 0.5rem;
    text-align: left;
    margin-bottom: 2px;

    &.active {
      background-color: #999;
      color: $black;
      border: 1px solid $black;
    }
  }

  .css-section-colour {
    margin-bottom: 0.5rem;
  }

}


</style>