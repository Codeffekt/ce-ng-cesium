import { CesiumViewer } from "../cesium-types";
import { Layer } from "./Layer";
import { LayerViewer, LayerViewerStyle } from "./LayerViewer";

export class LayerViewerImagery implements LayerViewer {    
    protected imageryLayer: any;
    
    constructor(protected layer: Layer, protected provider: any) {        
        this.createImageryLayer();
        this.show(layer.visibility);
    }    
    
    setViewerStyle(style: LayerViewerStyle) {
        throw new Error("Method not implemented.");
    }
    getViewerStyle() {
        throw new Error("Method not implemented.");
    }

    zoomTo(viewer: CesiumViewer, id: string): void {
        throw new Error("Method not implemented.");
    }

    setOpacity(v: number): void {
        this.imageryLayer.alpha = v;
    }

    isVisible(): boolean {
        return this.imageryLayer.show;
    }

    show(v: boolean): void {
        this.imageryLayer.show = v;
    }

    async add(viewer: CesiumViewer) {
        if (!viewer.scene.imageryLayers.contains(this.imageryLayer)) {
            viewer.scene.imageryLayers.add(this.imageryLayer);
        }
    }

    remove(viewer: CesiumViewer): void {
        viewer.scene.imageryLayers.remove(this.imageryLayer);
    }

    update(viewer: CesiumViewer, layer: Layer) {

    }

    protected setProvider(provider: any) {
        this.provider = provider;
        this.createImageryLayer();
    }

    private createImageryLayer() {
        this.imageryLayer = new Cesium.ImageryLayer(this.provider, {
            alpha: this.layer.opacity
        });
    }

}