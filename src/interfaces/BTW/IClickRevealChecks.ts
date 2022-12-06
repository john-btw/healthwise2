export default interface IClickRevealChecks {
  _id?: string;
  content: IClickRevealCheckContent;
}

export interface IClickRevealCheckContent {
  title: string;
  body: string;
  _image: string;
  _alt: string;
  reveals: IClickRevealCheckItems[];
}

export interface IClickRevealCheckItems {
  checkTitle: string;
  title: string;
  content: string;
  _image: string;
  _alt: string;
  _imageMobile: string;
}
