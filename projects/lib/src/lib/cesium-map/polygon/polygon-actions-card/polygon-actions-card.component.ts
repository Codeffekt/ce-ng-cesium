import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { filter } from 'rxjs/operators';
import { CesiumManager } from '../../../managers/cesium-manager';
import { Polygon } from '../polygon';
@UntilDestroy()
@Component({
  selector: 'ce-polygon-actions-card',
  templateUrl: './polygon-actions-card.component.html',
  styleUrls: ['./polygon-actions-card.component.scss']
})
export class CesiumPolygonActionsCardComponent implements OnInit {

  @Input() polygon: Polygon
  canValid: boolean;

  constructor(public manager: CesiumManager) { }

  ngOnInit(): void {
    this.polygon.events().pipe(
      untilDestroyed(this),
      filter(shapeEvt => shapeEvt.type === 'validity')
    ).subscribe(
      shapeEvt => {
        this.canValid = shapeEvt.params as boolean;
      }
    );
  }

  cancel(): void {
    this.manager.drawingManager.removePolygon();
  }

  validate(): void {
    this.manager.drawingManager.terminatePolygon();
  }
}
