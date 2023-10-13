import { Component, OnInit } from '@angular/core';

import { CesiumDrawingManager } from '../../managers/cesium-drawing-manager';
import { CesiumManager } from '../../managers/cesium-manager';
import { Polygon } from '../polygon/polygon';

@Component({
  selector: 'cesium-drawing-controls',
  templateUrl: './cesium-drawing-controls.component.html',
  styleUrls: ['./cesium-drawing-controls.component.scss']
})
export class CesiumDrawingControlsComponent implements OnInit {

  polygon?: Polygon;

  constructor(public manager: CesiumManager) { }

  ngOnInit(): void { }

  togglePolygonMode() {
    if (!this.manager.drawingManager.polygon) {
      this.polygon = this.manager.drawingManager.createPolygon();
    } else {
      this.manager.drawingManager.removePolygon();
      this.polygon = null;
    }
  }
}
