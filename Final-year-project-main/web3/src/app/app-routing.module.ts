import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthHomeGuard } from './guards/auth-home.guard';
import { AuthSignUpGuard } from './guards/auth-sign-up.guard';
import { ContactsComponent } from './home/contacts/contacts.component';
import { DashboardComponent } from './home/dashboard/dashboard.component';
import { HistoryComponent } from './home/history/history.component';
import { HomeComponent } from './home/home.component';
import { StatusComponent } from './home/status/status.component';
import { TransferassetComponent } from './home/transferasset/transferasset.component';
import { LandingpageComponent } from './landingpage/landingpage.component';
import { ResetpasswordComponent } from './signin/resetpassword/resetpassword.component';
import { SigninComponent } from './signin/signin.component';
import { ConnectComponent } from './signup/connect/connect.component';
import { NextstepComponent } from './signup/nextstep/nextstep.component';
import { SignupComponent } from './signup/signup.component';
import { ProfileComponent } from './home/profile/profile.component';

const routes: Routes = [
  { path: '', component: LandingpageComponent },
  { path: 'signin', component: SigninComponent
  },
  {
    path: 'signup', component: SignupComponent,
    children: [
      {
        path:'',redirectTo:'connect',pathMatch:'full'
      },
      {
        path: 'connect', component: ConnectComponent
      },
      {
        path: 'nextstep', component: NextstepComponent
        ,canActivate:[AuthSignUpGuard]
      }
    ]
  },
  {
    path:'home',component:HomeComponent
    ,canActivate:[AuthHomeGuard],
    children:[
      {
        path:'',redirectTo:'dash',pathMatch:'full',canActivateChild:[AuthHomeGuard]
      },
      {
        path:'dash',component:DashboardComponent,canActivateChild:[AuthHomeGuard]
      },
      {
        path:'transfer',component:TransferassetComponent,canActivateChild:[AuthHomeGuard]
      },
      {
        path:'history',component:HistoryComponent,canActivateChild:[AuthHomeGuard]
      },
      {
        path:'stats',component:StatusComponent,canActivateChild:[AuthHomeGuard]
      },
      {
        path:'friends',component:ContactsComponent,canActivateChild:[AuthHomeGuard]
      },
      {
        path:'Profile',component: ProfileComponent,canActivateChild:[AuthHomeGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
