import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HistoryComponent } from './history/history.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { RegisterComponent } from './register/register.component';
import { SiteComponent } from './site/site.component';

const routes: Routes = [
  {
    path:'',component:SiteComponent
  },
  {
    path:'login',component:LoginComponent
  },
  {
    path:'register',component:RegisterComponent
  },
  {
    path:'home',component:HomeComponent,
    children:[
      {
        path:'',redirectTo:'dash',pathMatch:'full'
      },
      {
        path:'dash',component:DashboardComponent
      },
      {
        path:'history',component:HistoryComponent
      },
      {
        path:'profile',component:ProfileComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
