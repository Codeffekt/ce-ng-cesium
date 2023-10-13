import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { GeoJSONFeatureCollection } from '@codeffekt/ce-core-data';
import {
  CesiumViewer, CesiumImageryService,
  CesiumService, MapLayerViewerService, Layer, LutNames, Lut
} from '@codeffekt/ce-ng-cesium';
import { GEOJSON_PARCELLES } from './geojson-parcelles';

const LAYER_ID = "geojson";

const ENTITY_ID = "55010000AW0001";

const MAP_VIEWER_ID = 'map-test';

const CESIUM_MAP_CONFIG: any = {
  timeline: false,
  fullscreenButton: false,
  navigationHelpButton: false,
  sceneModePicker: false,
  baseLayerPicker: true,
  homeButton: false,
  infoBox: false,
  animation: false,
  terrainProvider: undefined,
  scene3DOnly: true,
  imageryProviderViewModels: undefined,
  geocoder: false,
  requestRenderMode: false,
  maximumRenderTimeChange: Infinity,
  selectionIndicator: false,
  shadows: false,
  terrainProviderViewModels: []
};

@Component({
  selector: 'app-geojson',
  templateUrl: './geojson.component.html',
  styleUrls: ['./geojson.component.scss']
})
export class GeojsonComponent implements OnInit, AfterViewInit {

  @Input() mapId = MAP_VIEWER_ID;

  mapConfig = CESIUM_MAP_CONFIG;

  viewer!: CesiumViewer;

  currentMode: LutNames = "grayscale";

  modes: LutNames[] = ["blackbody", "cooltowarm", "grayscale", "rainbow"];

  constructor(
    private imageryService: CesiumImageryService,
    private cesiumService: CesiumService,
    private mapLayerViewerService: MapLayerViewerService,
  ) {
    this.mapConfig.imageryProviderViewModels = this.imageryService.createDefaultImagery();
  }

  ngOnInit(): void {
  }

  async ngAfterViewInit() {
    this.initViewer();
    await this.onModeChanged();
    this.zoomTo();
  }

  async onModeChanged() {
    await this.colorizeLut(this.currentMode);
  }

  private async colorizeLut(lutName: LutNames) {
    const minMax = this.getMinMaxPropValue(
      GEOJSON_PARCELLES.features.map(f => f.properties), "contenance"
    );

    const rainbow = new Lut({
      lut: lutName,
      nColors: 16,
      minV: minMax.min,
      maxV: minMax.max
    });

    rainbow.buildLut();

    const collection = {
      ...this.getCollection(),
      features: this.getCollection().features.map(f => ({
        ...f,
        properties: {
          ...f.properties,
          fill: rainbow.getColor(f.properties["contenance"] as number),
          stroke: "#000000",
          "stroke-opacity": 0
        }
      }))
    };    

    await this.loadLayers(collection);
  }

  private zoomTo() {
    const layerViewer = this.mapLayerViewerService.getLayer(LAYER_ID);
    layerViewer.zoomTo(this.viewer, ENTITY_ID);
  }

  private initViewer() {
    this.viewer = this.cesiumService.getViewer(this.mapId).viewer;
  }

  private async loadLayers(collection: GeoJSONFeatureCollection) {
    const layer = this.getGeoJSONLayer(collection);
    this.mapLayerViewerService.removeLayer(layer, this.viewer);
    await this.mapLayerViewerService.addLayer(layer, this.viewer);
  }

  private getGeoJSONLayer(collection: GeoJSONFeatureCollection): Layer {
    return {
      id: 'geojson',
      opacity: 1.0,
      visibility: true,
      name: 'GeoJson',
      type: 'geojson',
      options: {
        data: collection
      }
    };
  }

  private getCollection(): GeoJSONFeatureCollection {
    return GEOJSON_PARCELLES;
  }

  private getMinMaxPropValue(properties: any[], key: string): { min: number, max: number } {
    return properties.reduce((prev, cur) => ({
      min: Math.min(prev.min, cur[key]),
      max: Math.max(prev.max, cur[key])
    }), { min: +Infinity, max: -Infinity })
  }

}
