import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const DEFAULT_BUCKET = 'https://storage.googleapis.com/rl-loadout';
const DEFAULT_HOST = 'https://rocket-loadout.com';

export class RocketConfig {
  backendHost: string = DEFAULT_HOST;
  assetHost: string = DEFAULT_BUCKET;
  gltfLoader?: GLTFLoader = new GLTFLoader();
  dracoDecoderPath?: string;
}
