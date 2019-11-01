import { Component, Input, OnInit } from '@angular/core';
import { Item } from 'rl-loadout-lib';
import { environment } from '../../../../environments/environment';
import { confirmMaterial } from '../../../shared/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material';
import { AbstractItemService } from '../../../service/abstract-item-service';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss']
})
export class ItemListComponent implements OnInit {

  assetHost = environment.assetHost;
  items: any[] = [];

  @Input()
  createDialog;

  @Input()
  itemService: AbstractItemService<any>;

  @Input()
  showImg = true;

  @Input()
  line1 = 'name';

  @Input()
  line2: string;

  constructor(private dialog: MatDialog) {
  }

  ngOnInit() {
    this.itemService.getAll().subscribe(items => {
      this.items = items;
      this.items.sort((a, b) => {
        if (a[this.line1] > b[this.line1]) {
          return 1;
        } else if (a[this.line1] < b[this.line1]) {
          return -1;
        } else {
          return 0;
        }
      });
    });
  }

  deleteItem(item: Item) {
    confirmMaterial(`Delete ${item[this.line1]}?`, this.dialog, () => {
      this.itemService.delete(item.id).subscribe(() => this.removeItem(item));
    });
  }

  removeItem(item: Item) {
    this.items.splice(this.items.indexOf(item), 1);
  }

  openCreateDialog() {
    const dialogRef = this.dialog.open(this.createDialog, {
      width: '500px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(newItem => {
      if (newItem != undefined) {
        this.items.push(newItem);
      }
    });
  }

  openEditDialog(item: Item) {
    const dialogRef = this.dialog.open(this.createDialog, {
      width: '500px',
      disableClose: true,
      data: Object.assign({}, item)
    });

    dialogRef.afterClosed().subscribe(newItem => {
      if (newItem != undefined) {
        Object.assign(item, newItem);
      }
    });
  }
}
