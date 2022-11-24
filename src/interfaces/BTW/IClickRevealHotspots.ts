export default interface IClickRevealHotspots {
  content: IClickRevealHotspotContent;
}

export interface IClickRevealHotspotContent {
  title: string;
  body: string;
  instructions: string;
  _image: string;
  _alt: string;
  _rows: number;
  reveals: IClickRevealHotspotItems[];
  _video: IMediaInfo;
}

export interface IClickRevealHotspotItems {
  _image: string;
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

