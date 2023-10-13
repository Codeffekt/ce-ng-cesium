import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { CesiumManager } from '../managers/cesium-manager';
import { CesiumCartesian3 } from '../cesium-types';
import { CesiumService, CesiumViewerElt } from '../cesium.service';
import { CesiumMapConfig } from './cesium-map.config';
import { PolygonEditorService } from './polygon/polygon-editor.service';
import { CesiumDrawingManager } from '../managers/cesium-drawing-manager';


const DEFAULT_CONFIG: CesiumMapConfig = {
  showDrawingControls: true
}
@Component({
  selector: 'cesium-map',
  templateUrl: './cesium-map.component.html',
  styleUrls: ['./cesium-map.component.scss'],
  providers: [
    PolygonEditorService,
    CesiumManager,
    CesiumDrawingManager
  ]
})
export class CesiumMapComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('cesiumContainer', { static: true }) cesiumContainer: ElementRef;
  @Input() config: CesiumMapConfig;
  @Input() mapId: string; // unique id to register

  private viewerElt: CesiumViewerElt;

  constructor(
    private cesiumService: CesiumService,
    private renderer: Renderer2,
    private cesiumManager: CesiumManager
  ) {
  }

  ngOnInit() {
    this.config = { ...DEFAULT_CONFIG, ...this.config };
  }

  ngAfterViewInit() {

    this.viewerElt = this.cesiumService.createViewer(this.mapId, this.config);
    this.renderer.appendChild(this.cesiumContainer.nativeElement, this.viewerElt.elt);
    this.cesiumManager.init(this.mapId, this.viewerElt.viewer);
    this.cesiumService.addManager(this.cesiumManager);
  }

  ngOnDestroy() {
    this.cesiumManager.destroy();
    this.cesiumService.removeManager(this.cesiumManager);
  }

  get viewer() {
    return this.viewerElt.viewer;
  }

  getManager(): CesiumManager {
    return this.cesiumManager;
  }

  flyTo(destination: CesiumCartesian3, duration?: number) {
    this.viewerElt.viewer.camera.flyTo({ destination, duration });
  }
}

