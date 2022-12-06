export default interface IMedia {
  _id?: string;
  content: IMediaContent;
}

export interface IMediaContent {
  _video: IMediaInfo;
  _embed?: boolean;
}

export interface IMediaInfo {
  _src: string;
  _poster: string;
  _vtt: string;
  overlay?: string
}

