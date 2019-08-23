import { Component, Input, OnInit } from '@angular/core';
import { Item } from '../../../model/item';
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

  constructor(private dialog: MatDialog) { }

  ngOnInit() {
    console.log('QWER')
    this.itemService.getAll().subscribe(items => this.items = items);
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

    dialogRef.afterClosed().subscribe(newBody => {
      if (newBody != undefined) {
        this.items.push(newBody);
      }
    });
  }
}
