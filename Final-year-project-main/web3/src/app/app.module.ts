import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LandingpageComponent } from './landingpage/landingpage.component';
import { SignupComponent } from './signup/signup.component';
import { MatNativeDateModule } from '@angular/material/core';
import { NextstepComponent } from './signup/nextstep/nextstep.component';
import { ConnectComponent } from './signup/connect/connect.component';
import { SigninComponent } from './signin/signin.component';
import { HomeComponent } from './home/home.component';
import { ResetpasswordComponent } from './signin/resetpassword/resetpassword.component';
import { AuthHomeGuard } from './guards/auth-home.guard';
import {MaterialModule} from './Shared/material/material.module';
import { NavComponent } from './home/nav/nav.component';
import { DashboardComponent } from './home/dashboard/dashboard.component';
import { TransferassetComponent } from './home/transferasset/transferasset.component';
import { HistoryComponent } from './home/history/history.component';
import { StatusComponent } from './home/status/status.component';
import { ContactsComponent } from './home/contacts/contacts.component';
import { NewcontactComponent } from './home/contacts/newcontact/newcontact.component';
import { ViewcontactComponent } from './home/contacts/viewcontact/viewcontact.component';
import { EditcontactComponent } from './home/contacts/editcontact/editcontact.component';
import { ConfirmationComponent } from './home/nav/confirmation/confirmation.component';
import { AlertComponent } from './home/nav/alert/alert.component';
import { NotificationComponent } from './home/contacts/notification/notification.component';
import { ConfirmInviteComponent } from './home/contacts/notification/confirm-invite/confirm-invite.component';
import { StatuscardComponent } from './home/status/statuscard/statuscard.component';
import { ReinitComponent } from './home/transferasset/reinit/reinit.component';
import { InitsuccessComponent } from './home/transferasset/initsuccess/initsuccess.component';
import { BalanceCheckPipe } from './home/transferasset/BalanceCheckPipe';
import { MatTableExporterModule } from 'mat-table-exporter';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TopBarComponent } from './home/top-bar/top-bar.component';
import { NumberCardsComponent } from './home/dashboard/number-cards/number-cards.component';
import { PieComponent } from './home/dashboard/pie/pie.component';
import { NumcardComponent } from './home/dashboard/number-cards/numcard/numcard.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ProfileComponent } from './home/profile/profile.component';
@NgModule({
  declarations: [
    AppComponent,
    LandingpageComponent,
    SignupComponent,
    NextstepComponent,
    ConnectComponent,
    SigninComponent,
    HomeComponent,
    ResetpasswordComponent,
    NavComponent,
    DashboardComponent,
    TransferassetComponent,
    HistoryComponent,
    StatusComponent,
    ContactsComponent,
    NewcontactComponent,
    ViewcontactComponent,
    EditcontactComponent,
    ConfirmationComponent,
    AlertComponent,
    NotificationComponent,
    ConfirmInviteComponent,
    StatuscardComponent,
    ReinitComponent,
    InitsuccessComponent,
    TopBarComponent,
    NumberCardsComponent,
    PieComponent,
    NumcardComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MaterialModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatTableExporterModule,
    MatSelectModule,
    MatFormFieldModule,
    NgxChartsModule
  ],
  providers: [AuthHomeGuard],
  bootstrap: [AppComponent],
  entryComponents:[ResetpasswordComponent]
})
export class AppModule { }
