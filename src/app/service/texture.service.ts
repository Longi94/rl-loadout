import { Injectable } from '@angular/core';
import { Texture } from "three";

@Injectable({
  providedIn: 'root'
})
export class TextureService {

  private textures: { [key: string]: Texture } = {};

  constructor() {
  }

  set(key: string, t: Texture) {
    this.textures[key] = t;
  }

  get(key: string) {
    return this.textures[key];
  }

  getKeys() {
    return Object.keys(this.textures);
  }
}
