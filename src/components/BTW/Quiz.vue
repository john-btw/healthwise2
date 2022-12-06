<template>
  <div class="quiz grid-x container"
      v-observe-visibility="{ callback: visibilityChanged, throttle: 100, intersection: { threshold: 0.8 }, once: false }"
        :class="{ 'visible': true }" 
        @scroll="reset"
        role="region" level="1" >

    <div class="quiz-fade" />

    <div class="quiz-container component-container flexbox flexbox-align-stretch flexbox-justify-stretch">
       
        <img :key="getImage()" :src="getImage()" :aria-label="getImageAlt()" v-if="getImage() !== ' '" v-show="!$data._showQuizSummary" :aria-hidden="getImageAlt() === ' ' ? true : false" >
        
        <div class="quiz-title component-header" role="heading" level="2">
            <h1 ref="accessibility" class="accessibility-region" tabindex="-1">{{getScreenAriaContent()}}</h1>
            <div class="quiz-header-title">
                <h4 class="main-title flexbox flexbox-align-start flexbox-justify-start" v-html="getMainTitle()" />
                <img class="quiz-header-logo" src="~@/assets/images/logo.png" aria-hidden="true" />
            </div>
        </div>
        
        <!-- <img class="quiz-icon" src='~@/assets/images/icons/quiz_icon.png' /> -->
        
        <div class="quiz-top" ref="quiz" id="quiz">

            <!-- INTRO -->
            <div :key="'intro'+$data._quesIndex" class="quiz-top-content flexbox flexbox-align-stretch flexbox-justify-stretch" v-if="!$data._quizAttemptsReached">
                <div class="quiz-main-content flexbox flexbox-column flexbox-align-start flexbox-justify-start" >
                    <div class="quiz-core flexbox flexbox-row">
                        <div class="quiz-core-content flexbox flexbox-column flexbox-align-start flexbox-justify-center" >
                            <h4 v-if="element.content.title" v-html="element.content.title" />
                            <div v-html="getIntroContent()" />
                            <button class="quiz-start-button" @click="restartQuizPassed" 
                            v-if="this.$store.state.assessPassed === true && $data._restartSelected === false && $data._quizComplete === false"
                            role="button" tabindex="0"
                            :aria-label="element.content.startBtn" >
                                {{element.content.startBtn}}
                            </button>
                        </div>
                    </div>
                    
                </div>
            </div>
            <!-- ATTEMPTS REACHED -->
            <div :key="'intro'+$data._quesIndex" class="quiz-top-content flexbox flexbox-align-stretch flexbox-justify-stretch" v-if="$data._quizAttemptsReached">
                <div class="quiz-main-content flexbox flexbox-column flexbox-align-start flexbox-justify-start" >
                    <div class="quiz-core flexbox flexbox-row">
                        <div class="quiz-core-content flexbox flexbox-column flexbox-align-start flexbox-justify-center" >
                            <h4 v-if="element.content.title" v-html="element.content.title" />
                            <div v-html="getAttemptsReachedText()" />
                        </div>
                    </div>
                    
                </div>
            </div>
            <!-- QUESTIONS -->
            <div class="quiz-question" v-for="(ques, i) in element.content.questions" :key="i" >
                <div class="quiz-top-content flexbox flexbox-align-stretch flexbox-justify-stretch" v-if="$data._quesIndex >= i">
                    <div class="section-break"></div>
                    <div class="quiz-main-content flexbox flexbox-column flexbox-align-start flexbox-justify-start" >                   
                        <div class="quiz-core flexbox flexbox-row">
                            <div class="quiz-core-content flexbox flexbox-column flexbox-align-start flexbox-justify-center" >
                                <div class="question-stem flexbox flexbox-justify-end" v-html="ques.stem" />
                                <div class="question-ins flexbox flexbox-justify-end" v-html="element.content.quesIns" v-if="element.content.quesIns"/>
                                <div class="question-options flexbox flexbox-column">
                                    <button class="question-option flexbox flexbox-justify-center flexbox-align-center" 
                                    v-for="(opt, index) in ques.options" 
                                    :key="index" @click="selectAnswer(i, index)" 
                                    :disabled="$data._quizComplete ? true : false || $data._quesAnsweredIndex > i || $data._quizComplete === true"
                                    role="button" tabindex="0"
                                    :aria-label="opt.title"
                                    :class="{ 'selected': $data.questionAnswers[i] === index, 'disabled': ($data._quesAnsweredIndex > i || $data._quizComplete === true) }" >
                                        {{ opt.title }}
                                    </button>
                                </div>
                                <div class="question-feedback" v-if="$data._quesAnsweredIndex > i && $data._quizFeedback === true" v-html="getQuestionFeedback(i)"></div>
                                <div class="quiz-next-question flexbox flexbox-align-center flexbox-justify-center" >
                                    <button class="quiz-start-button quiz-next-button" 
                                    v-if="$data._quesAnsweredIndex === i+1 && $data._quesIndex === i && $data._quizComplete !== true && $data._quizFeedback === true"
                                    @click="scrollToNextQuestion" 
                                    role="button" tabindex="0"
                                    :aria-label="element.content.summary.continueBtn" >
                                        {{element.content.summary.continueBtn}}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- RESULTS -->
            <transition name="fade">
            <div :key="$data._quizComplete" ref="results" class="quiz-top-content flexbox flexbox-align-stretch flexbox-justify-stretch" v-if="$data._quizComplete">
                <div class="quiz-main-content flexbox flexbox-column flexbox-align-start flexbox-justify-start" >                    
                    <div class="quiz-core flexbox flexbox-row">
                        <div class="quiz-core-content flexbox flexbox-column flexbox-align-start flexbox-justify-center" >
                            <h4 v-if="element.content.title" v-html="element.content.title" />
                            <div v-html="feedbackText" />
                            <button class="quiz-start-button quiz-summary-review" 
                            @click="showReviewQuiz" 
                            v-if="($data._completePercent >= element.content._reviewPercent && $data._completePercent < 100) && !$data._showQuizSummary && element.content.feedback.checkBtn"
                            role="button" tabindex="0"
                            :aria-label="element.content.feedback.checkBtn" >
                                {{element.content.feedback.checkBtn}}
                            </button>
                            
                            <a class="quiz-fedback-correct-extra flexbox flexbox-column" :href='element.content.feedback.passExtras._href' target='_blank' v-if="$data._quizPassed === true && element.content.feedback.passExtras">
                                <img :src="element.content.feedback.passExtras._image" />
                                <span v-html="element.content.feedback.passExtras.title" />
                            </a>
                            <button class="quiz-start-button"  v-if="$data._quizPassed === false && ($store.state.assessAttempts < Number($store.state.courseContent.global._assessAttempts))"
                            @click="restartQuiz" 
                            role="button" tabindex="0"
                            :aria-label="element.content.feedback.retryBtn" >
                                {{element.content.feedback.retryBtn}}
                            </button>
                            
                        </div>
                    </div>
                </div>
            </div>
            </transition>
            
            <!-- SUMMARY -->
            <transition name="fade">
            <div :key="$data._quizComplete" class="quiz-top-content flexbox flexbox-align-stretch flexbox-justify-stretch" v-if="$data._quizComplete && $data._showQuizSummary">
                <div class="quiz-main-content flexbox flexbox-column flexbox-align-start flexbox-justify-start" >
                    <div class="quiz-core flexbox flexbox-row">
                        <div class="quiz-core-content flexbox flexbox-column flexbox-align-start flexbox-justify-center" >
                            <h4 v-if="element.content.title" v-html="element.content.summary.title" />
                            <div v-if="element.content.body" v-html="element.content.summary.body" />
                            <div class="quiz-summary" >
                                <div class="quiz-summary-ques" v-for="(ques, index) in element.content.questions" :key="index" :class="{ 'incorrect': questionsAnswered[index] === false }">
                                    <div> {{(index+1)}}. {{ques.stem}} </div>
                                    <div class="quiz-summary-opt" v-for="(opt, i) in element.content.questions[index].options" :key="i">
                                        <div v-html="opt.title" v-if="opt.correct === true" />
                                    </div>
                                </div>
                            </div>
                            <!-- <button class="quiz-start-button quiz-summary-continue" 
                            @click="showFeedbackQuiz" 
                            v-if="!$data._showQuizFinal"
                            role="button" tabindex="0"
                            :aria-label="element.content.summary.continueBtn" >
                                {{element.content.summary.continueBtn}}
                            </button> -->
                        </div>
                    </div>
                    
                </div>
            </div>
            </transition>

        </div>

        <div class="quiz-progress btw-progress-dots flexbox flexbox-row flexbox-justify-center flexbox-align-center" v-if="$data._quesIndex  > -1 && !$data._quizComplete" aria-hidden="true" >
            <div class="btw-progress-bg" />
            <div class="btw-progress-dot" v-for="(dot, index) in element.content.questions" 
            :key="index" :class="{ 'visited': $data._quesIndex >= index }" />
        </div>

    </div>
  </div>

</template>

<script lang="ts">

  import { Component, Prop, Vue, Watch, Mixins } from 'vue-property-decorator';
    import BaseComponent from '@/components/BaseComponent'; 

  import IQuiz, { IQuizContent } from "@/interfaces/BTW/IQuiz";

  @Component({
    components: {
      
    }
  })

  export default class Quiz extends Mixins(BaseComponent) implements IQuiz {
    @Prop({ required: true })
    protected element!: IQuiz;

    @Prop({ default: ""})
    public content!: IQuizContent;

    private _quizType: string = '';
    private _quizFeedback: boolean = false;

    private _quesIndex: number = 0;
    private _quesAnsweredIndex: number = -1;

    private _quizComplete: boolean = false;
    private _quizPassed: boolean = false;
    private _restartSelected: boolean = false;
    private _showQuizSummary: boolean = false;
    private _quizAttemptsReached: boolean = false;

    private feedbackText: string = '';

    private questionsAnswered: boolean[] = [];
    private questionAnswers: number[] = [];
    private questionPoints: number[] = [];
    private questionFeedbacks: string[] = [];

    private _completePercent: number = 0;

    private quesPointsI = 0;
    private quesPointsN = 1;
    private quesPointsC = 3;

    private mounted() {
        this.$data._quizType = this.element.content._quiztype;
        this.$data._quizFeedback = (this.element.content._feedback === "true");

      this.element.content.questions.forEach((item: any, index: number) => {
          this.questionsAnswered.push(false);
          this.questionAnswers.push(-1);
          this.questionPoints.push(this.quesPointsI);
          this.questionFeedbacks.push('');
      });

      if(this.$store.state.assessAttempts === Number(this.$store.state.courseContent.global._assessAttempts)) {
        this.$data._quizAttemptsReached = true;
      }
      this.focusStart();
    }

    private activated() {
      this.focusStart();
    }
    
    private getMainTitle() {
        let str = ' &nbsp; '; //this.$store.getters.changeColour(this.$store.state.courseContent.config.coursename, 0, 'btw-main');
        return str;
    }

    private getIntroContent() {
        let text = this.element.content.body;
        if (this.$store.state.device === 'phone') {
            text += this.element.content.ins;
        }
        if(this.$store.state.assessPassed === true) {
            text = this.element.content.alreadyPassed;
        }

        return text;
    }

    private getImage() {
        let imgURL = ' ';
        if(this.element.content._image) {
            imgURL = this.element.content._image;
        }
        return imgURL;
    }

    private getImageAlt() {
        let alt = ' ';
        if(this.element.content._alt) {
            alt = this.element.content._alt;
        }
        return alt;
    }

    private startQuiz() {
        this.$data._quesIndex = 0;
        this.$data._quesAnsweredIndex = -1;
        this.increseAttempts();
    }

    private restartQuiz() {
        this.retry();
        this.increseAttempts();
    }

    private restartQuizPassed() {
        this.retry();
        this.$data._restartSelected = true;
        this.increseAttempts();
    }

    private increseAttempts() {
        this.$store.state.assessAttempts++;
        this.$store.getters.write;
    }

    private showFeedbackQuiz() {
        this.$data._showQuizSummary = false;      
    }

    private showReviewQuiz() {
        this.$data._showQuizSummary = true;

        //jump to final feedback
        this.scrollToTop();
    }

    private scrollToTop() {
        var elem = document.getElementById('quiz');
        if (elem) {
            setTimeout(() => {
                if(this.$store.state.device === 'phone') {
                    const scrollToEl = (this.$refs['quiz'] as HTMLElement);
                    var elemChild = scrollToEl;
                    this.$store.getters.scrollToElement(elemChild, false);
                }  else {
                    elem!.scrollTop = (elem!.scrollHeight + elem!.offsetHeight);
                }           
            }, 100);
        }
    }

    private scrollToResults() {
        var elem = document.getElementById('quiz');
        if (elem) {
            setTimeout(() => {
                if(this.$store.state.device !== 'phone') {
                    const scrollToEl = (this.$refs['results'] as HTMLElement);
                    var elemChild = scrollToEl;
                    this.$store.getters.scrollToElement(elemChild, false);
                }           
            }, 100);
        }
    }

    private selectAnswer(_qIndex: number, _index: number) {

        if (this.element.content.questions[_qIndex].options[_index].correct === true) {
            Vue.set(this.questionsAnswered, _qIndex, true);
        }
        Vue.set(this.questionAnswers, _qIndex, _index);

        //if scenario
        if(this.$data._quizType === 'scenario') {
            if(this.element.content.questions[_qIndex].options[_index].correct === true){
                Vue.set(this.questionPoints, _qIndex, this.quesPointsC);
            }
            if(this.element.content.questions[_qIndex].options[_index].correct === 'nearly'){
                Vue.set(this.questionPoints, _qIndex, this.quesPointsN);
            }
            if(this.element.content.questions[_qIndex].options[_index].correct === false){
                //// (questionPoints alreday set to incorrect - this.quesPointsI)
            }

            //if feedback
            if (this.$data._quizFeedback) {
                let fback = '';
                if(this.element.content.questions[_qIndex].options[_index].correct === true){
                   fback = this.element.content.questions[_qIndex].feedback!.correct ? this.element.content.questions[_qIndex].feedback!.correct : '';
                }
                if(this.element.content.questions[_qIndex].options[_index].correct === 'nearly'){
                    fback = this.element.content.questions[_qIndex].feedback!.notquite! ? this.element.content.questions[_qIndex].feedback!.notquite! : '';
                }
                if(this.element.content.questions[_qIndex].options[_index].correct === false){
                    fback = this.element.content.questions[_qIndex].feedback!.incorrect ? this.element.content.questions[_qIndex].feedback!.incorrect : '';
                }
                Vue.set(this.questionFeedbacks, _qIndex, fback);
            }
        }
        //next ...
        const nextIndex = _qIndex + 1;
        if(this.$data._quesIndex < nextIndex) {
            this.$data._quesAnsweredIndex = _qIndex + 1;
        }
        if (_qIndex === this.questionsAnswered.length-1) {
            this.checkResult();
            //jump to top of results
            this.scrollToResults();
        } else {
            //jump to bottom of quiz / next question
            this.scrollToTop();
        }

        if(this.$data._quizFeedback !== true){
            this.scrollToNextQuestion();
         }
        
        
    }

    private scrollToNextQuestion(){
        this.$data._quesIndex = this.$data._quesAnsweredIndex;
        //jump to bottom of quiz / next question
        this.scrollToTop();
    }

    private getQuestionFeedback(_index: number) {
        let fback = this.questionFeedbacks[_index];
        return fback;
    }

    private checkResult() {
        let complete = true;
        let corrects = 0;
        let points = 0;
        let perc = 0;
        //if standard
        if(this.$data._quizType === 'standard') {
            this.questionsAnswered.forEach((ques: any, index: number) => {
                if(ques === true) {
                    corrects++;
                }
            });
            perc = Math.round((100/this.element.content.questions.length) * corrects);
        //if scenario
        } else {
            this.questionPoints.forEach((quesPoints: any, index: number) => {
                points += quesPoints;
            });
            const maxPoints = (this.element.content.questions.length*this.quesPointsC);
            perc = Math.round((100/maxPoints) * points);
            //console.log(this.questionPoints, points, maxPoints, perc);
        }
        //check passed?
        if (perc < this.element.content._passPercent) {
            complete = false;
        }

      this.$data._completePercent = perc;

      let fback = this.element.content.feedback.pass;
      if (complete) {
        //passed/complete
        this.$data._quizPassed = true;
        this.$store.state.assessPassed = true;
        this.$store.getters.write;
        this.$store.getters.setSCORMBookmark(this.$store.state.bookmark);
        //reset to show course completion
        this.$store.state.userCloseComplete = false;
        // enable the next button
        this.unlockNext();
      } else {
          if(this.$store.state.assessAttempts < Number(this.$store.state.courseContent.global._assessAttempts)) {
              fback = this.element.content.feedback.fail;
          } else {
              fback = this.element.content.feedback.finalFail;
          }

          if(perc >= this.element.content._reviewPercent) {
              this.$data._showQuizSummary = true;
          }
      }
      //save score to SCORM
      this.$store.getters.setSCORMScore(perc, this.element.content._passPercent);

      this.$store.getters.write;

      fback = fback.replace('{0}', '' + perc + '');
      this.feedbackText = fback;

      this.$data._quizComplete = true;

    //   if(this.$store.state.assessPassed === true) {
    //     this.$data._restartSelected = false;
    //   }

    }

    private getAttemptsReachedText() {
        let content = this.element.content.body;
        if (this.element.content.attemptsReached !== '') {
            content = this.element.content.attemptsReached;
        }
        content += this.$store.state.courseContent.global.closeIns;
        return content;
    }

    @Watch('isActive')
    private reset() {
        if(this.isActive === true) { 
            this.focusStart();
            this.retry();
      
            if (this.$store.state.device !== 'phone') {
                if(this.$store.state.assessPassed === true) {
                    this.$data._quesIndex = -1;
                }
            }
        }
    }

    private retry() {
        if(this.$store.state.assessAttempts < Number(this.$store.state.courseContent.global._assessAttempts)) {
            this.$data._quesIndex = 0;
            this.$data._quesAnsweredIndex = -1;
            this.$data._quizComplete = false;
            this.$data._quizPassed = false;
            this.$data._showQuizSummary = false;
            this.$data._completePercent = 0;
            // reset answered
            this.element.content.questions.forEach((item: any, index: number) => {
                this.questionsAnswered[index] = false;
                this.questionAnswers[index] = -1;
                this.questionPoints[index] = this.quesPointsI;
                this.questionFeedbacks[index] = '';
            });
            Vue.set(this.questionsAnswered, this.element.content.questions.length-1, false);
            Vue.set(this.questionAnswers, this.element.content.questions.length-1, false);
            Vue.set(this.questionPoints, this.element.content.questions.length-1, false);
            Vue.set(this.questionFeedbacks, this.element.content.questions.length-1, false);

            if(this.$store.state.assessPassed === true && this.$data._restartSelected === true) {
               this.$data._quesIndex = -1;
               this.$data._restartSelected = false;
            }
        }
    }




  }

</script>

<style scoped lang="scss">

  @import "../../style/global.scss";


  .quiz {

    position: absolute;
    top:0;
    left:0;
    width: 100%;
    height: 100%;
    max-height: 100%;

    z-index: 1000;

    animation: opacity-in 0.5s;

    &.container {
      padding: 0!important;
    }


    .quiz-container {
        
        background-color: $btw-quiz-main-bg;
        overflow: hidden;
        position: relative;

        @media #{$media-phone} {
            min-height: 90vh;
        }

        img {
            position: absolute;
            top:0;
            left:0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: center;

            @media #{$media-phone} {
                opacity: 0;
            }
        }

        .quiz-title {
            padding: $container-padding-btw/2 $container-padding-btw;
            height: $btw-topbar-height;

             @media #{$media-phone} {
                height: 0;
                padding: 0;
             }
        }

        .quiz-header-title {
            img {
                border: 0;
                object-position: left center;
            }
        }

        .quiz-header-logo {
            height: 2em;
            left: 3em;
            width: auto;
            top: 2em;
        }

        .quiz-icon {
            width: 5em;
            height: 5em;
            position: absolute;
            top: $container-padding-btw*3;
            left: $container-padding-btw;
        }

        .quiz-top {
            margin-bottom: 2.2em;
            overflow: hidden;
            overflow-y: auto;

            .quiz-top-content {
                width: 100%;

                @media #{$media-phone} {
                    position: relative;
                }

                    
                .main-title {
                    color: $btw-body-colour;
                }

                .quiz-main-content {
                    flex: 1 1 auto;
                    padding: 0 $container-padding-btw;

                    @media #{$media-phone} {
                        padding: 0;
                    }

                    color: $btw-body-colour;
                }

            }

            .quiz-core-content {
                text-align: left;
                width: 100%;
                flex: 1 1 auto;
                overflow: hidden;
                overflow-y: auto;

                padding: $container-padding-btw;

                background-color: $btw-quiz-background-colour;
            }
        }

        .section-break {
            height: 0.3em;
            border-radius: 0.3em;
            width: 40%;
            left: 30%;
            position: relative;
            background-color: $btw-mobiledivider-colour;
            margin: 1em 0;
        }

    }

    .quiz-core {
        margin: $container-padding-btw/2 auto;
        width: 85%;

        .quiz-start-button {
            background-color: $btw-btn-bg;
            color: $btw-btn-colour;
            border-radius: 1em;
            padding: 0.5em 2.2em;
            font-weight: bold;
            margin-top: $container-padding-btw;

            @media (hover: hover) and (pointer: fine) {
                &:hover {
                    background-color: $btw-btn-hover-bg;
                    color: $btw-btn-hover-colour;
                }
            }

            cursor: pointer;
        }

        @media #{$media-phone} {
            width: 100%;
        }
    }

    .question-stem {
        //padding: $container-padding-btw;
       
        width: 85%;

        //border-left: 3px solid $btw-body-colour;
        //border-bottom: 3px solid $btw-body-colour;

        //background-image: url('~@/assets/images/quiz_arrowline.png');
        background-position: left bottom;
        background-size: 100% auto;
        background-repeat: no-repeat;
    }

    .question-options {

        padding: 0 $container-padding-btw;
        @media #{$media-phone} {
            padding: 0;
        }

        width: 85%;
        margin: 0 auto;

        .question-option {
            background-color: $btw-quiz-option-bg;
            color: $btw-quiz-option-colour;
            border-radius: 1em;
            padding: 0.5em 2.2em;
            font-weight: bold;
            margin-top: ($container-padding-btw/3)*2;
            @media #{$media-phone} {
                margin-top: $container-padding-btw/2;
            }

            width: 100%;

            cursor: pointer;

            line-height: 1.3;

            &.disabled {
                cursor: default;
                opacity: 0.5;
            }

            &.selected {
                background-color: $btw-quiz-option-bg-selected;
                color: $btw-quiz-option-colour-selected;
                opacity: 1;
            }

        }
    }

    .question-feedback {
        width: 100%;
        margin-top: 1.5em;
        padding: $container-padding-btw/2;
        background-color: $white; //$btw-grey;
        color: $black;
        border-radius: 0.5em;
        //font-weight: bold;
    }

    .quiz-next-question {
        width:100%;
        .quiz-next-button {
        }
    }

    .quiz-progress {
        &.btw-progress-dots {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;

            @media #{$media-phone} {
                display: none;
            }
        
        }
    }

    .quiz-summary {
        margin-top: $container-padding-btw/2;

        .quiz-summary-ques {

            margin-bottom: $container-padding-btw/3;
            position: relative;
            
            //text-indent: 2rem;
            padding-left: 1.6em;


             &::before {
                content: '*';
                font-size: 2em;
                width: 2.2em;
                height: 2.2em;
                opacity: 0;
                position: absolute;
                left: 0em;
                top: -0.15em;
                color: $btw-body-colour;
            }

            &.incorrect {   
                &::before {
                    opacity: 1!important;
                }
            }
        }

        .quiz-summary-opt {
            font-weight: bold;
            //text-indent: 3.5rem;
        }
    }

    .quiz-summary-continue {
        align-self: flex-end;
    }

    .quiz-fedback-correct-extra {
        
        border: 0.15em solid $btw-body-colour;
        margin: 2.2em auto;

        max-width: 50%;
        flex-direction: row;
        align-items: center;
        @media #{$media-phone} {
            max-width: 100%;
        }

        &:hover {
            border: 0.15em solid $btw-body-colour;
        }
        
        img {
            position: relative;
            width: auto;
            height: auto;
            //margin: 1rem 1rem 0 1rem;
            display: inline-block;
            object-fit: contain;
            @media #{$media-phone} {
                width: 50%;
                margin: 0 auto;
                opacity: 1;
            }
        }
        
        span {
            color: $btw-body-colour;
            text-align: center;
            font-weight: bold;
            padding: $container-padding-btw/4 $container-padding-btw/2;
        }
    }

    @media #{$media-phone} {

        .quiz-icon {
            display: none;
        }

        .question-stem, .question-options {
            width: 100%;
        }

        .quiz-start-button {
            width: 100%;
            text-align: center;
        }
    }

  }

  // transitions //

    // fade
    .fade-enter-active {
      transition: opacity 1s;
    }
    .fade-enter { // , .fade-leave-to {
      opacity: 0;
    }

    
    // slide-fade
    .slide-fade-enter-active {
      opacity: 1;
      transition: all 0.5s cubic-bezier(1.0, 0.5, 0.8, 1.0);
    }
    .slide-fade-enter {
      transform: translateX(-2.2em);
      opacity: 0;
    }


</style>