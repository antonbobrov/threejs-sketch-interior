import { WebglManager } from '../../webgl/Manager';
import { TSettings } from '../global';

export type TProps = {
  manager: WebglManager;
  image: HTMLImageElement;
  settings: TSettings;
  onHidden: () => void;
};
