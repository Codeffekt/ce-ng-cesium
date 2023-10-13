import { Layer } from "./Layer";
import { LayerViewerImagery } from "./LayerViewerImagery";

export class LayerViewerWMS extends LayerViewerImagery {

    constructor(layer: Layer) {
        super(layer, new Cesium.WebMapServiceImageryProvider({
            url: layer.options.url,
            layers: layer.options.layers,
            minimumLevel: layer.options.minimumLevel,
            maximumLevel: layer.options.maximumLevel,
            enablePickFeatures: layer.options.enablePickFeatures,
            defaultAlpha: layer.opacity
        }));
        this.show(layer.visibility);
    }    
}