import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CesiumModule } from '@codeffekt/ce-ng-cesium';
import { SimpleMapRoutingModule } from './simple-map-routing.module';
import { SimpleMapExampleConponent } from './simple-map.component';
import { environment } from '../../../environments/environment';

@NgModule({
  declarations: [
    SimpleMapExampleConponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    CesiumModule.forRoot(environment.cesiumConfig),
    MatSlideToggleModule,
    SimpleMapRoutingModule,
  ],
  exports: [
    SimpleMapExampleConponent
  ]
})
export class SimpleMapModule { }
