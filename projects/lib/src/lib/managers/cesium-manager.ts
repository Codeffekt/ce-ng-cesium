import { Injectable } from "@angular/core";
import { Observable, ReplaySubject, Subject } from "rxjs";
import { take } from "rxjs/operators";
import "../cesium-main";
import { CesiumEntity, CesiumViewer } from '../cesium-types';
import { CesiumDrawingManager } from "./cesium-drawing-manager";
//import { Viewer, ScreenSpaceEventType, ScreenSpaceEventHandler, defined } from 'cesium';

export enum CesiumEvent {
    LEFT_CLICK = Cesium.ScreenSpaceEventType.LEFT_CLICK,
    LEFT_DOUBLE_CLICK = Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK,
    LEFT_DOWN = Cesium.ScreenSpaceEventType.LEFT_DOWN,
    LEFT_UP = Cesium.ScreenSpaceEventType.LEFT_UP,
    MOUSE_MOVE = Cesium.ScreenSpaceEventType.MOUSE_MOVE
}

export enum PickOptions {
    NO_PICK,
    PICK_FIRST
}

export interface CesiumEventInput {
    event: CesiumEvent; //any; //Cesium.ScreenSpaceEventType.LEFT_CLICK | Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK;
    pick: PickOptions;
}

export interface CesiumEventResult {
    cesiumEntities?: CesiumEntity[];
    click: any;
}

@Injectable()
export class CesiumManager {

    private _destroy: Subject<boolean> = new Subject();


    private _mapId: string;
    private _viewer: CesiumViewer;
    readonly drawingManager = new CesiumDrawingManager();

    constructor() { }

    init(mapId: string, viewer: CesiumViewer) {
        this._mapId = mapId;
        this._viewer = viewer;
        this.drawingManager.setViewer(viewer);
    }

    registerEvent(action: CesiumEventInput): Observable<CesiumEventResult> {

        const obs = new Observable<CesiumEventResult>((observer) => {

            const handler = new Cesium.ScreenSpaceEventHandler(this._viewer.scene.canvas);

            handler.setInputAction((click: any) => {
                if (action.pick === PickOptions.NO_PICK) {
                    observer.next({ click });
                } else {
                    const pickedObject = this._viewer.scene.pick(click.position);
                    if (Cesium.defined(pickedObject)) {
                        observer.next({
                            click,
                            cesiumEntities: [pickedObject.id]
                        });
                    }
                }
            }, action.event);

            this._destroy.pipe(take(1)).subscribe(() => {
                handler.removeInputAction(action.event);
                observer.complete();
            });

        });

        return obs;
    }

    get mapId() {
        return this._mapId;
    }

    get viewer() {
        return this._viewer;
    }

    destroy() {
        this._destroy.next(true);
    }
}