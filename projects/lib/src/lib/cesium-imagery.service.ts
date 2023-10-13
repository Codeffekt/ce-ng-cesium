import { Inject, Injectable } from "@angular/core";
import { CesiumImageryFactory } from "./cesium-imagery";
import { CesiumModuleConfig, CE_CESIUM_CONFIG } from "./models/core.model";

@Injectable({ providedIn: 'root'})
export class CesiumImageryService {

    constructor(
        @Inject(CE_CESIUM_CONFIG) private config: CesiumModuleConfig
    ) { }

    createDefaultImagery() {
        return CesiumImageryFactory.createImageryProviderViewModels(this.config.imageryOptions);
    }

}