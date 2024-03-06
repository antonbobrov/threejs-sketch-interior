import { IWebglRendererProps } from '../Renderer/types';

export interface IWebglManagerProps {
  cameraProps?: {
    fov?: number;
    perspective?: number | (() => number);
    near?: number;
    far?: number;
  };
  rendererProps?: IWebglRendererProps;
}

export interface IWebglManagerCallbacksTypes {
  destroy: undefined;
  beforeResize: undefined;
  resize: undefined;
  render: undefined;
  afterRender: undefined;
}
