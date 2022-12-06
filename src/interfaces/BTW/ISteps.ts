export default interface ISteps {
    content: IStepsContent;
  }
  
  export interface IStepsContent {
    title?: string;
    body: string;
    
    _image: string;
    _alt: string;
    _props: string[];

    _images: boolean;
    _multiple: boolean;

    _arrowProps?: string[];

    extra?: string;
    _extraProps?: string[];

    _steps: IStepsItem[];

  }

  export interface IStepsItem {
    _image: string;
    _alt: string;
    title: string;
    content: string;
    _props? : string[];
  }
  
  