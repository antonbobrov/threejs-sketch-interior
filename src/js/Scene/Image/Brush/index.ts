/* eslint-disable class-methods-use-this */
import { Ctx2D, IOnResize, Timeline, onResize } from '@anton.bobrov/vevet-init';
import { Texture, Vector2 } from 'three';
import { IAddEventListener, addEventListener } from 'vevet-dom';
import { TProps } from './types';

export class Brush {
  private _ctx2d: Ctx2D;

  private _onResize: IOnResize;

  private _texture?: Texture;

  public get texture() {
    return this._texture;
  }

  private _listeners: IAddEventListener[] = [];

  private _currentMouse?: Vector2;

  private _lastMouse?: Vector2;

  private _points: Vector2[] = [];

  private _showTimeline?: Timeline;

  private _isHalfPainted = false;

  private _isFullPainted = false;

  constructor(private _props: TProps) {
    const { container } = _props;

    this._ctx2d = new Ctx2D({
      container,
      hasResize: false,
      hasInitialResize: false,
      dpr: 1,
      width: 1,
      height: 1,
      shouldAppend: false,
    });

    this._onResize = onResize({
      element: container,
      onResize: () => this._resize(),
    });

    this._resize();

    this._listeners.push(
      addEventListener(container, 'mousemove', (event) =>
        this._updatePoints(event.clientX, event.clientY),
      ),
    );

    this._listeners.push(
      addEventListener(container, 'touchmove', (event) =>
        this._updatePoints(event.touches[0].clientX, event.touches[0].clientY),
      ),
    );
  }

  private get circleRadius() {
    return (
      (Math.sqrt(this._ctx2d.width ** 2 + this._ctx2d.height ** 2) / 2) *
      this._props.settings.brushRadius
    );
  }

  /** Resize the scene  */
  private _resize() {
    const { container, onTextureUpdate } = this._props;
    const { clientWidth, clientHeight } = container;
    const heightAspect = clientHeight / clientWidth;

    const width = Math.round(clientWidth * 0.25);
    const height = width * heightAspect;

    this._ctx2d.changeProps({ width, height });

    this._texture?.dispose();
    this._texture = new Texture(this._ctx2d.canvas);

    onTextureUpdate(this._texture);
  }

  /** Calculate angle between vectors */
  private _calculateAngleBetween(t: Vector2, e: Vector2) {
    return Math.atan2(e.x - t.x, e.y - t.y);
  }

  /** Calculate distance between vectors */
  private _calculateDistanceBetween(t: Vector2, e: Vector2) {
    return Math.sqrt((e.x - t.x) ** 2 + (e.y - t.y) ** 2);
  }

  /** Update points */
  private _updatePoints(clientX: number, clientY: number) {
    const bounding = this._props.container.getBoundingClientRect();

    this._currentMouse = new Vector2(clientX, clientY);

    if (!this._lastMouse) {
      this._lastMouse = new Vector2(clientX, clientY);

      this._show();
    }

    const angle = this._calculateAngleBetween(
      this._lastMouse,
      this._currentMouse,
    );

    const distance = this._calculateDistanceBetween(
      this._lastMouse,
      this._currentMouse,
    );

    this._points = [];
    let lastPoint: Vector2 | undefined;

    for (let o = 0; o < distance; o += 10) {
      const pointX = this._lastMouse.x + Math.sin(angle) * o;
      const pointY = this._lastMouse.y + Math.cos(angle) * o;

      const x = (pointX - bounding.left) / bounding.width;
      const y = (pointY - bounding.top) / bounding.height;

      const point = new Vector2(x, y);

      this._points.push(point);
      lastPoint = point;
    }

    if (lastPoint) {
      this._props.onMouseMove(lastPoint);
    }

    this._lastMouse = new Vector2(clientX, clientY);

    this._render();
  }

  /** Render scene */
  private _render() {
    this._ctx2d.render(({ ctx, width, height }) => {
      this._points.forEach(({ x, y }) => {
        ctx.beginPath();
        ctx.arc(x * width, y * height, this.circleRadius, 0, 2 * Math.PI);
        ctx.fillStyle = '#fff';
        ctx.fill();
      });

      ctx.closePath();

      this._checkThreshold();

      if (this._texture) {
        this._texture.needsUpdate = true;
      }
    });
  }

  /** Trace threshold */
  private _checkThreshold() {
    const { ctx, width, height } = this._ctx2d;
    const { settings } = this._props;

    if (!settings.useThreshold) {
      return;
    }

    const { data: rgbas } = ctx.getImageData(0, 0, width, height);

    let r = 0;
    let g = 0;
    let b = 0;

    for (let i = 0; i < rgbas.length; i += 4) {
      r += rgbas[i];
      g += rgbas[i + 1];
      b += rgbas[i + 2];
    }

    r = Math.floor((r / rgbas.length) * 4);
    g = Math.floor((g / rgbas.length) * 4);
    b = Math.floor((b / rgbas.length) * 4);

    const color = (r + g + b) / 3;

    if (!this._isHalfPainted && color >= settings.brushThreshold) {
      this._isHalfPainted = true;
      this._props.onHalfPainted();
    }

    if (!this._isFullPainted && color >= 250) {
      this._isFullPainted = true;
      this._props.onFullPainted();
    }
  }

  /** Show scene */
  private _show() {
    const tm = new Timeline({ duration: 350 });
    this._showTimeline = tm;

    tm.addCallback('progress', ({ progress }) =>
      this._props.onShowProgress(progress),
    );

    tm.play();
  }

  /** Destroy the scene */
  public destroy() {
    this._ctx2d.destroy();
    this._onResize.remove();
    this._texture?.dispose();
    this._listeners.forEach((listener) => listener.remove());
    this._showTimeline?.destroy();
  }
}
