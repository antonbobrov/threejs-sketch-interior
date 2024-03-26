import { loadImage, vevet } from '@anton.bobrov/vevet-init';
import { Color } from 'three';
import { WebglManager } from './webgl/Manager';
import { DATA_SLIDES } from './DATA';
import { Scene } from './Scene/index';

const managerContainer = document.getElementById('scene') as HTMLElement;

const manager = new WebglManager(managerContainer, {
  cameraProps: { perspective: 2000 },
  rendererProps: {
    dpr: vevet.viewport.lowerDesktopDpr,
    antialias: false,
  },
});
manager.play();

manager.scene.background = new Color(0xffffff);

let instance: Scene | null = null;

export function getScene() {
  return instance;
}

const create = (images: HTMLImageElement[]) => {
  const items = images.map((image, index) => ({
    ...DATA_SLIDES[index],
    image,
  }));

  instance = new Scene({
    manager,
    name: 'Scene',
    settings: {
      brushRadius: 0.2,
      brushThreshold: 200,
      useThreshold: true,
      outlineEdge: 0.2,
      sketchIntensity: 0.4,
      sketchNoiseScale: 100,
      sketchNoiseIntensity: 0.00337,
      brushNoiseScale: 50.0,
      brushNoiseIntensity: 0.01,
      originalRadius: 0.75,
    },
    items,
  });
};

function load() {
  let loadCount = 0;

  function handleLoaded() {
    loadCount += 1;

    manager.container.setAttribute(
      'data-is-loaded',
      `${loadCount / (DATA_SLIDES.length + 1)}`,
    );
  }

  const loaders = DATA_SLIDES.map((item) => {
    const loader = loadImage(item.src);

    loader.then(handleLoaded).catch(() => {});

    return loader;
  });

  Promise.all(loaders)
    .then((images) => {
      create(images);
      handleLoaded();
    })
    .catch(() => {});
}

load();
