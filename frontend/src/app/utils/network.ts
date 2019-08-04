import { environment } from "../../environments/environment";
import { MatSnackBar } from "@angular/material";

export function getAssetUrl(asset: string) {
  if (asset == undefined || asset.length == 0) {
    return undefined;
  }
  return `${environment.assetHost}/${asset}`;
}

export function handleErrorSnackbar(error, snackBar: MatSnackBar) {
  if (error.status === 401) {
    snackBar.open('Invalid username of password', null, {
      duration: 2000
    });
  } else {
    snackBar.open(error.error.msg, null, {
      duration: 2000
    });
  }
}

export function parseJwt(token: string) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
  return JSON.parse(jsonPayload);
}
