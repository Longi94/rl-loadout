import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';

export class Objects {
  body: { [name: string]: string[] } = {};
  wheel: { [name: string]: string[] } = {};
  decal: { [name: string]: string[] } = {};
  topper: { [name: string]: string[] } = {};
  antenna: { [name: string]: string[] } = {};
}

@Injectable({
  providedIn: 'root'
})
export class CloudStorageService {
  url = `https://www.googleapis.com/storage/v1/b/rl-loadout${environment.production ? '' : '-dev'}/o`;

  constructor(private httpClient: HttpClient) {
  }

  async getObjects(): Promise<Objects> {
    const objs = new Objects();

    let pageToken: string = await this.getObjectsPage(objs);

    while (pageToken != undefined) {
      pageToken = await this.getObjectsPage(objs, pageToken);
    }

    return objs;
  }

  private async getObjectsPage(objs: Objects, pageToken?: string): Promise<string> {
    const url = this.url + (pageToken != undefined ? `?pageToken=${pageToken}` : '');

    return this.httpClient.get<ObjectsResponse>(url).pipe(
      map(value => {
        for (const item of value.items) {
          if (!item.name.endsWith('.jpg') &&
            (!item.name.endsWith('.glb') || item.name.endsWith('.draco.glb')) &&
            (!item.name.endsWith('.tga') || item.name.endsWith('_S.tga'))) {
            continue;
          }

          const segments = item.name.split('/');

          if (segments.length < 3) {
            continue;
          }

          if (objs[segments[0]][segments[1]] == undefined) {
            objs[segments[0]][segments[1]] = [];
          }

          if (segments[2].length > 0) {
            objs[segments[0]][segments[1]].push(item.name);
          }
        }

        return value.nextPageToken;
      })
    ).toPromise();
  }
}

function sortByDate(a, b) {
  return (a.updated < b.updated) ? 1 : ((a.updated > b.updated) ? -1 : 0);
}

class ObjectsResponse {
  kind: string;
  items: CloudObject[];
  nextPageToken: string;
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
