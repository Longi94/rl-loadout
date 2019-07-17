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
  Mesh,
  MeshPhongMaterial,
  Texture,
  Color
} from "three";
import { TGALoader } from "three/examples/jsm/loaders/TGALoader";
import { PromiseLoader } from "../../utils/loader";
import { TgaRgbaLoader } from "../../utils/tga-rgba-loader";
import { StaticSkin } from "../../skin/static-skin";

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

  // colors
  private skinMaterial: MeshPhongMaterial;
  private skin;
  private skinMap: Texture;

  constructor() {
  }

  ngOnInit() {
    const width = this.canvasContainer.nativeElement.offsetWidth;
    const height = this.canvasContainer.nativeElement.offsetHeight;
    this.camera = new PerspectiveCamera(70, width / height, 0.01, 400);
    this.camera.position.z = 200;

    this.scene = new Scene();

      this.renderer = new WebGLRenderer({canvas: this.canvas.nativeElement, antialias: true});
    this.renderer.setSize(width, height);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enablePan = false;
    this.controls.minDistance = 100;
    this.controls.maxDistance = 300;
    this.controls.update();

    this.addLights();

    this.animate();

    this.loader = new PromiseLoader(new GLTFLoader());
    this.textureLoader = new PromiseLoader(new TGALoader());
    this.rgbaLoader = new PromiseLoader(new TgaRgbaLoader());

    Promise.all([
      this.loader.load('assets/models/Body_Dominus_PremiumSkin_SK.glb'),
      this.textureLoader.load('assets/textures/MuscleCar_Chassis_D.tga'),
      this.textureLoader.load('assets/textures/MuscleCar_Chassis_N.tga'),
      this.rgbaLoader.load('assets/textures/Dominus_funnybook.tga')
    ]).then(values => {
      let gltf = values[0];
      let diffuseMap = values[1];
      let normalMap = values[2];

      this.skin = new StaticSkin(values[3].width, values[3].height, values[3].data);
      this.skinMap = new Texture();
      this.skinMap.image = this.skin.toTexture();
      this.skinMap.needsUpdate = true;

      let mesh: Mesh = <Mesh>gltf.scene.children[0];
      let material = new MeshPhongMaterial();
      mesh.material = material;

      material.map = diffuseMap;
      material.normalMap = normalMap;

      mesh = <Mesh>gltf.scene.children[1];
      this.skinMaterial = new MeshPhongMaterial();
      mesh.material = this.skinMaterial;
      this.skinMaterial.map = this.skinMap;

      this.scene.add(gltf.scene);
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

  // colorChanged() {
  //   this.skin.primary = new Color(this.primary);
  //   this.skin.accent = new Color(this.accent);
  //   this.skin.paint = new Color(this.paint);
  //   this.skin.update();
  //
  //   this.skinMap.image = this.skin.toTexture();
  //   this.skinMap.needsUpdate = true;
  //   this.skinMaterial.needsUpdate = true;
  // }
}
