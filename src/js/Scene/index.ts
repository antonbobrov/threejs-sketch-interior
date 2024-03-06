import {
  TCreateDatGuiSettingsReturns,
  createDatGuiSettings,
} from '@anton.bobrov/react-dat-gui';
import { wrap } from '@anton.bobrov/vevet-init';
import { TProps } from './types';
import { Image } from './Image';
import { TSettings } from './global';

export class Scene {
  private _gui: TCreateDatGuiSettingsReturns<TSettings>;

  private _image: Image | null = null;

  private _index = 0;

  private _isFirstTime = true;

  private get wrapIndex() {
    return wrap(0, this._props.items.length, this._index);
  }

  constructor(private _props: TProps) {
    const { name, settings } = _props;

    this._gui = createDatGuiSettings({
      name,
      data: settings,
      parameters: {
        brushRadius: { type: 'number', min: 0.05, max: 0.5, step: 0.0001 },
        brushThreshold: { type: 'number', min: 100, max: 255, step: 1 },
        useThreshold: { type: 'boolean' },
        outlineEdge: { type: 'number', min: 0.1, max: 0.3, step: 0.001 },
        sketchIntensity: { type: 'number', min: 0.0, max: 0.75, step: 0.001 },
        sketchNoiseScale: { type: 'number', min: 30, max: 150, step: 1 },
        sketchNoiseIntensity: {
          type: 'number',
          min: 0,
          max: 0.035,
          step: 0.00001,
        },
        brushNoiseScale: { type: 'number', min: 30, max: 150, step: 1 },
        brushNoiseIntensity: {
          type: 'number',
          min: 0,
          max: 0.1,
          step: 0.00001,
        },
        originalRadius: { type: 'number', min: 0.1, max: 1, step: 0.01 },
      },
      isOpen: true,
    });

    this._createImage();
  }

  private _next() {
    this._index += 1;
    this._createImage();
  }

  private _createImage() {
    const { items, manager } = this._props;
    const index = this.wrapIndex;

    const item = items[index];

    const newImage = new Image({
      ...item,
      manager,
      settings: this._gui.current,
      onHidden: () => this._next(),
    });

    this._image?.destroy();
    this._image = newImage;

    if (!this._isFirstTime) {
      this._image.showOutline();
    }

    this._isFirstTime = false;
  }

  /** Show the scene */
  public show() {
    this._image?.showOutline();
  }

  /** Destroy the scene */
  public destroy() {
    this._gui.destroy();

    this._image?.destroy();
  }
}
