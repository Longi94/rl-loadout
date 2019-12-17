import { Component, Inject, OnInit } from '@angular/core';
import { Body, Decal, Quality } from 'rl-loadout-lib';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CloudStorageService } from '../../../../service/cloud-storage.service';
import { CreateDialog } from '../create-dialog';
import { DecalsService } from '../../../../service/items/decals.service';
import { BodiesService } from '../../../../service/items/bodies.service';
import { ProductService } from '../../../../service/product.service';
import { Product } from '../../../../model/product';

@Component({
  selector: 'app-create-decal',
  templateUrl: './create-decal.component.html',
  styleUrls: ['./create-decal.component.scss']
})
export class CreateDecalComponent extends CreateDialog<Decal> implements OnInit {

  productType = 'decal';

  bodies: Body[];
  filteredBodies: Body[];

  constructor(dialogRef: MatDialogRef<CreateDecalComponent>,
              cloudService: CloudStorageService,
              decalsService: DecalsService,
              private bodiesService: BodiesService,
              snackBar: MatSnackBar,
              productService: ProductService,
              @Inject(MAT_DIALOG_DATA) data: Decal) {
    super(dialogRef, cloudService, snackBar, data, productService, decalsService);
    this.item = new Decal(
      undefined, undefined, '', Quality.COMMON, false
    );
  }

  ngOnInit() {
    super.ngOnInit();
    this.bodiesService.getAll().subscribe(bodies => {
      this.bodies = bodies;
      this.bodies.sort((a, b) => {
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
        return 0;
      });
      this.filteredBodies = this.bodies;
    });
  }

  onProduct(product: Product) {
    super.onProduct(product);

    // if it's a body specific decal, pre fill it
    if (product.name.includes(':')) {
      const bodyName = product.name.split(':')[0].toLowerCase();
      const decalBody = this.bodies.find(body => body.name.toLowerCase() === bodyName);

      if (decalBody != undefined) {
        this.item.body_id = decalBody.id;
      }
    }

    // if there is only one tga file, pre fill the map
    const tgaCount = this.selectedObjects.reduce((n, val) => {
      if (val.endsWith('.tga')) {
        return n + 1;
      }
      return n;
    }, 0);

    if (tgaCount === 1) {
      this.item.rgba_map = this.selectedObjects.find(value => value.endsWith('.tga'));
    }
  }

  filterBodies($event: string) {
    this.filteredBodies = this.bodies.filter(body => body.name.toLowerCase().includes($event.toLowerCase()));
  }
}
