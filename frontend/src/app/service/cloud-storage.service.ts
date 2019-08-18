import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';

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

        const icons = items.filter(item => item.name.startsWith('icons/') && item.name.length > 6);
        const textures = items.filter(item => item.name.startsWith('textures/') && item.name.length > 9);
        const models = items.filter(item => item.name.startsWith('models/') && item.name.length > 7);

        icons.sort(sortByDate);
        textures.sort(sortByDate);
        models.sort(sortByDate);

        return {
          icons: icons,
          textures: textures,
          models: models
        };
      })
    );
  }
}

function sortByDate(a, b) {
  return (a.updated < b.updated) ? 1 : ((a.updated > b.updated) ? -1 : 0);
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
