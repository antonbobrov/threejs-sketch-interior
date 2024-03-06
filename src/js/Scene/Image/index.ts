import {
  Mesh,
  PlaneGeometry,
  DoubleSide,
  ShaderMaterial,
  Vector2,
} from 'three';
import { NCallbacks, Timeline } from '@anton.bobrov/vevet-init';
import { TProps } from './types';

import simplexNoise from './shaders/simplexNoise.glsl';
import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';
import { CoverTexture } from './CoverTexture';
import { Brush } from './Brush';

export class Image {
  private get props() {
    return this._props;
  }

  private _startSize: { width: number; height: number };

  private get startSize() {
    return this._startSize;
  }

  private _brush: Brush;

  private _mouseCurrent = new Vector2(0, 0);

  private _mouseTarget = new Vector2(0, 0);

  private _mesh: Mesh;

  private _geometry: PlaneGeometry;

  private _texture: CoverTexture;

  private _material: ShaderMaterial;

  private _callbacks: NCallbacks.IAddedCallback[] = [];

  private _showOutlineTimeline?: Timeline;

  private _showOriginalTimeline?: Timeline;

  private _hideTimeline?: Timeline;

  constructor(private _props: TProps) {
    const { manager, image, settings } = _props;
    const { width: startWidth, height: startHeight, container } = manager;

    // save initial sizes
    this._startSize = { width: startWidth, height: startHeight };

    // create brush
    this._brush = new Brush({
      container,
      settings,
      onTextureUpdate: (texture) => {
        if (this._material) {
          this._material.uniforms.u_brushMap.value = texture;
        }
      },
      onMouseMove: (coords) => this._mouseTarget.copy(coords),
      onShowProgress: (progress) => {
        if (this._material) {
          this._material.uniforms.u_brushShowProgress.value = progress;
        }
      },
      onHalfPainted: () => this._showOriginal(),
      onFullPainted: () => this._hide(),
    });

    // create geometry
    this._geometry = new PlaneGeometry(startWidth, startHeight, 20, 20);

    // create texture
    this._texture = new CoverTexture({ image, startWidth, startHeight });

    // create shader material
    this._material = new ShaderMaterial({
      vertexShader: simplexNoise + vertexShader,
      fragmentShader: simplexNoise + fragmentShader,
      uniforms: {
        u_map: { value: this._texture.texture },
        u_brushMap: { value: this._brush.texture },
        u_time: { value: 0 },
        u_aspect: { value: startWidth / startHeight },
        u_uvScale: { value: this._texture.uvScale },
        u_mouse: { value: new Vector2(0, 0) },
        u_outlineProgress: { value: 0 },
        u_brushShowProgress: { value: 0 },
        u_showOriginalProgress: { value: 0 },
        u_outlineEdge: { value: settings.outlineEdge },
        u_sketchIntensity: { value: settings.sketchIntensity },
        u_sketchNoiseScale: { value: settings.sketchNoiseScale },
        u_sketchNoiseIntensity: { value: settings.sketchNoiseIntensity },
        u_brushNoiseScale: { value: settings.brushNoiseScale },
        u_brushNoiseIntensity: { value: settings.brushNoiseIntensity },
        u_originalRadius: { value: settings.originalRadius },
        u_hideProgress: { value: 0 },
      },
      side: DoubleSide,
    });

    // create mesh
    this._mesh = new Mesh(this._geometry, this._material);
    manager.scene.add(this._mesh);

    // resize
    this._callbacks.push(manager.callbacks.add('resize', () => this._resize()));

    // render
    this._callbacks.push(manager.callbacks.add('render', () => this._render()));
  }

  /** Resize the scene */
  private _resize() {
    const { startSize, props } = this;
    const { width, height } = props.manager;

    // calculate mesh scale
    const widthScale = width / startSize.width;
    const heightScale = height / startSize.height;

    // set mesh scale
    this._mesh.scale.set(widthScale, heightScale, 1);

    // update texture
    this._texture.resize(width, height);
    this._material.uniforms.u_uvScale.value = this._texture.uvScale;

    // uniforms
    this._material.uniforms.u_aspect.value = width / height;
  }

  /** Render the scene */
  private _render() {
    const { manager, settings } = this.props;
    const { easeMultiplier } = manager;
    const { uniforms } = this._material;

    uniforms.u_time.value += 0.01 * easeMultiplier;

    uniforms.u_mouse.value = this._mouseCurrent.lerp(
      this._mouseTarget,
      0.1 * easeMultiplier,
    );

    uniforms.u_outlineEdge.value = settings.outlineEdge;
    uniforms.u_sketchIntensity.value = settings.sketchIntensity;
    uniforms.u_sketchNoiseScale.value = settings.sketchNoiseScale;
    uniforms.u_sketchNoiseIntensity.value = settings.sketchNoiseIntensity;
    uniforms.u_brushNoiseScale.value = settings.brushNoiseScale;
    uniforms.u_brushNoiseIntensity.value = settings.brushNoiseIntensity;
    uniforms.u_originalRadius.value = settings.originalRadius;
  }

  /** Show outline */
  public showOutline() {
    if (this._showOutlineTimeline) {
      return;
    }

    const tm = new Timeline({ duration: 2000 });
    this._showOutlineTimeline = tm;

    tm.addCallback('progress', ({ easing }) => {
      this._material.uniforms.u_outlineProgress.value = easing;
    });

    tm.play();
  }

  /** Show original image */
  private _showOriginal() {
    if (this._showOriginalTimeline) {
      return;
    }

    const tm = new Timeline({ duration: 1000 });
    this._showOriginalTimeline = tm;

    tm.addCallback('progress', ({ easing }) => {
      this._material.uniforms.u_showOriginalProgress.value = easing;
    });

    tm.play();
  }

  /** Hide the scene */
  private _hide() {
    if (this._hideTimeline) {
      return;
    }

    const tm = new Timeline({ duration: 750 });
    this._hideTimeline = tm;

    tm.addCallback('progress', ({ easing }) => {
      this._material.uniforms.u_hideProgress.value = easing;
    });

    tm.addCallback('end', () => this._props.onHidden());

    tm.play();
  }

  /** Destroy the scene */
  public destroy() {
    this.props.manager.scene.remove(this._mesh);
    this._texture.destroy();
    this._material.dispose();
    this._geometry.dispose();
    this._brush.destroy();

    this._callbacks.forEach((event) => event.remove());

    this._showOutlineTimeline?.destroy();
    this._showOriginalTimeline?.destroy();
    this._hideTimeline?.destroy();
  }
}
