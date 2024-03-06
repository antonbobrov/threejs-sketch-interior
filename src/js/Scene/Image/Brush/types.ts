import { Texture, Vector2 } from 'three';
import { TSettings } from '../../global';

export type TProps = {
  container: HTMLElement;
  settings: TSettings;
  onTextureUpdate: (texture: Texture) => void;
  onMouseMove: (coords: Vector2) => void;
  onShowProgress: (progress: number) => void;
  onHalfPainted: () => void;
  onFullPainted: () => void;
};
