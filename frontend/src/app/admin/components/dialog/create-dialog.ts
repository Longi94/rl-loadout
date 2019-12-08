import { OnInit } from '@angular/core';
import { Quality } from 'rl-loadout-lib';
import { CloudStorageService, Objects } from '../../../service/cloud-storage.service';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AbstractItemService } from '../../../service/abstract-item-service';
import { handleErrorSnackbar } from '../../../utils/network';
import { ProductService } from '../../../service/product.service';
import { Product } from '../../../model/product';
import { Item } from 'rl-loadout-lib';

export abstract class CreateDialog<T> implements OnInit {

  qualities = [
    {value: Quality.COMMON, name: 'Common'},
    {value: Quality.UNCOMMON, name: 'Uncommon'},
    {value: Quality.RARE, name: 'Rare'},
    {value: Quality.VERY_RARE, name: 'Very rare'},
    {value: Quality.IMPORT, name: 'Import'},
    {value: Quality.EXOTIC, name: 'Exotic'},
    {value: Quality.BLACK_MARKET, name: 'Black market'},
    {value: Quality.LIMITED, name: 'Limited'},
    {value: Quality.PREMIUM, name: 'Premium'}
  ];

  objects: Objects = new Objects();
  productType: string;
  filteredProducts: string[] = [];
  selectedObjects: string[] = [];
  selectedProduct: string;

  item: T;
  isNew = true;

  productTimer: number;

  protected constructor(protected dialogRef: MatDialogRef<any>,
                        private cloudService: CloudStorageService,
                        private snackBar: MatSnackBar,
                        private data: T,
                        private productService: ProductService,
                        protected itemService: AbstractItemService<T>) {
  }

  ngOnInit() {
    this.cloudService.getObjects().then(value => {
      this.objects = value;
      this.filteredProducts = Object.keys(this.objects[this.productType]);
    });
    this.isNew = this.data == undefined;

    if (!this.isNew) {
      this.item = this.data;
    }
  }

  save() {
    if (this.isNew) {
      this.itemService.add(this.item).subscribe(() => {
        this.dialogRef.close(this.item);
      }, error => handleErrorSnackbar(error, this.snackBar));
    } else {
      // @ts-ignore
      this.itemService.update(this.item.id, this.item).subscribe(() => {
        this.dialogRef.close(this.item);
      }, error => handleErrorSnackbar(error, this.snackBar));
    }
  }

  cancel() {
    this.dialogRef.close();
  }

  selectProduct($event: string) {
    this.selectedObjects = [];

    if ($event in this.objects[this.productType]) {
      this.selectedObjects = this.selectedObjects.concat(this.objects[this.productType][$event]);
    }
    if ('shared' in this.objects[this.productType]) {
      this.selectedObjects = this.selectedObjects.concat(this.objects[this.productType]['shared']);
    }

    if (this.selectedObjects.length === 0) {
      return;
    }

    if (this.item instanceof Item) {
      const icon = this.selectedObjects.find(value => value.endsWith('.jpg'));
      if (icon != undefined) {
        this.item.icon = icon;
      }
    }
  }

  filterProducts($event: string) {
    this.filteredProducts = Object.keys(this.objects[this.productType]).filter(value => value.toLowerCase().includes($event.toLowerCase()));
  }

  onIdUpdate(id: number) {
    if (id != undefined && !isNaN(id)) {
      if (this.productTimer != undefined) {
        window.clearTimeout(this.productTimer);
      }

      this.productTimer = window.setTimeout(() => {
        this.productService.get(id).subscribe(product => {
          this.productTimer = undefined;
          this.onProduct(product);
        }, error => {
          console.error(error);
          this.selectedProduct = undefined;
          if (this.item instanceof Item) {
            this.item.name = undefined;
          }
        });
      }, 500);
    }
  }

  onProduct(product: Product) {
    this.selectedProduct = product.product_name;
    this.selectProduct(this.selectedProduct);
    if (this.item instanceof Item) {
      this.item.name = product.name;
    }
  }
}
