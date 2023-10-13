import { InjectionToken } from "@angular/core";

export const ceCesiumConfig: CesiumModuleConfig = {
    imageryOptions: {
        bingMapsProvider: {
            key: ""
        }
    },
    ionOptions: {
        token: ""
    }
}

export const CE_CESIUM_CONFIG = new InjectionToken<CesiumModuleConfig>('ce.cesium.config', { providedIn: 'root', factory: () => ceCesiumConfig });

export interface CesiumImageryOptions {
    bingMapsProvider?: any;
}

export interface IonOptions {
    token: string;
}

export interface CesiumModuleConfig {
    imageryOptions: CesiumImageryOptions;
    ionOptions: IonOptions;
}