export default interface IFooter {
  _id: string;
  next?: IFooterButton[];
  prev?: IFooterButton[];
  home?: IFooterButton[];
}

export interface IFooterButton {
  title: string;
  _uri: string;
}