export default interface ICarousel {
  _id: string;
  content: ICarouselContent;
}

export interface ICarouselContent {
  title: string;
  body: string;
  title2?: string;
  body2?: string;
  title3?: string;
  body3?: string;
  ins?: string;
  slides: ICarouselSlides[];
}

export interface ICarouselSlides {
  _image: string;
  _imageMobile: string;
  _alt: string;
  title: string;
  body: string;
  _audio: string;
  _vtt: string;
  audioTitle: string;
  audioBody: string;
}

