import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { CesiumImageryService, CesiumManager, CesiumMapComponent, CesiumService, Polygon, PolygonEditorService } from '@codeffekt/ce-ng-cesium';
import { CesiumMapConfig } from 'projects/lib/src/lib/cesium-map/cesium-map.config';
import { CesiumDrawingShapeEventType } from 'projects/lib/src/lib/managers/cesium-drawing-manager';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-drawing',
  templateUrl: './drawing.component.html',
  styleUrls: ['./drawing.component.scss'],
  providers: [PolygonEditorService],
})
export class DrawingExampleComponent implements OnInit, AfterViewInit {

  @Input() mapId = 'drawing-map';
  @ViewChild(CesiumMapComponent) cesiumMap: CesiumMapComponent;

  mode: CesiumDrawingShapeEventType | undefined;
  manager: CesiumManager;
  isValid: boolean;

  mapConfig: CesiumMapConfig = {
    infoBox: false,
    timeline: false,
    animation: false,
    homeButton: false,
    selectionIndicator: false,
    showDrawingControls: false
  };

  constructor(private imageryService: CesiumImageryService, private cesiumService: CesiumService) {
    this.mapConfig.imageryProviderViewModels = this.imageryService.createDefaultImagery();
  }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    this.manager = this.cesiumService.getManager(this.mapId);
    this.manager.drawingManager.events().subscribe(event => {
      this.mode = event.type;
    });
  }

  polygon: Polygon;
  createPolygon() {
    this.polygon = this.manager.drawingManager.createPolygon();
    this.polygon.events()
      .pipe(filter(event => event.type === 'validity'))
      .subscribe(event => this.isValid = event.params as boolean);
  }

  cancel() {
    this.manager.drawingManager.removePolygon();
  }

  terminate() {
    this.manager.drawingManager.terminatePolygon();
  }
}
