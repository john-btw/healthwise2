export default interface IClickRevealImages {
  _id?: string;
  content: IClickRevealImagesContent;
}

export interface IClickRevealImagesContent {
  reveals: IClickRevealImage[];
}

export interface IClickRevealImage {
  title?: string;
  content: string;
  _image: string;
  _alt: string;
  _imageActive: string;
}

