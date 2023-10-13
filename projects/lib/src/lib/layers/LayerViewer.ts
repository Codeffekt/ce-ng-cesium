import { IndexType } from "@codeffekt/ce-core-data";
import { CesiumHeadingPitchRange, CesiumViewer } from "../cesium-types";
import { Layer } from "./Layer";

export interface LayerViewerStyle {
    setOpacity(v: number, id?: IndexType): void;
    createStyle(): any;
}

export interface LayerViewer {
    isVisible(): boolean;
    show(v: boolean): void;
    setOpacity(v: number, id?: IndexType): void;
    add(viewer: CesiumViewer): Promise<void>;
    remove(viewer: CesiumViewer): void;    
    zoomTo(viewer: CesiumViewer, id: IndexType, offset?: CesiumHeadingPitchRange): void;
    update(viewer: CesiumViewer, layer: Layer);    
    setViewerStyle(style: LayerViewerStyle);
    getViewerStyle();
}
