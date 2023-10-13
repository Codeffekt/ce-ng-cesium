import { Layer } from "./Layer";
import { LayerViewerImagery } from "./LayerViewerImagery";

export class LayerViewerBingMaps extends LayerViewerImagery {

    constructor(layer: Layer) {
        super(
            layer,
            new Cesium.BingMapsImageryProvider({
                url: layer.options.url,
                key: layer.options.key,
                mapStyle: layer.options.mapStyle
            }));
    }    
}