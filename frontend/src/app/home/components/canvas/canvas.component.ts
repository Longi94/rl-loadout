import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import {
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  MeshStandardMaterial,
  Color,
  SpotLight,
  TextureLoader,
  Texture,
  WebGLRenderTarget,
  AmbientLight
} from 'three';
import { LoadoutService } from '../../../service/loadout.service';
import { Decal } from '../../../model/decal';
import { BodyModel } from '../../../3d/body/body-model';
import { WheelsModel } from '../../../3d/wheels-model';
import { Wheel } from '../../../model/wheel';
import { promiseProgress } from '../../../utils/promise';
import { LoadoutStoreService } from '../../../service/loadout-store.service';
import { Body } from '../../../model/body';
import { EquirectangularToCubeGenerator } from 'three/examples/jsm/loaders/EquirectangularToCubeGenerator';
import { PromiseLoader } from '../../../utils/loader';
import { PMREMGenerator } from 'three/examples/jsm/pmrem/PMREMGenerator';
import { PMREMCubeUVPacker } from 'three/examples/jsm/pmrem/PMREMCubeUVPacker';
import { TextureService } from '../../../service/texture.service';
import { Topper } from '../../../model/topper';
import { TopperModel } from '../../../3d/topper-model';
import { AntennaModel } from '../../../3d/antenna-model';
import { Antenna } from '../../../model/antenna';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { getHitboxModel, HitboxModel } from '../../../3d/hitbox-model';
import { GUI } from 'dat-gui';
import * as dat from 'dat.gui';
import { NotifierService } from 'angular-notifier';
import * as Stats from 'stats.js';
import { createBodyModel } from '../../../3d/body/factory';

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
  initProgress = 0;
  loading = {
    body: false,
    decal: false,
    wheel: false,
    topper: false,
    antenna: false
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
    DRACOLoader.setDecoderPath('/assets/draco/');
    DRACOLoader.getDecoderModule().then();

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

    this.animate();

    const textureLoader = new PromiseLoader(new TextureLoader());

    this.loadoutService.loadDefaults().then(() => {
      this.body = createBodyModel(this.loadoutService.body, this.loadoutService.decal, this.loadoutService.paints);
      this.wheels = new WheelsModel(this.loadoutService.wheel, this.loadoutService.paints);

      const promises = [
        textureLoader.load('assets/mannfield_equirectangular.jpg'),
        this.body.load(),
        this.wheels.load(),
        this.loadoutStore.initAll(this.loadoutService.body.id)
      ];

      promiseProgress(promises, progress => {
        this.initProgress = 100 * (progress + 1) / (promises.length + 1);
      }).then(values => {
        this.processBackground(values[0]);
        this.applyBodyModel();
        this.applyWheelModel();
        this.applyHitbox();
        this.updateTextureService();
        this.initializing = false;
      }).catch(error => {
        console.error(error);
        this.notifierService.notify('error', 'Failed to initialize.');
      });
    }).catch(error => {
      console.error(error);
      this.notifierService.notify('error', 'Failed to initialize.');
    });
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

    this.body = createBodyModel(body, this.loadoutService.decal, this.loadoutService.paints);

    Promise.all([
      this.body.load(),
      this.loadoutStore.loadDecals(body.id)
    ]).then(() => {
      this.wheels.applyWheelConfig(this.body.getWheelConfig());

      if (this.topper) {
        this.topper.applyAnchor(this.body.hatSocket);
      }

      if (this.antenna) {
        this.antenna.applyAnchor(this.body.antennaSocket);
      }

      this.applyBodyModel();
      this.applyHitbox();
      this.updateTextureService();
      this.loading.body = false;
    });
  }

  private changeDecal(decal: Decal) {
    this.loading.decal = true;
    this.body.changeDecal(decal, this.loadoutService.paints).then(() => {
      this.loading.decal = false;
      this.updateTextureService();
    });
  }

  private changeWheel(wheel: Wheel) {
    this.loading.wheel = true;
    this.wheels.removeFromScene(this.scene);
    this.wheels.dispose();
    this.wheels = new WheelsModel(wheel, this.loadoutService.paints);
    this.wheels.load().then(() => {
      this.applyWheelModel();
      this.updateTextureService();
      this.loading.wheel = false;
    });
  }

  private applyWheelModel() {
    this.wheels.applyWheelConfig(this.body.getWheelConfig());
    this.wheels.setEnvMap(this.envMap);
    this.wheels.addToScene(this.scene);
  }

  private applyBodyModel() {
    this.validateBody();
    this.body.setEnvMap(this.envMap);
    this.body.addToScene(this.scene);
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
    function addTexture(textureService: TextureService, key: string, material: MeshStandardMaterial) {
      if (material != undefined) {
        textureService.set(key, material.map);
      } else {
        textureService.set(key, undefined);
      }
    }

    addTexture(this.textureService, 'body', this.body.bodyMaterial);
    addTexture(this.textureService, 'chassis', this.body.chassisMaterial);
    addTexture(this.textureService, 'rim', this.wheels.rimMaterial);

    if (this.topper) {
      addTexture(this.textureService, 'topper', this.topper.material);
    } else {
      this.textureService.set('topper', undefined);
    }
  }

  private changeTopper(topper: Topper) {
    if (this.topper) {
      this.topper.removeFromScene(this.scene);
      this.topper.dispose();
      this.topper = undefined;
    }

    if (topper === Topper.NONE) {
      return;
    }

    this.loading.topper = true;
    this.topper = new TopperModel(topper, this.loadoutService.paints);
    this.topper.load().then(() => {
      this.applyTopperModel();
      this.updateTextureService();
      this.loading.topper = false;
    });
  }

  private applyTopperModel() {
    this.topper.setEnvMap(this.envMap);
    this.topper.applyAnchor(this.body.hatSocket);
    this.topper.addToScene(this.scene);
  }

  private changeAntenna(antenna: Antenna) {
    if (this.antenna) {
      this.antenna.removeFromScene(this.scene);
      this.antenna.dispose();
      this.antenna = undefined;
    }

    if (antenna === Antenna.NONE) {
      return;
    }

    this.loading.antenna = true;
    this.antenna = new AntennaModel(antenna, this.loadoutService.paints);
    this.antenna.load().then(() => {
      this.applyAntennaModel();
      this.updateTextureService();
      this.loading.antenna = false;
    });
  }

  private applyAntennaModel() {
    this.antenna.setEnvMap(this.envMap);
    this.antenna.applyAnchor(this.body.antennaSocket);
    this.antenna.addToScene(this.scene);
    this.validateAntenna();
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
    if (this.antenna.socket == undefined) {
      console.warn(`${this.antenna.antennaUrl} has no topper socket.`);
      this.notifierService.notify('warning', `The antenna stick has no socket.`);
    }
  }
}
