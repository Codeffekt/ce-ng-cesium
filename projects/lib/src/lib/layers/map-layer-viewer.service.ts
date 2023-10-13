import { Injectable } from "@angular/core";
import { IndexType } from "@codeffekt/ce-core-data";
import { CesiumViewer } from "../cesium-types";
import { Layer } from "./Layer";
import { LayerViewer } from "./LayerViewer";
import { LayerViewerFactory } from "./LayerViewerFactory";

interface LayerViewerAssoc {
    layer: Layer;
    layerViewer: LayerViewer;
    viewer: CesiumViewer;
}

@Injectable({
    providedIn: 'root'
})
export class MapLayerViewerService {

    private viewerAssocs: LayerViewerAssoc[] = [];

    constructor(
        private layerViewerFactory: LayerViewerFactory
    ) { }

    addLayers(layers: Layer[], viewer: CesiumViewer) {
        for (const layer of layers) {
            this.addLayer(layer, viewer);
        }
    }

    async addLayer(layer: Layer, viewer: CesiumViewer): Promise<LayerViewer|undefined> {
        if (!this.viewerAssocs.find(elt => elt.layer.id === layer.id)) {
            const layerViewer = this.layerViewerFactory.createViewer(layer);
            if (layerViewer) {
                await layerViewer.add(viewer);
                this.viewerAssocs.push({
                    layer,
                    layerViewer,
                    viewer
                });
            }
            return layerViewer;
        }
        return undefined;
    }

    removeLayer(layer: Layer, viewer: CesiumViewer) {
        this.removeLayerWithId(layer.id, viewer);
    }

    removeLayerWithId(layerId: string, viewer: CesiumViewer) {
        const viewerAssocIdx = this.viewerAssocs.findIndex(va => va.layer.id === layerId);
        if (viewerAssocIdx !== -1) {
            this.viewerAssocs[viewerAssocIdx].layerViewer.remove(viewer);
            this.viewerAssocs.splice(viewerAssocIdx, 1);
        }
    }

    getLayer(id: IndexType): LayerViewer | undefined {
        const layerViewerAssoc = this.viewerAssocs.find(viewerAssoc => viewerAssoc.layer.id === id);
        return layerViewerAssoc?.layerViewer;
    }

    showLayer(id: string, v: boolean) {
        const viewerAssoc = this.viewerAssocs.find(elt => elt.layer.id === id);
        if (viewerAssoc) {
            viewerAssoc.layerViewer.show(v);
        }
    }

    setLayerOpacity(id: string, opacity: number) {
        const viewerAssoc = this.viewerAssocs.find(elt => elt.layer.id === id);
        if (viewerAssoc) {
            viewerAssoc.layerViewer.setOpacity(opacity);
        }
    }
}