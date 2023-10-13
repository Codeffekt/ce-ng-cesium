import { Inject, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import './cesium-main';
import { CesiumManager } from './managers/cesium-manager';
import { CesiumViewer } from './cesium-types';
import { CE_CESIUM_CONFIG, CesiumModuleConfig } from './models/core.model';

export interface CesiumServiceEvent {
  type: "CREATE_VIEWER";
  elt: CesiumViewerElt;
}

export interface CesiumViewerElt {
  viewer: CesiumViewer;
  elt: HTMLElement;
  id: string;
}

interface CesiumViewerInstances {
  [key: string]: CesiumViewerElt;
}

@Injectable({ providedIn: 'root' })
export class CesiumService {

  private mgrs: CesiumManager[] = [];
  private viewers: CesiumViewerInstances = {};
  private renderer: Renderer2;
  private managers$ = new ReplaySubject<CesiumManager[]>();

  eventsService$: Subject<CesiumServiceEvent> = new Subject();

  constructor(
    @Inject(CE_CESIUM_CONFIG) config: CesiumModuleConfig,
    rendererFactory: RendererFactory2
  ) {
    Cesium.Ion.defaultAccessToken = config.ionOptions.token;
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  addManager(mgr: CesiumManager) {
    this.mgrs.push(mgr);
    this.managers$.next(this.mgrs);
  }

  removeManager(mgr: CesiumManager) {
    const idx = this.mgrs.indexOf(mgr);
    if (idx !== -1) {
      this.mgrs.splice(idx, 1);
    }
    this.managers$.next(this.mgrs);
  }

  getManager(mapId: string) {
    return this.mgrs.find(_ => _.mapId === mapId);
  }

  createViewer(mapId: string, config: any) {
    if (!this.viewers[mapId]) {
      const container = this.renderer.createElement('div');
      this.renderer.addClass(container, "cesium-container-service");
      this.viewers[mapId] = {
        viewer: new Cesium.Viewer(container, config),
        elt: container,
        id: mapId
      };
      this.eventsService$.next({
        type: "CREATE_VIEWER",
        elt: this.viewers[mapId]
      });
    }
    return this.viewers[mapId];
  }

  removeViewer(mapId: string) {
    this.viewers[mapId] = undefined;
  }

  getViewer(mapId: string) {
    return this.viewers[mapId];
  }

  observeManagers(): Observable<CesiumManager[]> {
    return this.managers$;
  }
}
