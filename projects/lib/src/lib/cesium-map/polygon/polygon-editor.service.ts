import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import "../../cesium-main";
import { CesiumViewer } from '../../cesium-types';
import { Polygon } from './polygon';
import { PolygonMode } from './polygon.model';

@Injectable()
export class PolygonEditorService {

  private _viewer: CesiumViewer;
  private _mode: PolygonMode = 'view';
  private _polygonsMap: Map<string, Polygon> = new Map<string, Polygon>();
  private _mode$ = new Subject<PolygonMode>();
  private _currentPolygon: Polygon | undefined;

  createPolygon(coordinates: any[] = []): Polygon {
    const polygon = new Polygon({ coordinates, viewer: this._viewer });
    this._polygonsMap.set(polygon.getId(), polygon);
    return polygon;
  }

  get(id: string): Polygon | undefined {
    return this._polygonsMap.get(id);
  }

  remove(id: string): void {
    const polygon = this.get(id);
    if (polygon) {
      polygon.remove();
      this._polygonsMap.delete(id);
    }
  }

  clear() {
    this._polygonsMap.forEach((polygon: Polygon, id: string) => this.remove(id));
    this._polygonsMap.clear();
  }

  setViewer(viewer: any) {
    this._viewer = viewer;
  }

  enterViewMode() {
    this.setPolygonsMode('view');
    this.setMode('view');
  }

  enterEditMode() {
    this.setPolygonsMode('edit');
    this.setMode('edit');
  }

  enterCreateMode(polygon: Polygon) {
    this.setPolygonsMode('view');
    this._currentPolygon = polygon;
    this._currentPolygon.setMode('create');
    this.setMode('create');
  }

  getMode(): PolygonMode {
    return this._mode;
  }

  modeChanges(): Observable<PolygonMode> {
    return this._mode$;
  }

  terminatePolygon() {
    if (this._currentPolygon) {
      this._currentPolygon.setMode('view');
    }
  }

  get polygons(): Polygon[] {
    return Array.from(this._polygonsMap.values());
  }

  private setMode(mode: PolygonMode) {
    this._mode = mode;
    this._mode$.next(mode);
  }

  private setPolygonsMode(mode: PolygonMode) {
    this.polygons.forEach(polygon => {
      polygon.setMode(mode);

    });
  }
}
