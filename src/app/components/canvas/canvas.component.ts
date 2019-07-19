import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
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
import { TGALoader } from "three/examples/jsm/loaders/TGALoader";
import { PromiseLoader } from "../../utils/loader";
import { TgaRgbaLoader } from "../../utils/tga-rgba-loader";
import { StaticSkin } from "../../3d/static-skin";
import { LoadoutService } from "../../service/loadout.service";
import { Decal } from "../../model/decal";
import { Body } from "../../3d/body";
import { Wheels } from "../../3d/wheels";
import { Wheel } from "../../model/wheel";
import { promiseProgress } from "../../utils/promise";
import { LoadoutStoreService } from "../../service/loadout-store.service";

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
  private loader: PromiseLoader;
  private textureLoader: PromiseLoader;
  private rgbaLoader: PromiseLoader;

  // 3D objects
  private body: Body;
  private wheels: Wheels;

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

    this.loader = new PromiseLoader(new GLTFLoader());
    this.textureLoader = new PromiseLoader(new TGALoader());
    this.rgbaLoader = new PromiseLoader(new TgaRgbaLoader());

    this.body = new Body('assets/models/Body_Dominus_PremiumSkin_SK.glb');
    this.wheels = new Wheels(new Wheel('', '', 0, 'assets/models/wheel_oem.glb',
      'assets/textures/OEM_D.tga', 'assets/textures/OEM_RGB.tga', false), this.loadoutService.paints);
    this.skin = new StaticSkin('assets/textures/Dominus_funnybook.tga', this.loadoutService.paints);

    promiseProgress([
      this.body.load(),
      this.textureLoader.load('assets/textures/MuscleCar_Chassis_D.tga'),
      this.textureLoader.load('assets/textures/MuscleCar_Chassis_N.tga'),
      this.skin.load(),
      this.wheels.load(),
      this.loadoutStore.initBodies()
    ], progress => this.initProgress = progress).then(values => {
      let diffuseMap: Texture = values[1];
      let normalMap: Texture = values[2];

      this.body.applyChassisTexture(diffuseMap, normalMap);

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
    this.skin.rgbaMapUrl = decal.texture;
    this.skin.load().then(() => {
      this.refreshSkin();
      this.loading.decal = false;
    });
  }

  private changeWheel(wheel: Wheel) {
    this.loading.wheel = true;
    this.wheels.removeFromScene(this.scene);
    this.wheels = new Wheels(wheel, this.loadoutService.paints);
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
