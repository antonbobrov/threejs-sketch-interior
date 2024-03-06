import { PerspectiveCamera } from 'three';

export class WebglCamera {
  protected _camera: PerspectiveCamera;

  get camera() {
    return this._camera;
  }

  get perspective() {
    return typeof this._perspective === 'number'
      ? this._perspective
      : this._perspective();
  }

  get near() {
    return this._near;
  }

  get far() {
    return this._far;
  }

  constructor(
    private _container: Element,
    private _fov: number | undefined,
    private _perspective: number | (() => number),
    private _near: number,
    private _far: number,
  ) {
    this._camera = new PerspectiveCamera(
      this.fov,
      this.aspectRatio,
      this.near,
      this.far,
    );
  }

  get aspectRatio() {
    return this.width / this.height;
  }

  get width() {
    return this._container.clientWidth;
  }

  get height() {
    return this._container.clientHeight;
  }

  get fov() {
    return (
      this._fov ||
      180 * ((2 * Math.atan(this.height / 2 / this.perspective)) / Math.PI)
    );
  }

  public resize() {
    const { camera } = this;

    camera.fov = this.fov;
    camera.aspect = this.aspectRatio;

    this._camera.position.set(0, 0, this.perspective);

    camera.updateProjectionMatrix();
  }
}
