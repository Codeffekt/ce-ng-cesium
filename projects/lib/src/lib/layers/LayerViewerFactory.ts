import { Injectable } from "@angular/core";
import { Layer, LayerType } from "./Layer";
import { LayerViewer } from "./LayerViewer";
import { LayerViewer3DTileset } from "./LayerViewer3DTileset";
import { LayerViewerBingMaps } from "./LayerViewerBingMaps";
import { LayerViewerGeoJson } from "./LayerViewerGeoJson";
import { LayerViewerWMS } from "./LayerViewerWMS";
import { LayerViewerWMTS } from "./LayerViewerWMTS";

const FACTORY_METHODS: {
    type: LayerType,
    creator: (layer: Layer) => LayerViewer
}[] = [
        {
            type: '3dtileset',
            creator: (layer: Layer) => new LayerViewer3DTileset(layer)
        },
        {
            type: 'wms',
            creator: (layer: Layer) => new LayerViewerWMS(layer)
        },
        {
            type: 'wmts',
            creator: (layer: Layer) => new LayerViewerWMTS(layer)
        },
        {
            type: 'bing-imagery',
            creator: (layer: Layer) => new LayerViewerBingMaps(layer)
        },
        {
            type: 'geojson',
            creator: (layer: Layer) => new LayerViewerGeoJson(layer)
        }
    ]


@Injectable({ providedIn: 'root' })
export class LayerViewerFactory {

    createViewer(layer: Layer): LayerViewer | undefined {

        const factoryElt = FACTORY_METHODS.find(elt => elt.type === layer.type);

        if (!factoryElt) {
            return undefined;
        }

        return factoryElt.creator(layer);
    }

    setLayerFactoryMethod(type: LayerType, creator: (layer: Layer) => LayerViewer) {
        const factoryEltIdx = FACTORY_METHODS.findIndex(elt => elt.type === type);
        if(factoryEltIdx === -1) {
            FACTORY_METHODS.push({ type, creator });
        } else {
            FACTORY_METHODS[factoryEltIdx] = { type, creator };
        }
    }

}