import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DrawingExampleComponent } from './drawing.component';

const routes: Routes = [
  {
    path: '',
    component: DrawingExampleComponent
  },

];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class DrawingRoutingModule { }
