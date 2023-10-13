import { Observable, Subject, Subscription } from "rxjs";
import { Polygon } from "../cesium-map/polygon/polygon";
import { CesiumViewer } from "../cesium-types";

export type CesiumDrawingShapeEventType = 'create' | 'remove' | 'edit' | 'terminate';

export type CesiumDrawingEvent = {
    type: CesiumDrawingShapeEventType,
    shape?: Polygon;
}

export class CesiumDrawingManager {

    polygon?: Polygon;

    private _viewer?: CesiumViewer;

    private _events$ = new Subject<CesiumDrawingEvent>();

    private subscription?: Subscription;

    constructor() { }

    destroy() {
        this.subscription.unsubscribe();
    }

    setViewer(viewer: CesiumViewer) {
        this._viewer = viewer;
    }

    createPolygon(): Polygon {
        if (!this._viewer) {
            throw new Error(`Cannot create polygon, viewer is undefined`);
        }

        if (this.polygon) {
            this.removePolygon();
        }

        this.polygon = new Polygon({
            viewer: this._viewer,
            coordinates: [],
            mode: 'create'
        });

        this.observePolygonEvents();

        return this.polygon;
    }

    editPolygon() {
        if (!this.polygon) {
            return;
        }
        this.polygon.mode = 'edit';
    }

    removePolygon() {
        this.polygon?.remove();
        this.polygon = undefined;
        this.notify({ type: 'remove' })
    }

    terminatePolygon() {
        if (!this.polygon) {
            return;
        }
        this.polygon.mode = 'view';
    }

    events(): Observable<CesiumDrawingEvent> {
        return this._events$;
    }

    private observePolygonEvents() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
        this.subscription = new Subscription();
        this.subscription.add(this.polygon.mode$.subscribe((mode) => {
            switch (mode) {
                case 'create':
                    this.notify({ type: 'create', shape: this.polygon });
                    break;

                case 'edit':
                    this.notify({ type: 'edit', shape: this.polygon });
                    break;

                case 'view':
                    this.notify({ type: 'terminate', shape: this.polygon });
                    break;

                default:
                    break;
            }
        }));
    }

    private notify(event: CesiumDrawingEvent) {
        this._events$.next(event);
    }
}