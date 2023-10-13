import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SimpleMapExampleConponent } from './simple-map.component';

const routes: Routes = [
  {
    path: '',
    component: SimpleMapExampleConponent
  },

];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class SimpleMapRoutingModule { }
