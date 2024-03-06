import '../styles/index.scss';
import { Preloader } from './Preloader';
import { getScene } from './scene';

const preloaderContainer = document.getElementById('preloader') as HTMLElement;

// eslint-disable-next-line no-new
new Preloader({
  container: preloaderContainer,
  onHide: () => {
    getScene()?.show();
  },
});
