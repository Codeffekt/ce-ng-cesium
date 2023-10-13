import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { startWith } from 'rxjs/operators';

@Injectable({ providedIn: 'root'})
export class MapLayoutService {

  private _panelExpanded = false;
  private _panelExpanded$ = new Subject<boolean>();  

  constructor() { }

  panelExpandedChanges(): Observable<boolean> {
    return this._panelExpanded$.pipe(startWith(this._panelExpanded));
  }  

  togglePanel() {
    this.setPanelExpanded(!this._panelExpanded);    
  }  

  setPanelExpanded(v: boolean) {
    this._panelExpanded = v;
    this._panelExpanded$.next(this._panelExpanded);
  }
}
