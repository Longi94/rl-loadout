import { environment } from "../../environments/environment";

export function getAssetUrl(asset: string) {
  if (asset == undefined || asset.length == 0) {
    return undefined;
  }
  return `${environment.assetHost}/${asset}`;
}
