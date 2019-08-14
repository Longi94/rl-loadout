import { Component, OnInit } from '@angular/core';
import { ApiKeysService } from "../../../service/api-keys.service";
import { ApiKey } from "../../../model/api-key";

@Component({
  selector: 'app-api-keys',
  templateUrl: './api-keys.component.html',
  styleUrls: ['./api-keys.component.scss']
})
export class ApiKeysComponent implements OnInit {

  keys: ApiKey[] = [];

  constructor(private apiKeysService: ApiKeysService) {
  }

  ngOnInit() {
    this.apiKeysService.getKeys().subscribe(keys => this.keys = keys);
  }

  openCreateDialog() {

  }
}
