import { RocketConfig } from '../model/rocket-config';

export async function doRequest<T>(request: RequestInfo | string): Promise<T> {
    const response = await fetch(request);
    const json = await response.json();

    if (!response.ok) {
        throw {
            status: response.status,
            body: json
        }
    }

    return json as T;
}

export function getAssetUrl(path: string, rocketConfig: RocketConfig): string {
    if (path == undefined || path.length === 0) {
        return undefined;
    }
    return `${rocketConfig.assetHost}/${path}`;
}
