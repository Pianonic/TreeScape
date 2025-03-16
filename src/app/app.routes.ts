import { Routes } from '@angular/router';
import { DiagrammComponent } from './diagramm/diagramm.component';
import { NotFoundComponent } from './not-found/not-found.component';

export const routes: Routes = [
    { path: 'plan/:file', component: DiagrammComponent } ,
    { path: '**', component: NotFoundComponent}
  ];