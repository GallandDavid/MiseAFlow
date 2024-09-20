import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component'; 
import { HomeComponent } from './home/home.component';
import { TopNavBarComponent } from './top-nav-bar/top-nav-bar.component';

export const routes: Routes = [
  // Autres routes...
  {
    path: '',
    component: AppComponent,
    children: [
      { path: '', redirectTo: 'Home', pathMatch: 'full' },
      { path: 'Home', component: HomeComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }