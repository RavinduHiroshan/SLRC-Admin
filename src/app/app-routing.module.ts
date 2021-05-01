import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './shared/guard/auth.guard';
import { SigninComponent } from './signin/signin.component';
import { UniversityComponent } from './university/university.component';

const routes: Routes = [
  {
    path: '', 
    redirectTo: 'signIn', pathMatch: 'full'
    
  },
  {
    path: 'dashboard',
    component:DashboardComponent,canActivate: [AuthGuard]
  },
  {
    path: 'signIn',
    component:SigninComponent
  },
  {
    path: 'university',
    component:UniversityComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
