import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import {
  AmbientLight,
  DirectionalLight,
  PerspectiveCamera,
  Scene,
  Renderer,
  WebGLRenderer,
  MeshPhongMaterial,
  Texture,
  Color
} from "three";
import { StaticSkin } from "../../3d/static-skin";
import { LoadoutService } from "../../service/loadout.service";
import { Decal } from "../../model/decal";
import { BodyModel } from "../../3d/body-model";
import { WheelsModel } from "../../3d/wheels-model";
import { Wheel } from "../../model/wheel";
import { promiseProgress } from "../../utils/promise";
import { LoadoutStoreService } from "../../service/loadout-store.service";
import { environment } from "../../../environments/environment";

const ASSET_HOST = environment.assetHost;

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
  private skinMap: Texture;

  // Loading stuff
  mathRound = Math.round;
  initializing = true;
  initProgress = 0;
  loading = {
    decal: false,
    wheel: false
  };

  constructor(private loadoutService: LoadoutService,
              private loadoutStore: LoadoutStoreService) {
    this.loadoutService.decalChanged$.subscribe(decal => this.changeDecal(decal));
    this.loadoutService.paintChanged$.subscribe(paint => this.changePaint(paint));
    this.loadoutService.wheelChanged$.subscribe(wheel => this.changeWheel(wheel));
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
        this.skin.blankSkinMap = this.body.blankSkinMap;
        this.skin.update();
        this.skinMap = new Texture();
        this.skinMap.image = this.skin.toTexture();
        this.skinMap.needsUpdate = true;

        this.body.applyBodyTexture(this.skinMap);

        this.wheels.applyWheelPositions(this.body.getWheelPositions());

        this.body.addToScene(this.scene);
        this.wheels.addToScene(this.scene);

        this.initializing = false;
      }).catch(console.error);
    }).catch(console.error);
  }

  addLights() {
    let light = new AmbientLight(0xFFFFFF, 0.6); // soft white light
    this.scene.add(light);

    let dirLight = new DirectionalLight(0xFFFFFF, 0.4 * Math.PI);
    dirLight.position.set(0.5, 30, 0.866); // ~60º
    this.scene.add(dirLight);
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

  private changeDecal(decal: Decal) {
    this.loading.decal = true;
    this.skin.clear();
    this.skin.rgbaMapUrl = decal.rgba_map === undefined ? undefined : `${ASSET_HOST}/${decal.rgba_map}`;
    this.skin.load().then(() => {
      this.refreshSkin();
      this.loading.decal = false;
    });
  }

  private changeWheel(wheel: Wheel) {
    this.loading.wheel = true;
    this.wheels.removeFromScene(this.scene);
    this.wheels = new WheelsModel(wheel, this.loadoutService.paints);
    this.wheels.load().then(() => {
      this.wheels.applyWheelPositions(this.body.getWheelPositions());
      this.wheels.addToScene(this.scene);
      this.loading.wheel = false;
    });
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
    this.skinMap.image = this.skin.toTexture();
    this.skinMap.needsUpdate = true;
    (<MeshPhongMaterial>this.body.body.material).needsUpdate = true;
  }
}
