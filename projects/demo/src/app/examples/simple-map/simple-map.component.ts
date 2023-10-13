import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { IndexType } from '@codeffekt/ce-core-data';
import { CesiumImageryService, CesiumMapConfig, CesiumService } from '@codeffekt/ce-ng-cesium';


@Component({
  selector: 'app-simple-map',
  templateUrl: './simple-map.component.html',
  styleUrls: ['./simple-map.component.scss']
})
export class SimpleMapExampleConponent implements OnInit, AfterViewInit {

  @Input() mapId = 'map-test';

  @Input() taskId: IndexType;

  mapConfig: CesiumMapConfig = {
    timeline: false,
    fullscreenButton: false,
    navigationHelpButton: false,
    sceneModePicker: false,
    baseLayerPicker: true,
    homeButton: false,
    infoBox: true,
    animation: false,
    //terrainProvider: Cesium.createWorldTerrain(),
    terrainProvider: undefined,
    scene3DOnly: true,
    imageryProviderViewModels: undefined,
    geocoder: false,
    //requestRenderMode: true,    
    //maximumRenderTimeChange: Infinity,
    selectionIndicator: true,
    shadows: false,
    showDrawingControls: true,
  };

  items: any[] = [
    {
      title: "test"
    },
    {
      title: "test2"
    }
  ];

  constructor(
    private cesiumService: CesiumService,
    private imageryService: CesiumImageryService
  ) {
    this.mapConfig.imageryProviderViewModels = this.imageryService.createDefaultImagery();
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    console.log(this.cesiumService.getViewer(this.mapId));
    this.loadTestTile();
  }

  back() {
  }

  onHoverSelect($event) {
    console.log("onHoverSelect", $event);
  }

  onSelect($event) {
    console.log("onSelect", $event);
  }

  loadTestTile() {
    const viewer = this.cesiumService.getViewer(this.mapId).viewer;

    const tileset = new Cesium.Cesium3DTileset({ 
      //debugShowBoundingVolume: true,
      //debugShowViewerRequestVolume: true,      
    });

    tileset.style = new Cesium.Cesium3DTileStyle({
      //color: 'color("red")',
      color: {
        conditions: [
          ["${_type} === 'model'", "color('green')"],
          ["${freq} > 400", "color('red')"],
          ["${freq} > 200", "color('yellow')"],
          ["${freq} > 100", "color('green')"],
          ["${freq} > 50", "color('blue')"],                             
          ["true", "color('white')"],
        ],
      },
      pointSize: {
        evaluate: (evaluate) => 20,
      },      
      labelText: {
        evaluate: (feature) => `${feature.getProperty("freq")}`                
      },
      labelColor: 'color("yellow")',
      backgroundEnabled: 'true',
      show: {
        conditions: [
          ["${_type} === 'model'", "true"],
          ["${_type} === 'tile'", "true"],
          ["${_type} === 'point'", "true"],
          ["true", "true"],
        ],
      }      
    });

    console.log(tileset.style);

    viewer.scene.primitives.add(tileset);

    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(5.440175, 45.577721, 15000)
      //destination: Cesium.Cartesian3.fromRadians(0.10864659155806913, 0.8495739039725326, 15000)
    });

    const highlighted = {
      feature: undefined,
      originalColor: new Cesium.Color(),
    };

    (<any>viewer).screenSpaceEventHandler.setInputAction((
      movement) => {

      if (Cesium.defined(highlighted.feature)) {
        highlighted.feature.color = highlighted.originalColor;
        highlighted.feature = undefined;
      }

      const pickedFeature = viewer.scene.pick(movement.endPosition);
      if (!Cesium.defined(pickedFeature)) {
        return;
      }

      highlighted.feature = pickedFeature;
      Cesium.Color.clone(
        pickedFeature.color,
        highlighted.originalColor
      );
      pickedFeature.color = Cesium.Color.YELLOW;
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
  }
}
