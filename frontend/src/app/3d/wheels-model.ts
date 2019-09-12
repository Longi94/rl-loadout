import { AbstractObject } from './object';
import { Color, Mesh, MeshStandardMaterial, Object3D, Scene, Vector3 } from 'three';
import { Wheel } from '../model/wheel';
import { getAssetUrl } from '../utils/network';
import { SkeletonUtils } from 'three/examples/jsm/utils/SkeletonUtils';
import { disposeIfExists } from '../utils/util';
import { Paintable } from './paintable';
import { PaintConfig } from '../service/loadout.service';
import { Layer, LayeredTexture } from './layered-texture';
import { PromiseLoader } from '../utils/loader';
import { TgaRgbaLoader } from '../utils/tga-rgba-loader';
import { getChannel, getMaskPixels, ImageChannel, invertChannel } from '../utils/image';

const BASE_RADIUS = 16.313;
const BASE_WIDTH = 14.5288;

class RimSkin {

  private readonly loader: PromiseLoader = new PromiseLoader(new TgaRgbaLoader());

  private paint: Color;
  texture: LayeredTexture;
  private paintLayer: Layer;
  private paintPixels: number[];

  constructor(private readonly baseUrl, private readonly rgbaMapUrl, paint) {
    if (paint != undefined) {
      this.paint = new Color(paint);
    }
  }

  async load() {
    const baseTask = this.loader.load(this.baseUrl);
    const rgbaMapTask = this.loader.load(this.rgbaMapUrl);

    const baseResult = await baseTask;

    if (baseResult != undefined) {
      const rgbaMap = (await rgbaMapTask).data;
      this.texture = new LayeredTexture(baseResult.data, baseResult.width, baseResult.height);

      const paintMask = getChannel(rgbaMap, ImageChannel.R);
      invertChannel(paintMask);

      this.paintLayer = new Layer(paintMask, this.paint);
      this.paintPixels = getMaskPixels(paintMask);

      this.texture.addLayer(this.paintLayer);
      this.texture.update();
    }
  }

  setPaint(color: Color) {
    this.paint = color;
    this.paintLayer.data = color;
    this.texture.update(this.paintPixels);
  }
}

export class WheelsModel extends AbstractObject implements Paintable {

  wheels: { [key: string]: Object3D } = {
    fr: undefined,
    fl: undefined,
    br: undefined,
    bl: undefined
  };

  rimMaterial: MeshStandardMaterial;
  rimSkin: RimSkin;

  constructor(wheel: Wheel, paints: PaintConfig) {
    super(getAssetUrl(wheel.model));
    if (wheel.rim_base && wheel.rim_rgb_map) {
      this.rimSkin = new RimSkin(
        getAssetUrl(wheel.rim_base),
        getAssetUrl(wheel.rim_rgb_map),
        paints.wheel
      );
    }
  }

  dispose() {
    super.dispose();
    disposeIfExists(this.rimMaterial);
    disposeIfExists(this.rimSkin);
    disposeIfExists(this.wheels.fr);
    disposeIfExists(this.wheels.fl);
    disposeIfExists(this.wheels.br);
    disposeIfExists(this.wheels.bl);
  }

  async load() {
    const superTask = super.load();

    if (this.rimSkin) {
      await this.rimSkin.load();
    }

    await superTask;

    if (this.rimSkin) {
      this.rimMaterial.map = this.rimSkin.texture.texture;
      this.rimMaterial.needsUpdate = true;
    }
  }

  handleModel(scene: Scene) {
    scene.traverse(object => {
      if (object instanceof Mesh) {
        const mat = object.material as MeshStandardMaterial;
        if (mat.name.includes('rim')) {
          this.rimMaterial = mat;
        }
      }
    });

    this.wheels.fr = SkeletonUtils.clone(scene) as Object3D;
    this.wheels.fl = SkeletonUtils.clone(scene) as Object3D;
    this.wheels.br = SkeletonUtils.clone(scene) as Object3D;
    this.wheels.bl = SkeletonUtils.clone(scene) as Object3D;
  }

  applyWheelConfig(config) {
    let frontWidthScale = 1;
    let frontRadiusScale = 1;
    let backWidthScale = 1;
    let backRadiusScale = 1;
    let frontOffset = 0;
    let backOffset = 0;

    if (config.settings != undefined) {
      frontWidthScale = config.settings.frontAxle.wheelWidth / BASE_WIDTH;
      frontRadiusScale = config.settings.frontAxle.wheelMeshRadius / BASE_RADIUS;
      backWidthScale = config.settings.backAxle.wheelWidth / BASE_WIDTH;
      backRadiusScale = config.settings.backAxle.wheelMeshRadius / BASE_RADIUS;
      frontOffset = config.settings.frontAxle.wheelMeshOffsetSide;
      backOffset = config.settings.backAxle.wheelMeshOffsetSide;
    }

    for (const key of Object.keys(config.positions)) {
      const wheel = this.wheels[key];
      const position = new Vector3();

      position.copy(config.positions[key].pos);

      if (key.endsWith('l')) {
        wheel.rotation.set(0, Math.PI, 0);
      }

      if (key.startsWith('f')) {
        wheel.scale.set(frontRadiusScale, frontRadiusScale, frontWidthScale);

        if (key.endsWith('l')) {
          position.add(new Vector3(0, 0, -frontOffset));
        } else {
          position.add(new Vector3(0, 0, frontOffset));
        }
      } else {
        wheel.scale.set(backRadiusScale, backRadiusScale, backWidthScale);

        if (key.endsWith('l')) {
          position.add(new Vector3(0, 0, -backOffset));
        } else {
          position.add(new Vector3(0, 0, backOffset));
        }
      }

      wheel.position.copy(position);
    }
  }

  addToScene(scene: Scene) {
    scene.add(this.wheels.fr, this.wheels.fl, this.wheels.br, this.wheels.bl);
  }

  removeFromScene(scene: Scene) {
    scene.remove(this.wheels.fr, this.wheels.fl, this.wheels.br, this.wheels.bl);
  }

  setPaintColor(paint: Color) {
    if (this.rimSkin != undefined) {
      this.rimSkin.setPaint(paint);
    }
  }
}
