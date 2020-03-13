import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import {
  AmbientLight,
  Color,
  DefaultLoadingManager, Material,
  MeshStandardMaterial,
  PerspectiveCamera,
  Scene,
  SpotLight,
  Texture,
  TextureLoader,
  WebGLRenderer,
  WebGLRenderTarget,
  WebGLRenderTargetCube
} from 'three';
import { LoadoutService } from '../../../service/loadout.service';
import { LoadoutStoreService } from '../../../service/loadout-store.service';
import { PMREMGenerator } from 'three/examples/jsm/pmrem/PMREMGenerator';
import { PMREMCubeUVPacker } from 'three/examples/jsm/pmrem/PMREMCubeUVPacker';
import { TextureService } from '../../../service/texture.service';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { getHitboxModel, HitboxModel } from '../../../3d/hitbox-model';
import { GUI } from 'dat-gui';
import * as dat from 'dat.gui';
import { NotifierService } from 'angular-notifier';
import * as Stats from 'stats.js';
import {
  Antenna,
  AntennaModel,
  Body,
  BodyModel,
  createBodyModel,
  createWheelsModel,
  Decal,
  getBodyLoader,
  getWheelLoader,
  MAX_WHEEL_YAW,
  MultiImageLoader,
  PromiseLoader,
  RocketConfig,
  StaticDecalLoader,
  TextureFormat,
  Topper,
  TopperModel,
  Wheel,
  WheelsModel
} from 'rl-loadout-lib';
import { environment } from '../../../../environments/environment';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/assets/draco/');
const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

const ROCKET_CONFIG = new RocketConfig({
  backendHost: environment.backend,
  assetHost: environment.assetHost,
  loadingManager: DefaultLoadingManager,
  textureFormat: TextureFormat.PNG,
  useCompressedModels: true,
  gltfLoader
});

const imageLoader = new PromiseLoader(new MultiImageLoader(TextureFormat.PNG, DefaultLoadingManager));
const modelLoader = new PromiseLoader(gltfLoader);

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

  @ViewChild('dgContainer', {static: true})
  dgContainer: ElementRef;

  private camera: PerspectiveCamera;
  private scene: Scene;
  private renderer: WebGLRenderer;
  private controls: OrbitControls;
  private cubeRenderTarget: WebGLRenderTarget;
  private envMap: Texture;

  // 3D objects
  private body: BodyModel;
  private wheels: WheelsModel;
  private topper: TopperModel;
  private antenna: AntennaModel;

  // Loading stuff
  mathRound = Math.round;
  initializing = true;
  progress = {
    percent: 0,
    start: 0,
    total: 0,
    current: 0
  };
  loading = {
    body: false,
    decal: false,
    wheel: false,
    topper: false,
    antenna: false
  };

  private wheelsConfig = {
    visible: true,
    yaw: 0.00001,
    roll: 0.00001
  };

  // hitbox
  private hitboxConfig = {enabled: false};
  private hitbox: HitboxModel = new HitboxModel();

  // stats
  private stats = new Stats();

  constructor(private loadoutService: LoadoutService,
              private loadoutStore: LoadoutStoreService,
              private textureService: TextureService,
              private notifierService: NotifierService) {
    this.loadoutService.decalChanged$.subscribe(decal => this.changeDecal(decal));
    this.loadoutService.paintChanged$.subscribe(paint => this.changePaint(paint));
    this.loadoutService.wheelChanged$.subscribe(wheel => this.changeWheel(wheel));
    this.loadoutService.bodyChanged$.subscribe(body => this.changeBody(body));
    this.loadoutService.topperChanged$.subscribe(topper => this.changeTopper(topper));
    this.loadoutService.antennaChanged$.subscribe(antenna => this.changeAntenna(antenna));
  }

  isLoading() {
    return Object.values(this.loading).some(value => value);
  }

  ngOnInit() {
    DefaultLoadingManager.onProgress = (item, loaded, total) => {
      this.progress.total = total;
      this.progress.current = loaded;

      this.progress.percent = 100 * (this.progress.current - this.progress.start) /
        (this.progress.total - this.progress.start);
    };

    const width = this.canvasContainer.nativeElement.offsetWidth;
    const height = this.canvasContainer.nativeElement.offsetHeight;
    this.camera = new PerspectiveCamera(70, width / height, 0.01, 400);
    this.camera.position.x = 167.97478335547376;
    this.camera.position.y = 58.02658014964849;
    this.camera.position.z = -91.74632500987678;

    this.scene = new Scene();
    this.scene.background = new Color('#AAAAAA');

    this.renderer = new WebGLRenderer({canvas: this.canvas.nativeElement, antialias: true, logarithmicDepthBuffer: true});
    this.renderer.setSize(width, height);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enablePan = false;
    this.controls.minDistance = 100;
    this.controls.maxDistance = 300;
    this.controls.update();

    this.addLights();
    this.addControls();

    requestAnimationFrame(t => this.animate(t));

    const textureLoader = new PromiseLoader(new TextureLoader(DefaultLoadingManager));

    const bodyLoader = getBodyLoader(this.loadoutService.body.id);
    const decalLoader = StaticDecalLoader;
    const wheelLoader = getWheelLoader(this.loadoutService.wheel.id);

    const promises = [
      textureLoader.load('assets/mannfield_equirectangular.jpg'),
      bodyLoader.load(this.loadoutService.body, modelLoader, imageLoader, ROCKET_CONFIG),
      decalLoader.load(this.loadoutService.body, this.loadoutService.decal, imageLoader, ROCKET_CONFIG),
      wheelLoader.load(this.loadoutService.wheel, modelLoader, imageLoader, ROCKET_CONFIG),
      this.loadoutStore.initAll(this.loadoutService.body.id)
    ];

    Promise.all(promises).then(values => {
      this.processBackground(values[0]);

      this.body = createBodyModel(this.loadoutService.body, this.loadoutService.decal, values[1], values[2], this.loadoutService.paints,
        true);
      this.wheels = createWheelsModel(this.loadoutService.wheel, values[3], this.loadoutService.paints, true);

      this.applyBodyModel();
      this.applyWheelModel();
      this.applyHitbox();
      this.updateTextureService();

      this.initializing = false;
    }).catch(error => {
      console.error(error);
      this.notifierService.notify('error', 'Failed to initialize.');
    });
  }

  private resetProgress() {
    this.progress.start = this.progress.current;
    this.progress.percent = 0;
  }

  private addControls() {
    const gui: GUI = new dat.GUI({autoPlace: false, closed: true});

    // hitbox
    const hitboxFolder = gui.addFolder('hitbox');
    hitboxFolder.add(this.hitboxConfig, 'enabled').onChange(value => {
      if (value) {
        this.hitbox.addToScene(this.scene);
      } else {
        this.hitbox.removeFromScene(this.scene);
      }
    });

    // wheels
    const wheelsFolder = gui.addFolder('wheels');
    wheelsFolder.add(this.wheelsConfig, 'visible').onChange(value => {
      this.wheels.visible(value);
    });
    wheelsFolder.add(this.wheelsConfig, 'roll', 0, Math.PI * 2).onChange(value => {
      this.body.setWheelRoll(value);
    });
    wheelsFolder.add(this.wheelsConfig, 'yaw', -MAX_WHEEL_YAW, MAX_WHEEL_YAW).onChange(value => {
      this.body.setFrontWheelYaw(value);
    });

    // performance
    const perfFolder = gui.addFolder('performance');
    const perfLi = document.createElement('li');
    this.stats.dom.style.position = 'static';
    perfLi.appendChild(this.stats.dom);
    perfLi.classList.add('stats');
    // @ts-ignore
    perfFolder.__ul.appendChild(perfLi);

    gui.close();
    this.dgContainer.nativeElement.appendChild(gui.domElement);
  }

  private addLights() {
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
  }

  private processBackground(backgroundTexture: Texture) {
    // @ts-ignore
    this.scene.background = new WebGLRenderTargetCube(1024, 1024).fromEquirectangularTexture(this.renderer, backgroundTexture);

    // @ts-ignore
    const pmremGenerator = new PMREMGenerator(this.scene.background.texture);
    pmremGenerator.update(this.renderer);
    const pmremCubeUVPacker = new PMREMCubeUVPacker(pmremGenerator.cubeLods);
    pmremCubeUVPacker.update(this.renderer);
    this.cubeRenderTarget = pmremCubeUVPacker.CubeUVRenderTarget;
    this.envMap = this.cubeRenderTarget.texture;

    backgroundTexture.dispose();
    pmremGenerator.dispose();
    pmremCubeUVPacker.dispose();
  }

  private animate(time: number) {
    requestAnimationFrame(t => this.animate(t));

    if (this.body != undefined) {
      this.body.animate(time);
    }

    this.stats.update();

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
    this.body.dispose();

    const bodyLoader = getBodyLoader(this.loadoutService.body.id);
    const decalLoader = StaticDecalLoader;

    this.resetProgress();

    Promise.all([
      bodyLoader.load(this.loadoutService.body, modelLoader, imageLoader, ROCKET_CONFIG),
      decalLoader.load(this.loadoutService.body, this.loadoutService.decal, imageLoader, ROCKET_CONFIG),
      this.loadoutStore.loadDecals(body.id)
    ]).then(values => {
      this.body = createBodyModel(this.loadoutService.body, this.loadoutService.decal, values[0], values[1], this.loadoutService.paints,
        true);
      this.body.addWheelsModel(this.wheels);

      if (this.topper) {
        this.body.addTopperModel(this.topper);
      }

      if (this.antenna) {
        this.body.addAntennaModel(this.antenna);
      }

      this.applyBodyModel();
      this.applyHitbox();
      this.updateTextureService();
      this.loading.body = false;
    });
  }

  private changeDecal(decal: Decal) {
    this.loading.decal = true;
    this.resetProgress();
    StaticDecalLoader.load(this.loadoutService.body, this.loadoutService.decal, imageLoader, ROCKET_CONFIG).then(decalAssets => {
      this.body.changeDecal(decal, decalAssets, this.loadoutService.paints);
      this.loading.decal = false;
      this.updateTextureService();
    });
  }

  private changeWheel(wheel: Wheel) {
    this.loading.wheel = true;
    this.body.clearWheelsModel();
    this.wheels.dispose();
    this.resetProgress();
    const loader = getWheelLoader(wheel.id);
    loader.load(wheel, modelLoader, imageLoader, ROCKET_CONFIG).then(wheelsAssets => {
      this.wheels = createWheelsModel(wheel, wheelsAssets, this.loadoutService.paints, true);
      this.applyWheelModel();
      this.updateTextureService();
      this.loading.wheel = false;
    });
  }

  private applyWheelModel() {
    this.wheels.setEnvMap(this.envMap);
    this.body.addWheelsModel(this.wheels);
    this.body.setWheelRoll(this.wheelsConfig.roll);
  }

  private applyBodyModel() {
    this.validateBody();
    this.body.setEnvMap(this.envMap);
    this.body.addToScene(this.scene);
    this.body.setFrontWheelYaw(this.wheelsConfig.yaw);
  }

  private changePaint(paint) {
    switch (paint.type) {
      case 'primary':
        this.body.setPrimaryColor(paint.color);
        break;
      case 'accent':
        this.body.setAccentColor(paint.color);
        break;
      case 'body':
        this.body.setPaintColor(paint.color);
        break;
      case 'decal':
        this.body.setDecalPaintColor(paint.color);
        break;
      case 'wheel':
        this.wheels.setPaintColor(paint.color);
        break;
      case 'topper':
        if (this.topper) {
          this.topper.setPaintColor(paint.color);
        }
        break;
      default:
        console.error(`Unknown paint type ${paint.type}`);
        return;
    }
    this.updateTextureService();
  }

  private updateTextureService() {
    function addTexture(textureService: TextureService, key: string, material: Material) {
      if (material != undefined && 'map' in material) {
        // @ts-ignore
        textureService.set(key, material.map);
      } else {
        textureService.set(key, undefined);
      }
    }

    addTexture(this.textureService, 'body', this.body.bodyMaterial);
    addTexture(this.textureService, 'chassis', this.body.chassisMaterial);
    addTexture(this.textureService, 'rim', this.wheels.rimMaterial);
    addTexture(this.textureService, 'tire', this.wheels.tireMaterial);

    if (this.topper) {
      addTexture(this.textureService, 'topper', this.topper.material);
    } else {
      this.textureService.set('topper', undefined);
    }
  }

  private changeTopper(topper: Topper) {
    if (this.topper) {
      this.body.clearTopperModel();
      this.topper.dispose();
      this.topper = undefined;
    }

    if (topper === Topper.NONE) {
      return;
    }

    // TODO topper loading
    // this.loading.topper = true;
    // this.topper = new TopperModel(topper, this.loadoutService.paints, ROCKET_CONFIG);
    // this.resetProgress();
    // this.topper.load().then(() => {
    //   this.body.addTopperModel(this.topper);
    //   this.topper.setEnvMap(this.envMap);
    //   this.updateTextureService();
    //   this.loading.topper = false;
    // });
  }

  private changeAntenna(antenna: Antenna) {
    if (this.antenna) {
      this.body.clearAntennaModel();
      this.antenna.dispose();
      this.antenna = undefined;
    }

    if (antenna === Antenna.NONE) {
      return;
    }

    // TODO antenna loading
    // this.loading.antenna = true;
    // this.antenna = new AntennaModel(antenna, this.loadoutService.paints, ROCKET_CONFIG);
    // this.resetProgress();
    // this.antenna.load().then(() => {
    //   this.body.addAntennaModel(this.antenna);
    //   this.antenna.setEnvMap(this.envMap);
    //   this.validateAntenna();
    //   this.updateTextureService();
    //   this.loading.antenna = false;
    // });
  }

  private applyHitbox() {
    this.hitbox.applyBody(this.body);
  }

  private validateBody() {
    const body = this.loadoutService.body;

    if (this.body.antennaSocket == undefined) {
      console.warn(`Body ${body.name} has no antenna anchor.`);
      this.notifierService.notify('warning', `Antenna position of ${body.name} is unknown.`);
    }

    if (this.body.hatSocket == undefined) {
      console.warn(`Body ${body.name} has no topper anchor.`);
      this.notifierService.notify('warning', `Topper position of ${body.name} is unknown.`);
    }

    if (this.body.hitboxConfig == undefined || getHitboxModel(this.body.hitboxConfig.preset) == undefined) {
      console.warn(`The hitbox of body ${body.name} is unknown.`);
      this.notifierService.notify('warning', `Hitbox of ${body.name} is unknown.`);
    } else {
      if (this.body.hitboxConfig.translationX == undefined || this.body.hitboxConfig.translationZ == undefined) {
        console.warn(`Body ${body.name} missing hitbox translate values.`);
        this.notifierService.notify('warning', `${body.name} has incomplete hitbox data. Hitbox won't be accurate.`);
      }
    }

    if (this.body.wheelSettings == undefined) {
      console.warn(`${body.name} has no wheelSettings attribute`);
      this.notifierService.notify('warning', `Size of wheels are unknown for ${body.name}.`);
    }
  }

  validateAntenna() {
    const antenna = this.loadoutService.antenna;
    if (this.antenna.socket == undefined) {
      console.warn(`${antenna.stick} has no topper socket.`);
      this.notifierService.notify('warning', `The antenna stick has no socket.`);
    }
  }
}
