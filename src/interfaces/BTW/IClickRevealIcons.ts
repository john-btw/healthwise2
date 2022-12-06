export default interface IClickRevealIcons {
  content: IClickRevealIconContent;
}

export interface IClickRevealIconContent {
  title: string;
  body: string;
  ins?: string;
  _image: string;
  _imageMobile: string;
  _alt: string;
  _rows: number;
  reveals: IClickRevealIconsItems[];
  _video: IMediaInfo;
}

export interface IClickRevealIconsItems {
  _image: string;
  _imageVisited: string;
  _alt: string;
  title: string;
  content: string;
}

export interface IMediaInfo {
  title: string;
  body: string;
  _embed: boolean;
  _video: IMediaFiles;
}

export interface IMediaFiles {
  _src: string;
  _poster: string;
  _vtt: string;
}

