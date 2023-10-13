export type Layer3DTileDataType = 'array' | 'object' | 'value';

export type Layer3DTileData = { [key: string]: any };

export type LayerType =
    '3dtileset' |
    'bing-imagery' |
    'wms' |
    'wmts' |
    'cesium-terrain' |
    'czml' |
    'geojson';

export interface Layer {
    id: string;
    opacity: number;
    visibility: boolean;
    name: string;
    type: LayerType;
    options:
    Layer3DTilesetOptions |
    LayerWMSOptions |
    LayerBingMapsImageryOptions |
    LayerGeojsonOptions |
    any;
    style?: Layer3DTilesetStyle;
};

export interface Layer3DTilesetOptions {
    url: string;
}

export interface LayerGeojsonOptions {
    data: Object;
}

export interface Layer3DTilesetStyle {
    strokeColor?: string;
    fillColor?: string;
}

export interface LayerImageryOptions {
    name: string;
    iconUrl?: string;
    tooltip?: string;
}

export interface LayerBingMapsImageryOptions {
    url: string;
    key: string;
    tileProtocol?: string;
    mapStyle: string;
    culture?: string;
}

export interface LayerWMSOptions extends LayerImageryOptions {
    url: string;
    layers: string;
    minimumLevel: number;
    maximumLevel: number;
    enablePickFeatures: boolean;
}