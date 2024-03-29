import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './materials/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SidebarComponent } from './sidebar/sidebar.component';
import { CreateproductComponent } from './createproduct/createproduct.component';
import { HeaderComponent } from './header/header.component';
import { ShareddropService } from './services/shareddrop.service';
import { EditproductComponent } from './editproduct/editproduct.component';
import { EntityDialogComponent } from './Dialog/entity-dialog/entity-dialog.component';
import { MatFormField } from '@angular/material/form-field';
import { Ng5SliderModule } from 'ng5-slider';
import { DroplistsPipe, MetaInfoPipe } from './shared/pipes/create-product/droplists.pipe';
import { CheckOptionsPipe, InputOptionsPipe,RadioOptionsPipe, SelectOptionsPipe, SilderDescPipe, TabDescPipe } from './shared/pipes/dialog-pipes/dialoginput.pipe';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    CreateproductComponent,
    HeaderComponent,
    EditproductComponent,
    EntityDialogComponent,
    DroplistsPipe,
    MetaInfoPipe,
    InputOptionsPipe,
    CheckOptionsPipe,
    SelectOptionsPipe,
    RadioOptionsPipe,
    SilderDescPipe,
    TabDescPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    Ng5SliderModule
  ],
  providers: [ShareddropService],
  bootstrap: [AppComponent],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
