import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CesiumMapComponent } from './cesium-map/cesium-map.component';
import { MapPanelComponent } from './map-panel/map-panel.component';
import { ceCesiumConfig, CesiumModuleConfig, CE_CESIUM_CONFIG } from './models/core.model';
import { MapPanelListComponent } from './map-panel-list/map-panel-list.component';
import { MapPanelBodyComponent } from './map-panel/map-panel-body/map-panel-body.component';
import { MapPanelActionsComponent } from './map-panel/map-panel-actions/map-panel-actions.component';
import { MapPanelHeaderComponent } from './map-panel/map-panel-header/map-panel-header.component';
import {
    WidgetControlButtonsItemComponent,
    WidgetControlButtonsComponent,
    WidgetControlButtonComponent
} from './controls/widget-control-buttons/widget-control-buttons.component';
import { MatButtonModule } from '@angular/material/button';
import { SettingsSectionComponent } from './controls/settings/settings-section/settings-section.component';
import { SettingsEntryLabelComponent } from './controls/settings/settings-entry-label/settings-entry-label.component';
import { SettingsEntryComponent } from './controls/settings/settings-entry/settings-entry.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CesiumButtonComponent } from './controls/button/cesium-button.component';
import { CesiumDrawingControlsComponent } from './cesium-map/cesium-drawing-controls/cesium-drawing-controls.component';
import { CesiumPolygonActionsCardComponent } from './cesium-map/polygon/polygon-actions-card/polygon-actions-card.component';

@NgModule({
    declarations: [
        CesiumMapComponent,
        CesiumButtonComponent,
        MapPanelComponent,
        MapPanelListComponent,
        MapPanelBodyComponent,
        MapPanelActionsComponent,
        MapPanelHeaderComponent,
        WidgetControlButtonsItemComponent,
        WidgetControlButtonsComponent,
        WidgetControlButtonComponent,
        SettingsSectionComponent,
        SettingsEntryLabelComponent,
        SettingsEntryComponent,
        CesiumDrawingControlsComponent,
        CesiumPolygonActionsCardComponent
    ],
    imports: [
        MatIconModule,
        CommonModule,
        MatButtonModule,
        MatTooltipModule
    ],
    exports: [
        CesiumMapComponent,
        CesiumButtonComponent,
        MapPanelComponent,
        MapPanelListComponent,
        MapPanelBodyComponent,
        MapPanelActionsComponent,
        MapPanelHeaderComponent,
        WidgetControlButtonsItemComponent,
        WidgetControlButtonsComponent,
        WidgetControlButtonComponent,
        SettingsSectionComponent,
        SettingsEntryLabelComponent,
        SettingsEntryComponent,
    ]
})
export class CesiumModule {
    static forRoot(config: CesiumModuleConfig = ceCesiumConfig): ModuleWithProviders<CesiumModule> {
        return {
            ngModule: CesiumModule,
            providers: [
                {
                    provide: CE_CESIUM_CONFIG,
                    useValue: config
                }
            ]
        };
    }
}
