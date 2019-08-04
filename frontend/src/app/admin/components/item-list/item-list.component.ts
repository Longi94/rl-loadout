import { Component, Input, OnInit } from '@angular/core';
import { Item } from "../../../model/item";
import { environment } from "../../../../environments/environment";
import { ItemService } from "../../../service/item.service";
import { confirmMaterial } from "../../../shared/confirm-dialog/confirm-dialog.component";
import { MatDialog } from "@angular/material";
import { CreateBodyComponent } from "../dialog/create-body/create-body.component";

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss']
})
export class ItemListComponent implements OnInit {

  assetHost = environment.assetHost;
  items: any[] = [];
  createDialog;

  @Input('type')
  type: string;

  @Input('show-img')
  showImg: boolean = true;

  @Input('line1')
  line1: string = 'name';

  @Input('line2')
  line2: string;

  constructor(private itemService: ItemService,
              private dialog: MatDialog) { }

  ngOnInit() {
  }

  deleteItem(item: Item) {
    confirmMaterial(`Delete ${item[this.line1]}?`, this.dialog, () => {
      switch (this.type) {
        case 'body':
          this.itemService.deleteBody(item.id).subscribe(() => this.items.splice(this.items.indexOf(item), 1));
          break;
        default:
          console.warn(`Unknown item type: ${this.type}`);
          break;
      }
    });
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
