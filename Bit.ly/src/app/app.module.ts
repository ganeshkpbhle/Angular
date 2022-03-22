import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule,FormsModule } from "@angular/forms";
import {MatNativeDateModule} from '@angular/material/core';
import { MaterialsModule } from './materials/materials.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { SiteComponent } from './site/site.component';
import { HttpClientModule } from "@angular/common/http";
import { HomeComponent } from './home/home.component';
import { NavComponent } from './home/nav/nav.component';
import { DashboardComponent } from './home/dashboard/dashboard.component';
import { HistoryComponent } from './home/history/history.component';
import { ProfileComponent } from './home/profile/profile.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { HistlistComponent } from './home/history/histlist/histlist.component';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    SiteComponent,
    HomeComponent,
    NavComponent,
    DashboardComponent,
    HistoryComponent,
    ProfileComponent,
    HistlistComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    NgxChartsModule,
    BrowserAnimationsModule,
    MaterialsModule,
    MatNativeDateModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
