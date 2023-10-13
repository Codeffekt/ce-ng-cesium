import { IndexType } from "@codeffekt/ce-core-data";
import { CesiumHeadingPitchRange, CesiumViewer } from "../cesium-types";
import { Layer } from "./Layer";
import { LayerViewer, LayerViewerStyle } from "./LayerViewer";

export class LayerViewerGeoJson implements LayerViewer {
    protected dataSource: any;
    private style: any;
    private colorMaterial: any;
    private entity: any;

    constructor(protected layer: Layer) {
    }    
    
    setViewerStyle(style: LayerViewerStyle) {
        throw new Error("Method not implemented.");
    }
    getViewerStyle() {
        throw new Error("Method not implemented.");
    }

    setOpacity(v: number): void {
        
        if(!this.entity) {
            return;
        }

        const polygon = this.entity.polygon;
        if (polygon) {            
            polygon.material = Cesium.Color.fromBytes(255, 255, 0, Math.round(v * 255));            
        }
    }

    isVisible(): boolean {
        return this.dataSource.show;
    }

    show(v: boolean): void {
        this.dataSource.show = v;
    }

    async add(viewer: CesiumViewer) {
        if (!(<any>viewer.dataSources).contains(this.dataSource)) {
            await this.createDataSource();
            viewer.dataSources.add(this.dataSource);
        }
    }
    remove(viewer: CesiumViewer): void {
        (<any>viewer.dataSources).remove(this.dataSource);
    }

    zoomTo(viewer: CesiumViewer, id: IndexType, offset?: CesiumHeadingPitchRange): void {
        const entity = this.dataSource.entities.getById(id);
        viewer.zoomTo(entity, offset);        
    }

    update(viewer: CesiumViewer, layer: Layer) {
        if (this.dataSource) {
            this.remove(viewer);
        }
        this.layer = layer;
        this.add(viewer);
    }

    private async createDataSource() {
        this.dataSource = await Cesium.GeoJsonDataSource.load(this.layer.options.data, { credit: "Codeffekt" });
        this.entity = this.dataSource.entities.getById(this.layer.id);
        this.setOpacity(this.layer.opacity);
        this.show(this.layer.visibility);
    }    
}