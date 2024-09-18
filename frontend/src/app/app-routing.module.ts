import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LegajoComponent } from './legajo/legajo.component';

const routes: Routes = [
  // { path: '', component: LegajoComponent },
  { path: ':entity', component: LegajoComponent },
  { path: '', redirectTo: '/legajo', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
