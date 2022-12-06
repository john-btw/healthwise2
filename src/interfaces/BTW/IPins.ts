

export default interface IPin {
  content: IPinContent;
  
}

export interface IPinContent {
  title?: string;
  _pinImage: string;
  _pinHoverImage: string;
  _pinShadowImage: string;
  pins: IPinItem[];
}

export interface IPinItem {
  title?: string;
  content: string;
  posiiton: number[];
}

