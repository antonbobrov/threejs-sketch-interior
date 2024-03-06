import { ProgressPreloader } from '@anton.bobrov/vevet-init';
import { TProps } from './types';

export class Preloader {
  private _instance: ProgressPreloader;

  private _percentElement: HTMLElement | null;

  constructor({ container, onHide }: TProps) {
    this._percentElement = container.querySelector('*[data-percent]');

    this._instance = new ProgressPreloader({
      container,
      hideAnimation: 500,
      lerp: 0.5,
    });

    this._instance.addCallback('progress', ({ progress }) =>
      this._renderProgress(progress),
    );

    this._instance.addCallback('hide', () => onHide());
  }

  private _renderProgress(progress: number) {
    if (!this._percentElement) {
      return;
    }

    const percent = Math.min(Math.floor(progress * 100), 99);
    const string = `${percent}`.padStart(2, '0');

    this._percentElement.innerHTML = `${string}%`;
  }

  public destroy() {
    this._instance.destroy();
  }
}
