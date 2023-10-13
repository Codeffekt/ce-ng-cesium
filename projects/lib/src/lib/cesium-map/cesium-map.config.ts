import { CesiumOptions } from "../cesium-types";

// TODO: extends Cesium configuration
export interface CesiumMapConfig extends CesiumOptions {
    showDrawingControls: boolean;
}