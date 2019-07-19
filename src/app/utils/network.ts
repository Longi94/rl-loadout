import { environment } from "../../environments/environment";

export function getAssetUrl(asset: string) {
  if (asset == undefined) {
    return undefined;
  }
  return `${environment.assetHost}/${asset}`;
}
