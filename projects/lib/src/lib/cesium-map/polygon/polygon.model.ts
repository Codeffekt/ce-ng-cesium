import { CesiumCartographic, CesiumViewer } from "../../cesium-types";

export interface PolygonConfig {
    id?: string,
    viewer: CesiumViewer,
    coordinates: CesiumCartographic[],
    style?: PolygonStyle,
    editStyle?: PolygonStyle,
    mode?: PolygonMode
}

export class PolygonStyle {
    lineColor?: string;
    lineWidth?: number;
    pointWidth?: number;
    pointColor?: string;
    polygonColor?: string;
    polygonAlpha?: number;
    lineType?: PolygonLineType
}

export type PolygonLineType = 'dashed' | 'solid'

export type PolygonMode = 'view' | 'edit' | 'create';