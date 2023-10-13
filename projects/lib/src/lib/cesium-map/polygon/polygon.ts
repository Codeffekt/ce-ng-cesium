import { CesiumCartesian3, CesiumCartographic, CesiumDataSource, CesiumEntity, CesiumScreenSpaceEvent, CesiumScreenSpaceEventHandler, CesiumViewer } from "../../cesium-types";
import { Observable, ReplaySubject, Subject, Subscription } from "rxjs";
import { v4 as uuidv4 } from 'uuid';
import { PolygonConfig, PolygonMode, PolygonStyle } from "./polygon.model";
import { GeoJSONFeature, GeoJSONPolygon } from "@codeffekt/ce-core-data";
import { filter } from "rxjs/operators";

const DEFAULT_POLYGON_VIEW_STYLE: PolygonStyle = {
    lineColor: '#FFFFFF',
    lineWidth: 2,
    pointWidth: 0,
    pointColor: '#92FF82',
    polygonColor: '#FFFFFF',
    polygonAlpha: 0,
    lineType: 'solid'
}

const DEFAULT_POLYGON_EDIT_STYLE: PolygonStyle = {
    lineColor: '#92FF82',
    lineWidth: 3,
    pointWidth: 15,
    pointColor: '#92FF82',
    polygonColor: '#92FF82',
    polygonAlpha: 0.2,
    lineType: 'dashed'
}

const DEFAULT_CONFIG: PolygonConfig = {
    viewer: undefined,
    coordinates: [],
    style: DEFAULT_POLYGON_VIEW_STYLE,
    editStyle: DEFAULT_POLYGON_EDIT_STYLE,
    mode: 'view'
}

export type PolygonEventParams = CesiumEntity | PolygonMode | boolean;
export class PolygonEvent {
    type: 'mode' | 'add-point' | 'move-point' | 'remove-point' | 'validity'
    params: PolygonEventParams;
}

const REQUIRED_MIN_POLYGON_POINTS = 3;
export class Polygon {

    readonly mode$ = new ReplaySubject<PolygonMode>();

    private _events$ = new Subject<PolygonEvent>();
    private _isValid = false;
    private _id: string;
    private _active = false;
    private _datasource: CesiumDataSource;
    private _eventsHandler: CesiumScreenSpaceEventHandler;
    private _points: CesiumEntity[] = [];
    private _positions: CesiumCartesian3[] = [];
    private _selectedPoint: CesiumEntity;
    private _floatingPoint: CesiumEntity;
    private _mode: PolygonMode;
    private _virtualPoints: CesiumEntity[] = [];
    private _subscription?: Subscription;

    constructor(private config: PolygonConfig) {
        this.overrideDefaultConfig();
        this.initDataSource();
        this.createPoints(config.coordinates);
        this.attachEventListeners();
        this.setMode(this.config.mode);
        this.initValidityObserver();
    }

    clear() {
        this._points = [];
        this._datasource.entities.removeAll();
        this.updatePositions();
    }

    remove(): void {
        this.viewer.dataSources.remove(this._datasource);
        this.destroy();
    }

    destroy(): void {
        this.detachEventListeners();
        this._subscription.unsubscribe();
    }

    getId(): string {
        return this._id;
    }


    setMode(mode: PolygonMode) {
        this._mode = mode;
        this.mode$.next(this._mode);
        this.notifyEvent({ type: 'mode', params: mode });
        switch (this._mode) {
            case 'view':
                this.removeFloatingPoint();
                this.detachEventListeners();
                break;

            case 'edit':
                this.removeFloatingPoint();
                this.createVirtualPoints();
                this.attachEventListeners();
                break;

            case 'create':
                this.attachEventListeners();
                break;
        }
        this.draw();
    }

    get mode() {
        return this._mode;
    }

    set mode(mode: PolygonMode) {
        this.setMode(mode);
    }

    getMode(): PolygonMode {
        return this._mode;
    }

    setActive(isActive: boolean) {
        this._active = isActive;
    }

    isActive(): boolean {
        return this._active;
    }

    coordinates(): CesiumCartographic[] {
        return this._points
            .map(point => point.position.getValue(this.viewer.clock.currentTime))
            .map(position => Cesium.Cartographic.fromCartesian(position));
    }

    getGeoJson(): GeoJSONFeature<GeoJSONPolygon> {
        const coordinates: number[][] = this.coordinates().map(cc => [
            Cesium.Math.toDegrees(cc.longitude),
            Cesium.Math.toDegrees(cc.latitude)
        ]) as any[];
        return {
            id: this._id,
            properties: {},
            type: "Feature",
            geometry: {
                type: "Polygon",
                coordinates: [
                    [
                        ...coordinates,
                        coordinates[0]
                    ]
                ]
            }
        };
    }

    events(): Observable<PolygonEvent> {
        return this._events$;
    }

    get isValid() {
        return this._isValid;
    }

    static valid(polygon: Polygon): boolean {
        return polygon.coordinates().length >= REQUIRED_MIN_POLYGON_POINTS;
    }

    private initValidityObserver() {
        this._subscription = this._events$.pipe(
            filter(event => event.type === 'add-point' || event.type === 'move-point' || event.type === 'remove-point')
        ).subscribe(_ => {
            this._isValid = Polygon.valid(this);
            this.notifyValidity(this._isValid);
        })
    }

    private initDataSource() {
        this._datasource = new Cesium.CustomDataSource(this.config.id);
        this.viewer.dataSources.add(this._datasource);
    }

    private overrideDefaultConfig() {
        this.config = {
            id: uuidv4(),
            ...DEFAULT_CONFIG,
            ...this.config,
            style: { ...DEFAULT_POLYGON_VIEW_STYLE, ...this.config.style },
            editStyle: { ...DEFAULT_POLYGON_EDIT_STYLE, ...this.config.editStyle },
        };
    }

    private draw(): void {
        if (this._datasource.entities.values.length) {
            this._datasource.entities.removeAll();
        }

        this.drawPoints();
        this.drawPolygon();
        this.drawPolylines();

        if (this._mode === 'edit') {
            this.drawVirtualPoints();
        }
    }

    private drawPolygon(): void {
        const style = this._mode === 'view' ? this.config.style : this.config.editStyle;
        this._datasource.entities.add({
            polygon: {
                hierarchy: new Cesium.CallbackProperty(() => new Cesium.PolygonHierarchy(this._positions), false),
                material: new Cesium.ColorMaterialProperty(
                    Cesium.Color.fromCssColorString(style.polygonColor).withAlpha(style.polygonAlpha)
                ),
            },
        });
    }

    private drawVirtualPoints(): void {
        this._virtualPoints.forEach(virtualPoint => {
            this.drawPoint(virtualPoint);
        });
    }

    private drawPolylines(): void {
        const style = this._mode === 'view' ? this.config.style : this.config.editStyle;
        this._datasource.entities.add({
            polyline: {
                positions: new Cesium.CallbackProperty(() => [...this._positions, this._positions[0]], false),
                width: style.lineWidth,
                material: (style.lineType === 'solid' ?
                    new Cesium.ColorMaterialProperty(
                        Cesium.Color.fromCssColorString(style.lineColor))
                    : new Cesium.PolylineDashMaterialProperty({
                        color: Cesium.Color.fromCssColorString(style.lineColor)
                    })),
            },
        });
    }

    private drawPoint(pointEntity: CesiumEntity) {
        const style = this._mode === 'view' ? this.config.style : this.config.editStyle;
        pointEntity.point = {
            color: Cesium.Color.fromCssColorString(style.pointColor),
            pixelSize: style.pointWidth / (pointEntity.virtualPoint ? 1.6 : 1),
            disableDepthTestDistance: Number.POSITIVE_INFINITY
        };
        this._datasource.entities.add(pointEntity);
    }

    private drawPoints() {
        this._points.forEach(point => this.drawPoint(point));
    }

    private createPoint(position: CesiumCartesian3, options?: { index?: number, isVirtualPoint?: boolean }) {
        const point: CesiumEntity = new Cesium.Entity({
            position: position,
            virtualPoint: options?.isVirtualPoint
        });

        if (options?.index !== undefined) {
            this._points.splice(options.index, 0, point);
        } else {
            this._points.push(point);
        }

        this.updatePositions();
        return point;
    }

    private createPoints(coordinates: CesiumCartographic[]) {
        coordinates.forEach((coords, index) => {
            const position = Cesium.Cartesian3.fromDegrees(coords.longitude, coords.latitude);
            this.createPoint(position);
        });

        this.createVirtualPoints();
    }

    private createVirtualPoint(firstPoint: CesiumCartesian3, secondPoint: CesiumCartesian3, index: number) {
        const midPosition = Cesium.Cartesian3.lerp(firstPoint, secondPoint, 0.5, new Cesium.Cartesian3());
        const point = new Cesium.Entity({
            position: midPosition,
            virtualPoint: true,
            index
        });
        this._virtualPoints.push(point);
    }

    private createVirtualPoints() {
        this._virtualPoints = [];
        if (this._points.length < 2) {
            return;
        }
        this._points.forEach((point, index) => {
            if (index < this._points.length) {
                const firstPoint = this._points[index].position.getValue(this.viewer.clock.currentTime);
                const secondPoint = this._points[(index + 1) % this._points.length].position.getValue(this.viewer.clock.currentTime);
                this.createVirtualPoint(firstPoint, secondPoint, index + 1);
            }
        });
    }

    private updateVirtualPoints() {
        this.clearVirtualPoints();
        this.createVirtualPoints();
        this.drawVirtualPoints();
    }

    private clearVirtualPoints() {
        this._virtualPoints
            .forEach((point) => {
                this._datasource.entities.remove(point);
            })

        this._virtualPoints = [];
    }

    private removePoint(point: CesiumEntity) {
        this._datasource.entities.remove(point);
        const index = this._points.indexOf(point);
        if (index !== -1) {
            this._points.splice(index, 1);
        }
        this.updatePositions();
    }

    private updatePositions() {
        this._positions = this._points.map(point => point.position.getValue(this.viewer.clock.currentTime));
    };

    private attachEventListeners(): void {
        if (this._eventsHandler != null) {
            return;
        }
        this._eventsHandler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
        this.viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
        this._eventsHandler.setInputAction((event) => this.onLeftClick(event), Cesium.ScreenSpaceEventType.LEFT_CLICK);
        this._eventsHandler.setInputAction((event) => this.onLeftDown(event), Cesium.ScreenSpaceEventType.LEFT_DOWN);
        this._eventsHandler.setInputAction((event) => this.onLeftUp(event), Cesium.ScreenSpaceEventType.LEFT_UP);
        this._eventsHandler.setInputAction((event) => this.onRightClick(event), Cesium.ScreenSpaceEventType.RIGHT_CLICK);
        this._eventsHandler.setInputAction((event) => this.onMouseMove(event), Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    }

    private detachEventListeners() {
        if (this._eventsHandler) {
            this._eventsHandler.destroy();
            this._eventsHandler = null;
        }
    }

    private onLeftClick(event: CesiumScreenSpaceEvent) {
        if (this._mode === 'create') {
            const position = this.viewer.camera.pickEllipsoid(event.position, this.viewer.scene.globe.ellipsoid);
            const newPoint = this.createPoint(position);
            this.drawPoint(newPoint);

            if (this._floatingPoint) {
                this.removePoint(this._floatingPoint);
            }
            this._floatingPoint = this.createPoint(position);
            this.drawPoint(this._floatingPoint);

            this.notifyAddPoint(newPoint);
        }
    }

    private onLeftDown(event: CesiumScreenSpaceEvent) {
        if (this._mode === 'edit') {
            var pickedObject = this.viewer.scene.pick(event.position);
            if (Cesium.defined(pickedObject)) {
                if (this.isPoint(pickedObject.id) || this.isVirtualPoint(pickedObject.id)) {
                    this._selectedPoint = pickedObject.id;
                }
            }
        }
    }

    private onMouseMove(event: CesiumScreenSpaceEvent) {
        switch (this._mode) {
            case 'create':
                if (this._floatingPoint || this._points.length === 1) {
                    const position = this.viewer.camera.pickEllipsoid(event.endPosition, this.viewer.scene.globe.ellipsoid);
                    if (!this._floatingPoint) {
                        this._floatingPoint = this.createPoint(position);
                        this.drawPoint(this._floatingPoint);
                    } else {
                        this._floatingPoint.position.setValue(position);
                        this.updatePositions();
                    }
                }
                break;

            case 'edit':
                if (this._selectedPoint) {
                    const position = this.viewer.camera.pickEllipsoid(event.endPosition, this.viewer.scene.globe.ellipsoid);

                    if (this.isVirtualPoint(this._selectedPoint)) {
                        const newPoint = this.createPoint(position, { index: this._selectedPoint.index });
                        this.drawPoint(newPoint);
                        this._selectedPoint = newPoint;
                        this.notifyAddPoint(newPoint);
                    }
                    else {
                        this._selectedPoint.position.setValue(position);
                        this.notifyMovePoint(this._selectedPoint);
                    }

                    this.updatePositions();
                    this.updateVirtualPoints();
                    this.viewer.scene.screenSpaceCameraController.enableRotate = false;
                }
                break;
        }
    }

    private onLeftUp(event: CesiumScreenSpaceEvent) {
        if (this._selectedPoint) {
            this._selectedPoint = null;
            this.viewer.scene.screenSpaceCameraController.enableRotate = true;
        }
    }

    private onRightClick(event: CesiumScreenSpaceEvent) {
        switch (this._mode) {
            case 'edit':
                const pickedObject = this.viewer.scene.pick(event.position);
                if (Cesium.defined(pickedObject) && this.isPoint(pickedObject.id)) {
                    this.removePoint(pickedObject.id);
                    this.updateVirtualPoints();
                    this.removePoint(pickedObject);
                    this.notifyRemovePoint(pickedObject);
                }

                if (!this._points.length) {
                    this.setMode('create');
                }

                break;
            case 'create':
                if (this._points.length >= REQUIRED_MIN_POLYGON_POINTS) {
                    this.setMode('edit');
                }
                break;
        }
    }

    private removeFloatingPoint() {
        if (this._floatingPoint) {
            this.removePoint(this._floatingPoint);
            this._floatingPoint = null;
        }
    }

    private isPoint(entity: CesiumEntity): boolean {
        return this._points.findIndex(point => point.id === entity.id) !== -1;
    }

    private isVirtualPoint(entity: CesiumEntity): boolean {
        return this._virtualPoints.findIndex(point => point.id === entity.id) !== -1;
    }

    private get viewer(): CesiumViewer { return this.config.viewer; }

    private notifyValidity(isValid: boolean) {
        this.notifyEvent({ type: 'validity', params: isValid });
    }

    private notifyAddPoint(point: CesiumEntity) {
        this.notifyEvent({ type: 'add-point', params: point });
    }

    private notifyRemovePoint(point: CesiumEntity) {
        this.notifyEvent({ type: 'remove-point', params: point });
    }

    private notifyMovePoint(point: CesiumEntity) {
        this.notifyEvent({ type: 'move-point', params: point });
    }

    private notifyEvent(event: PolygonEvent) {
        this._events$.next(event)
    }
}

