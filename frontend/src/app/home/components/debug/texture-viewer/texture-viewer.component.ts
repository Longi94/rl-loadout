import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TextureService } from "../../../../service/texture.service";
import { DataTexture, Texture } from "three";
import { MatSnackBar } from "@angular/material";

@Component({
  selector: 'app-texture-viewer',
  templateUrl: './texture-viewer.component.html',
  styleUrls: ['./texture-viewer.component.scss']
})
export class TextureViewerComponent implements OnInit {

  @ViewChild('canvas', {static: true})
  canvasRef: ElementRef;
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  canvasWidth = 900;
  canvasHeight = 900;

  textures: string[];

  selected: string;

  constructor(private textureService: TextureService,
              private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.textures = this.textureService.getKeys();
    this.canvas = this.canvasRef.nativeElement;
    this.context = this.canvas.getContext('2d');
  }

  selectTexture() {
    let texture = this.textureService.get(this.selected);

    if (texture == undefined) {
      this.snackBar.open('texture is undefined', undefined, {duration: 2000});
      return;
    }
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    let width = texture.image.width;
    let height = texture.image.height;

    this.canvas.width = width;
    this.canvas.height = height;

    this.canvasWidth = Math.min(width, 900);
    this.canvasHeight = this.canvasWidth * (height / width);

    if (texture instanceof DataTexture) {
      let imageData = new ImageData(new Uint8ClampedArray(texture.image.data), width, height);
      this.context.putImageData(imageData, 0, 0);
    } else {
      this.context.drawImage(texture.image, 0, 0)
    }
  }
}
