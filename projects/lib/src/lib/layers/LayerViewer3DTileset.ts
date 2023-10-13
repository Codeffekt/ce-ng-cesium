import { CesiumViewer } from "../cesium-types";
import { Layer } from "./Layer";
import { LayerViewer, LayerViewerStyle } from "./LayerViewer";

export class LayerViewer3DTileset implements LayerViewer {

    private tileset: any;
    private viewerStyle?: LayerViewerStyle;

    constructor(private layer: Layer) {

        this.tileset = new Cesium.Cesium3DTileset({
            url: layer.options.url,
            show: this.layer.visibility
        });
    }

    zoomTo(viewer: CesiumViewer, id: string): void {
        throw new Error("Method not implemented.");
    }

    setOpacity(opacity: number): void {
        if(this.viewerStyle) {
            this.viewerStyle.setOpacity(opacity);
            this.tileset.style = this.viewerStyle.createStyle();
        }
    }

    show(isShown: boolean): void {
        this.tileset.show = isShown;
    }

    isVisible(): boolean {
        return this.tileset.show;
    }

    async add(viewer: CesiumViewer) {
        if (!viewer.scene.primitives.contains(this.tileset)) {
            viewer.scene.primitives.add(this.tileset);
        }
    }

    remove(viewer: CesiumViewer): void {
        viewer.scene.primitives.remove(this.tileset);
    }

    update(viewer: CesiumViewer, layer: Layer) {

    }

    setViewerStyle(style: LayerViewerStyle) {        
        this.viewerStyle = style;
        this.tileset.style = style.createStyle();
    }

    getViewerStyle() {
        return this.getViewerStyle();
    }
}