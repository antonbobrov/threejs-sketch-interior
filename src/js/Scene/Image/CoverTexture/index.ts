import { Texture as ThreeTexture, Vector2 } from 'three';
import { TProps } from './types';

export class CoverTexture {
  private _texture: ThreeTexture;

  public get texture() {
    return this._texture;
  }

  private _uvScale = new Vector2(1, 1);

  public get uvScale() {
    return this._uvScale;
  }

  constructor({ image, startWidth, startHeight }: TProps) {
    this._texture = new ThreeTexture(image);
    this._texture.matrixAutoUpdate = false;

    this.resize(startWidth, startHeight);
  }

  /** Resize texture */
  public resize(width: number, height: number) {
    const texture = this._texture;

    const aspect = width / height;
    const imageAspect = texture.image.width / texture.image.height;

    if (aspect < imageAspect) {
      texture.matrix.setUvTransform(0, 0, aspect / imageAspect, 1, 0, 0.5, 0.5);
      this._uvScale = new Vector2(aspect / imageAspect, 1);
    } else {
      texture.matrix.setUvTransform(0, 0, 1, imageAspect / aspect, 0, 0.5, 0.5);
      this._uvScale = new Vector2(1, imageAspect / aspect);
    }

    this._texture.needsUpdate = true;
  }

  /** Destroy the scene */
  public destroy() {
    this._texture.dispose();
  }
}
