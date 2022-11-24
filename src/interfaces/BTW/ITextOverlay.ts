export default interface ITextOverlay {
    content: ITextOverlayContent;
  }
  
  export interface ITextOverlayContent {
    _image: string;
    _props: string[];
    extra: string;
    _extraProps: string[];
  }
  
  