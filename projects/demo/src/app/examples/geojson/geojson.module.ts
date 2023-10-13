import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CesiumModule } from '@codeffekt/ce-ng-cesium';
import { GeojsonRoutingModule } from './geojson-routing.module';
import { GeojsonComponent } from './geojson.component';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { environment } from '../../../environments/environment';


@NgModule({
  declarations: [
    GeojsonComponent
  ],
  imports: [
    CommonModule,
    CesiumModule.forRoot(environment.cesiumConfig),
    MatButtonModule,
    MatSelectModule,
    FormsModule,
    MatFormFieldModule,
    GeojsonRoutingModule
  ]
})
export class GeojsonModule { }
