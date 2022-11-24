export default interface IQuiz {
  content: IQuizContent;
}

export interface IQuizContent {
  title: string;
  body: string;
  ins: string;
  attemptsReached: string;
  alreadyPassed: string;
  _image: string;
  _alt: string;
  _passPercent: number;
  _reviewPercent: number;
  startBtn: string;
  questions: IQuizQuestion[];
  summary: IQuizSummary;
  feedback: IQuizFeedback;
  _quiztype: string;
  _feedback: string;
}

export interface IQuizQuestion {
  stem: string;
  options: IQuizQuestionOption[];
  feedback?: IQuizQuestionFeedback;
}

export interface IQuizQuestionOption {
  title: string;
  correct: any;
}

export interface IQuizQuestionFeedback {
  correct: string;
  notquite?: string;
  incorrect: string;
}

export interface IQuizSummary {
  title: string;
  body?: string;
  continueBtn: string;
}

export interface IQuizFeedback {
  pass: string;
  fail: string;
  finalFail: string;
  passExtras?: any;
  retryBtn: string;
  checkBtn: string;
}

