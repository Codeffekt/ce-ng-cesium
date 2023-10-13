import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'simple-map',
    loadChildren: () => import('./simple-map/simple-map.module').then(m => m.SimpleMapModule),
  },
  {
    path: 'drawing',
    loadChildren: () => import('./drawing/drawing.module').then(m => m.DrawingModule),
  },
  {
    path: 'geojson',
    loadChildren: () => import('./geojson/geojson.module').then(m => m.GeojsonModule)
  },
  {
    path: '',
    redirectTo: 'simple-map',
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class ExamplesRoutingModule { }
