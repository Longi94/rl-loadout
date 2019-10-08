import { AbstractObject } from './object';
import { Color, Mesh, MeshStandardMaterial, Scene } from 'three';
import { Topper } from '../model/topper';
import { getAssetUrl } from '../utils/network';
import { disposeIfExists } from '../utils/util';
import { Paintable } from './paintable';
import { PaintConfig } from '../model/paint-config';
import { PromiseLoader } from '../utils/loader';
import { TgaRgbaLoader } from '../utils/tga-rgba-loader';
import { Layer, LayeredTexture } from './layered-texture';
import { getChannel, getMaskPixels, ImageChannel } from '../utils/image';
import { RocketConfig } from '../model/rocket-config';

class TopperSkin {

  private readonly loader: PromiseLoader = new PromiseLoader(new TgaRgbaLoader());

  texture: LayeredTexture;
  private paintLayer: Layer;
  private paintPixels: Set<number>;

  constructor(private readonly baseUrl, private readonly rgbaMapUrl, private paint: Color) {
  }

  async load() {
    const baseTask = this.loader.load(this.baseUrl);
    const rgbaMapTask = this.loader.load(this.rgbaMapUrl);

    const baseResult = await baseTask;

    if (baseResult != undefined) {
      const rgbaMap = (await rgbaMapTask).data;
      this.texture = new LayeredTexture(baseResult.data, baseResult.width, baseResult.height);

      const paintMask = getChannel(rgbaMap, ImageChannel.A);

      this.paintLayer = new Layer(paintMask, this.paint);
      this.paintPixels = getMaskPixels(paintMask);

      this.texture.addLayer(this.paintLayer);
      this.texture.update();
    }
  }

  dispose() {
    disposeIfExists(this.texture);
  }

  setPaint(color: Color) {
    this.paint = color;
    this.paintLayer.data = color;
    this.texture.update(this.paintPixels);
  }
}

export class TopperModel extends AbstractObject implements Paintable {

  material: MeshStandardMaterial;
  skin: TopperSkin;

  constructor(topper: Topper, paints: PaintConfig, rocketConfig: RocketConfig) {
    super(getAssetUrl(topper.model, rocketConfig), rocketConfig.gltfLoader);

    if (topper.base_texture && topper.rgba_map) {
      this.skin = new TopperSkin(
        getAssetUrl(topper.base_texture, rocketConfig),
        getAssetUrl(topper.rgba_map, rocketConfig),
        paints.topper
      );
    }
  }

  dispose() {
    super.dispose();
    disposeIfExists(this.material);
    disposeIfExists(this.skin);
  }

  handleModel(scene: Scene) {
    scene.traverse(object => {
      if (object['isMesh']) {
        this.material = (object as Mesh).material as MeshStandardMaterial;
      }
    });
  }

  async load() {
    const superTask = super.load();

    if (this.skin) {
      await this.skin.load();
    }

    await superTask;

    if (this.skin) {
      this.material.map = this.skin.texture.texture;
      this.material.needsUpdate = true;
    }
  }

  setPaintColor(color: Color) {
    if (this.skin) {
      this.skin.setPaint(color);
    }
  }
}
