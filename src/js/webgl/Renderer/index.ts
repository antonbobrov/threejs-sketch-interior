import { WebGLRenderer } from 'three';
import { vevet } from '@anton.bobrov/vevet-init';
import { IWebglRendererProps } from './types';

export class WebglRenderer {
  private _renderer: WebGLRenderer;

  get renderer() {
    return this._renderer;
  }

  private _width = 1;

  private _height = 1;

  get canvas() {
    return this._canvas;
  }

  get dpr() {
    return this._props.dpr ?? vevet.viewport.dpr;
  }

  get width() {
    return this._width;
  }

  get height() {
    return this._height;
  }

  constructor(
    private _container: HTMLElement,
    private _canvas: HTMLCanvasElement,
    private _props: IWebglRendererProps,
  ) {
    this._renderer = new WebGLRenderer({
      ..._props,
      canvas: _canvas,
    });

    this.resize();
  }

  public resize() {
    this._width = this._container.clientWidth;
    this._height = this._container.clientHeight;

    this._renderer.setSize(this.width, this.height);
    this._renderer.setPixelRatio(this.dpr);
  }

  public destroy() {
    this._renderer.dispose();
  }
}
