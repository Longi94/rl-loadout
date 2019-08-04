import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class CloudStorageService {
  url: string = `https://www.googleapis.com/storage/v1/b/rl-loadout${environment.production ? '' : '-dev'}/o`;

  constructor(private httpClient: HttpClient) {
  }

  getObjects(): Observable<any> {
    return this.httpClient.get<ObjectsResponse>(this.url).pipe(
      map(value => {
        const items = value.items;

        return {
          icons: items.filter(item => item.name.startsWith('icons/') && item.name.length > 6),
          textures: items.filter(item => item.name.startsWith('textures/') && item.name.length > 9),
          models: items.filter(item => item.name.startsWith('models/') && item.name.length > 7)
        }
      })
    );
  }
}

class ObjectsResponse {
  kind: string;
  items: CloudObject[];
}

export class CloudObject {
  kind: string;
  id: string;
  selfLink: string;
  name: string;
  bucket: string;
  generation: string;
  metageneration: string;
  contentType: string;
  timeCreated: Date;
  updated: Date;
  storageClass: string;
  timeStorageClassUpdated: Date;
  size: string;
  md5Hash: string;
  mediaLink: string;
  crc32c: string;
  etag: string;
  eventBasedHold: boolean;
}
