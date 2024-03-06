import { WebglManager } from '../webgl/Manager';
import { TSettings } from './global';

export type TSceneItem = {
  image: HTMLImageElement;
};

export type TProps = {
  name: string;
  manager: WebglManager;
  settings: TSettings;
  items: TSceneItem[];
};
