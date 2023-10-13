export type CesiumWidget = any;

export interface CesiumEntity {
    show: boolean;
    [extra: string]: any;
}

export interface CesiumDataSource {
    entities: CesiumEntityCollection;
    show: boolean;
}

export interface CesiumDataSourceCollection {
    add(source: CesiumDataSource): void;
    remove(source: CesiumDataSource, destroy?: boolean | undefined): boolean;
}

export interface CesiumEntityCollection {
    values: CesiumEntity[];
    add(entityDesc: any): CesiumEntity;
    removeAll(): void;
    remove(entity: CesiumEntity);
    contains(entity: CesiumEntity): boolean;
}

export interface CesiumViewer {
    scene: any;
    camera: any;
    cesiumWidget: CesiumWidget;
    datasSurces: any[];
    entities: CesiumEntityCollection;
    dataSources: CesiumDataSourceCollection;
    selectedEntity: CesiumEntity;
    trackedEntity: CesiumEntity;
    clock: any;
    zoomTo(entity: CesiumEntity, offset?: CesiumHeadingPitchRange): void;
}

export interface CesiumCartesian2 {
    x: number;
    y: number
}
export interface CesiumCartesian3 {
    x: number;
    y: number;
    z: number;
}

export interface CesiumCartographic {
    latitude: number;
    longitude: number;
    height?: number;
}

export interface CesiumScreenSpaceEventHandler {
    setInputAction(action: (eveent: CesiumScreenSpaceEvent) => void, type?: number, modifier?: number);
    destroy(): void;
}

export interface CesiumScreenSpaceEvent {
    position?: CesiumCartesian2 | undefined;
    startPosition?: CesiumCartesian2 | undefined;
    endPosition?: CesiumCartesian2 | undefined;
}

export interface CesiumHeadingPitchRange {
    heading: number;
    pitch: number;
    range: number;
}
export interface CesiumOptions {
    animation?: boolean | undefined;
    baseLayerPicker?: boolean | undefined;
    fullscreenButton?: boolean | undefined;
    vrButton?: boolean | undefined;
    geocoder?: boolean | undefined;
    homeButton?: boolean | undefined;
    infoBox?: boolean | undefined;
    sceneModePicker?: boolean | undefined;
    selectionIndicator?: boolean | undefined;
    timeline?: boolean | undefined;
    navigationHelpButton?: boolean | undefined;
    navigationInstructionsInitiallyVisible?: boolean | undefined;
    scene3DOnly?: boolean | undefined;
    shouldAnimate?: boolean | undefined;
    clockViewModel?: any;
    selectedImageryProviderViewModel?: any | undefined;
    imageryProviderViewModels?: CesiumProviderViewModel[] | undefined;
    selectedTerrainProviderViewModel?: CesiumProviderViewModel | undefined;
    terrainProviderViewModels?: CesiumProviderViewModel[] | undefined;
    imageryProvider?: CesiumImageryProvider | false | undefined;
    terrainProvider?: CesiumTerrainProvider | undefined;
    skyBox?: CesiumSkyBox | false | undefined;
    skyAtmosphere?: CesiumSkyAtmosphere | false | undefined;
    fullscreenElement?: Element | string | undefined;
    useDefaultRenderLoop?: boolean | undefined;
    targetFrameRate?: number | undefined;
    showRenderLoopErrors?: boolean | undefined;
    automaticallyTrackDataSourceClocks?: boolean | undefined;
    contextOptions?: any;
    sceneMode?: CesiumSceneMode | undefined;
    mapProjection?: CesiumMapProjection | undefined;
    globe?: CesiumGlobe | false | undefined;
    orderIndependentTranslucency?: boolean | undefined;
    creditContainer?: Element | string | undefined;
    creditViewport?: Element | string | undefined;
    dataSources?: CesiumDataSourceCollection | undefined;
    terrainExaggeration?: number | undefined;
    shadows?: boolean | undefined;
    terrainShadows?: CesiumShadowMode | undefined;
    mapMode2D?: CesiumMapMode2D | undefined;
    projectionPicker?: boolean | undefined;
    requestRenderMode?: boolean | undefined;
    maximumRenderTimeChange?: number | undefined
}

export type CesiumProviderViewModel = any;
export type CesiumShadowMode = any;
export type CesiumMapMode2D = any;
export type CesiumMapProjection = any;
export type CesiumImageryProvider = any;
export type CesiumTerrainProvider = any;
export type CesiumSkyBox = any;
export type CesiumSkyAtmosphere = any;
export type CesiumSceneMode = any;
export type CesiumGlobe = any;