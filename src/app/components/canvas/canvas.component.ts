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
  private skin;
  private skinMap: Texture;

  constructor(private loadoutService: LoadoutService) {
    this.loadoutService.decalChanged$.subscribe(decal => this.changeDecal(decal));
    this.loadoutService.paintChanged$.subscribe(paint => this.changePaint(paint));
  }

  ngOnInit() {
    const width = this.canvasContainer.nativeElement.offsetWidth;
    const height = this.canvasContainer.nativeElement.offsetHeight;
    this.camera = new PerspectiveCamera(70, width / height, 0.01, 400);
    this.camera.position.x = 167.97478335547376;
    this.camera.position.y = 58.02658014964849;
    this.camera.position.z = -91.74632500987678;

    this.scene = new Scene();

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
    this.wheels = new Wheels('assets/models/wheels_oem.glb');

    Promise.all([
      this.body.load(),
      this.textureLoader.load('assets/textures/MuscleCar_Chassis_D.tga'),
      this.textureLoader.load('assets/textures/MuscleCar_Chassis_N.tga'),
      this.rgbaLoader.load('assets/textures/Dominus_funnybook.tga'),
      this.wheels.load()
    ]).then(values => {
      let diffuseMap = values[1];
      let normalMap = values[2];

      this.body.applyChassisTexture(diffuseMap, normalMap);

      this.skin = new StaticSkin(values[3], this.loadoutService.paints);
      this.skinMap = new Texture();
      this.skinMap.image = this.skin.toTexture();
      this.skinMap.needsUpdate = true;

      this.body.applyBodyTexture(this.skinMap);

      this.wheels.applyWheelPositions(this.body.getWheelPositions());

      this.body.addToScene(this.scene);
      this.wheels.addToScene(this.scene);
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
    this.rgbaLoader.load(decal.texture).then(texture => {
      this.skin = new StaticSkin(texture, this.loadoutService.paints);
      this.refreshSkin();
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
