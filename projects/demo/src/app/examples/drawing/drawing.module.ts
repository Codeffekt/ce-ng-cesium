import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CesiumModule } from '@codeffekt/ce-ng-cesium';
import { DrawingRoutingModule } from './drawing-routing.module';
import { DrawingExampleComponent } from './drawing.component';
import { environment } from '../../../environments/environment';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@NgModule({
  declarations: [
    DrawingExampleComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    CesiumModule.forRoot(environment.cesiumConfig),
    MatSlideToggleModule,
    DrawingRoutingModule,
  ]
})
export class DrawingModule { }
