import { Layer } from "./Layer";
import { LayerViewerImagery } from "./LayerViewerImagery";

export class LayerViewerWMTS extends LayerViewerImagery {

    constructor(layer: Layer) {
        super(layer, new Cesium.WebMapTileServiceImageryProvider({
            url: layer.options.url,
            layer: layer.options.layer,
            style: layer.options.style,
            format: layer.options.format,
            tileMatrixSetID: layer.options.tileMatrixSetID,
            enablePickFeatures: layer.options.enablePickFeatures,
            defaultAlpha: layer.opacity,
            minimumLevel: layer.options.minimumLevel,
            maximumLevel: layer.options.maximumLevel,
        }));
        this.show(layer.visibility);
    }    
}