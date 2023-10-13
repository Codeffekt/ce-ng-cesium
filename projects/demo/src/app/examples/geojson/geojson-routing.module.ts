import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GeojsonComponent } from './geojson.component';

const routes: Routes = [{ path: '', component: GeojsonComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GeojsonRoutingModule { }
