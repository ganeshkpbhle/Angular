import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './home/dashboard/dashboard.component';
import { HistoryComponent } from './home/history/history.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './home/profile/profile.component';
import { RegisterComponent } from './register/register.component';
import { SiteComponent } from './site/site.component';
import { HistlistComponent } from './home/history/histlist/histlist.component';

const routes: Routes = [
  {
    path: '', component: SiteComponent
  },
  {
    path: 'login', component: LoginComponent
  },
  {
    path: 'register', component: RegisterComponent
  },
  {
    path: 'home', component: HomeComponent,
    children: [
      {
        path: '', redirectTo: 'dash', pathMatch: 'full'
      },
      {
        path: 'dash', component: DashboardComponent
      },
      {
        path: 'history', component: HistoryComponent
      },
      {
        path: 'history/:month', component: HistlistComponent,pathMatch:'full'
      },
      {
        path: 'profile', component: ProfileComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
