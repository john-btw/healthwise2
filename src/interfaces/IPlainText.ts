import IButton from './partials/IButton';

export default interface IPlainText {
  _id: string;
  title?: string;
  body?: string;
  button?: IButton;
}