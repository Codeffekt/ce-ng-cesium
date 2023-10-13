import { Subject, Subscription } from "rxjs";
import { filter } from "rxjs/operators";
import "../cesium-main";
import { CesiumEvent, CesiumManager, PickOptions } from "../managers/cesium-manager";

const CESIUM_CLIPPING_SLIDER_ID = 'geostat-handler';

export interface ModelClippingSliderParams {
    minValue?: number;
    maxValue?: number;
    value: number;
    location: number[];    
    dimension: number[];
    offset: number[];
}

export interface CesiumClippingSliderOptions extends ModelClippingSliderParams {
    plane: any;
}

export class CesiumClippingSlider {

    handlerValue$: Subject<number> = new Subject();

    private subscriptions: Subscription = new Subscription();

    private entity: any;
    private isOnSelection = false;

    private currentValue = 0;

    private localRef: any;
    private localRefInv: any;
    private startDistanceOffset: number;
    private mapPositionTmp: any = new Cesium.Cartesian3();

    constructor(private manager: CesiumManager, private options: CesiumClippingSliderOptions) {
        this.currentValue = this.options.value;
    }

    create() {

        this.computeInvTransform();
        this.createEntity();
        this.registerEvents();

        return this.handlerValue$;
    }

    destroy() {

        if (!this.entity) {
            return;
        }

        this.manager.viewer.entities.remove(this.entity);

        this.subscriptions.unsubscribe();
    }

    setVisible(v: boolean) {
        if (!this.entity) {
            return;
        }
        this.entity.show = v;
    }

    private computeInvTransform() {

        this.localRef = Cesium.Transforms.eastNorthUpToFixedFrame(
            Cesium.Cartesian3.fromDegrees(this.options.location[0], this.options.location[1], 0)
        );
        this.localRefInv = Cesium.Matrix4.inverseTransformation(this.localRef, new Cesium.Matrix4());
    }

    private createEntity() {

        const position = this.getGlobalPosition(
            new Cesium.Cartesian3(this.options.offset[0], this.options.offset[1], this.options.offset[2])
            , new Cesium.Cartesian3());

        this.entity =
            this.manager.viewer.entities.add({
                id: CESIUM_CLIPPING_SLIDER_ID,
                position: position,
                plane: {
                    dimensions: new Cesium.Cartesian2(this.options.dimension[0], this.options.dimension[1]),
                    material: Cesium.Color.WHITE.withAlpha(0.2),
                    outline: true,
                    outlineColor: Cesium.Color.DARKORANGE,
                    plane: new Cesium.CallbackProperty(
                        this.createPlaneUpdateFunction.bind(this)(this.options.plane),
                        false
                    ),
                }
            });
    }

    private registerEvents() {

        this.subscriptions = new Subscription();

        this.subscriptions.add(this.manager.registerEvent({
            event: CesiumEvent.LEFT_DOWN,
            pick: PickOptions.PICK_FIRST
        }).pipe(
            filter(result => (result.cesiumEntities && result.cesiumEntities.length > 0) &&
                (result.cesiumEntities[0].id === CESIUM_CLIPPING_SLIDER_ID)),
        )
            .subscribe(_ => {
                this.isOnSelection = true;
                this.startDistanceOffset = this.currentValue + this.getEastDistanceFromWindowCoords(_.click.position);
                this.setEntitySelectedStyle();
                this.manager.viewer.scene.screenSpaceCameraController.enableInputs = false;
            }));


        this.subscriptions.add(
            this.manager.registerEvent({
                event: CesiumEvent.LEFT_UP,
                pick: PickOptions.NO_PICK
            }).subscribe(_ => {
                if (this.isOnSelection) {
                    this.isOnSelection = false;
                    this.setEntityUnselectStyle();
                    this.manager.viewer.scene.screenSpaceCameraController.enableInputs = true;
                }
            }));

        this.subscriptions.add(this.manager.registerEvent({
            event: CesiumEvent.MOUSE_MOVE,
            pick: PickOptions.NO_PICK
        }).subscribe((result) => {
            if (this.isOnSelection) {
                this.currentValue = - this.getEastDistanceFromWindowCoords(result.click.endPosition) + this.startDistanceOffset;
                this.handlerValue$.next(this.currentValue);
            }
        }));
    }

    private createPlaneUpdateFunction(plane) {
        return () => {
            plane.distance = this.currentValue;
            return plane;
        };
    }

    private getEastDistanceFromWindowCoords(coords: any) {
        const mapCoords = this.manager.viewer.camera.pickEllipsoid(coords);
        this.mapPositionTmp = this.getLocalPosition(mapCoords, this.mapPositionTmp);
        return this.mapPositionTmp.x;
    }

    private getLocalPosition(position: any, result: any) {
        return Cesium.Matrix4.multiplyByPoint(this.localRefInv, position, result);
    }

    private getGlobalPosition(position: any, result: any) {
        return Cesium.Matrix4.multiplyByPoint(this.localRef, position, result);
    }

    private setEntitySelectedStyle() {
        this.entity.plane.material = Cesium.Color.WHITE.withAlpha(0.05);
        this.entity.plane.outlineColor = Cesium.Color.DARKORANGE;
    }

    private setEntityUnselectStyle() {
        this.entity.plane.material = Cesium.Color.WHITE.withAlpha(0.2);
        this.entity.plane.outlineColor = Cesium.Color.DARKORANGE;
    }
}