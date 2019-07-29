import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import {
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  MeshStandardMaterial,
  Color,
  SpotLight,
  TextureLoader,
  Texture, WebGLRenderTarget, AmbientLight
} from "three";
import { StaticSkin } from "../../3d/static-skin";
import { LoadoutService } from "../../service/loadout.service";
import { Decal } from "../../model/decal";
import { BodyModel } from "../../3d/body-model";
import { WheelsModel } from "../../3d/wheels-model";
import { Wheel } from "../../model/wheel";
import { promiseProgress } from "../../utils/promise";
import { LoadoutStoreService } from "../../service/loadout-store.service";
import { Body } from "../../model/body";
import { getAssetUrl } from "../../utils/network";
import { EquirectangularToCubeGenerator } from "three/examples/jsm/loaders/EquirectangularToCubeGenerator";
import { PromiseLoader } from "../../utils/loader";
import { PMREMGenerator } from "three/examples/jsm/pmrem/PMREMGenerator";
import { PMREMCubeUVPacker } from "three/examples/jsm/pmrem/PMREMCubeUVPacker";

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnInit {

  @ViewChild('canvas', {static: true})
  canvas: ElementRef;

  @ViewChild('canvasContainer', {static: true})
  canvasContainer: ElementRef;

  private camera: PerspectiveCamera;
  private scene: Scene;
  private renderer: WebGLRenderer;
  private controls: OrbitControls;
  private cubeRenderTarget: WebGLRenderTarget;
  private envMap: Texture;

  // 3D objects
  private body: BodyModel;
  private wheels: WheelsModel;

  // colors
  private skin: StaticSkin;

  // Loading stuff
  mathRound = Math.round;
  initializing = true;
  initProgress = 0;
  loading = {
    body: false,
    decal: false,
    wheel: false
  };

  constructor(private loadoutService: LoadoutService,
              private loadoutStore: LoadoutStoreService) {
    this.loadoutService.decalChanged$.subscribe(decal => this.changeDecal(decal));
    this.loadoutService.paintChanged$.subscribe(paint => this.changePaint(paint));
    this.loadoutService.wheelChanged$.subscribe(wheel => this.changeWheel(wheel));
    this.loadoutService.bodyChanged$.subscribe(body => this.changeBody(body));
  }

  isLoading() {
    return Object.values(this.loading).some(value => value);
  }

  ngOnInit() {
    const width = this.canvasContainer.nativeElement.offsetWidth;
    const height = this.canvasContainer.nativeElement.offsetHeight;
    this.camera = new PerspectiveCamera(70, width / height, 0.01, 400);
    this.camera.position.x = 167.97478335547376;
    this.camera.position.y = 58.02658014964849;
    this.camera.position.z = -91.74632500987678;

    this.scene = new Scene();
    this.scene.background = new Color('#AAAAAA');

    this.renderer = new WebGLRenderer({canvas: this.canvas.nativeElement, antialias: true});
    this.renderer.setSize(width, height);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enablePan = false;
    this.controls.minDistance = 100;
    this.controls.maxDistance = 300;
    this.controls.update();

    this.addLights();

    this.animate();

    const textureLoader = new PromiseLoader(new TextureLoader());

    this.loadoutService.loadDefaults().then(() => {
      this.body = new BodyModel(this.loadoutService.body);
      this.wheels = new WheelsModel(this.loadoutService.wheel, this.loadoutService.paints);
      this.skin = new StaticSkin(this.loadoutService.decal, this.loadoutService.paints);

      let promises = [
        this.body.load(),
        this.skin.load(),
        this.wheels.load(),
        this.loadoutStore.initBodies(),
        this.loadoutStore.initWheels(),
        this.loadoutStore.loadDecals(this.loadoutService.body.id),
        textureLoader.load('assets/mannfield_equirectangular.jpg')
      ];

      promiseProgress(promises, progress => {
        this.initProgress = 100 * (progress + 1) / (promises.length + 1)
      }).then(values => {
        this.processBackground(values[6]);
        this.applySkin();
        this.applyBodyModel();
        this.applyWheelModel();
        this.initializing = false;
      }).catch(console.error);
    }).catch(console.error);
  }

  addLights() {
    const INTENSITY = 0.6;
    const ANGLE = Math.PI / 4;

    const ambient = new AmbientLight(0xFFFFFF, INTENSITY);
    this.scene.add(ambient);

    const light0 = new SpotLight(0xFFFFFF, INTENSITY, 300, ANGLE); // soft white light
    light0.position.set(100, 60, 100);
    light0.lookAt(0, 0, 0);
    this.scene.add(light0);

    const light1 = new SpotLight(0xFFFFFF, INTENSITY, 300, ANGLE); // soft white light
    light1.position.set(-100, 60, 100);
    light1.lookAt(0, 0, 0);
    this.scene.add(light1);

    const light2 = new SpotLight(0xFFFFFF, INTENSITY, 300, ANGLE); // soft white light
    light2.position.set(100, 60, -100);
    light2.lookAt(0, 0, 0);
    this.scene.add(light2);

    const light3 = new SpotLight(0xFFFFFF, INTENSITY, 300, ANGLE); // soft white light
    light3.position.set(-100, 60, -100);
    light3.lookAt(0, 0, 0);
    this.scene.add(light3);

    const light4 = new SpotLight(0xFFFFFF, INTENSITY, 300, ANGLE); // soft white light
    light4.position.set(0, -100, 0);
    light4.lookAt(0, 0, 0);
    this.scene.add(light4);

    // const light5 = new SpotLight(0xFFFFFF, INTENSITY, 300, ANGLE); // soft white light
    // light5.position.set(0, 160, 0);
    // light5.lookAt(0, 0, 0);
    // this.scene.add(light5);

    // const helper0 = new SpotLightHelper(light0, new Color(1, 1, 1));
    // this.scene.add(helper0);
    // const helper1 = new SpotLightHelper(light1, new Color(0, 1, 1));
    // this.scene.add(helper1);
    // const helper2 = new SpotLightHelper(light2, new Color(1, 0, 1));
    // this.scene.add(helper2);
    // const helper3 = new SpotLightHelper(light3, new Color(1, 1, 0));
    // this.scene.add(helper3);
    // const helper4 = new SpotLightHelper(light4, new Color(0, 1, 0));
    // this.scene.add(helper4);
  }

  private processBackground(backgroundTexture: Texture) {
    const generator = new EquirectangularToCubeGenerator(backgroundTexture);
    const cubeMapTexture = generator.update(this.renderer);

    // @ts-ignore
    this.scene.background = generator.renderTarget;

    const pmremGenerator = new PMREMGenerator(cubeMapTexture);
    pmremGenerator.update(this.renderer);
    const pmremCubeUVPacker = new PMREMCubeUVPacker(pmremGenerator.cubeLods);
    pmremCubeUVPacker.update(this.renderer);
    this.cubeRenderTarget = pmremCubeUVPacker.CubeUVRenderTarget;
    this.envMap = this.cubeRenderTarget.texture;

    backgroundTexture.dispose();
    pmremGenerator.dispose();
    pmremCubeUVPacker.dispose();
  }

  private animate() {
    requestAnimationFrame(() => this.animate());

    this.resizeCanvas();
    this.renderer.render(this.scene, this.camera);
  }

  private resizeCanvas() {
    const width = this.canvasContainer.nativeElement.offsetWidth;
    const height = this.canvasContainer.nativeElement.offsetHeight;

    if (this.canvas.nativeElement.width !== width || this.canvas.nativeElement.height !== height) {
      this.renderer.setSize(width, height, false);
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
    }
  }

  private changeBody(body: Body) {
    this.loading.body = true;
    this.body.removeFromScene(this.scene);
    this.body.apply(body);

    this.clearSkin(this.loadoutService.decal);

    Promise.all([
      this.body.load(),
      this.loadoutStore.loadDecals(body.id),
      this.skin.load()
    ]).then(() => {
      this.applySkin();
      this.wheels.applyWheelPositions(this.body.getWheelPositions());
      this.applyBodyModel();
      this.loading.body = false;
    });
  }

  private changeDecal(decal: Decal) {
    this.loading.decal = true;
    this.clearSkin(decal);
    this.skin.load().then(() => {
      this.applySkin();
      this.loading.decal = false;
    });
  }

  private clearSkin(newDecal: Decal) {
    this.skin.clear();
    this.skin.baseUrl = getAssetUrl(newDecal.base_texture);
    this.skin.rgbaMapUrl = getAssetUrl(newDecal.rgba_map);
  }

  private applySkin() {
    this.skin.blankSkinMap = this.body.blankSkinMap;
    this.skin.baseSkinMap = this.body.baseSkinMap;
    this.refreshSkin();
    this.body.applyBodyTexture(this.skin.texture);
  }

  private changeWheel(wheel: Wheel) {
    this.loading.wheel = true;
    this.wheels.removeFromScene(this.scene);
    this.wheels = new WheelsModel(wheel, this.loadoutService.paints);
    this.wheels.load().then(() => {
      this.applyWheelModel();
      this.loading.wheel = false;
    });
  }

  private applyWheelModel() {
    this.wheels.applyWheelPositions(this.body.getWheelPositions());
    this.wheels.setEnvMap(this.envMap);
    this.wheels.addToScene(this.scene);
  }

  private applyBodyModel() {
    this.body.setEnvMap(this.envMap);
    this.body.addToScene(this.scene);
  }

  private changePaint(paint) {
    const color = paint.color != undefined ? new Color(paint.color) : undefined;
    switch (paint.type) {
      case 'primary':
        this.skin.primary = color;
        this.refreshSkin();
        break;
      case 'accent':
        this.skin.accent = color;
        this.refreshSkin();
        break;
      case 'body':
        this.skin.bodyPaint = color;
        this.refreshSkin();
        break;
      case 'decal':
        this.skin.paint = color;
        this.refreshSkin();
        break;
      case 'wheel':
        this.wheels.setPaint(paint.color);
        this.wheels.refresh();
        break;
      default:
        console.error(`Unknown paint type ${paint.type}`);
        return;
    }
  }

  private refreshSkin() {
    this.skin.update();
    (<MeshStandardMaterial>this.body.bodyMaterial).needsUpdate = true;
  }
}
