import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import {
  PerspectiveCamera,
  Scene,
  Renderer,
  WebGLRenderer,
  MeshStandardMaterial,
  Color,
  SpotLight,
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
  private renderer: Renderer;
  private controls: OrbitControls;

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
    //this.controls.minDistance = 100;
    this.controls.maxDistance = 300;
    this.controls.update();

    this.addLights();

    this.animate();

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
        this.loadoutStore.loadDecals(this.loadoutService.body.id)
      ];

      promiseProgress(promises, progress => {
        this.initProgress = 100 * (progress + 1) / (promises.length + 1)
      }).then(() => {
        this.applySkin();
        this.body.addToScene(this.scene);
        this.applyWheelModel();

        this.initializing = false;
      }).catch(console.error);
    }).catch(console.error);
  }

  addLights() {
    const INTENSITY = 3;
    const ANGLE = Math.PI / 4;

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
    light4.position.set(0, -160, 0);
    light4.lookAt(0, 0, 0);
    this.scene.add(light4);

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

  animate() {
    requestAnimationFrame(() => this.animate());

    this.resizeCanvas();
    this.renderer.render(this.scene, this.camera);
  }

  resizeCanvas() {
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

    let decal = this.loadoutService.decal;
    this.skin.clear();
    this.skin.baseUrl = getAssetUrl(decal.base_texture);
    this.skin.rgbaMapUrl = getAssetUrl(decal.rgba_map);

    Promise.all([
      this.body.load(),
      this.loadoutStore.loadDecals(body.id),
      this.skin.load()
    ]).then(() => {
      this.applySkin();
      this.wheels.applyWheelPositions(this.body.getWheelPositions());
      this.body.addToScene(this.scene);
      this.loading.body = false;
    });
  }

  private changeDecal(decal: Decal) {
    this.loading.decal = true;
    this.skin.clear();
    this.skin.baseUrl = getAssetUrl(decal.base_texture);
    this.skin.rgbaMapUrl = getAssetUrl(decal.rgba_map);
    this.skin.load().then(() => {
      this.applySkin();
      this.loading.decal = false;
    });
  }

  private applySkin() {
    this.skin.blankSkinMap = this.body.blankSkinMap;
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
    this.wheels.addToScene(this.scene);
  }

  private changePaint(paint) {
    switch (paint.type) {
      case 'primary':
        this.skin.primary = new Color(paint.color);
        this.refreshSkin();
        break;
      case 'accent':
        this.skin.accent = new Color(paint.color);
        this.refreshSkin();
        break;
      case 'body':
        this.skin.bodyPaint = new Color(paint.color);
        this.refreshSkin();
        break;
      case 'decal':
        this.skin.paint = new Color(paint.color);
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
    (<MeshStandardMaterial>this.body.body.material).needsUpdate = true;
  }
}
