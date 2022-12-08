import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './materials/material.module';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from './sidebar/sidebar.component';
import { CreateproductComponent } from './createproduct/createproduct.component';
import { HeaderComponent } from './header/header.component';
import { ShareddropService } from './services/shareddrop.service';
import { EditproductComponent } from './editproduct/editproduct.component';
import { StoreModule } from '@ngrx/store';
import { TargetListReducer } from './store/reducers/targetlist.reducer';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    CreateproductComponent,
    HeaderComponent,
    EditproductComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule, 
    StoreModule.forRoot({
      tgtdplist: TargetListReducer,
    })
  ],
  providers: [ShareddropService],
  bootstrap: [AppComponent],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
