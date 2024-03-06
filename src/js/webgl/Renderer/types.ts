import { WebGLRendererParameters } from 'three';

export interface IWebglRendererProps
  extends Omit<WebGLRendererParameters, 'context' | 'canvas'> {
  dpr?: number;
}
